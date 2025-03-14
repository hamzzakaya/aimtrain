import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AimTrainer.css';
import targetImage from '../assets/head.webp';
import gunshotSoundFile from '../assets/gunshot.mp3';

const AimTrainer: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gunshotSound] = useState(new Audio(gunshotSoundFile));

  const generateRandomPosition = useCallback(() => {
    const gameArea = document.getElementById('game-area');
    if (gameArea) {
      const maxX = gameArea.clientWidth - 50;
      const maxY = gameArea.clientHeight - 50;
      setPosition({
        x: Math.random() * maxX,
        y: Math.random() * maxY,
      });
    }
  }, []);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsGameActive(false);
    }
  }, [isGameActive, timeLeft]);

  const handleStart = () => {
    setIsGameActive(true);
    setTimeLeft(60);
    setHits(0);
    setMisses(0);
    generateRandomPosition();
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isGameActive) return;

    const target = document.getElementById('target');
    if (!target) return;

    gunshotSound.currentTime = 0;
    gunshotSound.play();

    const targetRect = target.getBoundingClientRect();
    const clickX = e.clientX;
    const clickY = e.clientY;

    if (
      clickX >= targetRect.left &&
      clickX <= targetRect.right &&
      clickY >= targetRect.top &&
      clickY <= targetRect.bottom
    ) {
      setHits((prev) => prev + 1);
      generateRandomPosition();
    } else {
      setMisses((prev) => prev + 1);
    }
  };

  return (
    <div className="aim-trainer">
      <h1>Ezikler İçin Aim Antrenmanı</h1>
      <div className="stats">
        <div>Kalan Zaman: {timeLeft}s</div>
        <div>İsabet: {hits}</div>
        <div>Iska: {misses}</div>
        <div>Oran: {hits + misses > 0 ? ((hits / (hits + misses)) * 100).toFixed(1) : 0}%</div>
      </div>
      <button 
        className="start-button" 
        onClick={handleStart}
        disabled={isGameActive}
      >
        {isGameActive ? 'Game in Progress' : 'Başla Bakam'}
      </button>
      <div id="game-area" className="game-area" onClick={handleClick}>
        {isGameActive && (
          <img
            id="target"
            src={targetImage}
            alt="Target"
            className="target"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AimTrainer; 