import api from "@/services/axios/apiClient/axiosInstance";
import type { IBaseResponse, IReturnData } from "@/types/response/common/IBaseResponse";
import { StatusApisCode } from "@/utilities/constants/common/statusApis";

const apiGetClient = async <T>(url: string, params?: any, token?: string): Promise<IReturnData<T>> => {
  const returnData: IReturnData<T> = { error: false, data: {} as IBaseResponse<T> };

  try {
    const result = await api.get<IBaseResponse<T>>(url, { params });
    if (!StatusApisCode.ERROR.includes(result.status)) {
      returnData.data = result.data;
    } else {
      returnData.error = true;
    }
  } catch (error) {
    returnData.error = true;
  }

  return returnData;
};

export default apiGetClient;
