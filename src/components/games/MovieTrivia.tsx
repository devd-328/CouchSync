'use client';

import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Trophy,
  Timer,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clapperboard,
} from 'lucide-react';
import { TriviaQuestion, TriviaAction } from '@/types/sync';

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 'q1',
    question: 'In "The Matrix", what color pill does Neo take to wake up in the real world?',
    options: ['Blue', 'Red', 'Green', 'Yellow'],
    correctIndex: 1,
    category: 'Sci-Fi Classics',
  },
  {
    id: 'q2',
    question: 'Which movie won the first-ever Academy Award for Best Animated Feature in 2001?',
    options: ['Monsters, Inc.', 'Shrek', 'Jimmy Neutron', 'Spirited Away'],
    correctIndex: 1,
    category: 'Animation',
  },
  {
    id: 'q3',
    question: 'What is the highest-grossing film of all time (unadjusted for inflation)?',
    options: ['Avengers: Endgame', 'Titanic', 'Avatar', 'Star Wars: The Force Awakens'],
    correctIndex: 2,
    category: 'Blockbusters',
  },
  {
    id: 'q4',
    question: 'In "Inception", what is Cobb\'s totem used to test reality?',
    options: ['A loaded die', 'A spinning top', 'A brass coin', 'A chess piece'],
    correctIndex: 1,
    category: 'Sci-Fi Classics',
  },
  {
    id: 'q5',
    question: 'Which actor played the Joker in Christopher Nolan\'s "The Dark Knight"?',
    options: ['Joaquin Phoenix', 'Jack Nicholson', 'Heath Ledger', 'Jared Leto'],
    correctIndex: 2,
    category: 'Superhero Cinema',
  },
  {
    id: 'q6',
    question: '"May the Force be with you" was famously spoken in which year\'s debut film?',
    options: ['1975', '1977', '1980', '1983'],
    correctIndex: 1,
    category: 'Movie Quotes',
  },
  {
    id: 'q7',
    question: 'In "Pulp Fiction", what is inside Marsellus Wallace\'s glowing briefcase?',
    options: ['Diamonds', 'Gold bars', 'Never revealed', 'An alien artifact'],
    correctIndex: 2,
    category: 'Cinema Mysteries',
  },
  {
    id: 'q8',
    question: 'Which animated movie features the emotional song "Remember Me"?',
    options: ['Coco', 'Moana', 'Soul', 'Encanto'],
    correctIndex: 0,
    category: 'Animation',
  },
];

interface MovieTriviaProps {
  currentUserId: string;
  currentUserName: string;
  isHost: boolean;
  onSendTriviaAction: (action: TriviaAction) => void;
  remoteTriviaAction: TriviaAction | null;
  onCloseTrivia: () => void;
}

export function MovieTrivia({
  currentUserId,
  currentUserName,
  isHost,
  onSendTriviaAction,
  remoteTriviaAction,
  onCloseTrivia,
}: MovieTriviaProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [scores, setScores] = useState<Record<string, { name: string; score: number }>>({
    [currentUserId]: { name: currentUserName, score: 0 },
  });

  const currentQ = TRIVIA_QUESTIONS[questionIndex % TRIVIA_QUESTIONS.length];

  // Handle incoming remote actions
  useEffect(() => {
    if (!remoteTriviaAction) return;

    if (remoteTriviaAction.type === 'trivia-start' || remoteTriviaAction.type === 'trivia-next') {
      setQuestionIndex(remoteTriviaAction.questionIndex);
      setSelectedOption(null);
      setHasAnswered(false);
      setTimeLeft(15);
    } else if (remoteTriviaAction.type === 'trivia-score') {
      setScores((prev) => ({
        ...prev,
        [remoteTriviaAction.userId]: {
          name: remoteTriviaAction.userName,
          score: remoteTriviaAction.score,
        },
      }));
    } else if (remoteTriviaAction.type === 'trivia-end') {
      onCloseTrivia();
    }
  }, [remoteTriviaAction, onCloseTrivia]);

  // 15-second countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || hasAnswered) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setHasAnswered(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, hasAnswered]);

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    const gainedPoints = isCorrect ? Math.max(10, timeLeft * 10) : 0;
    const newTotal = (scores[currentUserId]?.score || 0) + gainedPoints;

    setScores((prev) => ({
      ...prev,
      [currentUserId]: { name: currentUserName, score: newTotal },
    }));

    onSendTriviaAction({
      type: 'trivia-score',
      userId: currentUserId,
      userName: currentUserName,
      score: newTotal,
    });
  };

  const handleNextQuestion = () => {
    const nextIdx = (questionIndex + 1) % TRIVIA_QUESTIONS.length;
    setQuestionIndex(nextIdx);
    setSelectedOption(null);
    setHasAnswered(false);
    setTimeLeft(15);

    onSendTriviaAction({
      type: 'trivia-next',
      questionIndex: nextIdx,
    });
  };

  const timerPercentage = (timeLeft / 15) * 100;

  return (
    <div className="relative w-full h-full min-h-[420px] flex flex-col justify-between bg-gradient-to-b from-[#0F1424] via-[#0A0D18] to-[#0F1424] rounded-2xl p-6 border border-white/10 shadow-2xl overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Intermission Movie Trivia</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-white/10 text-amber-300">
                {currentQ.category}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Question {questionIndex + 1} of {TRIVIA_QUESTIONS.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer Display */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-white">
            <Timer className={`w-3.5 h-3.5 ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
            <span className={timeLeft <= 5 ? 'text-rose-400' : ''}>{timeLeft}s</span>
          </div>

          <button
            onClick={onCloseTrivia}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition flex items-center gap-1.5"
          >
            <Clapperboard className="w-3.5 h-3.5 text-cyan-400" />
            <span>Return to Movie</span>
          </button>
        </div>
      </div>

      {/* Countdown Progress Bar */}
      <div className="relative z-10 w-full h-1.5 bg-white/10 rounded-full overflow-hidden my-3">
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${
            timeLeft <= 5
              ? 'bg-gradient-to-r from-rose-500 to-amber-500'
              : 'bg-gradient-to-r from-amber-400 to-cyan-400'
          }`}
          style={{ width: `${timerPercentage}%` }}
        />
      </div>

      {/* Question & Options Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-2">
        <h4 className="text-lg sm:text-xl font-bold text-white text-center mb-6 leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
          {currentQ.question}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto w-full">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;
            let btnStyle = 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200';

            if (hasAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
              } else if (isSelected) {
                btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-200';
              } else {
                btnStyle = 'bg-white/5 border-white/5 text-gray-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`p-3.5 rounded-xl border text-sm font-semibold text-left transition-all duration-200 flex items-center justify-between group ${btnStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center text-xs font-mono font-bold text-gray-400 group-hover:text-white">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {hasAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {hasAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer: Live Scores & Next Button */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        {/* Live Leaderboard */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Scores:</span>
          </div>
          <div className="flex items-center gap-2">
            {Object.entries(scores).map(([uid, data]) => (
              <div
                key={uid}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-200 flex items-center gap-1.5"
              >
                <span className="font-semibold text-amber-300">{data.name}:</span>
                <span className="font-mono font-bold">{data.score} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Question Control */}
        <div className="flex items-center gap-2">
          {hasAnswered && (
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-white text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] transition flex items-center gap-1.5 transform hover:scale-[1.02]"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
