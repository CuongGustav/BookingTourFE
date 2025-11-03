import Header from "../components/header";
import Footer from "../components/footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-[100px]">{children}</main>
      <Footer />
    </>
  );
}