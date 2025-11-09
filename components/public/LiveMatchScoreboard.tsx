import React from 'react';
import type { Match } from '../../types.ts';

interface LiveMatchScoreboardProps {
  match: Match;
  time: string; // Formatted time string, e.g., "45:00"
}

const LiveMatchScoreboard: React.FC<LiveMatchScoreboardProps> = ({ match, time }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center">
        <div className="text-right flex items-center space-x-4">
          <span className="text-2xl font-bold text-gray-800 hidden md:inline">{match.homeTeam.name}</span>
          <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="h-12 w-12 rounded-full" />
        </div>
        <div className="text-center">
          <p className="text-5xl font-extrabold text-gray-900">{match.homeScore} - {match.awayScore}</p>
          <p className="text-2xl font-mono text-red-600 font-bold tracking-wider mt-1">{time}</p>
        </div>
        <div className="text-left flex items-center space-x-4">
          <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="h-12 w-12 rounded-full" />
          <span className="text-2xl font-bold text-gray-800 hidden md:inline">{match.awayTeam.name}</span>
        </div>
      </div>
    </div>
  );
};

export default LiveMatchScoreboard;
