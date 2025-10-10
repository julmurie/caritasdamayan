import { useState, memo, useCallback, useMemo } from "react";
import { Link, router } from "@inertiajs/react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import styles from "../../../../css/volunteer.module.css";

/* ========= Validation helper ========= */
function validateReferralForm(
    meta,
    client,
    assistance,
    initialProvided,
    docs,
    docsOther
) {
    const errors = { meta: {}, client: {} };

    // --- Assistance ---
    const hasSelectedAssistance = Object.values(assistance).some(
        (a) => a.checked
    );
    if (!hasSelectedAssistance) {
        errors.assistance = "At least one type of assistance is required.";
    }

    // --- Initial Assistance Provided ---
    if (!initialProvided.trim()) {
        errors.initialProvided = "Initial assistance details are required.";
    }

    // --- Meta ---
    if (!meta.date) errors.meta.date = "Date is required.";
    if (!meta.ref_control_no?.trim())
        errors.meta.ref_control_no = "Reference Control Number is required.";
    else if (meta.ref_control_no.length > 20)
        errors.meta.ref_control_no =
            "Ref Control No. cannot exceed 20 characters.";

    if (!meta.referred_to?.trim())
        errors.meta.referred_to = "Referred To field is required.";
    else if (meta.referred_to.length > 100)
        errors.meta.referred_to = "Referred To cannot exceed 100 characters.";

    // --- Client ---
    if (!client.name?.trim()) errors.client.name = "Client name is required.";
    else if (!/^[A-Za-z\s.]+$/.test(client.name))
        errors.client.name = "Client name must contain letters only.";

    if (!client.diagnosis?.trim())
        errors.client.diagnosis = "Diagnosis is required.";

    if (!client.contact_no?.trim())
        errors.client.contact_no = "Contact number is required.";
    else if (!/^\d{11}$/.test(client.contact_no))
        errors.client.contact_no = "Contact number must be exactly 11 digits.";

    if (!client.address?.trim()) errors.client.address = "Address is required.";
    else if (client.address.length > 255)
        errors.client.address = "Address cannot exceed 255 characters.";

    if (client.fp_booklet_no && client.fp_booklet_no.length > 20)
        errors.client.fp_booklet_no =
            "Booklet No. cannot exceed 20 characters.";

    if (client.valid_id_presented && client.valid_id_presented.length > 100)
        errors.client.valid_id_presented = "Valid ID description too long.";

    if (client.parish_name && client.parish_name.length > 150)
        errors.client.parish_name = "Parish Name too long.";

    if (client.diocese && client.diocese.length > 150)
        errors.client.diocese = "Diocese name too long.";

    const hasAnyDoc = Object.values(docs || {}).some(Boolean);
    if (!hasAnyDoc && !docsOther.trim()) {
        errors.docsOther =
            "Provide at least one supporting document or specify in Others.";
    }

    return errors;
}

/* ========= UI primitives (same feel as your other forms) ========= */
const baseInput =
    "w-full h-9 rounded border bg-white px-2 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out";
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

const ring = (hasError) => (hasError ? errRing : okRing);

/* ========= Data ========= */
const ASSISTANCE = [
    "BURIAL/FUNERAL ASSISTANCE",
    "MEDICAL ASSISTANCE",
    "CLINICAL TREATMENT",
    "DENTAL ASSISTANCE",
    "DIAGNOSTIC/LABORATORY",
    "LEGAL MATTERS",
    "LIVELIHOOD",
    "MENTAL HEALTH",
    "OTHERS",
];

const SUPPORT_DOCS = [
    "Updated Medicine Prescription",
    "Updated Laboratory Request",
    "Updated Clinical Treatment Protocol",
    "Updated MedCert or Clinical Abstract",
    "Updated Statement of Account",
    "Updated picture/valid ID of the client",
    "Family Booklet",
    "Social Case Study Report",
    "Personal Letter addressed to Rev. Fr. Anton C.T. Pascual, Executive Director",
    "Brgy. Clearance or Certificate of Indigency",
    "Endorsement letter signed by the Parish Priest",
    "Death Certificate",
];

