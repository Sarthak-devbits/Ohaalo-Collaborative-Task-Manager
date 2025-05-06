import { IBoard } from "./Iboards";
export interface IWorkspaceBase {
  id: number;
  name: string;
}

export interface IWorkspace extends IWorkspaceBase {
  value: number;
}

export interface IWorkspaceDetailed extends IWorkspaceBase {
  boards: IBoard[];
}
