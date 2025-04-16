export const isListExist = async (listId: number) => {
  return await prisma?.list.findUnique({
    where: {
      id: +listId,
    },
  });
};
