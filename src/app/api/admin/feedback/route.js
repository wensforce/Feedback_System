import { prisma } from "@/lib/prisma";
import { validateAdminKey, setCorsHeaders } from "@/lib/apiAuth";

export async function GET(request) {
  // Validate admin key
  const authError = validateAdminKey(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where = {
      alreadySubmitted: true, // Always filter by submitted status
      ...(search && {
        OR: [
          { clientName: { contains: search } },
          { assignmentId: { contains: search } },
          { comments: { contains: search } },
        ],
      }),
    };

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.feedback.count({ where }),
    ]);

    const response = new Response(
      JSON.stringify({
        data: feedbacks,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      }),
      { status: 200 },
    );
    return setCorsHeaders(response, request.headers.get("origin"));
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    const response = new Response(
      JSON.stringify({ error: "Failed to fetch feedbacks" }),
      { status: 500 },
    );
    return setCorsHeaders(response, request.headers.get("origin"));
  }
}

export async function PATCH(request) {
  // Validate admin key
  const authError = validateAdminKey(request);
  if (authError) return authError;
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return new Response(
        JSON.stringify({ error: "ID and status are required" }),
        { status: 400 },
      );
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: { status },
    });

    const response = new Response(JSON.stringify(updatedFeedback), {
      status: 200,
    });
    return setCorsHeaders(response, request.headers.get("origin"));
  } catch (error) {
    console.error("Error updating feedback status:", error);
    const response = new Response(
      JSON.stringify({ error: "Failed to update feedback status" }),
      { status: 500 },
    );
    return setCorsHeaders(response, request.headers.get("origin"));
  }
}
