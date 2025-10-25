import React, { useState } from 'react';
import { TeamSeasonData, Match } from '../types';

interface TeamChartProps {
  teamData: TeamSeasonData | null;
  maxPosition: number;
  allRounds: number[];
  tournamentMatches: Match[];
}

export const TeamChart: React.FC<TeamChartProps> = ({ teamData, maxPosition, allRounds, tournamentMatches }) => {
  const [showDebug, setShowDebug] = useState(false);

  if (!teamData || teamData.positions.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>Select a team to view their season progression</p>
      </div>
    );
  }

  // Create a map of rounds to positions for this team
  const positionMap = new Map(teamData.positions.map(p => [p.round, p.position]));
  
  // Calculate position change indicators
  const getPositionChange = (currentRound: number): 'up' | 'down' | 'same' | null => {
    const currentPos = positionMap.get(currentRound);
    const prevRound = allRounds[allRounds.indexOf(currentRound) - 1];
    const prevPos = prevRound ? positionMap.get(prevRound) : null;
    
    if (!currentPos || !prevPos) return null;
    if (currentPos < prevPos) return 'up';
    if (currentPos > prevPos) return 'down';
    return 'same';
  };

  const bestPosition = Math.min(...teamData.positions.map(p => p.position));
  const worstPosition = Math.max(...teamData.positions.map(p => p.position));
  const currentPosition = teamData.positions[teamData.positions.length - 1].position;

  return (
    <div className="team-chart">
      <h2>{teamData.team} - Season Progression</h2>
      
      <div className="timeline-container">
        <div className="timeline-wrapper">
          <div className="position-labels">
            <div className="position-label-header"></div>
            {Array.from({ length: maxPosition }, (_, i) => (
              <div key={i + 1} className="position-label">
                {i + 1}
              </div>
            ))}
          </div>

          <div className="timeline-content">
            {allRounds.map((round) => {
              const position = positionMap.get(round);
              const change = getPositionChange(round);
              
              return (
                <div key={round} className="timeline-round">
                  <div className="round-header">
                    <span className="round-number">R{round}</span>
                  </div>
                  
                  <div className="position-track">
                    {Array.from({ length: maxPosition }, (_, i) => {
                      const pos = i + 1;
                      const isCurrentPosition = position === pos;
                      
                      return (
                        <div 
                          key={pos} 
                          className={`position-cell ${isCurrentPosition ? 'active' : ''}`}
                        >
                          {isCurrentPosition && (
                            <div className="position-marker">
                              <div className={`marker-dot ${change || ''}`}>
                                {pos}
                              </div>
                              {change === 'up' && <span className="change-arrow">↑</span>}
                              {change === 'down' && <span className="change-arrow">↓</span>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="position-info">
        <div className="info-item">
          <span className="info-label">Current Position:</span>
          <span className="info-value">{currentPosition}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Best Position:</span>
          <span className="info-value">{bestPosition}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Worst Position:</span>
          <span className="info-value">{worstPosition}</span>
        </div>
      </div>

      <div className="debug-section">
        <button 
          className="debug-toggle-btn"
          onClick={() => setShowDebug(!showDebug)}
        >
          {showDebug ? '🔽 Hide Debug Data' : '🔼 Show Debug Data (JSON)'}
        </button>
        
        {showDebug && (
          <div className="debug-panel">
            <h3>Position Data for {teamData.team}</h3>
            <pre className="debug-json">
              {JSON.stringify(teamData.positions, null, 2)}
            </pre>
            
            <h3>Position Details (by Round)</h3>
            <div className="debug-table">
              <table>
                <thead>
                  <tr>
                    <th>Round</th>
                    <th>Position</th>
                    <th>Played</th>
                    <th>Won</th>
                    <th>Drawn</th>
                    <th>Lost</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {teamData.positions.map(pos => (
                    <tr key={pos.round}>
                      <td>{pos.round}</td>
                      <td><strong>{pos.position}</strong></td>
                      <td>{pos.played}</td>
                      <td>{pos.won}</td>
                      <td>{pos.drawn}</td>
                      <td>{pos.lost}</td>
                      <td>{pos.goalsFor}</td>
                      <td>{pos.goalsAgainst}</td>
                      <td>{pos.goalDifference}</td>
                      <td><strong>{pos.points}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3>Match Results for {teamData.team}</h3>
            <div className="debug-table">
              <table>
                <thead>
                  <tr>
                    <th>Round</th>
                    <th>Home</th>
                    <th>Score</th>
                    <th>Away</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {tournamentMatches
                    .filter(m => m.homeTeam === teamData.team || m.awayTeam === teamData.team)
                    .sort((a, b) => a.round - b.round)
                    .map((match, idx) => {
                      const isHome = match.homeTeam === teamData.team;
                      const result = isHome 
                        ? (match.homeScore > match.awayScore ? 'W' : match.homeScore < match.awayScore ? 'L' : 'D')
                        : (match.awayScore > match.homeScore ? 'W' : match.awayScore < match.homeScore ? 'L' : 'D');
                      const resultClass = result === 'W' ? 'win' : result === 'L' ? 'loss' : 'draw';
                      
                      return (
                        <tr key={idx}>
                          <td>{match.round}</td>
                          <td className={isHome ? 'team-highlight' : ''}>{match.homeTeam}</td>
                          <td><strong>{match.homeScore} - {match.awayScore}</strong></td>
                          <td className={!isHome ? 'team-highlight' : ''}>{match.awayTeam}</td>
                          <td className={`result-badge ${resultClass}`}>{result}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
