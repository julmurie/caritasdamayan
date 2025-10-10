import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import styles from "../../../css/merchant.module.css";
import { router } from "@inertiajs/react";

const ICON_COLOR = "#111827"; // Tailwind gray-800-ish

const icons = {
    edit: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke="${ICON_COLOR}" stroke-width="1.5" width="18" height="18" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  `,
    archive: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke="${ICON_COLOR}" stroke-width="1.5" width="18" height="18" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  `,
    restore: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke="${ICON_COLOR}" stroke-width="1.5" class="w-5 h-5" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7
           48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662
           M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7
           48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662
           M4.5 12l3 3m-3-3-3 3" />
    </svg>
  `,
};

// === filename helpers (Manila date + slug-safe merchant) ===
const manilaDate = () =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(
        new Date()
    ); // YYYY-MM-DD

const slugify = (s) =>
    String(s)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

const baseName = (key, merchant) =>
    `${manilaDate()}-${key}-${slugify(merchant)}`;
// usage: baseName('products', merchant) => 2025-10-05-products-generika
// ===== Validation Helpers =====
function validateProductForm(form) {
    const errors = {};
    if (!form.generic_name || form.generic_name.trim().length < 2) {
        errors.generic_name = "Generic name must be at least 2 characters.";
    } else if (form.generic_name.trim().length > 25) {
        errors.generic_name = "Generic name cannot exceed 25 characters.";
    }
    if (form.brand_name && form.brand_name.trim().length > 25) {
        errors.brand_name = "Brand name cannot exceed 25 characters.";
    }

    if (!form.standard_price || Number(form.standard_price) <= 0) {
        errors.standard_price = "Standard price must be greater than 0.";
    } else if (String(form.standard_price).length > 10) {
        errors.standard_price = "Standard price is too long.";
    }

    if (form.discounted_price) {
        if (Number(form.discounted_price) < 0) {
            errors.discounted_price = "Discounted price cannot be negative.";
        } else if (
            Number(form.discounted_price) > Number(form.standard_price)
        ) {
            errors.discounted_price =
                "Discounted price cannot exceed standard price.";
        } else if (String(form.discounted_price).length > 10) {
            errors.discounted_price = "Discounted price is too long.";
        }
    }
    return errors;
}

function validateServiceForm(form) {
    const errors = {};
    if (!form.name || form.name.trim().length < 2) {
        errors.name = "Service name must be at least 2 characters.";
    } else if (form.name.trim().length > 25) {
        errors.name = "Service name cannot exceed 25 characters.";
    }
    if (!form.standard_rate || Number(form.standard_rate) <= 0) {
        errors.standard_rate = "Standard rate must be greater than 0.";
    } else if (String(form.standard_rate).length > 10) {
        errors.standard_rate = "Standard rate is too long.";
    }
    if (form.discounted_rate) {
        if (Number(form.discounted_rate) < 0) {
            errors.discounted_rate = "Discounted rate cannot be negative.";
        } else if (Number(form.discounted_rate) > Number(form.standard_rate)) {
            errors.discounted_rate =
                "Discounted rate cannot exceed standard rate.";
        } else if (String(form.discounted_rate).length > 10) {
            errors.discounted_rate = "Discounted rate is too long.";
        }
    }
    return errors;
}
export default function Prices({
    merchant = "Generika",
    permissions = {},
    endpoints = {},
}) {
    const canManage = !!permissions?.canManage;

    // use endpoints passed from server (with safe fallbacks)
    const productsURL =
        endpoints.productsDatatable || "/merchant/products/datatable";
    const servicesURL =
        endpoints.servicesDatatable || "/merchant/services/datatable";
    const archivedURL =
        endpoints.productsArchived || "/merchant/products/archived";
    const servicesArchivedURL =
        endpoints.servicesArchived || "/merchant/services/archived";

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
    const [editing, setEditing] = useState(null); // {id,generic_name,brand_name,standard_price,discounted_price}

    const resetForm = () => ({
        generic_name: "",
        brand_name: "",
        standard_price: "",
        discounted_price: "",
    });
    const [form, setForm] = useState(resetForm());
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // ===== SERVICES state =====
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
    const [serviceErrors, setServiceErrors] = useState({});

    // Archived services (fetch only when merchant)
    const [archivedServices, setArchivedServices] = useState([]);
    const [archivedServicesCount, setArchivedServicesCount] = useState(0);
    useEffect(() => {
        if (canManage && showArchivedService) {
            fetch(servicesArchivedURL)
                .then((r) => r.json())
                .then(setArchivedServices);
        }
    }, [canManage, showArchivedService, servicesArchivedURL]);

    // Archived products (fetch only when merchant)
    const [archived, setArchived] = useState([]);
    const [archivedCount, setArchivedCount] = useState(0);

    useEffect(() => {
        fetch(archivedURL)
            .then((r) => r.json())
            .then((items) => setArchivedCount(items.length))
            .catch(() => {});
        fetch(servicesArchivedURL)
            .then((r) => r.json())
            .then((items) => setArchivedServicesCount(items.length))
            .catch(() => {});
    }, [archivedURL, servicesArchivedURL]);

    // === DataTables setup (global jQuery) ===
    const tableRef = useRef(null);
    const dtProductsRef = useRef(null);
    const dtServicesRef = useRef(null);

    const buildActionsHtml = (row) => `
  <div class="${styles.pricesActionsCol}">
  <button type="button" class="${styles.pricesActionBtn} btn-edit" title="Edit" data-id="${row.id}" aria-label="Edit">
      ${icons.edit}
    </button>
    <button type="button" class="${styles.pricesActionBtn} btn-archive" title="Archive" data-id="${row.id}" aria-label="Archive">
      ${icons.archive}
    </button>

  </div>
`;

    const buildServiceActionsHtml = (row) => `
  <div class="${styles.pricesActionsCol}">
    <button type="button" class="${styles.pricesActionBtn} btn-edit-service" title="Edit" data-id="${row.id}" aria-label="Edit">
      ${icons.edit}
    </button>
    <button type="button" class="${styles.pricesActionBtn} btn-archive-service" title="Archive" data-id="${row.id}" aria-label="Archive">
      ${icons.archive}
    </button>

  </div>
`;

    useEffect(() => {
        if (showArchived) {
            fetch(archivedURL)
                .then((r) => r.json())
                .then((items) => {
                    setArchived(items);
                    setArchivedCount(items.length);
                });
        }
    }, [showArchived, archivedURL]);

    useEffect(() => {
        if (showArchivedService) {
            fetch(servicesArchivedURL)
                .then((r) => r.json())
                .then((items) => {
                    setArchivedServices(items);
                    setArchivedServicesCount(items.length);
                });
        }
    }, [showArchivedService, servicesArchivedURL]);

    // ---- Initialize PRODUCTS DataTable ----
    useEffect(() => {
        if (!tableRef.current || !window.$?.fn?.DataTable) return;

        const $table = window.$(tableRef.current);

        if (window.$.fn.dataTable.isDataTable(tableRef.current)) {
            $table.off("click", "button.btn-edit");
            $table.off("click", "button.btn-archive");
            $table.DataTable().destroy(true);
        }

        // columns base (no Action when !canManage)
        const productColumns = [
            { data: "generic_name", title: "Generic Name" },
            { data: "brand_name", title: "Brand Name" },
            { data: "standard_price", title: "Standard Price" },
            { data: "discounted_price", title: "Discounted Price" },
        ];
        if (canManage) {
            productColumns.push({
                data: null,
                title: "Action",
                orderable: false,
                searchable: false,
                render: (_d, _t, row) => buildActionsHtml(row),
            });
        }

        const dt = $table.DataTable({
            processing: true,
            serverSide: true,
            responsive: true,

            ajax: { url: productsURL, type: "GET", dataType: "json" },
            lengthMenu: [
                [10, 25, 50, 100, -1],
                [10, 25, 50, 100, "All"],
            ],
            dom: "Bfrtip",
            buttons: [
                "pageLength",
                "colvis",
                {
                    extend: "csv",
                    filename: () => baseName("products", merchant), // <-- CHANGED
                    title: `Products — ${merchant}`, // header/title inside file
                    exportOptions: { columns: ":visible" },
                },
                {
                    extend: "excel",
                    filename: () => baseName("products", merchant), // <-- CHANGED
                    title: `Products — ${merchant}`,
                    exportOptions: { columns: ":visible" },
                },
                {
                    extend: "print",
                    title: `Products — ${merchant}`, // print header (no filename here)
                    exportOptions: { columns: ":visible" },
                },
            ],

            columns: productColumns,
            order: [[0, "asc"]],
        });
        dtProductsRef.current = dt;

        // Bind row actions only when merchant
        if (canManage) {
            $table.on("click", "button.btn-edit", function () {
                const rowData = dt.row(window.$(this).closest("tr")).data();
                if (!rowData) return;
                setEditing({
                    id: rowData.id,
                    generic_name: rowData.generic_name ?? "",
                    brand_name: rowData.brand_name ?? "",
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
                    generic_name: rowData.generic_name ?? "",
                    brand_name: rowData.brand_name ?? "",
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
                    onSuccess: () => {
                        dt.ajax.reload(null, false);
                        setArchivedCount((n) => n + 1); // <-- bump
                        if (showArchived) {
                            // if modal open, refresh list too
                            fetch(archivedURL)
                                .then((r) => r.json())
                                .then(setArchived);
                        }
                    },
                });
            });
        }

        return () => {
            if (canManage) {
                $table.off("click", "button.btn-edit");
                $table.off("click", "button.btn-archive");
            }
            if (window.$.fn.dataTable.isDataTable(tableRef.current)) {
                $table.DataTable().destroy(true);
            }
            dtProductsRef.current = null;
        };
    }, [canManage, productsURL, merchant]);

    // ===== SERVICES DataTable =====
    useEffect(() => {
        if (!serviceTableRef.current || !window.$?.fn?.DataTable) return;

        const $table = window.$(serviceTableRef.current);

        if (window.$.fn.dataTable.isDataTable(serviceTableRef.current)) {
            $table.off("click", "button.btn-edit-service");
            $table.off("click", "button.btn-archive-service");
            $table.DataTable().destroy(true);
        }

        const serviceColumns = [
            { data: "name", title: "Service Name" },
            { data: "standard_rate", title: "Standard Rate" },
            { data: "discounted_rate", title: "Discounted Rate" },
        ];
        if (canManage) {
            serviceColumns.push({
                data: null,
                title: "Action",
                orderable: false,
                searchable: false,
                render: (_d, _t, row) => buildServiceActionsHtml(row),
            });
        }

        const dt = $table.DataTable({
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: { url: servicesURL, type: "GET", dataType: "json" },
            lengthMenu: [
                [10, 25, 50, 100, -1],
                [10, 25, 50, 100, "All"],
            ],
            dom: "Bfrtip",
            buttons: [
                "pageLength",
                "colvis",
                {
                    extend: "csv",
                    filename: () => baseName("services", merchant), // <-- CHANGED
                    title: `Services — ${merchant}`,
                    exportOptions: { columns: ":visible" },
                },
                {
                    extend: "excel",
                    filename: () => baseName("services", merchant), // <-- CHANGED
                    title: `Services — ${merchant}`,
                    exportOptions: { columns: ":visible" },
                },
                {
                    extend: "print",
                    title: `Services — ${merchant}`,
                    exportOptions: { columns: ":visible" },
                },
            ],

            columns: serviceColumns,
            order: [[0, "asc"]],
        });
        dtServicesRef.current = dt;

        if (canManage) {
            $table.on("click", "button.btn-edit-service", function () {
                const rowData = dt.row(window.$(this).closest("tr")).data();
                if (!rowData) return;
                setServiceEditing({
                    id: rowData.id,
                    name: rowData.name,
                    standard_rate: String(rowData.standard_rate).replace(
                        /,/g,
                        ""
                    ),
                    discounted_rate: String(rowData.discounted_rate).replace(
                        /,/g,
                        ""
                    ),
                });
                setServiceForm({
                    name: rowData.name,
                    standard_rate: String(rowData.standard_rate).replace(
                        /,/g,
                        ""
                    ),
                    discounted_rate: String(rowData.discounted_rate).replace(
                        /,/g,
                        ""
                    ),
                });
            });

            $table.on("click", "button.btn-archive-service", function () {
                const id = window.$(this).data("id");
                router.delete(`/merchant/services/${id}/archive`, {
                    onSuccess: () => {
                        dt.ajax.reload(null, false);
                        setArchivedServicesCount((n) => n + 1); // <-- bump
                        if (showArchivedService) {
                            fetch(servicesArchivedURL)
                                .then((r) => r.json())
                                .then(setArchivedServices);
                        }
                    },
                });
            });
        }

        return () => {
            if (canManage) {
                $table.off("click", "button.btn-edit-service");
                $table.off("click", "button.btn-archive-service");
            }
            if (window.$.fn.dataTable.isDataTable(serviceTableRef.current)) {
                $table.DataTable().destroy(true);
            }
            dtServicesRef.current = null;
        };
    }, [canManage, servicesURL, merchant]); // runs again if canManage/URL changes

    // After switching tabs, fix column widths for the now-visible table
    useEffect(() => {
        const fix = () => {
            const dt =
                activeTab === "products"
                    ? dtProductsRef.current
                    : dtServicesRef.current;
            if (!dt) return;
            try {
                dt.columns.adjust().responsive.recalc();
            } catch {}
        };
        const t = setTimeout(fix, 0);
        return () => clearTimeout(t);
    }, [activeTab]);

    const reloadTable = () => dtProductsRef.current?.ajax.reload(null, false);
    const reloadServiceTable = () =>
        dtServicesRef.current?.ajax.reload(null, false);

    // ===== Merchant-only actions =====
    const addService = (e) => {
        e.preventDefault();
        const errs = validateServiceForm(serviceForm);
        if (Object.keys(errs).length > 0) {
            setServiceErrors(errs);
            return;
        }
        setServiceErrors({});
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
        const errs = validateServiceForm(serviceForm);
        if (Object.keys(errs).length > 0) {
            setServiceErrors(errs);
            return;
        }
        setServiceErrors({});
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
        setServiceErrors({});
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
                    setArchivedServicesCount((n) => Math.max(0, n - 1)); // <-- drop
                    reloadServiceTable();
                },
            }
        );
    };

    // const addRow = (e) => {
    //     e.preventDefault();

    //     // run validation
    //     const errs = validateProductForm(form);
    //     if (Object.keys(errs).length > 0) {
    //         setErrors(errs); // show errors in UI
    //         return;
    //     }
    //     setErrors({}); // clear errors if valid

    //     router.post(
    //         "/merchant/products",
    //         {
    //             name: form.name,
    //             standard_price: form.standard_price || 0,
    //             discounted_price: form.discounted_price || 0,
    //         },
    //         {
    //             onSuccess: () => {
    //                 setShowAdd(false);
    //                 setForm(resetForm());
    //                 reloadTable();
    //             },
    //         }
    //     );
    // };

    // const saveEdit = (e) => {
    //     e.preventDefault();

    //     // run validation
    //     const errs = validateProductForm(form);
    //     if (Object.keys(errs).length > 0) {
    //         setErrors(errs); // show errors
    //         return;
    //     }
    //     setErrors({}); // clear errors

    //     if (!editing) return;
    //     router.patch(
    //         `/merchant/products/${editing.id}`,
    //         {
    //             name: form.name,
    //             standard_price: form.standard_price || 0,
    //             discounted_price: form.discounted_price || 0,
    //         },
    //         {
    //             onSuccess: () => {
    //                 setEditing(null);
    //                 setForm(resetForm());
    //                 reloadTable();
    //             },
    //         }
    //     );
    // };

    const addRow = (e) => {
        e.preventDefault();

        const errs = validateProductForm(form);

        if (Object.keys(errs).length > 0) {
            // 🔸 set errors
            setErrors(errs);

            // 🔸 mark ALL errored fields as touched (so all red borders show)
            const allTouched = Object.keys(errs).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {});
            setTouched((t) => ({ ...t, ...allTouched }));

            return;
        }

        // ✅ clear errors and touched when valid
        setErrors({});
        setTouched({});

        router.post(
            "/merchant/products",
            {
                generic_name: form.generic_name,
                brand_name: form.brand_name || null,
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

        const errs = validateProductForm(form);

        if (Object.keys(errs).length > 0) {
            // 🔸 show errors and mark touched
            setErrors(errs);
            const allTouched = Object.keys(errs).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {});
            setTouched(allTouched);

            return;
        }

        setErrors({});
        setTouched({});

        if (!editing) return;

        router.patch(
            `/merchant/products/${editing.id}`,
            {
                generic_name: form.generic_name,
                brand_name: form.brand_name || null,
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
        setErrors({});
        setTouched({}); // ✅ clear when canceling too
    };

    // const cancelEdit = () => {
    //     setEditing(null);
    //     setForm(resetForm());
    //     setErrors({});
    //     setTouched({});
    // };

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
                    {/* PRODUCTS SECTION */}
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

                            {canManage && (
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
                                        Archived Products ({archivedCount})
                                    </button>
                                </div>
                            )}
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
                                        <th>Generic Name</th>
                                        <th>Brand Name</th>
                                        <th>Standard Price</th>
                                        <th>Discounted Price</th>
                                        {canManage && <th>Action</th>}
                                    </tr>
                                </thead>
                                <tbody>{/* DataTables */}</tbody>
                            </table>
                        </div>
                    </div>

                    {/* SERVICES SECTION */}
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

                            {canManage && (
                                <div className="space-x-2">
                                    <button
                                        className={styles.btnGreen}
                                        onClick={() => setShowAddService(true)}
                                    >
                                        + Add Service
                                    </button>
                                    <button
                                        className={styles.btnDark}
                                        onClick={() =>
                                            setShowArchivedService(true)
                                        }
                                        title="View archived services"
                                    >
                                        Archived Services (
                                        {archivedServicesCount})
                                    </button>
                                </div>
                            )}
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
                                        {canManage && <th>Action</th>}
                                    </tr>
                                </thead>
                                <tbody>{/* DataTables */}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== MERCHANT-ONLY MODALS ===== */}
            {canManage && showAdd && (
                <Modal onClose={() => setShowAdd(false)} title="Add Product">
                    <form onSubmit={addRow} className="space-y-3">
                        <Field
                            label="Generic Name"
                            value={form.generic_name}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, generic_name: v }))
                            }
                            required
                            autoFocus
                            maxLength={25}
                            error={errors.generic_name}
                        />
                        <Field
                            label="Brand Name"
                            value={form.brand_name}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, brand_name: v }))
                            }
                            required
                            autoFocus
                            maxLength={100}
                            error={errors.brand_name}
                        />
                        <Field
                            label="Standard Price"
                            type="number"
                            step="0.01"
                            value={form.standard_price}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, standard_price: v }))
                            }
                            maxLength={10}
                            error={errors.standard_price}
                        />
                        <Field
                            label="Discounted Price"
                            type="number"
                            step="0.01"
                            value={form.discounted_price}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, discounted_price: v }))
                            }
                            maxLength={10}
                            error={errors.discounted_price}
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

            {canManage && editing && (
                <Modal
                    onClose={cancelEdit}
                    title={`Edit: ${editing?.generic_name || ""}`}
                >
                    <form onSubmit={saveEdit} className="space-y-3">
                        <Field
                            label="Generic Name"
                            value={form.generic_name}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, generic_name: v }))
                            }
                            required
                            autoFocus
                            maxLength={25}
                            error={errors.generic_name}
                        />
                        <Field
                            label="Brand Name"
                            value={form.brand_name}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, brand_name: v }))
                            }
                            required
                            autoFocus
                            maxLength={100}
                            error={errors.brand_name}
                        />
                        <Field
                            label="Standard Price"
                            type="number"
                            step="0.01"
                            value={form.standard_price}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, standard_price: v }))
                            }
                            maxLength={10}
                            error={errors.standard_price}
                            touched={touched.standard_price}
                        />
                        <Field
                            label="Discounted Price"
                            type="number"
                            step="0.01"
                            value={form.discounted_price}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, discounted_price: v }))
                            }
                            maxLength={10}
                            error={errors.discounted_price}
                            touched={touched.discounted_price}
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

            {canManage && showArchived && (
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
                                        <th>Generic Name</th>
                                        <th>Brand Name</th>
                                        <th>Standard Price</th>
                                        <th>Discounted Price</th>
                                        <th>Archived At</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {archived.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.generic_name}</td>
                                            <td>{item.brand_name}</td>
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
                                                    dangerouslySetInnerHTML={{
                                                        __html: icons.restore,
                                                    }}
                                                />
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

            {canManage && showAddService && (
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
                            maxLength={100}
                            error={serviceErrors.name}
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
                            maxLength={10}
                            error={serviceErrors.standard_rate}
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
                            maxLength={10}
                            error={serviceErrors.discounted_rate}
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

            {canManage && serviceEditing && (
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
                            maxLength={100}
                            error={serviceErrors.name}
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
                            maxLength={10}
                            error={serviceErrors.standard_rate}
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
                            maxLength={10}
                            error={serviceErrors.discounted_rate}
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

            {canManage && showArchivedService && (
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
                                                    dangerouslySetInnerHTML={{
                                                        __html: icons.restore,
                                                    }}
                                                />
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
    error,
    maxLength,
    touched,
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
                maxLength={maxLength}
                className={`border rounded-lg px-3 py-2 outline-none focus:ring ${
                    error
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-gray-200"
                }`}
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
    );
}
