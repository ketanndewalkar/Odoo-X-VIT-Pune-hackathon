import { FileText, Users, ShieldCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

function HeroSection() {
  return (
    <div className="text-center px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-semibold leading-tight"
      >
        Manage all your expenses in
        <span className="text-[#604058]"> one platform</span>
      </motion.h1>

      <p className="mt-4 text-gray-600 text-lg">
        Simple, transparent and fast reimbursement system for teams.
      </p>

      <div className="mt-6 flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#604058] text-white px-6 py-3 rounded-md"
        >
          Start Now – It's Free
        </motion.button>

        <button className="bg-gray-200 px-6 py-3 rounded-md">
          Book Demo
        </button>
      </div>
    </div>
  );
}



const features = [
  { icon: FileText, label: "Smart Expense Tracking" },
  { icon: Users, label: "Multi-level Approvals" },
  { icon: ShieldCheck, label: "Secure & Transparent" },
  { icon: Clock, label: "Faster Processing" }
];

function FeatureGrid() {
  return (
    <div id="features" className="px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
      {features.map((f, i) => {
        const Icon = f.icon;
        return (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow p-6 text-center"
          >
            <div className="mx-auto w-fit p-3 bg-[#604058]/10 rounded-lg text-[#604058]">
              <Icon size={22} />
            </div>
            <p className="mt-3 text-sm font-medium">{f.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}



function CTASection() {
  return (
    <div className="text-center py-16 px-6">
      <h2 className="text-3xl font-semibold">Start managing reimbursements today</h2>
      <p className="text-gray-500 mt-2">No credit card required</p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 bg-[#604058] text-white px-6 py-3 rounded-md"
      >
        Get Started
      </motion.button>
    </div>
  );
}



export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">

      <HeroSection />
      <FeatureGrid />
      <CTASection />
    </div>
  );
}