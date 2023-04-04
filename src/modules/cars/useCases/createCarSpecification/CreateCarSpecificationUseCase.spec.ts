import { AppError } from '@shared/errors/AppError';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory'
import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
let createCarSpecificationUseCase: CreateCarSpecificationUseCase;

describe('Create Car Specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(carsRepositoryInMemory, specificationsRepositoryInMemory);
  });

  it('should be able to add a new specification to the car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'AD47-04FD',
      fine_amount: 30,
      brand: 'Brand',
      category_id: '45ae85tr98-85se87e5a7e8'
    });

    const specification = await specificationsRepositoryInMemory.create({
      name: 'Specification Name',
      description: 'Specification Description'
    });

    const specifications_id = [
      specification.id
    ]

    const specificationsCars = await createCarSpecificationUseCase.execute({ car_id: car.id, specifications_id });

    expect(specificationsCars).toHaveProperty('specifications');
    expect(specificationsCars.specifications.length).toBe(1);
  });

  it('should not be able to add a new specification to non-existing car', async () => {
    const car_id = '077cb30f-c244-4370-9cd6-067e3fd8a9a0';

    const specifications_id = [
      'ca59a0ee-a4b5-4c69-a7f8-df6b7208ab7e',
      'cf32def0-0326-48be-9a1d-cd5df1dade09'
    ]

    await expect(createCarSpecificationUseCase.execute({
      car_id, specifications_id
    })).rejects.toEqual(new AppError('Car does not exists!'));
  });
});