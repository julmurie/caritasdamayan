import { useState, memo, useCallback } from "react";
import { Link, router } from "@inertiajs/react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import styles from "../../../../css/volunteer.module.css";

/* ========= UI primitives (same feel as your other forms) ========= */
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

/* ========= Component ========= */
function Referral() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Header/meta
    const [meta, setMeta] = useState({
        date: "",
        ref_control_no: "",
        issuing_program_cia: false,
        issuing_program_gen129: false,
        all_is_well: "",
        other_programs: "",
        referred_to: "",
    });

    // Client block
    const [client, setClient] = useState({
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

    // Assistance & documents
    const [assistance, setAssistance] = useState(
        Object.fromEntries(
            ASSISTANCE.map((a) => [a, { checked: false, note: "" }])
        )
    );
    const [initialProvided, setInitialProvided] = useState("");
    const [docs, setDocs] = useState(
        Object.fromEntries(SUPPORT_DOCS.map((d) => [d, false]))
    );
    const [docsOther, setDocsOther] = useState("");

    const setMetaField = (k) => (e) => {
        const v =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setMeta((p) => ({ ...p, [k]: v }));
    };

    const setClientField = (k) => (e) => {
        setClient((p) => ({ ...p, [k]: e.target.value }));
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

    const toggleDoc = (key) => (e) =>
        setDocs((p) => ({ ...p, [key]: e.target.checked }));

    /* Save — you’ll add the matching route/controller (e.g. POST /volunteer/referrals) */
    const handleSave = useCallback(() => {
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
                                    className={`${baseInput} ${okRing}`}
                                    value={meta.date}
                                    onChange={setMetaField("date")}
                                />
                            </Field>
                            <Field
                                label="Ref Control No."
                                className="col-span-12 sm:col-span-3 lg:col-span-2"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={meta.ref_control_no}
                                    onChange={setMetaField("ref_control_no")}
                                />
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
                                </div>
                            </div>

                            <Field
                                label="All Is Well"
                                className="col-span-12 sm:col-span-6 lg:col-span-4"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={meta.all_is_well}
                                    onChange={setMetaField("all_is_well")}
                                    placeholder="Clinic / program"
                                />
                            </Field>

                            <Field
                                label="Other Programs"
                                className="col-span-12"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={meta.other_programs}
                                    onChange={setMetaField("other_programs")}
                                />
                            </Field>

                            <Field label="Referred To" className="col-span-12">
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={meta.referred_to}
                                    onChange={setMetaField("referred_to")}
                                />
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
                                    className={`${baseInput} ${okRing}`}
                                    value={client.name}
                                    onChange={setClientField("name")}
                                />
                            </Field>
                            <Field
                                label="Diagnosis"
                                className="col-span-12 sm:col-span-6"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={client.diagnosis}
                                    onChange={setClientField("diagnosis")}
                                />
                            </Field>

                            <Field
                                label="Contact Number"
                                className="col-span-12 sm:col-span-6"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={client.contact_no}
                                    onChange={setClientField("contact_no")}
                                    placeholder="+63 9xx xxx xxxx"
                                />
                            </Field>
                            <Field
                                label="Address"
                                className="col-span-12 sm:col-span-6"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={client.address}
                                    onChange={setClientField("address")}
                                />
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
                                            checked={
                                                client.partner_type ===
                                                "Family Partner"
                                            }
                                            onChange={() =>
                                                setClient((p) => ({
                                                    ...p,
                                                    partner_type:
                                                        "Family Partner",
                                                }))
                                            }
                                        />
                                        Family Partner (FP)
                                    </label>
                                    <label className="inline-flex items-center gap-2 text-sm">
                                        <input
                                            type="radio"
                                            name="partner_type"
                                            checked={
                                                client.partner_type ===
                                                "Non Family Partner"
                                            }
                                            onChange={() =>
                                                setClient((p) => ({
                                                    ...p,
                                                    partner_type:
                                                        "Non Family Partner",
                                                }))
                                            }
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
                                    className={`${baseInput} ${okRing}`}
                                    value={client.fp_booklet_no}
                                    onChange={setClientField("fp_booklet_no")}
                                />
                            </Field>
                            <Field
                                label="Valid ID Presented"
                                className="col-span-12 sm:col-span-3"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={client.valid_id_presented}
                                    onChange={setClientField(
                                        "valid_id_presented"
                                    )}
                                />
                            </Field>

                            <Field
                                label="Parish Name"
                                className="col-span-12 sm:col-span-6"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={client.parish_name}
                                    onChange={setClientField("parish_name")}
                                />
                            </Field>

                            <Field
                                label="Diocese"
                                className="col-span-12 sm:col-span-6"
                            >
                                <input
                                    className={`${baseInput} ${okRing}`}
                                    value={client.diocese}
                                    onChange={setClientField("diocese")}
                                />
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                                className={`${baseInput} ${okRing} mt-2`}
                                                placeholder="Specifics / notes"
                                                value={assistance[a].note}
                                                onChange={toggleAssist(
                                                    a,
                                                    "note"
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-12 lg:col-span-6">
                                <div className="font-semibold mb-2">
                                    Initial Assistance Provided
                                </div>
                                <textarea
                                    rows={10}
                                    className="w-full rounded border px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/30 border-gray-300"
                                    value={initialProvided}
                                    onChange={(e) =>
                                        setInitialProvided(e.target.value)
                                    }
                                />
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
                                className={`${baseInput} ${okRing}`}
                                value={docsOther}
                                onChange={(e) => setDocsOther(e.target.value)}
                                placeholder="Specify other supporting document(s)"
                            />
                        </Field>
                    </section>

                    {/* Signatories */}
                    <section className={`${card} p-5`}>
                        <div className="grid grid-cols-12 gap-4">
                            <Field
                                label="Requested By (Print Name & Signature)"
                                className="col-span-12 sm:col-span-6 lg:col-span-4"
                            >
                                <input className={`${baseInput} ${okRing}`} />
                            </Field>
                            <Field
                                label="Date Signed"
                                className="col-span-6 sm:col-span-3 lg:col-span-2"
                            >
                                <input
                                    type="date"
                                    className={`${baseInput} ${okRing}`}
                                />
                            </Field>

                            <Field
                                label="Approved By (Print Name & Signature)"
                                className="col-span-12 sm:col-span-6 lg:col-span-4"
                            >
                                <input className={`${baseInput} ${okRing}`} />
                            </Field>
                            <Field
                                label="Date Signed"
                                className="col-span-6 sm:col-span-3 lg:col-span-2"
                            >
                                <input
                                    type="date"
                                    className={`${baseInput} ${okRing}`}
                                />
                            </Field>
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

export default memo(Referral);
