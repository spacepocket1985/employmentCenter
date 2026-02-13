// Controller Layer для графиков

import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ScheduleCreateModel } from '../models/scheduleCreateModel';
import { ScheduleUpdateModel } from '../models/scheduleUpdateModel';

import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from '../types/types';
import { ScheduleType } from '../types/schedule.types';
import { ScheduleViewModel } from '../models/scheduleViewModel';
import { scheduleService } from '../services/schedule.service';

class ScheduleController {
  /**
   * Создать новый график
   */
  async createSchedule(
    req: RequestWithBody<ScheduleCreateModel>,
    res: Response<ScheduleViewModel<ScheduleType>>
  ): Promise<void> {
    try {
      const newSchedule = await scheduleService.createSchedule(req.body);
      res.status(StatusCodes.CREATED).json({
        data: newSchedule,
        msg: 'Schedule successfully created!',
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      if (errorMessage.includes('duplicate key')) {
        res.status(StatusCodes.CONFLICT).json({
          msg: 'Schedule for this month and type already exists!',
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          msg: 'Failed to create schedule',
        });
      }
    }
  }

  /**
   * Получить графики с фильтрацией
   */
  async getSchedules(
    req: RequestWithQuery<{ month?: string; type?: string }>,
    res: Response<ScheduleViewModel<ScheduleType[]>>
  ): Promise<void> {
    const { month, type } = req.query;
    const filters: { month?: string; scheduleType?: string } = {};

    if (month && typeof month === 'string') {
      filters.month = month;
    }

    if (
      type &&
      typeof type === 'string' &&
      (type === 'responsibleOnWeekends' || type === 'safetyOfficers')
    ) {
      filters.scheduleType = type;
    }

    const schedules = await scheduleService.getSchedules(filters);

    res.status(StatusCodes.OK).json({
      data: schedules,
      msg: 'Schedules fetched successfully!',
    });
  }

  /**
   * Получить график по ID
   */
  async getSchedule(
    req: RequestWithParams<{ id: string }>,
    res: Response<ScheduleViewModel<ScheduleType>>
  ): Promise<void> {
    const { id } = req.params;
    const schedule = await scheduleService.getSchedule(id);

    if (!schedule) {
      res.status(StatusCodes.NOT_FOUND).json({
        msg: 'Schedule not found!',
      });
    } else {
      res.status(StatusCodes.OK).json({
        data: schedule,
        msg: 'Schedule fetched successfully!',
      });
    }
  }

  /**
   * Получить график по месяцу и типу
   */
  async getScheduleByMonthAndType(
    req: RequestWithParams<{ month: string; type: string }>,
    res: Response<ScheduleViewModel<ScheduleType>>
  ): Promise<void> {
    const { month, type } = req.params;

    // Проверяем, что тип валидный
    if (type !== 'responsibleOnWeekends' && type !== 'safetyOfficers') {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: 'Invalid schedule type. Must be "responsibleOnWeekends" or "safetyOfficers"',
      });
      return;
    }

    const schedule = await scheduleService.getScheduleByMonthAndType(
      month,
      type as 'responsibleOnWeekends' | 'safetyOfficers'
    );

    if (!schedule) {
      res.status(StatusCodes.NOT_FOUND).json({
        msg: `Schedule for ${month} (${type}) not found!`,
      });
    } else {
      res.status(StatusCodes.OK).json({
        data: schedule,
        msg: 'Schedule fetched successfully!',
      });
    }
  }

  /**
   * Обновить график
   */
  async updateSchedule(
    req: RequestWithParamsAndBody<{ id: string }, ScheduleUpdateModel>,
    res: Response<ScheduleViewModel<ScheduleType>>
  ): Promise<void> {
    const { id } = req.params;
    const updatedSchedule = await scheduleService.updateSchedule(id, req.body);

    if (!updatedSchedule) {
      res.status(StatusCodes.NOT_FOUND).json({
        msg: 'Schedule not found!',
      });
    } else {
      res.status(StatusCodes.OK).json({
        data: updatedSchedule,
        msg: 'Schedule successfully updated!',
      });
    }
  }

  /**
   * Удалить график
   */
  async deleteSchedule(
    req: RequestWithParams<{ id: string }>,
    res: Response<ScheduleViewModel<ScheduleType>>
  ): Promise<void> {
    const { id } = req.params;
    const deletedSchedule = await scheduleService.deleteSchedule(id);

    if (!deletedSchedule) {
      res.status(StatusCodes.NOT_FOUND).json({
        msg: 'Schedule not found!',
      });
    } else {
      res.status(StatusCodes.OK).json({
        data: deletedSchedule,
        msg: 'Schedule successfully deleted!',
      });
    }
  }

  /**
   * Опубликовать/снять с публикации график
   */
  async toggleSchedulePublish(
    req: RequestWithParams<{ id: string }>,
    res: Response<ScheduleViewModel<ScheduleType>>
  ): Promise<void> {
    const { id } = req.params;
    const schedule = await scheduleService.getSchedule(id);

    if (!schedule) {
      res.status(StatusCodes.NOT_FOUND).json({
        msg: 'Schedule not found!',
      });
      return;
    }

    const updatedSchedule = await scheduleService.updateSchedule(id, {
      isPublished: !schedule.isPublished,
    });

    if (!updatedSchedule) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: 'Failed to update schedule',
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      data: updatedSchedule,
      msg: `Schedule ${
        updatedSchedule.isPublished ? 'published' : 'unpublished'
      } successfully!`,
    });
  }

  /**
   * Создать график на основе шаблона (автозаполнение из сотрудников)
   */
  async createScheduleFromTemplate(
    req: RequestWithBody<{
      month: string;
      scheduleType: 'responsibleOnWeekends' | 'safetyOfficers';
    }>,
    res: Response<ScheduleViewModel<ScheduleType>>
  ): Promise<void> {
    try {
      const { month, scheduleType } = req.body;
      const newSchedule = await scheduleService.createScheduleFromTemplate(
        month,
        scheduleType
      );

      res.status(StatusCodes.CREATED).json({
        data: newSchedule,
        msg: 'Schedule created from template successfully!',
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      if (errorMessage.includes('already exists')) {
        res.status(StatusCodes.CONFLICT).json({
          msg: errorMessage,
        });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: errorMessage,
        });
      }
    }
  }

  /**
   * Получить графики за текущий месяц
   */
  /**
   * Получить графики за текущий месяц
   */
  async getCurrentMonthSchedules(
    req: Request,
    res: Response<ScheduleViewModel<ScheduleType[]>>
  ): Promise<void> {
    try {
      const schedules = await scheduleService.getCurrentMonthSchedules();

      if (!schedules || schedules.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({
          msg: 'No schedules found for current month',
        });
        return;
      }

      res.status(StatusCodes.OK).json({
        data: schedules,
        msg: 'Current month schedules fetched successfully!',
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: `Failed to fetch current month schedules: ${errorMessage}`,
      });
    }
  }
}

export const scheduleController = new ScheduleController();
