import api from "@/services/axios/apiClient/axiosInstance";
import type { IBaseResponse, IReturnData } from "@/types/response/common/IBaseResponse";
import { StatusApisCode } from "@/utilities/constants/common/statusApis";

const apiPutClient = async <T>(url: string, data?: any, token?: string): Promise<IReturnData<T>> => {
  const returnData: IReturnData<T> = { error: false, data: {} as IBaseResponse<T> };
  try {
    const result = await api.put<IBaseResponse<T>>(url, data);
    if (!StatusApisCode.ERROR.includes(result.status)) {
      returnData.data = result.data;
    } else {
      returnData.error = true;
      returnData.message = result.data.message;
    }
  } catch (error: any) {
    console.error(error);
    returnData.error = true;
    returnData.message = error.response.data.message;
  }
  return returnData;
};

export default apiPutClient;
