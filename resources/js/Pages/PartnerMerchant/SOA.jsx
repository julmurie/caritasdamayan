// import React, { useEffect, useRef, useState } from "react";
// import Navbar from "../../components/Navbar";
// import styles from "../../../css/merchant.module.css";
// import { router } from "@inertiajs/react";

// export default function SOA({ merchant = "Generika" }) {
//     const tableRef = useRef(null);
//     const [recordsFound, setRecordsFound] = useState(0);

//     useEffect(() => {
//         if (!tableRef.current || !window.$?.fn?.DataTable) return;

//         // suppress default alerts
//         window.$.fn.dataTable.ext.errMode = "none";

//         const $t = window.$(tableRef.current);

//         // destroy existing
//         if (window.$.fn.dataTable.isDataTable(tableRef.current)) {
//             $t.DataTable().destroy(true);
//         }

//         const dt = $t.DataTable({
//             processing: true,
//             serverSide: true,
//             responsive: true,
//             ajax: {
//                 url: "/merchant/soa/datatable",
//                 type: "GET",
//                 dataType: "json",
//                 error: function (xhr) {
//                     console.error(
//                         "DataTables AJAX error:",
//                         xhr.status,
//                         xhr.responseText
//                     );
//                 },
//             },
//             lengthMenu: [
//                 [20, 50, 100, -1],
//                 [20, 50, 100, "All"],
//             ],
//             dom: "Bfrtip",
//             buttons: [
//                 "pageLength",
//                 "colvis",
//                 { extend: "csv", title: `soa_${merchant}` },
//                 { extend: "excel", title: `soa_${merchant}` },
//                 { extend: "print", title: `SOA – ${merchant}` },
//             ],
//             columns: [
//                 { data: "number", title: "SOA Number" },
//                 { data: "soa_date", title: "SOA Date" },
//                 { data: "cover_period", title: "Cover Period" },
//                 { data: "charge_slip", title: "Charge Slip" },
//                 { data: "total_amount", title: "Total Amount" },
//                 { data: "attachment", title: "Attachment" },
//                 { data: "status", title: "Status" },
//                 {
//                     data: null,
//                     title: "Action",
//                     orderable: false,
//                     searchable: false,
//                     render: (data, type, row) => `
//                         <div class="flex gap-2">
//                             <button class="btn-edit" data-id="${row.id}" title="Edit">✏️</button>
//                             <button class="btn-delete" data-id="${row.id}" title="Delete">🗑</button>
//                         </div>
//                     `,
//                 },
//             ],
//             order: [[1, "desc"]],
//             initComplete: function () {
//                 const api = this.api();
//                 api.columns().every(function (idx) {
//                     const th = $t.find("thead tr:eq(1) th").eq(idx);
//                     const input = th.find("input");
//                     if (input.length) {
//                         input.on("keyup change", function () {
//                             api.column(idx).search(this.value).draw();
//                         });
//                     }
//                 });
//             },
//             drawCallback: function (settings) {
//                 if (
//                     settings.json &&
//                     typeof settings.json.recordsFiltered === "number"
//                 ) {
//                     setRecordsFound(settings.json.recordsFiltered);
//                 } else {
//                     const info = this.api().page.info();
//                     setRecordsFound(
//                         info.recordsDisplay ?? info.recordsTotal ?? 0
//                     );
//                 }
//             },
//         });

//         // delegated events
//         $t.on("click", ".btn-delete", function () {
//             const id = this.getAttribute("data-id");
//             if (!id) return;
//             if (confirm("Delete this SOA?")) {
//                 router.delete(`/merchant/soa/${id}`, {
//                     onSuccess: () => dt.ajax.reload(),
//                 });
//             }
//         });

//         $t.on("click", ".btn-edit", function () {
//             const id = this.getAttribute("data-id");
//             if (id) {
//                 router.visit(`/merchant/soa/${id}/edit`);
//             }
//         });

//         return () => {
//             $t.off("click", ".btn-delete");
//             $t.off("click", ".btn-edit");
//             if (window.$.fn.dataTable.isDataTable(tableRef.current)) {
//                 $t.DataTable().destroy(true);
//             }
//         };
//     }, [merchant]);

