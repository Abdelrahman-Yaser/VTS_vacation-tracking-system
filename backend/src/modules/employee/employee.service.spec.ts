import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repo: Repository<Employee>;

  const mockEmployeeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: getRepositoryToken(Employee),
          useValue: mockEmployeeRepository,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    repo = module.get<Repository<Employee>>(getRepositoryToken(Employee));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save an employee with hashed password', async () => {
      const dto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'pass123',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPass'as never);
      mockEmployeeRepository.create.mockReturnValue({ ...dto, password: 'hashedPass' });
      mockEmployeeRepository.save.mockResolvedValue({ id: '1', ...dto, password: 'hashedPass' });

      const result = await service.create(dto as any);

      expect(bcrypt.hash).toHaveBeenCalledWith('pass123', 10);
      expect(mockEmployeeRepository.create).toHaveBeenCalledWith({ ...dto, password: 'hashedPass' });
      expect(mockEmployeeRepository.save).toHaveBeenCalled();
      expect(result.password).toBe('hashedPass');
    });
  });

  describe('findAll', () => {
    it('should return all employees', async () => {
      const employees = [{ id: '1' }, { id: '2' }];
      mockEmployeeRepository.find.mockResolvedValue(employees);

      const result = await service.findAll();

      expect(result).toEqual(employees);
      expect(mockEmployeeRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one employee by id', async () => {
      const employee = { id: '1' };
      mockEmployeeRepository.findOneBy.mockResolvedValue(employee);

      const result = await service.findOne('1');

      expect(result).toEqual(employee);
      expect(mockEmployeeRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('update', () => {
    it('should update an existing employee', async () => {
      const dto = { first_name: 'Jane' };
      const employee = { id: '1', ...dto };

      mockEmployeeRepository.preload.mockResolvedValue(employee);
      mockEmployeeRepository.save.mockResolvedValue(employee);

      const result = await service.update('1', dto as any);

      expect(mockEmployeeRepository.preload).toHaveBeenCalledWith({ id: '1', ...dto });
      expect(mockEmployeeRepository.save).toHaveBeenCalledWith(employee);
      expect(result).toEqual(employee);
    });

    it('should throw NotFoundException if employee does not exist', async () => {
      mockEmployeeRepository.preload.mockResolvedValue(null);

      await expect(service.update('1', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an employee', async () => {
      mockEmployeeRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(mockEmployeeRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ affected: 1 });
    });
  });
});