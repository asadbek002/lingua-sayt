import { NextRequest, NextResponse } from "next/server";
import {
  getReviews,
  replyToReview,
  createPost,
  locationIds,
} from "@/lib/services/googleBusinessService";
import { generateReviewResponse, generateGoogleBusinessPost } from "@/lib/services/aiContentService";

function checkAdminAuth(req: NextRequest): boolean {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) return false;
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return false;
  return authHeader === `Bearer ${ADMIN_PASSWORD}`;
}

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const office = searchParams.get("office") || "namangan";

  const locationId = office === "tashkent" ? locationIds.tashkent : locationIds.namangan;
  const reviews = await getReviews(locationId);

  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, office, reviewId, reviewText, rating, topic, postContent } = body;

  const locationId = office === "tashkent" ? locationIds.tashkent : locationIds.namangan;

  if (action === "generate-review-response") {
    const result = await generateReviewResponse(reviewText, rating);
    return NextResponse.json(result);
  }

  if (action === "publish-review-reply") {
    const result = await replyToReview(locationId, reviewId, postContent);
    return NextResponse.json(result);
  }

  if (action === "generate-post") {
    const result = await generateGoogleBusinessPost(topic, office);
    return NextResponse.json(result);
  }

  if (action === "publish-post") {
    const result = await createPost(locationId, postContent);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
