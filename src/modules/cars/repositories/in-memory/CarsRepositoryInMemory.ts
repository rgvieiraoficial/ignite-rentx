import { Car } from "@modules/cars/infra/typeorm/entities/Car";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create({
    id,
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      id: !id ? car.id : id,
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      specifications
    });

    this.cars.push(car);

    return car;
  }

  async findById(id: string): Promise<Car> {
    return this.cars.find((car) => car.id === id);
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }

  async findAvailable(category_id?: string, name?: string, brand?: string): Promise<Car[]> {
    const cars = this.cars.filter((car) => {
      if (car.available === true || ((category_id && car.category_id === category_id) ||
        (name && car.name === name) || (brand && car.brand == brand))) {
        return car;
      }

      return null;
    });

    return cars;
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const findIndex = this.cars.findIndex(car => car.id === id);

    this.cars[findIndex].available = available;
  }
}

export { CarsRepositoryInMemory };