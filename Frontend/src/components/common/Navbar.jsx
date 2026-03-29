import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../app/store";

export default function Navbar() {
  const { user, roleRoute } = useAuthStore();
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur sticky top-0 z-50">
      <h1 className="text-xl font-bold text-[#604058]">ReimburseX</h1>

      <div className="hidden md:flex gap-6 text-sm text-gray-600">
        <a href="#features" className="hover:text-black">Features</a>
        <a href="#how" className="hover:text-black">How it works</a>
        <a href="#pricing" className="hover:text-black">Pricing</a>
      </div>

      <div className="flex gap-3">
        <button
          className="bg-[#604058] text-white px-4 py-2 rounded-md text-sm"
        >
          {user ? <Link to={`${roleRoute[user.role]}`}>Dashboard</Link> : <Link to="/signup">Sign Up</Link>}
        </button>
      </div>
    </div >
  );
}