import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchBlogPost, type BlogPost } from "../services/blogService";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function BlogPostView() {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        const data = await fetchBlogPost(Number(id));
        setBlog(data);
        setError(null);
      } catch (err) {
        console.error("Error loading blog:", err);
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBlog();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error || !blog) {
    return (
      <div className="text-center py-8 text-red-500">
        {error || "Blog post not found"}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {blog.image && (
        <div className="w-full h-full">
          <img
            src={`http://localhost:8080/uploads/${blog.image}`}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <article className="bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags?.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
            <time className="text-sm text-gray-500 ml-auto">
              {format(new Date(blog.created_at), "MMMM d, yyyy")}
            </time>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{blog.content}</p>
        </div>
      </article>
    </div>
  );
}
