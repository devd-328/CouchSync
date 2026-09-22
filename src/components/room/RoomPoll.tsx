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

    const counts = activePoll.options.map((_, idx) => {
      return Object.values(activePoll.votes).filter((v) => v === idx).length;
    });

    return (
      <div className="rounded-2xl bg-white border border-black/8 p-4 flex flex-col gap-3 shadow-sm text-xs text-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <span className="font-bold text-[#E64A19] flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-[#FF5722]" />
            Live In-Stream Poll
          </span>
          {activePoll.creatorId === currentUserId && (
            <button
              onClick={() => onBroadcastClose(activePoll.id)}
              className="text-[11px] font-semibold text-gray-500 hover:text-rose-600 transition cursor-pointer"
            >
              End Poll
            </button>
          )}
        </div>

        <p className="font-bold text-gray-900 text-sm leading-snug">
          {activePoll.question}
        </p>

        {/* Voting Options */}
        <div className="flex flex-col gap-2">
          {activePoll.options.map((opt, idx) => {
            const voteCount = counts[idx] || 0;
            const percent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
            const hasVotedThis = userVote === idx;

            return (
              <button
                key={idx}
                onClick={() => onBroadcastVote(activePoll.id, idx)}
                className={`relative overflow-hidden rounded-xl border text-left p-2.5 transition flex flex-col justify-center cursor-pointer ${
                  hasVotedThis
                    ? 'border-[#FF5722] bg-orange-50/60'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100/70 hover:border-gray-300'
                }`}
              >
                {/* Visual percentage progress bar */}
                <div
                  className="absolute inset-0 bg-orange-200/50 -z-0 transition-all duration-300 pointer-events-none"
                  style={{ width: `${percent}%` }}
                />

                <div className="relative z-10 flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-xs text-gray-900">
                    {opt}
                    {hasVotedThis && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5722]" />
                    )}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-gray-700">
                    {percent}% ({voteCount})
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-[10px] text-gray-400 font-mono text-center pt-1 border-t border-gray-100">
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} total
        </div>
      </div>
    );
  }

  // Idle state: prompt to launch a poll
  return (
    <div className="flex flex-col h-full min-h-0 justify-center items-center text-center p-6 text-gray-900">
      <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center mb-3 text-[#FF5722] shadow-2xs">
        <Vote className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-gray-900">Room Polls</h3>
      <p className="text-xs text-gray-600 mt-1 max-w-[220px]">
        Ask your friends what to watch next, rate the movie, or make group predictions!
      </p>

      <button
        onClick={() => setShowCreateModal(true)}
        className="mt-4 px-4 py-2 rounded-xl bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Create Quick Poll</span>
      </button>

      {/* Create Poll Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-black/8 p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-950 text-base">New Room Poll</span>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-900 hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePollSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase">Question</label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Which movie next?"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#FF5722] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-600 uppercase">Options</label>
                {options.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => handleOptionTextChange(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="w-full px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#FF5722] focus:bg-white"
                  />
                ))}

                {options.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-xs font-semibold text-[#FF5722] hover:underline self-start mt-1"
                  >
                    + Add option
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 justify-end mt-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-linear-to-r from-[#FF5722] to-[#FF7043] text-white text-xs font-bold shadow-xs hover:shadow-md transition"
                >
                  Launch Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
