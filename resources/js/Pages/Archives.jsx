// // resources/js/Pages/Archives.jsx
// import React, { useEffect, useState } from "react";
// import { Head, Link, router, usePage } from "@inertiajs/react";
// import Navbar from "@/components/Navbar";
// import PageHeader from "@/Components/PageHeader";
// import ConfirmDialog from "@/components/ConfirmDialog";
// import Alert from "@/Components/Alert";

// /* ------------ Role views ------------ */
// const VIEWS_PER_ROLE = {
//     admin: ["users"],
//     volunteer: ["patients", "documents"],
//     merchant: ["merchant-products", "merchant-services"],
//     accounting: ["soa"],
//     treasury: ["soa"],
// };

// const DEFAULT_VIEW = {
//     admin: "users",
//     volunteer: "patients",
//     merchant: "merchant-products",
//     accounting: "soa",
//     treasury: "soa",
// };

// const titleMap = {
//     patients: "Archived Patients",
//     approvals: "Archived Approvals",
//     users: "Archived Users",
//     documents: "Archived Documents",
//     "merchant-products": "Archived Products",
//     "merchant-services": "Archived Services",
//     soa: "Archived Statements of Account",
// };

// function useQueryView() {
//     if (typeof window === "undefined") return null;
//     return new URLSearchParams(window.location.search).get("view");
// }

// /* ------------ UI Components ------------ */
// const Card = ({ children }) => (
//     <div className="border rounded-lg bg-white overflow-hidden">{children}</div>
// );

// function PillBar({ role, active }) {
//     const views = VIEWS_PER_ROLE[role] ?? [];
//     if (views.length <= 1) return null;
//     const goto = (v) =>
//         router.visit(`/archives?view=${encodeURIComponent(v)}`, {
//             preserveScroll: true,
//         });

//     return (
//         <div className="flex flex-wrap gap-2 mb-4">
//             {views.map((v) => (
//                 <button
//                     key={v}
//                     onClick={() => goto(v)}
//                     type="button"
//                     className={`px-3 h-8 rounded border text-sm ${
//                         v === active
//                             ? "bg-[#b71c1c] text-white border-[#b71c1c]"
//                             : "bg-white hover:bg-gray-50"
//                     }`}
//                 >
//                     {titleMap[v] ?? v}
//                 </button>
//             ))}
//         </div>
//     );
// }

// function TableSkeleton({ headers }) {
//     return (
//         <Card>
//             <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             {headers.map((h) => (
//                                 <th
//                                     key={h}
//                                     className="px-3 py-2 text-left font-semibold border-b"
//                                 >
//                                     {h}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {Array.from({ length: 6 }).map((_, r) => (
//                             <tr key={r} className="even:bg-gray-50">
//                                 {headers.map((__, c) => (
//                                     <td key={c} className="px-3 py-3 border-b">
//                                         &nbsp;
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//             <div className="px-3 py-2 text-xs text-gray-500">
//                 Connect this view to its endpoint.
//             </div>
//         </Card>
//     );
// }

// /* ------------ Merchant archive tables ------------ */
// function ArchiveTable({ cfg }) {
//     const [rows, setRows] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchRows = async () => {
//         setLoading(true);
//         try {
//             const r = await fetch(cfg.fetchUrl);
//             const data = await r.json();
//             setRows(Array.isArray(data) ? data : []);
//         } catch {
//             setRows([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (!cfg?.fetchUrl) return;
//         fetchRows();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [cfg?.fetchUrl]);

//     const restoreRow = async (id) => {
//         if (!cfg?.onRestore) return;
//         await cfg.onRestore(id);
//         await fetchRows();
//     };

