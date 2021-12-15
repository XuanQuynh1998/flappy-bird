import * as type from "./constants";

export const setBirdRect = (payload) => ({
  type: type.SET_BIRD_RECT,
  payload,
});

export const setDelta = (payload) => ({
  type: type.SET_DELTA,
  payload,
});

export const setPipeRects = (payload) => ({
  type: type.SET_PIPE_RECTS,
  payload,
});

export const setPipeCount = (payload) => ({
  type: type.SET_PIPE_COUNT,
  payload,
});
