import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { boardRoutes } from './board.routes';
import { listRoutes } from './list.routes';
import { labelRoutes } from './label.routes';
import { gptRoutes } from './gpt.routes';
import { cardRoutes } from './card.routes';
import { workspaceRoutes } from './workspace.routes';

export const routes = Router();

//Auth Route
routes.use('/v1/auth', authRoutes);

//Gemni Route
routes.use('/v1/', gptRoutes);

//Workspace Route
routes.use('/v1', workspaceRoutes);

//Board Route
routes.use('/v1', boardRoutes);

//List Route
routes.use('/v1', listRoutes);

//Card Route
routes.use('/v1', cardRoutes);


//Label Route
routes.use('/v1', labelRoutes);