//     return (
//         <Card>
//             <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             {cfg.columns.map((c) => (
//                                 <th
//                                     key={c.label}
//                                     className="px-3 py-2 text-left font-semibold border-b"
//                                 >
//                                     {c.label}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {loading ? (
//                             <tr>
//                                 <td
//                                     className="px-3 py-4"
//                                     colSpan={cfg.columns.length}
//                                 >
//                                     Loading…
//                                 </td>
//                             </tr>
//                         ) : rows.length === 0 ? (
//                             <tr>
//                                 <td
//                                     className="px-3 py-4"
//                                     colSpan={cfg.columns.length}
//                                 >
//                                     No archived items.
//                                 </td>
//                             </tr>
//                         ) : (
//                             rows.map((row) => (
//                                 <tr key={row.id} className="hover:bg-gray-50">
//                                     {cfg.columns.map((col) => {
//                                         if (col.key === "__action") {
//                                             return (
//                                                 <td
//                                                     key="__action"
//                                                     className="px-3 py-2 border-b"
//                                                 >
//                                                     <button
//                                                         className="inline-flex items-center gap-1 px-2 py-1 border rounded text-xs hover:bg-gray-100"
//                                                         onClick={() =>
//                                                             cfg?.openConfirm &&
//                                                             cfg.openConfirm({
//                                                                 id: row.id,
//                                                                 type:
//                                                                     cfg.title ||
//                                                                     "item",
//                                                             })
//                                                         }
//                                                         title="Restore"
//                                                     >
//                                                         Restore
//                                                     </button>
//                                                 </td>
//                                             );
//                                         }
//                                         const raw = row[col.key];
//                                         const val = col.fmt
//                                             ? col.fmt(raw, row)
//                                             : raw ?? "—";
//                                         return (
//                                             <td
//                                                 key={col.key}
//                                                 className="px-3 py-2 border-b"
//                                             >
//                                                 {val}
//                                             </td>
//                                         );
//                                     })}
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </Card>
//     );
// }

// const MERCHANT_CONFIG = {
//     soa: {
//         title: "Archived Statements of Account",
//         fetchUrl: "/merchant/soa/archived",
//         onRestore: (id, callbacks = {}) =>
//             router.post(
//                 `/merchant/soa/${id}/restore`,
//                 {},
//                 {
//                     preserveScroll: true,
//                     onSuccess: callbacks.onSuccess,
//                     onError: callbacks.onError,
//                 }
//             ),
//         columns: [
//             { key: "number", label: "SOA Number" },
//             {
//                 key: "soa_date",
//                 label: "SOA Date",
//                 fmt: (v) => (v ? new Date(v).toLocaleDateString() : "—"),
//             },
//             { key: "cover_period", label: "Cover Period" },
//             { key: "charge_slip", label: "Charge Slip" },
//             {
//                 key: "total_amount",
//                 label: "Total Amount",
//                 fmt: (v) => `₱${Number(v).toFixed(2)}`,
//             },
//             {
//                 key: "deleted_at",
//                 label: "Archived At",
//                 fmt: (v) => (v ? new Date(v).toLocaleString() : "—"),
//             },
//             { key: "__action", label: "Action" },
//         ],
//     },

//     "merchant-products": {
//         title: "Archived Products",
//         fetchUrl: "/merchant/products/archived",
//         onRestore: (id, callbacks = {}) =>
//             router.post(
//                 `/merchant/products/${id}/restore`,
//                 {},
//                 {
//                     preserveScroll: true,
//                     onSuccess: callbacks.onSuccess,
//                     onError: callbacks.onError,
//                 }
//             ),
//         columns: [
//             { key: "generic_name", label: "Generic Name" },
//             { key: "brand_name", label: "Brand Name" },
//             {
//                 key: "standard_price",
//                 label: "Standard Price",
//                 fmt: (v) => Number(v).toFixed(2),
//             },
//             {
//                 key: "discounted_price",
//                 label: "Discounted Price",
//                 fmt: (v) => Number(v).toFixed(2),
//             },
//             {
//                 key: "archived_at",
//                 label: "Archived At",
//                 fmt: (v) => (v ? new Date(v).toLocaleString() : "—"),
//             },
//             { key: "__action", label: "Action" },
//         ],
//     },
//     "merchant-services": {
//         title: "Archived Services",
//         fetchUrl: "/merchant/services/archived",
//         onRestore: (id) =>
//             router.post(
//                 `/merchant/services/${id}/restore`,
//                 {},
//                 { preserveScroll: true }
//             ),
//         columns: [
//             { key: "name", label: "Service Name" },
//             {
//                 key: "standard_rate",
//                 label: "Standard Rate",
//                 fmt: (v) => Number(v).toFixed(2),
//             },
//             {
//                 key: "discounted_rate",
//                 label: "Discounted Rate",
//                 fmt: (v) => Number(v).toFixed(2),
//             },
//             {
//                 key: "archived_at",
//                 label: "Archived At",
//                 fmt: (v) => (v ? new Date(v).toLocaleString() : "—"),
//             },
//             { key: "__action", label: "Action" },
//         ],
//     },
// };

