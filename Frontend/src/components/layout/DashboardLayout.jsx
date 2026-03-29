
import Sidebar from "../../pages/Dashboard/Sidebar";
import DashNavbar from "../../pages/Dashboard/DashNavbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <DashNavbar />
                <Outlet />
            </div>
        </div>
    );
}