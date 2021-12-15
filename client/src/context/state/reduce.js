import * as type from "./constants";

const initState = {
  birdRect: {},
  delta: 0,
  pipeRects: [],
  pipeCount: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case type.SET_BIRD_RECT:
      return { ...state, birdRect: action.payload };

    case type.SET_DELTA:
      return { ...state, delta: action.payload };

    case type.SET_PIPE_RECTS:
      return { ...state, pipeRects: action.payload };

    case type.SET_PIPE_COUNT:
      return { ...state, pipeCount: action.payload };

    default:
      throw new Error("Invalid action.");
  }
};

export { initState };
export default reducer;
