import {
  addBoardMemberScema,
  boardSchema,
  boardUpdateSchema,
} from '../schemas/board.schema';
import { prisma } from '../lib/prisma';
import { Request, Response } from 'express';
import { formResponse } from '../utils/formResponse';
import { httpStatusCodes } from '../utils/httpStatusCode';
import { BoardServices } from '../services/board.services';
import { IQueryFields } from '../utils/types';
import { AppError } from '../utils/appError';
import { IEditBoard } from '../utils/types/board.types';
import { v4 as uuidv4 } from 'uuid';
import { GroupedFiles } from '../schemas/sqs.schema';
import { sendToSQS } from '../services/sqs.services';
import fs from 'fs';
import path from 'path';

const boardService = new BoardServices();
const uploadPath = path.join(__dirname, '../uploads');

export class BoardController {
  async createBoard(req: Request, res: Response) {
    const validateData = boardSchema.parse(req.body);
    const { title, visibility, backgroundImg, workspaceId } = validateData;

    const workspaceData = await prisma?.workSpace?.findFirst({
      where: {
        id: +workspaceId,
      },
      select: {
        id: true,
        ownerId: true,
      },
    });

    if (!workspaceData) {
      return res
        .status(httpStatusCodes[404].code)
        .json(formResponse(httpStatusCodes[404].code, 'Invalid Workspace ID'));
    }

    const result = await prisma.$transaction(async (tx) => {
      const board = await tx.board.create({
        data: {
          title,
          visibility,
          backgroundImg,
          ownerId: req.id,
          workspaceId,
        },
      });

      // Assign Admin Role to User
      await tx.boardUser.create({
        data: {
          role: 'ADMIN',
          boardId: board.id,
          userId: req.id,
        },
      });

      // Add the board to the workspace
      await tx.workSpaceUser.create({
        data: {
          userId: req.id,
          workspaceId: workspaceId,
          role: workspaceData.ownerId == req.id ? 'OWNER' : 'MEMBER',
          boardId: board.id,
        },
      });
      return board;
    });

    // adding the board to Wokrkspace Users

    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, result));
  }

  async getAllBoards(req: Request, res: Response) {
    const { search, page, limit, id, isFiltered, workspaceId } = req.query;

    const queryFields: IQueryFields = {
      id: id ? +id : undefined,
      search: search as string,
      page: page ? +page : 0,
      limit: limit ? +limit : 10,
      isFiltered: isFiltered as string,
      workspaceId: workspaceId ? +workspaceId : undefined,
    };

    const boardsDataResponse = await boardService.getBoards(
      queryFields,
      req.id
    );

    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, boardsDataResponse));
  }

  async updateBoard(req: Request, res: Response) {
    if (!Object.keys(req.body).length) {
      throw new AppError('API Missing body', 412);
    }
    const boardId = req.query.id as string;
    const userId = req.id;

    if (!boardId) {
      throw new AppError('BoardId is missing', 412);
    }
    const { title, visibility, backgroundImg, archived } = req.body;
    const inputData: IEditBoard = {
      title,
      visibility,
      backgroundImg,
      archived,
    };

    boardUpdateSchema.parse(req.body);

    // Check if the board exists and belongs to the user
    const existingBoard = await prisma.board.findUnique({
      where: { id: +boardId, ownerId: +userId },
    });

    if (!existingBoard) {
      throw new AppError('Board not found or unauthorized', 403);
    }

    const updatedBoard = await new BoardServices().updateBoard(
      boardId,
      userId,
      inputData
    );
    if (!updatedBoard) {
      throw new AppError('Could not update board data', 400);
    }
    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, updatedBoard));
  }

  async deleteBoard(req: Request, res: Response) {
    const { id } = req.query;
    const boardId = Number(id);
    if (isNaN(boardId)) {
      return res.status(400).json(formResponse(400, 'Invalid Board ID'));
    }

    if (!boardId) {
      throw new AppError('Please provide Board Id', 400);
    }
    await prisma.board.delete({
      where: {
        id: +boardId,
      },
    });
    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, 'Deleted Succesfully'));
  }

  async likeBoard(req: Request, res: Response) {
    const boardId = Number(req.query.id);
    const userId = Number(req.id);

    if (!boardId) throw new AppError('BoardId is required', 400);

    // Check if board exists and user has access in a single query
    const boardUser = await prisma?.boardUser.findFirst({
      where: { boardId, userId },
      include: { board: true },
    });

    if (!boardUser || !boardUser.board) {
      throw new AppError(
        'Invalid BoardId or no permission to like this board',
        400
      );
    }

    // Toggle like: If exists, delete it. Otherwise, create it.
    const isLiked = await prisma?.boardLikes.findUnique({
      where: { userId_boardId: { boardId, userId } },
    });

    if (isLiked) {
      await prisma?.boardLikes.delete({
        where: { userId_boardId: { boardId, userId } },
      });
      return res
        .status(httpStatusCodes[200].code)
        .json(formResponse(httpStatusCodes[200].code, 'Unliked Successfully'));
    }

    await prisma?.boardLikes.create({ data: { boardId, userId } });

    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, 'Liked Successfully'));
  }

  async isBoardLikedByUser(req: Request, res: Response) {
    const boardId = Number(req.query.boardId);
    const userId = Number(req.query.userId);

    if (!boardId) throw new AppError('BoardId is missing', 400);
    if (!userId) throw new AppError('UserId is missing', 400);

    // Execute both queries concurrently
    const [isBoardExist, isUserExist] = await Promise.all([
      prisma?.board.findUnique({ where: { id: boardId } }),
      prisma?.user.findUnique({ where: { id: userId } }),
    ]);

    if (!isBoardExist) throw new AppError('BoardId is Invalid', 400);
    if (!isUserExist) throw new AppError('UserId is Invalid', 400);

    // Toggle like: If exists, delete it. Otherwise, create it.
    const isLiked = await prisma?.boardLikes.findUnique({
      where: { userId_boardId: { boardId, userId } },
    });

    return res.status(httpStatusCodes[200].code).json(
      formResponse(httpStatusCodes[200].code, {
        liked: isLiked ? true : false,
      })
    );
  }

  async createBackgroundImages(req: Request, res: Response) {
    const files = req.files as GroupedFiles;
    const backgroundImage = files.backgroundImage ?? [];
    if (!backgroundImage || !Array.isArray(backgroundImage)) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const imageRecords = await Promise.all(
      backgroundImage.map(async (file: Express.Multer.File) => {
        const filePath = path.join(uploadPath, file.filename);
        const imageId = uuidv4();
        const fileExt = file.mimetype.split('/')[1];
        const s3Key = `uploads/${imageId}.${fileExt}`;
        const finalUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

        const dbEntry = await prisma.backgroundImages.create({
          data: {
            imageUrl: finalUrl,
          },
        });
        const fileBuffer = fs.readFileSync(filePath);

        sendToSQS({
          id: imageId,
          filename: file.originalname,
          mimeType: file.mimetype,
          buffer: fileBuffer.toString('base64'),
          s3Key,
        });

        return dbEntry;
      })
    );

    return res.status(httpStatusCodes[200].code).json(
      formResponse(httpStatusCodes[200].code, {
        message: 'Images stored, processing in background',
        images: imageRecords,
      })
    );
  }

  async createLayoutImages(req: Request, res: Response) {}

  async getRecentlyViewed(req: Request, res: Response) {
    // THIS API IS NOT YET IMPLEMENTED

    const ownerId = req.id; // assuming authentication middleware sets req.id

    if (!ownerId) {
      throw new AppError('Unauthorized', 401);
    }
    const recentlyViewedBoards = await prisma?.board.findMany({
      where: {
        users: {
          some: {
            userId: ownerId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        visibility: true,
        backgroundImg: true,
        description: true,
        archived: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, recentlyViewedBoards));
  }

  async addBoardMember(req: Request, res: Response) {
    const validateData = addBoardMemberScema.parse(req.body);
    const { boardId, userIds } = validateData;

    const isBoardExist = await prisma?.board?.findFirst({
      where: {
        id: +boardId,
      },
      select: {
        id: true,
        workspaceId: true,
      },
    });

    const workSpaceId = await isBoardExist?.workspaceId;

    if (!isBoardExist || !workSpaceId) {
      return res
        .status(httpStatusCodes[404].code)
        .json(formResponse(httpStatusCodes[404].code, 'Invalid Board ID'));
    }

    const foundUsers = await prisma?.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (foundUsers?.length != userIds?.length) {
      return res
        .status(httpStatusCodes[404].code)
        .json(formResponse(httpStatusCodes[404].code, `UserId's are inValid`));
    }

    await prisma?.boardUser.createMany({
      data: userIds.map((userId) => ({
        boardId: +boardId,
        userId,
        role: 'MEMBER',
        status: 'ACTIVE',
      })),
      skipDuplicates: true,
    });

    const result = await prisma?.workSpaceUser.createMany({
      data: userIds.map((userId) => ({
        boardId: +boardId,
        userId,
        workspaceId: +workSpaceId,
        role: 'MEMBER',
      })),
      skipDuplicates: true,
    });

    console.log('Result');
    console.log(result);
    return res
      .status(httpStatusCodes[200].code)
      .json(
        formResponse(
          httpStatusCodes[200].code,
          'Members added to board successfully'
        )
      );
  }
}
