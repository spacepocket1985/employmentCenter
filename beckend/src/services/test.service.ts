// Service level (Business Logic Layer):
// Description: Implements the logic for working with test data.

import { Test, TestType } from '../models/test.model';
import { TestCreateModel } from '../models/testCreateModel';
import { TestUpdateModel } from '../models/testUpdateModel';
import { TestSubmissionModel } from '../models/testAnswerModel';
import { Types } from 'mongoose';

class TestService {
  // Получение всех активных тестов
  async getAllTests(): Promise<TestType[]> {
    return await Test.find({ isActive: true }).sort('-createdAt');
  }

  // Получение тестов по категории
  async getTestsByCategory(category: string): Promise<TestType[]> {
    return await Test.find({
      isActive: true,
      $or: [{ category: category }, { category: { $in: [category] } }],
    }).sort('-createdAt');
  }

  // Получение одного теста по ID
  async getTestById(id: string): Promise<TestType | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Test.findOne({ _id: id, isActive: true });
  }

  // Создание нового теста (для администрирования)
  async createTest(testData: TestCreateModel): Promise<TestType> {
    return await Test.create(testData);
  }

  // Обновление теста (для администрирования)
  async updateTest(id: string, testData: TestUpdateModel): Promise<TestType | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Test.findByIdAndUpdate(id, testData, { new: true });
  }

  // Удаление теста (для администрирования)
  async deleteTest(id: string): Promise<TestType | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Test.findByIdAndDelete(id);
  }

  // Подсчёт балла для вопроса с учётом реверсивности
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
      // Для шкалы 1-6: инверсия (maxScore + 1 - score)
      const maxScore = Math.max(...question.options.map((o) => o.score));
      score = maxScore + 1 - score;
    }

    return score;
  }

  // Подсчёт результатов по шкалам (для scale_based)
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
    // Если нет шкал, возвращаем пустой результат
    if (!test.scales || test.scales.length === 0) {
      return { scaleScores: [], totalScore: 0 };
    }

    // Группируем ответы по вопросам
    const answerMap = new Map(answers.map((a) => [a.questionId, a.optionIds]));

    // Считаем баллы по каждой шкале
    const scaleScores = test.scales.map((scale) => {
      let totalScaleScore = 0;
      let maxPossibleScore = 0;

      scale.questionIds.forEach((questionId) => {
        const question = test.questions.find((q) => q.id === questionId);
        if (!question) return;

        const selectedOptions = answerMap.get(questionId) || [];
        const score = this.calculateQuestionScore(question, selectedOptions);
        totalScaleScore += score;

        // Максимальный балл для вопроса
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

    // Общий балл (сумма по всем шкалам)
    const totalScore = scaleScores.reduce((sum, s) => sum + s.score, 0);

    return { scaleScores, totalScore };
  }

  // Обработка результатов теста
  async processTestResults(submissionData: TestSubmissionModel): Promise<{
    totalScore: number;
    scaleScores?: {
      scaleId: string;
      score: number;
      maxScore: number;
      percentage: number;
    }[];
    interpretation: TestType['interpretations'][0];
    questionScores: { questionId: string; score: number; text: string }[];
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
      const answeredQuestionIds = submissionData.answers.map((a) => a.questionId);
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
    if (test.scoringMethod === 'scale_based' && test.scales && test.scales.length > 0) {
      // Многошкальный подсчёт
      const result = this.calculateScaleScores(test, submissionData.answers);
      totalScore = result.totalScore;
      scaleScores = result.scaleScores;
    } else {
      // Простой подсчёт (sum или average)
      const total = questionScores.reduce((sum, q) => sum + q.score, 0);
      totalScore = test.scoringMethod === 'average' ? total / test.questions.length : total;
    }

    // Находим интерпретацию
    const interpretation = this.findInterpretation(test.interpretations, totalScore);

    return {
      totalScore,
      scaleScores,
      interpretation,
      questionScores,
    };
  }

  // Поиск интерпретации по баллу
  private findInterpretation(
    interpretations: TestType['interpretations'],
    score: number
  ): TestType['interpretations'][0] {
    const interpretation = interpretations.find(
      (interp) => score >= interp.rangeMin && score <= interp.rangeMax
    );

    if (!interpretation) {
      return interpretations[0] || {
        id: 'default',
        rangeMin: 0,
        rangeMax: 100,
        title: 'Результат',
        description: 'Интерпретация не найдена',
      };
    }

    return interpretation;
  }
}

export const testService = new TestService();