import { getReviews, locationIds } from "./googleBusinessService";

export interface PublicReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  office: "namangan" | "tashkent";
}

export interface PublicReviews {
  reviews: PublicReview[];
  averageRating: number | null;
  totalCount: number;
}

interface GoogleReview {
  reviewId: string;
  reviewer?: { displayName?: string; isAnonymous?: boolean };
  starRating?: string;
  comment?: string;
  createTime?: string;
}

const STARS: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
const MIN_TEXT_LENGTH = 10;
const MAX_REVIEWS = 120;

/** Google machine-translates reviews: "(Translated by Google) … (Original) …". Keep the author's original text. */
export function cleanReviewText(raw: string): string {
  let text = raw.trim();
  const original = text.split(/\(Original\)\s*/i);
  if (original.length > 1) text = original[original.length - 1];
  return text.replace(/^\(Translated by Google\)\s*/i, "").trim();
}

/** Picks the reviews worth showing: good rating, real text, newest first. */
export function pickBestReviews(
  items: { review: GoogleReview; office: PublicReview["office"] }[],
  minRating = 4,
  limit = MAX_REVIEWS
): PublicReview[] {
  return items
    .map(({ review, office }): PublicReview | null => {
      const rating = STARS[review.starRating ?? ""] ?? 0;
      const text = cleanReviewText(review.comment ?? "");
      if (rating < minRating || text.length < MIN_TEXT_LENGTH || !review.createTime) return null;
      return {
        id: review.reviewId,
        author: review.reviewer?.isAnonymous ? "" : (review.reviewer?.displayName ?? "").trim(),
        rating,
        text,
        date: review.createTime,
        office,
      };
    })
    .filter((r): r is PublicReview => r !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

/** Server-side: the best Google reviews of both offices for the public site. Never throws. */
export async function getPublicReviews(): Promise<PublicReviews | null> {
  try {
    const offices = (["namangan", "tashkent"] as const).filter((o) => locationIds[o]);
    const results = await Promise.all(offices.map((o) => getReviews(locationIds[o]).then((r) => ({ o, r }))));

    const items: { review: GoogleReview; office: PublicReview["office"] }[] = [];
    let weighted = 0;
    let total = 0;
    for (const { o, r } of results) {
      if ("error" in r && r.error) continue;
      for (const review of r.reviews as GoogleReview[]) items.push({ review, office: o });
      if (r.averageRating && r.totalReviewCount) {
        weighted += r.averageRating * r.totalReviewCount;
        total += r.totalReviewCount;
      }
    }

    const minRating = Number(process.env.REVIEWS_MIN_RATING) || 4;
    const reviews = pickBestReviews(items, minRating);
    if (reviews.length === 0) return null;
    return { reviews, averageRating: total ? Math.round((weighted / total) * 10) / 10 : null, totalCount: total };
  } catch (err) {
    console.error("[PublicReviews] failed:", err);
    return null;
  }
}
