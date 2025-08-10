export interface IRegion {
  id: string;
  name: string;
}

export interface ICity {
  id: string;
  name: string;
  region: IRegion;
}

export interface IDistrict {
  id: string;
  name: string;
  city: ICity;
}

export interface IWard {
  id: string;
  name: string;
  district: IDistrict;
}
