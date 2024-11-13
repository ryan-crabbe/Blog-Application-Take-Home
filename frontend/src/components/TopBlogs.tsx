import { BlogPost, fetchBlogs } from "@/services/blogService";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TopBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopBlogs = async () => {
      try {
        const response = await fetchBlogs(1, 6);
        setBlogs(response.blog_posts);
      } catch (error) {
        console.error("Error fetching top blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopBlogs();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="w-[800px] mx-auto py-8">
      <h2 className="text-3xl text-center font-bold mb-8 tracking-tight">
        Popular Posts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link key={blog.id} to={`/blogs/${blog.id}`}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              {blog.image && (
                <div className="w-full h-[200px] relative">
                  <img
                    src={`http://localhost:8080/uploads/${blog.image}`}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{blog.description}</p>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                {blog.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
