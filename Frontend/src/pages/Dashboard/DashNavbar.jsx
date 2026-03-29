import { Bell, UserCircle } from "lucide-react";

export default function DashNavbar() {
    return (
        <div className="h-16 bg-white shadow flex items-center justify-between px-4">
            <h2 className="text-lg font-semibold">Welcome</h2>

            <div className="flex items-center gap-4">
                <Bell className="cursor-pointer" />
                <UserCircle className="cursor-pointer" />
            </div>
        </div>
    );
}