const LIMITS = {
    meta: {
        ref_control_no: 20,
        referred_to: 100,
        other_programs: 200,
    },
    client: {
        name: 100,
        diagnosis: 150,
        contact_no: 11,
        address: 255,
        fp_booklet_no: 20,
        valid_id_presented: 100,
        parish_name: 150,
        diocese: 150,
    },
    assistanceNote: 120,
    docsOther: 150,
    initialProvided: 1000,
    signatoryName: 120,
};

const makeInitialMeta = () => ({
    date: "",
    ref_control_no: "",
    issuing_program_cia: false,
    issuing_program_gen129: false,
    issuing_program_alliswell: false,
    all_is_well: "",
    other_programs: "",
    referred_to: "",
});

const makeInitialClient = () => ({
    name: "",
    diagnosis: "",
    contact_no: "",
    address: "",
    parish_name: "",
    diocese: "",
    partner_type: "Family Partner",
    fp_booklet_no: "",
    valid_id_presented: "",
});

const makeInitialAssistance = () =>
    Object.fromEntries(
        ASSISTANCE.map((a) => [a, { checked: false, note: "" }])
    );

const makeInitialDocs = () =>
    Object.fromEntries(SUPPORT_DOCS.map((d) => [d, false]));

const makeInitialSignatories = () => ({
    requested_by: "",
    requested_date: "",
    approved_by: "",
    approved_date: "",
});

