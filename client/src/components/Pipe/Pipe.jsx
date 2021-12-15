import React, { useEffect, useRef, useCallback } from "react";
import clsx from "clsx";
import styles from "./Pipe.module.scss";
import { useStore } from "../../context/store";
import { actions } from "../../context/state";

const HOLE_HEIGHT = 350;
const PIPE_INTERVAL = 1500;
const PIPE_WIDTH = 120;

let pipeSpeed = 0.5;

export default function Pipe({ isPlay }) {
  const pipesRef = useRef([]);
  const timeSinceLastPipe = useRef(PIPE_INTERVAL);

  const [state, dispatch] = useStore();
  const { delta, pipeCount } = state;

  const createPipe = useCallback(() => {
    const topElem = createPipeSegment("top");
    const bottomElem = createPipeSegment("bottom");
    const pipeElem = React.createElement(
      "div",
      {
        className: styles.pipe,
        style: {
          "--hole-top": randomNumberBetween(
            HOLE_HEIGHT * 1.5,
            window.innerHeight - HOLE_HEIGHT * 0.8
          ),
          "--pipe-left": window.innerWidth,
          "--pipe-width": PIPE_WIDTH,
          "--hole-height": HOLE_HEIGHT,
        },
      },
      topElem,
      bottomElem
    );

    pipesRef.current.push(pipeElem);
  }, []);

  const createPipeSegment = (position) => {
    const segment = React.createElement("div", {
      ref: React.createRef(),
      className: clsx(styles.segment, styles[position]),
    });

    return segment;
  };

  const randomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  useEffect(() => {
    if (!isPlay) {
      pipesRef.current = [];
    }

    timeSinceLastPipe.current += delta;

    if (timeSinceLastPipe.current > PIPE_INTERVAL) {
      timeSinceLastPipe.current -= PIPE_INTERVAL;
      createPipe();
    }

    pipesRef.current.forEach((pipe, index) => {
      const pipeLeft = pipe.props.style["--pipe-left"];
      if (pipeLeft + PIPE_WIDTH < 0) {
        dispatch(actions.setPipeCount(pipeCount + 1));
        pipesRef.current.splice(index, 1); // Remove pipe out of view
        pipeSpeed += 0.005;
        return;
      }

      pipesRef.current[index] = {
        ...pipe,
        props: {
          ...pipe.props,
          style: {
            ...pipe.props.style,
            "--pipe-left": pipeLeft - delta * pipeSpeed,
          },
        },
      };
    });
  }, [createPipe, delta, dispatch, isPlay, pipeCount]);

  useEffect(() => {
    const pipeRects = pipesRef.current.flatMap((pipe) => {
      const pipeTopRef = pipe.props.children[0].ref;
      const pipeBottomRef = pipe.props.children[1].ref;

      if (pipeBottomRef.current && pipeBottomRef.current) {
        const pipeTopRect = pipeTopRef.current.getBoundingClientRect();
        const pipeBottomRect = pipeBottomRef.current.getBoundingClientRect();

        return [pipeTopRect, pipeBottomRect];
      }
      return [];
    });

    dispatch(actions.setPipeRects(pipeRects));
  }, [delta, dispatch]);

  return (
    <>
      {pipesRef.current.map((pipe, index) => (
        <div key={index}>{pipe}</div>
      ))}
    </>
  );
}
