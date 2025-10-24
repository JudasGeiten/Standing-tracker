import { useState, useEffect } from 'react';
import { ExcelImporter } from './components/ExcelImporter';
import { TournamentSelector } from './components/TournamentSelector';
import { TeamTabs } from './components/TeamTabs';
import { TeamChart } from './components/TeamChart';
import { Tournament, TeamSeasonData } from './types';
import { calculateStandings, extractTeamSeasonData } from './utils/standingsCalculator';
import { saveTournamentsToStorage, loadTournamentsFromStorage, clearTournamentsFromStorage } from './utils/localStorage';
import './index.css';

function App() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [teamSeasonData, setTeamSeasonData] = useState<TeamSeasonData[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [maxPosition, setMaxPosition] = useState<number>(0);
  const [allRounds, setAllRounds] = useState<number[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTournaments = loadTournamentsFromStorage();
    if (savedTournaments && savedTournaments.length > 0) {
      setTournaments(savedTournaments);
      // Auto-select first tournament
      setSelectedTournamentId(savedTournaments[0].id);
    }
  }, []);

  // Process tournament when selection changes
  useEffect(() => {
    if (selectedTournamentId && tournaments.length > 0) {
      const tournament = tournaments.find(t => t.id === selectedTournamentId);
      if (tournament) {
        processTournament(tournament);
      }
    } else {
      // Clear data when no tournament selected
      setTeamSeasonData([]);
      setSelectedTeam(null);
      setMaxPosition(0);
      setAllRounds([]);
    }
  }, [selectedTournamentId, tournaments]);

  const processTournament = (tournament: Tournament) => {
    // Calculate standings for all rounds
    const roundStandings = calculateStandings(tournament.matches);
    
    // Extract team season data
    const seasonData = extractTeamSeasonData(roundStandings);
    setTeamSeasonData(seasonData);
    
    // Get all unique rounds
    const rounds = [...new Set(tournament.matches.map(m => m.round))].sort((a, b) => a - b);
    setAllRounds(rounds);
    
    // Set max position (number of teams)
    if (seasonData.length > 0) {
      setMaxPosition(seasonData.length);
      // Auto-select first team
      setSelectedTeam(seasonData[0].team);
    }
  };

  const handleTournamentsLoaded = (newTournaments: Tournament[]) => {
    // Merge with existing tournaments, avoiding duplicates by ID
    const mergedTournaments = [...tournaments];
    
    newTournaments.forEach(newTournament => {
      const existingIndex = mergedTournaments.findIndex(t => t.id === newTournament.id);
      if (existingIndex >= 0) {
        // Replace existing tournament with same ID
        mergedTournaments[existingIndex] = newTournament;
      } else {
        // Add new tournament
        mergedTournaments.push(newTournament);
      }
    });
    
    setTournaments(mergedTournaments);
    // Save to localStorage
    saveTournamentsToStorage(mergedTournaments);
    
    // Auto-select the first newly loaded tournament
    if (newTournaments.length > 0) {
      setSelectedTournamentId(newTournaments[0].id);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all tournament data? This cannot be undone.')) {
      clearTournamentsFromStorage();
      setTournaments([]);
      setSelectedTournamentId(null);
      setTeamSeasonData([]);
      setSelectedTeam(null);
      setMaxPosition(0);
      setAllRounds([]);
    }
  };

  const selectedTeamData = teamSeasonData.find(t => t.team === selectedTeam) || null;
  const currentTournament = tournaments.find(t => t.id === selectedTournamentId);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏆 Tournament Standings Tracker</h1>
        {currentTournament && <h2 className="tournament-name">{currentTournament.name}</h2>}
        <p className="subtitle">Visualize team positions throughout the season</p>
        {tournaments.length > 0 && (
          <button onClick={handleClearData} className="clear-data-btn">
            🗑️ Clear All Data
          </button>
        )}
      </header>

      <main className="app-main">
        <ExcelImporter onTournamentsLoaded={handleTournamentsLoaded} />

        {tournaments.length > 0 && (
          <TournamentSelector
            tournaments={tournaments}
            selectedTournamentId={selectedTournamentId}
            onTournamentSelect={setSelectedTournamentId}
          />
        )}

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

        {tournaments.length === 0 && (
          <div className="empty-state">
            <h2>No data loaded yet</h2>
            <p>Upload Excel files containing tournament match data to get started. Each file will be imported as a separate tournament.</p>
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
