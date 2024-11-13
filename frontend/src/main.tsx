import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Blogs from "./pages/blogs.tsx";
import CreateBlogPost from "./pages/CreateBlogPost.tsx";
import BlogPostPage from "./pages/BlogPostPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/blogs",
    element: <Blogs />,
  },
  {
    path: "/create",
    element: <CreateBlogPost />,
  },
  {
    path: "/blogs/:id",
    element: <BlogPostPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
