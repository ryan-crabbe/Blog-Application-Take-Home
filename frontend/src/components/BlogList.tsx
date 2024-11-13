import { useState, useEffect } from "react";
import { fetchBlogs, type BlogPost } from "../services/blogService";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function BlogList() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetchBlogs(currentPage);
        setBlogs(response.blog_posts);

        if (response.pager) {
          setTotalPages(response.pager.total_pages);
        }
        setError(null);
      } catch (err) {
        console.error("Error loading blogs:", err);
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, [currentPage]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <header className="py-16">
          <h1 className="text-4xl font-bold text-center">All Blog Posts</h1>
        </header>

        <div className="flex flex-col space-y-4">
          {blogs.map((blog) => (
            <Link to={`/blogs/${blog.id}`} key={blog.id}>
              <article className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex p-4">
                  <div className="flex-1 pr-4">
                    <h2 className="text-xl text-black font-bold mb-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 mb-2">{blog.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {blog.tags?.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                      <time className="text-sm text-gray-500 ml-auto">
                        {format(new Date(blog.created_at), "MMM d, yyyy")}
                      </time>
                    </div>
                  </div>

                  {blog.image && (
                    <div className="w-[100px] h-[100px]">
                      <img
                        src={`http://localhost:8080/uploads/${blog.image}`}
                        alt={blog.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
