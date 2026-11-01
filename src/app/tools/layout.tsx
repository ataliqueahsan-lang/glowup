import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell flex min-h-screen flex-col">
      <Navbar />
      <main id="main" className="container-page flex-1 py-10 sm:py-14">
        {children}
      </main>
      <Footer />
    </div>
  );
}
