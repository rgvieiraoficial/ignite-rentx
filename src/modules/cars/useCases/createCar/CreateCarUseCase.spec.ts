import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory'
import { AppError } from '@shared/errors/AppError';
import { CreateCarUseCase } from "./CreateCarUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let createCarUseCase: CreateCarUseCase;

describe('Create car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('should be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'AD47-04FD',
      fine_amount: 30,
      brand: 'Brand',
      category_id: '45ae85tr98-85se87e5a7e8'
    });

    expect(car).toHaveProperty('id');
  });

  it('should not be able to create a car with existing license plate', async () => {
    await createCarUseCase.execute({
      name: "Car 1",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "FK78-54PE",
      fine_amount: 30,
      brand: "Brand",
      category_id: "45ae85tr98-85se87e5a7e8"
    });

    await expect(createCarUseCase.execute({
      name: 'Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'FK78-54PE',
      fine_amount: 30,
      brand: 'Brand',
      category_id: '45ae85tr98-85se87e5a7e8'
    })).rejects.toEqual(new AppError('Car already exists!'));
  });

  it('should able to create a car with available true by default', async () => {
    const car = await createCarUseCase.execute({
      name: "Car Available",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "AR15-37MC",
      fine_amount: 30,
      brand: "Brand",
      category_id: "45ae85tr98-85se87e5a7e8"
    });

    expect(car.available).toBe(true);
  });
});