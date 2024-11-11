import { Header } from "@/components/Header";
import CreateBlogForm from "@/components/CreateBlogForm";

export default function CreateBlogPost() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CreateBlogForm />
    </div>
  );
}
