import { ICard } from "./Icard";

export interface IList {
  id: number;
  listName: string;
  position: number;
  cards: ICard[];
}

