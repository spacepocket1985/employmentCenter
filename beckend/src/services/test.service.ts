// Service level (Business Logic Layer):
// Description: Implements the logic for working with test data.
// Поддерживает интерпретации по шкалам и логирование результатов

import { Test, TestType } from '../models/test.model';
import { TestCreateModel } from '../models/testCreateModel';
import { TestUpdateModel } from '../models/testUpdateModel';
import {
  QuestionReviewType,
  TestSubmissionModel,
} from '../models/testAnswerModel';
import {
  TestSession,
  TestSessionType,
  TestSessionAnswerType,
  TestSessionScaleScoreType,
  TestSessionScaleInterpretationType,
  TestSessionInterpretationType,
  TestSessionTypeEnum,
} from '../models/testSession.model';
import { TestSessionFilterModel } from '../models/testSessionFilterModel';
import { Employee } from '../models/employee.model';
import { Types, FilterQuery } from 'mongoose';

class TestService {
  // ============================================
  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // ============================================

  /**
   * Подготовка детального разбора ответов (только для обучающих тестов)
   */
  private prepareQuestionReviews(
    test: TestType,
    answers: { questionId: string; optionIds: string[] }[]
  ): QuestionReviewType[] {
    return answers.map((answer) => {
      const question = test.questions.find((q) => q.id === answer.questionId);

      if (!question) {
        return {
          questionId: answer.questionId,
          questionText: 'Вопрос не найден',
          userAnswer: '',
          correctAnswer: '',
          isCorrect: false,
        };
      }

      const correctOption = question.options.find(
        (opt) => opt.score === Math.max(...question.options.map((o) => o.score))
      );
      const correctText = correctOption
        ? correctOption.text
        : 'Правильный ответ не найден';

      const userOption = question.options.find((opt) =>
        answer.optionIds.includes(opt.id)
      );
      const userText = userOption ? userOption.text : 'Не выбрано';

      const isCorrect = userOption?.id === correctOption?.id;

      return {
        questionId: question.id,
        questionText: question.text,
        userAnswer: userText,
        correctAnswer: correctText,
        isCorrect,
        explanation: isCorrect
          ? undefined
          : 'Рекомендуется изучить этот вопрос подробнее',
      };
    });
  }

  /**
   * Перемешивание массива (алгоритм Фишера-Йетса)
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // ============================================
  // БАЗОВЫЕ CRUD МЕТОДЫ
  // ============================================

  /**
   * Получение всех активных тестов
   */
  async getAllTests(): Promise<TestType[]> {
    return await Test.find({ isActive: true }).sort('-createdAt');
  }

  /**
   * Получение тестов по категории
   */
  async getTestsByCategory(category: string): Promise<TestType[]> {
    return await Test.find({
      isActive: true,
      $or: [{ category: category }, { category: { $in: [category] } }],
    }).sort('-createdAt');
  }

  /**
   * Получение одного теста по ID с возможностью перемешивания
   */
  async getTestById(
    id: string,
    shuffleOptions: boolean = false
  ): Promise<TestType | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const test = await Test.findOne({ _id: id, isActive: true }).lean();

    if (!test) {
      return null;
    }

    if (!shuffleOptions) {
      return test as TestType;
    }

    let shuffledQuestions = this.shuffleArray(test.questions);

    if (test.randomizeOptions) {
      shuffledQuestions = shuffledQuestions.map((question) => ({
        ...question,
        options: this.shuffleArray(question.options),
      }));
    }