//     return (
//         <>
//             <Navbar />
//             <div className={styles.soaContainer}>
//                 {/* Header */}
//                 <h1 className={styles.soaTitle}>SOA</h1>
//                 <p className={styles.soaSubtext}>
//                     Partner Merchant | {merchant}
//                 </p>

//                 {/* Top Actions */}
//                 <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
//                     <div className="flex items-center gap-4">
//                         <button
//                             onClick={() =>
//                                 tableRef.current &&
//                                 window.$(tableRef.current).DataTable().draw()
//                             }
//                             className={styles.soaBtnRed}
//                         >
//                             Search
//                         </button>
//                         <button
//                             className={styles.soaReset}
//                             onClick={() => {
//                                 window
//                                     .$(tableRef.current)
//                                     .find("thead tr:eq(1) input")
//                                     .val("")
//                                     .trigger("change");
//                             }}
//                         >
//                             Reset Filter
//                         </button>
//                         <span>{recordsFound} records found</span>
//                     </div>
//                     <button
//                         className={styles.soaBtnGreen}
//                         onClick={() => router.visit("/merchant/soa/create")}
//                     >
//                         Add Record
//                     </button>
//                 </div>

//                 {/* Table */}
//                 <table ref={tableRef} className={styles.soaTable}>
//                     <thead>
//                         <tr>
//                             <th>SOA Number</th>
//                             <th>SOA Date</th>
//                             <th>Cover Period</th>
//                             <th>Charge Slip</th>
//                             <th>Total Amount</th>
//                             <th>Attachment</th>
//                             <th>Status</th>
//                             <th>Action</th>
//                         </tr>
//                         <tr>
//                             <th>
//                                 <input type="text" placeholder="" />
//                             </th>
//                             <th>
//                                 <input
//                                     type="text"
//                                     placeholder="YYYY-MM-DD or A|B"
//                                 />
//                             </th>
//                             <th>
//                                 <input type="text" placeholder="" />
//                             </th>
//                             <th>
//                                 <input type="text" placeholder="" />
//                             </th>
//                             <th>
//                                 <input
//                                     type="text"
//                                     placeholder="min|max or value"
//                                 />
//                             </th>
//                             <th>
//                                 <input type="text" placeholder="" />
//                             </th>
//                             <th>
//                                 <input type="text" placeholder="" />
//                             </th>
//                             <th></th>
//                         </tr>
//                     </thead>
//                 </table>
//             </div>
//         </>
//     );
// }

import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import styles from "../../../css/merchant.module.css";

/**
 * FRONTEND-ONLY SOA TABLE
 * - No jQuery/DataTables
 * - No server calls / Inertia router
 * - Client-side: filters, sort, pagination, CSV export, print
 */

const makeMock = (n = 75, merchant = "Generika") => {
    const statuses = ["Pending", "For Review", "Approved", "Paid"];
    const rows = [];
    for (let i = 1; i <= n; i++) {
        const y = 2025;
        const m = ((i % 12) + 1).toString().padStart(2, "0");
        const d = ((i % 28) + 1).toString().padStart(2, "0");
        const amount = (Math.round((1000 + i * 137.45) * 100) / 100).toFixed(2);

        rows.push({
            id: i,
            number: `SOA-${y}-${String(i).padStart(4, "0")}`,
            soa_date: `${y}-${m}-${d}`,
            cover_period: `${y}-${m}-01 — ${y}-${m}-28`,
            charge_slip: `CS-${String(1000 + i)}`,
            total_amount: Number(amount),
            attachment: i % 3 === 0 ? `receipt_${i}.pdf` : "—",
            status: statuses[i % statuses.length],
            merchant,
        });
    }
    return rows;
};

const HEADERS = [
    { key: "number", label: "SOA Number" },
    { key: "soa_date", label: "SOA Date" },
    { key: "cover_period", label: "Cover Period" },
    { key: "charge_slip", label: "Charge Slip" },
    { key: "total_amount", label: "Total Amount" },
    { key: "attachment", label: "Attachment" },
    { key: "status", label: "Status" },
];

