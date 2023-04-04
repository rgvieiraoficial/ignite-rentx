import dayjs from 'dayjs';

import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';
import { CreateRentalUseCase } from './CreateRentalUseCase';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

let dayjsDateProvider: DayjsDateProvider;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let createRentalUseCase: CreateRentalUseCase;

describe('Create Rental', () => {

  const dayAdd24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    dayjsDateProvider = new DayjsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, dayjsDateProvider, carsRepositoryInMemory);
  });

  it('should be able to create a new rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Toyta Corolla Seg',
      description: "Carro conforável e econômico",
      daily_rate: 120,
      license_plate: "ANH4-85WE",
      fine_amount: 80,
      brand: "Toyota",
      category_id: '5862b19e-c327-4c74-8e9e-346cdc437500',
    });

    const rental = await createRentalUseCase.execute({
      user_id: '4a34eb9e-afb6-4521-bf09-2b4900cfde32',
      car_id: car.id,
      expected_return_date: dayAdd24Hours
    });

    expect(rental).toHaveProperty('id');
  });

  it('should not be able to create a new rental if there is another open to the same user', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Toyta Corolla Seg',
      description: "Carro confortável e econômico",
      daily_rate: 120,
      license_plate: "ANH4-85WE",
      fine_amount: 80,
      brand: "Toyota",
      category_id: '5862b19e-c327-4c74-8e9e-346cdc437500',
    });

    const user_id = 'edfce6b7-674f-446c-87ba-20f910188ee7';

    await createRentalUseCase.execute({
      user_id: user_id,
      car_id: car.id,
      expected_return_date: dayAdd24Hours
    });

    const car2 = await carsRepositoryInMemory.create({
      name: 'Toyta Etios',
      description: "Carro confortável e econômico",
      daily_rate: 120,
      license_plate: "ANH4-85WE",
      fine_amount: 80,
      brand: "Toyota",
      category_id: '5862b19e-c327-4c74-8e9e-346cdc437500',
    });

    await expect(createRentalUseCase.execute({
      user_id: user_id,
      car_id: car2.id,
      expected_return_date: dayAdd24Hours
    })).rejects.toEqual(new AppError('There is a rental in progress for user!'));
  });

  it('should not be able to create a new rental if there is another open to the same car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Toyta Corolla Seg',
      description: "Carro conforável e econômico",
      daily_rate: 120,
      license_plate: "ANH4-85WE",
      fine_amount: 80,
      brand: "Toyota",
      category_id: '5862b19e-c327-4c74-8e9e-346cdc437500',
    });

    await createRentalUseCase.execute({
      user_id: 'edfce6b7-674f-446c-87ba-20f910188ee7',
      car_id: car.id,
      expected_return_date: dayAdd24Hours
    });

    expect(createRentalUseCase.execute({
      user_id: 'edfce6b7-674f-446c-87ba-20f910188ee7',
      car_id: car.id,
      expected_return_date: dayAdd24Hours
    })).rejects.toEqual(new AppError('Car is unavailable!'));
  });

  it('should not be able to create a new rental with invalid return time', async () => {
    await expect(createRentalUseCase.execute({
      user_id: 'f247f7c7-422f-4d10-ab17-598423b970a5',
      car_id: '5ff586d8-5ff7-4074-9882-9c585690e048',
      expected_return_date: dayjs().toDate()
    })).rejects.toEqual(new AppError('Invalid return time!'));
  });
});