export interface IBaseRequest {
  businessId?: string;
  search?: string;
  chanelIds?: string;
  productCategoryIds?: string;
  productIndustryIds?: string;
  statuses?: string;
  page?: number;
  limit?: number;
  userId?: string;
  userIds?: string;
  distributorIds?: string;
  regionIds?: string;
  areaIds?: string;
  customerTypeIds?: string;
  channelIds?: string;
  warehouseIds?: string;
  startDate?: string;
  endDate?: string;
}
