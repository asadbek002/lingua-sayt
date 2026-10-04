import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";
import {
  getReviews,
  replyToReview,
  createPost,
  locationIds,
} from "@/lib/services/googleBusinessService";
import { generateReviewResponse, generateGoogleBusinessPost } from "@/lib/services/aiContentService";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const office = searchParams.get("office") || "namangan";

  const locationId = office === "tashkent" ? locationIds.tashkent : locationIds.namangan;
  const reviews = await getReviews(locationId);

  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

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
