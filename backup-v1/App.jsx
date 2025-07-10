import React, { useState } from 'react';
import GameScreen from './components/GameScreen';
import ConfigScreen from './components/ConfigScreen';
import { useGameState } from './hooks/useGameState';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('config'); // 'config' ou 'game'
  
  const {
    gameState,
    scorePoint,
    undoPoint,
    resetGameState,
    updateTeamName,
    updateConfig
  } = useGameState({
    maxSets: 3,
    gamesPerSet: 6,
    tieBreakPoints: 7,
    superTiePoints: 10,
    enableSuperTie: false,
    firstServer: 'teamA'
  });

  const handleStartGame = () => {
    resetGameState();
    setCurrentScreen('game');
  };

  const handleOpenSettings = () => {
    setCurrentScreen('config');
  };

  const handleBackToGame = () => {
    setCurrentScreen('game');
  };

  return (
    <div className="App">
      {currentScreen === 'config' ? (
        <ConfigScreen
          gameState={gameState}
          onUpdateConfig={updateConfig}
          onUpdateTeamName={updateTeamName}
          onStartGame={handleStartGame}
          onBack={currentScreen === 'config' ? null : handleBackToGame}
        />
      ) : (
        <GameScreen
          gameState={gameState}
          onScorePoint={scorePoint}
          onUndoPoint={undoPoint}
          onUpdateTeamName={updateTeamName}
          onOpenSettings={handleOpenSettings}
        />
      )}
    </div>
  );
}

export default App;

