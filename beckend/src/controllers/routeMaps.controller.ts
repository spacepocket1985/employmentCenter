import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { routeMapsService } from '../services/routeMaps.service';
import { ViewModel } from '../models/viewModel';
import { getErrorMessage } from '../utils/errorHandler';

class RouteMapsController {
  async getAvailableMaps(
    req: unknown,
    res: Response<ViewModel<string[]>>
  ): Promise<void> {
    try {
      const maps = await routeMapsService.getAvailableMaps();
      
      res.status(StatusCodes.OK).json({
        data: maps,
        msg: 'Available route maps fetched successfully',
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: `Error fetching route maps: ${message}` });
    }
  }

  async reloadMaps(
    req: unknown,
    res: Response<ViewModel<string[]>>
  ): Promise<void> {
    try {
      const maps = await routeMapsService.reloadMaps();
      
      res.status(StatusCodes.OK).json({
        data: maps,
        msg: 'Route maps reloaded successfully',
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: `Error reloading route maps: ${message}` });
    }
  }
}

export const routeMapsController = new RouteMapsController();