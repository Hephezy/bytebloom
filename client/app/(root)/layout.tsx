import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex flex-col w-[90%]">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
};