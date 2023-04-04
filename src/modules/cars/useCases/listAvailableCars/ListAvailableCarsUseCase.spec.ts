import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory'
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe('List Cars', () => {

  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();

    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
  });

  it('should be able to list all available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Toyota Corolla SEG 2012',
      description: 'Carro confortável e econômico',
      daily_rate: 80.00,
      license_plate: 'AD47-1F8E',
      fine_amount: 20.00,
      brand: 'Toyota',
      category_id: '3791f77a-5de8-41fb-bf2e-c35aa4739890'
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by their brand', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Chevrolet Joy Plus',
      description: 'Carro Sedan',
      daily_rate: 80.00,
      license_plate: 'QE54-1U5E',
      fine_amount: 20.00,
      brand: 'Chevrolet',
      category_id: '3791f77a-5de8-41fb-bf2e-c35aa4739890'
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: 'Chevrolet'
    });

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by their name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Chevrolet Onix Plus',
      description: 'Carro confortável e econômico',
      daily_rate: 80.00,
      license_plate: 'QE54-1U5E',
      fine_amount: 20.00,
      brand: 'Chevrolet',
      category_id: '3791f77a-5de8-41fb-bf2e-c35aa4739890'
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'Chevrolet Onix Plus'
    });

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by category', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Fiat Cronos',
      description: 'Carro confortável e econômico',
      daily_rate: 75.00,
      license_plate: 'QE54-1U5E',
      fine_amount: 15.00,
      brand: 'Fiat',
      category_id: '4701t45r-6vb4-21bn-fh4r-a45nm5658890'
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: '4701t45r-6vb4-21bn-fh4r-a45nm5658890'
    });

    expect(cars).toEqual([car]);
  });
});