import React, { useState, useEffect, useRef, useCallback } from "react";

import styles from "./Game.module.scss";
import Bird from "../Bird/Bird";
import Pipe from "../Pipe/Pipe";
import { useStore } from "../../context/store";
import { actions } from "../../context/state";
import * as numbers from "../../assets/images";
import * as audio from "../../assets/audio";

export default function Game() {
  const [isPlay, setIsPlay] = useState(false);
  const [isLose, setIsLose] = useState(false);

  const baseRef = useRef();
  const pointAudioRef = useRef();
  const hitAudioRef = useRef();

  const lastTimeRef = useRef();
  const requestRef = useRef();

  const [state, dispatch] = useStore();
  const { birdRect, pipeRects, pipeCount } = state;

  const updateLoop = useCallback(
    (time) => {
      if (lastTimeRef.current) {
        const delta = time - lastTimeRef.current;
        dispatch(actions.setDelta(delta));
      }

      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(updateLoop);
    },
    [dispatch]
  );

  const handleStart = useCallback(() => {
    setIsPlay(true);
    setIsLose(false);
    dispatch(actions.setPipeCount(0));
    lastTimeRef.current = null;
    requestRef.current = requestAnimationFrame(updateLoop);
  }, [dispatch, updateLoop]);

  const isCollision = (rect1, rect2) => {
    return (
      rect1?.left < rect2?.right &&
      rect1?.top < rect2?.bottom &&
      rect1?.right > rect2?.left &&
      rect1?.bottom > rect2?.top
    );
  };

  const checkLose = useCallback(() => {
    const baseHeight = baseRef.current.clientHeight;
    const insidePipe = pipeRects?.some((rect) => isCollision(birdRect, rect));
    const outsideWorld = birdRect?.top < 0 || birdRect?.bottom > window.innerHeight - baseHeight;

    return outsideWorld || insidePipe;
  }, [birdRect, pipeRects]);

  const handleLose = useCallback(() => {
    cancelAnimationFrame(requestRef.current);
    hitAudioRef.current.play();
    setIsLose(true);
    setIsPlay(false);

    setTimeout(() => {
      window.addEventListener("keypress", handleStart, { once: true });
    }, 100);
  }, [handleStart]);

  const createPoint = (point) => {
    const arrayStringPoint = Array.from(point.toString()).map(Number);
    const customPoint = arrayStringPoint.map((point) => numbers[`number${point}`]);

    return customPoint.map((point, index) => <img key={index} src={point} alt="" />);
  };

  useEffect(() => {
    window.addEventListener("keypress", handleStart, { once: true });
  }, [handleStart]);

  useEffect(() => {
    if (checkLose()) {
      handleLose();
    }
  }, [checkLose, handleLose]);

  useEffect(() => {
    if (isPlay && pipeCount !== 0) {
      pointAudioRef.current.play();
    }
  }, [isPlay, pipeCount]);

  return (
    <div className={styles.game}>
      <div className={styles.base} ref={baseRef} />
      {isLose && <div className={styles.gameOver} />}
      {isPlay && (
        <div>
          <span className={styles.point}>{createPoint(pipeCount)}</span>
          <audio ref={pointAudioRef} className={styles.audio} src={audio.pointAudio}></audio>
        </div>
      )}
      <audio ref={hitAudioRef} src={audio.hitAudio}></audio>
      {!isPlay && (
        <>
          <h1 className={styles.title}>
            Press Any Key To Start
            {isLose && <small className={styles.subtitle}>{createPoint(pipeCount)}</small>}
          </h1>
        </>
      )}
      <Bird isGamePaused={!isPlay && isLose} isPlay={isPlay} />
      <Pipe isPlay={isPlay} />
    </div>
  );
}
