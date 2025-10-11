import React, { useEffect, useMemo, useRef, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import Navbar from "./Navbar";
import styles from "../../css/merchant.module.css";
import ConfirmDialog from "@/components/ConfirmDialog";
import Alert from "@/Components/Alert";

/* ===== SVG icons for action buttons ===== */
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
};

// === filename helpers (Manila date + slug-safe scope) ===
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

const baseName = (key, scope) => `${manilaDate()}-${key}-${slugify(scope)}`;
// e.g., baseName('soa', 'merchant') => 2025-10-05-soa-merchant

// ===== Validation Helpers =====
function validateSoaForm(form) {
    const errors = {};

    // SOA Number
    if (!form.number?.trim()) {
        errors.number = "SOA Number is required.";
    } else if (form.number.length < 2) {
        errors.number = "SOA Number must be at least 2 characters.";
    } else if (form.number.length > 15) {
        errors.number = "SOA Number cannot exceed 15 characters.";
    }

    // SOA Date
    if (!form.soa_date) {
        errors.soa_date = "SOA Date is required.";
    }

    // Cover Period
    if (form.cover_period && form.cover_period.length > 25) {
        errors.cover_period = "Cover Period cannot exceed 25 characters.";
    }

    // Charge Slip
    if (!form.charge_slip?.trim()) {
        errors.charge_slip = "Charge Slip is required.";
    } else if (form.charge_slip.length > 5) {
        errors.charge_slip = "Charge Slip cannot exceed 5 characters.";
    }

    // Total Amount (required, numeric only, positive, max 12 digits)
    if (!form.total_amount) {
        errors.total_amount = "Total Amount is required.";
    } else if (!/^\d+(\.\d{0,2})?$/.test(form.total_amount)) {
        errors.total_amount =
            "Total Amount must be a number (letters and symbols not allowed).";
    } else if (form.total_amount.replace(".", "").length > 12) {
        errors.total_amount = "Total Amount cannot exceed 12 digits.";
    } else if (Number(form.total_amount) <= 0) {
        errors.total_amount = "Total Amount must be greater than 0.";
    }
    return errors;
}

const initDT = (
    tableEl,
    {
        ajaxUrl,
        exportTitle,
        filename,
        columns,
        order = [[1, "desc"]],
        dom = "Bfrtip",
    }
) => {
    const $t = window.$(tableEl);
    if (window.$?.fn?.dataTable?.isDataTable(tableEl)) {
        $t.DataTable().destroy(true);
    }
    const dt = $t.DataTable({
        processing: true,
        serverSide: true,
        responsive: true,
        ajax: { url: ajaxUrl, type: "GET", dataType: "json" },
        dom,
        lengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "All"],
        ],
        order,
        buttons: [
            "pageLength",
            "colvis",
            {
                extend: "csv",
                filename, // <-- NEW
                title: exportTitle,
                exportOptions: { columns: ":visible" },
            },
            {
                extend: "excel",
                filename, // <-- NEW
                title: exportTitle,
                exportOptions: { columns: ":visible" },
            },
            {
                extend: "print",
                title: exportTitle,
                exportOptions: { columns: ":visible" },
            },
        ],
        columns,
    });
    return dt;
};

const actionsHtml = (row, styles) => `
  <div class="${styles.pricesActionsCol || ""}">
    <button class="${styles.pricesActionBtn || ""} btn-edit"
            title="Edit" data-id="${row.id}" aria-label="Edit">
      ${icons.edit}
    </button>
    <button class="${styles.pricesActionBtn || ""} btn-archive"
            title="Archive" data-id="${row.id}" aria-label="Archive">
      ${icons.archive}
    </button>
  </div>
`;

