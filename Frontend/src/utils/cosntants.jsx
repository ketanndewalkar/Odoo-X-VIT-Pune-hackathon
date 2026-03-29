import { Home, Users, Settings, FileText } from "lucide-react";

export const SIDEBAR_LINKS = [
    { label: "Home", to: "/dashboard", icon: Home },
    { label: "Employees", to: "all-employees", icon: Users },
    { label: "Requests", to: "approval-requests", icon: FileText },
    { label: "Settings", to: "settings", icon: Settings }
];

export const countries = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan"
];