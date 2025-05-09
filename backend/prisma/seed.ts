import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

function loadCSV(fileName: string) {
  const content = fs.readFileSync(path.join(__dirname, 'data', fileName));
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
  });
}

async function main() {
  const users = loadCSV('users.csv');
  const workspaces = loadCSV('workspaces.csv');
  const boards = loadCSV('boards.csv');
  const lists = loadCSV('lists.csv');
  const cards = loadCSV('cards.csv');
  const attachments = loadCSV('attachments.csv');
  const comments = loadCSV('comments.csv');
  const labels = loadCSV('labels.csv');
  const boardLikes = loadCSV('board_likes.csv');
  const workspaceUsers = loadCSV('workspace_users.csv');
  const boardUsers = loadCSV('board_users.csv');
  const cardMembers = loadCSV('card_members.csv');

  // Insert in the order of dependencies
  for (const user of users) await prisma.user.create({ data: user });
  for (const workspace of workspaces) await prisma.workSpace.create({ data: workspace });
  for (const board of boards) await prisma.board.create({ data: board });
  for (const list of lists) await prisma.list.create({ data: list });
  for (const card of cards) await prisma.card.create({ data: card });
  for (const attachment of attachments) await prisma.attachment.create({ data: attachment });
  for (const comment of comments) await prisma.comment.create({ data: comment });
  for (const label of labels) await prisma.label.create({ data: label });

  // Many-to-many relationship tables
  for (const like of boardLikes) await prisma.boardLikes.create({ data: like });
  for (const relation of workspaceUsers) await prisma.workSpaceUser.create({ data: relation });
  for (const relation of boardUsers) await prisma.boardUser.create({ data: relation });
  for (const relation of cardMembers) await prisma.cardMember.create({ data: relation });
}

main()
  .catch((e) => {
    console.error('Error inserting data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
