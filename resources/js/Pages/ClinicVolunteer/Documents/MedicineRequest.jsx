import { useState, useCallback, memo, useRef } from "react";
import { Link, router } from "@inertiajs/react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import styles from "../../../../css/volunteer.module.css";
import "../../../../css/print.css";

/* ================== Limits & Helpers ================== */

const buildPrintableHTML = ({
    meta,
    patient,
    partnerType,
    medicines,
    summary,
    title,
}) => {
    const rows = (
        medicines && medicines.length
            ? medicines
            : Array.from({ length: 6 }).map(() => ({
                  unitCost: "",
                  qty: "",
                  packaging: "",
                  name: "",
                  dosage: "",
                  remarks: "",
              }))
    )
        .map(
            (m) => `
    <tr>
      <td>${m.unitCost ?? ""}</td>
      <td>${m.qty ?? ""}</td>
      <td>${m.packaging ?? ""}</td>
      <td>${m.name ?? ""}</td>
      <td>${m.dosage ?? ""}</td>
      <td>${(Number(m.unitCost || 0) * Number(m.qty || 0))
          .toFixed(2)
          .replace("NaN", "")}</td>
      <td>${m.remarks ?? ""}</td>
    </tr>`
        )
        .join("");

    return `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
  .print-title{font-size:18px;font-weight:700;text-align:center;margin:0 0 6mm;}
  .print-sub{font-size:12px;color:#555;text-align:center;margin:-4mm 0 6mm;}
  .print-section{margin:6mm 0;}
  .print-section h3{font-size:13px;margin:0 0 2mm;}
  .grid{display:grid;grid-template-columns:35mm 1fr 35mm 1fr;gap:2mm 5mm;}
  .label{font-size:11px;color:#666;}
  .value{font-size:12px;border-bottom:1px solid #ddd;padding:1mm 0 .5mm;min-height:6mm;}
  table{width:100%;border-collapse:collapse;font-size:12px;}
  th,td{border:1px solid #ccc;padding:2mm;vertical-align:top;}
  thead th{background:#f2f2f2;}
  tfoot td{font-weight:600;}
  thead{display:table-header-group;} tfoot{display:table-footer-group;}
  .footer{position:fixed;bottom:10mm;left:0;right:0;text-align:center;font-size:10px;color:#666;}
</style>
</head>
<body>
  <div class="print-title">Medicine Charge Slip</div>
  <div class="print-sub">${title}</div>

  <section class="print-section">
    <h3>General Information</h3>
    <div class="grid">
      <div class="label">Date</div><div class="value">${meta.date || "—"}</div>
      <div class="label">All is Well</div><div class="value">${
          meta.all_is_well || "—"
      }</div>
      <div class="label">Partner Inst. & Branch</div><div class="value">${
          meta.partner_institution_branch || "—"
      }</div>
      <div class="label">Clinic Name</div><div class="value">${
          meta.clinic_name || "—"
      }</div>
      <div class="label">Partner Inst. Name & Branch</div><div class="value">${
          meta.partner_institution_name || "—"
      }</div>
      <div class="label">Parish Name</div><div class="value">${
          meta.parish_name || "—"
      }</div>
      <div class="label">Parish Address</div><div class="value">${
          meta.parish_address || "—"
      }</div>
      <div class="label">Partner Type</div><div class="value">${
          partnerType || "—"
      }</div>
    </div>
  </section>

  <section class="print-section">
    <h3>Patient Details</h3>
    <div class="grid">
      <div class="label">Surname</div><div class="value">${
          patient.surname || "—"
      }</div>
      <div class="label">First Name</div><div class="value">${
          patient.firstname || "—"
      }</div>
      <div class="label">Middle Initial</div><div class="value">${
          patient.mi || "—"
      }</div>
      <div class="label">Age</div><div class="value">${patient.age || "—"}</div>
      <div class="label">Address</div><div class="value" style="grid-column: span 3;">${
          patient.address || "—"
      }</div>
      <div class="label">Contact Number</div><div class="value">${
          patient.contact_number || "—"
      }</div>
      <div class="label">Government ID</div><div class="value">${
          patient.government_id || "—"
      }</div>
      <div class="label">Diagnosis</div><div class="value" style="grid-column: span 3;">${
          patient.diagnosis || "—"
      }</div>
    </div>
  </section>

  <section class="print-section">
    <h3>Medicines</h3>
    <table>
      <thead>
        <tr>
          <th style="width:18mm">Unit Cost</th>
          <th style="width:14mm">Qty</th>
          <th>Unit Packaging</th>
          <th>Name of Medicine</th>
          <th style="width:28mm">Dosage</th>
          <th style="width:22mm">Amount</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr><td colspan="5">Subtotal A</td><td colspan="2">${
            summary.subtotal_a
        }</td></tr>
        <tr><td colspan="5">Subtotal B</td><td colspan="2">${
            summary.subtotal_b
        }</td></tr>
        <tr><td colspan="5">Grand Total</td><td colspan="2">${
            summary.grand_total
        }</td></tr>
        <tr><td colspan="7">Amount in Words: ${
            summary.total_amount_words
        }</td></tr>
      </tfoot>
    </table>
  </section>

  <div class="footer">Generated by Medicine Request</div>
</body>
</html>`;
};

const printHTML = (html, filenameHint = document.title) => {
    const prev = document.title;
    document.title = filenameHint;
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.srcdoc = html;
    document.body.appendChild(iframe);
    iframe.onload = () => {
        const win = iframe.contentWindow;
        win.focus();
        win.print();
        setTimeout(() => {
            document.body.removeChild(iframe);
            document.title = prev;
        }, 1000);
    };
};

