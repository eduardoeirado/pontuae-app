// Lógica de pontuação do Beach Tennis - Pontuaê v3

export const createInitialGameState = (config = {}) => {
  return {
    teamAName: config.teamAName || 'Time A',
    teamBName: config.teamBName || 'Time B',
    teamAScore: 0,
    teamBScore: 0,
    teamAGames: 0,
    teamBGames: 0,
    teamASets: 0,
    teamBSets: 0,
    isMatchFinished: false,
    winner: null,
    isTieBreak: false,
    isSuperTie: false,
    currentServer: config.firstServer || 'A', // Quem está sacando
    
    // Configurações
    maxSets: config.maxSets || 3,
    gamesPerSet: config.gamesPerSet || 6,
    tieBreakPoints: config.tieBreakPoints || 7,
    superTiePoints: config.superTiePoints || 10,
    enableSuperTie: config.enableSuperTie || false
  };
};

export const addPoint = (gameState, team) => {
  const newState = { ...gameState };
  
  if (newState.isMatchFinished) {
    return newState;
  }

  // Adicionar ponto
  if (team === 'A') {
    newState.teamAScore++;
  } else {
    newState.teamBScore++;
  }

  // Verificar se ganhou o game
  const gameResult = checkGameWin(newState);
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

    // Alternar servidor a cada game
    newState.currentServer = newState.currentServer === 'A' ? 'B' : 'A';

    // Verificar se ganhou o set
    const setResult = checkSetWin(newState);
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
      newState.isTieBreak = false;
      newState.isSuperTie = false;

      // Verificar se ganhou a partida
      const matchResult = checkMatchWin(newState);
      if (matchResult.matchWon) {
        newState.isMatchFinished = true;
        newState.winner = matchResult.winner;
      }
    }
  }

  return newState;
};

const checkGameWin = (gameState) => {
  const { teamAScore, teamBScore, isTieBreak, isSuperTie, tieBreakPoints, superTiePoints } = gameState;

  if (isTieBreak) {
    // Tie-break: primeiro a atingir tieBreakPoints com diferença de 2
    if (teamAScore >= tieBreakPoints && teamAScore - teamBScore >= 2) {
      return { gameWon: true, winner: 'A' };
    }
    if (teamBScore >= tieBreakPoints && teamBScore - teamAScore >= 2) {
      return { gameWon: true, winner: 'B' };
    }
  } else if (isSuperTie) {
    // Super tie: primeiro a atingir superTiePoints com diferença de 2
    if (teamAScore >= superTiePoints && teamAScore - teamBScore >= 2) {
      return { gameWon: true, winner: 'A' };
    }
    if (teamBScore >= superTiePoints && teamBScore - teamAScore >= 2) {
      return { gameWon: true, winner: 'B' };
    }
  } else {
    // Game normal: sistema No-Ad
    // Primeiro a 4 pontos ganha, exceto se empatar em 3-3 (deuce)
    if (teamAScore >= 4 && teamAScore - teamBScore >= 2) {
      return { gameWon: true, winner: 'A' };
    }
    if (teamBScore >= 4 && teamBScore - teamAScore >= 2) {
      return { gameWon: true, winner: 'B' };
    }
    
    // Sistema No-Ad: se ambos chegarem a 3, próximo ponto ganha
    if (teamAScore >= 3 && teamBScore >= 3) {
      if (teamAScore > teamBScore) {
        return { gameWon: true, winner: 'A' };
      }
      if (teamBScore > teamAScore) {
        return { gameWon: true, winner: 'B' };
      }
    }
  }

  return { gameWon: false, winner: null };
};

const checkSetWin = (gameState) => {
  const { teamAGames, teamBGames, gamesPerSet, enableSuperTie, teamASets, teamBSets, maxSets } = gameState;

  // Verificar se precisa de tie-break
  if (teamAGames === gamesPerSet && teamBGames === gamesPerSet) {
    // Último set com super tie habilitado
    const isLastSet = (teamASets + teamBSets) === (maxSets - 1);
    if (enableSuperTie && isLastSet) {
      gameState.isSuperTie = true;
    } else {
      gameState.isTieBreak = true;
    }
    return { setWon: false, winner: null };
  }

  // Ganhar por games normais
  if (teamAGames >= gamesPerSet && teamAGames - teamBGames >= 2) {
    return { setWon: true, winner: 'A' };
  }
  if (teamBGames >= gamesPerSet && teamBGames - teamAGames >= 2) {
    return { setWon: true, winner: 'B' };
  }

  return { setWon: false, winner: null };
};

const checkMatchWin = (gameState) => {
  const { teamASets, teamBSets, maxSets } = gameState;
  const setsToWin = Math.ceil(maxSets / 2);

  if (teamASets >= setsToWin) {
    return { matchWon: true, winner: 'A' };
  }
  if (teamBSets >= setsToWin) {
    return { matchWon: true, winner: 'B' };
  }

  return { matchWon: false, winner: null };
};

export const undoLastPoint = (gameState) => {
  // Implementação simplificada - apenas remove último ponto
  const newState = { ...gameState };
  
  if (newState.teamAScore > 0) {
    newState.teamAScore--;
  } else if (newState.teamBScore > 0) {
    newState.teamBScore--;
  }
  
  return newState;
};

export const resetGame = (config = {}) => {
  return createInitialGameState(config);
};
