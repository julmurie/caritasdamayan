import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import styles from "../../../css/merchant.module.css";
import { router } from "@inertiajs/react";

// put these near the top of Prices.jsx (inside the file, outside the component is fine)
const icons = {
    edit: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke="currentColor" stroke-width="1.5" width="18" height="18" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  `,
    archive: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke="currentColor" stroke-width="1.5" width="18" height="18" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  `,
    restore: `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
</svg>
`,
};

export default function Prices({ merchant = "Generika", products = [] }) {
    // Tabs (single page feel)
    const [activeTab, setActiveTab] = useState(
        (typeof window !== "undefined" && location.hash?.slice(1)) || "products"
    );
    useEffect(() => {
        if (typeof window !== "undefined") {
            history.replaceState(null, "", `#${activeTab}`);
        }
    }, [activeTab]);

    // Modals & forms
    const [showAdd, setShowAdd] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [editing, setEditing] = useState(null); // {id,name,standard_price,discounted_price}

    const resetForm = () => ({
        name: "",
        standard_price: "",
        discounted_price: "",
    });
    const [form, setForm] = useState(resetForm());

    // ===== SERVICES state (kept separate to avoid touching products) =====
    const serviceTableRef = useRef(null);

    const [showAddService, setShowAddService] = useState(false);
    const [showArchivedService, setShowArchivedService] = useState(false);
    const [serviceEditing, setServiceEditing] = useState(null); // {id,name,standard_rate,discounted_rate}

    const resetServiceForm = () => ({
        name: "",
        standard_rate: "",
        discounted_rate: "",
    });
    const [serviceForm, setServiceForm] = useState(resetServiceForm());

    // Archived services (fetched when modal opens)
    const [archivedServices, setArchivedServices] = useState([]);
    useEffect(() => {
        if (showArchivedService) {
            fetch("/merchant/services/archived")
                .then((r) => r.json())
                .then(setArchivedServices);
        }
    }, [showArchivedService]);

    // Archived data (fetched when modal opens)
    const [archived, setArchived] = useState([]);
    useEffect(() => {
        if (showArchived) {
            fetch("/merchant/products/archived")
                .then((r) => r.json())
                .then(setArchived);
        }
    }, [showArchived]);

    // === DataTables setup (global jQuery) ===
    const tableRef = useRef(null);
    const dtProductsRef = useRef(null);
    const dtServicesRef = useRef(null);

    const buildActionsHtml = (row) => {
        return `
    <div class="${styles.pricesActionsCol}">
      <button class="${styles.pricesActionBtn} btn-archive"
              title="Archive" data-id="${row.id}" aria-label="Archive">
        ${icons.archive}
      </button>
      <button class="${styles.pricesActionBtn} btn-edit"
              title="Edit" data-id="${row.id}" aria-label="Edit">
        ${icons.edit}
      </button>
    </div>
  `;
    };

    // Services row buttons (mirrors products)
    const buildServiceActionsHtml = (row) => {
        return `
    <div class="${styles.pricesActionsCol}">
      <button class="${styles.pricesActionBtn} btn-archive-service"
              title="Archive" data-id="${row.id}" aria-label="Archive">
        ${icons.archive}
      </button>
      <button class="${styles.pricesActionBtn} btn-edit-service"
              title="Edit" data-id="${row.id}" aria-label="Edit">
        ${icons.edit}
      </button>
    </div>
  `;
    };
    // ---- Initialize PRODUCTS DataTable ONCE ----
    useEffect(() => {
        if (
            !tableRef.current ||
            !window.$ ||
            !window.$.fn ||
            !window.$.fn.DataTable
        )
            return;

        const $table = window.$(tableRef.current);

        // destroy safety (should be null on first mount)
        if (window.$.fn.dataTable.isDataTable(tableRef.current)) {
            $table.off("click", "button.btn-edit");
            $table.off("click", "button.btn-archive");
            $table.DataTable().destroy(true);
        }

        const dt = $table.DataTable({
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: {
                url: "/merchant/products/datatable",
                type: "GET",
                dataType: "json",
            },
            lengthMenu: [
                [10, 25, 50, 100, -1],
                [10, 25, 50, 100, "All"],
            ],
            dom: "Bfrtip",
            buttons: [
                "pageLength",
                "colvis",
                { extend: "csv", title: `products_${merchant}` },
                { extend: "excel", title: `products_${merchant}` },
                { extend: "print", title: `Products – ${merchant}` },
            ],
            columns: [
                { data: "name", title: "Medicine Name" },
                { data: "standard_price", title: "Standard Price" },
                { data: "discounted_price", title: "Discounted Price" },
                {
                    data: null,
                    title: "Action",
                    orderable: false,
                    searchable: false,
                    render: (data, type, row) => buildActionsHtml(row),
                },
            ],
            order: [[0, "asc"]],
        });
        dtProductsRef.current = dt;

        // Delegated events
        $table.on("click", "button.btn-edit", function () {
            const rowData = dt.row(window.$(this).closest("tr")).data();
            if (!rowData) return;
            setEditing({
                id: rowData.id,
                name: rowData.name,
                standard_price: String(rowData.standard_price).replace(
                    /,/g,
                    ""
                ),
                discounted_price: String(rowData.discounted_price).replace(
                    /,/g,
                    ""
                ),
            });
            setForm({
                name: rowData.name,
                standard_price: String(rowData.standard_price).replace(
                    /,/g,
                    ""
                ),
                discounted_price: String(rowData.discounted_price).replace(
                    /,/g,
                    ""
                ),
            });
        });

        $table.on("click", "button.btn-archive", function () {
            const id = window.$(this).data("id");
            router.delete(`/merchant/products/${id}/archive`, {
                onSuccess: () => dt.ajax.reload(null, false),
            });
        });

        // cleanup on unmount
        return () => {
            $table.off("click", "button.btn-edit");
            $table.off("click", "button.btn-archive");
            if (window.$.fn.dataTable.isDataTable(tableRef.current)) {
                $table.DataTable().destroy(true);
            }
            dtProductsRef.current = null;
        };
    }, []);

    // ===== SERVICES DataTable (separate instance) =====
    useEffect(() => {
        // Initialize only when Services tab is active

        if (
            !serviceTableRef.current ||
            !window.$ ||
            !window.$.fn ||
            !window.$.fn.DataTable
        )
            return;

        const $table = window.$(serviceTableRef.current);

        // destroy previous instance if any
        if (window.$.fn.dataTable.isDataTable(serviceTableRef.current)) {
            $table.off("click", "button.btn-edit-service");
            $table.off("click", "button.btn-archive-service");
            $table.DataTable().destroy(true);
        }

        const dt = $table.DataTable({
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: {
                url: "/merchant/services/datatable",
                type: "GET",
                dataType: "json",
            },
            lengthMenu: [
                [10, 25, 50, 100, -1],
                [10, 25, 50, 100, "All"],
            ],
            dom: "Bfrtip",
            buttons: [
                "pageLength",
                "colvis",
                { extend: "csv", title: `services_${merchant}` },
                { extend: "excel", title: `services_${merchant}` },
                { extend: "print", title: `Services – ${merchant}` },
            ],
            columns: [
                { data: "name", title: "Service Name" },
                { data: "standard_rate", title: "Standard Rate" },
                { data: "discounted_rate", title: "Discounted Rate" },
                {
                    data: null,
                    title: "Action",
                    orderable: false,
                    searchable: false,
                    render: (data, type, row) => buildServiceActionsHtml(row),
                },
            ],
            order: [[0, "asc"]],
        });
        dtServicesRef.current = dt;

        // Delegated events
        $table.on("click", "button.btn-edit-service", function () {
            const rowData = dt.row(window.$(this).closest("tr")).data();
            if (!rowData) return;
            setServiceEditing({
                id: rowData.id,
                name: rowData.name,
                standard_rate: String(rowData.standard_rate).replace(/,/g, ""),
                discounted_rate: String(rowData.discounted_rate).replace(
                    /,/g,
                    ""
                ),
            });
            setServiceForm({
                name: rowData.name,
                standard_rate: String(rowData.standard_rate).replace(/,/g, ""),
                discounted_rate: String(rowData.discounted_rate).replace(
                    /,/g,
                    ""
                ),
            });
        });

        $table.on("click", "button.btn-archive-service", function () {
            const id = window.$(this).data("id");
            router.delete(`/merchant/services/${id}/archive`, {
                onSuccess: () => dt.ajax.reload(null, false),
            });
        });

        // cleanup on unmount
        return () => {
            $table.off("click", "button.btn-edit-service");
            $table.off("click", "button.btn-archive-service");
            if (window.$.fn.dataTable.isDataTable(serviceTableRef.current)) {
                $table.DataTable().destroy(true);
            }
            dtServicesRef.current = null;
        };
    }, []); // <-- runs once

    // After switching tabs, fix column widths for the now-visible table
    useEffect(() => {
        const fix = () => {
            const dt =
                activeTab === "products"
                    ? dtProductsRef.current
                    : dtServicesRef.current;
            // guard
            if (!dt) return;
            try {
                dt.columns.adjust().responsive.recalc();
            } catch {}
        };
        // slight delay to let the div become visible before adjust
        const t = setTimeout(fix, 0);
        return () => clearTimeout(t);
    }, [activeTab]);

    const reloadTable = () => {
        if (dtProductsRef.current)
            dtProductsRef.current.ajax.reload(null, false);
    };

    // ===== SERVICES helpers and actions =====

    const reloadServiceTable = () => {
        if (dtServicesRef.current)
            dtServicesRef.current.ajax.reload(null, false);
    };

    const addService = (e) => {
        e.preventDefault();
        router.post(
            "/merchant/services",
            {
                name: serviceForm.name,
                standard_rate: serviceForm.standard_rate || 0,
                discounted_rate: serviceForm.discounted_rate || 0,
            },
            {
                onSuccess: () => {
                    setShowAddService(false);
                    setServiceForm(resetServiceForm());
                    reloadServiceTable();
                },
            }
        );
    };

    const saveServiceEdit = (e) => {
        e.preventDefault();
        if (!serviceEditing) return;
        router.patch(
            `/merchant/services/${serviceEditing.id}`,
            {
                name: serviceForm.name,
                standard_rate: serviceForm.standard_rate || 0,
                discounted_rate: serviceForm.discounted_rate || 0,
            },
            {
                onSuccess: () => {
                    setServiceEditing(null);
                    setServiceForm(resetServiceForm());
                    reloadServiceTable();
                },
            }
        );
    };

    const cancelServiceEdit = () => {
        setServiceEditing(null);
        setServiceForm(resetServiceForm());
    };

    const restoreService = (id) => {
        router.post(
            `/merchant/services/${id}/restore`,
            {},
            {
                onSuccess: () => {
                    setArchivedServices((list) =>
                        list.filter((x) => x.id !== id)
                    );
                    reloadServiceTable();
                },
            }
        );
    };

    // === Inertia actions (products) ===
    const addRow = (e) => {
        e.preventDefault();
        router.post(
            "/merchant/products",
            {
                name: form.name,
                standard_price: form.standard_price || 0,
                discounted_price: form.discounted_price || 0,
            },
            {
                onSuccess: () => {
                    setShowAdd(false);
                    setForm(resetForm());
                    reloadTable();
                },
            }
        );
    };

    const saveEdit = (e) => {
        e.preventDefault();
        if (!editing) return;
        router.patch(
            `/merchant/products/${editing.id}`,
            {
                name: form.name,
                standard_price: form.standard_price || 0,
                discounted_price: form.discounted_price || 0,
            },
            {
                onSuccess: () => {
                    setEditing(null);
                    setForm(resetForm());
                    reloadTable();
                },
            }
        );
    };

    const cancelEdit = () => {
        setEditing(null);
        setForm(resetForm());
    };

    const restoreRow = (id) => {
        router.post(
            `/merchant/products/${id}/restore`,
            {},
            {
                onSuccess: () => {
                    setArchived((list) => list.filter((x) => x.id !== id));
                    reloadTable();
                },
            }
        );
    };

    return (
        <>
            <Navbar />
            <div className={styles.pricesContainer}>
                <aside className={styles.pricesSidebar}>
                    <div
                        className={styles.pricesSidebarLinks}
                        role="tablist"
                        aria-label="Merchant sections"
                    >
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "products"}
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
                    {/* PRODUCTS SECTION (always rendered) */}
                    <div
                        style={{
                            display:
                                activeTab === "products" ? "block" : "none",
                        }}
                    >
                        <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                            <div className={styles.pricesHeader}>
                                <h1>Products</h1>
                                <p>Partner Merchant | {merchant}</p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    className={styles.btnGreen}
                                    onClick={() => setShowAdd(true)}
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
                            <table
                                ref={tableRef}
                                className={`${styles.pricesTable} display nowrap`}
                                style={{ width: "100%" }}
                            >
                                <thead>
                                    <tr>
                                        <th>Medicine Name</th>
                                        <th>Standard Price</th>
                                        <th>Discounted Price</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* DataTables will render rows */}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* SERVICES SECTION (always rendered) */}
                    <div
                        style={{
                            display:
                                activeTab === "services" ? "block" : "none",
                        }}
                    >
                        <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                            <div className={styles.pricesHeader}>
                                <h1>Service</h1>
                                <p>Partner Merchant | {merchant}</p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    className={styles.btnGreen}
                                    onClick={() => setShowAddService(true)}
                                >
                                    + Add Service
                                </button>
                                <button
                                    className={styles.btnDark}
                                    onClick={() => setShowArchivedService(true)}
                                    title="View archived services"
                                >
                                    Archived Services ({archivedServices.length}
                                    )
                                </button>
                            </div>
                        </div>
                        <hr className="my-4 border-gray-300" />

                        <div className={styles.pricesTableWrapper}>
                            <table
                                ref={serviceTableRef}
                                className={`${styles.pricesTable} display nowrap`}
                                style={{ width: "100%" }}
                            >
                                <thead>
                                    <tr>
                                        <th>Service Name</th>
                                        <th>Standard Rate</th>
                                        <th>Discounted Rate</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* DataTables will render rows */}
                                </tbody>
                            </table>
                        </div>
                    </div>
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
                                setForm((f) => ({ ...f, discounted_price: v }))
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
                                            <td>
                                                {Number(
                                                    item.standard_price
                                                ).toFixed(2)}
                                            </td>
                                            <td>
                                                {Number(
                                                    item.discounted_price
                                                ).toFixed(2)}
                                            </td>
                                            <td>
                                                {new Date(
                                                    item.archived_at ||
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
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                                                        />
                                                    </svg>
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
            {/* SERVICES: Add Modal */}
            {showAddService && (
                <Modal
                    onClose={() => setShowAddService(false)}
                    title="Add Service"
                >
                    <form onSubmit={addService} className="space-y-3">
                        <Field
                            label="Service Name"
                            value={serviceForm.name}
                            onChange={(v) =>
                                setServiceForm((f) => ({ ...f, name: v }))
                            }
                            required
                            autoFocus
                        />
                        <Field
                            label="Standard Rate"
                            type="number"
                            step="0.01"
                            value={serviceForm.standard_rate}
                            onChange={(v) =>
                                setServiceForm((f) => ({
                                    ...f,
                                    standard_rate: v,
                                }))
                            }
                        />
                        <Field
                            label="Discounted Rate"
                            type="number"
                            step="0.01"
                            value={serviceForm.discounted_rate}
                            onChange={(v) =>
                                setServiceForm((f) => ({
                                    ...f,
                                    discounted_rate: v,
                                }))
                            }
                        />
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                className={styles.btnDark}
                                onClick={() => setShowAddService(false)}
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

            {/* SERVICES: Edit Modal */}
            {serviceEditing && (
                <Modal
                    onClose={cancelServiceEdit}
                    title={`Edit: ${serviceEditing.name}`}
                >
                    <form onSubmit={saveServiceEdit} className="space-y-3">
                        <Field
                            label="Service Name"
                            value={serviceForm.name}
                            onChange={(v) =>
                                setServiceForm((f) => ({ ...f, name: v }))
                            }
                            required
                            autoFocus
                        />
                        <Field
                            label="Standard Rate"
                            type="number"
                            step="0.01"
                            value={serviceForm.standard_rate}
                            onChange={(v) =>
                                setServiceForm((f) => ({
                                    ...f,
                                    standard_rate: v,
                                }))
                            }
                        />
                        <Field
                            label="Discounted Rate"
                            type="number"
                            step="0.01"
                            value={serviceForm.discounted_rate}
                            onChange={(v) =>
                                setServiceForm((f) => ({
                                    ...f,
                                    discounted_rate: v,
                                }))
                            }
                        />
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                className={styles.btnDark}
                                onClick={cancelServiceEdit}
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

            {/* SERVICES: Archived Modal */}
            {showArchivedService && (
                <Modal
                    onClose={() => setShowArchivedService(false)}
                    title="Archived Services"
                >
                    {archivedServices.length === 0 ? (
                        <p className="opacity-70">No archived services.</p>
                    ) : (
                        <div
                            className={styles.pricesTableWrapper}
                            style={{ maxHeight: 360 }}
                        >
                            <table className={styles.pricesTable}>
                                <thead>
                                    <tr>
                                        <th>Service Name</th>
                                        <th>Standard Rate</th>
                                        <th>Discounted Rate</th>
                                        <th>Archived At</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {archivedServices.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>
                                                {Number(
                                                    item.standard_rate
                                                ).toFixed(2)}
                                            </td>
                                            <td>
                                                {Number(
                                                    item.discounted_rate
                                                ).toFixed(2)}
                                            </td>
                                            <td>
                                                {new Date(
                                                    item.archived_at ||
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
                                                        restoreService(item.id)
                                                    }
                                                    aria-label="Restore"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7
            48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7
            c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3
            c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7
            48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7
            c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                                                        />
                                                    </svg>
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
                            onClick={() => setShowArchivedService(false)}
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}

/* ---------- Small UI helpers ---------- */
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
                className="bg-white rounded-xl shadow-xl w-[min(840px,calc(100%-2rem))] max-w-full"
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
