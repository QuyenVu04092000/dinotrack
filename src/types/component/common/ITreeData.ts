export interface INode {
  id: string;
  parentId?: string;
  level: number;
  title: string;
  value: any;
  type?: string;
  children?: INode[];
  subContent?: any;
}