// === Print helpers (Manila date + slug) ===
const manilaDate = () =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(
        new Date()
    ); // YYYY-MM-DD

const slugify = (s) =>
    String(s || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

const baseName = (key, scope) => `${manilaDate()}-${key}-${slugify(scope)}`;

// Sensible defaults; adjust as needed
const LIMITS = {
    // META
    all_is_well: { min: 2, max: 50 },
    partner_institution_branch: { min: 2, max: 100 },
    clinic_name: { min: 2, max: 100 },
    partner_institution_name: { min: 2, max: 100 },
    parish_name: { min: 2, max: 100 },
    parish_address: { min: 10, max: 200 },

    // PATIENT
    surname: { min: 2, max: 15 },
    firstname: { min: 2, max: 20 },
    mi: { min: 1, max: 1 }, // exactly 1 char
    age: { min: 0, max: 120 }, // numeric range
    address: { min: 10, max: 200 },
    contact_number: { minDigits: 11, maxDigits: 11 }, // digits count
    diagnosis: { min: 2, max: 200 },
};

const within = (s = "", { min = 0, max = Infinity } = {}) =>
    s.length >= min && s.length <= max;

const withinDigits = (s = "", { minDigits = 0, maxDigits = Infinity } = {}) => {
    const d = (s || "").replace(/\D+/g, "");
    return d.length >= minDigits && d.length <= maxDigits;
};

const toNum = (v) => (v === "" || v == null ? 0 : parseFloat(v) || 0);
const digitsCount = (s) => (s || "").replace(/\D+/g, "").length;
const isValidDate = (s) => {
    if (!s) return false;
    const d = new Date(s);
    return !Number.isNaN(d.getTime());
};

function numberToWords(num) {
    if (num == null) return "";
    const n = Number(num) || 0;

    const ones = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
    ];
    const tens = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
    ];
    const hund = (x) => {
        let s = "";
        if (x > 99) {
            s += ones[Math.floor(x / 100)] + " Hundred ";
            x %= 100;
        }
        if (x > 19) {
            s += tens[Math.floor(x / 10)] + " ";
            x %= 10;
        }
        if (x > 0) s += ones[x] + " ";
        return s.trim();
    };

    const pesos = Math.floor(n);
    const centavos = Math.round((n - pesos) * 100);

    if (pesos === 0 && centavos === 0) return "ZERO PESOS";

    const billions = Math.floor(pesos / 1_000_000_000);
    const millions = Math.floor((pesos % 1_000_000_000) / 1_000_000);
    const thousands = Math.floor((pesos % 1_000_000) / 1000);
    const remainder = pesos % 1000;

    let words = "";
    if (billions) words += hund(billions) + " Billion ";
    if (millions) words += hund(millions) + " Million ";
    if (thousands) words += hund(thousands) + " Thousand ";
    if (remainder) words += hund(remainder);
    words = (words.trim() || "Zero") + (pesos === 1 ? " Peso" : " Pesos");

    if (centavos > 0) {
        words +=
            " and " +
            hund(centavos) +
            (centavos === 1 ? " Centavo" : " Centavos");
    }
    return words.toUpperCase();
}

/* ================== UI Primitives ================== */

const baseInput =
    "w-full h-9 rounded border bg-white px-2 text-sm focus:outline-none focus:ring-2";
const baseLabel = "block text-[13px] text-gray-600";
const card = "bg-white border rounded-lg";
const errorText = "mt-1 text-xs text-red-600";
const okRing = "focus:ring-[#2e7d32]/30 border-gray-300";
const errRing = "focus:ring-red-400 border-red-500";

const Field = ({ label, className = "", children }) => (
    <div className={className}>
        <label className={baseLabel}>{label}</label>
        <div className="mt-1">{children}</div>
    </div>
);

/* ======= Initial states for clearing ======= */
const makeInitialMeta = () => ({
    date: "",
    all_is_well: "",
    partner_institution_branch: "",
    clinic_name: "",
    partner_institution_name: "",
    parish_name: "",
    parish_address: "",
});

const makeInitialPatient = () => ({
    surname: "",
    firstname: "",
    mi: "",
    age: "",
    address: "",
    contact_number: "",
    government_id: "",
    diagnosis: "",
});

const makeInitialMedicines = () => [];

/* ================== Component ================== */

