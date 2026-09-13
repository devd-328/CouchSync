'use client';

import React, { useState } from 'react';
import { Vote, CheckCircle2, X, BarChart3, Plus } from 'lucide-react';
import { RoomPoll } from '@/types/sync';
import { generateId } from '@/lib/formatters';

interface RoomPollComponentProps {
  activePoll: RoomPoll | null;
  currentUserId: string;
  onBroadcastPollCreate: (poll: RoomPoll) => void;
  onBroadcastVote: (pollId: string, optionIndex: number) => void;
  onBroadcastClose: (pollId: string) => void;
}

export function RoomPollComponent({
  activePoll,
  currentUserId,
  onBroadcastPollCreate,
  onBroadcastVote,
  onBroadcastClose,
}: RoomPollComponentProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['Yes', 'No']);

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const handleOptionTextChange = (idx: number, text: string) => {
    const updated = [...options];
    updated[idx] = text;
    setOptions(updated);
  };

  const handleCreatePollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || validOptions.length < 2) return;

    const newPoll: RoomPoll = {
      id: generateId('poll'),
      question: question.trim(),
      options: validOptions,
      votes: {},
      creatorId: currentUserId,
      createdAt: Date.now(),
      isActive: true,
    };

    onBroadcastPollCreate(newPoll);
    setShowCreateModal(false);
    setQuestion('');
    setOptions(['Yes', 'No']);
  };

  // If there's an active poll, show live poll widget
  if (activePoll && activePoll.isActive) {
    const totalVotes = Object.keys(activePoll.votes).length;
    const userVote = activePoll.votes[currentUserId];

    // Calculate vote counts per option
    const counts = activePoll.options.map((_, idx) => {
      return Object.values(activePoll.votes).filter((v) => v === idx).length;
    });

    return (
      <div className="rounded-2xl glass-panel border-cyan-500/30 p-3.5 flex flex-col gap-2.5 shadow-2xl bg-black/70 backdrop-blur-xl animate-fade-in text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" />
            Live In-Stream Poll
          </span>
          {activePoll.creatorId === currentUserId && (
            <button
              onClick={() => onBroadcastClose(activePoll.id)}
              className="text-[10px] text-gray-400 hover:text-rose-300 transition"
            >
              End Poll
            </button>
          )}
        </div>

        <p className="font-medium text-gray-100 text-xs leading-snug">
          {activePoll.question}
        </p>

        {/* Voting Options */}
        <div className="flex flex-col gap-1.5">
          {activePoll.options.map((opt, idx) => {
            const voteCount = counts[idx] || 0;
            const percent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
            const hasVotedThis = userVote === idx;

            return (
              <button
                key={idx}
                onClick={() => onBroadcastVote(activePoll.id, idx)}
                className={`relative w-full overflow-hidden p-2.5 rounded-xl text-left border transition ${
                  hasVotedThis
                    ? 'border-cyan-400/60 bg-cyan-500/20 text-cyan-200'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-200'
                }`}
              >
                {/* Progress bar background fill */}
                <div
                  className="absolute inset-0 bg-cyan-500/15 pointer-events-none transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />

                <div className="relative flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 truncate">
                    {hasVotedThis && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    <span className="truncate">{opt}</span>
                  </div>
                  <span className="font-mono text-[11px] text-gray-400 shrink-0 ml-2">
                    {percent}% ({voteCount})
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <span className="text-[10px] text-gray-500 text-right">
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} total
        </span>
      </div>
    );
  }

  // Trigger button to start a poll when none active
  return (
    <div>
      <button
        onClick={() => setShowCreateModal(true)}
        className="w-full py-2 px-3 rounded-xl glass-panel hover:bg-white/10 border-white/10 text-xs font-semibold text-gray-300 flex items-center justify-center gap-2 transition"
      >
        <Vote className="w-3.5 h-3.5 text-cyan-400" />
        <span>Create Quick Poll</span>
      </button>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md">
          <div className="min-h-full flex items-center justify-center p-4">
            <form
              onSubmit={handleCreatePollSubmit}
              className="w-full max-w-sm rounded-2xl glass-panel border-white/10 p-5 flex flex-col gap-3.5 shadow-2xl bg-[#101420] my-auto"
            >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <Vote className="w-4 h-4 text-cyan-400" />
                Ask a Question / Poll
              </span>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="e.g. Will they make it back to Earth?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50"
            />

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Options
              </span>
              {options.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                  required
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50"
                />
              ))}

              {options.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start pt-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add another option</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-linear-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white rounded-xl font-bold text-xs shadow-lg transition"
            >
              Launch Poll to Room
            </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
