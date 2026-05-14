import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';
import { validateAdminKey, setCorsHeaders } from '@/lib/apiAuth';
import { sendWhatsAppTemplate } from '@/lib/whatsapp';

export async function POST(req) {
  // Validate admin key
  const authError = validateAdminKey(req);
  if (authError) return authError;
  try {
    const { assignmentId, clientName, clientPhone, hasBodyguard, hasCar, salesPersonName, servicedate } = await req.json();

    if (!assignmentId || !clientName || !clientPhone || hasBodyguard === undefined || hasCar === undefined || !salesPersonName || !servicedate) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Convert string booleans to actual booleans
    const hasBodyguardBool = hasBodyguard === 'true' || hasBodyguard === true;
    const hasCarBool = hasCar === 'true' || hasCar === true;

    // check if feedback already exists for the given assignmentId
    const existingFeedback = await prisma.feedback.findFirst({
      where: { assignmentId },
    });

    if (existingFeedback) {
      const token = existingFeedback.token; 
      const url = `${process.env.BASE_URL}/feedback/${token}`;
      return new Response(
        JSON.stringify({ url }), {status: 200 }
      )
    }

    const newToken = encrypt(assignmentId);
    await prisma.feedback.create({
      data: {
        assignmentId,
        clientName,
        clientPhone,
        hasBodyguard: hasBodyguardBool,
        hasCar: hasCarBool,
        salesPersonName,
        servicedate: new Date(servicedate),
        token: newToken,
      },
    });

    
    const url = `${process.env.BASE_URL}/feedback/${newToken}`;
    
    try {
     const res = await sendWhatsAppTemplate('client_feedback', clientPhone, [clientName, url]);
     console.log('WhatsApp message sent successfully:', res);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }
    const response = new Response(JSON.stringify({ url }), { status: 201 });
    return setCorsHeaders(response, req.headers.get('origin'));
  } catch (error) {
    console.error('Error creating feedback:', error);
    const response = new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    return setCorsHeaders(response, req.headers.get('origin'));
  }
}
