import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;