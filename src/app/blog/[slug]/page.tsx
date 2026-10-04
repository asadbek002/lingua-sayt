import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPostView from "@/components/blog/BlogPostView";
import { getPublishedPost } from "@/lib/services/blogService";
import { articleSchema, faqSchema } from "@/lib/seo/jsonLd";
import { decodeSlug } from "@/lib/utils/slug";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linguatranslation.uz";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(rawSlug: string) {
  return getPublishedPost(decodeSlug(rawSlug));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Статья не найдена" };
  }

  const url = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;
  return {
    title: post.base.title,
    description: post.base.description || "",
    alternates: { canonical: url },
    openGraph: {
      title: post.base.title,
      description: post.base.description || "",
      url,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const faqs = post.base.faq;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            [
              articleSchema({
                title: post.base.title,
                description: post.base.description,
                slug: post.slug,
                publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
                updatedAt: new Date(post.updatedAt),
              }),
              faqs && faqs.length > 0 ? faqSchema(faqs) : null,
            ].filter(Boolean)
          ).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main className="pt-16">
        <BlogPostView post={post} />
      </main>
      <Footer />
    </>
  );
}