function MedicineRequest() {
    /* layout */
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [partnerType, setPartnerType] = useState("Family Partner");
    const [clearSelection, setClearSelection] = useState(false);
    /* state */
    const [patient, setPatient] = useState({
        surname: "",
        firstname: "",
        mi: "",
        age: "",
        address: "",
        contact_number: "",
        government_id: "",
        diagnosis: "",
    });

    const [meta, setMeta] = useState({
        date: "",
        all_is_well: "",
        partner_institution_branch: "",
        clinic_name: "",
        partner_institution_name: "",
        parish_name: "",
        parish_address: "",
    });

    const [summary, setSummary] = useState({
        subtotal_a: "0.00",
        subtotal_b: "0.00",
        grand_total: "0.00",
        total_amount_words: "",
    });

    const [medicines, setMedicines] = useState([]);
    const [entry, setEntry] = useState({
        unitCost: "",
        qty: "",
        packaging: "",
        name: "",
        dosage: "",
        amount: "",
        remarks: "",
    });

    /* validation state */
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const firstErrorRef = useRef(null);

    /* setters */
    const setMetaField = (k) => (e) =>
        setMeta((p) => ({ ...p, [k]: e.target.value }));
    const setPatientField = (k) => (e) =>
        setPatient((p) => ({ ...p, [k]: e.target.value }));
    const setEntryField = (k) => (e) =>
        setEntry((p) => ({ ...p, [k]: e.target.value }));

    /* stopPropagation shield */
    const shield = (e) => e.stopPropagation();

    const hasSelections =
        Object.values(meta).some(Boolean) ||
        Object.values(patient).some(Boolean) ||
        medicines.length > 0;

    /* ============= Validators ============= */
    const validateField = useCallback((path, value) => {
        switch (path) {
            // META
            case "meta.date":
                if (!value) return "Date is required.";
                if (!isValidDate(value)) return "Enter a valid date.";
                return "";
            case "meta.all_is_well":
                if (!value?.trim()) return "This field is required.";
                if (!within(value.trim(), LIMITS.all_is_well))
                    return `Must be ${LIMITS.all_is_well.min}-${LIMITS.all_is_well.max} characters.`;
                return "";
            case "meta.partner_institution_branch":
                if (!value?.trim())
                    return "Partner Institution & Branch is required.";
                if (!within(value.trim(), LIMITS.partner_institution_branch))
                    return `Must be ${LIMITS.partner_institution_branch.min}-${LIMITS.partner_institution_branch.max} characters.`;
                return "";
            case "meta.clinic_name":
                if (!value?.trim()) return "Clinic Name is required.";
                if (!within(value.trim(), LIMITS.clinic_name))
                    return `Must be ${LIMITS.clinic_name.min}-${LIMITS.clinic_name.max} characters.`;
                return "";
            case "meta.partner_institution_name":
                if (!value?.trim())
                    return "Partner Institution Name & Branch is required.";
                if (!within(value.trim(), LIMITS.partner_institution_name))
                    return `Must be ${LIMITS.partner_institution_name.min}-${LIMITS.partner_institution_name.max} characters.`;
                return "";
            case "meta.parish_name":
                if (!value?.trim()) return "Parish Name is required.";
                if (!within(value.trim(), LIMITS.parish_name))
                    return `Must be ${LIMITS.parish_name.min}-${LIMITS.parish_name.max} characters.`;
                return "";
            case "meta.parish_address":
                if (!value?.trim()) return "Parish Address is required.";
                if (!within(value.trim(), LIMITS.parish_address))
                    return `Must be ${LIMITS.parish_address.min}-${LIMITS.parish_address.max} characters.`;
                return "";
            case "meta.partner_type":
                if (!value?.trim()) return "Please select a partner type.";
                return "";

            // PATIENT
            case "patient.surname":
                if (!value?.trim()) return "Surname is required.";
                if (!within(value.trim(), LIMITS.surname))
                    return `Must be ${LIMITS.surname.min}-${LIMITS.surname.max} characters.`;
                return "";
            case "patient.firstname":
                if (!value?.trim()) return "First name is required.";
                if (!within(value.trim(), LIMITS.firstname))
                    return `Must be ${LIMITS.firstname.min}-${LIMITS.firstname.max} characters.`;
                return "";
            case "patient.mi":
                if (!value) return ""; // optional
                if (!/^[A-Za-z]$/.test(value))
                    return "Middle initial must be 1 letter.";
                return "";
            case "patient.age": {
                if (value === "") return "Age is required.";
                const n = Number(value);
                if (
                    !Number.isInteger(n) ||
                    n < LIMITS.age.min ||
                    n > LIMITS.age.max
                )
                    return `Enter a valid age (${LIMITS.age.min}–${LIMITS.age.max}).`;
                return "";
            }
            case "patient.address":
                if (!value?.trim()) return "Address is required.";
                if (!within(value.trim(), LIMITS.address))
                    return `Must be ${LIMITS.address.min}-${LIMITS.address.max} characters.`;
                return "";
            case "patient.contact_number":
                if (!value?.trim()) return "Contact number is required.";
                if (!withinDigits(value, LIMITS.contact_number))
                    return `Contact number must have ${LIMITS.contact_number.minDigits}-${LIMITS.contact_number.maxDigits} digits.`;
                return "";
            case "patient.government_id":
                if (!value?.trim())
                    return "Please select a valid government ID.";
                return "";
            case "patient.diagnosis":
                if (!value?.trim()) return "Diagnosis is required.";
                if (!within(value.trim(), LIMITS.diagnosis))
                    return `Must be ${LIMITS.diagnosis.min}-${LIMITS.diagnosis.max} characters.`;
                return "";
            default:
                return "";
        }
    }, []);

    const validateAll = useCallback(() => {
        const nextErrors = {};
        // META
        [
            "date",
            "all_is_well",
            "partner_institution_branch",
            "clinic_name",
            "partner_institution_name",
            "parish_name",
            "parish_address",
        ].forEach((k) => {
            const key = `meta.${k}`;
            const msg = validateField(key, meta[k]);
            if (msg) nextErrors[key] = msg;
        });
        const ptMsg = validateField("meta.partner_type", partnerType);
        if (ptMsg) nextErrors["meta.partner_type"] = ptMsg;

        // PATIENT
        Object.entries(patient).forEach(([k, v]) => {
            const key = `patient.${k}`;
            const msg = validateField(key, v);
            if (msg) nextErrors[key] = msg;
        });

        setErrors(nextErrors);
        return nextErrors;
    }, [validateField, meta, partnerType, patient]);

    const markTouched = (path) => setTouched((t) => ({ ...t, [path]: true }));

    const onBlurValidate = (path, value) => {
        markTouched(path);
        const msg = validateField(path, value);
        setErrors((e) => {
            const copy = { ...e };
            if (msg) copy[path] = msg;
            else delete copy[path];
            return copy;
        });
    };

    /* ============= Totals & Actions ============= */

    const recalcTotals = useCallback((items) => {
        const subtotalA = items.reduce(
            (sum, m) => sum + (toNum(m.amount) || 0),
            0
        );
        const subtotalB = 0;
        const grand = subtotalA + subtotalB;
        setSummary({
            subtotal_a: subtotalA.toFixed(2),
            subtotal_b: subtotalB.toFixed(2),
            grand_total: grand.toFixed(2),
            total_amount_words: numberToWords(grand),
        });
    }, []);

    const addMedicine = useCallback(() => {
        if (!entry.name) return;
        const amount = toNum(entry.unitCost) * toNum(entry.qty);
        const item = { ...entry, amount: amount.toFixed(2) };
        setMedicines((prev) => {
            const next = [...prev, item];
            recalcTotals(next);
            return next;
        });
        setEntry({
            unitCost: "",
            qty: "",
            packaging: "",
            name: "",
            dosage: "",
            amount: "",
            remarks: "",
        });
    }, [entry, recalcTotals]);

    const deleteMedicine = useCallback(
        (index) => {
            setMedicines((prev) => {
                const next = prev.filter((_, i) => i !== index);
                recalcTotals(next);
                return next;
            });
        },
        [recalcTotals]
    );

    const scrollToFirstError = (errs) => {
        const firstKey = Object.keys(errs)[0];
        if (!firstKey) return;
        const el = document.getElementById(firstKey);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const handlePrint = useCallback(() => {
        const scope =
            `${patient.surname || "patient"}_${
                patient.firstname || ""
            }`.trim() || "request";
        const filename = `${manilaDate()}-medicine-request-${slugify(scope)}`;
        const html = buildPrintableHTML({
            meta,
            patient,
            partnerType,
            medicines,
            summary,
            title: filename,
        });
        printHTML(html, filename);
    }, [meta, patient, partnerType, medicines, summary]);

    const clearAllSelections = useCallback(() => {
        // Reset all states to default
        setMeta(makeInitialMeta());
        setPatient(makeInitialPatient());
        setMedicines(makeInitialMedicines());
        setEntry({
            unitCost: "",
            qty: "",
            packaging: "",
            name: "",
            dosage: "",
            amount: "",
            remarks: "",
        });

        setSummary({
            subtotal_a: "0.00",
            subtotal_b: "0.00",
            grand_total: "0.00",
            total_amount_words: "",
        });

        // Clear validation states
        setErrors({});
        setTouched({});
        setClearSelection((v) => !v);
    }, []);

    const handleSave = useCallback(() => {
        const errs = validateAll();

        if (Object.keys(errs).length > 0) {
            const allTouched = Object.keys(errs).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {});
            setTouched((t) => ({ ...t, ...allTouched }));
            scrollToFirstError(errs);
            return;
        }

        router.post(
            "/volunteer/medicine-requests",
            {
                ...meta,
                partner_type: partnerType,
                ...patient,
                age: parseInt(patient.age || "0", 10) || 0,
                ...summary,
                items: medicines,
            },
            {
                onSuccess: () => alert("Medicine request saved successfully!"),
                onError: (serverErrors) => {
                    const mapped = {};
                    Object.entries(serverErrors || {}).forEach(([k, v]) => {
                        mapped[k] = Array.isArray(v) ? v[0] : v;
                    });
                    setErrors((e) => ({ ...e, ...mapped }));
                    scrollToFirstError(mapped);
                },
            }
        );
    }, [validateAll, meta, partnerType, patient, summary, medicines]);

    /* classes & error helpers */
    const cls = (path) =>
        `${baseInput} ${errors[path] && touched[path] ? errRing : okRing}`;
    const err = (path) =>
        errors[path] && touched[path] ? (
            <div className={errorText}>{errors[path]}</div>
        ) : null;

    return (
        <>
            <Navbar />
            <div
                className={`${styles.shell} ${
                    sidebarOpen ? styles.shellOpen : styles.shellClosed
                }`}
            >
                <Sidebar active="charge-slip" onToggle={setSidebarOpen} />

                <main className={styles.main}>
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            href="/volunteer/patients"
                            as="button"
                            type="button"
                            className="px-3 py-1.5 border rounded bg-white hover:bg-gray-50 text-sm"
                        >
                            ← Return
                        </Link>
                        <h2 className="text-2xl font-semibold mt-4">
                            Medicine Charge Slip
                        </h2>
                        <div className="flex items-center gap-3">
                            <button className="h-9 px-3 rounded border bg-white text-sm hover:bg-gray-50">
                                Edit
                            </button>
                            <button
                                className="h-9 px-3 rounded border bg-white text-sm hover:bg-gray-50"
                                onClick={handlePrint}
                            >
                                Print
                            </button>
                        </div>
                    </div>

                    <div className="text-right text-[12px] text-gray-500 mb-6">
                        Ref Control No.: --
                    </div>

                    {/* Upload card (no validation for photos/docs) */}
                    <div className="mt-4">
                        <div className={`${card} p-6`}>
                            <div className="border rounded-lg h-40 grid place-items-center">
                                <div className="text-center">
                                    <button className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border bg-gray-100 hover:bg-gray-200 text-sm">
                                        Upload Document
                                    </button>
                                    <p className="text-[13px] text-gray-500 mt-2">
                                        Upload your chargeslip here
                                    </p>
                                </div>
                            </div>
                            <p className="text-[12px] text-gray-500 mt-2">
                                Kindly double check if all the fields are
                                correct
                            </p>
                        </div>
                    </div>

                    {/* META */}
                    <section className={`${card} p-5 mb-6`}>
                        <div className="grid grid-cols-12 gap-4">
                            <Field
                                label="Date"
                                className="col-span-12 sm:col-span-3 lg:col-span-2"
                            >
                                <input
                                    id="meta.date"
                                    type="date"
                                    className={cls("meta.date")}
                                    value={meta.date}
                                    onInput={shield}
                                    onChange={setMetaField("date")}
                                    onBlur={() =>
                                        onBlurValidate("meta.date", meta.date)
                                    }
                                    aria-invalid={
                                        !!(
                                            errors["meta.date"] &&
                                            touched["meta.date"]
                                        )
                                    }
                                />
                                {err("meta.date")}
                            </Field>

                            <Field
                                label="All is Well:"
                                className="col-span-12 sm:col-span-3 lg:col-span-2"
                            >
                                <input
                                    id="meta.all_is_well"
                                    className={cls("meta.all_is_well")}
                                    value={meta.all_is_well}
                                    onInput={shield}
                                    onChange={setMetaField("all_is_well")}
                                    onBlur={() =>
                                        onBlurValidate(
                                            "meta.all_is_well",
                                            meta.all_is_well
                                        )
                                    }
                                    maxLength={LIMITS.all_is_well.max}
                                />
                                {err("meta.all_is_well")}
                            </Field>

                            <Field
                                label="Partner Institution & Branch"
                                className="col-span-12 sm:col-span-6 lg:col-span-4"
                            >
                                <input
                                    id="meta.partner_institution_branch"
                                    className={cls(
                                        "meta.partner_institution_branch"
                                    )}
                                    value={meta.partner_institution_branch}
                                    onInput={shield}
                                    onChange={setMetaField(
                                        "partner_institution_branch"
                                    )}
                                    onBlur={() =>
                                        onBlurValidate(
                                            "meta.partner_institution_branch",
                                            meta.partner_institution_branch
                                        )
                                    }
                                    maxLength={
                                        LIMITS.partner_institution_branch.max
                                    }
                                />
                                {err("meta.partner_institution_branch")}
                            </Field>

                            <Field
                                label="Clinic Name"
                                className="col-span-12 sm:col-span-6 lg:col-span-4"
                            >
                                <input
                                    id="meta.clinic_name"
                                    className={cls("meta.clinic_name")}
                                    value={meta.clinic_name}
                                    onInput={shield}
                                    onChange={setMetaField("clinic_name")}
                                    onBlur={() =>
                                        onBlurValidate(
                                            "meta.clinic_name",
                                            meta.clinic_name
                                        )
                                    }
                                    maxLength={LIMITS.clinic_name.max}
                                />
                                {err("meta.clinic_name")}
                            </Field>

                            <Field
                                label="Partner Institution Name & Branch"
                                className="col-span-12 sm:col-span-6 lg:col-span-8"
                            >
                                <input
                                    id="meta.partner_institution_name"
                                    className={cls(
                                        "meta.partner_institution_name"
                                    )}
                                    value={meta.partner_institution_name}
                                    onInput={shield}
                                    onChange={setMetaField(
                                        "partner_institution_name"
                                    )}
                                    onBlur={() =>
                                        onBlurValidate(
                                            "meta.partner_institution_name",
                                            meta.partner_institution_name
                                        )
                                    }
                                    maxLength={
                                        LIMITS.partner_institution_name.max
                                    }
                                />
                                {err("meta.partner_institution_name")}
                            </Field>

                            <Field
                                label="Parish Name"
                                className="col-span-12 sm:col-span-6 lg:col-span-4"
                            >
                                <input
                                    id="meta.parish_name"
                                    className={cls("meta.parish_name")}
                                    value={meta.parish_name}
                                    onInput={shield}
                                    onChange={setMetaField("parish_name")}
                                    onBlur={() =>
                                        onBlurValidate(
                                            "meta.parish_name",
                                            meta.parish_name
                                        )
                                    }
                                    maxLength={LIMITS.parish_name.max}
                                />
                                {err("meta.parish_name")}
                            </Field>

                            <Field
                                label="Parish Address"
                                className="col-span-12 sm:col-span-6 lg:col-span-5"
                            >
                                <input
                                    id="meta.parish_address"
                                    className={cls("meta.parish_address")}
                                    value={meta.parish_address}
                                    onInput={shield}
                                    onChange={setMetaField("parish_address")}
                                    onBlur={() =>
                                        onBlurValidate(
                                            "meta.parish_address",
                                            meta.parish_address
                                        )
                                    }
                                    maxLength={LIMITS.parish_address.max}
                                />
                                {err("meta.parish_address")}
                            </Field>

                            <Field
                                label="Family Partner/Non Family Partner"
                                className="col-span-12 sm:col-span-6 lg:col-span-3"
                            >
                                <select
                                    id="meta.partner_type"
                                    className={cls("meta.partner_type")}
                                    value={partnerType}
                                    onInput={shield}
                                    onChange={(e) =>
                                        setPartnerType(e.target.value)
                                    }
                                    onBlur={() =>
                                        onBlurValidate(
                                            "meta.partner_type",
                                            partnerType
                                        )
                                    }
                                >
                                    <option value="Family Partner">
                                        Family Partner
                                    </option>
                                    <option value="Non-Family Partner">
                                        Non-Family Partner
                                    </option>
                                </select>
                                {err("meta.partner_type")}
                            </Field>
                        </div>
                    </section>

                    {/* PATIENT DETAILS */}
                    <div className={`${card} p-5 mb-6`}>
                        <section>
                            <h3 className="font-semibold mb-3">
                                Patient Details
                            </h3>
                            <div className="grid grid-cols-12 gap-4">
                                <Field
                                    label="Surname"
                                    className="col-span-12 sm:col-span-3"
                                >
                                    <input
                                        id="patient.surname"
                                        className={cls("patient.surname")}
                                        value={patient.surname}
                                        onInput={shield}
                                        onChange={setPatientField("surname")}
                                        onBlur={() =>
                                            onBlurValidate(
                                                "patient.surname",
                                                patient.surname
                                            )
                                        }
                                        maxLength={LIMITS.surname.max}
                                    />
                                    {err("patient.surname")}
                                </Field>

                                <Field
                                    label="First Name"
                                    className="col-span-12 sm:col-span-3"
                                >
                                    <input
                                        id="patient.firstname"
                                        className={cls("patient.firstname")}
                                        value={patient.firstname}
                                        onInput={shield}
                                        onChange={setPatientField("firstname")}
                                        onBlur={() =>
                                            onBlurValidate(
                                                "patient.firstname",
                                                patient.firstname
                                            )
                                        }
                                        maxLength={LIMITS.firstname.max}
                                    />
                                    {err("patient.firstname")}
                                </Field>

                                <Field
                                    label="Middle Initial"
                                    className="col-span-6 sm:col-span-2"
                                >
                                    <input
                                        id="patient.mi"
                                        className={cls("patient.mi")}
                                        value={patient.mi}
                                        onInput={shield}
                                        onChange={setPatientField("mi")}
                                        onBlur={() =>
                                            onBlurValidate(
                                                "patient.mi",
                                                patient.mi
                                            )
                                        }
                                        maxLength={1}
                                    />
                                    {err("patient.mi")}
                                </Field>

                                <Field
                                    label="Age"
                                    className="col-span-6 sm:col-span-2"
                                >
                                    <input
                                        id="patient.age"
                                        type="number"
                                        inputMode="numeric"
                                        className={cls("patient.age")}
                                        value={patient.age}
                                        onChange={(e) => {
                                            let val = e.target.value.replace(
                                                /\D+/g,
                                                ""
                                            ); // keep only digits
                                            if (val) {
                                                const num = parseInt(val, 10);
                                                if (num > 120) {
                                                    val = "120"; // ✅ clamp to max age
                                                } else {
                                                    val = String(num);
                                                }
                                            }
                                            setPatient((p) => ({
                                                ...p,
                                                age: val,
                                            }));
                                        }}
                                        onBlur={() =>
                                            onBlurValidate(
                                                "patient.age",
                                                patient.age
                                            )
                                        }
                                        min={0}
                                        max={120} // browser validation too
                                    />
                                    {err("patient.age")}
                                </Field>

                                <Field
                                    label="Address"
                                    className="col-span-12 sm:col-span-6"
                                >
                                    <input
                                        id="patient.address"
                                        className={cls("patient.address")}
                                        value={patient.address}
                                        onInput={shield}
                                        onChange={setPatientField("address")}
                                        onBlur={() =>
                                            onBlurValidate(
                                                "patient.address",
                                                patient.address
                                            )
                                        }
                                        maxLength={LIMITS.address.max}
                                    />
                                    {err("patient.address")}
                                </Field>

                                <Field
                                    label="Contact Number"
                                    className="col-span-12 sm:col-span-6"
                                >
                                    <input
                                        id="patient.contact_number"
                                        className={cls(
                                            "patient.contact_number"
                                        )}
                                        value={patient.contact_number}
                                        // remove all non-digits and cut to 11
                                        onChange={(e) => {
                                            const digits = e.target.value
                                                .replace(/\D+/g, "")
                                                .slice(0, 11);
                                            setPatient((p) => ({
                                                ...p,
                                                contact_number: digits,
                                            }));
                                        }}
                                        onBlur={() =>
                                            onBlurValidate(
                                                "patient.contact_number",
                                                patient.contact_number
                                            )
                                        }
                                        placeholder="+63 912 345 6789"
                                        inputMode="numeric" // mobile keyboards show digits
                                        maxLength={11} // UI cap, validation enforces 11
                                    />
                                    {err("patient.contact_number")}
                                </Field>

                                <Field
                                    label="Valid Government ID"
                                    className="col-span-12 sm:col-span-6"
                                >
                                    <select
                                        id="patient.government_id"
                                        className={cls("patient.government_id")}
                                        value={patient.government_id}
                                        onInput={shield}
                                        onChange={setPatientField(
                                            "government_id"
                                        )}
                                        onBlur={() =>
                                            onBlurValidate(
                                                "patient.government_id",
                                                patient.government_id
                                            )
                                        }
                                    >
                                        <option value="">—</option>
                                        <option value="PhilHealth">
                                            PhilHealth
                                        </option>
                                        <option value="SSS">SSS</option>
                                        <option value="UMID">UMID</option>
                                        <option value="Passport">
                                            Passport
                                        </option>
                                    </select>
                                    {err("patient.government_id")}
                                </Field>

                                <Field
                                    label="Patient Diagnosis"
                                    className="col-span-12 sm:col-span-6"
                                >
                                    <input
                                        id="patient.diagnosis"
                                        className={cls("patient.diagnosis")}
                                        value={patient.diagnosis}
                                        onInput={shield}
                                        onChange={setPatientField("diagnosis")}
                                        onBlur={() =>
                                            onBlurValidate(
                                                "patient.diagnosis",
                                                patient.diagnosis
                                            )
                                        }
                                        maxLength={LIMITS.diagnosis.max}
                                    />
                                    {err("patient.diagnosis")}
                                </Field>
                            </div>
                        </section>

                        {/* <aside className={`${card} p-6`}>
                            <div className="border rounded-lg h-40 grid place-items-center">
                                <div className="text-center">
                                    <button className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border bg-gray-100 hover:bg-gray-200 text-sm">
                                        Upload Document
                                    </button>
                                    <p className="text-[13px] text-gray-500 mt-2">
                                        Upload government ID
                                    </p>
                                </div>
                            </div>
                            <p className="text-[12px] text-gray-500 mt-2">
                                Kindly double check if all the fields are
                                correct
                            </p>
                        </aside> */}
                    </div>

                    {/* Medicine Table */}
                    <section className={`${card} p-5 mt-6`}>
                        <h3 className="font-semibold mb-3">Medicine Table</h3>

                        <div className="flex flex-wrap items-end gap-2 mb-3">
                            <Field label="Unit Cost" className="w-24">
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    className={`${baseInput} ${okRing}`}
                                    value={entry.unitCost}
                                    onInput={shield}
                                    onChange={setEntryField("unitCost")}
                                />
                            </Field>

                            <Field label="Qty." className="w-16">
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    className={`${baseInput} ${okRing}`}
                                    value={entry.qty}
                                    onInput={shield}
                                    onChange={setEntryField("qty")}
                                />
                            </Field>

                            <Field
                                label="Unit Packaging"
                                className="min-w-[160px] flex-1"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={entry.packaging}
                                    onInput={shield}
                                    onChange={setEntryField("packaging")}
                                />
                            </Field>

                            <Field
                                label="Name of Medicine"
                                className="min-w-[220px] flex-1"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={entry.name}
                                    onInput={shield}
                                    onChange={setEntryField("name")}
                                />
                            </Field>

                            <Field
                                label="Dosage Strength"
                                className="min-w-[160px]"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={entry.dosage}
                                    onInput={shield}
                                    onChange={setEntryField("dosage")}
                                />
                            </Field>

                            <Field label="Amount" className="w-28">
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    className={`${baseInput} ${okRing}`}
                                    value={(
                                        toNum(entry.unitCost) * toNum(entry.qty)
                                    ).toFixed(2)}
                                    readOnly
                                />
                            </Field>

                            <Field
                                label="Remarks"
                                className="min-w-[160px] flex-1"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={entry.remarks}
                                    onInput={shield}
                                    onChange={setEntryField("remarks")}
                                />
                            </Field>

                            <button
                                onClick={addMedicine}
                                className="h-9 px-4 rounded bg-[#2e7d32] text-white text-sm font-medium hover:bg-[#276b2b]"
                            >
                                Add
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {[
                                            "Unit Cost",
                                            "Qty.",
                                            "Unit Packaging",
                                            "Name of Medicine",
                                            "Dosage Strength",
                                            "Amount",
                                            "Remarks",
                                            "Action",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="border px-2 py-2 text-left font-medium"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicines.length === 0
                                        ? Array.from({ length: 5 }).map(
                                              (_, i) => (
                                                  <tr key={i}>
                                                      {Array.from({
                                                          length: 8,
                                                      }).map((__, j) => (
                                                          <td
                                                              key={j}
                                                              className="border px-2 py-6"
                                                          >
                                                              &nbsp;
                                                          </td>
                                                      ))}
                                                  </tr>
                                              )
                                          )
                                        : medicines.map((m, i) => (
                                              <tr key={`${m.name}-${i}`}>
                                                  <td className="border px-2 py-2">
                                                      {m.unitCost}
                                                  </td>
                                                  <td className="border px-2 py-2">
                                                      {m.qty}
                                                  </td>
                                                  <td className="border px-2 py-2">
                                                      {m.packaging}
                                                  </td>
                                                  <td className="border px-2 py-2">
                                                      {m.name}
                                                  </td>
                                                  <td className="border px-2 py-2">
                                                      {m.dosage}
                                                  </td>
                                                  <td className="border px-2 py-2">
                                                      {(
                                                          toNum(m.unitCost) *
                                                          toNum(m.qty)
                                                      ).toFixed(2)}
                                                  </td>
                                                  <td className="border px-2 py-2">
                                                      {m.remarks}
                                                  </td>
                                                  <td className="border px-2 py-2">
                                                      <button
                                                          onClick={() =>
                                                              deleteMedicine(i)
                                                          }
                                                          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                                      >
                                                          Delete
                                                      </button>
                                                  </td>
                                              </tr>
                                          ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Summary */}
                    <section className={`${card} p-5 mt-6`}>
                        <h3 className="font-semibold mb-3">Summary</h3>
                        <div className="grid grid-cols-12 gap-4">
                            <Field
                                label="Subtotal A (₱)"
                                className="col-span-12 sm:col-span-6 lg:col-span-4"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={summary.subtotal_a}
                                    readOnly
                                />
                            </Field>
                            <Field
                                label="Subtotal B (₱)"
                                className="col-span-12 sm:col-span-6 lg:col-span-4"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={summary.subtotal_b}
                                    readOnly
                                />
                            </Field>
                            <Field
                                label="Grand Total Amount (₱)"
                                className="col-span-12 sm:col-span-6 lg:col-span-4"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={summary.grand_total}
                                    readOnly
                                />
                            </Field>
                            <Field
                                label="Total Amount in Words"
                                className="col-span-12"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={summary.total_amount_words}
                                    readOnly
                                />
                            </Field>
                        </div>
                    </section>

                    {/* Bottom actions */}
                    <div className="fixed bottom-4 right-6 flex gap-3 ">
                        <button
                            type="button"
                            onClick={clearAllSelections}
                            className={`px-4 h-9 rounded text-sm ${
                                hasSelections
                                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                            disabled={!hasSelections}
                        >
                            Clear Selection
                        </button>

                        <button
                            onClick={handleSave}
                            className="px-4 h-9 bg-[#2e7d32] text-white rounded hover:bg-[#276b2b]"
                        >
                            Save Form
                        </button>
                    </div>

                    {/* PRINT LAYOUT */}
                    <div id="print-area" className="print-only">
                        <div className="print-title">Medicine Charge Slip</div>
                        <div className="print-sub">
                            {baseName(
                                "medicine-request",
                                `${patient.surname || "patient"}_${
                                    patient.firstname || ""
                                }`
                            )}
                        </div>

                        {/* Meta */}
                        <section className="print-section">
                            <h3>General Information</h3>
                            <div className="print-grid">
                                <div className="print-label">Date</div>
                                <div className="print-value">
                                    {meta.date || "—"}
                                </div>

                                <div className="print-label">All is Well</div>
                                <div className="print-value">
                                    {meta.all_is_well || "—"}
                                </div>

                                <div className="print-label">
                                    Partner Inst. & Branch
                                </div>
                                <div className="print-value">
                                    {meta.partner_institution_branch || "—"}
                                </div>

                                <div className="print-label">Clinic Name</div>
                                <div className="print-value">
                                    {meta.clinic_name || "—"}
                                </div>

                                <div className="print-label">
                                    Partner Inst. Name & Branch
                                </div>
                                <div className="print-value">
                                    {meta.partner_institution_name || "—"}
                                </div>

                                <div className="print-label">Parish Name</div>
                                <div className="print-value">
                                    {meta.parish_name || "—"}
                                </div>

                                <div className="print-label">
                                    Parish Address
                                </div>
                                <div className="print-value">
                                    {meta.parish_address || "—"}
                                </div>

                                <div className="print-label">Partner Type</div>
                                <div className="print-value">
                                    {partnerType || "—"}
                                </div>
                            </div>
                        </section>

                        {/* Patient */}
                        <section className="print-section">
                            <h3>Patient Details</h3>
                            <div className="print-grid">
                                <div className="print-label">Surname</div>
                                <div className="print-value">
                                    {patient.surname || "—"}
                                </div>

                                <div className="print-label">First Name</div>
                                <div className="print-value">
                                    {patient.firstname || "—"}
                                </div>

                                <div className="print-label">
                                    Middle Initial
                                </div>
                                <div className="print-value">
                                    {patient.mi || "—"}
                                </div>

                                <div className="print-label">Age</div>
                                <div className="print-value">
                                    {patient.age || "—"}
                                </div>

                                <div className="print-label">Address</div>
                                <div
                                    className="print-value"
                                    style={{ gridColumn: "span 3" }}
                                >
                                    {patient.address || "—"}
                                </div>

                                <div className="print-label">
                                    Contact Number
                                </div>
                                <div className="print-value">
                                    {patient.contact_number || "—"}
                                </div>

                                <div className="print-label">Government ID</div>
                                <div className="print-value">
                                    {patient.government_id || "—"}
                                </div>

                                <div className="print-label">Diagnosis</div>
                                <div
                                    className="print-value"
                                    style={{ gridColumn: "span 3" }}
                                >
                                    {patient.diagnosis || "—"}
                                </div>
                            </div>
                        </section>

                        {/* Medicines */}
                        <section className="print-section">
                            <h3>Medicines</h3>
                            <table className="print-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "18mm" }}>
                                            Unit Cost
                                        </th>
                                        <th style={{ width: "14mm" }}>Qty</th>
                                        <th>Unit Packaging</th>
                                        <th>Name of Medicine</th>
                                        <th style={{ width: "28mm" }}>
                                            Dosage
                                        </th>
                                        <th style={{ width: "22mm" }}>
                                            Amount
                                        </th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicines.length === 0
                                        ? Array.from({ length: 6 }).map(
                                              (_, i) => (
                                                  <tr key={i}>
                                                      <td>&nbsp;</td>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                  </tr>
                                              )
                                          )
                                        : medicines.map((m, i) => (
                                              <tr key={`${m.name}-${i}`}>
                                                  <td>{m.unitCost}</td>
                                                  <td>{m.qty}</td>
                                                  <td>{m.packaging}</td>
                                                  <td>{m.name}</td>
                                                  <td>{m.dosage}</td>
                                                  <td>
                                                      {(
                                                          Number(
                                                              m.unitCost || 0
                                                          ) * Number(m.qty || 0)
                                                      ).toFixed(2)}
                                                  </td>
                                                  <td>{m.remarks}</td>
                                              </tr>
                                          ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={5}>Subtotal A</td>
                                        <td colSpan={2}>
                                            {summary.subtotal_a}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5}>Subtotal B</td>
                                        <td colSpan={2}>
                                            {summary.subtotal_b}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5}>Grand Total</td>
                                        <td colSpan={2}>
                                            {summary.grand_total}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={7}>
                                            Amount in Words:{" "}
                                            {summary.total_amount_words}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </section>

                        {/* Optional footer */}
                        <div className="print-footer">
                            Generated by Medicine Request
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default memo(MedicineRequest);
