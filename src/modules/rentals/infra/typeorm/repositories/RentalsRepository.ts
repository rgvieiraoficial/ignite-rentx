import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>

  constructor() {
    this.repository = getRepository(Rental);
  }

  async create({ id, user_id, car_id, expected_return_date, total, end_date }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      id,
      user_id,
      car_id,
      expected_return_date,
      total,
      end_date
    });

    await this.repository.save(rental);

    return rental;
  }

  async findById(id: string): Promise<Rental> {
    const rental = await this.repository.findOne(id);

    return rental;
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    const rentals = await this.repository.find({
      where: { user_id },
      relations: ['car']
    });

    return rentals;
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const carQuery = await this.repository.createQueryBuilder('r')
      .where('end_date IS NULL');

    carQuery.andWhere('car_id = :car_id', { car_id });

    const openByCar = await carQuery.getOne();

    return openByCar;
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const userQuery = await this.repository.createQueryBuilder('r')
      .where('end_date IS NULL');

    userQuery.andWhere('user_id = :user_id', { user_id });

    const openByUser = await userQuery.getOne();

    return openByUser;
  }

}

export { RentalsRepository }