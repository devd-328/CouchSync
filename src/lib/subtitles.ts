/**
 * Client-side Subtitle Parser and Timing Adjuster
 * Converts .srt and .vtt files into compliant WebVTT blob URLs with dynamic timing offsets.
 */

function shiftTimestamp(timestampStr: string, offsetSec: number): string {
  // Matches HH:MM:SS.mmm or HH:MM:SS,mmm
  const parts = timestampStr.replace(',', '.').split(':');
  if (parts.length < 3) return timestampStr;

  const hours = parseFloat(parts[0]);
  const minutes = parseFloat(parts[1]);
  const seconds = parseFloat(parts[2]);

  let totalSeconds = hours * 3600 + minutes * 60 + seconds + offsetSec;
  if (totalSeconds < 0) totalSeconds = 0;

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toFixed(3).padStart(6, '0')}`;
}

export function parseAndOffsetSubtitles(content: string, offsetSec: number = 0): string {
  // Normalize line endings
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const result: string[] = ['WEBVTT', ''];

  const timePattern = /(\d{2}:\d{2}:\d{2}[,\.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,\.]\d{3})/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.includes('-->')) {
      const match = line.match(timePattern);
      if (match) {
        const newStart = shiftTimestamp(match[1], offsetSec);
        const newEnd = shiftTimestamp(match[2], offsetSec);
        result.push(`${newStart} --> ${newEnd}`);
        continue;
      }
    }

    // Skip standalone SRT sequence numbers (e.g. "1", "2")
    if (/^\d+$/.test(line) && i + 1 < lines.length && lines[i + 1].includes('-->')) {
      continue;
    }

    if (line === 'WEBVTT') {
      continue;
    }

    result.push(line);
  }

  return result.join('\n');
}

export function createSubtitleBlob(vttContent: string): string {
  const blob = new Blob([vttContent], { type: 'text/vtt' });
  return URL.createObjectURL(blob);
}
