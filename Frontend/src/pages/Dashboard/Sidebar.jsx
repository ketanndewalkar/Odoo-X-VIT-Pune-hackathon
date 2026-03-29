import { SIDEBAR_LINKS } from "../../utils/cosntants";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="w-64 bg-[#3d2437] text-white hidden md:flex flex-col p-4 border-r border-[#4a2c42]/50">
            <h1 className="text-xl font-bold mb-8 px-2 tracking-wide">Dashboard</h1>

            <nav className="space-y-2">
                {SIDEBAR_LINKS.map((item, idx) => (
                    <SidebarItem key={idx} icon={<item.icon size={18} />} to={item.to} label={item.label} />
                ))}
            </nav>
        </div>
    );
}

function SidebarItem({ icon, label, to }) {
    return (
        <NavLink 
            to={to} 
            end={to === "/dashboard"}
            className={({ isActive }) => 
                `flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    isActive 
                    ? "bg-[#604058] text-white font-medium shadow-sm" 
                    : "text-white/70 hover:bg-[#4a2c42] hover:text-white"
                }`
            }
        >
            {icon}
            <span className="text-sm">{label}</span>
        </NavLink>
    );
}