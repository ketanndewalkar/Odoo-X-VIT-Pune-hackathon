import useEmployees from "../../pages/Dashboard/MainDiv/EmployeeTabFolder/useEmployees";

export default function EmployeeTable() {
    const { employees, isLoading, sendPassword, sending } = useEmployees();

    if (isLoading) return <div className="p-4">Loading...</div>;
    return (
        <div className="bg-white p-4 overflow-x-auto font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Employees</h2>
                <button className="px-4 py-2 bg-[#604058] text-white rounded-md">
                    New
                </button>
            </div>

            {/* Table */}
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left border-b">
                        <th className="py-2">User</th>
                        <th className="py-2">Role</th>
                        <th className="py-2">Manager</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp._id} className="border-b hover:bg-gray-50">
                            <td className="py-2">{emp.name}</td>

                            <td className="py-2">
                                <select
                                    defaultValue={emp.role}
                                    className="border rounded px-2 py-1"
                                >
                                    <option value="Employee">Employee</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </td>

                            <td className="py-2">
                                <select
                                    defaultValue={emp.managerId || ""}
                                    className="border rounded px-2 py-1"
                                >
                                    <option value="">Select</option>
                                    {employees
                                        .filter((e) => e.role === "Manager")
                                        .map((m) => (
                                            <option key={m._id} value={m._id}>
                                                {m.name}
                                            </option>
                                        ))}
                                </select>
                            </td>

                            <td className="py-2">{emp.email}</td>

                            <td className="py-2">
                                <button
                                    onClick={() => sendPassword(emp._id)}
                                    disabled={sending}
                                    className="flex items-center gap-2 px-3 py-1 border rounded hover:bg-gray-100"
                                >
                                    <Send size={14} />
                                    Send Password
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}