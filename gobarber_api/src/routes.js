import { Router } from 'express';
import multerConfig from './config/multer'
import multer from 'multer'

import authMiddleware from './app/middlewares/auth'

import UserController from './app/controllers/UserController'
import FileController from './app/controllers/FileController'
import SessionController from './app/controllers/SessionController'
import ProviderController from './app/controllers/ProviderController'
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

// Validator
import validateUserStore from './app/validators/UserStore'
import validateUserUpdate from './app/validators/UserUpdate'

const routes = new Router();
const upload = multer(multerConfig)

routes.post('/users', validateUserStore, UserController.store)
routes.post('/sessions', SessionController.store)


routes.use(authMiddleware)

routes.put('/users', validateUserUpdate, UserController.update)

routes.get('/providers', ProviderController.index)
routes.get('/providers/:providerId/available', AvailableController.index)

routes.get('/appointments', AppointmentController.index)
routes.post('/appointments', AppointmentController.store)
routes.delete('/appointments/:id', AppointmentController.delete)

routes.get('/schedules', ScheduleController.index)

routes.post('/files', upload.single('file'), FileController.store)

routes.get('/notifications', NotificationController.index)
routes.put('/notifications/:id', NotificationController.update)




export default routes