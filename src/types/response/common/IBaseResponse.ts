interface IPaginationResponse {
  page: number;
  limit: number;
  totalRecords: number;
}

interface IImageResponse {
  id: string;
  createdAt: string;
  status: string;
  type: string;
  size: number;
  pathOffline: string;
  urlOnline: string | null;
  title: string;
}

interface IPostImageResponse {
  id: string;
  createdAt: string;
  status: string;
  title: string;
  pathOffline: string;
  urlOnline: null;
  type: string;
  size: number;
}

interface ICity {
  id: string;
  name: string;
  type?: string;
}

interface IDistrict {
  id: string;
  name: string;
  type?: string;
  cityId: string;
}

interface IWard {
  id: string;
  name: string;
  type?: string;
  districtId: string;
}

interface IRegion {
  businessId?: string;
  id: string;
  name: string;
  ordinalNumber?: number;
}

interface IArea {
  id: string;
  name: string;
}

export interface IAddress {
  addressConvert?: string;
  street?: string;
  ward?: IWard;
  district?: IDistrict;
  city?: ICity;
  area?: IArea;
  region?: IRegion;
}

interface IMetaResponse {
  page?: number;
  limit?: number;
  totalRecords?: number;
}

interface IBaseResponse<T = any> {
  message?: string;
  data: T;
  meta?: IMetaResponse;
}

interface IReturnData<T = any> {
  data?: IBaseResponse<T>;
  error: boolean;
  message?: string;
}

interface IErrorMultipleHandleResponse {
  id: string;
  message: string;
}

interface IMultipleHandleResponse {
  countSuccess: number;
  error: IErrorMultipleHandleResponse[];
}
export type {
  IBaseResponse,
  IReturnData,
  IPaginationResponse,
  IMetaResponse,
  IImageResponse,
  IPostImageResponse,
  ICity,
  IDistrict,
  IWard,
  IRegion,
  IArea,
  IMultipleHandleResponse,
};
