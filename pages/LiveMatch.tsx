import React, { useState, useMemo, useEffect } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import useTimer from '../hooks/useTimer.ts';
import type { Match, MatchEvent } from '../types.ts';
import { MatchEventType } from '../types.ts';
import Button from '../components/ui/Button.tsx';
import Modal from '../components/ui/Modal.tsx';
import EventForm from '../components/EventForm.tsx';
import { ChevronLeftIcon, PlayIcon, PauseIcon, ArrowPathIcon, XMarkIcon } from '../components/icons/Icons.tsx';

interface LiveMatchProps {
    matchId: string;
    onBack: () => void;
}

const LiveMatch: React.FC<LiveMatchProps> = ({ matchId, onBack }) => {
    const { getMatchById, updateMatch, players } = useCompetitions();
    
    // Local state for the match, initialized from context
    const [match, setMatch] = useState<Match | null>(() => getMatchById(matchId) || null);
    
    // Timer hook, initialized with the match's current elapsed time
    const { time, isActive, isPaused, handleStart, handlePause, handleResume, handleReset } = useTimer(match?.elapsedSeconds || 0);
    
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [eventDefaults, setEventDefaults] = useState<{type: MatchEventType, teamId: string} | null>(null);

    // Effect to synchronize the local timer back to the global context
    useEffect(() => {
        if (match) {
            // This check prevents an infinite loop. Only update if the time has actually changed.
            if (match.elapsedSeconds !== time) {
                const updatedMatch = { ...match, elapsedSeconds: time };
                // This updates the global state, making it available to the public page.
                updateMatch(updatedMatch);
                // Also update the local state to stay in sync.
                setMatch(updatedMatch);
            }
        }
    }, [time, match, updateMatch]);


    const matchEvents = useMemo(() => {
        return match ? [...match.events].sort((a, b) => b.minute - a.minute) : [];
    }, [match]);
    
    if (!match) {
        return <div>Match not found. <Button onClick={onBack}>Back</Button></div>;
    }

    const handleSaveEvent = (data: Omit<MatchEvent, 'id' | 'minute'>) => {
        const newEvent: MatchEvent = {
            ...data,
            id: `evt-${Date.now()}`,
            minute: Math.floor(time / 60),
        };

        const updatedMatch = { ...match };
        updatedMatch.events.push(newEvent);

        // Update score if it's a goal
        if (newEvent.type === MatchEventType.GOAL) {
            if (newEvent.teamId === match.homeTeam.id) {
                updatedMatch.homeScore++;
            } else {
                updatedMatch.awayScore++;
            }
        }
        
        updateMatch(updatedMatch);
        setMatch(updatedMatch); // Update local state
        setIsEventModalOpen(false);
        setEventDefaults(null);
    };

    const handleDeleteEvent = (eventId: string) => {
        if (!match) return;

        const eventToDelete = match.events.find(e => e.id === eventId);
        if (!eventToDelete) return;
        
        if (window.confirm(`Are you sure you want to delete this event: ${eventToDelete.type} at ${eventToDelete.minute}'?`)) {
            const updatedMatch = { ...match };

            // If it was a goal, decrement the score
            if (eventToDelete.type === MatchEventType.GOAL) {
                if (eventToDelete.teamId === match.homeTeam.id) {
                    updatedMatch.homeScore = Math.max(0, updatedMatch.homeScore - 1);
                } else {
                    updatedMatch.awayScore = Math.max(0, updatedMatch.awayScore - 1);
                }
            }

            // Remove the event
            updatedMatch.events = match.events.filter(e => e.id !== eventId);

            updateMatch(updatedMatch);
            setMatch(updatedMatch);
        }
    };

    const handleResetScore = () => {
        if (!match) return;
        if (window.confirm('Are you sure you want to reset the score to 0-0 and remove all goal events? This action cannot be undone.')) {
            const updatedMatch = {
                ...match,
                homeScore: 0,
                awayScore: 0,
                events: match.events.filter(e => e.type !== MatchEventType.GOAL)
            };
            updateMatch(updatedMatch);
            setMatch(updatedMatch);
        }
    };
    
    const openEventModal = (type: MatchEventType, teamId: string) => {
        setEventDefaults({ type, teamId });
        setIsEventModalOpen(true);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    
    const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || 'Unknown Player';

    return (
        <div>
            <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
                <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back
            </button>

            {/* Scoreboard */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">{match.homeTeam.name}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-5xl font-extrabold text-gray-900">{match.homeScore} - {match.awayScore}</p>
                        <p className="text-2xl font-mono text-red-600 font-bold tracking-wider">{formatTime(time)}</p>
                    </div>
                    <div className="text-left">
                        <p className="text-2xl font-bold text-gray-800">{match.awayTeam.name}</p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Controls */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-bold mb-3 text-center">Timer Controls</h3>
                        <div className="flex justify-center space-x-2">
                           {!isActive ? (
                                <Button onClick={handleStart} className="flex-1"><PlayIcon className="h-5 w-5 mr-1"/>Start</Button>
                           ) : isPaused ? (
                                <Button onClick={handleResume} className="flex-1"><PlayIcon className="h-5 w-5 mr-1"/>Resume</Button>
                           ) : (
                                <Button onClick={handlePause} className="flex-1" variant="secondary"><PauseIcon className="h-5 w-5 mr-1"/>Pause</Button>
                           )}
                           <Button onClick={handleReset} variant="outline" className="flex-1"><ArrowPathIcon className="h-5 w-5 mr-1"/>Reset</Button>
                        </div>
                        <Button onClick={handleResetScore} variant="danger" className="w-full mt-2">Reset Score</Button>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-bold mb-3 text-center">{match.homeTeam.name}</h3>
                        <div className="space-y-2">
                            <Button onClick={() => openEventModal(MatchEventType.GOAL, match.homeTeam.id)} className="w-full">Goal</Button>
                            <Button onClick={() => openEventModal(MatchEventType.YELLOW_CARD, match.homeTeam.id)} className="w-full" variant="secondary">Yellow Card</Button>
                            <Button onClick={() => openEventModal(MatchEventType.RED_CARD, match.homeTeam.id)} className="w-full" variant="danger">Red Card</Button>
                            <Button onClick={() => openEventModal(MatchEventType.SUBSTITUTION, match.homeTeam.id)} className="w-full" variant="outline">Substitution</Button>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-bold mb-3 text-center">{match.awayTeam.name}</h3>
                        <div className="space-y-2">
                            <Button onClick={() => openEventModal(MatchEventType.GOAL, match.awayTeam.id)} className="w-full">Goal</Button>
                            <Button onClick={() => openEventModal(MatchEventType.YELLOW_CARD, match.awayTeam.id)} className="w-full" variant="secondary">Yellow Card</Button>
                            <Button onClick={() => openEventModal(MatchEventType.RED_CARD, match.awayTeam.id)} className="w-full" variant="danger">Red Card</Button>
                            <Button onClick={() => openEventModal(MatchEventType.SUBSTITUTION, match.awayTeam.id)} className="w-full" variant="outline">Substitution</Button>
                        </div>
                    </div>
                </div>

                {/* Event Log */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
                    <h3 className="font-bold mb-3 text-xl">Match Events</h3>
                    <ul className="divide-y divide-gray-200">
                        {matchEvents.map(event => (
                            <li key={event.id} className="py-3 flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="font-bold text-lg w-12">{event.minute}'</span>
                                    <div>
                                        <p className="font-semibold">{event.type}</p>
                                        <p className="text-sm text-gray-600">
                                            {event.type === MatchEventType.SUBSTITUTION 
                                                ? `${getPlayerName(event.primaryPlayerId)} out, ${getPlayerName(event.secondaryPlayerId!)} in` 
                                                : getPlayerName(event.primaryPlayerId)}
                                            ({event.teamId === match.homeTeam.id ? match.homeTeam.name : match.awayTeam.name})
                                        </p>
                                    </div>
                                </div>
                                <Button size="sm" variant="danger" onClick={() => handleDeleteEvent(event.id)}>
                                    <XMarkIcon className="h-4 w-4" />
                                </Button>
                            </li>
                        ))}
                         {matchEvents.length === 0 && (
                            <p className="text-center text-gray-500 py-8">No events have been recorded yet.</p>
                        )}
                    </ul>
                </div>
            </div>

            <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title="Add Match Event">
                <EventForm
                    eventDefaults={eventDefaults}
                    match={match}
                    onSave={handleSaveEvent}
                    onClose={() => setIsEventModalOpen(false)}
                />
            </Modal>
        </div>
    );
}

export default LiveMatch;
