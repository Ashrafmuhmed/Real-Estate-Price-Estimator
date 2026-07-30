import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-gray-100 transition-colors duration-500">
      <Navbar />

      <main>{children}</main>

      <Footer />
    </div>
  );
}
