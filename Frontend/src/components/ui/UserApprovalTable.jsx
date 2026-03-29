import React from "react";
import useApprovalRequests from "../../pages/Dashboard/MainDiv/RequestTabFolder/useApprovalRequests";
import { Settings, CheckCircle, Clock, XCircle } from "lucide-react";

export default function UserApprovalTable() {
    const { requests, isLoading } = useApprovalRequests();

    if (isLoading) {
        return (
            <div className="bg-white p-4 overflow-x-auto font-sans animate-pulse">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-6 w-40 bg-gray-200 rounded"></div>
                    <div className="h-10 w-44 bg-gray-200 rounded-md"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-8 w-full bg-gray-200 rounded mb-2"></div>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-12 w-full bg-gray-100 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return "bg-green-100 text-green-700 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return <CheckCircle size={14} className="mr-1.5" />;
            case "rejected":
                return <XCircle size={14} className="mr-1.5" />;
            default:
                return <Clock size={14} className="mr-1.5" />;
        }
    };

    return (
        <div className="bg-white p-4 overflow-x-auto font-sans relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Approval Requests</h2>
            </div>

            {/* Table */}
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left border-b border-gray-200 text-gray-600">
                        <th className="py-3 font-semibold px-2">User</th>
                        <th className="py-3 font-semibold px-2 text-center">Category</th>
                        <th className="py-3 font-semibold px-2 text-center">Amount</th>
                        <th className="py-3 font-semibold px-2 text-center">Status</th>
                        <th className="py-3 font-semibold px-2 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests?.map((req) => (
                        <tr key={req._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-2 text-gray-800 font-medium">{req.userName}</td>
                            <td className="py-3 px-2 text-gray-600 text-center">{req.category}</td>
                            <td className="py-3 px-2 text-gray-800 font-medium text-center">
                                ₹{req.amount?.toLocaleString() || req.amount}
                            </td>
                            <td className="py-3 px-2">
                                <span className={`flex items-center justify-center w-max mx-auto px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusStyle(req.status)}`}>
                                    {getStatusIcon(req.status)}
                                    {req.status || "Pending"}
                                </span>
                            </td>
                            <td className="py-3 px-2 flex justify-center">
                                <button
                                    onClick={() => console.log("Setup rules for", req._id)}
                                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-[#714B67] hover:bg-[#714B67] hover:text-white transition-colors"
                                >
                                    <Settings size={14} />
                                    <span>Setup Rules</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                    {(!requests || requests.length === 0) && (
                        <tr>
                            <td colSpan="5" className="py-12 text-center text-gray-500">
                                No approval requests found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
