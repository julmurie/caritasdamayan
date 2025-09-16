import React, { useEffect, useState } from "react";
import { fetchPatients, createPatient } from "@/api/patients";
import styles from "../../css/volunteer.module.css";
import AddPatientModal from "./modals/AddPatientModal";

export default function Sidebar({ onToggle, onSelect, selectedId }) {
    const [open, setOpen] = useState(true);
    const [patients, setPatients] = useState([]);
    const [showAdd, setShowAdd] = useState(false);

    const idOf = (row) => row?.patient_id ?? row?.id;

    async function load({ selectFirstIfNone = true } = {}) {
        try {
            const data = await fetchPatients();
            setPatients(data);
            if (selectFirstIfNone && !selectedId && data?.length) {
                onSelect?.(idOf(data[0]));
            }
        } catch (e) {
            console.error("fetchPatients failed:", e);
            setPatients([]);
        }
    }

    useEffect(() => onToggle?.(open), [open, onToggle]);
    useEffect(() => {
        load({ selectFirstIfNone: true });
    }, []);

    async function handleCreate(form) {
        try {
            const created = await createPatient(form);
            setShowAdd(false);
            await load({ selectFirstIfNone: false });
            const newId = idOf(created);
            if (newId) onSelect?.(newId);
        } catch (e) {
            console.error("createPatient failed:", e);
            alert(e.message || "Failed to save patient");
        }
    }

    return (
        <aside
            className={`${styles.side} ${
                open ? styles.sideOpen : styles.sideClosed
            }`}
            aria-label="Sidebar"
        >
            <button
                type="button"
                className={styles.sideHandle}
                onClick={() => setOpen(!open)}
                aria-label={open ? "Collapse" : "Expand"}
            >
                {/* chevrons unchanged */}
                {open ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className={styles.chev}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
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
                        viewBox="0 0 24 24"
                        className={styles.chev}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                        />
                    </svg>
                )}
            </button>

            <div className={styles.sideHeader}>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnGreen}`}
                    onClick={() => setShowAdd(true)}
                >
                    <span className={styles.iconLeft}>
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1Z" />
                        </svg>
                    </span>
                    <span className={styles.btnText}>Add Patient</span>
                </button>

                <button
                    className={`${styles.btn} ${styles.btnDark}`}
                    type="button"
                >
                    <span className={styles.iconLeft}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 3a1 1 0 0 0-1 1v1H5.5a1 1 0 1 0 0 2H6v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7h.5a1 1 0 1 0 0-2H16V4a1 1 0 0 0-1-1H9Z" />
                        </svg>
                    </span>
                    <span className={styles.btnText}>Archived Patient</span>
                </button>

                <div className={styles.searchRow}>
                    <input className={styles.search} placeholder="Search" />
                    <button
                        type="button"
                        className={styles.filterBtn}
                        aria-label="Filter"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 .8 1.6l-6.2 8.27V19a1 1 0 0 1-1.45.9l-3-1.5A1 1 0 0 1 10 17v-3.13L3.2 5.6A1 1 0 0 1 3 5Z" />
                        </svg>
                    </button>
                </div>

                <div className={styles.tally}>
                    Total Patients ({patients?.length ?? 0})
                </div>
            </div>

            <div className={styles.listWrap}>
                {patients.map((p) => {
                    const id = idOf(p);
                    const active = id === selectedId;
                    return (
                        <button
                            key={id}
                            type="button"
                            className={styles.row}
                            onClick={() => onSelect?.(id)}
                            title={`${p.patient_lname}, ${p.patient_fname}`}
                            style={{ fontWeight: active ? 700 : 400 }}
                        >
                            <span className={styles.rowText}>
                                {p.patient_lname}, {p.patient_fname}
                            </span>
                        </button>
                    );
                })}
                <div className={styles.flexFill} />
            </div>

            {showAdd && (
                <AddPatientModal
                    open={showAdd}
                    onClose={() => setShowAdd(false)}
                    onSave={handleCreate}
                />
            )}
        </aside>
    );
}