    return {
      ...test,
      questions: shuffledQuestions,
    } as TestType;
  }

  /**
   * Создание нового теста (для администрирования)
   */
  async createTest(testData: TestCreateModel): Promise<TestType> {
    return await Test.create(testData);
  }

  /**
   * Обновление теста (для администрирования)
   */
  async updateTest(
    id: string,
    testData: TestUpdateModel
  ): Promise<TestType | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Test.findByIdAndUpdate(id, testData, { new: true });
  }

  /**
   * Удаление теста (для администрирования)
   */
  async deleteTest(id: string): Promise<TestType | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Test.findByIdAndDelete(id);
  }

  // ============================================
  // МЕТОДЫ ПОДСЧЁТА
  // ============================================

  /**
   * Подсчёт балла для вопроса с учётом реверсивности
   */
  private calculateQuestionScore(
    question: TestType['questions'][0],
    selectedOptionIds: string[]
  ): number {
    let score = question.options
      .filter((option) => selectedOptionIds.includes(option.id))
      .reduce((sum, option) => sum + option.score, 0);

    if (question.isReversed) {
      const maxScore = Math.max(...question.options.map((o) => o.score));
      score = maxScore + 1 - score;
    }

    return score;
  }

  /**
   * Подсчёт результатов по шкалам (для scale_based)
   */
  private calculateScaleScores(
    test: TestType,
    answers: { questionId: string; optionIds: string[] }[]
  ): {
    scaleScores: TestSessionScaleScoreType[];
    totalScore: number;
  } {
    if (!test.scales || test.scales.length === 0) {
      return { scaleScores: [], totalScore: 0 };
    }

    const answerMap = new Map(answers.map((a) => [a.questionId, a.optionIds]));

    const scaleScores = test.scales.map((scale) => {
      let totalScaleScore = 0;
      let maxPossibleScore = 0;

      scale.questionIds.forEach((questionId) => {
        const question = test.questions.find((q) => q.id === questionId);
        if (!question) return;

        const selectedOptions = answerMap.get(questionId) || [];
        const score = this.calculateQuestionScore(question, selectedOptions);
        totalScaleScore += score;

        const maxScore = Math.max(...question.options.map((o) => o.score));
        maxPossibleScore += question.isReversed ? maxScore : maxScore;
      });

      return {
        scaleId: scale.id,
        score: totalScaleScore,
        maxScore: maxPossibleScore,
        percentage: (totalScaleScore / maxPossibleScore) * 100,
      };
    });

    const totalScore = scaleScores.reduce((sum, s) => sum + s.score, 0);

    return { scaleScores, totalScore };
  }

  // ============================================
  // МЕТОДЫ ПОИСКА ИНТЕРПРЕТАЦИЙ
  // ============================================

  /**
   * Поиск интерпретации по баллу
   */
  private findInterpretation(
    interpretations: TestType['interpretations'],
    score: number
  ): TestType['interpretations'][0] {
    const interpretation = interpretations.find(
      (interp) => score >= interp.rangeMin && score <= interp.rangeMax
    );

    if (!interpretation) {
      return (
        interpretations[0] || {
          id: 'default',
          scaleId: undefined,
          rangeMin: 0,
          rangeMax: 100,
          title: 'Результат',
          description: 'Интерпретация не найдена',
        }
      );
    }

    return interpretation;
  }

  /**
   * Поиск интерпретации для конкретной шкалы
   */
  private findScaleInterpretation(
    interpretations: TestType['interpretations'],
    scaleId: string,
    score: number
  ): TestType['interpretations'][0] | null {
    const scaleInterpretations = interpretations.filter(
      (interp) => interp.scaleId === scaleId
    );

    if (scaleInterpretations.length === 0) {
      return null;
    }

    return this.findInterpretation(scaleInterpretations, score);
  }

  // ============================================
  // МЕТОД ЛОГИРОВАНИЯ
  // ============================================

  /**
   * Сохранение сессии теста в БД (логирование результатов)
   * Поддерживает:
   * - registered: сотрудник выбран из списка или найден по ФИО
   * - manual: сотрудник введён вручную, не найден в базе
   * - shouldLog: false — результат не сохраняется (тренировка)
   */
  private async saveTestSession(
    test: TestType,
    submissionData: TestSubmissionModel,
    totalScore: number,
    scaleScores: TestSessionScaleScoreType[] | undefined,
    scaleInterpretations: TestSessionScaleInterpretationType[] | undefined,
    interpretation: TestType['interpretations'][0]
  ): Promise<void> {
    // ============================================
    // ПРОВЕРКА: нужно ли логировать
    // ============================================

    if (submissionData.shouldLog === false) {
      console.log(
        '🔍 Логирование отключено (тренировка) — сессия не сохранена'
      );
      return;
    }

    // ============================================
    // ОПРЕДЕЛЕНИЕ ДАННЫХ СОТРУДНИКА
    // ============================================

    let employeeId: Types.ObjectId | null = null;
    let employeeName: string = submissionData.employeeName || '';
    let employeePosition: string = submissionData.employeePosition || '';
    let employeeDepartment: string = submissionData.employeeDepartment || '';
    let sessionType: TestSessionTypeEnum = 'manual';

    // Вариант 1: Передан employeeId (выбор из списка)
    if (
      submissionData.employeeId &&
      Types.ObjectId.isValid(submissionData.employeeId)
    ) {
      const employee = await Employee.findById(submissionData.employeeId);

      if (employee) {
        // ✅ Явное приведение к Types.ObjectId
        employeeId = new Types.ObjectId(employee._id.toString());
        employeeName = employee.name;
        employeePosition = employee.job;
        employeeDepartment = employee.department;
        sessionType = 'registered';
        console.log('✅ Сотрудник найден по ID:', employeeName);
      }
    }
    // Вариант 2: Передано ФИО (ручной ввод) — ищем в базе
    else if (submissionData.employeeName) {
      const escapedName = submissionData.employeeName.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

      const employee = await Employee.findOne({
        name: { $regex: `^${escapedName}$`, $options: 'i' },
      });

      if (employee) {
        // ✅ Явное приведение к Types.ObjectId
        employeeId = new Types.ObjectId(employee._id.toString());
        employeeName = employee.name;
        employeePosition = employee.job;
        employeeDepartment = employee.department;
        sessionType = 'registered';
        console.log('✅ Сотрудник найден по ФИО:', employeeName);
      } else {
        sessionType = 'manual';
        console.log('⚠️ Сотрудник не найден — manual:', employeeName);
      }
    } else {
      console.log('❌ Нет данных сотрудника — сессия не сохранена');
      return;
    }

    // ============================================
    // ФОРМИРОВАНИЕ ОТВЕТОВ
    // ============================================

    const sessionAnswers: TestSessionAnswerType[] = submissionData.answers.map(
      (answer) => {
        const question = test.questions.find((q) => q.id === answer.questionId);

        if (!question) {
          return {
            questionId: answer.questionId,
            questionText: 'Вопрос не найден',
            questionType: 'single' as const,
            optionIds: answer.optionIds,
            optionTexts: [],
            score: 0,
          };
        }

        const selectedOptions = question.options.filter((opt) =>
          answer.optionIds.includes(opt.id)
        );
        const optionTexts = selectedOptions.map((opt) => opt.text);
        const score = this.calculateQuestionScore(question, answer.optionIds);

        return {
          questionId: question.id,
          questionText: question.text,
          questionType: question.type,
          optionIds: answer.optionIds,
          optionTexts,
          score,
        };
      }
    );

    // ============================================
    // ФОРМИРОВАНИЕ ИНТЕРПРЕТАЦИИ
    // ============================================

    const sessionInterpretation: TestSessionInterpretationType = {
      title: interpretation.title,
      description: interpretation.description,
      recommendations: interpretation.recommendations,
    };

    // ============================================
    // ОПРЕДЕЛЕНИЕ МЕРОПРИЯТИЯ
    // ============================================

    const eventName =
      submissionData.eventName || test.eventName || 'Не указано';
    const eventPlace =
      submissionData.eventPlace || test.eventPlace || 'Не указано';
    const eventDate = submissionData.eventDate
      ? new Date(submissionData.eventDate)
      : test.eventDate || new Date();

    // ============================================
    // СОЗДАНИЕ СЕССИИ
    // ============================================

    await TestSession.create({
      employeeId,
      employeeName,
      employeePosition,
      employeeDepartment,
      testId: test._id,
      testTitle: test.title,
      totalScore,
      scaleScores: scaleScores || [],
      scaleInterpretations: scaleInterpretations || [],
      interpretation: sessionInterpretation,
      answers: sessionAnswers,
      eventName,
      eventDate,
      eventPlace,
      sessionType,
      createdAt: new Date(),
      completedAt: new Date(),
      timeSpent: submissionData.timeSpent,
    });

    console.log('✅ Сессия сохранена:', {
      employeeName,
      sessionType,
      totalScore,
    });
  }

  // ============================================
  // ОСНОВНОЙ МЕТОД ОБРАБОТКИ РЕЗУЛЬТАТОВ
  // ============================================

  /**
   * Обработка результатов теста (с поддержкой интерпретаций по шкалам и логированием)
   */
  async processTestResults(submissionData: TestSubmissionModel): Promise<{
    totalScore: number;
    scaleScores?: {
      scaleId: string;
      score: number;
      maxScore: number;
      percentage: number;
    }[];
    scaleInterpretations?: {
      scaleId: string;
      interpretation: TestType['interpretations'][0];
    }[];
    interpretation: TestType['interpretations'][0];
    questionScores: { questionId: string; score: number; text: string }[];
    questionReviews?: QuestionReviewType[];
  }> {
    // Проверяем валидность ID теста
    if (!Types.ObjectId.isValid(submissionData.testId)) {
      throw new Error('Invalid test ID');
    }

    // Находим тест
    const test = await Test.findById(submissionData.testId);
    if (!test) {
      throw new Error('Test not found');
    }

    // Проверяем, что все обязательные вопросы отвечены
    if (test.requireAllQuestions) {
      const answeredQuestionIds = submissionData.answers.map(
        (a) => a.questionId
      );
      const allQuestionsAnswered = test.questions
        .filter((q) => q.required)
        .every((q) => answeredQuestionIds.includes(q.id));

      if (!allQuestionsAnswered) {
        throw new Error('Not all required questions are answered');
      }
    }

    // Формируем результаты по вопросам
    const questionScores = submissionData.answers.map((answer) => {
      const question = test.questions.find((q) => q.id === answer.questionId);
      if (!question) {
        return {
          questionId: answer.questionId,
          score: 0,
          text: 'Вопрос не найден',
        };
      }

      const score = this.calculateQuestionScore(question, answer.optionIds);

      return { questionId: answer.questionId, score, text: question.text };
    });

    let totalScore: number;
    let scaleScores:
      | {
          scaleId: string;
          score: number;
          maxScore: number;
          percentage: number;
        }[]
      | undefined;

    // В зависимости от метода подсчёта
    if (
      test.scoringMethod === 'scale_based' &&
      test.scales &&
      test.scales.length > 0
    ) {
      const result = this.calculateScaleScores(test, submissionData.answers);
      totalScore = result.totalScore;
      scaleScores = result.scaleScores;
    } else {
      const total = questionScores.reduce((sum, q) => sum + q.score, 0);
      totalScore =
        test.scoringMethod === 'average'
          ? total / test.questions.length
          : total;
    }

    // ============================================
    // Интерпретации по шкалам
    // ============================================

    let scaleInterpretations:
      | {
          scaleId: string;
          interpretation: TestType['interpretations'][0];
        }[]
      | undefined = undefined;

    if (test.scales && test.scales.length > 0 && scaleScores) {
      const hasScaleInterpretations = test.interpretations.some(
        (interp) => interp.scaleId !== undefined
      );

      if (hasScaleInterpretations) {
        scaleInterpretations = test.scales.map((scale) => {
          const scaleScore = scaleScores.find((s) => s.scaleId === scale.id);
          const score = scaleScore?.score || 0;

          const interpretation = this.findScaleInterpretation(
            test.interpretations,
            scale.id,
            score
          );

          return {
            scaleId: scale.id,
            interpretation: interpretation || {
              id: 'default',
              scaleId: scale.id,
              rangeMin: 0,
              rangeMax: 100,
              title: 'Нет интерпретации',
              description: 'Интерпретация для этой шкалы не найдена',
              recommendations: [],
            },
          };
        });
      }
    }

    // Находим общую интерпретацию
    const overallInterpretations = test.interpretations.filter(
      (interp) => interp.scaleId === undefined
    );

    const interpretation =
      overallInterpretations.length > 0
        ? this.findInterpretation(overallInterpretations, totalScore)
        : this.findInterpretation(test.interpretations, totalScore);

    // ============================================
    // ЛОГИРОВАНИЕ РЕЗУЛЬТАТОВ
    // ============================================

    if (test.logResults) {
      await this.saveTestSession(
        test,
        submissionData,
        totalScore,
        scaleScores,
        scaleInterpretations,
        interpretation
      );
    }

    // Подготавливаем разбор ответов (только для обучающих тестов)
    let questionReviews: QuestionReviewType[] | undefined = undefined;
    if (test.showCorrectAnswers) {
      questionReviews = this.prepareQuestionReviews(
        test,
        submissionData.answers
      );
    }

    return {
      totalScore,
      scaleScores,
      scaleInterpretations,
      interpretation,
      questionScores,
      questionReviews,
    };
  }

  // ============================================
  // МЕТОДЫ ПРОСМОТРА РЕЗУЛЬТАТОВ (АДМИНКА)
  // ============================================

  /**
   * Получение логированных сессий тестов с фильтрацией
   */
  async getTestSessions(filters: TestSessionFilterModel): Promise<{
    sessions: TestSessionType[];
    total: number;
    limit: number;
    skip: number;
  }> {
    const query: FilterQuery<TestSessionType> = {};

    if (filters.employeeId) {
      if (Types.ObjectId.isValid(filters.employeeId)) {
        query.employeeId = new Types.ObjectId(filters.employeeId);
      }
    }

    if (filters.employeeName) {
      query.employeeName = { $regex: filters.employeeName, $options: 'i' };
    }

    if (filters.employeeDepartment) {
      query.employeeDepartment = filters.employeeDepartment;
    }

    if (filters.testId) {
      if (Types.ObjectId.isValid(filters.testId)) {
        query.testId = new Types.ObjectId(filters.testId);
      }
    }

    if (filters.eventName) {
      query.eventName = { $regex: filters.eventName, $options: 'i' };
    }

    if (filters.eventDateFrom || filters.eventDateTo) {
      query.eventDate = {};
      if (filters.eventDateFrom) {
        query.eventDate.$gte = new Date(filters.eventDateFrom);
      }
      if (filters.eventDateTo) {
        query.eventDate.$lte = new Date(filters.eventDateTo);
      }
    }

    if (filters.completedAtFrom || filters.completedAtTo) {
      query.completedAt = {};
      if (filters.completedAtFrom) {
        query.completedAt.$gte = new Date(filters.completedAtFrom);
      }
      if (filters.completedAtTo) {
        query.completedAt.$lte = new Date(filters.completedAtTo);
      }
    }

    // Фильтр по типу сессии
    if (filters.sessionType) {
      query.sessionType = filters.sessionType;
    }

    const limit = filters.limit && filters.limit > 0 ? filters.limit : 100;
    const skip = filters.skip && filters.skip > 0 ? filters.skip : 0;
    const sortOrder = filters.sort === 'asc' ? 1 : -1;

    const [sessions, total] = await Promise.all([
      TestSession.find(query)
        .sort({ completedAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      TestSession.countDocuments(query),
    ]);

    return {
      sessions: sessions as TestSessionType[],
      total,
      limit,
      skip,
    };
  }

  /**
   * Получение одной сессии теста по ID
   */
  async getTestSessionById(id: string): Promise<TestSessionType | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return (await TestSession.findById(id).lean()) as TestSessionType | null;
  }

  /**
   * Получение всех сессий конкретного сотрудника
   */
  async getTestSessionsByEmployee(
    employeeId: string
  ): Promise<TestSessionType[]> {
    if (!Types.ObjectId.isValid(employeeId)) {
      return [];
    }

    return (await TestSession.find({
      employeeId: new Types.ObjectId(employeeId),
    })
      .sort({ completedAt: -1 })
      .lean()) as TestSessionType[];
  }

  /**
   * Получение всех сессий по конкретному тесту
   */
  async getTestSessionsByTest(testId: string): Promise<TestSessionType[]> {
    if (!Types.ObjectId.isValid(testId)) {
      return [];
    }

    return (await TestSession.find({
      testId: new Types.ObjectId(testId),
    })
      .sort({ completedAt: -1 })
      .lean()) as TestSessionType[];
  }

  /**
   * Получение статистики по сессиям (средний балл, количество)
   */
  async getTestSessionsStats(filters: TestSessionFilterModel): Promise<{
    total: number;
    averageScore: number;
    maxScore: number;
    minScore: number;
  }> {
    const query: FilterQuery<TestSessionType> = {};

    if (filters.testId && Types.ObjectId.isValid(filters.testId)) {
      query.testId = new Types.ObjectId(filters.testId);
    }

    if (filters.eventName) {
      query.eventName = { $regex: filters.eventName, $options: 'i' };
    }

    if (filters.employeeDepartment) {
      query.employeeDepartment = filters.employeeDepartment;
    }

    if (filters.sessionType) {
      query.sessionType = filters.sessionType;
    }

    const stats = await TestSession.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          averageScore: { $avg: '$totalScore' },
          maxScore: { $max: '$totalScore' },
          minScore: { $min: '$totalScore' },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        total: 0,
        averageScore: 0,
        maxScore: 0,
        minScore: 0,
      };
    }

    return {
      total: stats[0].total,
      averageScore: Math.round(stats[0].averageScore * 100) / 100,
      maxScore: stats[0].maxScore,
      minScore: stats[0].minScore,
    };
  }
}

export const testService = new TestService();