export default function SoaLayout({
    title = "SOA",
    ajaxUrl,
    createUrl,
    deleteUrlBase,
    exportTitle = "soa_export",
    datatablesDom = "Bfrtip",
    showAddButton = true,
}) {
    // ===== Confirm + Toast states =====
    const [confirmState, setConfirmState] = useState({ open: false, id: null });
    const [toast, setToast] = useState(null);
    const notify = (variant, msg) => setToast({ variant, msg });

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);

    // Get role from Inertia shared props
    const { auth } = usePage().props;
    const role = auth?.user?.role || "";
    const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

    const urlPrefix = useMemo(() => {
        const first =
            (typeof window !== "undefined"
                ? window.location.pathname.split("/")[1]
                : "") || "admin";
        return [
            "admin",
            "volunteer",
            "merchant",
            "accounting",
            "treasury",
        ].includes(first)
            ? first
            : "admin";
    }, []);

    const resolvedAjaxUrl = ajaxUrl || `/${urlPrefix}/soa/datatable`;
    const resolvedBase = `/${urlPrefix}/soa`; // used for create, update, delete
    const resolvedCreateUrl = createUrl || resolvedBase;
    const resolvedDeleteBase = deleteUrlBase || resolvedBase;

    const tableRef = useRef(null);
    const dtRef = useRef(null);

    // ===== Add modal state =====
    const [showAdd, setShowAdd] = useState(false);
    const resetForm = () => ({
        number: "",
        soa_date: "",
        cover_period: "",
        charge_slip: "",
        total_amount: "",
        status: "Pending",
    });
    const [form, setForm] = useState(resetForm());
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});

    // ===== Edit modal state =====
    const [showEdit, setShowEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editFile, setEditFile] = useState(null);

    const ymd = (v) => (v ? String(v).slice(0, 10) : ""); // ensure YYYY-MM-DD for <input type="date">

    useEffect(() => {
        if (!tableRef.current || !window.$?.fn?.DataTable) return;
        const $table = window.$(tableRef.current);

        const dt = initDT(tableRef.current, {
            ajaxUrl: resolvedAjaxUrl,
            exportTitle: `${title} — ${roleLabel || urlPrefix}`,
            filename: () => baseName("soa", roleLabel || urlPrefix),
            order: [[1, "desc"]],
            dom: datatablesDom,
            columns: [
                { data: "number", title: "SOA Number" },
                { data: "soa_date", title: "SOA Date" },
                { data: "cover_period", title: "Cover Period" },
                { data: "charge_slip", title: "Charge Slip" },
                { data: "total_amount", title: "Total Amount" },
                { data: "attachment", title: "Attachment" },
                { data: "status", title: "Status" },
                {
                    data: null,
                    title: "Action",
                    orderable: false,
                    searchable: false,
                    render: (_d, _t, row) => actionsHtml(row, styles),
                },
            ],
        });
        dtRef.current = dt;

        // ===== EDIT handler
        const onEdit = function () {
            const rowData = dt.row(window.$(this).closest("tr")).data();
            if (!rowData || !rowData.id) return;

            // Pre-fill form for edit
            setEditId(rowData.id);
            setShowEdit(true);
            setEditFile(null);
            setForm({
                number: rowData.number || "",
                soa_date: ymd(rowData.soa_date),
                cover_period: rowData.cover_period || "",
                charge_slip: rowData.charge_slip || "",
                total_amount: rowData.total_amount ?? "",
                status: rowData.status || "Pending",
            });
        };

        // ===== ARCHIVE handler — DELETE /soa/{id}
        const onArchive = function () {
            const id = window.$(this).data("id");
            if (!id) return;
            setConfirmState({ open: true, id });
        };

        $table.on("click", "button.btn-edit", onEdit);
        $table.on("click", "button.btn-archive", onArchive);

        return () => {
            $table.off("click", "button.btn-edit", onEdit);
            $table.off("click", "button.btn-archive", onArchive);
            if (window.$?.fn?.dataTable?.isDataTable(tableRef.current)) {
                $table.DataTable().destroy(true);
            }
            dtRef.current = null;
        };
    }, [resolvedAjaxUrl, datatablesDom, exportTitle, resolvedDeleteBase]);

    const reloadTable = () => dtRef.current?.ajax.reload(null, false);

    /* ====== Create record ====== */
    const addRecord = (e) => {
        e.preventDefault();

        const errs = validateSoaForm(form);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setErrors({});

        if (!form.number || !form.soa_date) {
            alert("SOA Number and SOA Date are required.");
            return;
        }

        const fd = new FormData();
        fd.append("number", form.number);
        fd.append("soa_date", form.soa_date);
        fd.append("cover_period", form.cover_period || "");
        fd.append("charge_slip", form.charge_slip || "");
        fd.append("total_amount", form.total_amount || 0);
        fd.append("status", form.status || "Pending");

        if (file) {
            const ok = ["image/png", "image/jpeg", "application/pdf"];
            if (!ok.includes(file.type)) {
                setErrors((e) => ({
                    ...e,
                    attachment: "Attachment must be PNG, JPG/JPEG, or PDF.",
                }));
                return;
            }
            fd.append("attachment", file);
        }

        router.post(resolvedCreateUrl, fd, {
            forceFormData: true,
            onSuccess: () => {
                setShowAdd(false);
                setForm(resetForm());
                setFile(null);
                setErrors({});
                reloadTable();
                notify("success", "SOA record added successfully!");
            },
            onError: () => {
                notify("danger", "Failed to add SOA record.");
            },
        });
    };

    /* ====== Update record (PATCH) ====== */
    const updateRecord = (e) => {
        e.preventDefault();

        const errs = validateSoaForm(form);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setErrors({});

        if (!editId) return;
        if (!form.number || !form.soa_date) {
            alert("SOA Number and SOA Date are required.");
            return;
        }

        const fd = new FormData();
        fd.append("_method", "patch"); // method spoof so files work
        fd.append("number", form.number);
        fd.append("soa_date", form.soa_date);
        fd.append("cover_period", form.cover_period || "");
        fd.append("charge_slip", form.charge_slip || "");
        fd.append("total_amount", form.total_amount || 0);
        fd.append("status", form.status || "Pending");

        if (editFile) {
            const ok = ["image/png", "image/jpeg", "application/pdf"];
            if (!ok.includes(editFile.type)) {
                setErrors((e) => ({
                    ...e,
                    attachment: "Attachment must be PNG, JPG/JPEG, or PDF.",
                }));
                return;
            }
            fd.append("attachment", editFile);
        }

        router.post(`${resolvedBase}/${editId}`, fd, {
            forceFormData: true,
            onSuccess: () => {
                setShowEdit(false);
                setEditId(null);
                setEditFile(null);
                setForm(resetForm());
                setErrors({});
                reloadTable();
                notify("success", "SOA record updated successfully!");
            },
            onError: () => {
                notify("danger", "Failed to update SOA record.");
            },
        });
    };

    return (
        <>
            <div className={styles.soaContainer}>
                <div className="flex items-center justify-between">
                    {/* Title + role (subtitle) */}
                    <div>
                        <h1 className={styles.soaTitle}>{title}</h1>
                        {roleLabel && (
                            <p className="text-lg text-gray-600 mt-1">
                                {roleLabel}
                            </p>
                        )}
                    </div>

                    {showAddButton && (
                        <div className="space-x-2">
                            <button
                                className={styles.btnGreen}
                                onClick={() => setShowAdd(true)}
                                title="Add a new SOA record"
                            >
                                + Add Record
                            </button>

                            <a
                                href="/archives?view=soa&source=soa"
                                className={styles.btnDark}
                            >
                                <span className={styles.iconLeft}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                                        />
                                    </svg>
                                </span>
                                Archived SOA
                            </a>
                        </div>
                    )}
                </div>

                <hr className="my-4 border" />

                <div className={styles.pricesTableWrapper}>
                    <table
                        ref={tableRef}
                        className={`${
                            styles.pricesTable || styles.soaTable
                        } display nowrap`}
                        style={{ width: "100%" }}
                    >
                        <thead>
                            <tr>
                                <th>SOA Number</th>
                                <th>SOA Date</th>
                                <th>Cover Period</th>
                                <th>Charge Slip</th>
                                <th>Total Amount</th>
                                <th>Attachment</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>{/* DataTables renders rows */}</tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {showAddButton && showAdd && (
                <Modal title="Add SOA Record" onClose={() => setShowAdd(false)}>
                    <form onSubmit={addRecord} className="space-y-3">
                        <Field
                            label="SOA Number"
                            value={form.number}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, number: v }))
                            }
                            required
                            autoFocus
                            maxLength={15}
                            error={errors.number}
                        />
                        <Field
                            label="SOA Date"
                            type="date"
                            value={form.soa_date}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, soa_date: v }))
                            }
                            required
                            maxLength={10}
                            error={errors.soa_date}
                        />
                        <Field
                            label="Cover Period"
                            placeholder="e.g. 2025-09-01 — 2025-09-30"
                            value={form.cover_period}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, cover_period: v }))
                            }
                            maxLength={25}
                            error={errors.cover_period}
                        />
                        <Field
                            label="Charge Slip"
                            value={form.charge_slip}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, charge_slip: v }))
                            }
                            maxLength={5}
                            error={errors.charge_slip}
                        />
                        <Field
                            label="Total Amount"
                            type="number"
                            step="0.01"
                            value={form.total_amount}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, total_amount: v }))
                            }
                            maxLength={12}
                            error={errors.total_amount}
                        />

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium opacity-80">
                                Attachment
                            </label>
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.pdf"
                                onChange={(e) =>
                                    setFile(e.target.files?.[0] || null)
                                }
                                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring focus:ring-gray-200"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium opacity-80">
                                Status
                            </label>
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring focus:ring-gray-200"
                                value={form.status}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        status: e.target.value,
                                    }))
                                }
                            >
                                <option value="Pending">Pending</option>
                                <option value="For Review">For Review</option>
                                <option value="Approved">Approved</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>

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
            {showEdit && (
                <Modal
                    title="Edit SOA Record"
                    onClose={() => {
                        setShowEdit(false);
                        setEditId(null);
                        setEditFile(null);
                    }}
                >
                    <form onSubmit={updateRecord} className="space-y-3">
                        <Field
                            label="SOA Number"
                            value={form.number}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, number: v }))
                            }
                            required
                            autoFocus
                            maxLength={15}
                            error={errors.number}
                        />
                        <Field
                            label="SOA Date"
                            type="date"
                            value={form.soa_date}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, soa_date: v }))
                            }
                            required
                            maxLength={10}
                            error={errors.soa_date}
                        />
                        <Field
                            label="Cover Period"
                            value={form.cover_period}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, cover_period: v }))
                            }
                            maxLength={25}
                            error={errors.cover_period}
                        />
                        <Field
                            label="Charge Slip"
                            value={form.charge_slip}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, charge_slip: v }))
                            }
                            maxLength={5}
                            error={errors.charge_slip}
                        />
                        <Field
                            label="Total Amount"
                            type="number"
                            step="0.01"
                            value={form.total_amount}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, total_amount: v }))
                            }
                            maxLength={12}
                            error={errors.total_amount}
                        />

                        {/* Optional new attachment */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium opacity-80">
                                Replace Attachment (optional)
                            </label>
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.pdf"
                                onChange={(e) =>
                                    setEditFile(e.target.files?.[0] || null)
                                }
                                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring focus:ring-gray-200"
                            />
                            <p className="text-xs opacity-60">
                                Leave empty to keep the existing file.
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium opacity-80">
                                Status
                            </label>
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring focus:ring-gray-200"
                                value={form.status}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        status: e.target.value,
                                    }))
                                }
                            >
                                <option value="Pending">Pending</option>
                                <option value="For Review">For Review</option>
                                <option value="Approved">Approved</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                className={styles.btnDark}
                                onClick={() => {
                                    setShowEdit(false);
                                    setEditId(null);
                                    setEditFile(null);
                                }}
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
            {/* ===== Toast (alert) ===== */}
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

            {/* ===== Confirm Archive Modal ===== */}
            <ConfirmDialog
                open={confirmState.open}
                title="Archive SOA"
                message="Are you sure you want to archive this SOA record? You can restore it later from the Archives page."
                confirmText="Archive"
                cancelText="Cancel"
                variant="danger"
                onCancel={() => setConfirmState({ open: false, id: null })}
                onConfirm={() => {
                    const { id } = confirmState;
                    if (!id) return;

                    router.delete(`${resolvedDeleteBase}/${id}/archive`, {
                        onSuccess: () => {
                            dtRef.current?.ajax.reload(null, false);
                            setConfirmState({ open: false, id: null });
                            notify("success", "SOA archived successfully!");
                        },
                        onError: () => {
                            setConfirmState({ open: false, id: null });
                            notify("danger", "Failed to archive SOA.");
                        },
                    });
                }}
            />
        </>
    );
}

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
    placeholder,
    error,
    maxLength,
}) {
    const id = React.useMemo(
        () => `f_${Math.random().toString(36).slice(2)}`,
        []
    );

    // Restrict to numeric + optional single dot for type="number"
    const handleInput = (e) => {
        let val = e.target.value;
        if (type === "number") {
            val = val.replace(/[^0-9.]/g, ""); // remove letters and symbols
            const parts = val.split(".");
            if (parts.length > 2)
                val = parts[0] + "." + parts.slice(1).join(""); // only one dot
        }
        onChange(val);
    };
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-medium opacity-80">
                {label}
            </label>
            <input
                id={id}
                value={value}
                onChange={handleInput}
                type={type}
                step={step}
                required={required}
                autoFocus={autoFocus}
                placeholder={placeholder}
                maxLength={maxLength}
                className={`border rounded-lg px-3 py-2 outline-none focus:ring transition ${
                    error
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-gray-200"
                }`}
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
    );
}
