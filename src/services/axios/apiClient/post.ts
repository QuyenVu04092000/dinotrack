import api from "@/services/axios/apiClient/axiosInstance";
import type { IBaseResponse, IReturnData } from "@/types/response/common/IBaseResponse";
import { StatusApisCode } from "@/utilities/constants/common/statusApis";
import type { AxiosProgressEvent } from "axios";

const apiPostClient = async <T>(
  url: string,
  data: any,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<IReturnData<T>> => {
  const returnData: IReturnData<T> = { error: false, data: {} as IBaseResponse<T> };
  try {
    const result = await api.post<IBaseResponse<T>>(url, data, {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onUploadProgress) {
          onUploadProgress(progressEvent);
        }
      },
    });
    if (!StatusApisCode.ERROR.includes(result.status)) {
      returnData.data = result.data;
    } else {
      returnData.error = true;
      returnData.message = result?.data?.message;
    }
  } catch (error: any) {
    returnData.error = true;
    returnData.message = error?.response?.data?.message;
  }
  return returnData;
};

export default apiPostClient;
