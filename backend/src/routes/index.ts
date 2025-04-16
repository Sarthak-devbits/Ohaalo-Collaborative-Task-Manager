import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { boardRoutes } from './board.routes';
import { listRoutes } from './list.routes';
import { labelRoutes } from './label.routes';
import { gptRoutes } from './gpt.routes';

export const routes = Router();

//Auth Route
routes.use('/v1/auth', authRoutes);

//Gemni Route
routes.use('/v1/', gptRoutes);

//Board Route
routes.use('/v1', boardRoutes);

//List Route
routes.use('/v1', listRoutes);

//Label Route
routes.use('/v1', labelRoutes);
