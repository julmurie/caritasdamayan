import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import styles from "../../../css/users.module.css";
import Alert from "@/Components/Alert";

export default function Logs() {
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState("account");
    const [loading, setLoading] = useState(false);
    const tableRef = useRef(null);
    const dataTableRef = useRef(null);
    const [tableData, setTableData] = useState([]);

    const notify = (variant, msg) => setToast({ variant, msg });

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);

    // Mock data
    const mockData = {
        account: [
            {
                id: 1,
                user: {
                    name: "Maria Santos",
                    email: "maria.santos@caritas.org.ph",
                    role: "admin",
                },
                action: "login",
                ip: "192.168.1.10",
                user_agent:
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0",
                created_at: "2025-10-10T08:45:00Z",
            },
            {
                id: 2,
                user: {
                    name: "Fr. John Dela Cruz",
                    email: "john.delacruz@caritas.org.ph",
                    role: "volunteer",
                },
                action: "logout",
                ip: "192.168.1.22",
                user_agent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) Safari/605.1.15",
                created_at: "2025-10-09T16:20:00Z",
            },
            {
                id: 3,
                user: {
                    name: "Anna Lopez",
                    email: "anna.lopez@caritas.org.ph",
                    role: "merchant",
                },
                action: "login",
                ip: "192.168.1.33",
                user_agent:
                    "Mozilla/5.0 (Linux; Android 14) Chrome/126.0.0 Mobile",
                created_at: "2025-10-08T10:00:00Z",
            },
        ],
        activity: [
            {
                id: 10,
                user: {
                    name: "Maria Santos",
                    email: "maria.santos@caritas.org.ph",
                    role: "admin",
                },
                action: "create",
                table_name: "patients",
                row_id: 203,
                changes: { name: "Juan Dela Cruz", age: 54 },
                created_at: "2025-10-10T09:30:00Z",
            },
            {
                id: 11,
                user: {
                    name: "Anna Lopez",
                    email: "anna.lopez@caritas.org.ph",
                    role: "merchant",
                },
                action: "update",
                table_name: "chargeslips",
                row_id: 88,
                changes: { status: "Completed", amount: 1200 },
                created_at: "2025-10-09T14:00:00Z",
            },
            {
                id: 12,
                user: {
                    name: "Antony John",
                    email: "antony.john@caritas.org.ph",
                    role: "merchant",
                },
                action: "archive",
                table_name: "medicine_requests",
                row_id: 55,
                changes: null,
                created_at: "2025-10-08T13:10:00Z",
            },
        ],
    };

    // Column configurations
    const columnConfigs = {
        account: [
            {
                data: "user",
                title: "User",
                render: (data) => {
                    if (!data) return "-";
                    return `
                        <div>
                            <div class="font-medium text-gray-900">${data.name}</div>
                            <div class="text-sm text-gray-500">${data.email}</div>
                            <div class="text-sm text-gray-500 capitalize">${data.role}</div>
                        </div>
                    `;
                },
                className: styles.nameColumn,
            },
            {
                data: "action",
                title: "Action",
                render: (data) => {
                    const badge =
                        data === "login"
                            ? `${styles.badge} ${styles.badgeGreen}`
                            : `${styles.badge} ${styles.badgeGray}`;
                    return `<span class="${badge}">${data}</span>`;
                },
                className: styles.roleColumn,
            },
            {
                data: "ip",
                title: "IP Address",
                render: (d) => d || "-",
                className: styles.emailColumn,
            },
            {
                data: "user_agent",
                title: "User Agent",
                render: (d) =>
                    d
                        ? `<div class="truncate max-w-[220px]" title="${d}">${d}</div>`
                        : "-",
                className: styles.jobColumn,
            },
            {
                data: "created_at",
                title: "Date",
                render: (iso) => (iso ? new Date(iso).toLocaleString() : "-"),
                className: styles.createdColumn,
            },
        ],
        activity: [
            {
                data: "user",
                title: "User",
                render: (data) => {
                    if (!data)
                        return "<span class='text-sm text-gray-500'>System</span>";
                    return `
                        <div>
                            <div class="font-medium text-gray-900">${data.name}</div>
                            <div class="text-sm text-gray-500">${data.email}</div>
                        </div>
                    `;
                },
                className: styles.nameColumn,
            },
            {
                data: "action",
                title: "Action",
                render: (d) => {
                    let badgeClass = `${styles.badge}`;
                    if (d === "create") badgeClass += ` ${styles.badgeGreen}`;
                    else if (d === "update")
                        badgeClass +=
                            " bg-blue-100 text-blue-800 border border-blue-300";
                    else
                        badgeClass +=
                            " bg-red-100 text-red-800 border border-red-300";
                    return `<span class="${badgeClass}">${d}</span>`;
                },
                className: styles.roleColumn,
            },
            {
                data: "table_name",
                title: "Table",
                render: (d) => d || "-",
                className: styles.typeColumn,
            },
            {
                data: "row_id",
                title: "Record ID",
                render: (d) => d || "-",
                className: styles.branchColumn,
            },
            {
                data: "changes",
                title: "Changes",
                render: (d) =>
                    d
                        ? `
                    <details>
                        <summary class="cursor-pointer text-red-700 hover:underline text-sm">View Changes</summary>
                        <pre class="mt-2 text-xs bg-gray-100 p-2 rounded max-w-md overflow-auto">${JSON.stringify(
                            d,
                            null,
                            2
                        )}</pre>
                    </details>
                `
                        : "-",
                className: styles.jobColumn,
            },
            {
                data: "created_at",
                title: "Date",
                render: (iso) => (iso ? new Date(iso).toLocaleString() : "-"),
                className: styles.createdColumn,
            },
        ],
    };

    useEffect(() => {
        if (!window.$ || !window.$.fn.DataTable || !tableRef.current) return;

        const $table = $(tableRef.current);

        // Destroy and rebuild DataTable when switching tabs (because columns differ)
        if (
            dataTableRef.current &&
            $.fn.DataTable.isDataTable(tableRef.current)
        ) {
            dataTableRef.current.destroy();
            $table.empty(); // clear headers/body to prevent mismatches
        }

        // Initialize a new DataTable instance for the current tab
        const dt = $table.DataTable({
            data: mockData[activeTab],
            columns: columnConfigs[activeTab],
            responsive: true,
            autoWidth: false,
            scrollX: true,
            language: {
                emptyTable: "No logs found",
                loadingRecords: "Loading...",
                processing: "Processing...",
            },
            dom: '<"usersTopBar"fB>rt<"bottom"ip><"clear">',
            buttons: [
                "pageLength",
                "colvis",
                { extend: "csv", title: `logs_${activeTab}_export` },
                { extend: "excel", title: `logs_${activeTab}_export` },
                { extend: "print", title: `logs_${activeTab}_export` },
            ],
            initComplete: function () {
                $(this).addClass(styles.dataTable);
                $(this).find("thead th").addClass(styles.tableHeader);
                $(this).find("tbody td").addClass(styles.tableCell);
            },
            drawCallback: function () {
                $(this).find("thead th").addClass(styles.tableHeader);
                $(this).find("tbody td").addClass(styles.tableCell);
            },
        });

        dataTableRef.current = dt;
    }, [activeTab]);

    return (
        <div className={styles.container}>
            <Navbar />

            {toast && (
                <Alert
                    variant={toast.variant}
                    floating
                    position="top-right"
                    autoDismissMs={4000}
                    onClose={() => setToast(null)}
                >
                    {toast.msg}
                </Alert>
            )}

            <div className={styles.content}>
                <main>
                    <div className={styles.header}>
                        <div className="flex items-center justify-between">
                            <h1 className={styles.title}>System Logs</h1>
                        </div>
                        <hr className={styles.divider} />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4">
                        {["account", "activity"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
                                    activeTab === tab
                                        ? "bg-[#ef4444] text-white border-[#ef4444]"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                {tab === "account"
                                    ? "Account Logs"
                                    : "Activity Logs"}
                            </button>
                        ))}
                    </div>

                    {/* Loading Indicator */}
                    {loading && (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ef4444]" />
                        </div>
                    )}

                    {/* DataTable Container - Always visible */}
                    <div className={styles.tableContainer}>
                        <div className={styles.usersTableWrapper}>
                            <table
                                ref={tableRef}
                                className={`${styles.usersTable} display nowrap`}
                                style={{ width: "100%" }}
                            >
                                {/* DataTables will populate this */}
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
