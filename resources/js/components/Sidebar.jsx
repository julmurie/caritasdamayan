// resources/js/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { fetchPatients, createPatient } from "@/api/patients";
import styles from "../../css/volunteer.module.css";
import AddPatientModal from "./modals/AddPatientModal";
import { Link, router } from "@inertiajs/react";

export default function Sidebar({ onToggle, onSelect, selectedId }) {
    const [open, setOpen] = useState(true);
    const [patients, setPatients] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [busyId, setBusyId] = useState(null); // track row action in-flight

    const idOf = (row) => row?.patient_id ?? row?.id;

    async function load({ selectFirstIfNone = true } = {}) {
        try {
            const data = await fetchPatients(
                showArchived ? { archived: 1 } : { archived: 0 }
            );
            setPatients(Array.isArray(data) ? data : []);

            if (selectFirstIfNone && !selectedId && data?.length) {
                onSelect?.(idOf(data[0]));
            }
        } catch (e) {
            console.error("fetchPatients failed:", e);
            setPatients([]);
        }
    }

    // notify parent when width changes
    useEffect(() => onToggle?.(open), [open, onToggle]);

    // initial load
    useEffect(() => {
        load({ selectFirstIfNone: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // reload when archived filter toggles
    useEffect(() => {
        load({ selectFirstIfNone: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showArchived]);

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

    // centralized archive/restore using Inertia router
    const handleArchiveClick = (e, { id, isArchived, active }) => {
        e.stopPropagation();
        if (busyId) return; // prevent double actions
        setBusyId(id);

        if (isArchived) {
            // RESTORE
            router.post(
                `/volunteer/patients/${id}/restore`,
                {},
                {
                    preserveScroll: true,
                    onFinish: () => setBusyId(null),
                    onSuccess: async () => {
                        await load({ selectFirstIfNone: true });
                    },
                    onError: () => alert("Restore failed"),
                }
            );
        } else {
            // ARCHIVE
            router.delete(`/volunteer/patients/${id}/archive`, {
                preserveScroll: true,
                onFinish: () => setBusyId(null),
                onSuccess: async () => {
                    if (active) onSelect?.(null); // if we archived the selected patient, clear selection
                    await load({ selectFirstIfNone: true });
                },
                onError: () => alert("Archive failed"),
            });
        }
    };

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
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
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
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
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

                <Link
                    href="/archives?view=patients"
                    as="button"
                    type="button"
                    className={`${styles.btn} ${styles.btnDark}`}
                    title="View archived patients"
                >
                    <span className={styles.iconLeft}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 3a1 1 0 0 0-1 1v1H5.5a1 1 0 1 0 0 2H6v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7h.5a1 1 0 1 0 0-2H16V4a1 1 0 0 0-1-1H9Z" />
                        </svg>
                    </span>
                    <span className={styles.btnText}>Archive Patients</span>
                </Link>

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
                {(patients ?? []).map((p) => {
                    const id =
                        idOf(p) ?? `${p.patient_lname}-${p.patient_fname}`;
                    const active = id === selectedId;
                    const archived = !!(
                        p.archived ||
                        p.archived_at ||
                        p.is_archived
                    );
                    const isBusy = busyId === id;

                    return (
                        <button
                            key={id}
                            type="button"
                            className={styles.row}
                            onClick={() => onSelect?.(id)}
                            title={`${p.patient_lname}, ${p.patient_fname}`}
                            style={{
                                fontWeight: active ? 700 : 400,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span className={styles.rowText}>
                                {p.patient_lname}, {p.patient_fname}
                            </span>

                            {/* hover-only action */}
                            <span className={styles.rowAction}>
                                <span
                                    role="button"
                                    tabIndex={0}
                                    className={styles.iconOnly}
                                    title={archived ? "Restore" : "Archive"}
                                    onClick={(e) =>
                                        handleArchiveClick(e, {
                                            id,
                                            isArchived: archived,
                                            active,
                                        })
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                        ) {
                                            handleArchiveClick(e, {
                                                id,
                                                isArchived: archived,
                                                active,
                                            });
                                        }
                                    }}
                                    style={{
                                        cursor: isBusy
                                            ? "not-allowed"
                                            : "pointer",
                                        opacity: isBusy ? 0.6 : 1,
                                    }}
                                >
                                    {archived ? (
                                        // Restore icon (arrow up from box)
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="18"
                                            height="18"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 20.25h18M12 3.75v10.5m0 0 3-3m-3 3-3-3M6.75 20.25h10.5a2.25 2.25 0 0 0 2.25-2.25V12"
                                            />
                                        </svg>
                                    ) : (
                                        // Archive icon
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="18"
                                            height="18"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                                            />
                                        </svg>
                                    )}
                                </span>
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
