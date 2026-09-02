// Service level (Business Logic Layer):
// Description: Implements the logic for working with test data.
// Поддерживает интерпретации по шкалам (для DASS-21 и подобных тестов)

import { Test, TestType } from '../models/test.model';
import { TestCreateModel } from '../models/testCreateModel';
import { TestUpdateModel } from '../models/testUpdateModel';
import {
  QuestionReviewType,
  TestSubmissionModel,
} from '../models/testAnswerModel';
import { Types } from 'mongoose';

class TestService {
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

      // Находим правильный ответ (вариант с максимальным баллом)
      const correctOption = question.options.find(
        (opt) => opt.score === Math.max(...question.options.map((o) => o.score))
      );
      const correctText = correctOption
        ? correctOption.text
        : 'Правильный ответ не найден';

      // Находим ответ пользователя
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
   * @param id - ID теста
   * @param shuffleOptions - перемешивать ли вопросы и ответы
   */
  async getTestById(id: string, shuffleOptions: boolean = false): Promise<TestType | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const test = await Test.findOne({ _id: id, isActive: true }).lean();

    if (!test) {
      return null;
    }

    // Если не нужно перемешивать, возвращаем как есть
    if (!shuffleOptions) {
      return test as TestType;
    }

    // Перемешиваем вопросы
    let shuffledQuestions = this.shuffleArray(test.questions);

    // Если нужно перемешивать варианты ответов
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
    // Суммируем баллы выбранных вариантов
    let score = question.options
      .filter((option) => selectedOptionIds.includes(option.id))
      .reduce((sum, option) => sum + option.score, 0);

    // Если вопрос обратный, инвертируем балл
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
    scaleScores: {
      scaleId: string;
      score: number;
      maxScore: number;
      percentage: number;
    }[];
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
   * @param interpretations - Все интерпретации теста
   * @param scaleId - ID шкалы
   * @param score - Балл по шкале
   * @returns Интерпретация для шкалы или null
   */
  private findScaleInterpretation(
    interpretations: TestType['interpretations'],
    scaleId: string,
    score: number
  ): TestType['interpretations'][0] | null {
    // Фильтруем интерпретации, привязанные к этой шкале
    const scaleInterpretations = interpretations.filter(
      (interp) => interp.scaleId === scaleId
    );

    // Если нет интерпретаций для этой шкалы, возвращаем null
    if (scaleInterpretations.length === 0) {
      return null;
    }

    // Ищем интерпретацию по диапазону баллов
    return this.findInterpretation(scaleInterpretations, score);
  }

  // ============================================
  // ОСНОВНОЙ МЕТОД ОБРАБОТКИ РЕЗУЛЬТАТОВ
  // ============================================

  /**
   * Обработка результатов теста (с поддержкой интерпретаций по шкалам)
   * Для DASS-21 и подобных тестов возвращает интерпретации для каждой шкалы
   */
  async processTestResults(submissionData: TestSubmissionModel): Promise<{
    totalScore: number;
    scaleScores?: {
      scaleId: string;
      score: number;
      maxScore: number;
      percentage: number;
    }[];
    /** Интерпретации для каждой шкалы (для DASS-21 и подобных) */
    scaleInterpretations?: {
      scaleId: string;
      interpretation: TestType['interpretations'][0];
    }[];
    /** Общая интерпретация (по totalScore) */
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
    // НОВАЯ ЛОГИКА: Интерпретации по шкалам
    // Для DASS-21 и подобных тестов
    // ============================================

    let scaleInterpretations:
      | {
          scaleId: string;
          interpretation: TestType['interpretations'][0];
        }[]
      | undefined = undefined;

    // Если есть шкалы и интерпретации с scaleId
    if (test.scales && test.scales.length > 0 && scaleScores) {
      // Проверяем, есть ли интерпретации с scaleId
      const hasScaleInterpretations = test.interpretations.some(
        (interp) => interp.scaleId !== undefined
      );

      if (hasScaleInterpretations) {
        scaleInterpretations = test.scales.map((scale) => {
          const scaleScore = scaleScores.find(
            (s) => s.scaleId === scale.id
          );
          const score = scaleScore?.score || 0;

          const interpretation = this.findScaleInterpretation(
            test.interpretations,
            scale.id,
            score
          );

          return {
            scaleId: scale.id,
            interpretation:
              interpretation || {
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

    // Находим общую интерпретацию (только интерпретации без scaleId)
    const overallInterpretations = test.interpretations.filter(
      (interp) => interp.scaleId === undefined
    );

    // Если есть интерпретации без scaleId, используем их
    // Иначе используем первую интерпретацию (для обратной совместимости)
    const interpretation = overallInterpretations.length > 0
      ? this.findInterpretation(overallInterpretations, totalScore)
      : this.findInterpretation(test.interpretations, totalScore);

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
}

export const testService = new TestService();