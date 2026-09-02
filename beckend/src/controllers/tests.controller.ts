// Controller Layer (Presentation Layer):
// Description: Processes requests and interacts with the service to manage tests

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TestType } from '../models/test.model';
import { TestCreateModel } from '../models/testCreateModel';
import { TestUpdateModel } from '../models/testUpdateModel';
import { TestSubmissionModel } from '../models/testAnswerModel';
import { ViewModel } from '../models/viewModel';
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from '../types/types';
import { testService } from '../services/test.service';

class TestController {
  // Получение всех тестов
  async getAllTests(
    req: Request,
    res: Response<ViewModel<TestType[]>>
  ): Promise<void> {
    const tests = await testService.getAllTests();
    res
      .status(StatusCodes.OK)
      .json({ data: tests, msg: 'All tests have been fetched!' });
  }

  // Получение тестов по категории
  async getTestsByCategory(
    req: RequestWithParams<{ category: string }>,
    res: Response<ViewModel<TestType[]>>
  ): Promise<void> {
    const { category } = req.params;
    const tests = await testService.getTestsByCategory(category);
    res
      .status(StatusCodes.OK)
      .json({
        data: tests,
        msg: `Tests for category "${category}" have been fetched!`,
      });
  }

  /**
   * Получение одного теста по ID с поддержкой перемешивания
   * GET /tests/:id?shuffleOptions=true
   */
  async getTestById(
    req: RequestWithParams<{ id: string }> &
      RequestWithQuery<{ shuffleOptions?: string }>,
    res: Response<ViewModel<TestType>>
  ): Promise<void> {
    const { id } = req.params;
    const shuffleOptions = req.query?.shuffleOptions === 'true';

    const test = await testService.getTestById(id, shuffleOptions);

    if (!test) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Requested test not found!' });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ data: test, msg: 'Test fetched successfully!' });
    }
  }

  // Создание нового теста (административный функционал)
  async createTest(
    req: RequestWithBody<TestCreateModel>,
    res: Response<ViewModel<TestType>>
  ): Promise<void> {
    const newTest = await testService.createTest(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ data: newTest, msg: 'Test successfully created!' });
  }

  // Обновление теста (административный функционал)
  async updateTest(
    req: RequestWithParamsAndBody<{ id: string }, TestUpdateModel>,
    res: Response<ViewModel<TestType>>
  ): Promise<void> {
    const { id } = req.params;
    const updatedTest = await testService.updateTest(id, req.body);

    if (!updatedTest) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Requested test not found!' });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ data: updatedTest, msg: 'Test successfully updated!' });
    }
  }

  // Удаление теста (административный функционал)
  async deleteTest(
    req: RequestWithParams<{ id: string }>,
    res: Response<ViewModel<TestType>>
  ): Promise<void> {
    const { id } = req.params;
    const deletedTest = await testService.deleteTest(id);

    if (!deletedTest) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Requested test not found!' });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ data: deletedTest, msg: 'Test successfully deleted!' });
    }
  }

  /**
   * Обработка результатов теста (с поддержкой интерпретаций по шкалам)
   * POST /tests/submit
   */
  async submitTestResults(
    req: RequestWithBody<TestSubmissionModel>,
    res: Response<
      ViewModel<{
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
          interpretation: {
            id: string;
            title: string;
            description: string;
            recommendations?: string[];
          };
        }[];
        interpretation: {
          id: string;
          title: string;
          description: string;
          recommendations?: string[];
        };
        questionScores: { questionId: string; score: number; text: string }[];
        questionReviews?: {
          questionId: string;
          questionText: string;
          userAnswer: string;
          correctAnswer: string;
          isCorrect: boolean;
          explanation?: string;
        }[];
      }>
    >
  ): Promise<void> {
    try {
      const result = await testService.processTestResults(req.body);
      res.status(StatusCodes.OK).json({
        data: result,
        msg: 'Test results processed successfully!',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(StatusCodes.BAD_REQUEST).json({ msg: errorMessage });
    }
  }
}

export const testController = new TestController();
