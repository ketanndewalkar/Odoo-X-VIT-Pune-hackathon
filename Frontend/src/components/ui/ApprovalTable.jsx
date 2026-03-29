import useApprovalRequests from "../../pages/Dashboard/MainDiv/RequestTabFolder/useApprovalRequests";
import { Settings } from "lucide-react";

export default function ApprovalTable() {
    const { requests, isLoading } = useApprovalRequests();

    if (isLoading) return <div className="p-4">Loading...</div>;

    return (
        <div className="bg-white p-4 overflow-x-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Approval Requests</h2>
            </div>

            {/* Table */}
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left border-b">
                        <th className="py-2">User</th>
                        <th className="py-2">Category</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Approval Rules</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => (
                        <tr key={req._id} className="border-b hover:bg-gray-50">
                            <td className="py-2">{req.userName}</td>
                            <td className="py-2">{req.category}</td>
                            <td className="py-2">₹{req.amount}</td>

                            <td className="py-2">
                                <span
                                    className={`px-2 py-1 rounded text-xs ${req.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : req.status === "Approved"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {req.status}
                                </span>
                            </td>

                            <td className="py-2">
                                <button
                                    onClick={() => console.log("Setup rules for", req._id)}
                                    className="flex items-center gap-2 px-3 py-1 border rounded hover:bg-gray-100"
                                >
                                    <Settings size={14} />
                                    Setup Rules
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}