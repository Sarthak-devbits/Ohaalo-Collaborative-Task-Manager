import { z } from 'zod';
import { Request, Response } from 'express';
import { AppError } from '../utils/appError';
import { httpStatusCodes } from '../utils/httpStatusCode';
import { formResponse } from '../utils/formResponse';

const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required'),
});
export class WorkspaceController {
  async createWorkspace(req: Request, res: Response) {
    const { name } = createWorkspaceSchema.parse(req.body);
    const ownerId = req.id; // assuming authentication middleware sets req.id

    if (!ownerId) {
      throw new AppError('Unauthorized', 401);
    }

    const workspace = await prisma?.workSpace.create({
      data: {
        name,
        ownerId,
      },
    });

    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, workspace));
  }

  async getWorkspaces(req: Request, res: Response) {
    const ownerId = req.id; // assuming authentication middleware sets req.id

    if (!ownerId) {
      throw new AppError('Unauthorized', 401);
    }

    const workspaces = await prisma?.workSpace.findMany({
      where: {
        ownerId,
      },
      select: {
        id: true,
        name: true,
      },
    });
    // Map the workspaces to add `value` = `id`
    const formattedWorkspaces =
      workspaces?.map((workspace) => ({
        id: workspace.id,
        name: workspace.name,
        value: workspace.id,
      })) || [];
    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, formattedWorkspaces));
  }
}
