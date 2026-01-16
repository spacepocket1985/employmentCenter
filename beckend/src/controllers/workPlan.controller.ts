
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { 
  WorkPlan,
  CreateWorkPlanRequest,
  UpdateWorkPlanRequest,
  ApiResponse 
} from '../types/workPlan.types';
import { WorkPlanModel } from '../models/workPlan.model';

class WorkPlanController {
  
  // Создание плана
  async createPlan(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateWorkPlanRequest = req.body;
      
      // Проверяем существующий план
      const existingPlan = await WorkPlanModel.findOne({
        year: data.year,
        monthNumber: data.monthNumber
      });
      
      if (existingPlan) {
        const response: ApiResponse = {
          success: false,
          message: 'План на этот месяц уже существует'
        };
        res.status(400).json(response);
        return;
      }
      
      // Создаем новый план
      const newPlan = new WorkPlanModel({
        ...data,
        days: data.days.map(day => ({
          ...day,
          id: day.id || new mongoose.Types.ObjectId().toString(),
          events: day.events.map(event => ({
            ...event,
            id: event.id || new mongoose.Types.ObjectId().toString()
          }))
        }))
      });
      
      await newPlan.save();
      
      const response: ApiResponse<WorkPlan> = {
        success: true,
        message: 'План создан',
        data: newPlan.toObject()
      };
      
      res.status(201).json(response);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      const response: ApiResponse = {
        success: false,
        message: 'Ошибка создания',
        error: errorMessage
      };
      res.status(500).json(response);
    }
  }
  
  // Получение плана по ID
  async getPlan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const plan = await WorkPlanModel.findById(id);
      
      if (!plan) {
        const response: ApiResponse = {
          success: false,
          message: 'План не найден'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse<WorkPlan> = {
        success: true,
        message: 'План получен',
        data: plan.toObject()
      };
      
      res.json(response);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      const response: ApiResponse = {
        success: false,
        message: 'Ошибка получения',
        error: errorMessage
      };
      res.status(500).json(response);
    }
  }
  
  // Получение всех планов
  async getAllPlans(req: Request, res: Response): Promise<void> {
    try {
      const plans = await WorkPlanModel.find().sort({ year: -1, monthNumber: -1 });
      
      const response: ApiResponse<WorkPlan[]> = {
        success: true,
        message: 'Планы получены',
        data: plans.map(p => p.toObject())
      };
      
      res.json(response);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      const response: ApiResponse = {
        success: false,
        message: 'Ошибка получения планов',
        error: errorMessage
      };
      res.status(500).json(response);
    }
  }
  
  // Обновление плана
  async updatePlan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateWorkPlanRequest = req.body;
      
      const plan = await WorkPlanModel.findById(id);
      
      if (!plan) {
        const response: ApiResponse = {
          success: false,
          message: 'План не найден'
        };
        res.status(404).json(response);
        return;
      }
      
      // Обновляем только переданные поля
      if (data.days !== undefined) {
        plan.days = data.days.map(day => ({
          ...day,
          id: day.id || new mongoose.Types.ObjectId().toString(),
          events: day.events.map(event => ({
            ...event,
            id: event.id || new mongoose.Types.ObjectId().toString()
          }))
        }));
      }
      
      await plan.save();
      
      const response: ApiResponse<WorkPlan> = {
        success: true,
        message: 'План обновлен',
        data: plan.toObject()
      };
      
      res.json(response);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      const response: ApiResponse = {
        success: false,
        message: 'Ошибка обновления',
        error: errorMessage
      };
      res.status(500).json(response);
    }
  }
  
  // Удаление плана
  async deletePlan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const plan = await WorkPlanModel.findById(id);
      
      if (!plan) {
        const response: ApiResponse = {
          success: false,
          message: 'План не найден'
        };
        res.status(404).json(response);
        return;
      }
      
      await WorkPlanModel.deleteOne({ _id: id });
      
      const response: ApiResponse = {
        success: true,
        message: 'План удален'
      };
      
      res.json(response);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      const response: ApiResponse = {
        success: false,
        message: 'Ошибка удаления',
        error: errorMessage
      };
      res.status(500).json(response);
    }
  }
}

export default new WorkPlanController();