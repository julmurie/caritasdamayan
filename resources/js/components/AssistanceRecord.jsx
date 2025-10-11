import React, { useState } from "react";
import styles from "../../css/volunteer.module.css";

const AssistanceRecord = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [requestedOnly, setRequestedOnly] = useState(false);

    // Mock records
    const mockRecords = [
        {
            id: 1,
            user: "username.01",
            role: "Clinic Coordinator",
            patient: "Patient is Juan Dela Cruz",
            documents: [
                {
                    name: "Score Card",
                    link: "file view link here...",
                    created: "July 05, 2025 | 4:40pm",
                },
                {
                    name: "Charge Slip",
                    link: "file view link here...",
                    created: "July 05, 2025 | 4:42pm",
                },
            ],
            action: {
                by: "username",
                role: "Admin",
                status: "Approved",
                color: "text-green-600",
                date: "July 05, 2025 | 5:00pm",
            },
            requestStatus: "Requested Approval",
            requestDate: "July 05, 2025 | 5:00pm",
        },
        {
            id: 2,
            user: "username.03",
            role: "Admin",
            patient: "Reason is medicine not available",
            action: {
                by: "username.03",
                role: "Admin",
                status: "Rejected",
                color: "text-red-600",
                date: "July 05, 2025 | 5:00pm",
            },
            requestStatus: "Rejected",
            requestDate: "July 05, 2025 | 5:00pm",
        },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.sectionHead}>
                <span className={styles.sectionTitle}>Assistance Record</span>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Select Date:
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Sort:
                    </label>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                        <option value="newest">Newest to Oldest</option>
                        <option value="oldest">Oldest to Newest</option>
                    </select>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={requestedOnly}
                        onChange={() => setRequestedOnly(!requestedOnly)}
                        className="accent-red-700"
                    />
                    Requested Approval
                </label>
            </div>

            {/* Record cards */}
            <div className="space-y-4">
                {mockRecords.map((record) => (
                    <div
                        key={record.id}
                        className="border border-gray-300 rounded-md bg-white shadow-sm p-3"
                    >
                        {/* Top user info */}
                        <div className="flex items-start gap-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                            <div className="flex-1">
                                <div className="flex flex-wrap justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {record.user}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {record.role}
                                        </p>
                                    </div>
                                    <p className="text-sm text-blue-700">
                                        {record.requestStatus} on{" "}
                                        {record.requestDate}
                                    </p>
                                </div>
                                <p className="mt-1 text-sm text-gray-700">
                                    {record.patient}
                                </p>
                            </div>
                        </div>

                        {/* Documents */}
                        {record.documents && (
                            <div className="mt-2">
                                <p className="text-sm font-semibold text-gray-700 mb-1">
                                    Attached Documents:
                                </p>
                                {record.documents.map((doc, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between bg-gray-100 rounded p-1.5 mb-1 text-sm"
                                    >
                                        <div className="flex gap-2">
                                            <div className="bg-gray-500 text-white px-2 rounded text-xs flex items-center">
                                                {doc.name}
                                            </div>
                                            <span className="text-blue-600 underline cursor-pointer">
                                                {doc.link}
                                            </span>
                                        </div>
                                        <span className="text-gray-600 text-xs">
                                            Created at: {doc.created}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Action footer */}
                        <div className="mt-3 border-t border-gray-200 pt-2 flex items-start gap-2">
                            <div className="w-6 h-6 flex justify-center items-center rotate-180 text-gray-600">
                                ↶
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">
                                    {record.action.by}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {record.action.role}
                                </p>
                            </div>
                            <div className="ml-auto text-sm">
                                <span className={record.action.color}>
                                    {record.action.status} on{" "}
                                    {record.action.date}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AssistanceRecord;
