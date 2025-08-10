import type { INode } from "@/types/component/common/ITreeData";

export interface IRoleFilter {
  id: string;
  level: number;
  title: string;
  value: string;
  children: IRoleFilter[];
}
export interface IListDistributor extends INode {}
export interface IProductFilter extends INode {}
export interface IProductCategoryFilter extends INode {}
export interface IProductIndustryFilter extends INode {}
export interface IProductStatusFilter extends INode {}
