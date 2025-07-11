import React, { useState, useEffect } from 'react';

const GameScreen = ({ gameState, onAddPoint, onUndo, onShowConfig, onNewGame }) => {
  const [animations, setAnimations] = useState({
    scoreA: false,
    scoreB: false,
    gameA: false,
    gameB: false,
    setA: false,
    setB: false
  });

  const scoreDisplay = getScoreDisplay(gameState);

  // Detectar mudanças e ativar animações
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimations({
        scoreA: false,
        scoreB: false,
        gameA: false,
        gameB: false,
        setA: false,
        setB: false
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameState.teamAScore, gameState.teamBScore, gameState.teamAGames, gameState.teamBGames, gameState.teamASets, gameState.teamBSets]);

  const handleAddPoint = (team) => {
    // Ativar animação de pontuação
    if (team === 'A') {
      setAnimations(prev => ({ ...prev, scoreA: true }));
    } else {
      setAnimations(prev => ({ ...prev, scoreB: true }));
    }

    // Vibração no mobile
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    // Chamar função original
    onAddPoint(team);
  };

  const handleUndo = () => {
    // Vibração leve para undo
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    onUndo();
  };

  // Verificar se é deuce
  const isDeuce = !gameState.isTieBreak && !gameState.isSuperTie && 
                  gameState.teamAScore >= 3 && gameState.teamBScore >= 3 && 
                  gameState.teamAScore === gameState.teamBScore;

  return (
    <div className="game-container">
      {/* Linhas da quadra */}
      <div className="court-lines"></div>
      <div className="three-meter-lines three-meter-left"></div>
      <div className="three-meter-lines three-meter-right"></div>

      {/* Header */}
      <div className="game-header">
        <button className="config-button" onClick={onShowConfig}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="white" strokeWidth="2"/>
          </svg>
        </button>
        <h1 className="game-title">Pontuaê</h1>
        <button className="new-game-button" onClick={onNewGame}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12A9 9 0 0 1 12 3A9 9 0 0 1 21 12A9 9 0 0 1 12 21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 12L12 8L16 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Slogan */}
      <div className="slogan">
        Pontuou? Já foi, Pontuaê!
      </div>

      {/* Main Game Area */}
      <div className="game-main">
        {/* Team A Area */}
        <div 
          className={`team-area team-a-area ${animations.gameA ? 'game-animation' : ''} ${animations.setA ? 'set-animation' : ''}`}
          onDoubleClick={() => handleAddPoint('A')}
        >
          <div className="team-info">
            <div className="team-name">{gameState.teamAName}</div>
            <div className="team-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" fill="#2196F3" stroke="white" strokeWidth="4"/>
                <circle cx="20" cy="20" r="8" fill="white"/>
              </svg>
              {/* Ícone de saque */}
              {gameState.currentServer === 'A' && (
                <div className="serve-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8" fill="#FF6B35" stroke="white" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Sets e Games abaixo do jogador */}
            <div className="team-stats">
              <div className="stat-item">
                <div className="stat-label">Sets</div>
                <div className={`stat-value ${animations.setA ? 'set-animation' : ''}`}>
                  {gameState.teamASets}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Games</div>
                <div className={`stat-value ${animations.gameA ? 'game-animation' : ''}`}>
                  {gameState.teamAGames}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Score Area */}
        <div className="center-score-area">
          {/* Botão Undo no topo */}
          <button className="undo-button" onClick={handleUndo}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 7V3H7" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 17A9 9 0 0 0 3 7L7 11" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>voltar pontuação</span>
          </button>

          {/* Indicador de Deuce */}
          {isDeuce && (
            <div className="deuce-indicator">
              DEUCE
            </div>
          )}

          {/* Main Score - CENTRALIZADA E MÁXIMA */}
          <div className="main-score">
            <div 
              className={`score-team-a ${animations.scoreA ? 'score-animation' : ''}`}
            >
              {scoreDisplay.teamA}
            </div>
            <div className="score-separator">
              <div className="separator-line"></div>
            </div>
            <div 
              className={`score-team-b ${animations.scoreB ? 'score-animation' : ''}`}
            >
              {scoreDisplay.teamB}
            </div>
          </div>
        </div>

        {/* Team B Area */}
        <div 
          className={`team-area team-b-area ${animations.gameB ? 'game-animation' : ''} ${animations.setB ? 'set-animation' : ''}`}
          onDoubleClick={() => handleAddPoint('B')}
        >
          <div className="team-info">
            <div className="team-name">{gameState.teamBName}</div>
            <div className="team-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" fill="#FF9800" stroke="white" strokeWidth="4"/>
                <circle cx="20" cy="20" r="8" fill="white"/>
              </svg>
              {/* Ícone de saque */}
              {gameState.currentServer === 'B' && (
                <div className="serve-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8" fill="#FF6B35" stroke="white" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Sets e Games abaixo do jogador */}
            <div className="team-stats">
              <div className="stat-item">
                <div className="stat-label">Sets</div>
                <div className={`stat-value ${animations.setB ? 'set-animation' : ''}`}>
                  {gameState.teamBSets}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Games</div>
                <div className={`stat-value ${animations.gameB ? 'game-animation' : ''}`}>
                  {gameState.teamBGames}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Match Finished Modal */}
      {gameState.isMatchFinished && (
        <div className="match-finished-modal">
          <div className="modal-content">
            <h2>🎾 Pontuou? Já foi, Pontuaê!</h2>
            <p>Vencedor: {gameState.winner === 'A' ? gameState.teamAName : gameState.teamBName}</p>
            <div className="confetti">🎉</div>
            <button onClick={onNewGame} className="new-match-button pulse-animation">
              Nova Partida
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Função auxiliar para exibir pontuação
const getScoreDisplay = (gameState) => {
  const { teamAScore, teamBScore, isTieBreak, isSuperTie } = gameState;
  
  if (isTieBreak || isSuperTie) {
    return {
      teamA: teamAScore.toString(),
      teamB: teamBScore.toString()
    };
  }
  
  // Pontuação 0-15-30-40
  const SCORE_DISPLAY = {
    0: '0',
    1: '15',
    2: '30',
    3: '40'
  };
  
  // Sistema No-Ad - mantém valores quando empata
  if (teamAScore >= 3 && teamBScore >= 3) {
    if (teamAScore === teamBScore) {
      // DEUCE: mantém os valores 40-40
      return { teamA: '40', teamB: '40' };
    }
    return {
      teamA: teamAScore > teamBScore ? 'Ad' : '40',
      teamB: teamBScore > teamAScore ? 'Ad' : '40'
    };
  }
  
  return {
    teamA: SCORE_DISPLAY[Math.min(teamAScore, 3)] || teamAScore.toString(),
    teamB: SCORE_DISPLAY[Math.min(teamBScore, 3)] || teamBScore.toString()
  };
};

export default GameScreen;
