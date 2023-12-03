type EnvironmentType = "production" | "development";
interface Constants {
  apiUrl: string;
  environment: EnvironmentType;
  enableAnalytics: boolean;
}

let constants: Constants = {
  apiUrl: "http://localhost:8000/api",
  environment: process.env.APP_ENV as EnvironmentType,
  enableAnalytics: false,
};

if (constants.environment === "production") {
  constants.apiUrl = "https://what-ales-you.herokuapp.com/api";
}

export const DATE_FORMAT = "MM/DD/YYYY";
export const ACCESS_TOKEN_KEY = "whatalesyou-access-token";
export const REFRESH_TOKEN_KEY = "whatalesyou-refresh-token";

export default constants;
