import { CarImage } from "@modules/cars/infra/typeorm/entities/CarImage";

interface ICarsImagesRepository {
  create(car_id: string, image_name: string): Promise<CarImage>;
  findById(id: string): Promise<CarImage>;
  findByCarId(car_id: string): Promise<CarImage[]>;
  delete(id: string): Promise<void>;
}

export { ICarsImagesRepository };