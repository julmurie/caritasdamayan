// import React from "react";
// import Navbar from "../../components/Navbar";
// import styles from "../../../css/merchant.module.css";
// import { Link } from "@inertiajs/react";

// export default function Prices({ merchant = "Generika", products = [] }) {
//     return (
//         <>
//             <Navbar />
//             <div className={styles.pricesContainer}>
//                 <aside className={styles.pricesSidebar}>
//                     <div className={styles.pricesSidebarLinks}>
//                         <Link
//                             href="/merchant/prices"
//                             className={`${styles.pricesSidebarLink} ${styles.pricesSidebarLinkActive}`}
//                         >
//                             Products
//                         </Link>
//                         <Link
//                             href="/merchant/services"
//                             className={styles.pricesSidebarLink}
//                         >
//                             Service
//                         </Link>
//                     </div>
//                 </aside>

//                 <div className={styles.pricesMain}>
//                     <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
//                         <div className={styles.pricesHeader}>
//                             <h1>Products</h1>
//                             <p>Partner Merchant | {merchant}</p>
//                         </div>
//                         <div className="space-x-2">
//                             <Link
//                                 href="/partner/products/create"
//                                 className={styles.btnGreen}
//                             >
//                                 + Add Product
//                             </Link>
//                             <Link
//                                 href="/partner/products/archived"
//                                 className={styles.btnDark}
//                             >
//                                 Archived Products
//                             </Link>
//                         </div>
//                     </div>
//                     <hr className="my-4 border-gray-300" />

