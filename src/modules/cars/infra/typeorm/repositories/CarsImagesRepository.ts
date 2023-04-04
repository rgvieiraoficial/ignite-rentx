import { getRepository, Repository } from "typeorm";

import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { CarImage } from "../entities/CarImage";

class CarsImagesRepository implements ICarsImagesRepository {
  private repository: Repository<CarImage>;

  constructor() {
    this.repository = getRepository(CarImage);
  }

  async create(car_id: string, image_name: string): Promise<CarImage> {
    const carImage = this.repository.create({
      car_id,
      image_name
    });

    await this.repository.save(carImage);

    return carImage;
  }

  async findById(id: string): Promise<CarImage> {
    const image = await this.repository.findOne(id);

    return image;
  }

  async findByCarId(car_id: string): Promise<CarImage[]> {
    const carImage = await this.repository.find({ car_id });

    return carImage;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { CarsImagesRepository };