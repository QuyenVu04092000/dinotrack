// External link (endpoints api)
export const BASE_URL_API = process.env.NEXT_PUBLIC_BASE_URL_API;

export const BASE_URL_API_V1 = BASE_URL_API + "/api/v1";

const Endpoints = {
  AUTHENTICATION: {
    LOGIN: BASE_URL_API_V1 + "/auth/login",
  },
};

export default Endpoints;
