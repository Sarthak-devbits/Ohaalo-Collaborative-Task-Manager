import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      username: 'user1',
      email: 'user1@example.com',
      password: 'password1',
      jwtId: 'jwt1',
      refreshToken: 'refresh1',
    },
    {
      username: 'user2',
      email: 'user2@example.com',
      password: 'password2',
      jwtId: 'jwt2',
      refreshToken: 'refresh2',
    },
    {
      username: 'user3',
      email: 'user3@example.com',
      password: 'password3',
      jwtId: 'jwt3',
      refreshToken: 'refresh3',
    },
    {
      username: 'user4',
      email: 'user4@example.com',
      password: 'password4',
      jwtId: 'jwt4',
      refreshToken: 'refresh4',
    },
    {
      username: 'user5',
      email: 'user5@example.com',
      password: 'password5',
      jwtId: 'jwt5',
      refreshToken: 'refresh5',
    },
    {
      username: 'user6',
      email: 'user6@example.com',
      password: 'password6',
      jwtId: 'jwt6',
      refreshToken: 'refresh6',
    },
    {
      username: 'user7',
      email: 'user7@example.com',
      password: 'password7',
      jwtId: 'jwt7',
      refreshToken: 'refresh7',
    },
    {
      username: 'user8',
      email: 'user8@example.com',
      password: 'password8',
      jwtId: 'jwt8',
      refreshToken: 'refresh8',
    },
    {
      username: 'user9',
      email: 'user9@example.com',
      password: 'password9',
      jwtId: 'jwt9',
      refreshToken: 'refresh9',
    },
    {
      username: 'user10',
      email: 'user10@example.com',
      password: 'password10',
      jwtId: 'jwt10',
      refreshToken: 'refresh10',
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
