import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { 
  WorkPlan,
  CreateWorkPlanRequest,
  UpdateWorkPlanRequest,
  ApiResponse,
  ProcessedDayPlan,
  ProcessedEvent
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
      
      // Обрабатываем специальные дни перед созданием
      const processedDays: ProcessedDayPlan[] = data.days.map(day => {
        if (day.isSpecialDay && day.specialDayTitle) {
          // Для специальных дней создаем корректную структуру
          if (day.events.length === 0) {
            // Если фронтенд не прислал событий, создаем одно
            const specialEvent: ProcessedEvent = {
              id: new mongoose.Types.ObjectId().toString(),
              time: 'Весь день',
              description: day.specialDayTitle,
              responsiblePersons: [],
              notes: ''
            };
            
            const processedDay: ProcessedDayPlan = {
              ...day,
              id: day.id || new mongoose.Types.ObjectId().toString(),
              events: [specialEvent]
            };
            
            return processedDay;
          } else {
            // Если фронтенд прислал события, обрабатываем их
            const processedEvents: ProcessedEvent[] = day.events.map(event => {
              const processedEvent: ProcessedEvent = {
                ...event,
                id: event.id || new mongoose.Types.ObjectId().toString(),
                // Убеждаемся что есть время для специального дня
                time: (event.time && event.time.trim() !== '') ? event.time : 'Весь день',
                // Убеждаемся что есть описание для специального дня
                description: (event.description && event.description.trim() !== '') 
                  ? event.description 
                  : day.specialDayTitle || '',
                responsiblePersons: event.responsiblePersons || [],
                notes: event.notes || ''
              };
              return processedEvent;
            });
            
            const processedDay: ProcessedDayPlan = {
              ...day,
              id: day.id || new mongoose.Types.ObjectId().toString(),
              events: processedEvents
            };
            
            return processedDay;
          }
        }
        
        // Обрабатываем обычные дни
        const processedEvents: ProcessedEvent[] = day.events.map(event => {
          const processedEvent: ProcessedEvent = {
            ...event,
            id: event.id || new mongoose.Types.ObjectId().toString(),
            // Для обычных дней время и описание обязательны
            time: event.time || '',
            description: event.description || '',
            responsiblePersons: event.responsiblePersons || [],
            notes: event.notes || ''
          };
          return processedEvent;
        });
        
        const processedDay: ProcessedDayPlan = {
          ...day,
          id: day.id || new mongoose.Types.ObjectId().toString(),
          events: processedEvents
        };
        
        return processedDay;
      });
      
      // Создаем новый план с анонсами
      const newPlan = new WorkPlanModel({
        month: data.month,
        monthNumber: data.monthNumber,
        year: data.year,
        days: processedDays,
        announcements: (data.announcements || []).map(announcement => ({
          ...announcement,
          id: announcement.id || new mongoose.Types.ObjectId().toString()
        })),
        workingSaturdays: data.workingSaturdays || []
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
      console.error('Ошибка создания плана работ:', error);
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
      console.error('Ошибка получения плана:', error);
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
      console.error('Ошибка получения всех планов:', error);
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
      
      // Обрабатываем специальные дни перед обновлением
      if (data.days !== undefined) {
        const processedDays: ProcessedDayPlan[] = data.days.map(day => {
          if (day.isSpecialDay && day.specialDayTitle) {
            // Для специальных дней создаем корректную структуру
            if (day.events.length === 0) {
              // Если фронтенд не прислал событий, создаем одно
              const specialEvent: ProcessedEvent = {
                id: new mongoose.Types.ObjectId().toString(),
                time: 'Весь день',
                description: day.specialDayTitle,
                responsiblePersons: [],
                notes: ''
              };
              
              const processedDay: ProcessedDayPlan = {
                ...day,
                id: day.id || new mongoose.Types.ObjectId().toString(),
                events: [specialEvent]
              };
              
              return processedDay;
            } else {
              // Если фронтенд прислал события, обрабатываем их
              const processedEvents: ProcessedEvent[] = day.events.map(event => {
                const processedEvent: ProcessedEvent = {
                  ...event,
                  id: event.id || new mongoose.Types.ObjectId().toString(),
                  // Убеждаемся что есть время для специального дня
                  time: (event.time && event.time.trim() !== '') ? event.time : 'Весь день',
                  // Убеждаемся что есть описание для специального дня
                  description: (event.description && event.description.trim() !== '') 
                    ? event.description 
                    : day.specialDayTitle || '',
                  responsiblePersons: event.responsiblePersons || [],
                  notes: event.notes || ''
                };
                return processedEvent;
              });
              
              const processedDay: ProcessedDayPlan = {
                ...day,
                id: day.id || new mongoose.Types.ObjectId().toString(),
                events: processedEvents
              };
              
              return processedDay;
            }
          }
          
          // Обрабатываем обычные дни
          const processedEvents: ProcessedEvent[] = day.events.map(event => {
            const processedEvent: ProcessedEvent = {
              ...event,
              id: event.id || new mongoose.Types.ObjectId().toString(),
              // Для обычных дней время и описание обязательны
              time: event.time || '',
              description: event.description || '',
              responsiblePersons: event.responsiblePersons || [],
              notes: event.notes || ''
            };
            return processedEvent;
          });
          
          const processedDay: ProcessedDayPlan = {
            ...day,
            id: day.id || new mongoose.Types.ObjectId().toString(),
            events: processedEvents
          };
          
          return processedDay;
        });
        
        plan.days = processedDays;
      }
      
      // Обновляем анонсы если переданы
      if (data.announcements !== undefined) {
        plan.announcements = data.announcements.map(announcement => ({
          ...announcement,
          id: announcement.id || new mongoose.Types.ObjectId().toString()
        }));
      }
      
      if (data.workingSaturdays !== undefined) {
        plan.workingSaturdays = data.workingSaturdays;
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
      console.error('Ошибка обновления плана:', error);
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
      console.error('Ошибка удаления плана:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Ошибка удаления',
        error: errorMessage
      };
      res.status(500).json(response);
    }
  }
  async getPlanByYearAndMonth(req: Request, res: Response): Promise<void> {
    try {
      const { year, monthNumber } = req.params;
      
      // Преобразуем параметры в числа
      const yearNum = parseInt(year, 10);
      const monthNum = parseInt(monthNumber, 10);
      
      // Валидация параметров
      if (isNaN(yearNum) || isNaN(monthNum)) {
        const response: ApiResponse = {
          success: false,
          message: 'Неверные параметры: год и месяц должны быть числами'
        };
        res.status(400).json(response);
        return;
      }
      
      if (monthNum < 1 || monthNum > 12) {
        const response: ApiResponse = {
          success: false,
          message: 'Неверный номер месяца. Допустимые значения: 1-12'
        };
        res.status(400).json(response);
        return;
      }
      
      const plan = await WorkPlanModel.findOne({
        year: yearNum,
        monthNumber: monthNum
      });
      
      if (!plan) {
        const response: ApiResponse = {
          success: false,
          message: 'План на указанный месяц и год не найден'
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
      console.error('Ошибка получения плана по году и месяцу:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Ошибка получения плана',
        error: errorMessage
      };
      res.status(500).json(response);
    }
  }
  // Получение текущего плана (на основе текущей даты)
  async getCurrentPlan(req: Request, res: Response): Promise<void> {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // getMonth() возвращает 0-11
      
      const plan = await WorkPlanModel.findOne({
        year: currentYear,
        monthNumber: currentMonth
      });
      
      if (!plan) {
        const response: ApiResponse = {
          success: false,
          message: 'План на текущий месяц не найден'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse<WorkPlan> = {
        success: true,
        message: 'Текущий план получен',
        data: plan.toObject()
      };
      
      res.json(response);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error('Ошибка получения текущего плана:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Ошибка получения текущего плана',
        error: errorMessage
      };
      res.status(500).json(response);
    }
  }
}

export default new WorkPlanController();