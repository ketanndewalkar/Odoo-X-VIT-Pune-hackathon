import React from "react";
import useManager from "../../pages/ManagerDashboard/useManager";
import { CheckCircle, Clock, XCircle, Check, X } from "lucide-react";

export default function ManagerApprovalTable() {
    const { requests, isLoading, approveRequest, isApproving, rejectRequest, isRejecting } = useManager();

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow p-4 md:p-6 overflow-x-auto font-sans animate-pulse">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-6 w-48 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-8 w-full bg-gray-200 rounded mb-2"></div>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-14 w-full bg-gray-100 rounded"></div>
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
        <div className="bg-white rounded-xl shadow p-4 md:p-6 overflow-x-auto font-sans relative">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Approvals to review</h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm whitespace-nowrap">
                    <thead>
                        <tr className="text-left border-b-2 border-gray-200 text-gray-600">
                            <th className="py-4 font-semibold px-4">Approval Subject</th>
                            <th className="py-4 font-semibold px-4 text-center">Request Owner</th>
                            <th className="py-4 font-semibold px-4 text-center">Category</th>
                            <th className="py-4 font-semibold px-4 text-center">Request Status</th>
                            <th className="py-4 font-semibold px-4 text-center">
                                <div>Total amount</div>
                                <div className="font-normal text-xs text-gray-400">(in company's currency)</div>
                            </th>
                            <th className="py-4 font-semibold px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests?.map((req) => {
                            const isPending = !req.status || req.status.toLowerCase() === "pending";

                            return (
                                <tr key={req._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4 text-gray-800 font-medium">{req.subject || req.title || "None"}</td>
                                    <td className="py-4 px-4 text-gray-600 text-center">{req.userName || req.owner || "Unknown"}</td>
                                    <td className="py-4 px-4 text-gray-600 text-center">{req.category}</td>
                                    <td className="py-4 px-4">
                                        <span className={`flex items-center justify-center w-max mx-auto px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusStyle(req.status)}`}>
                                            {getStatusIcon(req.status)}
                                            {req.status || "Pending"}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-800 font-medium text-center">
                                        <span className="text-[#604058] mr-1">{req.currency || "₹"}</span>
                                        {req.amount?.toLocaleString() || req.amount}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        {isPending ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => approveRequest(req._id)}
                                                    disabled={isApproving}
                                                    className="flex items-center gap-1.5 px-4 py-1.5 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-md text-sm transition-colors disabled:opacity-50 font-medium"
                                                >
                                                    <Check size={16} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => rejectRequest(req._id)}
                                                    disabled={isRejecting}
                                                    className="flex items-center gap-1.5 px-4 py-1.5 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-md text-sm transition-colors disabled:opacity-50 font-medium"
                                                >
                                                    <X size={16} /> Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">Read-only</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {(!requests || requests.length === 0) && (
                            <tr>
                                <td colSpan="6" className="py-12 text-center text-gray-500">
                                    No approvals pending review.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
