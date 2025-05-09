import { WorkSpaceRole } from '@prisma/client';
import { Router } from 'express';
import { Response, Request } from 'express';

export const testRoutes = Router();

testRoutes.get('/test', async (req: Request, res: Response) => {
  //   Question 1
  //   const boardsOwnedByUsersInWorkspace = await prisma?.board.findMany({
  //     where: {
  //       owner: {
  //         workSpaceUser: {
  //           some: {
  //             role: 'OWNER',
  //           },
  //         },
  //       },
  //     },
  //   });

  // Question 2
  //   const inThreeDays = new Date(now);
  //   const now = new Date();
  //   const cardsData = await prisma?.card?.findMany({
  //   inThreeDays.setDate(inThreeDays.getDate() + 3);
  //     where: {
  //       AND: [
  //         {
  //           member: {
  //             some: {
  //               user: {
  //                 email: {
  //                   endsWith: '@example.com',
  //                 },
  //               },
  //             },
  //           },
  //         },
  //         {
  //           dueDate: {
  //             gte: now,
  //             lte: inThreeDays,
  //           },
  //         },
  //       ],
  //     },
  //   });

  // Question 3
  //   const workSpaceWithManyMembers = await prisma?.workSpaceUser?.groupBy({
  //     by: ['workspaceId'],
  //     where: {
  //       role: 'MEMBER',
  //     },
  //     _count: {
  //       userId: true,
  //     },
  //     having: {
  //       userId: {
  //         _count: {
  //           gt: 5,
  //         },
  //       },
  //     },
  //   });

  //   const workSpaceId = workSpaceWithManyMembers?.map((item) => item.workspaceId);

  //   let workspaceData = await prisma?.workSpace?.findMany({
  //     where: {
  //       id: {
  //         in: workSpaceId,
  //       },
  //     },
  //     select: {
  //       id: true,
  //       name: true,
  //     },
  //   });

  //   const result = workspaceData?.map((workspace) => {
  //     const memberCount = workSpaceWithManyMembers?.find(
  //       (data) => data.workspaceId == workspace.id
  //     )?._count.userId;

  //     return {
  //       ...workspace,
  //       memberCount,
  //     };
  //   });

  // Question 4
  //   const comments = await prisma?.comment?.findMany({
  //     include: {
  //       user: {
  //         include: {
  //           likedBoards: {
  //             select: {
  //               boardId: true,
  //               board: {
  //                 select: {
  //                   title: true,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       card: {
  //         include: {
  //           list: {
  //             include: {
  //               board: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  //   const formatedComments = comments?.filter((comment) => {
  //     const likedBoardByCommenterIds = comment.user.likedBoards.map(
  //       (item) => item.boardId
  //     );
  //     const commentBoardId = comment.card.list.boardId;
  //     return likedBoardByCommenterIds.includes(commentBoardId);
  //   });

  //Question 5
  // List all boards that contain at least one card assigned to a user whose email ends with '@example.com', and include the board's title, the list // title, and the card title.

  cardId:24

  res.json({
    data: [],
  });
});
