export interface Match {
  round: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  tournament: string;
}

export interface Tournament {
  id: string;
  name: string;
  matches: Match[];
}

export interface TeamStanding {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
}

export interface RoundStandings {
  round: number;
  standings: TeamStanding[];
}

export interface TeamPositionData {
  round: number;
  position: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
}

export interface TeamSeasonData {
  team: string;
  positions: TeamPositionData[];
}
