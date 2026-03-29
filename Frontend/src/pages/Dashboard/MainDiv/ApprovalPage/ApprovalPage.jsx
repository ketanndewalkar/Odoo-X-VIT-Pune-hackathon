import { useState } from "react";
import ApproverList from "../../../../components/ui/ApproverList";


export default function ApprovalRulesPage() {
    return (
        <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-xl shadow p-4 md:p-6 space-y-6">
                <HeaderSection />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ApproverList />
                    <SettingsSection />
                </div>
            </div>
        </div>
    );
}

export function HeaderSection() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#604058]">Approval Rules</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="User" placeholder="marc" />
                <Input label="Manager" placeholder="sarah" />
            </div>

            <Input
                label="Description"
                placeholder="Approval rule for miscellaneous expenses"
            />
        </div>
    );
}

function Input({ label, placeholder }) {
    return (
        <div>
            <label className="text-sm text-gray-600">{label}</label>
            <input
                placeholder={placeholder}
                className="w-full mt-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#604058]/30"
            />
        </div>
    );
}



export function SettingsSection() {
    const [sequence, setSequence] = useState(false);
    const [managerFirst, setManagerFirst] = useState(false);
    const [percentage, setPercentage] = useState(50);

    return (
        <div className="space-y-5">
            <h3 className="font-medium">Settings</h3>

            <Toggle
                label="Manager is first approver"
                value={managerFirst}
                onChange={() => setManagerFirst(!managerFirst)}
            />

            <Toggle
                label="Approvers Sequence"
                value={sequence}
                onChange={() => setSequence(!sequence)}
            />

            <div>
                <label className="text-sm text-gray-600">
                    Minimum Approval %
                </label>
                <input
                    type="number"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    className="w-full mt-1 border rounded-md px-3 py-2"
                />
            </div>
        </div>
    );
}

function Toggle({ label, value, onChange }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm">{label}</span>
            <button
                onClick={onChange}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition ${value ? "bg-[#604058]" : "bg-gray-300"
                    }`}
            >
                <div
                    className={`bg-white w-4 h-4 rounded-full transform transition ${value ? "translate-x-5" : ""
                        }`}
                />
            </button>
        </div>
    );
}