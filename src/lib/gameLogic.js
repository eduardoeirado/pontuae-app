// Pontuaê - Lógica de pontuação do Beach Tennis

export const SCORE_DISPLAY = {
  0: 'Love',
  1: '15',
  2: '30',
  3: '45'  // Pontuaê usa 45 ao invés de 40
};

export const createInitialGameState = (config = {}) => {
  return {
    // Configurações padrão do Pontuaê
    maxSets: config.maxSets || 3,
    gamesPerSet: config.gamesPerSet || 6,
    tieBreakPoints: config.tieBreakPoints || 7,
    superTiePoints: config.superTiePoints || 10,
    superTieEnabled: config.superTieEnabled || false,
    firstServer: config.firstServer || 'A',
    
    // Nomes dos times
    teamAName: config.teamAName || 'Time A',
    teamBName: config.teamBName || 'Time B',
    
    // Estado do jogo
    teamAScore: 0,
    teamBScore: 0,
    teamAGames: 0,
    teamBGames: 0,
    teamASets: 0,
    teamBSets: 0,
    
    // Estado atual
    currentSet: 1,
    isGameFinished: false,
    isMatchFinished: false,
    winner: null,
    
    // Tie-break
    isTieBreak: false,
    isSuperTie: false,
    
    // Saque
    currentServer: config.firstServer || 'A',
    
    // Histórico
    history: []
  };
};

export const addPoint = (gameState, team) => {
  if (gameState.isMatchFinished) {
    return gameState;
  }

  const newState = { ...gameState };
  
  // Salvar estado no histórico
  newState.history = [...gameState.history, { ...gameState }];
  
  // Adicionar ponto
  if (team === 'A') {
    newState.teamAScore++;
  } else {
    newState.teamBScore++;
  }
  
  // Verificar se game foi ganho
  const gameResult = checkGameWon(newState);
  
  if (gameResult.gameWon) {
    // Resetar pontos
    newState.teamAScore = 0;
    newState.teamBScore = 0;
    
    // Adicionar game
    if (gameResult.winner === 'A') {
      newState.teamAGames++;
    } else {
      newState.teamBGames++;
    }
    
    // Verificar se set foi ganho
    const setResult = checkSetWon(newState);
    
    if (setResult.setWon) {
      // Adicionar set
      if (setResult.winner === 'A') {
        newState.teamASets++;
      } else {
        newState.teamBSets++;
      }
      
      // Resetar games
      newState.teamAGames = 0;
      newState.teamBGames = 0;
      newState.currentSet++;
      
      // Sair de tie-break se estiver
      newState.isTieBreak = false;
      newState.isSuperTie = false;
      
      // Verificar se match foi ganho
      const matchResult = checkMatchWon(newState);
      
      if (matchResult.matchWon) {
        newState.isMatchFinished = true;
        newState.winner = matchResult.winner;
        return newState;
      }
      
      // Verificar se próximo set é super tie
      if (newState.superTieEnabled && 
          newState.currentSet > newState.maxSets && 
          newState.teamASets === newState.teamBSets) {
        newState.isSuperTie = true;
      }
    }
    
    // Verificar se deve entrar em tie-break
    if (!newState.isSuperTie && 
        newState.teamAGames === newState.gamesPerSet && 
        newState.teamBGames === newState.gamesPerSet) {
      newState.isTieBreak = true;
    }
  }
  
  return newState;
};

const checkGameWon = (gameState) => {
  const { teamAScore, teamBScore, isTieBreak, isSuperTie, tieBreakPoints, superTiePoints } = gameState;
  
  if (isTieBreak) {
    // Tie-break: primeiro a atingir tieBreakPoints com diferença de 2
    const minPoints = tieBreakPoints;
    if ((teamAScore >= minPoints && teamAScore - teamBScore >= 2) ||
        (teamBScore >= minPoints && teamBScore - teamAScore >= 2)) {
      return {
        gameWon: true,
        winner: teamAScore > teamBScore ? 'A' : 'B'
      };
    }
  } else if (isSuperTie) {
    // Super tie: primeiro a atingir superTiePoints com diferença de 2
    const minPoints = superTiePoints;
    if ((teamAScore >= minPoints && teamAScore - teamBScore >= 2) ||
        (teamBScore >= minPoints && teamBScore - teamAScore >= 2)) {
      return {
        gameWon: true,
        winner: teamAScore > teamBScore ? 'A' : 'B'
      };
    }
  } else {
    // Game normal: sistema No-Ad
    if (teamAScore >= 4 || teamBScore >= 4) {
      if (teamAScore >= 4 && teamBScore <= 2) {
        return { gameWon: true, winner: 'A' };
      }
      if (teamBScore >= 4 && teamAScore <= 2) {
        return { gameWon: true, winner: 'B' };
      }
      if (teamAScore >= 3 && teamBScore >= 3) {
        // Deuce - próximo ponto ganha (No-Ad)
        if (teamAScore > teamBScore) {
          return { gameWon: true, winner: 'A' };
        }
        if (teamBScore > teamAScore) {
          return { gameWon: true, winner: 'B' };
        }
      }
    }
  }
  
  return { gameWon: false };
};

const checkSetWon = (gameState) => {
  const { teamAGames, teamBGames, gamesPerSet, isTieBreak, isSuperTie } = gameState;
  
  if (isTieBreak || isSuperTie) {
    // Tie-break ou Super tie decide o set
    return {
      setWon: true,
      winner: teamAGames > teamBGames ? 'A' : 'B'
    };
  }
  
  // Set normal: primeiro a atingir gamesPerSet com diferença de 2
  if ((teamAGames >= gamesPerSet && teamAGames - teamBGames >= 2) ||
      (teamBGames >= gamesPerSet && teamBGames - teamAGames >= 2)) {
    return {
      setWon: true,
      winner: teamAGames > teamBGames ? 'A' : 'B'
    };
  }
  
  return { setWon: false };
};

const checkMatchWon = (gameState) => {
  const { teamASets, teamBSets, maxSets } = gameState;
  
  // Calcular sets necessários para ganhar
  const setsToWin = Math.ceil(maxSets / 2);
  
  if (teamASets >= setsToWin) {
    return { matchWon: true, winner: 'A' };
  }
  
  if (teamBSets >= setsToWin) {
    return { matchWon: true, winner: 'B' };
  }
  
  return { matchWon: false };
};

export const undoLastPoint = (gameState) => {
  if (gameState.history.length === 0) {
    return gameState;
  }
  
  // Retornar ao estado anterior
  const previousState = gameState.history[gameState.history.length - 1];
  return {
    ...previousState,
    history: gameState.history.slice(0, -1)
  };
};

export const getScoreDisplay = (gameState) => {
  const { teamAScore, teamBScore, isTieBreak, isSuperTie } = gameState;
  
  if (isTieBreak || isSuperTie) {
    return {
      teamA: teamAScore.toString(),
      teamB: teamBScore.toString()
    };
  }
  
  // Sistema No-Ad com pontuação Pontuaê (45 ao invés de 40)
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

export const resetGame = (config) => {
  return createInitialGameState(config);
};
