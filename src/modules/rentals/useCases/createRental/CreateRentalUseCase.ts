import { inject, injectable } from 'tsyringe';

import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {

  constructor(
    @inject('RentalsRepository')
    private renstalsRepository: IRentalsRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
    @inject('CarsRepository')
    private carsReposioty: ICarsRepository
  ) { }

  async execute({ user_id, car_id, expected_return_date }: IRequest): Promise<Rental> {
    const minimiumHour = 24;

    const carUnavailable = await this.renstalsRepository.findOpenRentalByCar(car_id);

    if (carUnavailable) {
      throw new AppError('Car is unavailable!');
    }

    const rentalOpenToUser = await this.renstalsRepository.findOpenRentalByUser(user_id);

    if (rentalOpenToUser) {
      throw new AppError('There is a rental in progress for user!');
    }

    const dateNow = this.dateProvider.dateNow();

    const compare = this.dateProvider.compareInHours(dateNow, expected_return_date)

    if (compare < minimiumHour) {
      throw new AppError('Invalid return time!');
    }

    const rental = await this.renstalsRepository.create({
      user_id,
      car_id,
      expected_return_date
    });

    await this.carsReposioty.updateAvailable(car_id, false);

    return rental;
  }
}

export { CreateRentalUseCase };