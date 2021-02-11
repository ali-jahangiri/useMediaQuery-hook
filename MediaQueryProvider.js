import React, { createContext } from "react";

export const MediaContext = createContext();

const DEFAULT_BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

const orderedQuery = [
  {
    sm: 576,
  },
  {
    md: 768,
  },
  {
    lg: 992,
  },
  {
    xl: 1200,
  },
];

const MediaQueryProvider = ({
  mediaQuery = DEFAULT_BREAKPOINTS,
  minWidth,
  maxWidth,
  delayWithPageResize = 250,
  children,
}) => {
  const returnOrderQueryChecker = () => {
    if (!maxWidth && !minWidth) return orderedQuery;
    return undefined;
  };
  return (
    <MediaContext.Provider
      value={{
        mediaQuery,
        delayWithPageResize,
        maxWidth,
        minWidth,
        orderedQuery: returnOrderQueryChecker(),
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export default MediaQueryProvider;