export default function SOA({ merchant = "Generika" }) {
    const tableRef = useRef(null);

    // base data (mocked)
    const [data, setData] = useState(() => makeMock(75, merchant));

    // filters
    const [filters, setFilters] = useState({
        number: "",
        soa_date: "",
        cover_period: "",
        charge_slip: "",
        total_amount: "",
        attachment: "",
        status: "",
    });

    // sorting
    const [sort, setSort] = useState({ key: "soa_date", dir: "desc" });

    // pagination
    const [pageSize, setPageSize] = useState(20); // 20 | 50 | 100 | -1 (All)
    const [page, setPage] = useState(1);

    // records found (derived)
    const [recordsFound, setRecordsFound] = useState(0);

    // Rebuild data if merchant prop changes (keep this simple)
    useEffect(() => {
        setData(makeMock(75, merchant));
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchant]);

    // Helpers
    const passesText = (value, query) => {
        if (!query) return true;
        if (value == null) return false;

        // Support "A|B" OR search (case-insensitive)
        const parts = String(query)
            .split("|")
            .map((s) => s.trim())
            .filter(Boolean);
        const v = String(value).toLowerCase();
        if (parts.length > 1) {
            return parts.some((p) => v.includes(p.toLowerCase()));
        }
        return v.includes(String(query).toLowerCase());
    };

    const passesAmount = (value, query) => {
        if (!query) return true;
        const raw = query.trim();
        // "min|max" or single value
        if (raw.includes("|") || raw.includes(",")) {
            const parts = raw
                .split(/[|,]/)
                .map((s) => s.trim())
                .filter(Boolean);
            // match any value exactly (string compare)
            return parts.some((p) => String(value).includes(p));
        }
        if (raw.includes("-") || raw.includes(">") || raw.includes("<")) {
            // support simple comparisons: >1000, <5000, 1000-2000
            if (raw.includes("-")) {
                const [min, max] = raw.split("-").map((n) => Number(n.trim()));
                if (Number.isFinite(min) && Number.isFinite(max)) {
                    return value >= min && value <= max;
                }
            } else if (raw.startsWith(">")) {
                const n = Number(raw.slice(1).trim());
                return Number.isFinite(n) ? value > n : true;
            } else if (raw.startsWith("<")) {
                const n = Number(raw.slice(1).trim());
                return Number.isFinite(n) ? value < n : true;
            }
        }
        if (raw.includes("min") || raw.includes("max")) {
            const [minStr, maxStr] = raw.split("|").map((s) => s.trim());
            const min = Number(minStr?.replace("min", "").trim());
            const max = Number(maxStr?.replace("max", "").trim());
            if (Number.isFinite(min) && Number.isFinite(max))
                return value >= min && value <= max;
            if (Number.isFinite(min)) return value >= min;
            if (Number.isFinite(max)) return value <= max;
        }
        const exact = Number(raw);
        return Number.isFinite(exact)
            ? value === exact
            : String(value).includes(raw);
    };

    const filtered = useMemo(() => {
        return data.filter((row) => {
            if (!passesText(row.number, filters.number)) return false;
            if (!passesText(row.soa_date, filters.soa_date)) return false;
            if (!passesText(row.cover_period, filters.cover_period))
                return false;
            if (!passesText(row.charge_slip, filters.charge_slip)) return false;
            if (!passesAmount(row.total_amount, filters.total_amount))
                return false;
            if (!passesText(row.attachment, filters.attachment)) return false;
            if (!passesText(row.status, filters.status)) return false;
            return true;
        });
    }, [data, filters]);

    const sorted = useMemo(() => {
        const arr = [...filtered];
        const { key, dir } = sort;
        arr.sort((a, b) => {
            let va = a[key];
            let vb = b[key];
            // numeric sort for amount
            if (key === "total_amount") {
                va = Number(va);
                vb = Number(vb);
            }
            if (va < vb) return dir === "asc" ? -1 : 1;
            if (va > vb) return dir === "asc" ? 1 : -1;
            return 0;
        });
        return arr;
    }, [filtered, sort]);

    const paged = useMemo(() => {
        setRecordsFound(sorted.length);
        if (pageSize === -1) return sorted;
        const start = (page - 1) * pageSize;
        return sorted.slice(start, start + pageSize);
    }, [sorted, page, pageSize]);

    const pageCount = useMemo(() => {
        if (pageSize === -1) return 1;
        return Math.max(1, Math.ceil(sorted.length / pageSize));
    }, [sorted.length, pageSize]);

    const cycleSort = (key) => {
        setPage(1);
        setSort((prev) => {
            if (prev.key !== key) return { key, dir: "asc" };
            if (prev.dir === "asc") return { key, dir: "desc" };
            return { key: "soa_date", dir: "desc" }; // third click resets to default
        });
    };

    const onResetFilters = () => {
        setFilters({
            number: "",
            soa_date: "",
            cover_period: "",
            charge_slip: "",
            total_amount: "",
            attachment: "",
            status: "",
        });
        setPage(1);
    };

    const download = (filename, text) => {
        const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.setAttribute("download", filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const toCSV = (rows) => {
        const cols = HEADERS.map((h) => h.key);
        const head = HEADERS.map((h) => `"${h.label}"`).join(",");
        const body = rows
            .map((r) =>
                cols
                    .map((k) => {
                        const v = r[k] ?? "";
                        return `"${String(v).replace(/"/g, '""')}"`;
                    })
                    .join(",")
            )
            .join("\n");
        return head + "\n" + body;
    };

    const handleExportCSV = () => {
        const csv = toCSV(sorted);
        download(`soa_${merchant}.csv`, csv);
    };

    const handlePrint = () => {
        const printWindow = window.open("", "_blank", "width=1000,height=700");
        const html = `
      <html>
        <head>
          <title>SOA – ${merchant}</title>
          <style>
            body{font-family: Arial, sans-serif; padding:16px;}
            table{width:100%; border-collapse:collapse;}
            th,td{border:1px solid #ddd; padding:8px; font-size:12px;}
            th{background:#f5f5f5; text-align:left;}
            h1{margin:0 0 8px;}
            p{margin:0 0 12px;}
          </style>
        </head>
        <body>
          <h1>SOA</h1>
          <p>Partner Merchant | ${merchant}</p>
          <table>
            <thead>
              <tr>${HEADERS.map((h) => `<th>${h.label}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${sorted
                  .map(
                      (r) => `<tr>
                    <td>${r.number}</td>
                    <td>${r.soa_date}</td>
                    <td>${r.cover_period}</td>
                    <td>${r.charge_slip}</td>
                    <td>${r.total_amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                    })}</td>
                    <td>${r.attachment}</td>
                    <td>${r.status}</td>
                  </tr>`
                  )
                  .join("")}
            </tbody>
          </table>
        </body>
      </html>`;
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    const handleDelete = (id) => {
        if (!confirm("Delete this SOA?")) return;
        setData((prev) => prev.filter((r) => r.id !== id));
    };

    const handleEdit = (id) => {
        alert(`(Frontend-only) Navigate to edit page for ID ${id}`);
    };

    const handleAdd = () => {
        // simple stub: push a new row
        const nextId = Math.max(...data.map((d) => d.id)) + 1;
        const y = 2025,
            m = "09",
            d = "01";
        const newRow = {
            id: nextId,
            number: `SOA-${y}-${String(nextId).padStart(4, "0")}`,
            soa_date: `${y}-${m}-${d}`,
            cover_period: `${y}-${m}-01 — ${y}-${m}-30`,
            charge_slip: `CS-${1000 + nextId}`,
            total_amount: 1234.56,
            attachment: "—",
            status: "Pending",
            merchant,
        };
        setData((prev) => [newRow, ...prev]);
        setPage(1);
    };

    // when filters change, stay on page 1
    useEffect(() => {
        setPage(1);
    }, [filters, pageSize]);

    return (
        <>
            <Navbar />
            <div className={styles.soaContainer} ref={tableRef}>
                {/* Header */}
                <h1 className={styles.soaTitle}>SOA</h1>
                <p className={styles.soaSubtext}>
                    Partner Merchant | {merchant}
                </p>

                {/* Top Actions */}
                <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={() => setPage(1)}
                            className={styles.soaBtnRed}
                            title="Apply current filters"
                        >
                            Search
                        </button>

                        <button
                            className={styles.soaReset}
                            onClick={onResetFilters}
                        >
                            Reset Filter
                        </button>

                        <button
                            className={styles.soaBtnGreen}
                            onClick={handleAdd}
                        >
                            Add Record
                        </button>

                        <button
                            className={styles.soaBtnGreen}
                            onClick={handleExportCSV}
                        >
                            Export CSV
                        </button>

                        <button
                            className={styles.soaBtnGreen}
                            onClick={handlePrint}
                        >
                            Print
                        </button>

                        <span className="ml-2">
                            {recordsFound} records found
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm">Rows:</label>
                        <select
                            className="border rounded px-2 py-1"
                            value={pageSize}
                            onChange={(e) =>
                                setPageSize(Number(e.target.value))
                            }
                        >
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={-1}>All</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="w-full overflow-auto">
                    <table
                        className={styles.soaTable}
                        style={{ width: "100%" }}
                    >
                        <thead>
                            <tr>
                                {HEADERS.map((h) => (
                                    <th
                                        key={h.key}
                                        onClick={() => cycleSort(h.key)}
                                        style={{
                                            cursor: "pointer",
                                            whiteSpace: "nowrap",
                                        }}
                                        title="Click to sort / cycle"
                                    >
                                        {h.label}{" "}
                                        {sort.key === h.key
                                            ? sort.dir === "asc"
                                                ? "▲"
                                                : "▼"
                                            : ""}
                                    </th>
                                ))}
                                <th>Action</th>
                            </tr>

                            {/* Filter Row */}
                            <tr>
                                <th>
                                    <input
                                        type="text"
                                        value={filters.number}
                                        onChange={(e) =>
                                            setFilters((f) => ({
                                                ...f,
                                                number: e.target.value,
                                            }))
                                        }
                                        placeholder=""
                                    />
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        value={filters.soa_date}
                                        onChange={(e) =>
                                            setFilters((f) => ({
                                                ...f,
                                                soa_date: e.target.value,
                                            }))
                                        }
                                        placeholder="YYYY-MM-DD or A|B"
                                    />
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        value={filters.cover_period}
                                        onChange={(e) =>
                                            setFilters((f) => ({
                                                ...f,
                                                cover_period: e.target.value,
                                            }))
                                        }
                                        placeholder=""
                                    />
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        value={filters.charge_slip}
                                        onChange={(e) =>
                                            setFilters((f) => ({
                                                ...f,
                                                charge_slip: e.target.value,
                                            }))
                                        }
                                        placeholder=""
                                    />
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        value={filters.total_amount}
                                        onChange={(e) =>
                                            setFilters((f) => ({
                                                ...f,
                                                total_amount: e.target.value,
                                            }))
                                        }
                                        placeholder="min|max, 1000-2000, >5000"
                                    />
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        value={filters.attachment}
                                        onChange={(e) =>
                                            setFilters((f) => ({
                                                ...f,
                                                attachment: e.target.value,
                                            }))
                                        }
                                        placeholder=""
                                    />
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        value={filters.status}
                                        onChange={(e) =>
                                            setFilters((f) => ({
                                                ...f,
                                                status: e.target.value,
                                            }))
                                        }
                                        placeholder=""
                                    />
                                </th>
                                <th />
                            </tr>
                        </thead>

                        <tbody>
                            {paged.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.number}</td>
                                    <td>{row.soa_date}</td>
                                    <td>{row.cover_period}</td>
                                    <td>{row.charge_slip}</td>
                                    <td>
                                        {row.total_amount.toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 2,
                                            }
                                        )}
                                    </td>
                                    <td>{row.attachment}</td>
                                    <td>{row.status}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn-edit"
                                                title="Edit"
                                                onClick={() =>
                                                    handleEdit(row.id)
                                                }
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-delete"
                                                title="Delete"
                                                onClick={() =>
                                                    handleDelete(row.id)
                                                }
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paged.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={HEADERS.length + 1}
                                        style={{
                                            textAlign: "center",
                                            padding: 16,
                                        }}
                                    >
                                        No records
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pageSize !== -1 && (
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-sm">
                            Page {page} of {pageCount}
                        </span>
                        <div className="flex gap-2">
                            <button
                                className={styles.soaReset}
                                disabled={page === 1}
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                            >
                                Prev
                            </button>
                            <button
                                className={styles.soaBtnGreen}
                                disabled={page === pageCount}
                                onClick={() =>
                                    setPage((p) => Math.min(pageCount, p + 1))
                                }
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
