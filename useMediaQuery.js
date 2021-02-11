/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { MediaContext } from "./MediaQueryProvider";

const useMediaQuery = (breakPoint) => {
  const {
    mediaQuery,
    delayWithPageResize,
    orderedQuery,
    maxWidth,
    minWidth,
  } = useContext(MediaContext);

  const [onBreakPoint, setOnBreakPoint] = useState(false);
  let insideBreakPoint = false;
  let outsideOfBreakPoint = false;

  let wantedBreakPoint;
  let nextIndex;
  let nextBreakPoint;
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
  const core = () => {
    let width = document.body.clientWidth + 16;
    const id = setTimeout(() => {
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
        )
          getOutsideAction();
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

      clearTimeout(id);
    }, delayWithPageResize);
  };
  useEffect(() => {
    core(); // RENDERING CHECK FOR WHEN THE FIRST TIME COMPONENT GET RENDERED
    window.addEventListener("resize", core);
    return () => window.removeEventListener("resize");
  }, []);
  return onBreakPoint;
};

export default useMediaQuery;
