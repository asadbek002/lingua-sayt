import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogIndex from "@/components/blog/BlogIndex";
import { getPublishedPosts } from "@/lib/services/blogService";

export const metadata: Metadata = {
  title: "Блог — Lingua Translation | Советы по переводу документов",
  description:
    "Полезные статьи о нотариальном переводе, апостиле, переводе дипломов и свидетельств в Узбекистане.",
};

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <BlogIndex posts={posts} />
      </main>
      <Footer />
    </>
  );
}
