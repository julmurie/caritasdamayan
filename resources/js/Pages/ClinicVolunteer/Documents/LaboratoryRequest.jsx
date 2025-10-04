import { useMemo, useState, useCallback, useRef, memo } from "react";
import { Link, router } from "@inertiajs/react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import styles from "../../../../css/volunteer.module.css";

/* ================== Primitives / Tokens (match MedicineRequest) ================== */
const card = "bg-white border rounded-lg";
const baseLabel = "block text-[13px] text-gray-600";
const baseInput =
    "w-full h-9 rounded border bg-white px-2 text-sm focus:outline-none focus:ring-2";
const okRing = "focus:ring-[#2e7d32]/30 border-gray-300";

const Field = ({ label, className = "", children }) => (
    <div className={className}>
        <label className={baseLabel}>{label}</label>
        <div className="mt-1">{children}</div>
    </div>
);

/* ================== Helpers ================== */
const toNum = (v) => (v === "" || v == null ? 0 : parseFloat(v) || 0);

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
    if (centavos > 0)
        words +=
            " and " +
            hund(centavos) +
            (centavos === 1 ? " Centavo" : " Centavos");
    return words.toUpperCase();
}

/* ================== Data ================== */
const HEMATOLOGY = [
    "URINALYSIS",
    "FBS",
    "URIC ACID",
    "SODIUM",
    "LIPID PROFILE",
    "FECALYSIS",
    "BUN",
    "ALT/SGPT",
    "POTASSIUM",
    "FT3",
    "CBC",
    "CREATININE",
    "AST/SGOT",
    "TSH",
    "FT4",
    "HbA1C",
    "ALBUMIN",
    "PLATELET COUNT",
    "CALCIUM",
    "CHLORIDE",
];

const RADIOLOGY = [
    { key: "CT SCAN", specific: true },
    { key: "MRI", specific: true },
    { key: "XRAY", specific: true },
    { key: "ECG", specific: true },
    { key: "ULTRASOUND", specific: true },
    { key: "2D ECHO", specific: true },
];

