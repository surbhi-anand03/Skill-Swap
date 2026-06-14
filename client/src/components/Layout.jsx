
import Navbar from "./Navbar";

export default function Layout({
  children,
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main
      className="
        w-full
        min-h-screen
        overflow-x-hidden
        pt-16
        pb-20
        px-0
        md:px-0
        lg:ml-[280px]
        lg:w-[calc(100%-280px)]
        lg:pt-0
        lg:pb-0
      "
    >

        {children}
      </main>
    </div>
  );
}