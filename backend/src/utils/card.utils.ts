export const isCardExists = async (cardId: number) => {
  return await prisma?.card.findFirst({
    where: {
      id: cardId,
    },
  });
};
