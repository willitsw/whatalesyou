type EnvironmentType = "production" | "development";
interface Constants {
  apiUrl: string;
  environment: EnvironmentType;
  enableAnalytics: boolean;
}

let constants: Constants = {
  apiUrl: "http://localhost:8000",
  environment: process.env.APP_ENV as EnvironmentType,
  enableAnalytics: false,
};

if (constants.environment === "production") {
  constants.apiUrl =
    "https://6l89tf8fp2.execute-api.us-east-2.amazonaws.com/beer-backend";
}

export const DATE_FORMAT = "MM/DD/YYYY";
export const ACCESS_TOKEN_KEY = "whatalesyou-access-token";
export const REFRESH_TOKEN_KEY = "whatalesyou-refresh-token";

export default constants;
