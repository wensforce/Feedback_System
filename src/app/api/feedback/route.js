import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { sendWhatsAppTemplate } from "@/lib/whatsapp";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const encryptId = searchParams.get("encryptId");

    if (!encryptId) {
      return new Response(
        JSON.stringify({ error: "Missing assignmentId parameter" }),
        { status: 400 },
      );
    }

    const assignmentId = decrypt(encryptId);


    const feedback = await prisma.feedback.findFirst({
      where: { assignmentId },
    });

    if (!feedback) {
      return new Response(JSON.stringify({ error: "Feedback not found" }), {
        status: 404,
      });
    }

    // only send , hasBodyguard, hasCar, assignmentId, alreadySubmitted in response
    const { hasBodyguard, hasCar, alreadySubmitted } = feedback;

    return new Response(
      JSON.stringify({ hasBodyguard, hasCar, assignmentId, alreadySubmitted }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const encryptId = searchParams.get("encryptId");
    
    const {
      overallExperience,
      vehicleCondition,
      chauffeurProfessionalism,
      bodyguardProfessionalism,
      safetyAndSecurity,
      coordinationAndCommunication,
      comments,
    } = await req.json();

    if (!encryptId) {
      return new Response(
        JSON.stringify({
          error: "Missing assignmentId parameter or invalid url",
        }),
        { status: 400 },
      );
    }

    // Decode the URL-encoded parameter before decrypting
    const decodedEncryptId = decodeURIComponent(encryptId);
    const assignmentId = decrypt(decodedEncryptId);

    // Fetch record to know which services apply
    const record = await prisma.feedback.findFirst({ where: { assignmentId } });
    if (!record) {
      return new Response(JSON.stringify({ error: "Feedback not found" }), { status: 404 });
    }

    // Validate required ratings (always required)
    const alwaysRequired = { overallExperience, safetyAndSecurity, coordinationAndCommunication };
    const alwaysInvalid = Object.values(alwaysRequired).some((r) => r === undefined || r < 1 || r > 5);
    if (alwaysInvalid) {
      return new Response(
        JSON.stringify({ error: "Missing required ratings. Ratings should be between 1 and 5." }),
        { status: 400 },
      );
    }

    // Validate service-specific ratings only if applicable
    if (record.hasCar) {
      if (!vehicleCondition || vehicleCondition < 1 || vehicleCondition > 5 ||
          !chauffeurProfessionalism || chauffeurProfessionalism < 1 || chauffeurProfessionalism > 5) {
        return new Response(
          JSON.stringify({ error: "Vehicle and chauffeur ratings are required for car service." }),
          { status: 400 },
        );
      }
    }
    if (record.hasBodyguard) {
      if (!bodyguardProfessionalism || bodyguardProfessionalism < 1 || bodyguardProfessionalism > 5) {
        return new Response(
          JSON.stringify({ error: "Bodyguard rating is required for bodyguard service." }),
          { status: 400 },
        );
      }
    }

    // update feedback entry with ratings and comments
   const updatedFeedback = await prisma.feedback.update({
      where: { token: decodedEncryptId },
      data: {
        overallExperience,
        VehicleCondition: record.hasCar ? vehicleCondition : null,
        ChauffeurProfessionalism: record.hasCar ? chauffeurProfessionalism : null,
        BodyguardProfessionalism: record.hasBodyguard ? bodyguardProfessionalism : null,
        SafetyAndSecurity: safetyAndSecurity,
        CoordinationAndCommunication: coordinationAndCommunication,
        comments,
        alreadySubmitted: true,
        submissionDate: new Date(),
      },
    });

    console.log("Admin WhatsApp Number:", process.env.WHATSAPP_ADMIN_NUMBER);
    sendWhatsAppTemplate('thanku_feedback', updatedFeedback.clientPhone, [updatedFeedback.clientName]);
    sendWhatsAppTemplate('feedback_received', process.env.WHATSAPP_ADMIN_NUMBER, [updatedFeedback.assignmentId, updatedFeedback.clientName, updatedFeedback.servicedate.toDateString()]);
    
    return new Response(
      JSON.stringify({ message: "Feedback submitted successfully" }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error updating feedback:", error);
    if (error.code === "P2025") {
      return new Response(
        JSON.stringify({
          error: "Feedback not found for the given assignmentId",
        }),
        {
          status: 404,
        },
      );
    }
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}