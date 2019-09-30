import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import ScheduleController from './app/controllers/ScheduleController';
import RegistrationController from './app/controllers/RegistrationController';
import NotificationController from './app/controllers/NotificationController';
import MeetupController from './app/controllers/MeetupController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/schedules', ScheduleController.store);
routes.get('/schedules', ScheduleController.index);
routes.put('/schedules/:id', ScheduleController.update);
routes.delete('/schedules/:id', ScheduleController.delete);

routes.post('/registrations/:id', RegistrationController.store);
routes.get('/registrations/', RegistrationController.index);

routes.get('/notifications/:id', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.get('/meetups', MeetupController.index);

export default routes;
