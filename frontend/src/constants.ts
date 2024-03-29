type EnvironmentType = "production" | "development" | "testing";
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
  constants.apiUrl = "https://www.whatalesyou.net/api";
}

export const DATE_FORMAT = "MM/DD/YYYY";
export const ACCESS_TOKEN_KEY = "whatalesyou-access-token";
export const REFRESH_TOKEN_KEY = "whatalesyou-refresh-token";
export const AUTOMATION_USER_PREFIX = "automationUser";

export default constants;