//                     <div className={styles.pricesTableWrapper}>
//                         <table className={styles.pricesTable}>
//                             <thead>
//                                 <tr>
//                                     <th>Medicine Name</th>
//                                     <th>Standard Price</th>
//                                     <th>Discounted Price</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {products.length === 0 ? (
//                                     <tr>
//                                         <td
//                                             colSpan="4"
//                                             className={styles.pricesNoData}
//                                         >
//                                             No products found.
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     products.map((item, index) => (
//                                         <tr key={index}>
//                                             <td>{item.name}</td>
//                                             <td>{item.standard_price}</td>
//                                             <td>{item.discounted_price}</td>
//                                             <td
//                                                 className={
//                                                     styles.pricesActionsCol
//                                                 }
//                                             >
//                                                 <button
//                                                     className={
//                                                         styles.pricesActionBtn
//                                                     }
//                                                     title="Delete"
//                                                 >
//                                                     🗑
//                                                 </button>
//                                                 <button
//                                                     className={
//                                                         styles.pricesActionBtn
//                                                     }
//                                                     title="Download"
//                                                 >
//                                                     ⬇️
//                                                 </button>
//                                                 <button
//                                                     className={
//                                                         styles.pricesActionBtn
//                                                     }
//                                                     title="Edit"
//                                                 >
//                                                     ✏️
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>

//                     <div className={styles.pricesPagination}>
//                         <span>Pages</span>
//                         <button>&larr;</button>
//                         <button className="active">1</button>
//                         <button>2</button>
//                         <span>...</span>
//                         <button>8</button>
//                         <button>&rarr;</button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

import React, { useMemo, useState, useCallback, useEffect } from "react";
import Navbar from "../../components/Navbar";
import styles from "../../../css/merchant.module.css";

export default function Prices({ merchant = "Generika", products = [] }) {
    // --- NEW: tab state (single page) ---
    const [activeTab, setActiveTab] = useState(
        () =>
            (typeof window !== "undefined" && location.hash?.slice(1)) ||
            "products"
    );
    const handleKeyTabs = useCallback((e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            setActiveTab((t) => (t === "products" ? "services" : "products"));
        }
    }, []);
    useEffect(() => {
        // optional: reflect tab in URL (still single-page)
        if (typeof window !== "undefined") {
            history.replaceState(null, "", `#${activeTab}`);
        }
    }, [activeTab]);

    // Local working copy of products (no DB yet)
    const [rows, setRows] = useState(
        products.map((p, i) => ({
            id: crypto.randomUUID?.() || `tmp-${i}`,
            ...p,
        }))
    );
    const [archived, setArchived] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [editing, setEditing] = useState(null); // {id,name,standard_price,discounted_price}

    // Helpers
    const resetForm = () => ({
        name: "",
        standard_price: "",
        discounted_price: "",
    });

    const [form, setForm] = useState(resetForm());

    const openAdd = () => {
        setForm(resetForm());
        setShowAdd(true);
    };

    const addRow = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        const newItem = {
            id: crypto.randomUUID?.() || `tmp-${Date.now()}`,
            name: form.name.trim(),
            standard_price: form.standard_price || "0",
            discounted_price: form.discounted_price || "0",
        };
        setRows((r) => [newItem, ...r]);
        setShowAdd(false);
    };

    const archiveRow = (id) => {
        setRows((r) => {
            const idx = r.findIndex((x) => x.id === id);
            if (idx === -1) return r;
            const copy = [...r];
            const [item] = copy.splice(idx, 1);
            setArchived((a) => [{ archivedAt: new Date(), ...item }, ...a]);
            return copy;
        });
    };

    const restoreRow = (id) => {
        setArchived((a) => {
            const idx = a.findIndex((x) => x.id === id);
            if (idx === -1) return a;
            const copy = [...a];
            const [item] = copy.splice(idx, 1);
            setRows((r) => [item, ...r]);
            return copy;
        });
    };

    const deleteRow = (id) => {
        const sure = window.confirm("Delete this product from the list?");
        if (!sure) return;
        setRows((r) => r.filter((x) => x.id !== id));
    };

    const startEdit = (row) => {
        setEditing(row);
        setForm({
            name: row.name,
            standard_price: row.standard_price,
            discounted_price: row.discounted_price,
        });
    };

    const saveEdit = (e) => {
        e.preventDefault();
        if (!editing) return;
        setRows((r) =>
            r.map((x) =>
                x.id === editing.id
                    ? {
                          ...x,
                          name: form.name.trim() || x.name,
                          standard_price: form.standard_price,
                          discounted_price: form.discounted_price,
                      }
                    : x
            )
        );
        setEditing(null);
    };

    const cancelEdit = () => {
        setEditing(null);
        setForm(resetForm());
    };

    const downloadCSV = () => {
        const header = ["Medicine Name", "Standard Price", "Discounted Price"];
        const data = rows.map((r) => [
            r.name,
            r.standard_price,
            r.discounted_price,
        ]);
        const csv = [header, ...data]
            .map((arr) =>
                arr.map((v) => {
                    const s = String(v ?? "");
                    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
                })
            )
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `products_${merchant
            .replace(/\s+/g, "_")
            .toLowerCase()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const hasRows = rows.length > 0;

    return (
        <>
            <Navbar />
            <div className={styles.pricesContainer}>
                <aside className={styles.pricesSidebar}>
                    {/* --- CHANGED: use buttons as tabs --- */}
                    <div
                        className={styles.pricesSidebarLinks}
                        role="tablist"
                        aria-label="Merchant sections"
                        onKeyDown={handleKeyTabs}
                    >
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "products"}
                            tabIndex={activeTab === "products" ? 0 : -1}
                            className={`${styles.pricesSidebarLink} ${
                                activeTab === "products"
                                    ? styles.pricesSidebarLinkActive
                                    : ""
                            }`}
                            onClick={() => setActiveTab("products")}
                        >
                            Products
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "services"}
                            tabIndex={activeTab === "services" ? 0 : -1}
                            className={`${styles.pricesSidebarLink} ${
                                activeTab === "services"
                                    ? styles.pricesSidebarLinkActive
                                    : ""
                            }`}
                            onClick={() => setActiveTab("services")}
                        >
                            Service
                        </button>
                    </div>
                </aside>

                <div className={styles.pricesMain}>
                    {activeTab === "products" ? (
                        <>
                            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                                <div className={styles.pricesHeader}>
                                    <h1>Products</h1>
                                    <p>Partner Merchant | {merchant}</p>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        className={styles.btnGreen}
                                        onClick={openAdd}
                                    >
                                        + Add Product
                                    </button>
                                    <button
                                        className={styles.btnDark}
                                        onClick={() => setShowArchived(true)}
                                        title="View archived products"
                                    >
                                        Archived Products ({archived.length})
                                    </button>
                                </div>
                            </div>
                            <hr className="my-4 border-gray-300" />

                            <div className={styles.pricesTableWrapper}>
                                <table className={styles.pricesTable}>
                                    <thead>
                                        <tr>
                                            <th>Medicine Name</th>
                                            <th>Standard Price</th>
                                            <th>Discounted Price</th>
                                            <th
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                Action{" "}
                                                <button
                                                    onClick={downloadCSV}
                                                    className={
                                                        styles.pricesActionBtn
                                                    }
                                                    title="Download table as CSV"
                                                    aria-label="Download CSV"
                                                >
                                                    ⬇️
                                                </button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!hasRows ? (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className={
                                                        styles.pricesNoData
                                                    }
                                                >
                                                    No products found.
                                                </td>
                                            </tr>
                                        ) : (
                                            rows.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        {item.standard_price}
                                                    </td>
                                                    <td>
                                                        {item.discounted_price}
                                                    </td>
                                                    <td
                                                        className={
                                                            styles.pricesActionsCol
                                                        }
                                                    >
                                                        <button
                                                            className={
                                                                styles.pricesActionBtn
                                                            }
                                                            title="Archive"
                                                            onClick={() =>
                                                                archiveRow(
                                                                    item.id
                                                                )
                                                            }
                                                            aria-label="Archive"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                                stroke="currentColor"
                                                                className="size-6"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className={
                                                                styles.pricesActionBtn
                                                            }
                                                            title="Edit"
                                                            onClick={() =>
                                                                startEdit(item)
                                                            }
                                                            aria-label="Edit"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                                stroke="currentColor"
                                                                className="size-6"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* (Static) Pagination display placeholder */}
                            <div className={styles.pricesPagination}>
                                <span>Pages</span>
                                <button>&larr;</button>
                                <button className="active">1</button>
                                <button>2</button>
                                <span>...</span>
                                <button>8</button>
                                <button>&rarr;</button>
                            </div>
                        </>
                    ) : (
                        // --- Simple placeholder for "Service" tab (same page) ---
                        <div>
                            <div className={styles.pricesHeader}>
                                <h1>Service</h1>
                                <p>Partner Merchant | {merchant}</p>
                            </div>
                            <hr className="my-4 border-gray-300" />
                            <p className="opacity-80">
                                Service-related content goes here. You can add a
                                similar table & modal flow later.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {showAdd && (
                <Modal onClose={() => setShowAdd(false)} title="Add Product">
                    <form onSubmit={addRow} className="space-y-3">
                        <Field
                            label="Medicine Name"
                            value={form.name}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, name: v }))
                            }
                            required
                            autoFocus
                        />
                        <Field
                            label="Standard Price"
                            type="number"
                            step="0.01"
                            value={form.standard_price}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, standard_price: v }))
                            }
                        />
                        <Field
                            label="Discounted Price"
                            type="number"
                            step="0.01"
                            value={form.discounted_price}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, discounted_price: v }))
                            }
                        />
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                className={styles.btnDark}
                                onClick={() => setShowAdd(false)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className={styles.btnGreen}>
                                Save
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Edit Modal */}
            {editing && (
                <Modal onClose={cancelEdit} title={`Edit: ${editing.name}`}>
                    <form onSubmit={saveEdit} className="space-y-3">
                        <Field
                            label="Medicine Name"
                            value={form.name}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, name: v }))
                            }
                            required
                            autoFocus
                        />
                        <Field
                            label="Standard Price"
                            type="number"
                            step="0.01"
                            value={form.standard_price}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, standard_price: v }))
                            }
                        />
                        <Field
                            label="Discounted Price"
                            type="number"
                            step="0.01"
                            value={form.discounted_price}
                            onChange={(v) =>
                                setForm((f) => ({
                                    ...f,
                                    discounted_price: v,
                                }))
                            }
                        />
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                className={styles.btnDark}
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>
                            <button type="submit" className={styles.btnGreen}>
                                Update
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Archived Modal */}
            {showArchived && (
                <Modal
                    onClose={() => setShowArchived(false)}
                    title="Archived Products"
                >
                    {archived.length === 0 ? (
                        <p className="opacity-70">No archived products.</p>
                    ) : (
                        <div
                            className={styles.pricesTableWrapper}
                            style={{ maxHeight: 360 }}
                        >
                            <table className={styles.pricesTable}>
                                <thead>
                                    <tr>
                                        <th>Medicine Name</th>
                                        <th>Standard Price</th>
                                        <th>Discounted Price</th>
                                        <th>Archived At</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {archived.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.standard_price}</td>
                                            <td>{item.discounted_price}</td>
                                            <td>
                                                {new Date(
                                                    item.archivedAt
                                                ).toLocaleString()}
                                            </td>
                                            <td
                                                className={
                                                    styles.pricesActionsCol
                                                }
                                            >
                                                <button
                                                    className={
                                                        styles.pricesActionBtn
                                                    }
                                                    title="Restore"
                                                    onClick={() =>
                                                        restoreRow(item.id)
                                                    }
                                                    aria-label="Restore"
                                                >
                                                    ♻️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="flex justify-end pt-3">
                        <button
                            className={styles.btnDark}
                            onClick={() => setShowArchived(false)}
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}

/* ---------- Small UI helpers (no external libs) ---------- */

function Modal({ title, children, onClose }) {
    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[999] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-[min(640px,calc(100%-2rem))] max-w-full"
                style={{ overflow: "hidden" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-xl leading-none px-2"
                        aria-label="Close"
                        title="Close"
                    >
                        ×
                    </button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}

function Field({
    label,
    value,
    onChange,
    type = "text",
    step,
    required,
    autoFocus,
}) {
    const id = useMemo(() => `f_${Math.random().toString(36).slice(2)}`, []);
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-medium opacity-80">
                {label}
            </label>
            <input
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                type={type}
                step={step}
                required={required}
                autoFocus={autoFocus}
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring focus:ring-gray-200"
            />
        </div>
    );
}
