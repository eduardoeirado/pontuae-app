// Lógica de pontuação do Beach Tennis
export const SCORE_NAMES = ['Love', '15', '30', '40'];

export const createInitialGameState = (config = {}) => {
  return {
    // Configurações do jogo
    config: {
      maxSets: config.maxSets || 3,
      gamesPerSet: config.gamesPerSet || 6,
      tieBreakPoints: config.tieBreakPoints || 7,
      superTiePoints: config.superTiePoints || 10,
      enableSuperTie: config.enableSuperTie || false,
      firstServer: config.firstServer || 'teamA', // 'teamA' ou 'teamB'
      ...config
    },
    
    // Estado atual do jogo
    teamA: {
      name: 'Time A',
      score: 0, // Pontuação atual no game
      games: 0, // Games ganhos no set atual
      sets: 0,  // Sets ganhos
      isServing: config.firstServer === 'teamA'
    },
    
    teamB: {
      name: 'Time B',
      score: 0,
      games: 0,
      sets: 0,
      isServing: config.firstServer === 'teamB'
    },
    
    // Estado do jogo
    currentSet: 1,
    isTieBreak: false,
    isSuperTie: false,
    isGameFinished: false,
    winner: null,
    gameHistory: []
  };
};

export const getScoreDisplay = (score, isTieBreak = false) => {
  if (isTieBreak) {
    return score.toString();
  }
  return SCORE_NAMES[score] || score.toString();
};

export const isDeuce = (teamA, teamB) => {
  return teamA.score >= 3 && teamB.score >= 3 && teamA.score === teamB.score;
};

export const hasAdvantage = (teamA, teamB) => {
  return (teamA.score >= 3 && teamB.score >= 3) && Math.abs(teamA.score - teamB.score) === 1;
};

export const checkGameWin = (gameState) => {
  const { teamA, teamB, isTieBreak, isSuperTie, config } = gameState;
  
  if (isTieBreak || isSuperTie) {
    const targetPoints = isSuperTie ? config.superTiePoints : config.tieBreakPoints;
    
    if (teamA.score >= targetPoints && teamA.score - teamB.score >= 2) {
      return 'teamA';
    }
    if (teamB.score >= targetPoints && teamB.score - teamA.score >= 2) {
      return 'teamB';
    }
  } else {
    // Jogo normal
    if (teamA.score >= 4 && teamA.score - teamB.score >= 2) {
      return 'teamA';
    }
    if (teamB.score >= 4 && teamB.score - teamA.score >= 2) {
      return 'teamB';
    }
  }
  
  return null;
};

export const checkSetWin = (gameState) => {
  const { teamA, teamB, config } = gameState;
  
  if (teamA.games >= config.gamesPerSet && teamA.games - teamB.games >= 2) {
    return 'teamA';
  }
  if (teamB.games >= config.gamesPerSet && teamB.games - teamB.games >= 2) {
    return 'teamB';
  }
  
  return null;
};

export const shouldStartTieBreak = (gameState) => {
  const { teamA, teamB, config } = gameState;
  return teamA.games === config.gamesPerSet && teamB.games === config.gamesPerSet;
};

export const shouldStartSuperTie = (gameState) => {
  const { teamA, teamB, config, currentSet } = gameState;
  const maxSets = config.maxSets;
  const isLastSet = currentSet === maxSets;
  const isTied = teamA.sets === teamB.sets && teamA.sets === Math.floor(maxSets / 2);
  
  return config.enableSuperTie && isLastSet && isTied;
};

export const checkMatchWin = (gameState) => {
  const { teamA, teamB, config } = gameState;
  const setsToWin = Math.ceil(config.maxSets / 2);
  
  if (teamA.sets >= setsToWin) {
    return 'teamA';
  }
  if (teamB.sets >= setsToWin) {
    return 'teamB';
  }
  
  return null;
};

export const addPoint = (gameState, team) => {
  const newState = JSON.parse(JSON.stringify(gameState)); // Deep clone
  
  // Adicionar ponto ao time
  newState[team].score++;
  
  // Adicionar ao histórico
  newState.gameHistory.push({
    team,
    timestamp: Date.now(),
    score: {
      teamA: { ...newState.teamA },
      teamB: { ...newState.teamB }
    }
  });
  
  // Verificar vitória do game
  const gameWinner = checkGameWin(newState);
  
  if (gameWinner) {
    // Resetar pontuação do game
    newState.teamA.score = 0;
    newState.teamB.score = 0;
    
    if (newState.isTieBreak || newState.isSuperTie) {
      // Fim do tie-break ou super tie
      newState[gameWinner].sets++;
      newState.isTieBreak = false;
      newState.isSuperTie = false;
      
      // Verificar vitória da partida
      const matchWinner = checkMatchWin(newState);
      if (matchWinner) {
        newState.isGameFinished = true;
        newState.winner = matchWinner;
        return newState;
      }
      
      // Próximo set
      newState.currentSet++;
      newState.teamA.games = 0;
      newState.teamB.games = 0;
    } else {
      // Game normal ganho
      newState[gameWinner].games++;
      
      // Verificar se deve iniciar tie-break
      if (shouldStartTieBreak(newState)) {
        newState.isTieBreak = true;
      } else {
        // Verificar vitória do set
        const setWinner = checkSetWin(newState);
        if (setWinner) {
          newState[setWinner].sets++;
          
          // Verificar se deve iniciar super tie
          if (shouldStartSuperTie(newState)) {
            newState.isSuperTie = true;
            newState.teamA.games = 0;
            newState.teamB.games = 0;
          } else {
            // Verificar vitória da partida
            const matchWinner = checkMatchWin(newState);
            if (matchWinner) {
              newState.isGameFinished = true;
              newState.winner = matchWinner;
              return newState;
            }
            
            // Próximo set
            newState.currentSet++;
            newState.teamA.games = 0;
            newState.teamB.games = 0;
          }
        }
      }
    }
    
    // Alternar saque (a cada game)
    newState.teamA.isServing = !newState.teamA.isServing;
    newState.teamB.isServing = !newState.teamB.isServing;
  } else if (newState.isTieBreak && (newState.teamA.score + newState.teamB.score) % 2 === 1) {
    // No tie-break, alternar saque a cada 2 pontos (começando após o primeiro ponto)
    newState.teamA.isServing = !newState.teamA.isServing;
    newState.teamB.isServing = !newState.teamB.isServing;
  }
  
  return newState;
};

export const undoLastPoint = (gameState) => {
  if (gameState.gameHistory.length === 0) {
    return gameState;
  }
  
  const newHistory = [...gameState.gameHistory];
  newHistory.pop();
  
  if (newHistory.length === 0) {
    return createInitialGameState(gameState.config);
  }
  
  const lastState = newHistory[newHistory.length - 1].score;
  return {
    ...gameState,
    ...lastState,
    gameHistory: newHistory
  };
};

export const resetGame = (config) => {
  return createInitialGameState(config);
};

