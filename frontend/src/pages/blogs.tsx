import { BlogList } from "@/components/BlogList";
import { Header } from "@/components/Header";

export default function Blogs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BlogList />
    </div>
  );
}
