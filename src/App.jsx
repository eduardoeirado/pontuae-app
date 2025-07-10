import React, { useState } from 'react';
import GameScreen from './components/GameScreen';
import ConfigScreen from './components/ConfigScreen';
import { useGameState } from './hooks/useGameState';
import './App.css';

function App() {
  // Pontuaê abre direto na tela de jogo
  const [currentScreen, setCurrentScreen] = useState('game');
  
  // Configurações padrão do Pontuaê
  const defaultConfig = {
    teamAName: 'Time A',
    teamBName: 'Time B',
    firstServer: 'A',
    maxSets: 3,        // Sempre 3 sets
    gamesPerSet: 6,    // Sempre 6 games
    tieBreakPoints: 7,
    superTieEnabled: false,
    superTiePoints: 10
  };
  
  const { gameState, addPoint, undoLastPoint, resetGame } = useGameState(defaultConfig);

  const handleStartGame = (config) => {
    // Resetar jogo com nova configuração
    resetGame({ ...defaultConfig, ...config });
    setCurrentScreen('game');
  };

  const handleShowConfig = () => {
    setCurrentScreen('config');
  };

  const handleAddPoint = (team) => {
    addPoint(team);
  };

  const handleUndo = () => {
    undoLastPoint();
  };

  const handleNewGame = () => {
    resetGame(defaultConfig);
  };

  return (
    <div className="app">
      {currentScreen === 'config' ? (
        <ConfigScreen 
          onStartGame={handleStartGame}
          defaultConfig={defaultConfig}
        />
      ) : (
        <GameScreen
          gameState={gameState}
          onAddPoint={handleAddPoint}
          onUndo={handleUndo}
          onShowConfig={handleShowConfig}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  );
}

export default App;
