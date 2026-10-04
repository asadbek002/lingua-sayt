import { getPublishedPosts } from "@/lib/services/blogService";
import LatestPostsSection from "./blog/LatestPostsSection";

// Server component: the three newest published posts; hidden while the blog is empty.
export default async function LatestPosts() {
  const posts = await getPublishedPosts(3);
  if (posts.length === 0) return null;
  return <LatestPostsSection posts={posts} />;
}
