import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '../IRentalsRepository';

class RentalsRepositoryInMemory implements IRentalsRepository {
  rentals: Rental[] = [];

  async create({ user_id, car_id, expected_return_date }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, {
      user_id,
      car_id,
      start_date: new Date(),
      expected_return_date,
      end_date: null
    });

    this.rentals.push(rental);

    return rental;
  }

  async findById(id: string): Promise<Rental> {
    const rental = this.rentals.find((rental) => rental.id === id);

    return rental;
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    const rental = this.rentals.filter((rental) => rental.user_id === user_id);

    return rental;
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    return this.rentals.find((rental) => rental.car_id === car_id && rental.end_date === null);
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    return this.rentals.find((rental) => rental.user_id === user_id && !rental.end_date);
  }
}

export { RentalsRepositoryInMemory };