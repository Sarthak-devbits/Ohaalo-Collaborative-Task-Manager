export interface IBoard {
  id: number;
  ownerId: number;
  title: string;
  backgroundImg: string;
  visibility: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  description: string;
  workspaceId: number;
}
