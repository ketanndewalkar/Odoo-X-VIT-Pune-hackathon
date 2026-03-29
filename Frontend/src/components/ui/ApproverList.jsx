import { useState } from "react";

const initialApprovers = [
    { id: 1, name: "John", required: true },
    { id: 2, name: "Mitchell", required: false },
    { id: 3, name: "Andreas", required: false }
];

export default function ApproverList() {
    const [approvers, setApprovers] = useState(initialApprovers);

    const toggleRequired = (id) => {
        setApprovers((prev) =>
            prev.map((a) =>
                a.id === id ? { ...a, required: !a.required } : a
            )
        );
    };

    return (
        <div>
            <h3 className="font-medium mb-3">Approvers</h3>

            <div className="space-y-3">
                {approvers.map((a, index) => (
                    <div
                        key={a.id}
                        className="flex items-center justify-between border p-3 rounded-md"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-gray-400">{index + 1}</span>
                            <span>{a.name}</span>
                        </div>

                        <input
                            type="checkbox"
                            checked={a.required}
                            onChange={() => toggleRequired(a.id)}
                            className="w-5 h-5 accent-[#604058]"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
