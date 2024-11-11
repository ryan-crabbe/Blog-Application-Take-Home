import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-background text-foreground shadow-sm">
      <Button variant="ghost" className="text-xl text-black font-bold" asChild>
        <Link to="/" className="text-sm text-black">
          Blog Project
        </Link>
      </Button>
      <div className="flex gap-4">
        <Button variant="ghost" className="text-sm text-black" asChild>
          <Link to="/blogs" className="text-sm text-black">
            All Blog Posts
          </Link>
        </Button>
        <Button variant="ghost" className="text-sm text-black" asChild>
          <Link to="/create" className="text-sm text-black">
            Create Blog Post
          </Link>
        </Button>
      </div>
    </header>
  );
}
