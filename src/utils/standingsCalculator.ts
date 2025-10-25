import { Match, RoundStandings, TeamStanding, TeamSeasonData, TeamPositionData } from '../types';

/**
 * Calculate standings for all rounds based on match results
 */
export const calculateStandings = (matches: Match[]): RoundStandings[] => {
  if (matches.length === 0) return [];

  const rounds = [...new Set(matches.map(m => m.round))].sort((a, b) => a - b);
  const allTeams = [...new Set([
    ...matches.map(m => m.homeTeam),
    ...matches.map(m => m.awayTeam)
  ])];

  const roundStandings: RoundStandings[] = [];

  // Initialize team stats
  const teamStats = new Map<string, TeamStanding>();
  allTeams.forEach(team => {
    teamStats.set(team, {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      position: 0
    });
  });

  // Process each round
  rounds.forEach(round => {
    const roundMatches = matches.filter(m => m.round === round);

    // Update stats for this round's matches
    roundMatches.forEach(match => {
      const homeStats = teamStats.get(match.homeTeam)!;
      const awayStats = teamStats.get(match.awayTeam)!;

      // Update played
      homeStats.played++;
      awayStats.played++;

      // Update goals
      homeStats.goalsFor += match.homeScore;
      homeStats.goalsAgainst += match.awayScore;
      awayStats.goalsFor += match.awayScore;
      awayStats.goalsAgainst += match.homeScore;

      // Update results
      if (match.homeScore > match.awayScore) {
        homeStats.won++;
        homeStats.points += 3;
        awayStats.lost++;
      } else if (match.homeScore < match.awayScore) {
        awayStats.won++;
        awayStats.points += 3;
        homeStats.lost++;
      } else {
        homeStats.drawn++;
        awayStats.drawn++;
        homeStats.points++;
        awayStats.points++;
      }

      // Update goal difference
      homeStats.goalDifference = homeStats.goalsFor - homeStats.goalsAgainst;
      awayStats.goalDifference = awayStats.goalsFor - awayStats.goalsAgainst;
    });

    // Sort teams and assign positions
    const standings = Array.from(teamStats.values())
      .sort((a, b) => {
        // Sort by points (descending)
        if (b.points !== a.points) return b.points - a.points;
        // Then by goal difference (descending)
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        // Then by goals scored (descending)
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        // Finally alphabetically
        return a.team.localeCompare(b.team);
      })
      .map((standing, index) => ({
        ...standing,
        position: index + 1
      }));

    roundStandings.push({
      round,
      standings: standings.map(s => ({ ...s })) // Create a copy
    });
  });

  return roundStandings;
};

/**
 * Extract position data for each team across all rounds
 */
export const extractTeamSeasonData = (roundStandings: RoundStandings[]): TeamSeasonData[] => {
  if (roundStandings.length === 0) return [];

  const teamsMap = new Map<string, TeamPositionData[]>();

  roundStandings.forEach(({ round, standings }) => {
    standings.forEach(standing => {
      if (!teamsMap.has(standing.team)) {
        teamsMap.set(standing.team, []);
      }
      teamsMap.get(standing.team)!.push({
        round,
        position: standing.position,
        points: standing.points,
        goalsFor: standing.goalsFor,
        goalsAgainst: standing.goalsAgainst,
        goalDifference: standing.goalDifference,
        played: standing.played,
        won: standing.won,
        drawn: standing.drawn,
        lost: standing.lost
      });
    });
  });

  return Array.from(teamsMap.entries())
    .map(([team, positions]) => ({
      team,
      positions: positions.sort((a, b) => a.round - b.round)
    }))
    .sort((a, b) => a.team.localeCompare(b.team));
};
