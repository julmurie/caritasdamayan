import React, { useEffect, useState } from "react";
import { fetchPatients, createPatient } from "@/api/patients";
import styles from "../../css/volunteer.module.css";
import AddPatientModal from "@/Components/Modals/AddPatientModal";

export default function Sidebar({ onToggle }) {
    const [open, setOpen] = useState(true);

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const [showAdd, setShowAdd] = useState(false);

    // keep parent informed about width change
    useEffect(() => {
        onToggle?.(open);
    }, [open, onToggle]);

    // load patients
    const load = async () => {
        try {
            setLoading(true);
            setErr("");
            const data = await fetchPatients(); // expects array
            setPatients(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            setErr(e.message || "Failed to load patients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    // modal save handler
    const handleCreate = async (form) => {
        await createPatient(form);
        setShowAdd(false);
        await load();
    };

    {
        showAdd && (
            <AddPatientModal
                onClose={() => setShowAdd(false)}
                onSave={handleCreate}
            />
        );
    }

    return (
        <aside
            className={`${styles.side} ${
                open ? styles.sideOpen : styles.sideClosed
            }`}
            aria-label="Sidebar"
        >
            {/* collapse/expand handle (always visible) */}
            <button
                type="button"
                className={styles.sideHandle}
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Collapse" : "Expand"}
                title={open ? "Collapse" : "Expand"}
            >
                {open ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={styles.chev}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={styles.chev}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                        />
                    </svg>
                )}
            </button>

            {/* header actions */}
            <div className={styles.sideHeader}>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnGreen}`}
                    onClick={() => setShowAdd(true)}
                >
                    <span className={styles.iconLeft}>
                        {/* plus-in-circle; shows white on green button */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            width="16"
                            height="16"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="8.25" />
                            <path d="M12 8.5v7M8.5 12h7" />
                        </svg>
                    </span>
                    <span className={styles.btnText}>Add Patient</span>
                </button>

                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnDark}`}
                >
                    <span className={styles.btnText}>Archived Patient</span>
                </button>

                {/* search (hook up later server-side) + filter */}
                <div className={styles.searchRow}>
                    <input
                        className={styles.search}
                        placeholder="Search patient (soon)"
                        disabled
                    />
                    <button
                        type="button"
                        className={styles.filterBtn}
                        disabled
                        title="Filter (soon)"
                    >
                        <svg
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3 5h14M6 10h8m-6 5h4"
                                stroke="currentColor"
                                fill="none"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                {open && (
                    <div className={styles.tally}>
                        {loading
                            ? "Loading…"
                            : `Total Patients (${patients.length})`}
                    </div>
                )}
            </div>

            {/* list */}
            <div className={styles.listWrap}>
                {err && <div className={styles.row}>{err}</div>}
                {loading && <div className={styles.row}>Loading…</div>}
                {!loading && patients.length === 0 && (
                    <div className={styles.row}>No patients yet.</div>
                )}

                {!loading &&
                    patients.map((p) => (
                        <button
                            key={
                                p.patient_id ??
                                `${p.patient_lname}-${p.patient_fname}`
                            }
                            type="button"
                            className={styles.row}
                            title={`${p.patient_lname}, ${p.patient_fname}${
                                p.patient_mname ? " " + p.patient_mname : ""
                            }`}
                            // onClick={() => ... select patient if you need }
                        >
                            <span className={styles.rowText}>
                                {p.patient_lname}, {p.patient_fname}
                                {p.patient_mname ? ` ${p.patient_mname}` : ""}
                            </span>
                        </button>
                    ))}

                <div className={styles.flexFill} />
            </div>

            {/* simple footer (keep, or replace with real pagination later) */}
            <div className={styles.pagesBar}>
                <span className={styles.pagesLabel}>Patients</span>
                <div className={styles.pages}>
                    <span className={styles.pageBtn}>{patients.length}</span>
                </div>
            </div>

            {/* Add Patient Modal */}
            {showAdd && (
                <AddPatientModal
                    onClose={() => setShowAdd(false)}
                    onSave={handleCreate}
                />
            )}
        </aside>
    );
}
