import React from 'react';

const GameScreen = ({ gameState, onAddPoint, onUndo, onShowConfig, onNewGame }) => {
  const scoreDisplay = getScoreDisplay(gameState);
  
  return (
    <div className="game-container">
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
          className="team-area team-a-area"
          onDoubleClick={() => onAddPoint('A')}
        >
          <div className="team-info">
            <div className="team-name">{gameState.teamAName}</div>
            <div className="team-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" fill="#2196F3" stroke="white" strokeWidth="4"/>
                <circle cx="20" cy="20" r="8" fill="white"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Center Score Area */}
        <div className="center-score-area">
          {/* Main Score */}
          <div className="main-score">
            <div className="score-team-a">{scoreDisplay.teamA}</div>
            <div className="score-separator">
              <div className="separator-line"></div>
            </div>
            <div className="score-team-b">{scoreDisplay.teamB}</div>
          </div>

          {/* Undo Button */}
          <button className="undo-button" onClick={onUndo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 7V3H7" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 17A9 9 0 0 0 3 7L7 11" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>voltar pontuação</span>
          </button>

          {/* Sets and Games */}
          <div className="sets-games">
            <div className="sets-games-team-a">
              <div className="sets-label">Sets</div>
              <div className="sets-value">{gameState.teamASets.toString().padStart(2, '0')}</div>
              <div className="games-label">Games</div>
              <div className="games-value">{gameState.teamAGames.toString().padStart(2, '0')}</div>
            </div>
            
            <div className="sets-games-team-b">
              <div className="sets-label">Sets</div>
              <div className="sets-value">{gameState.teamBSets.toString().padStart(2, '0')}</div>
              <div className="games-label">Games</div>
              <div className="games-value">{gameState.teamBGames.toString().padStart(2, '0')}</div>
            </div>
          </div>
        </div>

        {/* Team B Area */}
        <div 
          className="team-area team-b-area"
          onDoubleClick={() => onAddPoint('B')}
        >
          <div className="team-info">
            <div className="team-name">{gameState.teamBName}</div>
            <div className="team-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" fill="#FFD700" stroke="white" strokeWidth="4"/>
                <circle cx="20" cy="20" r="8" fill="white"/>
              </svg>
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
            <button onClick={onNewGame} className="new-match-button">
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
  
  const SCORE_DISPLAY = {
    0: 'Love',
    1: '15',
    2: '30',
    3: '45'  // Pontuaê usa 45
  };
  
  // Sistema No-Ad
  if (teamAScore >= 3 && teamBScore >= 3) {
    if (teamAScore === teamBScore) {
      return { teamA: 'Deuce', teamB: 'Deuce' };
    }
    return {
      teamA: teamAScore > teamBScore ? 'Ad' : '45',
      teamB: teamBScore > teamAScore ? 'Ad' : '45'
    };
  }
  
  return {
    teamA: SCORE_DISPLAY[Math.min(teamAScore, 3)] || teamAScore.toString(),
    teamB: SCORE_DISPLAY[Math.min(teamBScore, 3)] || teamBScore.toString()
  };
};

export default GameScreen;
