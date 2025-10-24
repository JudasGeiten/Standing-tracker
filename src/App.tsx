import React, { useState } from 'react';
import { ExcelImporter } from './components/ExcelImporter';
import { TeamTabs } from './components/TeamTabs';
import { TeamChart } from './components/TeamChart';
import { Match, TeamSeasonData } from './types';
import { calculateStandings, extractTeamSeasonData } from './utils/standingsCalculator';
import './index.css';

function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teamSeasonData, setTeamSeasonData] = useState<TeamSeasonData[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [maxPosition, setMaxPosition] = useState<number>(0);
  const [allRounds, setAllRounds] = useState<number[]>([]);
  const [tournamentName, setTournamentName] = useState<string>('');

  const handleMatchesLoaded = (loadedMatches: Match[]) => {
    setMatches(loadedMatches);
    
    // Calculate standings for all rounds
    const roundStandings = calculateStandings(loadedMatches);
    
    // Extract team season data
    const seasonData = extractTeamSeasonData(roundStandings);
    setTeamSeasonData(seasonData);
    
    // Get all unique rounds
    const rounds = [...new Set(loadedMatches.map(m => m.round))].sort((a, b) => a - b);
    setAllRounds(rounds);
    
    // Get tournament name (from first match that has one)
    const tournament = loadedMatches.find(m => m.tournament)?.tournament || '';
    setTournamentName(tournament);
    
    // Set max position (number of teams)
    if (seasonData.length > 0) {
      setMaxPosition(seasonData.length);
      // Auto-select first team
      setSelectedTeam(seasonData[0].team);
    }
  };

  const selectedTeamData = teamSeasonData.find(t => t.team === selectedTeam) || null;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏆 Tournament Standings Tracker</h1>
        {tournamentName && <h2 className="tournament-name">{tournamentName}</h2>}
        <p className="subtitle">Visualize team positions throughout the season</p>
      </header>

      <main className="app-main">
        <ExcelImporter onMatchesLoaded={handleMatchesLoaded} />

        {teamSeasonData.length > 0 && (
          <>
            <TeamTabs
              teams={teamSeasonData.map(t => t.team)}
              selectedTeam={selectedTeam}
              onTeamSelect={setSelectedTeam}
            />

            <TeamChart teamData={selectedTeamData} maxPosition={maxPosition} allRounds={allRounds} />
          </>
        )}

        {matches.length === 0 && (
          <div className="empty-state">
            <h2>No data loaded yet</h2>
            <p>Upload Excel files containing tournament match data to get started.</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built with React + TypeScript + Vite</p>
      </footer>
    </div>
  );
}

export default App;
