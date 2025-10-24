import React from 'react';
import { Tournament } from '../types';

interface TournamentSelectorProps {
  tournaments: Tournament[];
  selectedTournamentId: string | null;
  onTournamentSelect: (tournamentId: string) => void;
}

export const TournamentSelector: React.FC<TournamentSelectorProps> = ({
  tournaments,
  selectedTournamentId,
  onTournamentSelect,
}) => {
  if (tournaments.length === 0) return null;

  return (
    <div className="tournament-selector">
      <label htmlFor="tournament-select" className="selector-label">
        Select Tournament:
      </label>
      <select
        id="tournament-select"
        value={selectedTournamentId || ''}
        onChange={(e) => onTournamentSelect(e.target.value)}
        className="tournament-select"
      >
        {tournaments.map((tournament) => (
          <option key={tournament.id} value={tournament.id}>
            {tournament.name} ({tournament.matches.length} matches)
          </option>
        ))}
      </select>
    </div>
  );
};
