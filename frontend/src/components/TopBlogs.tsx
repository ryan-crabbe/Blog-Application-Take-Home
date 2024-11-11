import { BlogPost, fetchBlogs } from "@/services/blogService";
import { useState, useEffect } from "react";
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
        const response = await fetchBlogs(1, 5);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <Card key={blog.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{blog.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{blog.description}</p>
            </CardContent>
            <CardFooter>
              <Badge variant="secondary">{blog.category}</Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
