export enum Visibility {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export interface IEditBoard {
  title?: string;
  visibility?: 'PRIVATE' | 'PUBLIC';
  backgroundImg?: string;
  archived?:boolean
}
