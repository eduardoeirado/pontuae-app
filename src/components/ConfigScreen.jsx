import React, { useState } from 'react';

const ConfigScreen = ({ onStartGame, onBack }) => {
  const [config, setConfig] = useState({
    teamAName: 'Time A',
    teamBName: 'Time B',
    firstServer: 'A',
    maxSets: 3,
    gamesPerSet: 6,
    tieBreakPoints: 7,
    superTiePoints: 10,
    enableSuperTie: false
  });

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartGame = () => {
    onStartGame(config);
  };

  return (
    <div className="config-container">
      {/* Header */}
      <div className="config-header">
        <button className="back-button" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="config-title">Novo jogo</h1>
        <button className="start-game-button" onClick={handleStartGame} style={{
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '20px',
          padding: '8px 16px',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Iniciar jogo →
        </button>
      </div>

      {/* Slogan */}
      <div className="slogan">
        Pontuou? Já foi, Pontuaê!
      </div>

      {/* Configurações */}
      <div className="config-section">
        <h3>Times</h3>
        <div className="team-inputs">
          <input
            type="text"
            className="team-input"
            placeholder="Jogador(a) 1 - Time A"
            value={config.teamAName}
            onChange={(e) => handleInputChange('teamAName', e.target.value)}
          />
          <input
            type="text"
            className="team-input"
            placeholder="Jogador(a) 2 - Time B"
            value={config.teamBName}
            onChange={(e) => handleInputChange('teamBName', e.target.value)}
          />
        </div>
      </div>

      <div className="config-section">
        <h3>Configurações</h3>
        
        <div className="config-group">
          <h4>Primeiro Saque:</h4>
          <div className="config-options">
            <div className={`config-option ${config.firstServer === 'A' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="serverA"
                name="firstServer"
                value="A"
                checked={config.firstServer === 'A'}
                onChange={(e) => handleInputChange('firstServer', e.target.value)}
              />
              <label htmlFor="serverA">Time A</label>
            </div>
            <div className={`config-option ${config.firstServer === 'B' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="serverB"
                name="firstServer"
                value="B"
                checked={config.firstServer === 'B'}
                onChange={(e) => handleInputChange('firstServer', e.target.value)}
              />
              <label htmlFor="serverB">Time B</label>
            </div>
          </div>
        </div>

        <div className="config-group">
          <h4>Melhor de quantos Sets:</h4>
          <div className="config-options">
            {[1, 3, 5].map(sets => (
              <div key={sets} className={`config-option ${config.maxSets === sets ? 'selected' : ''}`}>
                <input
                  type="radio"
                  id={`sets${sets}`}
                  name="maxSets"
                  value={sets}
                  checked={config.maxSets === sets}
                  onChange={(e) => handleInputChange('maxSets', parseInt(e.target.value))}
                />
                <label htmlFor={`sets${sets}`}>{sets}</label>
              </div>
            ))}
            <div style={{
              background: '#2196F3',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Sets
            </div>
          </div>
        </div>

        <div className="config-group">
          <h4>Games por set:</h4>
          <div className="config-options">
            {[2, 4, 6].map(games => (
              <div key={games} className={`config-option ${config.gamesPerSet === games ? 'selected' : ''}`}>
                <input
                  type="radio"
                  id={`games${games}`}
                  name="gamesPerSet"
                  value={games}
                  checked={config.gamesPerSet === games}
                  onChange={(e) => handleInputChange('gamesPerSet', parseInt(e.target.value))}
                />
                <label htmlFor={`games${games}`}>{games}</label>
              </div>
            ))}
            <div style={{
              background: '#2196F3',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Games
            </div>
          </div>
        </div>

        <div className="number-input">
          <label>Número de pontos para fechar o Tie-Break:</label>
          <input
            type="number"
            min="5"
            max="8"
            value={config.tieBreakPoints}
            onChange={(e) => handleInputChange('tieBreakPoints', parseInt(e.target.value))}
            style={{
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          />
        </div>

        <div className="switch-container">
          <label>Último Set em modo SuperTie?</label>
          <div 
            className={`switch ${config.enableSuperTie ? 'active' : ''}`}
            onClick={() => handleInputChange('enableSuperTie', !config.enableSuperTie)}
          >
          </div>
        </div>

        {config.enableSuperTie && (
          <div className="number-input">
            <label>Número de pontos para fechar o SuperTie:</label>
            <input
              type="number"
              min="8"
              max="11"
              value={config.superTiePoints}
              onChange={(e) => handleInputChange('superTiePoints', parseInt(e.target.value))}
              style={{
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            />
          </div>
        )}
      </div>

      {/* Resumo das configurações */}
      <div className="config-summary">
        <h4>Resumo da Partida</h4>
        <p><strong>Times:</strong> {config.teamAName} vs {config.teamBName}</p>
        <p><strong>Primeiro saque:</strong> {config.firstServer === 'A' ? config.teamAName : config.teamBName}</p>
        <p><strong>Formato:</strong> Melhor de {config.maxSets} sets</p>
        <p><strong>Games por set:</strong> {config.gamesPerSet}</p>
        <p><strong>Tie-break:</strong> {config.tieBreakPoints} pontos</p>
        {config.enableSuperTie && (
          <p><strong>Super tie:</strong> {config.superTiePoints} pontos (último set)</p>
        )}
      </div>

      <button className="start-game-button" onClick={handleStartGame}>
        🎾 Iniciar Partida
      </button>
    </div>
  );
};

export default ConfigScreen;
