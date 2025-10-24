import React from 'react';

interface TeamTabsProps {
  teams: string[];
  selectedTeam: string | null;
  onTeamSelect: (team: string) => void;
}

export const TeamTabs: React.FC<TeamTabsProps> = ({ teams, selectedTeam, onTeamSelect }) => {
  if (teams.length === 0) return null;

  return (
    <div className="team-tabs">
      <div className="tabs-container">
        {teams.map(team => (
          <button
            key={team}
            className={`tab ${selectedTeam === team ? 'active' : ''}`}
            onClick={() => onTeamSelect(team)}
          >
            {team}
          </button>
        ))}
      </div>
    </div>
  );
};
