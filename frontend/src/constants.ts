type EnvironmentType = "production" | "development" | "testing";
interface Constants {
  apiUrl: string;
  environment: EnvironmentType;
  enableAnalytics: boolean;
  cypressBaseUrl: string;
}

let constants: Constants = {
  apiUrl: "http://localhost:8000/api",
  environment: process.env.APP_ENV as EnvironmentType,
  enableAnalytics: false,
  cypressBaseUrl: "http://localhost:8081",
};

if (constants.environment === "production") {
  constants.apiUrl = "https://what-ales-you.herokuapp.com/api";
}

if (constants.environment === "testing") {
  constants.cypressBaseUrl = "http://localhost:8080";
}

export const DATE_FORMAT = "MM/DD/YYYY";
export const ACCESS_TOKEN_KEY = "whatalesyou-access-token";
export const REFRESH_TOKEN_KEY = "whatalesyou-refresh-token";

export default constants;
