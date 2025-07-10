import { useState, useCallback } from 'react';
import { 
  createInitialGameState, 
  addPoint, 
  undoLastPoint, 
  resetGame 
} from '../lib/gameLogic';

export const useGameState = (initialConfig = {}) => {
  const [gameState, setGameState] = useState(() => createInitialGameState(initialConfig));

  const scorePoint = useCallback((team) => {
    setGameState(currentState => addPoint(currentState, team));
  }, []);

  const undoPoint = useCallback(() => {
    setGameState(currentState => undoLastPoint(currentState));
  }, []);

  const resetGameState = useCallback((newConfig) => {
    const config = newConfig || gameState.config;
    setGameState(resetGame(config));
  }, [gameState.config]);

  const updateTeamName = useCallback((team, newName) => {
    setGameState(currentState => ({
      ...currentState,
      [team]: {
        ...currentState[team],
        name: newName
      }
    }));
  }, []);

  const updateConfig = useCallback((newConfig) => {
    setGameState(currentState => ({
      ...currentState,
      config: {
        ...currentState.config,
        ...newConfig
      }
    }));
  }, []);

  return {
    gameState,
    scorePoint,
    undoPoint,
    resetGameState,
    updateTeamName,
    updateConfig
  };
};

