import "./App.css";
import { BlogList } from "./components/BlogList";
import { Header } from "./components/Header";
import { TopBlogs } from "./components/TopBlogs";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <TopBlogs />
    </div>
  );
}

export default App;
