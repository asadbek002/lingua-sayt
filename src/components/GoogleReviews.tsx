import { getPublicReviews } from "@/lib/services/publicReviewsService";
import ReviewsSection from "./ReviewsSection";

// Server component: fetches the best Google reviews (cached with the page) and hides the block when there are none.
export default async function GoogleReviews() {
  const data = await getPublicReviews();
  if (!data) return null;
  return <ReviewsSection data={data} />;
}
