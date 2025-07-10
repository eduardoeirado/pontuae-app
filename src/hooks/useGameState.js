import { useState, useCallback } from 'react';
import { createInitialGameState, addPoint, undoLastPoint, resetGame } from '../lib/gameLogic';

export const useGameState = (initialConfig = {}) => {
  const [gameState, setGameState] = useState(() => createInitialGameState(initialConfig));

  const handleAddPoint = useCallback((team) => {
    setGameState(currentState => {
      if (currentState.isMatchFinished) {
        return currentState;
      }
      return addPoint(currentState, team);
    });
  }, []);

  const handleUndo = useCallback(() => {
    setGameState(currentState => undoLastPoint(currentState));
  }, []);

  const handleReset = useCallback((config = {}) => {
    setGameState(resetGame(config));
  }, []);

  const updateConfig = useCallback((config) => {
    setGameState(currentState => ({
      ...currentState,
      ...config
    }));
  }, []);

  return {
    gameState,
    addPoint: handleAddPoint,
    undoLastPoint: handleUndo,
    resetGame: handleReset,
    updateConfig
  };
};
