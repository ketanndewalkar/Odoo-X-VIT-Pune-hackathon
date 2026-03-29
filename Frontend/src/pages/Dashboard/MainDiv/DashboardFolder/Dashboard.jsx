export default function Dashboard() {
    return (
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Total Employees" value="120" />
                <StatCard title="Total Managers" value="15" />
                <StatCard title="Pending Approvals" value="32" />
            </div>

            {/* Placeholder Section */}
            <div className="mt-6 bg-white p-4 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-3">Overview</h3>
                <p className="text-sm text-gray-500">
                    Dashboard overview content goes here.
                </p>
            </div>
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-white p-5 rounded-xl shadow flex flex-col border-l-4" style={{ borderColor: "#604058" }}>
            <span className="text-sm text-gray-500">{title}</span>
            <span className="text-3xl font-bold mt-2 text-[#604058]">{value}</span>
        </div>
    );
}

function Card({ title, value }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow flex flex-col">
            <span className="text-sm text-gray-500">{title}</span>
            <span className="text-2xl font-bold">{value}</span>
        </div>
    );
}