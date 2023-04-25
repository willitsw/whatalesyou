import constants, { ACCESS_TOKEN_KEY } from "../constants";
import dayjs from "dayjs";
import jwt from "jwt-decode";
import { TokenPayload } from "../types/user";
import { refreshToken } from "./api-calls";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  useAuth?: boolean;
}

interface Response {
  code: number;
  ok: boolean;
  body: any;
}

const makeRequest = async (
  route: string,
  verb: RequestMethod,
  body = {},
  options: RequestOptions = {}
): Promise<Response> => {
  const { useAuth = true } = options;

  const fetchConfig: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    method: verb,
  };

  if (useAuth) {
    let token = localStorage.getItem(ACCESS_TOKEN_KEY);

    const { exp } = jwt(token) as TokenPayload;
    const tokenExpirationInMinutes = dayjs.unix(exp).diff(dayjs(), "minute");
    if (tokenExpirationInMinutes < 30) {
      console.log("fetching a new token");
      await refreshToken();
      token = localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    if (!token) {
      console.log("no token - you actually arent logged in");
    }
    fetchConfig.headers["Authorization"] = "Bearer " + token;
  }

  const url = constants.apiUrl + route;

  if (verb === "POST" || verb === "PUT") {
    fetchConfig.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchConfig);

  let json: any;

  if (response.ok) {
    json = await response.json();
  }

  return {
    code: response.status,
    ok: response.ok,
    body: json,
  };
};

export default makeRequest;
