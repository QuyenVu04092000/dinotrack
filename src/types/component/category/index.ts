export interface IUserCategory {
  id: string;
  name: string;
  code?: string;
  subCategories: IUserSubCategory[];
}

export interface IUserSubCategory {
  id: string;
  name: string;
  code?: string;
  icon: string;
}