/* ========= Component ========= */
function Referral() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [errors, setErrors] = useState({ meta: {}, client: {} });
    const [clearSelection, setClearSelection] = useState(false);
    const [meta, setMeta] = useState(makeInitialMeta());

    const [client, setClient] = useState(makeInitialClient());

    const [assistance, setAssistance] = useState(makeInitialAssistance());
    const [initialProvided, setInitialProvided] = useState("");
    const [docs, setDocs] = useState(makeInitialDocs());
    const [docsOther, setDocsOther] = useState("");
    const [signatories, setSignatories] = useState(makeInitialSignatories());
    const setSignField = (k) => (e) =>
        setSignatories((p) => ({ ...p, [k]: e.target.value }));
    const capped = (str, n) => (str?.length > n ? str.slice(0, n) : str);
    const hasSelections = useMemo(() => {
        const anyAssist = Object.values(assistance).some(
            (a) => a.checked || (a.note ?? "").trim().length > 0
        );
        const anyDocs =
            Object.values(docs).some(Boolean) ||
            (docsOther ?? "").trim().length > 0;
        const anyInit = (initialProvided ?? "").trim().length > 0;

        const anyMeta = Object.values(meta).some((v) =>
            typeof v === "boolean" ? v : String(v ?? "").trim().length > 0
        );
        const anyClient = Object.entries(client).some(([k, v]) =>
            k === "partner_type"
                ? v !== "Family Partner"
                : String(v ?? "").trim().length > 0
        );
        const anySigns = Object.values(signatories).some(
            (v) => String(v ?? "").trim().length > 0
        );

        return (
            anyAssist || anyDocs || anyInit || anyMeta || anyClient || anySigns
        );
    }, [
        assistance,
        docs,
        docsOther,
        initialProvided,
        meta,
        client,
        signatories,
    ]);

    const clearFieldError = (section, key) =>
        setErrors((prev) => {
            if (!prev?.[section]?.[key]) return prev;
            const next = { ...prev, [section]: { ...prev[section] } };
            delete next[section][key];
            return next;
        });
    const setMetaField = (k) => (e) => {
        const raw =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        const limit = LIMITS.meta?.[k];
        const v = typeof raw === "string" && limit ? capped(raw, limit) : raw;
        setMeta((p) => ({ ...p, [k]: v }));
        if (String(v ?? "").trim()) clearFieldError("meta", k); // ✅ clear error live
    };

    const setClientField = (k) => (e) => {
        const v = e.target.value;
        const limit = LIMITS.client?.[k];
        setClient((p) => ({
            ...p,
            [k]: typeof v === "string" && limit ? capped(v, limit) : v,
        }));
        if (String(v ?? "").trim()) clearFieldError("client", k); // ✅ clear error live
    };

    const toggleAssist = (key, field) => (e) =>
        setAssistance((p) => ({
            ...p,
            [key]: {
                ...p[key],
                [field]:
                    field === "checked" ? e.target.checked : e.target.value,
            },
        }));

    const toggleDoc = (key) => (e) => {
        const checked = e.target.checked;
        setDocs((p) => {
            const updated = { ...p, [key]: checked };
            // ✅ Clear docsOther error if any doc is checked
            if (Object.values(updated).some(Boolean)) {
                setErrors((prev) => ({ ...prev, docsOther: undefined }));
            }
            return updated;
        });
    };

    const clearAllSelections = useCallback(() => {
        setMeta(makeInitialMeta());

        // Client block
        setClient(makeInitialClient());

        // Assistance + notes
        setAssistance(makeInitialAssistance());

        // Documents
        setDocs(makeInitialDocs());
        setDocsOther("");

        // Initial assistance provided
        setInitialProvided("");

        // Signatories
        setSignatories(makeInitialSignatories());

        // Clear ALL errors
        setErrors({ meta: {}, client: {} });

        // Optional signal
        setClearSelection((v) => !v);
    }, []);

    /* Save — you’ll add the matching route/controller (e.g. POST /volunteer/referrals) */
    const handleSave = useCallback(() => {
        // run validation
        const errs = validateReferralForm(
            meta,
            client,
            assistance,
            initialProvided,
            docs,
            docsOther
        );

        if (
            Object.keys(errs.meta).length > 0 ||
            Object.keys(errs.client).length > 0
        ) {
            setErrors(errs);
            return;
        }
        setErrors({ meta: {}, client: {} }); // clear if valid

        const payload = {
            meta,
            client,
            assistance: Object.entries(assistance)
                .filter(([, v]) => v.checked)
                .map(([name, v]) => ({ name, note: v.note || "" })),
            initial_provided: initialProvided,
            documents: Object.entries(docs)
                .filter(([, v]) => v)
                .map(([name]) => name),
            documents_other: docsOther,
        };

        router.post("/volunteer/referrals", payload, {
            onSuccess: () => alert("Referral saved!"),
            onError: (e) => alert(e?.message || "Failed to save"),
        });
    }, [meta, client, assistance, initialProvided, docs, docsOther]);

    return (
        <>
            <Navbar />
            <div
                className={`${styles.shell} ${
                    sidebarOpen ? styles.shellOpen : styles.shellClosed
                }`}
            >
                <Sidebar onToggle={setSidebarOpen} active="referral-form" />

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
                        <h2 className="text-2xl font-semibold">
                            Referral Form
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

                    {/* Meta */}
                    <section className={`${card} p-5 mb-6`}>
                        <div className="grid grid-cols-12 gap-4">
                            <Field
                                label="Date"
                                className="col-span-12 sm:col-span-3 lg:col-span-2"
                            >
                                <input
                                    type="date"
                                    className={`${baseInput} ${ring(
                                        errors.meta.date
                                    )}`}
                                    value={meta.date}
                                    onChange={setMetaField("date")}
                                />
                                {errors.meta.date && (
                                    <p className={errorText}>
                                        {errors.meta.date}
                                    </p>
                                )}
                            </Field>
                            <Field
                                label="Ref Control No."
                                className="col-span-12 sm:col-span-3 lg:col-span-2"
                            >
                                <input
                                    className={`${baseInput} ${ring(
                                        errors.meta.ref_control_no
                                    )}`}
                                    value={meta.ref_control_no}
                                    onChange={setMetaField("ref_control_no")}
                                    maxLength={LIMITS.meta.ref_control_no}
                                />

                                {errors.meta.ref_control_no && (
                                    <p className={errorText}>
                                        {errors.meta.ref_control_no}
                                    </p>
                                )}
                            </Field>

                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <label className={baseLabel}>
                                    Issuing Program
                                </label>
                                <div className="mt-2 flex items-center gap-6">
                                    <label className="inline-flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={meta.issuing_program_cia}
                                            onChange={setMetaField(
                                                "issuing_program_cia"
                                            )}
                                        />
                                        CIA
                                    </label>
                                    <label className="inline-flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={
                                                meta.issuing_program_gen129
                                            }
                                            onChange={setMetaField(
                                                "issuing_program_gen129"
                                            )}
                                        />
                                        GEN129
                                    </label>
                                    <label className="inline-flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={
                                                meta.issuing_program_alliswell
                                            }
                                            onChange={setMetaField(
                                                "issuing_program_alliswell"
                                            )}
                                        />
                                        ALL IS WELL
                                    </label>
                                </div>
                            </div>

                            <Field
                                label="Other Programs"
                                className="col-span-12"
                            >
                                <input
                                    className={`${baseInput} ${ring(
                                        errors.meta.other_programs
                                    )}`}
                                    value={meta.other_programs}
                                    onChange={setMetaField("other_programs")}
                                    maxLength={LIMITS.meta.other_programs}
                                />
                                {errors.meta.other_programs && (
                                    <p className={errorText}>
                                        {errors.meta.other_programs}
                                    </p>
                                )}
                            </Field>

                            <Field label="Referred To" className="col-span-12">
                                <input
                                    className={`${baseInput} ${ring(
                                        errors.meta.referred_to
                                    )}`}
                                    value={meta.referred_to}
                                    onChange={setMetaField("referred_to")}
                                    maxLength={LIMITS.meta.referred_to}
                                />

                                {errors.meta.referred_to && (
                                    <p className={errorText}>
                                        {errors.meta.referred_to}
                                    </p>
                                )}
                            </Field>
                        </div>
                    </section>

                    {/* Client block */}
                    <section className={`${card} p-5 mb-6`}>
                        <div className="grid grid-cols-12 gap-4">
                            <Field
                                label="Client's Name"
                                className="col-span-12 sm:col-span-6"
                            >
                                <input
                                    className={`${baseInput} ${ring(
                                        errors.client.name
                                    )}`}
                                    value={client.name}
                                    onChange={setClientField("name")}
                                    maxLength={LIMITS.client.name}
                                />
                                {errors.client.name && (
                                    <p className={errorText}>
                                        {errors.client.name}
                                    </p>
                                )}
                            </Field>
                            <Field
                                label="Diagnosis"
                                className="col-span-12 sm:col-span-6"
                            >
                                <input
                                    className={`${baseInput} ${ring(
                                        errors.client.diagnosis
                                    )}`}
                                    value={client.diagnosis}
                                    onChange={setClientField("diagnosis")}
                                    maxLength={LIMITS.client.diagnosis}
                                />
                                {errors.client.diagnosis && (
                                    <p className={errorText}>
                                        {errors.client.diagnosis}
                                    </p>
                                )}
                            </Field>

                            <Field
                                label="Contact Number"
                                className="col-span-12 sm:col-span-6"
                            >
                                <input
                                    className={`${baseInput} ${ring(
                                        errors.client.contact_no
                                    )}`}
                                    value={client.contact_no}
                                    onChange={setClientField("contact_no")}
                                    placeholder="+63 9xx xxx xxxx"
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={LIMITS.client.contact_no}
                                />
                                {errors.client.contact_no && (
                                    <p className={errorText}>
                                        {errors.client.contact_no}
                                    </p>
                                )}
                            </Field>
                            <Field
                                label="Address"
                                className="col-span-12 sm:col-span-6"
                            >
                                <input
                                    className={`${baseInput} ${ring(
                                        errors.client.address
                                    )}`}
                                    value={client.address}
                                    onChange={setClientField("address")}
                                    maxLength={LIMITS.client.address}
                                />
                                {errors.client.address && (
                                    <p className={errorText}>
                                        {errors.client.address}
                                    </p>
                                )}
                            </Field>

                            <div className="col-span-12 sm:col-span-6">
                                <label className={baseLabel}>
                                    Partner Type
                                </label>
                                <div className="mt-2 flex items-center gap-6">
                                    <label className="inline-flex items-center gap-2 text-sm">
                                        <input
                                            type="radio"
                                            name="partner_type"
                                            value="Family Partner"
                                            checked={
                                                client.partner_type ===
                                                "Family Partner"
                                            }
                                            onChange={setClientField(
                                                "partner_type"
                                            )}
                                        />
                                        Family Partner (FP)
                                    </label>

                                    <label className="inline-flex items-center gap-2 text-sm">
                                        <input
                                            type="radio"
                                            name="partner_type"
                                            value="Non Family Partner"
                                            checked={
                                                client.partner_type ===
                                                "Non Family Partner"
                                            }
                                            onChange={setClientField(
                                                "partner_type"
                                            )}
                                        />
                                        Non Family Partner (NFP)
                                    </label>
                                </div>
                            </div>

                            <Field
                                label="FP Booklet No."
                                className="col-span-12 sm:col-span-3"
                            >
                                <input
                                    className={`${baseInput} ${ring(
                                        errors.client.fp_booklet_no
                                    )}`}
                                    value={client.fp_booklet_no}
                                    onChange={setClientField("fp_booklet_no")}
                                    maxLength={LIMITS.client.fp_booklet_no}
                                />
                                {errors.client.fp_booklet_no && (
                                    <p className={errorText}>
                                        {errors.client.fp_booklet_no}
                                    </p>
                                )}
                            </Field>
                            {/* <Field
                                label="Valid ID Presented"
                                className="col-span-12 sm:col-span-3"
                            >
                                <input
                                    className={`${baseInput} ${
                                        errors.meta.date ? errRing : okRing
                                    }`}
                                    value={client.valid_id_presented}
                                    onChange={setClientField(
                                        "valid_id_presented"
                                    )}
                                />
                                {errors.client.valid_id_presented && (
                                    <p className={errorText}>
                                        {errors.client.valid_id_presented}
                                    </p>
                                )}
                            </Field> */}
                            <Field
                                label="Valid ID Presented"
                                className="col-span-12 sm:col-span-3"
                            >
                                <select
                                    className={`${baseInput} ${okRing}`}
                                    value={client.valid_id_presented}
                                    onChange={setClientField(
                                        "valid_id_presented"
                                    )}
                                >
                                    <option value="">—</option>
                                    <option value="PhilHealth">
                                        PhilHealth
                                    </option>
                                    <option value="SSS">SSS</option>
                                    <option value="UMID">UMID</option>
                                    <option value="Passport">Passport</option>
                                    <option value="Driver’s License">
                                        Driver’s License
                                    </option>
                                    <option value="Voter’s ID">
                                        Voter’s ID
                                    </option>
                                </select>

                                {/* if you later add validation: */}
                                {errors.client?.valid_id_presented && (
                                    <p className={errorText}>
                                        {errors.client.valid_id_presented}
                                    </p>
                                )}
                            </Field>

                            <Field
                                label="Parish Name"
                                className="col-span-12 sm:col-span-6"
                            >
                                <input
                                    className={`${baseInput} ${ring(
                                        errors.client.parish_name
                                    )}`}
                                    value={client.parish_name}
                                    onChange={setClientField("parish_name")}
                                    maxLength={LIMITS.client.parish_name}
                                />
                                {errors.client.parish_name && (
                                    <p className={errorText}>
                                        {errors.client.parish_name}
                                    </p>
                                )}
                            </Field>

                            <Field
                                label="Diocese"
                                className="col-span-12 sm:col-span-6"
                            >
                                <input
                                    className={`${baseInput} ${ring(
                                        errors.client.diocese
                                    )}`}
                                    value={client.diocese}
                                    onChange={setClientField("diocese")}
                                    maxLength={LIMITS.client.diocese}
                                />
                                {errors.client.diocese && (
                                    <p className={errorText}>
                                        {errors.client.diocese}
                                    </p>
                                )}
                            </Field>
                        </div>
                    </section>

                    {/* Assistance needed + Initial provided */}
                    <section className={`${card} p-5 mb-6`}>
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 lg:col-span-6">
                                <div className="font-semibold mb-2">
                                    Assistance Needed (check & specify)
                                </div>
                                <div
                                    className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${
                                        errors.assistance
                                            ? "ring-2 ring-red-400 border-red-500 p-2 rounded"
                                            : ""
                                    }`}
                                >
                                    {ASSISTANCE.map((a) => (
                                        <div
                                            key={a}
                                            className="border rounded p-2"
                                        >
                                            <label className="inline-flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        assistance[a].checked
                                                    }
                                                    onChange={toggleAssist(
                                                        a,
                                                        "checked"
                                                    )}
                                                />
                                                {a}
                                            </label>
                                            <input
                                                className={`${baseInput} ${
                                                    errors.assistance
                                                        ? errRing
                                                        : okRing
                                                } mt-2`}
                                                placeholder="Specifics / notes"
                                                value={assistance[a].note}
                                                onChange={toggleAssist(
                                                    a,
                                                    "note"
                                                )}
                                                maxLength={
                                                    LIMITS.assistanceNote
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                                {errors.assistance && (
                                    <p className={errorText}>
                                        {errors.assistance}
                                    </p>
                                )}
                            </div>

                            <div className="col-span-12 lg:col-span-6">
                                <div className="font-semibold mb-2">
                                    Initial Assistance Provided
                                </div>
                                <textarea
                                    rows={10}
                                    className={`w-full rounded border px-2 py-2 text-sm focus:outline-none focus:ring-2 ${
                                        errors.initialProvided
                                            ? "ring-2 ring-red-400 border-red-500 focus:ring-red-400"
                                            : "focus:ring-[#2e7d32]/30 border-gray-300"
                                    }`}
                                    value={initialProvided}
                                    onChange={(e) =>
                                        setInitialProvided(e.target.value)
                                    }
                                    maxLength={LIMITS.initialProvided}
                                />
                                {errors.initialProvided && (
                                    <p className={errorText}>
                                        {errors.initialProvided}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Supporting documents */}
                    <section className={`${card} p-5 mb-6`}>
                        <div className="font-semibold mb-1">
                            Supporting Documents{" "}
                            <span className="text-gray-500 text-[12px]">
                                (at least 2 weeks updated)
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                            {SUPPORT_DOCS.map((d) => (
                                <label
                                    key={d}
                                    className="inline-flex items-center gap-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={!!docs[d]}
                                        onChange={toggleDoc(d)}
                                    />
                                    {d}
                                </label>
                            ))}
                        </div>
                        <Field label="Others" className="mt-3">
                            <input
                                className={`${baseInput} ${ring(
                                    errors.docsOther
                                )}`}
                                value={docsOther}
                                onChange={(e) => setDocsOther(e.target.value)}
                                placeholder="Specify other supporting document(s)"
                                maxLength={LIMITS.docsOther}
                            />
                            {errors.docsOther && (
                                <p className={errorText}>{errors.docsOther}</p>
                            )}
                        </Field>
                    </section>

                    {/* Signatories */}
                    <section className={`${card} p-5`}>
                        <div className="grid grid-cols-12 gap-4">
                            <Field
                                label="Requested By (Print Name & Signature)"
                                className="col-span-12 sm:col-span-6 lg:col-span-4"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={signatories.requested_by}
                                    onChange={setSignField("requested_by")}
                                    maxLength={LIMITS.signatoryName}
                                />
                            </Field>
                            <Field
                                label="Date Signed"
                                className="col-span-6 sm:col-span-3 lg:col-span-2"
                            >
                                <input
                                    type="date"
                                    className={`${baseInput} ${okRing}`}
                                    value={signatories.requested_date}
                                    onChange={setSignField("requested_date")}
                                />
                            </Field>

                            <Field
                                label="Approved By (Print Name & Signature)"
                                className="col-span-12 sm:col-span-6 lg:col-span-4"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={signatories.approved_by}
                                    onChange={setSignField("approved_by")}
                                    maxLength={LIMITS.signatoryName}
                                />
                            </Field>
                            <Field
                                label="Date Signed"
                                className="col-span-6 sm:col-span-3 lg:col-span-2"
                            >
                                <input
                                    type="date"
                                    className={`${baseInput} ${okRing}`}
                                    value={signatories.approved_date}
                                    onChange={setSignField("approved_date")}
                                />
                            </Field>
                        </div>
                    </section>

                    {/* Floating actions */}
                    <div className="fixed bottom-4 right-6 flex gap-3">
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
                </main>
            </div>
        </>
    );
}

export default memo(Referral);