/* ================== Component ================== */
function LaboratoryChargeSlip() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    /* Top meta */
    const [meta, setMeta] = useState({
        date: "",
        clinic_print_name: "",
        issuing_program: "",
        partner_institution_branch: "",
        parish_name: "",
        parish_address: "",
        partner_type: "Family Partner", // FP vs NFP
        fp_booklet_no: "",
        valid_govt_id_presented: "",
        ref_control: "",
    });

    /* Patient */
    const [patient, setPatient] = useState({
        surname: "",
        firstname: "",
        mi: "",
        age: "",
        sex: "",
        contact_no: "",
        diagnosis: "",
        address: "",
        senior_citizen: false,
        pwd: false,
    });

    /* Tables */
    const [hema, setHema] = useState(
        Object.fromEntries(
            HEMATOLOGY.map((k) => [k, { checked: false, price: "" }])
        )
    );
    const [radio, setRadio] = useState(
        Object.fromEntries(
            RADIOLOGY.map((r) => [
                r.key,
                { checked: false, specific: "", price: "" },
            ])
        )
    );
    const [others, setOthers] = useState("");

    const setMetaField = (k) => (e) =>
        setMeta((p) => ({ ...p, [k]: e.target.value }));
    const setPatientField = (k) => (e) => {
        const v =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setPatient((p) => ({ ...p, [k]: v }));
    };

    const toggleHema = (k, field) => (e) =>
        setHema((p) => ({
            ...p,
            [k]: {
                ...p[k],
                [field]:
                    e.target.type === "checkbox"
                        ? e.target.checked
                        : e.target.value,
            },
        }));

    const toggleRadio = (k, field) => (e) =>
        setRadio((p) => ({
            ...p,
            [k]: {
                ...p[k],
                [field]:
                    e.target.type === "checkbox"
                        ? e.target.checked
                        : e.target.value,
            },
        }));

    /* Totals */
    const subtotalHema = useMemo(
        () =>
            Object.values(hema).reduce(
                (sum, row) => sum + (row.checked ? toNum(row.price) : 0),
                0
            ),
        [hema]
    );
    const subtotalRadio = useMemo(
        () =>
            Object.values(radio).reduce(
                (sum, row) => sum + (row.checked ? toNum(row.price) : 0),
                0
            ),
        [radio]
    );
    const grandTotal = subtotalHema + subtotalRadio;
    const amountWords = useMemo(() => numberToWords(grandTotal), [grandTotal]);

    /* Save (wire your endpoint later) */
    const handleSave = useCallback(() => {
        const payload = {
            meta,
            patient,
            hema: Object.entries(hema)
                .filter(([, v]) => v.checked)
                .map(([name, v]) => ({ name, price: toNum(v.price) })),
            radiology: Object.entries(radio)
                .filter(([, v]) => v.checked)
                .map(([name, v]) => ({
                    name,
                    specific: v.specific,
                    price: toNum(v.price),
                })),
            others,
            totals: {
                subtotal_hema: subtotalHema, // ← map camelCase var to snake_case key
                subtotal_radiology: subtotalRadio,
                grand_total: grandTotal,
                amount_in_words: amountWords,
            },
        };

        // Example post (adjust route as needed)
        router.post("/volunteer/laboratory-requests", payload, {
            onSuccess: () => alert("Laboratory Chargeslip saved!"),
            onError: (e) => alert(e?.message || "Failed to save"),
        });
    }, [
        meta,
        patient,
        hema,
        radio,
        others,
        subtotalHema,
        subtotalRadio,
        grandTotal,
        amountWords,
    ]);

    return (
        <>
            <Navbar />
            <div
                className={`${styles.shell} ${
                    sidebarOpen ? styles.shellOpen : styles.shellClosed
                }`}
            >
                <Sidebar onToggle={setSidebarOpen} active="charge-slip" />

                <main className={styles.main}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            href="/volunteer/patients"
                            as="button"
                            type="button"
                            className="px-3 py-1.5 border rounded bg-white hover:bg-gray-50 text-sm"
                        >
                            ← Return
                        </Link>
                        <h2 className="text-2xl font-semibold">
                            Laboratory Chargeslip
                        </h2>
                        <div className="flex items-center gap-3">
                            <button className="h-9 px-3 rounded border bg-white text-sm hover:bg-gray-50">
                                Edit
                            </button>
                            <button className="h-9 px-3 rounded border bg-white text-sm hover:bg-gray-50">
                                Print
                            </button>
                        </div>
                    </div>

                    <div className="text-right text-[12px] text-gray-500 mb-4">
                        Ref Control No.: {meta.ref_control || "—"}
                    </div>

                    {/* Upload area */}
                    <div className="mb-6">
                        <div className={`${card} p-6`}>
                            <div className="border rounded-lg h-40 grid place-items-center">
                                <div className="text-center">
                                    <button className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border bg-gray-100 hover:bg-gray-200 text-sm">
                                        Upload Document
                                    </button>
                                    <p className="text-[13px] text-gray-500 mt-2">
                                        Upload the scanned chargeslip, if
                                        available.
                                    </p>
                                </div>
                            </div>
                            <p className="text-[12px] text-gray-500 mt-2">
                                Please double-check all fields before saving.
                            </p>
                        </div>
                    </div>

                    {/* Meta block */}
                    <section className={`${card} p-5 mb-6`}>
                        <div className="grid grid-cols-12 gap-4">
                            <Field
                                label="Date"
                                className="col-span-12 sm:col-span-3 lg:col-span-2"
                            >
                                <input
                                    type="date"
                                    className={`${baseInput} ${okRing}`}
                                    value={meta.date}
                                    onChange={setMetaField("date")}
                                />
                            </Field>

                            <Field
                                label="All Is Well Clinic (Print Name)"
                                className="col-span-12 sm:col-span-5 lg:col-span-4"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={meta.clinic_print_name}
                                    onChange={setMetaField("clinic_print_name")}
                                    placeholder="e.g., ALL IS WELL CLINIC – GEN129"
                                />
                            </Field>

                            <Field
                                label="Issuing Program"
                                className="col-span-12 sm:col-span-4 lg:col-span-3"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={meta.issuing_program}
                                    onChange={setMetaField("issuing_program")}
                                    placeholder="e.g., GEN129 / CIA"
                                />
                            </Field>

                            <Field
                                label="Partner Institution & Branch"
                                className="col-span-12 lg:col-span-3"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={meta.partner_institution_branch}
                                    onChange={setMetaField(
                                        "partner_institution_branch"
                                    )}
                                />
                            </Field>

                            {/* FP / NFP + booklet + ID */}
                            <div className="col-span-12 grid grid-cols-12 gap-4">
                                <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                                    <label className={baseLabel}>
                                        Partner Type
                                    </label>
                                    <div className="mt-2 flex items-center gap-6">
                                        <label className="inline-flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                name="partner_type"
                                                checked={
                                                    meta.partner_type ===
                                                    "Family Partner"
                                                }
                                                onChange={() =>
                                                    setMeta((p) => ({
                                                        ...p,
                                                        partner_type:
                                                            "Family Partner",
                                                    }))
                                                }
                                            />
                                            FP
                                        </label>
                                        <label className="inline-flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                name="partner_type"
                                                checked={
                                                    meta.partner_type ===
                                                    "Non-Family Partner"
                                                }
                                                onChange={() =>
                                                    setMeta((p) => ({
                                                        ...p,
                                                        partner_type:
                                                            "Non-Family Partner",
                                                    }))
                                                }
                                            />
                                            NFP
                                        </label>
                                    </div>
                                </div>

                                <Field
                                    label="FP Booklet No."
                                    className="col-span-12 sm:col-span-6 lg:col-span-3"
                                >
                                    <input
                                        className={`${baseInput} ${okRing}`}
                                        value={meta.fp_booklet_no}
                                        onChange={setMetaField("fp_booklet_no")}
                                    />
                                </Field>

                                <Field
                                    label="Valid Gov’t ID Presented"
                                    className="col-span-12 sm:col-span-6 lg:col-span-3"
                                >
                                    <input
                                        className={`${baseInput} ${okRing}`}
                                        placeholder="e.g., PhilHealth / UMID / Passport"
                                        value={meta.valid_govt_id_presented}
                                        onChange={setMetaField(
                                            "valid_govt_id_presented"
                                        )}
                                    />
                                </Field>
                            </div>

                            <Field
                                label="Parish Name"
                                className="col-span-12 sm:col-span-6 lg:col-span-4"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={meta.parish_name}
                                    onChange={setMetaField("parish_name")}
                                />
                            </Field>

                            <Field
                                label="Parish Address"
                                className="col-span-12 sm:col-span-6 lg:col-span-8"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={meta.parish_address}
                                    onChange={setMetaField("parish_address")}
                                />
                            </Field>
                        </div>
                    </section>

                    {/* Patient block */}
                    <section className={`${card} p-5 mb-6`}>
                        <h3 className="font-semibold mb-3">Client Details</h3>
                        <div className="grid grid-cols-12 gap-4">
                            <Field
                                label="Surname"
                                className="col-span-12 sm:col-span-3"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={patient.surname}
                                    onChange={setPatientField("surname")}
                                />
                            </Field>
                            <Field
                                label="First Name"
                                className="col-span-12 sm:col-span-3"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={patient.firstname}
                                    onChange={setPatientField("firstname")}
                                />
                            </Field>
                            <Field
                                label="M.I."
                                className="col-span-6 sm:col-span-1"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={patient.mi}
                                    onChange={setPatientField("mi")}
                                />
                            </Field>
                            <Field
                                label="Age"
                                className="col-span-6 sm:col-span-1"
                            >
                                <input
                                    type="number"
                                    className={`${baseInput} ${okRing}`}
                                    value={patient.age}
                                    onChange={setPatientField("age")}
                                />
                            </Field>
                            <Field
                                label="Sex"
                                className="col-span-6 sm:col-span-2"
                            >
                                <select
                                    className={`${baseInput} ${okRing}`}
                                    value={patient.sex}
                                    onChange={setPatientField("sex")}
                                >
                                    <option value="">—</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </Field>
                            <Field
                                label="Contact No."
                                className="col-span-12 sm:col-span-2"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={patient.contact_no}
                                    onChange={setPatientField("contact_no")}
                                    placeholder="+63 9xx xxx xxxx"
                                />
                            </Field>
                            <Field
                                label="Client’s Diagnosis / Illness"
                                className="col-span-12"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={patient.diagnosis}
                                    onChange={setPatientField("diagnosis")}
                                />
                            </Field>

                            <div className="col-span-12 flex flex-wrap gap-6">
                                <label className="inline-flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={patient.senior_citizen}
                                        onChange={setPatientField(
                                            "senior_citizen"
                                        )}
                                    />
                                    Senior Citizen
                                </label>
                                <label className="inline-flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={patient.pwd}
                                        onChange={setPatientField("pwd")}
                                    />
                                    PWD
                                </label>
                            </div>

                            <Field
                                label="Client’s Address"
                                className="col-span-12"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={patient.address}
                                    onChange={setPatientField("address")}
                                />
                            </Field>
                        </div>
                    </section>

                    {/* Tests table */}
                    <section className={`${card} p-5`}>
                        <h3 className="font-semibold mb-3">
                            Hematology/Serology/Clinical Chemistry &amp; Other
                            Tests / Radiology &amp; Diagnostics
                        </h3>

                        <div className="grid grid-cols-12 gap-4">
                            {/* Left: Hematology */}
                            <div className="col-span-12 lg:col-span-7">
                                <div className="border rounded">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="border px-2 py-2 text-left">
                                                    Test
                                                </th>
                                                <th className="border px-2 py-2 w-36">
                                                    Price (₱)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {HEMATOLOGY.map((name) => (
                                                <tr key={name}>
                                                    <td className="border px-2 py-2">
                                                        <label className="inline-flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    hema[name]
                                                                        .checked
                                                                }
                                                                onChange={toggleHema(
                                                                    name,
                                                                    "checked"
                                                                )}
                                                            />
                                                            <span>{name}</span>
                                                        </label>
                                                    </td>
                                                    <td className="border px-2 py-2">
                                                        <input
                                                            type="number"
                                                            inputMode="decimal"
                                                            className={`${baseInput} ${okRing}`}
                                                            value={
                                                                hema[name].price
                                                            }
                                                            onChange={toggleHema(
                                                                name,
                                                                "price"
                                                            )}
                                                            placeholder="0.00"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td className="border px-2 py-2 text-right font-semibold">
                                                    SUBTOTAL
                                                </td>
                                                <td className="border px-2 py-2 font-semibold">
                                                    ₱ {subtotalHema.toFixed(2)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Right: Radiology/Diagnostic */}
                            <div className="col-span-12 lg:col-span-5">
                                <div className="border rounded">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="border px-2 py-2 text-left">
                                                    Procedure
                                                </th>
                                                <th className="border px-2 py-2 text-left">
                                                    Specific
                                                </th>
                                                <th className="border px-2 py-2 w-32">
                                                    Price (₱)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {RADIOLOGY.map(
                                                ({ key, specific }) => (
                                                    <tr key={key}>
                                                        <td className="border px-2 py-2">
                                                            <label className="inline-flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        radio[
                                                                            key
                                                                        ]
                                                                            .checked
                                                                    }
                                                                    onChange={toggleRadio(
                                                                        key,
                                                                        "checked"
                                                                    )}
                                                                />
                                                                <span>
                                                                    {key}
                                                                </span>
                                                            </label>
                                                        </td>
                                                        <td className="border px-2 py-2">
                                                            {specific ? (
                                                                <input
                                                                    className={`${baseInput} ${okRing}`}
                                                                    value={
                                                                        radio[
                                                                            key
                                                                        ]
                                                                            .specific
                                                                    }
                                                                    onChange={toggleRadio(
                                                                        key,
                                                                        "specific"
                                                                    )}
                                                                    placeholder="e.g., Chest AP, Whole Abdomen"
                                                                />
                                                            ) : (
                                                                <span className="text-gray-500">
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="border px-2 py-2">
                                                            <input
                                                                type="number"
                                                                inputMode="decimal"
                                                                className={`${baseInput} ${okRing}`}
                                                                value={
                                                                    radio[key]
                                                                        .price
                                                                }
                                                                onChange={toggleRadio(
                                                                    key,
                                                                    "price"
                                                                )}
                                                                placeholder="0.00"
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                            <tr>
                                                <td
                                                    className="border px-2 py-2 text-right font-semibold"
                                                    colSpan={2}
                                                >
                                                    SUBTOTAL
                                                </td>
                                                <td className="border px-2 py-2 font-semibold">
                                                    ₱ {subtotalRadio.toFixed(2)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Others + Grand total */}
                        <div className="mt-4 grid grid-cols-12 gap-4">
                            <Field
                                label="Others (Please specify)"
                                className="col-span-12"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={others}
                                    onChange={(e) => setOthers(e.target.value)}
                                    placeholder="e.g., special test, handling fee, etc."
                                />
                            </Field>

                            <div className="col-span-12 flex items-center justify-end gap-4">
                                <div className="text-sm font-semibold">
                                    TOTAL:
                                </div>
                                <div className="text-lg font-bold">
                                    ₱ {grandTotal.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Total in words */}
                    <section className={`${card} p-5 mt-6`}>
                        <Field label="Total Amount in Words">
                            <input
                                className={`${baseInput} ${okRing}`}
                                value={amountWords}
                                readOnly
                            />
                        </Field>
                    </section>

                    {/* Signatures / Notes (simplified but styled) */}
                    <section className={`${card} p-5 mt-6`}>
                        <p className="text-[12px] text-gray-600 mb-4">
                            NOTE: This chargeslip is valid only for one (1) week
                            after the date of issuance. Any changes/tampering
                            without authorized approval will not be accepted.
                        </p>

                        <div className="grid grid-cols-12 gap-4">
                            <Field
                                label="Prepared By (Name & Signature)"
                                className="col-span-12 sm:col-span-4"
                            >
                                <input className={`${baseInput} ${okRing}`} />
                            </Field>
                            <Field
                                label="Date Signed"
                                className="col-span-6 sm:col-span-2"
                            >
                                <input
                                    type="date"
                                    className={`${baseInput} ${okRing}`}
                                />
                            </Field>

                            <Field
                                label="Approved By (Name & Signature)"
                                className="col-span-12 sm:col-span-4"
                            >
                                <input className={`${baseInput} ${okRing}`} />
                            </Field>
                            <Field
                                label="Date Signed"
                                className="col-span-6 sm:col-span-2"
                            >
                                <input
                                    type="date"
                                    className={`${baseInput} ${okRing}`}
                                />
                            </Field>

                            <Field
                                label="Received by Client (Name & Signature)"
                                className="col-span-12 sm:col-span-4"
                            >
                                <input className={`${baseInput} ${okRing}`} />
                            </Field>
                            <Field
                                label="Date Signed"
                                className="col-span-6 sm:col-span-2"
                            >
                                <input
                                    type="date"
                                    className={`${baseInput} ${okRing}`}
                                />
                            </Field>

                            <Field
                                label="Authorized Representative (Name, Relationship & Signature)"
                                className="col-span-12 sm:col-span-6"
                            >
                                <input className={`${baseInput} ${okRing}`} />
                            </Field>
                            <Field
                                label="Date Signed"
                                className="col-span-6 sm:col-span-2"
                            >
                                <input
                                    type="date"
                                    className={`${baseInput} ${okRing}`}
                                />
                            </Field>
                        </div>

                        <div className="mt-4 text-[12px] text-gray-600">
                            <div className="font-semibold mb-1">
                                Reminder (copies):
                            </div>
                            <ul className="list-disc pl-5 grid grid-cols-1 sm:grid-cols-3 gap-1">
                                <li>White — Partner’s copy (SOA)</li>
                                <li>Yellow — Clinic’s copy</li>
                                <li>Blue — Damayan Office copy</li>
                            </ul>
                        </div>
                    </section>

                    {/* Floating actions */}
                    <div className="fixed bottom-4 right-6 flex gap-3">
                        <button
                            onClick={handleSave}
                            className="px-4 h-9 bg-[#2e7d32] text-white rounded hover:bg-[#276b2b]"
                        >
                            Save Form
                        </button>
                    </div>
                </main>
            </div>
        </>
    );
}

export default memo(LaboratoryChargeSlip);
