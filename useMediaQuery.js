/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { MediaContext } from "./MediaQueryProvider";

function debounce(func, wait, immediate) {
  var timeout;
  return function executedFunction() {
    var context = this;
    var args = arguments;
        
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    
    clearTimeout(timeout);

    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
};

const useMediaQuery = (breakPoint) => {
  const {
    mediaQuery,
    delayWithPageResize,
    orderedQuery,
    maxWidth,
    minWidth,
  } = useContext(MediaContext);

  let insideBreakPoint = false;
  let outsideOfBreakPoint = false;
  let wantedBreakPoint;
  let nextIndex;
  let nextBreakPoint;
  
  const [onBreakPoint, setOnBreakPoint] = useState(() => {
    let width = document.body.clientWidth + 16;
    console.log(orderedQuery , mediaQuery);
    // declare wantedBreakPoint 
    if (orderedQuery) {
      wantedBreakPoint = orderedQuery.filter((el) => el[breakPoint])[0][
        breakPoint
      ];
      if (breakPoint === "xl") nextBreakPoint = 99999999;
      else {
        nextIndex = orderedQuery.findIndex((el) => el[breakPoint]);
        nextBreakPoint = Object.values(orderedQuery[++nextIndex])[0];
      }
    }
    
    // inside ORDERED QUERY
      if (orderedQuery && !maxWidth && !minWidth) {
        
        if (
          width >= wantedBreakPoint &&
          width <= nextBreakPoint &&
          !insideBreakPoint
        ) {
          return true
        }
        if (
          width <= wantedBreakPoint ||
          (width >= nextBreakPoint && !outsideOfBreakPoint)
        ) {
          return false
        }
      }
      // inside MIN WIDTH
      else if (minWidth) {
        if (!outsideOfBreakPoint && mediaQuery[breakPoint] >= width)
          return false
        if (!insideBreakPoint && mediaQuery[breakPoint] <= width)
          return true
      }
      // inside MAX WIDTH
      else {
        if (!outsideOfBreakPoint && mediaQuery[breakPoint] <= width)
          return false
        if (!insideBreakPoint && mediaQuery[breakPoint] >= width)
          return true
      }
  });
  
  
  if (orderedQuery) {
    wantedBreakPoint = orderedQuery.filter((el) => el[breakPoint])[0][
      breakPoint
    ];
    if (breakPoint === "xl") nextBreakPoint = 99999999;
    else {
      nextIndex = orderedQuery.findIndex((el) => el[breakPoint]);
      nextBreakPoint = Object.values(orderedQuery[++nextIndex])[0];
    }
  }
  const reachInsideAction = () => {
    setOnBreakPoint(true);
    insideBreakPoint = true;
    outsideOfBreakPoint = false;
  };
  const getOutsideAction = () => {
    setOnBreakPoint(false);
    outsideOfBreakPoint = true;
    insideBreakPoint = false;
  };

  const coreFunctionality = () => {

    let width = document.body.clientWidth + 16;
    // inside ORDERED QUERY
      if (orderedQuery && !maxWidth && !minWidth) {
        if (
          width >= wantedBreakPoint &&
          width <= nextBreakPoint &&
          !insideBreakPoint
        ) {
          reachInsideAction();
        }
        if (
          width <= wantedBreakPoint ||
          (width >= nextBreakPoint && !outsideOfBreakPoint)
        ) {
          getOutsideAction();
        }
      }
      // inside MIN WIDTH
      else if (minWidth) {
        if (!outsideOfBreakPoint && mediaQuery[breakPoint] >= width)
          getOutsideAction();
        if (!insideBreakPoint && mediaQuery[breakPoint] <= width)
          reachInsideAction();
      }
      // inside MAX WIDTH
      else {
        if (!outsideOfBreakPoint && mediaQuery[breakPoint] <= width)
          getOutsideAction();
        if (!insideBreakPoint && mediaQuery[breakPoint] >= width)
          reachInsideAction();
      }
      return onBreakPoint;
  }
  useEffect(() => {
    
    window.addEventListener("resize", debounce(coreFunctionality , delayWithPageResize));
    return () => window.removeEventListener("resize" , () => {});
  }, []);

  return onBreakPoint
};

export default useMediaQuery;