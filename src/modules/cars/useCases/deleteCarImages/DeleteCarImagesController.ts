import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeleteCarImagesUseCase } from './DeleteCarImagesUseCase';

class DeleteCarImageController {

  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteCarImagesUseCase = container.resolve(DeleteCarImagesUseCase)

    await deleteCarImagesUseCase.execute(id);

    return response.status(200).send();
  }
}

export { DeleteCarImageController };