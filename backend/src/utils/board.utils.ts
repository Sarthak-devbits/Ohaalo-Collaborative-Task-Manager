export const isBoardExist = async (boardId: number) => {
  return await prisma?.board.findFirst({
    where: {
      id: boardId,
    },
  });
};
