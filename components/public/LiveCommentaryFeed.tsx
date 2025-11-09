import React from 'react';
import { MatchEventType, type MatchEvent } from '../../types.ts';
import { useCompetitions } from '../../context/CompetitionContext.tsx';

interface LiveCommentaryFeedProps {
  events: MatchEvent[];
}

/**
 * Renders a live feed of match events (goals, cards, substitutions).
 * @param {LiveCommentaryFeedProps} props The component props.
 * @returns {JSX.Element} A list of commentary entries.
 */
const LiveCommentaryFeed: React.FC<LiveCommentaryFeedProps> = ({ events }) => {
  const { players, teams } = useCompetitions();

  const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || 'Unknown';
  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Unknown';
  
  /**
   * Renders a single event with appropriate icon and text based on its type.
   * @param {MatchEvent} event The match event to render.
   * @returns {React.ReactElement} The JSX for the event.
   */
  const renderEvent = (event: MatchEvent): React.ReactElement => {
    const iconBaseClass = "h-5 w-5 rounded-full flex items-center justify-center text-white text-xs font-bold";

    switch (event.type) {
      case MatchEventType.GOAL: {
        const teamName = getTeamName(event.teamId);
        const playerName = getPlayerName(event.primaryPlayerId);
        return (
          <div className="flex items-center">
            <div className={`${iconBaseClass} bg-green-500`}>G</div>
            <p className="ml-3">
              <span className="font-bold">GOAL!</span> Scored by <span className="font-semibold">{playerName}</span> for {teamName}.
            </p>
          </div>
        );
      }
      case MatchEventType.YELLOW_CARD:
      case MatchEventType.RED_CARD: {
        const teamName = getTeamName(event.teamId);
        const playerName = getPlayerName(event.primaryPlayerId);
        const cardType = event.type === MatchEventType.YELLOW_CARD ? 'Yellow' : 'Red';
        // FIX: Renamed variable from `class` (a reserved word) to `cardClass`.
        const cardClass = cardType === 'Yellow' ? 'text-yellow-500' : 'text-red-600';
        const cardIconBg = cardType === 'Yellow' ? 'bg-yellow-400' : 'bg-red-600';

        return (
          <div className="flex items-center">
             <div className={`${iconBaseClass} ${cardIconBg}`}>C</div>
            <p className="ml-3">
              <span className={`font-semibold ${cardClass}`}>{cardType} card</span> for {playerName} ({teamName}).
            </p>
          </div>
        );
      }
      case MatchEventType.SUBSTITUTION: {
        const teamName = getTeamName(event.teamId);
        const playerIn = getPlayerName(event.secondaryPlayerId!);
        const playerOut = getPlayerName(event.primaryPlayerId);
        return (
          <div className="flex items-center">
            <div className={`${iconBaseClass} bg-blue-500`}>S</div>
            <p className="ml-3">
              Substitution for {teamName}: <span className="font-semibold text-green-600">{playerIn}</span> comes in for <span className="font-semibold text-red-600">{playerOut}</span>.
            </p>
          </div>
        );
      }
      default:
        return <></>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-2">Live Commentary</h3>
      {events.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500">No events yet...</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-y-auto flex-grow">
          {events.map(event => (
            <li key={event.id} className="py-3 text-sm text-gray-700 flex items-center">
                <span className="font-mono text-xs text-gray-500 w-10 text-center">{event.minute}'</span>
                <div className="flex-1">{renderEvent(event)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LiveCommentaryFeed;
