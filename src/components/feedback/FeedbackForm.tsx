'use client';

import React, { useState, useEffect } from 'react';
import { Star, Send, CheckCircle2, MessageSquare, Mail, Sparkles, Heart } from 'lucide-react';

export function FeedbackForm() {
  const [activeTab, setActiveTab] = useState<'testimonial' | 'contact'>('testimonial');

  // Shared state (retained across tab changes)
  const [hp, setHp] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Testimonial state
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [testimonialMessage, setTestimonialMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPublicly, setShowPublicly] = useState(false);

  // Contact state
  const [contactMessage, setContactMessage] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');

  // Status & error handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cooldown countdown effect matching the 60s server rate-limit
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (cooldownSeconds > 0) {
      setErrorMessage(`Please wait ${cooldownSeconds}s before submitting again.`);
      return;
    }

    const currentMessage = activeTab === 'testimonial' ? testimonialMessage : contactMessage;
    const trimmedMessage = currentMessage.trim();

    if (trimmedMessage.length < 10) {
      setErrorMessage('Message must be at least 10 characters long.');
      return;
    }

    if (trimmedMessage.length > 500) {
      setErrorMessage('Message cannot exceed 500 characters.');
      return;
    }

    if (activeTab === 'testimonial' && (!rating || rating < 1 || rating > 5)) {
      setErrorMessage('Please select a star rating from 1 to 5.');
      return;
    }

    if (activeTab === 'contact') {
      const trimmedEmail = email.trim();
      const trimmedSubject = subject.trim();

      if (!trimmedEmail) {
        setErrorMessage('Please provide your email address so we can reply to you.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setErrorMessage('Please provide a valid email address.');
        return;
      }

      if (!trimmedSubject) {
        setErrorMessage('Please provide a subject for your message.');
        return;
      }

      if (trimmedSubject.length < 3) {
        setErrorMessage('Subject must be at least 3 characters long.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        type: activeTab,
        rating: activeTab === 'testimonial' ? rating : null,
        subject: activeTab === 'contact' ? subject.trim() : null,
        message: trimmedMessage,
        nickname: activeTab === 'testimonial' ? nickname.trim() || null : null,
        email: activeTab === 'contact' ? email.trim() : null,
        show_publicly: activeTab === 'testimonial' ? showPublicly : false,
        hp,
      };

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setCooldownSeconds(60);
        }
        setErrorMessage(data.error || 'Failed to submit. Please try again.');
        return;
      }

      // Success
      setIsSuccess(true);
      setCooldownSeconds(60); // 60s client lock matching server rate-limit

      // Clear input fields
      if (activeTab === 'testimonial') {
        setTestimonialMessage('');
        setNickname('');
        setShowPublicly(false);
      } else {
        setContactMessage('');
        setEmail('');
        setSubject('');
      }
    } catch {
      setErrorMessage('Network error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForAnother = () => {
    setIsSuccess(false);
    setErrorMessage(null);
  };

  const isCooldownActive = cooldownSeconds > 0;
  const currentMsgLength = activeTab === 'testimonial' ? testimonialMessage.length : contactMessage.length;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* ── Two-Tab Pill Navigation ──────────────────────────────────── */}
      <div className="flex items-center justify-center p-1.5 bg-black/5 rounded-2xl max-w-sm mx-auto mb-8 border border-black/5">
        <button
          type="button"
          onClick={() => {
            setActiveTab('testimonial');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'testimonial'
            ? 'bg-white text-gray-950 shadow-2xs'
            : 'text-gray-600 hover:text-gray-950'
            }`}
        >
          <Heart className="w-4 h-4 text-[#FF5722]" />
          <span>Leave a Review</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('contact');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'contact'
            ? 'bg-white text-gray-950 shadow-2xs'
            : 'text-gray-600 hover:text-gray-950'
            }`}
        >
          <Mail className="w-4 h-4 text-[#FF5722]" />
          <span>Contact Us</span>
        </button>
      </div>

      {/* ── Form Card Surface ───────────────────────────────────────── */}
      <div className="bg-white card-hover rounded-3xl p-6 sm:p-10 border border-black/8 shadow-2xs transition">
        {isSuccess ? (
          <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="font-display text-xl sm:text-2xl text-gray-950">
                {activeTab === 'testimonial' ? 'Thank you for your review!' : 'Message received!'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                {activeTab === 'testimonial'
                  ? 'Your feedback helps shape CouchSync Live. If you selected public display, it will appear on our testimonials wall once approved.'
                  : 'Thanks for reaching out! We will review your message shortly.'}
              </p>
            </div>

            {isCooldownActive && (
              <p className="text-xs text-gray-400 font-medium">
                Cooldown active: submit button available in {cooldownSeconds}s
              </p>
            )}

            <div className="pt-4">
              <button
                type="button"
                onClick={handleResetForAnother}
                className="px-6 py-2.5 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs sm:text-sm font-semibold text-gray-800 transition cursor-pointer"
              >
                Send Another Note
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ── Visually Hidden Honeypot (Off-screen positioned, NOT display:none) ── */}
            <div
              style={{
                position: 'absolute',
                left: '-9999px',
                top: 'auto',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                opacity: 0,
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              <label htmlFor="website_url_hp">Please leave this field empty</label>
              <input
                id="website_url_hp"
                type="text"
                name="website_url_hp"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* ── Testimonial Specific Fields ───────────────────────── */}
            {activeTab === 'testimonial' && (
              <>
                {/* Rating Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Rating <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const isFilled = (hoverRating || rating) >= starVal;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setRating(starVal)}
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(0)}
                          aria-label={`${starVal} star${starVal > 1 ? 's' : ''}`}
                          className="p-1 rounded-lg hover:bg-orange-50 transition cursor-pointer focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition ${isFilled
                              ? 'text-[#F59E0B] fill-[#F59E0B]'
                              : 'text-gray-300 hover:text-amber-300'
                              }`}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-2 text-xs font-semibold text-gray-500">
                      {hoverRating || rating} / 5
                    </span>
                  </div>
                </div>

                {/* Nickname Input */}
                <div>
                  <label
                    htmlFor="feedback-nickname"
                    className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5"
                  >
                    Display Name / Nickname <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="feedback-nickname"
                    type="text"
                    maxLength={60}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="e.g. CinephileSam (defaults to Anonymous)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5722] focus:bg-white transition"
                  />
                </div>
              </>
            )}

            {/* ── Contact Specific Fields ───────────────────────────── */}
            {activeTab === 'contact' && (
              <>
                <div>
                  <label
                    htmlFor="feedback-email"
                    className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5"
                  >
                    Your Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5722] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="feedback-subject"
                    className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5"
                  >
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="feedback-subject"
                    type="text"
                    required
                    maxLength={100}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Bug report, Feature request, Question..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5722] focus:bg-white transition"
                  />
                </div>
              </>
            )}

            {/* ── Message Textarea (Shared) ─────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="feedback-message"
                  className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {activeTab === 'testimonial' ? 'Review / Testimonial' : 'Your Message'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <span
                  className={`text-[11px] font-medium ${currentMsgLength > 480
                    ? 'text-rose-500'
                    : currentMsgLength >= 10
                      ? 'text-gray-500'
                      : 'text-amber-600'
                    }`}
                >
                  {currentMsgLength} / 500 {currentMsgLength > 0 && currentMsgLength < 10 && '(min 10)'}
                </span>
              </div>
              <textarea
                id="feedback-message"
                rows={4}
                maxLength={500}
                required
                value={activeTab === 'testimonial' ? testimonialMessage : contactMessage}
                onChange={(e) => {
                  if (activeTab === 'testimonial') {
                    setTestimonialMessage(e.target.value);
                  } else {
                    setContactMessage(e.target.value);
                  }
                }}
                placeholder={
                  activeTab === 'testimonial'
                    ? 'How was your experience watching movies together on CouchSync Live?'
                    : 'Questions, bug reports, feature suggestions, or hello...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5722] focus:bg-white transition resize-none leading-relaxed"
              />
            </div>

            {/* ── Show Publicly Checkbox (Testimonial tab only) ─────── */}
            {activeTab === 'testimonial' && (
              <div className="p-3 rounded-2xl bg-orange-50/60 border border-orange-200/60">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showPublicly}
                    onChange={(e) => setShowPublicly(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#FF5722] focus:ring-[#FF5722] cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-gray-900">Show my review publicly</span>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      Allow your review and nickname to be featured on the community testimonials wall after moderation.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* ── Error Banner ──────────────────────────────────────── */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
                {errorMessage}
              </div>
            )}

            {/* ── Submit Button with 60s cooldown ──────────────────── */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isCooldownActive}
                className={`w-full py-3.5 rounded-full bg-linear-to-r from-[#FF5722] to-[#FF7043] text-white font-bold text-xs sm:text-sm shadow-[0_6px_20px_rgba(255,87,34,0.3)] transition transform flex items-center justify-center gap-2 ${isSubmitting || isCooldownActive
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-[#F4511E] hover:to-[#FF5722] hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  }`}
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : isCooldownActive ? (
                  <span>Please wait {cooldownSeconds}s</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{activeTab === 'testimonial' ? 'Submit Review' : 'Send Message'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