// /* ------------ Placeholder tables for other roles ------------ */
// const PatientsArchiveTable = () => (
//     <TableSkeleton
//         headers={[
//             "Patient Code",
//             "Name",
//             "Gender/Age",
//             "Archived At",
//             "Archived By",
//             "Actions",
//         ]}
//     />
// );
// const ApprovalsArchiveTable = () => (
//     <TableSkeleton
//         headers={["Ref #", "Title/Reason", "Status", "Archived At", "Actions"]}
//     />
// );
// function SOAArchiveTable({ openConfirm }) {
//     const [rows, setRows] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchRows = async () => {
//         setLoading(true);
//         try {
//             const r = await fetch("/soa/archived");
//             const data = await r.json();
//             setRows(Array.isArray(data) ? data : []);
//         } catch {
//             setRows([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchRows();
//     }, []);

//     return (
//         <Card>
//             <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th className="px-3 py-2 text-left font-semibold border-b">
//                                 SOA Number
//                             </th>
//                             <th className="px-3 py-2 text-left font-semibold border-b">
//                                 SOA Date
//                             </th>
//                             <th className="px-3 py-2 text-left font-semibold border-b">
//                                 Cover Period
//                             </th>
//                             <th className="px-3 py-2 text-left font-semibold border-b">
//                                 Charge Slip
//                             </th>
//                             <th className="px-3 py-2 text-left font-semibold border-b">
//                                 Total Amount
//                             </th>
//                             <th className="px-3 py-2 text-left font-semibold border-b">
//                                 Archived At
//                             </th>
//                             <th className="px-3 py-2 text-left font-semibold border-b">
//                                 Action
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {loading ? (
//                             <tr>
//                                 <td
//                                     colSpan="7"
//                                     className="px-3 py-4 text-center"
//                                 >
//                                     Loading archived SOA records…
//                                 </td>
//                             </tr>
//                         ) : rows.length === 0 ? (
//                             <tr>
//                                 <td
//                                     colSpan="7"
//                                     className="px-3 py-4 text-center"
//                                 >
//                                     No archived SOA records found.
//                                 </td>
//                             </tr>
//                         ) : (
//                             rows.map((r) => (
//                                 <tr key={r.id} className="hover:bg-gray-50">
//                                     <td className="px-3 py-2 border-b">
//                                         {r.number}
//                                     </td>
//                                     <td className="px-3 py-2 border-b">
//                                         {r.soa_date
//                                             ? new Date(
//                                                   r.soa_date
//                                               ).toLocaleDateString()
//                                             : "—"}
//                                     </td>
//                                     <td className="px-3 py-2 border-b">
//                                         {r.cover_period || "—"}
//                                     </td>
//                                     <td className="px-3 py-2 border-b">
//                                         {r.charge_slip || "—"}
//                                     </td>
//                                     <td className="px-3 py-2 border-b">
//                                         ₱{Number(r.total_amount).toFixed(2)}
//                                     </td>
//                                     <td className="px-3 py-2 border-b">
//                                         {r.deleted_at
//                                             ? new Date(
//                                                   r.deleted_at
//                                               ).toLocaleString()
//                                             : "—"}
//                                     </td>
//                                     <td className="px-3 py-2 border-b">
//                                         <button
//                                             onClick={() =>
//                                                 openConfirm({
//                                                     id: r.id,
//                                                     type: "SOA Record",
//                                                 })
//                                             }
//                                             className="inline-flex items-center gap-1 px-2 py-1 border rounded text-xs hover:bg-gray-100"
//                                         >
//                                             Restore
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </Card>
//     );
// }
// /* ------------ Users archive table ------------ */
// function UsersArchiveTable() {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchArchivedUsers = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(
//                 "http://127.0.0.1:8000/api/users/archived"
//             );
//             const data = await response.json();
//             setUsers(Array.isArray(data) ? data : []);
//         } catch (error) {
//             console.error("Error fetching archived users:", error);
//             setUsers([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleRestore = async (id) => {
//         try {
//             const response = await fetch(
//                 `http://127.0.0.1:8000/api/users/${id}/unarchive`,
//                 {
//                     method: "PATCH",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Accept: "application/json",
//                     },
//                 }
//             );

//             if (response.ok) {
//                 alert("User restored successfully!");
//                 fetchArchivedUsers();
//             } else {
//                 const errorData = await response.json().catch(() => ({}));
//                 alert(errorData.message || "Failed to restore user");
//             }
//         } catch (error) {
//             console.error("Error restoring user:", error);
//             alert("Error restoring user");
//         }
//     };

//     useEffect(() => {
//         fetchArchivedUsers();
//     }, []);

//     return (
//         <Card>
//             <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th className="px-3 py-2 text-left font-semibold border-b">
//                                 Name
//                             </th>
//                             <th className="px-3 py-2 text-left font-semibold border-b">
//                                 Role
//                             </th>
//                             <th className="px-3 py-2 text-left font-semibold border-b">
//                                 Email
//                             </th>
//                             <th className="px-3 py-2 text-left font-semibold border-b">
//                                 Archived At
//                             </th>
//                             <th className="px-3 py-2 text-left font-semibold border-b">
//                                 Actions
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {loading ? (
//                             <tr>
//                                 <td
//                                     colSpan="5"
//                                     className="px-3 py-4 text-center"
//                                 >
//                                     Loading archived users…
//                                 </td>
//                             </tr>
//                         ) : users.length === 0 ? (
//                             <tr>
//                                 <td
//                                     colSpan="5"
//                                     className="px-3 py-4 text-center"
//                                 >
//                                     No archived users found.
//                                 </td>
//                             </tr>
//                         ) : (
//                             users.map((u) => (
//                                 <tr key={u.id} className="hover:bg-gray-50">
//                                     <td className="px-3 py-2 border-b">
//                                         {u.firstname || ""} {u.lastname || ""}
//                                     </td>
//                                     <td className="px-3 py-2 border-b capitalize">
//                                         {u.role}
//                                     </td>
//                                     <td className="px-3 py-2 border-b">
//                                         {u.email}
//                                     </td>
//                                     <td className="px-3 py-2 border-b">
//                                         {u.deleted_at
//                                             ? new Date(
//                                                   u.deleted_at
//                                               ).toLocaleString()
//                                             : "—"}
//                                     </td>
//                                     <td className="px-3 py-2 border-b">
//                                         <button
//                                             onClick={() => handleRestore(u.id)}
//                                             className="inline-flex items-center gap-1 px-2 py-1 border rounded text-xs hover:bg-gray-100"
//                                         >
//                                             Restore
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </Card>
//     );
// }
// const DocumentsArchiveTable = () => (
//     <TableSkeleton
//         headers={["Doc #", "Type", "Patient", "Archived At", "Actions"]}
//     />
// );

// function ViewSwitch({ view }) {
//     if (MERCHANT_CONFIG[view])
//         return (
//             <ArchiveTable
//                 cfg={{
//                     ...MERCHANT_CONFIG[view],
//                     openConfirm: (data) =>
//                         setConfirmState({ open: true, ...data }),
//                 }}
//             />
//         );

//     switch (view) {
//         case "patients":
//             return <PatientsArchiveTable />;
//         case "approvals":
//             return <ApprovalsArchiveTable />;
//         case "soa":
//             return (
//                 <SOAArchiveTable
//                     openConfirm={(data) =>
//                         setConfirmState({ open: true, ...data })
//                     }
//                 />
//             );
//         case "users":
//             return <UsersArchiveTable />; // ✅ Now active
//         case "documents":
//             return <DocumentsArchiveTable />;
//         default:
//             return <TableSkeleton headers={["#", "Name", "Archived At"]} />;
//     }
// }

// /* ------------ Return button ------------ */
// function ReturnButton({ role, view }) {
//     if (role !== "merchant") return null;
//     const href =
//         view === "merchant-services"
//             ? "/merchant/prices#services"
//             : "/merchant/prices#products";
//     return (
//         <button
//             type="button"
//             onClick={() =>
//                 router.visit(href, { preserveScroll: true /* push */ })
//             }
//             className="px-3 h-9 rounded border bg-white text-sm hover:bg-gray-50 mb-9"
//             title="Return to Prices"
//         >
//             ← Return to Prices
//         </button>
//     );
// }

// /* ------------ Page ------------ */
// export default function Archives() {
//     const [confirmState, setConfirmState] = useState({
//         open: false,
//         id: null,
//         type: null,
//     });

//     const [toast, setToast] = useState(null);
//     const notify = (variant, msg) => setToast({ variant, msg });

//     useEffect(() => {
//         if (!toast) return;
//         const t = setTimeout(() => setToast(null), 4000);
//         return () => clearTimeout(t);
//     }, [toast]);

//     const { props } = usePage();
//     const role = props?.auth?.user?.role ?? "admin";

//     const view = useQueryView();
//     const allowed = VIEWS_PER_ROLE[role] ?? [];
//     const fallback = DEFAULT_VIEW[role] ?? allowed[0] ?? "patients";

//     // ✅ Don’t redirect; just pick what we’ll render.
//     const selectedView = allowed.includes(view) ? view : fallback;
//     const pageTitle = `${titleMap[selectedView] ?? "Archives"} | Archives`;

//     return (
//         <div className="min-h-screen bg-[#f6f8fa]">
//             <Head title={pageTitle} />
//             <Navbar />

//             <div className="max-w-7xl mx-auto px-4 py-6">
//                 <PageHeader
//                     title={titleMap[selectedView] ?? "Archives"}
//                     right={<ReturnButton role={role} view={selectedView} />}
//                 />

//                 <PillBar role={role} active={selectedView} />

//                 <ViewSwitch view={selectedView} />

//                 <div className="mt-4 text-xs text-gray-500">
//                     Jump to:&nbsp;
//                     {allowed
//                         .filter((v) => v !== selectedView)
//                         .map((v, i) => (
//                             <span key={v}>
//                                 {i ? " · " : ""}
//                                 <Link
//                                     href={`/archives?view=${v}`}
//                                     className="underline hover:text-gray-700"
//                                     preserveScroll
//                                 >
//                                     {titleMap[v] ?? v}
//                                 </Link>
//                             </span>
//                         ))}
//                 </div>
//             </div>
//             {/* ===== Toast notification ===== */}
//             {toast && (
//                 <Alert
//                     variant={toast.variant}
//                     floating
//                     position="top-right"
//                     autoDismissMs={4000}
//                     onClose={() => setToast(null)}
//                 >
//                     {toast.msg}
//                 </Alert>
//             )}

//             {/* ===== Confirm Restore Modal ===== */}
//             <ConfirmDialog
//                 open={confirmState.open}
//                 title={`Restore ${confirmState.type || "Item"}`}
//                 message={`Are you sure you want to restore this ${
//                     confirmState.type?.toLowerCase() || "item"
//                 }?`}
//                 confirmText="Restore"
//                 cancelText="Cancel"
//                 variant="success"
//                 onCancel={() =>
//                     setConfirmState({ open: false, id: null, type: null })
//                 }
//                 onConfirm={() => {
//                     const { id, type } = confirmState;
//                     setConfirmState({ open: false, id: null, type: null });

//                     // Find which config is active based on URL view
//                     const view = useQueryView();
//                     if (view === "soa") {
//                         router.post(
//                             `/soa/${id}/restore`,
//                             {},
//                             {
//                                 preserveScroll: true,
//                                 onSuccess: () =>
//                                     notify(
//                                         "success",
//                                         `${type} restored successfully!`
//                                     ),
//                                 onError: () =>
//                                     notify(
//                                         "danger",
//                                         `Failed to restore ${type}.`
//                                     ),
//                             }
//                         );
//                         return;
//                     }

//                     const cfg = MERCHANT_CONFIG[view];
//                     if (!cfg) return;

//                     cfg.onRestore(id, {
//                         onSuccess: () =>
//                             notify("success", `${type} restored successfully!`),
//                         onError: () =>
//                             notify("danger", `Failed to restore ${type}.`),
//                     });
//                 }}
//             />
//         </div>
//     );
// }

// resources / js / Pages / Archives.jsx;
// resources/js/Pages/Archives.jsx
import React, { useEffect, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/Components/PageHeader";
import ConfirmDialog from "@/components/ConfirmDialog";
import Alert from "@/Components/Alert";

/* ------------ Role views ------------ */
const ROLE_VIEWS = {
    admin: ["users"],
    volunteer: ["patients", "documents"],
    merchant_prices: ["merchant-products", "merchant-services"],
    merchant_soa: ["soa"],
    accounting: ["soa"],
    treasury: ["soa"],
};

const DEFAULT_VIEW = {
    admin: "users",
    volunteer: "patients",
    merchant_prices: "merchant-products",
    merchant_soa: "soa",
    accounting: "soa",
    treasury: "soa",
};

const titleMap = {
    patients: "Archived Patients",
    approvals: "Archived Approvals",
    users: "Archived Users",
    documents: "Archived Documents",
    "merchant-products": "Archived Products",
    "merchant-services": "Archived Services",
    soa: "Archived SOA",
};

function useQueryParam(key) {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get(key);
}

/* ------------ UI Components ------------ */
const Card = ({ children }) => (
    <div className="border rounded-lg bg-white overflow-hidden">{children}</div>
);

function PillBar({ views, active }) {
    if (!views || views.length <= 1) return null;

    const goto = (v) =>
        router.visit(`/archives?view=${encodeURIComponent(v)}`, {
            preserveScroll: true,
        });

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {views.map((v) => (
                <button
                    key={v}
                    onClick={() => goto(v)}
                    type="button"
                    className={`px-3 h-8 rounded border text-sm ${
                        v === active
                            ? "bg-[#b71c1c] text-white border-[#b71c1c]"
                            : "bg-white hover:bg-gray-50"
                    }`}
                >
                    {titleMap[v] ?? v}
                </button>
            ))}
        </div>
    );
}

/* ------------ Users archive table ------------ */
function UsersArchiveTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchArchivedUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/users/archived"
            );
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching archived users:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/users/${id}/unarchive`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );

            if (response.ok) {
                alert("User restored successfully!");
                fetchArchivedUsers();
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(errorData.message || "Failed to restore user");
            }
        } catch (error) {
            console.error("Error restoring user:", error);
            alert("Error restoring user");
        }
    };

    useEffect(() => {
        fetchArchivedUsers();
    }, []);

    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-2 text-left font-semibold border-b">
                                Name
                            </th>
                            <th className="px-3 py-2 text-left font-semibold border-b">
                                Role
                            </th>
                            <th className="px-3 py-2 text-left font-semibold border-b">
                                Email
                            </th>
                            <th className="px-3 py-2 text-left font-semibold border-b">
                                Archived At
                            </th>
                            <th className="px-3 py-2 text-left font-semibold border-b">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-3 py-4 text-center"
                                >
                                    Loading archived users…
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-3 py-4 text-center"
                                >
                                    No archived users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 border-b">
                                        {u.firstname || ""} {u.lastname || ""}
                                    </td>
                                    <td className="px-3 py-2 border-b capitalize">
                                        {u.role}
                                    </td>
                                    <td className="px-3 py-2 border-b">
                                        {u.email}
                                    </td>
                                    <td className="px-3 py-2 border-b">
                                        {u.deleted_at
                                            ? new Date(
                                                  u.deleted_at
                                              ).toLocaleString()
                                            : "—"}
                                    </td>
                                    <td className="px-3 py-2 border-b">
                                        <button
                                            onClick={() => handleRestore(u.id)}
                                            className="inline-flex items-center gap-1 px-2 py-1 border rounded text-xs hover:bg-gray-100"
                                        >
                                            Restore
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

/* ------------ Generic Archive Table ------------ */
function ArchiveTable({ cfg, openConfirm, reloadKey }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRows = async () => {
        setLoading(true);
        try {
            const r = await fetch(cfg.fetchUrl);
            const data = await r.json();
            setRows(Array.isArray(data) ? data : []);
        } catch {
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!cfg?.fetchUrl) return;
        fetchRows();
    }, [cfg?.fetchUrl, reloadKey]);

    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            {cfg.columns.map((c) => (
                                <th
                                    key={c.label}
                                    className="px-3 py-2 text-left font-semibold border-b"
                                >
                                    {c.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    className="px-3 py-4 text-center"
                                    colSpan={cfg.columns.length}
                                >
                                    Loading…
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td
                                    className="px-3 py-4 text-center"
                                    colSpan={cfg.columns.length}
                                >
                                    No archived items.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {cfg.columns.map((col) => {
                                        if (col.key === "__action") {
                                            return (
                                                <td
                                                    key="__action"
                                                    className="px-3 py-2 border-b"
                                                >
                                                    <button
                                                        onClick={() =>
                                                            openConfirm({
                                                                id: row.id,
                                                                type:
                                                                    cfg.title ||
                                                                    "Item",
                                                                restoreUrl:
                                                                    cfg.restoreUrl,
                                                            })
                                                        }
                                                        className="inline-flex items-center gap-1 px-2 py-1 border rounded text-xs hover:bg-gray-100"
                                                    >
                                                        Restore
                                                    </button>
                                                </td>
                                            );
                                        }

                                        const val = col.fmt
                                            ? col.fmt(row[col.key], row)
                                            : row[col.key] ?? "—";
                                        return (
                                            <td
                                                key={col.key}
                                                className="px-3 py-2 border-b"
                                            >
                                                {val}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

/* ------------ Merchant Configurations ------------ */
const MERCHANT_CONFIG = {
    "merchant-products": {
        title: "Archived Products",
        fetchUrl: "/merchant/products/archived",
        restoreUrl: "/merchant/products",
        columns: [
            { key: "generic_name", label: "Generic Name" },
            { key: "brand_name", label: "Brand Name" },
            {
                key: "standard_price",
                label: "Standard Price",
                fmt: (v) => Number(v).toFixed(2),
            },
            {
                key: "discounted_price",
                label: "Discounted Price",
                fmt: (v) => Number(v).toFixed(2),
            },
            {
                key: "deleted_at",
                label: "Archived At",
                fmt: (v) => (v ? new Date(v).toLocaleString() : "—"),
            },
            { key: "__action", label: "Action" },
        ],
    },
    "merchant-services": {
        title: "Archived Services",
        fetchUrl: "/merchant/services/archived",
        restoreUrl: "/merchant/services",
        columns: [
            { key: "name", label: "Service Name" },
            {
                key: "standard_rate",
                label: "Standard Rate",
                fmt: (v) => Number(v).toFixed(2),
            },
            {
                key: "discounted_rate",
                label: "Discounted Rate",
                fmt: (v) => Number(v).toFixed(2),
            },
            {
                key: "deleted_at",
                label: "Archived At",
                fmt: (v) => (v ? new Date(v).toLocaleString() : "—"),
            },
            { key: "__action", label: "Action" },
        ],
    },
    soa: {
        title: "Archived SOA",
        fetchUrl: "/merchant/soa/archived",
        restoreUrl: "/merchant/soa",
        columns: [
            { key: "number", label: "SOA Number" },
            {
                key: "soa_date",
                label: "SOA Date",
                fmt: (v) => (v ? new Date(v).toLocaleDateString() : "—"),
            },
            { key: "cover_period", label: "Cover Period" },
            { key: "charge_slip", label: "Charge Slip" },
            {
                key: "total_amount",
                label: "Total Amount",
                fmt: (v) => `₱${Number(v).toFixed(2)}`,
            },
            {
                key: "deleted_at",
                label: "Archived At",
                fmt: (v) => (v ? new Date(v).toLocaleString() : "—"),
            },
            { key: "__action", label: "Action" },
        ],
    },
};

/* ------------ Return button ------------ */
function ReturnButton({ role, source, view }) {
    let href = null;

    // Merchant rules
    if (role === "merchant") {
        href = source === "soa" ? "/merchant/soa" : "/merchant/prices";
    }

    // Admin rule for Archived Users
    if (role === "admin") {
        href = "/admin/users";
    }

    if (!href) return null; // no button for other roles

    return (
        <button
            type="button"
            onClick={() => router.visit(href, { preserveScroll: true })}
            className="px-3 h-9 rounded border bg-white text-sm hover:bg-gray-50 mb-9"
            title="Return"
        >
            ← Return
        </button>
    );
}

/* ------------ Page ------------ */
export default function Archives() {
    const { props } = usePage();
    const role = props?.auth?.user?.role ?? "admin";
    const [reloadKey, setReloadKey] = useState(0);

    const view = useQueryParam("view");
    const source = useQueryParam("source") || "prices";

    const key =
        role === "merchant"
            ? source === "soa"
                ? "merchant_soa"
                : "merchant_prices"
            : role;

    const allowed = ROLE_VIEWS[key] ?? [];
    const fallback = DEFAULT_VIEW[key] ?? allowed[0] ?? "patients";
    const selectedView = allowed.includes(view) ? view : fallback;
    const pageTitle = `${titleMap[selectedView] ?? "Archives"} | Archives`;

    const [confirmState, setConfirmState] = useState({
        open: false,
        id: null,
        type: null,
        restoreUrl: "",
    });
    const [toast, setToast] = useState(null);
    const notify = (variant, msg) => setToast({ variant, msg });

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);

    /* ========== render ========== */
    return (
        <div className="min-h-screen bg-[#f6f8fa]">
            <Head title={pageTitle} />
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <PageHeader
                    title={titleMap[selectedView] ?? "Archives"}
                    right={
                        <ReturnButton
                            role={role}
                            source={source}
                            view={selectedView}
                        />
                    }
                />

                <PillBar views={allowed} active={selectedView} />

                {/* ✅ If the view is merchant (exists in config) use ArchiveTable; else use UsersArchiveTable or others */}
                {MERCHANT_CONFIG[selectedView] ? (
                    <ArchiveTable
                        cfg={MERCHANT_CONFIG[selectedView]}
                        reloadKey={reloadKey}
                        openConfirm={(data) =>
                            setConfirmState({ open: true, ...data })
                        }
                    />
                ) : selectedView === "users" ? (
                    <UsersArchiveTable />
                ) : (
                    <Card>
                        <div className="p-6 text-center text-gray-500">
                            This archive view is not yet connected.
                        </div>
                    </Card>
                )}
            </div>

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

            <ConfirmDialog
                open={confirmState.open}
                title={`Restore ${confirmState.type || "Item"}`}
                message={`Are you sure you want to restore this ${
                    confirmState.type?.toLowerCase() || "item"
                }?`}
                confirmText="Restore"
                cancelText="Cancel"
                variant="success"
                onCancel={() =>
                    setConfirmState({
                        open: false,
                        id: null,
                        type: null,
                        restoreUrl: "",
                    })
                }
                onConfirm={() => {
                    const { id, type, restoreUrl } = confirmState;
                    setConfirmState({
                        open: false,
                        id: null,
                        type: null,
                        restoreUrl: "",
                    });

                    if (!restoreUrl) return;

                    router.post(
                        `${restoreUrl}/${id}/restore`,
                        {},
                        {
                            preserveScroll: true,
                            preserveState: true,
                            onSuccess: () => {
                                setReloadKey((k) => k + 1);
                                notify(
                                    "success",
                                    `${type} restored successfully!`
                                );
                            },
                            onError: () =>
                                notify("danger", `Failed to restore ${type}.`),
                        }
                    );
                }}
            />
        </div>
    );
}
