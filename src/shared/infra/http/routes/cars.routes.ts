import { Router } from 'express';
import multer from 'multer';

import uploadConfig from "@config/upload";

import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailableCars/ListAvailableCarsController';
import { CreateCarSpecificationController } from '@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController'
import { UploadCarImagesController } from '@modules/cars/useCases/uploadCarImages/UploadCarImagesController';

import { ensureAdmin } from '@shared/infra/http/middlewares/ensureAdmin';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticeted';
import { DeleteCarImageController } from '@modules/cars/useCases/deleteCarImages/DeleteCarImagesController';

const carRoutes = Router();

const upload = multer(uploadConfig.upload('./tmp/cars'));

const createCarController = new CreateCarController();
const createCarSpecificationController = new CreateCarSpecificationController();
const listAvailableCarsController = new ListAvailableCarsController();
const uploadCarImagesController = new UploadCarImagesController();
const deleteCarImagesController = new DeleteCarImageController();

carRoutes.post('/', ensureAuthenticated, ensureAdmin, createCarController.handle)

carRoutes.get('/available', listAvailableCarsController.handle);

carRoutes.post('/specifications/:id', ensureAuthenticated, ensureAdmin, createCarSpecificationController.handle)

carRoutes.post('/images/:id', ensureAuthenticated, ensureAdmin, upload.array('images'), uploadCarImagesController.handle);

carRoutes.post('/images/delete/:id', ensureAuthenticated, ensureAdmin, deleteCarImagesController.handle);

export { carRoutes };