import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F8F5] text-[#111111]">
      <Navbar />

      <main>{children}</main>

      <Footer />
    </div>
  );
}
