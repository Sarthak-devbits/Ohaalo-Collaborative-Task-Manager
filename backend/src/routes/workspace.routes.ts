import { WorkspaceController } from '../controllers/workspace.controller';
import { verifyToken } from '../middleware/user.middleware';
import { Router } from 'express';

export const workspaceRoutes = Router();
const workspace = new WorkspaceController();

workspaceRoutes.get('/workspace', verifyToken, workspace.getWorkspaces);
workspaceRoutes.post('/workspace', verifyToken, workspace.createWorkspace);

// cardRoutes.post('/gpt', gptControllerInstance.getGeminiData);
