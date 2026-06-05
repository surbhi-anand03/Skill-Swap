import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Navbar />

      <main className="ml-72 flex-1 min-h-screen bg-gray-50">
        {children}
      </main>
    </div>
  );
}