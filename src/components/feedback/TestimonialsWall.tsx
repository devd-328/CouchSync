import React from 'react';
import { supabase } from '@/lib/supabase';
import { Star, MessageSquareQuote } from 'lucide-react';

export interface TestimonialItem {
  id: string;
  rating: number | null;
  message: string;
  nickname: string | null;
  created_at: string;
}

/**
 * Server Component: Queries and renders community testimonials.
 * Per specification:
 * - Queries Supabase for approved = true AND show_publicly = true AND type = 'testimonial', order by created_at desc, limit 20.
 * - Renders nothing (null) if fewer than 3 results exist (no empty state).
 * - If 3+, renders average star rating, total count, and a responsive grid of testimonial cards.
 */
export async function TestimonialsWall() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('id, rating, message, nickname, created_at')
      .eq('type', 'testimonial')
      .eq('approved', true)
      .eq('show_publicly', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error || !data || data.length < 3) {
      return null;
    }

    const testimonials = data as TestimonialItem[];
    const rated = testimonials.filter((t) => t.rating != null && t.rating > 0);
    const avgRating =
      rated.length > 0
        ? (rated.reduce((sum, t) => sum + (t.rating || 0), 0) / rated.length).toFixed(1)
        : '5.0';

    return (
      <section className="mt-16 sm:mt-24 pt-12 border-t border-black/8 animate-in fade-in duration-300">
        {/* Wall Header with summary stats */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-800 font-bold shadow-2xs mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Community Wall</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl text-gray-950 tracking-tight">
            Loved by Watch Party Hosts
          </h2>

          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]"
                />
              ))}
            </div>
            <span className="text-sm font-black text-gray-950">{avgRating} / 5</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-semibold text-gray-600">
              {testimonials.length} {testimonials.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((item) => {
            const displayName = item.nickname?.trim() || 'Anonymous';
            const initial = displayName.charAt(0).toUpperCase();
            const starCount = item.rating || 5;

            return (
              <div
                key={item.id}
                className="bg-white card-hover rounded-3xl p-6 border border-black/8 shadow-2xs flex flex-col justify-between transition"
              >
                <div>
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= starCount
                            ? 'text-[#F59E0B] fill-[#F59E0B]'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Message */}
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                    &ldquo;{item.message}&rdquo;
                  </p>
                </div>

                {/* Nickname & Avatar */}
                <div className="mt-5 pt-4 border-t border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-100 border border-orange-200 text-[#EA580C] font-bold text-xs flex items-center justify-center shrink-0">
                      {initial}
                    </div>
                    <span className="text-xs font-bold text-gray-950 truncate max-w-[180px]">
                      {displayName}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  } catch (err) {
    console.error('[TestimonialsWall] Error fetching testimonials:', err);
    return null;
  }
}
