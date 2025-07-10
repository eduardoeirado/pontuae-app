import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Play, 
  Settings2, 
  Users, 
  Trophy,
  Timer,
  Target
} from 'lucide-react';

const ConfigScreen = ({ 
  gameState, 
  onUpdateConfig, 
  onUpdateTeamName, 
  onStartGame, 
  onBack 
}) => {
  const [config, setConfig] = useState(gameState.config);
  const [teamAName, setTeamAName] = useState(gameState.teamA.name);
  const [teamBName, setTeamBName] = useState(gameState.teamB.name);

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
  };

  const handleStartGame = () => {
    // Atualizar configurações
    onUpdateConfig(config);
    
    // Atualizar nomes dos times
    if (teamAName.trim()) {
      onUpdateTeamName('teamA', teamAName.trim());
    }
    if (teamBName.trim()) {
      onUpdateTeamName('teamB', teamBName.trim());
    }
    
    // Iniciar jogo
    onStartGame();
  };

  const ConfigSection = ({ icon: Icon, title, children }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5 text-cyan-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );

  const OptionButton = ({ selected, onClick, children }) => (
    <Button
      variant={selected ? "default" : "outline"}
      onClick={onClick}
      className={`h-12 ${selected ? 'bg-cyan-600 hover:bg-cyan-700' : ''}`}
    >
      {children}
    </Button>
  );

  return (
    <div className="min-h-screen wave-pattern">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-white/30">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h1 className="text-xl font-bold text-gray-800">Configurações</h1>
        <div className="w-20" /> {/* Spacer */}
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Nomes dos Times */}
        <ConfigSection icon={Users} title="Times">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teamA" className="text-blue-600 font-semibold">
                Time A (Azul)
              </Label>
              <Input
                id="teamA"
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                placeholder="Nome do Time A"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="teamB" className="text-orange-600 font-semibold">
                Time B (Laranja)
              </Label>
              <Input
                id="teamB"
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                placeholder="Nome do Time B"
                className="mt-1"
              />
            </div>
          </div>
        </ConfigSection>

        {/* Configurações de Saque */}
        <ConfigSection icon={Play} title="Saque Inicial">
          <div className="grid grid-cols-2 gap-3">
            <OptionButton
              selected={config.firstServer === 'teamA'}
              onClick={() => handleConfigChange('firstServer', 'teamA')}
            >
              {teamAName || 'Time A'}
            </OptionButton>
            <OptionButton
              selected={config.firstServer === 'teamB'}
              onClick={() => handleConfigChange('firstServer', 'teamB')}
            >
              {teamBName || 'Time B'}
            </OptionButton>
          </div>
        </ConfigSection>

        {/* Configurações de Sets */}
        <ConfigSection icon={Trophy} title="Configuração de Sets">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Número de Sets
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {[1, 3, 5].map((sets) => (
                <OptionButton
                  key={sets}
                  selected={config.maxSets === sets}
                  onClick={() => handleConfigChange('maxSets', sets)}
                >
                  {sets} Set{sets > 1 ? 's' : ''}
                </OptionButton>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Games por Set
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {[2, 4, 6].map((games) => (
                <OptionButton
                  key={games}
                  selected={config.gamesPerSet === games}
                  onClick={() => handleConfigChange('gamesPerSet', games)}
                >
                  {games} Games
                </OptionButton>
              ))}
            </div>
          </div>
        </ConfigSection>

        {/* Configurações de Tie-Break */}
        <ConfigSection icon={Target} title="Tie-Break e Super Tie">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Pontos para Tie-Break
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {[5, 6, 7, 8].map((points) => (
                <OptionButton
                  key={points}
                  selected={config.tieBreakPoints === points}
                  onClick={() => handleConfigChange('tieBreakPoints', points)}
                >
                  {points}
                </OptionButton>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Ativar Super Tie no último set
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                Quando os sets estiverem empatados
              </p>
            </div>
            <Switch
              checked={config.enableSuperTie}
              onCheckedChange={(checked) => handleConfigChange('enableSuperTie', checked)}
            />
          </div>

          {config.enableSuperTie && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Pontos para Super Tie
              </Label>
              <div className="grid grid-cols-4 gap-3">
                {[8, 9, 10, 11].map((points) => (
                  <OptionButton
                    key={points}
                    selected={config.superTiePoints === points}
                    onClick={() => handleConfigChange('superTiePoints', points)}
                  >
                    {points}
                  </OptionButton>
                ))}
              </div>
            </div>
          )}
        </ConfigSection>

        {/* Resumo das Configurações */}
        <Card className="mb-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-cyan-800">
              <Settings2 className="w-5 h-5" />
              Resumo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Formato:</strong> Melhor de {config.maxSets} set{config.maxSets > 1 ? 's' : ''}</p>
                <p><strong>Games por set:</strong> {config.gamesPerSet}</p>
                <p><strong>Primeiro saque:</strong> {config.firstServer === 'teamA' ? teamAName || 'Time A' : teamBName || 'Time B'}</p>
              </div>
              <div>
                <p><strong>Tie-break:</strong> {config.tieBreakPoints} pontos</p>
                <p><strong>Super Tie:</strong> {config.enableSuperTie ? `${config.superTiePoints} pontos` : 'Desativado'}</p>
                <p><strong>Sistema:</strong> No-Ad</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão Iniciar */}
        <Button 
          onClick={handleStartGame}
          className="w-full h-14 text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
        >
          <Play className="w-5 h-5 mr-2" />
          Iniciar Partida
        </Button>
      </div>
    </div>
  );
};

export default ConfigScreen;

