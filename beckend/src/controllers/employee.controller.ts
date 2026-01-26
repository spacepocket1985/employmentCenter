// Controller Layer (Presentation Layer):
// Description: Processes requests and interacts with the service to manage employees

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EmployeeCreateModel } from '../models/employeeCreateModel';
import { EmployeeViewModel } from '../models/employeeViewModel';
import { EmployeeType } from '../models/employee.model';
import { employeeService } from '../services/employee.service';

import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../types/types';

class EmployeeController {
  async createEmployee(
    req: RequestWithBody<EmployeeCreateModel>,
    res: Response<EmployeeViewModel<EmployeeType>>
  ): Promise<void> {
    const newEmployee = await employeeService.createEmployee(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ data: newEmployee, msg: 'Employee successfully created!' });
  }

  async getAllEmployees(
    req: Request,
    res: Response<EmployeeViewModel<EmployeeType[]>>
  ): Promise<void> {
    const employees = await employeeService.getAllEmployees();
    res
      .status(StatusCodes.OK)
      .json({ data: employees, msg: 'All employees have been fetched!' });
  }

  async getEmployeesHB(
    req: Request,
    res: Response<EmployeeViewModel<EmployeeType[]>>
  ): Promise<void> {
    const employees = await employeeService.getHBEmployees();

    if (!employees) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: 'Error with fethcing!' });
    } else
      res
        .status(StatusCodes.OK)
        .json({ data: employees, msg: 'All employees with HB fetched!' });
  }

  async getEmployee(
    req: RequestWithParams<{ id: string }>,
    res: Response<EmployeeViewModel<EmployeeType>>
  ): Promise<void> {
    const { id } = req.params;
    const employee = await employeeService.getEmployee(id);

    if (!employee) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Requested employee not found!' });
    } else {
      res.status(StatusCodes.OK).json({ data: employee, msg: 'Success' });
    }
  }

  async getEmployeeByName(
    req: RequestWithParams<{ name: string }>,
    res: Response<EmployeeViewModel<EmployeeType[]>>
  ): Promise<void> {
    const { name } = req.params;
    const employees = await employeeService.findEmployeesByNameStart(name);
  
    if (!employees) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Requested employee not found!' });
    } else {
      res.status(StatusCodes.OK).json({ data: employees, msg: 'Success' });
    }
  }

  async updateEmployee(
    req: RequestWithParamsAndBody<{ id: string }, EmployeeType>,
    res: Response<EmployeeViewModel<EmployeeType>>
  ): Promise<void> {
    const { id } = req.params;
    const updatedEmployee = await employeeService.updateEmployee(id, req.body);

    if (!updatedEmployee) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Requested employee not found!' });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ data: updatedEmployee, msg: 'Employee successfully updated!' });
    }
  }

  async deleteEmployee(
    req: RequestWithParams<{ id: string }>,
    res: Response<EmployeeViewModel<EmployeeType>>
  ): Promise<void> {
    const { id } = req.params;
    const deletedEmployee = await employeeService.deleteEmployee(id);

    if (!deletedEmployee) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Requested Employee not found!' });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ data: deletedEmployee, msg: 'Employee successfully deleted!' });
    }
  }
  /**
   * Получить всех сотрудников группы responsibleOnWeekends
   * (включая подгруппы и отдельных сотрудников)
   */
  async getResponsibleOnWeekends(
    req: Request,
    res: Response<EmployeeViewModel<EmployeeType[]>>
  ): Promise<void> {
    const employees = await employeeService.getResponsibleOnWeekendsEmployees();

    if (!employees || employees.length === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'No responsible on weekends employees found!' });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ 
          data: employees, 
          msg: 'Responsible on weekends employees fetched successfully!' 
        });
    }
  }

  /**
   * Получить всех сотрудников группы safetyOfficers
   * (включая все подгруппы)
   */
  async getSafetyOfficers(
    req: Request,
    res: Response<EmployeeViewModel<EmployeeType[]>>
  ): Promise<void> {
    const employees = await employeeService.getSafetyOfficersEmployees();

    if (!employees || employees.length === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'No safety officers employees found!' });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ 
          data: employees, 
          msg: 'Safety officers employees fetched successfully!' 
        });
    }
  }

  /**
   * Получить сотрудников по конкретной группе (без учета иерархии)
   * Например: GET /employees/group/management
   */
  async getEmployeesByGroup(
    req: RequestWithParams<{ groupName: string }>,
    res: Response<EmployeeViewModel<EmployeeType[]>>
  ): Promise<void> {
    const { groupName } = req.params;
    const employees = await employeeService.getEmployeesByGroup(groupName);

    if (!employees || employees.length === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No employees found in group: ${groupName}` });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ 
          data: employees, 
          msg: `Employees in group "${groupName}" fetched successfully!` 
        });
    }
  }

  /**
   * Добавить группу сотруднику
   * PATCH /employees/:id/groups/:groupName
   */
  async addGroupToEmployee(
    req: RequestWithParams<{ id: string; groupName: string }>,
    res: Response<EmployeeViewModel<EmployeeType>>
  ): Promise<void> {
    const { id, groupName } = req.params;
    const updatedEmployee = await employeeService.addGroupToEmployee(id, groupName);

    if (!updatedEmployee) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Requested employee not found!' });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ 
          data: updatedEmployee, 
          msg: `Group "${groupName}" successfully added to employee!` 
        });
    }
  }

  /**
   * Удалить группу у сотрудника
   * DELETE /employees/:id/groups/:groupName
   */
  async removeGroupFromEmployee(
    req: RequestWithParams<{ id: string; groupName: string }>,
    res: Response<EmployeeViewModel<EmployeeType>>
  ): Promise<void> {
    const { id, groupName } = req.params;
    const updatedEmployee = await employeeService.removeGroupFromEmployee(id, groupName);

    if (!updatedEmployee) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Requested employee not found!' });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ 
          data: updatedEmployee, 
          msg: `Group "${groupName}" successfully removed from employee!` 
        });
    }
  }
}

export const employeeController = new EmployeeController();
