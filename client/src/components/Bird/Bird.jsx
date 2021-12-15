import React, { useEffect, useRef } from "react";
import styles from "./Bird.module.scss";
import { useStore } from "../../context/store";
import { actions } from "../../context/state";

const BIRD_SPEED = 0.4;
const JUMP_DURATION = 180;

export default function Bird({ isGamePaused, isPlay }) {
  const timeSinceLastJumpRef = useRef(Number.POSITIVE_INFINITY);
  const birdRef = useRef(null);

  const [state, dispatch] = useStore();
  const { delta } = state;

  useEffect(() => {
    if (isGamePaused) return;
    const birdHeight = birdRef.current.clientHeight;
    setTop(window.innerHeight / 2 - birdHeight / 2); // Setup Bird start in middle browser height
    window.removeEventListener("keydown", handleJump);
    window.addEventListener("keydown", handleJump);
  }, [isGamePaused]);

  useEffect(() => {
    if (timeSinceLastJumpRef.current < JUMP_DURATION) {
      setTop(getTop() - BIRD_SPEED * delta);
      birdRef.current.style.transform = "rotate(-30deg)";
    } else {
      setTop(getTop() + BIRD_SPEED * delta);
      if (!isPlay) return;
      birdRef.current.style.transform = "rotate(30deg)";
    }
    timeSinceLastJumpRef.current += delta;
  }, [delta, isPlay]);

  useEffect(() => {
    const birdRect = birdRef.current.getBoundingClientRect();
    dispatch(actions.setBirdRect(birdRect));
  }, [delta, dispatch]);

  const setTop = (top) => {
    birdRef.current.style.setProperty("--bird-top", top);
  };

  const getTop = () => {
    return parseFloat(getComputedStyle(birdRef.current).getPropertyValue("--bird-top"));
  };

  const handleJump = (e) => {
    if (e.code !== "Space") return;

    timeSinceLastJumpRef.current = 0;
  };

  return <div ref={birdRef} className={styles.bird}></div>;
}
