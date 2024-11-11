import { useState, useEffect } from "react";
import { fetchBlogs, type BlogPost } from "../services/blogService";

export function BlogList() {
  const [viewMode, setViewMode] = useState<"grid" | "row">("grid");
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
        setTotalPages(response.pager.total_pages);
        setError(null);
      } catch (err) {
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
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setViewMode(viewMode === "grid" ? "row" : "grid")}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          {viewMode === "grid" ? "Switch to Row View" : "Switch to Grid View"}
        </button>
      </div>

      <div
        className={`
        ${
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col space-y-6"
        }
      `}
      >
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className={`
              bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow
              ${viewMode === "row" ? "flex gap-6" : ""}
            `}
          >
            <div
              className={`
              p-6
              ${viewMode === "row" ? "w-2/3" : ""}
            `}
            >
              <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-4">{blog.description}</p>
              <span className="text-sm text-gray-500">{blog.category}</span>
            </div>
          </article>
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
  );
}
