import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TeamSeasonData } from '../types';

interface TeamChartProps {
  teamData: TeamSeasonData | null;
  maxPosition: number;
  allRounds: number[];
}

export const TeamChart: React.FC<TeamChartProps> = ({ teamData, maxPosition, allRounds }) => {
  if (!teamData || teamData.positions.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>Select a team to view their season progression</p>
      </div>
    );
  }

  // Create a map of rounds to positions for this team
  const positionMap = new Map(teamData.positions.map(p => [p.round, p.position]));
  
  // Prepare data for all rounds, filling in gaps with null
  const chartData = allRounds.map(round => ({
    round,
    position: positionMap.get(round) || null,
  }));

  return (
    <div className="team-chart">
      <h2>{teamData.team} - Season Progression</h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="round"
            label={{ value: 'Round', position: 'insideBottom', offset: -10 }}
            type="number"
            domain={[Math.min(...allRounds), Math.max(...allRounds)]}
            ticks={allRounds}
          />
          <YAxis
            label={{ value: 'Position', angle: -90, position: 'insideLeft' }}
            reversed={true}
            domain={[1, maxPosition]}
            ticks={Array.from({ length: maxPosition }, (_, i) => i + 1)}
          />
          <Tooltip
            formatter={(value: any) => [value !== null ? `Position ${value}` : 'N/A', 'Position']}
            labelFormatter={(label) => `Round ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="position"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ fill: '#2563eb', r: 5 }}
            activeDot={{ r: 7 }}
            name={teamData.team}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="position-info">
        <div className="info-item">
          <span className="info-label">Current Position:</span>
          <span className="info-value">{teamData.positions[teamData.positions.length - 1].position}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Best Position:</span>
          <span className="info-value">{Math.min(...teamData.positions.map(p => p.position))}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Worst Position:</span>
          <span className="info-value">{Math.max(...teamData.positions.map(p => p.position))}</span>
        </div>
      </div>
    </div>
  );
};
