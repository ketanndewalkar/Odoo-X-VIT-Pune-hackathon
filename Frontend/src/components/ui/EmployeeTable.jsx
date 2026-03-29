import React, { useState } from "react";
import useEmployees from "../../pages/Dashboard/MainDiv/EmployeeTabFolder/useEmployees";
import { Send, X, Loader2 } from "lucide-react";

export default function EmployeeTable() {
    const { users, isLoading, sendPassword, sending, createuser, creating, handlerRoleChange, handleManagerChange, queryClient } = useEmployees();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", role: "EMPLOYEE" });
    const [isAdding, setIsAdding] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddEmployee = (e) => {
        e.preventDefault();
        createuser({ formData });
        setIsModalOpen(false);
        setFormData({ name: "", email: "", role: "EMPLOYEE" });

    };

    if (isLoading) {
        return (
            <div className="bg-white p-4 overflow-x-auto font-sans animate-pulse">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
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

    return (
        <div className="bg-white p-4 overflow-x-auto font-sans relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Employees</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-[#714B67] hover:bg-[#714B67]/90 text-white font-medium rounded-md transition-colors shadow-sm text-sm"
                >
                    New Employee
                </button>
            </div>

            {/* Table */}
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-center border-b border-gray-200 text-gray-600">
                        <th className="py-3 font-semibold px-2">User</th>
                        <th className="py-3 font-semibold px-2">Role</th>
                        <th className="py-3 font-semibold px-2">Manager</th>
                        <th className="py-3 font-semibold px-2">Email</th>
                        <th className="py-3 font-semibold px-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map((emp) => (
                        <tr key={emp._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-2 text-gray-800 font-medium">{emp.name}</td>

                            <td className="py-3 px-2 text-center">
                                <select
                                    onChange={(e) => handlerRoleChange(emp._id, e.target.value)}
                                    value={emp.role}
                                    className="border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-[#714B67] focus:ring-1 focus:ring-[#714B67]"
                                >
                                    {["ADMIN", "MANAGER", "EMPLOYEE", "FINANCE", "DIRECTOR", "CFO"].map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </td>

                            <td className="py-3 px-2  text-center">
                                <select
                                    value={emp.managerId?._id || emp.managerId || ""}
                                    onChange={(e) => handleManagerChange(emp._id, e.target.value)}
                                    className="border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-[#714B67] focus:ring-1 focus:ring-[#714B67]"
                                >
                                    <option value="">Select</option>
                                    {users
                                        .filter((e) => e.role === "Manager" || e.role === "MANAGER" || e.role === "ADMIN")
                                        .map((m) => (
                                            <option key={m._id} value={m._id}>
                                                {m.name}
                                            </option>
                                        ))}
                                </select>
                            </td>

                            <td className="py-3 px-2 text-gray-600 text-center">{emp.email}</td>

                            <td className="py-3 px-2 flex justify-center">
                                <button
                                    onClick={() => sendPassword(emp._id)}
                                    disabled={sending}
                                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                >
                                    <Send size={14} />
                                    <span>Send Password</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users?.length === 0 && (
                        <tr>
                            <td colSpan="5" className="py-8 text-center text-gray-500">
                                No employees found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-[#714B67]">Add New Employee</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Jane Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67] transition-shadow"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="jane@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67] transition-shadow"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#714B67] transition-shadow cursor-pointer"
                                    required
                                >
                                    {["ADMIN", "MANAGER", "EMPLOYEE", "FINANCE", "DIRECTOR", "CFO"].map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-8 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddEmployee}
                                    disabled={creating}
                                    className="px-4 py-2 text-sm font-medium bg-[#714B67] hover:bg-[#714B67]/90 text-white rounded-md flex items-center justify-center min-w-[110px] transition-all shadow-sm disabled:opacity-70"
                                >
                                    {creating ? <Loader2 size={16} className="animate-spin" /> : "Add User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}