import React, { useContext, useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";
import constants from "../constants";
import { selectBrewSettings } from "../redux/brew-settings";
import { useAppSelector } from "../redux/store";
import { selectCurrentUser } from "../redux/user";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

interface AnalyticsData {
  userId: string;
  email: string;
  environment: string;
  userAgent: string;
}

function getDefaultAnalyticsData(): AnalyticsData {
  return {
    userId: "",
    email: "",
    environment: constants.environment,
    userAgent: window.navigator.userAgent,
  };
}

function sendEvent(name: string, payload: any): void {
  if (constants.enableAnalytics) {
    ReactGA.event(name, payload);
  }
}

const AnalyticsContext = React.createContext<{
  analyticsData: AnalyticsData;
  shouldSendEvents: boolean;
}>(null);

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(null);
  const location = useLocation();
  const user = useAppSelector(selectCurrentUser);
  const brewSettings = useAppSelector(selectBrewSettings);

  useEffect(() => {
    if (!isInitialized && constants.enableAnalytics) {
      ReactGA.initialize("G-4HGTT0YXYQ");
      setIsInitialized(true);
    }
  }, [isInitialized, constants]);

  useEffect(() => {
    if (constants.enableAnalytics) {
      let newData: AnalyticsData;
      if (user) {
        newData = {
          userId: user.id,
          email: user.email,
          environment: constants.environment,
          userAgent: window.navigator.userAgent,
        };
      } else {
        newData = getDefaultAnalyticsData();
      }

      setAnalyticsData(newData);
      ReactGA.set(newData);
    }
  }, [user, brewSettings]);

  useEffect(() => {
    if (isInitialized && constants.enableAnalytics) {
      ReactGA.send({
        hitType: "pageview",
        page_title: location.pathname,
      });
    }
  }, [location.pathname]);

  return (
    <AnalyticsContext.Provider
      value={{
        analyticsData,
        shouldSendEvents: isInitialized && constants.enableAnalytics,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const { analyticsData, shouldSendEvents } = useContext(AnalyticsContext);

  function fireAnalyticsEvent(
    eventName: string,
    extraParams: { [key: string]: any } = {}
  ) {
    if (shouldSendEvents) {
      const eventPayload = {
        ...analyticsData,
        ...extraParams,
      };
      sendEvent(eventName, eventPayload);
    }
  }

  return { fireAnalyticsEvent };
};
