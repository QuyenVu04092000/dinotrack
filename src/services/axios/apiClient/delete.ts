import api from "@/services/axios/apiClient/axiosInstance";
import type { IBaseResponse, IReturnData } from "@/types/response/common/IBaseResponse";
import { StatusApisCode } from "@/utilities/constants/common/statusApis";

const apiDeleteClient = async <T>(url: string, data?: any, token?: string): Promise<IReturnData<T>> => {
  const returnData: IReturnData<T> = { error: false, data: {} as IBaseResponse<T> };

  try {
    const result = await api.delete<IBaseResponse<T>>(url, { data });
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

export default apiDeleteClient;
