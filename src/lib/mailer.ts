import nodemailer from 'nodemailer';

export interface FeedbackNotificationPayload {
  type: 'testimonial' | 'contact';
  rating?: number | null;
  message: string;
  nickname?: string | null;
  email?: string | null;
}

/**
 * Sends an email notification when feedback or a testimonial is submitted.
 * Designed to never throw so email failures do not interrupt user flows.
 */
export async function sendFeedbackNotification(
  payload: FeedbackNotificationPayload
): Promise<{ sent: boolean; messageId?: string; error?: string }> {
  try {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    const to = process.env.FEEDBACK_NOTIFY_TO || user;

    if (!user || !pass || !to) {
      console.warn(
        '[Mailer] Email notification skipped: GMAIL_USER, GMAIL_APP_PASSWORD, or recipient not configured.'
      );
      return { sent: false, error: 'Credentials not configured' };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });

    const lines: string[] = [
      `Type: ${payload.type}`,
      ...(payload.rating != null ? [`Rating: ${payload.rating} / 5`] : []),
      `Nickname: ${payload.nickname || 'None provided'}`,
      `Email: ${payload.email || 'None provided'}`,
      '',
      '--- Message ---',
      payload.message,
    ];

    const info = await transporter.sendMail({
      from: `"CouchSync Notifications" <${user}>`,
      to,
      subject: `New CouchSync ${payload.type} submission`,
      text: lines.join('\n'),
    });

    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Mailer] Failed to send feedback notification:', error);
    return {
      sent: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
