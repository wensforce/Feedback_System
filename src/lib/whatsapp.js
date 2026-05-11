const DOUBLETICK_API_URL = 'https://public.doubletick.io/whatsapp/message/template';
const FROM_NUMBER = process.env.DOUBLETICK_FROM_NUMBER;
const API_KEY = process.env.DOUBLETICK_API_KEY;

/**
 * Sends a WhatsApp template message via DoubleTick
 * @param {string} templateName - The template name registered in DoubleTick
 * @param {string} to - Recipient phone number (e.g. "+919999999987")
 * @param {string[]} placeholders - Array of variable values for the template body
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function sendWhatsAppTemplate(templateName, to, placeholders = []) {
  if (!FROM_NUMBER) throw new Error('DOUBLETICK_FROM_NUMBER env variable is not set');
  if (!API_KEY) throw new Error('DOUBLETICK_API_KEY env variable is not set');

  const payload = {
    messages: [
      {
        content: {
          language: 'en',
          templateData: {
            body: {
              placeholders,
            },
          },
          templateName,
        },
        from: FROM_NUMBER,
        to,
      },
    ],
  };

  const res = await fetch(DOUBLETICK_API_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: API_KEY,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, error: data?.message || 'Failed to send WhatsApp message', data };
  }

  return { success: true, data };
}
