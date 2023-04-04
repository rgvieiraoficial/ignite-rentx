import { inject, injectable } from 'tsyringe';

import { CarsImagesRepository } from '@modules/cars/infra/typeorm/repositories/CarsImagesRepository';
import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';

import { deleteFile } from '@utils/file';
import { AppError } from '@shared/errors/AppError';

@injectable()
class DeleteCarImagesUseCase {

  constructor(
    @inject(CarsImagesRepository)
    private carsImagesRepository: ICarsImagesRepository
  ) { }

  async execute(id: string): Promise<void> {
    const carImage = await this.carsImagesRepository.findById(id);

    if (!carImage) {
      throw new AppError('Image does not exists!');
    }

    await deleteFile(`./tmp/cars/${carImage.image_name}`);
    await this.carsImagesRepository.delete(id);
  }
}

export { DeleteCarImagesUseCase };