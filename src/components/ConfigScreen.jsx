import React, { useState } from 'react';

const ConfigScreen = ({ onStartGame }) => {
  const [config, setConfig] = useState({
    teamAName: 'Time A',
    teamBName: 'Time B',
    firstServer: 'A',
    maxSets: 1,
    gamesPerSet: 6,
    tieBreakPoints: 7,
    superTieEnabled: true,
    superTiePoints: 10
  });

  const handleStartGame = () => {
    onStartGame(config);
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="config-container">
      {/* Header */}
      <div className="config-header">
        <div className="header-spacer"></div>
        <h1 className="config-title">Novo jogo</h1>
        <button className="start-game-button" onClick={handleStartGame}>
          Iniciar jogo
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="config-content">
        {/* Close Button */}
        <div className="close-section">
          <button className="close-button">×</button>
        </div>

        {/* Team Names */}
        <div className="team-names-section">
          <div className="team-input-container">
            <div className="team-input-wrapper">
              <div className="player-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <input
                type="text"
                value={config.teamAName}
                onChange={(e) => updateConfig('teamAName', e.target.value)}
                className="team-input"
                placeholder="Jogador(a) 1 - Time A"
              />
            </div>
          </div>

          <div className="team-input-container">
            <div className="team-input-wrapper">
              <div className="player-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <input
                type="text"
                value={config.teamBName}
                onChange={(e) => updateConfig('teamBName', e.target.value)}
                className="team-input"
                placeholder="Jogador(a) 2 - Time B"
              />
            </div>
          </div>
        </div>

        {/* Configurations Section */}
        <div className="configurations-section">
          <h2 className="section-title">Configurações</h2>

          {/* First Server */}
          <div className="config-group">
            <h3 className="config-label">Primeiro Saque:</h3>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="firstServer"
                  value="A"
                  checked={config.firstServer === 'A'}
                  onChange={(e) => updateConfig('firstServer', e.target.value)}
                />
                <span className="radio-custom"></span>
                Time A
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="firstServer"
                  value="B"
                  checked={config.firstServer === 'B'}
                  onChange={(e) => updateConfig('firstServer', e.target.value)}
                />
                <span className="radio-custom"></span>
                Time B
              </label>
            </div>
          </div>

          {/* Number of Sets */}
          <div className="config-group">
            <h3 className="config-label">Melhor de quantos Sets:</h3>
            <div className="button-group">
              {[1, 3, 5].map(sets => (
                <button
                  key={sets}
                  className={`option-button ${config.maxSets === sets ? 'active' : ''}`}
                  onClick={() => updateConfig('maxSets', sets)}
                >
                  {sets}
                </button>
              ))}
              <div className="button-label">Sets</div>
            </div>
          </div>

          {/* Games per Set */}
          <div className="config-group">
            <h3 className="config-label">Games por set:</h3>
            <div className="button-group">
              {[2, 4, 6].map(games => (
                <button
                  key={games}
                  className={`option-button ${config.gamesPerSet === games ? 'active' : ''}`}
                  onClick={() => updateConfig('gamesPerSet', games)}
                >
                  {games}
                </button>
              ))}
              <div className="button-label">Games</div>
            </div>
          </div>

          {/* Tie-Break Points */}
          <div className="config-group">
            <h3 className="config-label">Número de pontos para fechar o Tie-Break:</h3>
            <div className="number-input-container">
              <input
                type="number"
                value={config.tieBreakPoints}
                onChange={(e) => updateConfig('tieBreakPoints', parseInt(e.target.value) || 7)}
                className="number-input"
                min="5"
                max="15"
              />
            </div>
          </div>

          {/* Super Tie */}
          <div className="config-group">
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={config.superTieEnabled}
                onChange={(e) => updateConfig('superTieEnabled', e.target.checked)}
              />
              <span className="checkbox-custom">
                {config.superTieEnabled && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              Último Set em modo SuperTie?
            </label>
          </div>

          {/* Super Tie Points */}
          {config.superTieEnabled && (
            <div className="config-group">
              <h3 className="config-label">Número de pontos para fechar o SuperTie:</h3>
              <div className="number-input-container">
                <input
                  type="number"
                  value={config.superTiePoints}
                  onChange={(e) => updateConfig('superTiePoints', parseInt(e.target.value) || 10)}
                  className="number-input"
                  min="8"
                  max="15"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen;
