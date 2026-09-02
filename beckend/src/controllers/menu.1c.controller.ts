
import { Request, Response } from 'express';
import { menuOneCService } from '../services/menu.1c.service';
import { TOneCMenuItemResult, TMenuFilter } from '../types/oneC.types';


type TMenuQueryParams = {
  period?: 'week' | 'month';
  dateFrom?: string;
  dateTo?: string;
};

type TOneCMenuResponse = {
  items: TOneCMenuItemResult[];
  count: number;
  filter?: {
    period?: string;
    dateFrom?: string;
    dateTo?: string;
  };
};

type TApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
};

export class MenuOneCController {
  async getMenuFromOneC(req: Request, res: Response): Promise<void> {
    try {
      const filter = this.parseFilterParams(req.query as TMenuQueryParams);
      const menu = await menuOneCService.getMenuFromOneC(filter);
      
      const response: TApiResponse<TOneCMenuResponse> = {
        success: true,
        message: 'Меню из 1С успешно получено',
        data: {
          items: menu,
          count: menu.length,
          filter: this.getFilterInfo(filter),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error('Ошибка в MenuOneCController.getMenuFromOneC:', errorMessage);
      
      const response: TApiResponse<never> = {
        success: false,
        message: 'Не удалось получить меню из 1С',
        errors: [errorMessage],
      };

      res.status(500).json(response);
    }
  }

  private parseFilterParams(query: TMenuQueryParams): TMenuFilter | undefined {
    const filter: TMenuFilter = {};

    if (query.period === 'week' || query.period === 'month') {
      filter.period = query.period;
      return filter;
    }

    if (query.dateFrom && query.dateTo) {
      const dateFrom = this.parseDateParam(query.dateFrom);
      const dateTo = this.parseDateParam(query.dateTo);
      
      if (dateFrom && dateTo) {
        filter.dateFrom = dateFrom;
        filter.dateTo = dateTo;
        filter.period = 'custom';
        return filter;
      }
    }

    if (query.dateFrom || query.dateTo) {
      console.warn('⚠️ Для фильтрации по дате нужны оба параметра: dateFrom и dateTo');
      return undefined;
    }

    return undefined;
  }

  private parseDateParam(dateStr: string): Date | null {
    const parts = dateStr.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null;
    }

    const date = new Date(year, month, day);
    
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      return null;
    }

    return date;
  }

  private getFilterInfo(filter: TMenuFilter | undefined): {
    period?: string;
    dateFrom?: string;
    dateTo?: string;
  } {
    if (!filter) {
      return { period: 'all' };
    }

    const info: {
      period?: string;
      dateFrom?: string;
      dateTo?: string;
    } = {};

    if (filter.period) {
      info.period = filter.period;
    }

    if (filter.dateFrom) {
      info.dateFrom = filter.dateFrom.toLocaleDateString('ru-RU');
    }

    if (filter.dateTo) {
      info.dateTo = filter.dateTo.toLocaleDateString('ru-RU');
    }

    return info;
  }
}

export const menuOneCController = new MenuOneCController();