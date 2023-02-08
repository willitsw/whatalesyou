import constants, { ACCESS_TOKEN_KEY } from "../constants";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

const makeRequest = async (route: string, verb: RequestMethod, body = {}) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY) || "no token";
  const url = constants.apiUrl + route;
  const fetchConfig: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: "Bearer " + token,
    },
    method: verb,
  };

  if (verb === "POST" || verb === "PUT") {
    fetchConfig.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchConfig);
  return response.json();
};

export default makeRequest;
