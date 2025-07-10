import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  RotateCcw, 
  Edit3, 
  Check, 
  X,
  Waves,
  Trophy
} from 'lucide-react';
import { getScoreDisplay, isDeuce, hasAdvantage } from '../lib/gameLogic';

const GameScreen = ({ 
  gameState, 
  onScorePoint, 
  onUndoPoint, 
  onUpdateTeamName, 
  onOpenSettings 
}) => {
  const [editingTeam, setEditingTeam] = useState(null);
  const [tempName, setTempName] = useState('');
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const startEditing = (team) => {
    setEditingTeam(team);
    setTempName(gameState[team].name);
  };

  const saveEdit = () => {
    if (tempName.trim()) {
      onUpdateTeamName(editingTeam, tempName.trim());
    }
    setEditingTeam(null);
    setTempName('');
  };

  const cancelEdit = () => {
    setEditingTeam(null);
    setTempName('');
  };

  const handleDoubleClick = (team) => {
    onScorePoint(team);
  };

  const getGameStatus = () => {
    if (gameState.isGameFinished) {
      return `${gameState[gameState.winner].name} venceu!`;
    }
    
    if (gameState.isTieBreak) {
      return 'Tie-Break';
    }
    
    if (gameState.isSuperTie) {
      return 'Super Tie-Break';
    }
    
    if (isDeuce(gameState.teamA, gameState.teamB)) {
      return 'Deuce';
    }
    
    if (hasAdvantage(gameState.teamA, gameState.teamB)) {
      const advantageTeam = gameState.teamA.score > gameState.teamB.score ? 'teamA' : 'teamB';
      return `Vantagem ${gameState[advantageTeam].name}`;
    }
    
    const servingTeam = gameState.teamA.isServing ? gameState.teamA.name : gameState.teamB.name;
    return `Saque: ${servingTeam}`;
  };

  const formatScore = (team) => {
    return getScoreDisplay(gameState[team].score, gameState.isTieBreak || gameState.isSuperTie);
  };

  // Layout para orientação horizontal
  if (isLandscape) {
    return (
      <div className="min-h-screen wave-pattern flex">
        {/* Team A Side */}
        <div className="flex-1 flex flex-col">
          {/* Team A Header */}
          <div className="team-a-bg text-white p-3 flex items-center justify-center min-h-[60px]">
            {editingTeam === 'teamA' ? (
              <div className="flex items-center gap-2">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-white/70 text-sm"
                  placeholder="Nome do time"
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                />
                <Button size="sm" variant="ghost" onClick={saveEdit}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={cancelEdit}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div 
                className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded"
                onClick={() => startEditing('teamA')}
              >
                <span className="font-bold">{gameState.teamA.name}</span>
                <Edit3 className="w-4 h-4 opacity-70" />
              </div>
            )}
          </div>

          {/* Team A Score Area */}
          <div 
            className="flex-1 touch-area flex items-center justify-center cursor-pointer"
            onDoubleClick={() => handleDoubleClick('teamA')}
          >
            <Card className="score-area p-6 m-3 flex-1 flex items-center justify-center border-l-4 border-l-blue-500">
              <div className="text-center">
                <div className="text-4xl lg:text-6xl font-bold team-a-text mb-2">
                  {formatScore('teamA')}
                </div>
                <div className="text-xs text-gray-600">
                  Toque duas vezes
                </div>
              </div>
            </Card>
          </div>

          {/* Team A Stats */}
          <div className="bg-white/80 backdrop-blur-sm p-3 border-t border-white/30">
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Sets | Games</div>
              <div className="text-lg font-bold team-a-text">
                {gameState.teamA.sets} | {gameState.teamA.games}
              </div>
            </div>
          </div>
        </div>

        {/* Center Column */}
        <div className="w-20 flex flex-col">
          {/* Top Controls */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-white/30 p-2 flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUndoPoint}
              disabled={gameState.gameHistory.length === 0}
              className="bg-white/80 p-2"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSettings}
              className="bg-white/80 p-2"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Game Status */}
          <div className="flex-1 bg-gradient-to-b from-cyan-500/20 to-blue-500/20 border-y border-white/30 flex items-center justify-center p-2">
            <div className="text-center">
              <Waves className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-700 writing-mode-vertical-rl text-orientation-mixed">
                Set {gameState.currentSet}
              </p>
              {gameState.isGameFinished && (
                <Trophy className="w-5 h-5 text-yellow-500 mx-auto mt-2" />
              )}
            </div>
          </div>

          {/* Status Text */}
          <div className="bg-white/80 backdrop-blur-sm border-t border-white/30 p-2">
            <p className="text-xs text-center text-gray-700 writing-mode-vertical-rl text-orientation-mixed">
              {getGameStatus()}
            </p>
          </div>
        </div>

        {/* Team B Side */}
        <div className="flex-1 flex flex-col">
          {/* Team B Header */}
          <div className="team-b-bg text-white p-3 flex items-center justify-center min-h-[60px]">
            {editingTeam === 'teamB' ? (
              <div className="flex items-center gap-2">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-white/70 text-sm"
                  placeholder="Nome do time"
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                />
                <Button size="sm" variant="ghost" onClick={saveEdit}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={cancelEdit}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div 
                className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded"
                onClick={() => startEditing('teamB')}
              >
                <span className="font-bold">{gameState.teamB.name}</span>
                <Edit3 className="w-4 h-4 opacity-70" />
              </div>
            )}
          </div>

          {/* Team B Score Area */}
          <div 
            className="flex-1 touch-area flex items-center justify-center cursor-pointer"
            onDoubleClick={() => handleDoubleClick('teamB')}
          >
            <Card className="score-area p-6 m-3 flex-1 flex items-center justify-center border-l-4 border-l-orange-500">
              <div className="text-center">
                <div className="text-4xl lg:text-6xl font-bold team-b-text mb-2">
                  {formatScore('teamB')}
                </div>
                <div className="text-xs text-gray-600">
                  Toque duas vezes
                </div>
              </div>
            </Card>
          </div>

          {/* Team B Stats */}
          <div className="bg-white/80 backdrop-blur-sm p-3 border-t border-white/30">
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Sets | Games</div>
              <div className="text-lg font-bold team-b-text">
                {gameState.teamB.sets} | {gameState.teamB.games}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout para orientação vertical (original)
  return (
    <div className="min-h-screen wave-pattern flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-white/30">
        <div className="flex items-center gap-2">
          <Waves className="w-6 h-6 text-cyan-500" />
          <h1 className="text-xl font-bold text-gray-800">Beach Tennis</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndoPoint}
            disabled={gameState.gameHistory.length === 0}
            className="bg-white/80"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSettings}
            className="bg-white/80"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Game Status */}
      <div className="text-center py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-white/30">
        <p className="text-lg font-semibold text-gray-700">
          {getGameStatus()}
        </p>
        {gameState.isGameFinished && (
          <Trophy className="w-6 h-6 text-yellow-500 mx-auto mt-1" />
        )}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col">
        {/* Team Names */}
        <div className="flex">
          {/* Team A */}
          <div className="flex-1 team-a-bg text-white p-4 flex items-center justify-center">
            {editingTeam === 'teamA' ? (
              <div className="flex items-center gap-2">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-white/70"
                  placeholder="Nome do time"
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                />
                <Button size="sm" variant="ghost" onClick={saveEdit}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={cancelEdit}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div 
                className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded"
                onClick={() => startEditing('teamA')}
              >
                <span className="text-lg font-bold">{gameState.teamA.name}</span>
                <Edit3 className="w-4 h-4 opacity-70" />
              </div>
            )}
          </div>

          {/* Team B */}
          <div className="flex-1 team-b-bg text-white p-4 flex items-center justify-center">
            {editingTeam === 'teamB' ? (
              <div className="flex items-center gap-2">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-white/70"
                  placeholder="Nome do time"
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                />
                <Button size="sm" variant="ghost" onClick={saveEdit}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={cancelEdit}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div 
                className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded"
                onClick={() => startEditing('teamB')}
              >
                <span className="text-lg font-bold">{gameState.teamB.name}</span>
                <Edit3 className="w-4 h-4 opacity-70" />
              </div>
            )}
          </div>
        </div>

        {/* Score Display */}
        <div className="flex-1 flex">
          {/* Team A Score Area */}
          <div 
            className="flex-1 touch-area flex items-center justify-center cursor-pointer"
            onDoubleClick={() => handleDoubleClick('teamA')}
            style={{ minHeight: '200px' }}
          >
            <Card className="score-area p-8 m-4 flex-1 flex items-center justify-center border-l-4 border-l-blue-500">
              <div className="text-center">
                <div className="text-6xl md:text-8xl font-bold team-a-text mb-2">
                  {formatScore('teamA')}
                </div>
                <div className="text-sm text-gray-600">
                  Toque duas vezes para marcar
                </div>
              </div>
            </Card>
          </div>

          {/* Team B Score Area */}
          <div 
            className="flex-1 touch-area flex items-center justify-center cursor-pointer"
            onDoubleClick={() => handleDoubleClick('teamB')}
            style={{ minHeight: '200px' }}
          >
            <Card className="score-area p-8 m-4 flex-1 flex items-center justify-center border-l-4 border-l-orange-500">
              <div className="text-center">
                <div className="text-6xl md:text-8xl font-bold team-b-text mb-2">
                  {formatScore('teamB')}
                </div>
                <div className="text-sm text-gray-600">
                  Toque duas vezes para marcar
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sets and Games Display */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-white/30 p-4">
          <div className="flex justify-center gap-8">
            {/* Sets */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Sets</div>
              <div className="flex gap-4">
                <div className="text-2xl font-bold team-a-text">
                  {gameState.teamA.sets}
                </div>
                <div className="text-2xl font-bold text-gray-400">-</div>
                <div className="text-2xl font-bold team-b-text">
                  {gameState.teamB.sets}
                </div>
              </div>
            </div>

            {/* Games */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Games</div>
              <div className="flex gap-4">
                <div className="text-2xl font-bold team-a-text">
                  {gameState.teamA.games}
                </div>
                <div className="text-2xl font-bold text-gray-400">-</div>
                <div className="text-2xl font-bold team-b-text">
                  {gameState.teamB.games}
                </div>
              </div>
            </div>

            {/* Current Set */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Set Atual</div>
              <div className="text-2xl font-bold text-gray-700">
                {gameState.currentSet}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;

