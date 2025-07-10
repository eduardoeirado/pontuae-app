#!/bin/bash

# 🎾 Pontuaê - Script de Implementação PWA
# Transforma o Beach Tennis App no Pontuaê PWA

echo "🎾 Implementando Pontuaê - PWA Beach Tennis..."
echo "📱 Slogan: Pontuou? Já foi, Pontuaê!"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

TARGET_DIR="$HOME/Projetos/beach-tennis-app"

# Verificar se o projeto existe
if [ ! -d "$TARGET_DIR" ]; then
    print_error "Projeto não encontrado em $TARGET_DIR"
    exit 1
fi

cd "$TARGET_DIR"

echo "🛑 Parando servidor se estiver rodando..."
pkill -f "vite" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
sleep 2

echo "📁 Trabalhando em: $TARGET_DIR"
echo ""

# 1. Atualizar título e meta tags
echo "🏷️  Atualizando branding para Pontuaê..."
cat > index.html << 'EOF'
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Pontuaê Branding -->
    <title>Pontuaê - Beach Tennis Score</title>
    <meta name="description" content="Pontuou? Já foi, Pontuaê! O melhor app para marcar pontos de Beach Tennis." />
    <meta name="keywords" content="beach tennis, pontuação, score, Pontuaê, esporte, praia" />
    <meta name="author" content="Pontuaê Team" />
    
    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#2196F3" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="application-name" content="Pontuaê" />
    
    <!-- iOS Meta Tags -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Pontuaê" />
    <link rel="apple-touch-icon" href="/icon-180.png" />
    
    <!-- Manifest -->
    <link rel="manifest" href="/manifest.json" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/favicon.png" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
    
    <!-- Service Worker Registration -->
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
              console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
              console.log('SW registration failed: ', registrationError);
            });
        });
      }
    </script>
  </body>
</html>
EOF

print_status "index.html atualizado com branding Pontuaê"

# 2. Criar manifest.json
echo "📱 Criando manifest PWA..."
cat > public/manifest.json << 'EOF'
{
  "name": "Pontuaê - Beach Tennis Score",
  "short_name": "Pontuaê",
  "description": "Pontuou? Já foi, Pontuaê! O melhor app para marcar pontos de Beach Tennis.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#2196F3",
  "theme_color": "#2196F3",
  "orientation": "any",
  "scope": "/",
  "lang": "pt-BR",
  "categories": ["sports", "games", "utilities"],
  "icons": [
    {
      "src": "/icon-72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-96.png",
      "sizes": "96x96", 
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-180.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshot-mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshot-desktop.png", 
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ]
}
EOF

print_status "manifest.json criado"

# 3. Criar Service Worker
echo "⚙️  Criando Service Worker..."
cat > public/sw.js << 'EOF'
const CACHE_NAME = 'pontuae-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
EOF

print_status "Service Worker criado"

# 4. Atualizar configurações padrão
echo "🎮 Configurando padrões do Pontuaê..."
cat > src/lib/gameLogic.js << 'EOF'
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
EOF

print_status "Lógica atualizada com padrões Pontuaê"

# 5. Atualizar App para abrir direto no jogo
echo "🎮 Configurando para abrir direto no jogo..."
cat > src/App.jsx << 'EOF'
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
EOF

print_status "App configurado para abrir direto no jogo"

# 6. Atualizar GameScreen com branding Pontuaê
echo "🎾 Atualizando GameScreen com branding Pontuaê..."
cat > src/components/GameScreen.jsx << 'EOF'
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
EOF

print_status "GameScreen atualizado com branding Pontuaê"

# 7. Atualizar CSS com cores do Pontuaê
echo "🎨 Atualizando CSS com cores do Pontuaê..."
cat >> src/App.css << 'EOF'

/* Pontuaê Branding */
.slogan {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: white;
  text-align: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.config-button,
.new-game-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.config-button:hover,
.new-game-button:hover {
  background: rgba(255,255,255,0.1);
}

/* Cores do Pontuaê */
.team-b-area {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
}

.team-b-area .team-icon circle:first-child {
  fill: #FFD700;
}

.score-team-b {
  color: #FFD700;
  text-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
}

.sets-games-team-b .sets-label,
.sets-games-team-b .games-label {
  color: #FFD700;
}

/* Modal do Pontuaê */
.modal-content h2 {
  color: #2196F3;
  margin-bottom: 16px;
  font-size: 24px;
}

.new-match-button {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.new-match-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}
EOF

print_status "CSS atualizado com cores do Pontuaê"

# 8. Criar diretório public se não existir
mkdir -p public

# 9. Criar arquivo de instruções PWA
echo "📋 Criando instruções de instalação..."
cat > public/install-instructions.html << 'EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Como Instalar o Pontuaê</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .logo { text-align: center; font-size: 24px; color: #2196F3; margin-bottom: 10px; }
        .slogan { text-align: center; color: #FFD700; font-weight: bold; margin-bottom: 20px; }
        .step { margin: 15px 0; padding: 10px; background: #f9f9f9; border-radius: 5px; }
        .platform { margin: 20px 0; }
        h3 { color: #2196F3; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🎾 Pontuaê</div>
        <div class="slogan">Pontuou? Já foi, Pontuaê!</div>
        
        <h2>Como Instalar o Pontuaê no seu Celular</h2>
        
        <div class="platform">
            <h3>📱 iPhone (iOS)</h3>
            <div class="step">1. Abra este link no Safari</div>
            <div class="step">2. Toque no botão "Compartilhar" (quadrado com seta)</div>
            <div class="step">3. Selecione "Adicionar à Tela de Início"</div>
            <div class="step">4. Confirme tocando em "Adicionar"</div>
            <div class="step">5. O ícone do Pontuaê aparecerá na sua tela inicial!</div>
        </div>
        
        <div class="platform">
            <h3>🤖 Android</h3>
            <div class="step">1. Abra este link no Chrome</div>
            <div class="step">2. Toque no menu (três pontos)</div>
            <div class="step">3. Selecione "Adicionar à tela inicial"</div>
            <div class="step">4. Confirme tocando em "Adicionar"</div>
            <div class="step">5. O ícone do Pontuaê aparecerá na sua tela inicial!</div>
        </div>
        
        <p><strong>Pronto!</strong> Agora você pode usar o Pontuaê como um app nativo, mesmo sem internet!</p>
    </div>
</body>
</html>
EOF

print_status "Instruções de instalação criadas"

# 10. Limpar cache
echo "🧹 Limpando cache..."
rm -rf node_modules/.vite dist .vite 2>/dev/null || true
print_status "Cache limpo"

echo ""
echo "🎾 PONTUAÊ PWA IMPLEMENTADO COM SUCESSO!"
echo ""
print_info "Próximos passos:"
echo "1. npm run dev -- --host (testar localmente)"
echo "2. npm run build (gerar build de produção)"
echo "3. Fazer deploy no Vercel/Netlify"
echo "4. Testar instalação em dispositivos móveis"
echo ""
print_status "Pontuaê pronto para distribuição! 🏆"
echo ""
print_info "Características do Pontuaê:"
echo "🎾 Nome: Pontuaê"
echo "📱 Slogan: Pontuou? Já foi, Pontuaê!"
echo "🎮 Abre direto no jogo"
echo "🏆 Padrão: 3 sets, 6 games, pontuação 0-15-30-45"
echo "📲 PWA: Instalável em iOS e Android"
echo "🌐 Hospedagem: Pronto para deploy"

