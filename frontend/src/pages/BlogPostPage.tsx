import { BlogPostView } from "@/components/BlogPost";
import { Header } from "@/components/Header";

export default function BlogPostPage() {
  return (
    <div className="bg-white">
      <Header />
      <BlogPostView />
    </div>
  );
}
