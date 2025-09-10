// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import styles from "../../css/volunteer.module.css";

export default function Sidebar({ onToggle }) {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        onToggle?.(open);
    }, [open, onToggle]);

    return (
        <aside
            className={`${styles.side} ${
                open ? styles.sideOpen : styles.sideClosed
            }`}
            role="dialog"
            aria-label="Sidebar"
        >
            {/* floating handle (always visible) */}
            <button
                type="button"
                className={styles.sideHandle}
                onClick={() => setOpen(!open)}
                aria-label={open ? "Collapse" : "Expand"}
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

            {/* Header */}
            <div className={styles.sideHeader}>
                <button
                    className={`${styles.btn} ${styles.btnGreen}`}
                    type="button"
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

                {/* search + filter */}
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

                <div className={styles.tally}>Total Patients (x)</div>
            </div>

            {/* Body (list) */}
            <div className={styles.listWrap}>
                <div className={styles.groupHead}>
                    <span className={styles.rowText}>Dela Cruz, Juan</span>
                    <button className={styles.iconOnly} aria-label="Delete">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 2a1 1 0 0 0-1 1v1H4.5a1 1 0 1 0 0 2H5v9a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3V6h.5a1 1 0 1 0 0-2H14V3a1 1 0 0 0-1-1H7Z" />
                        </svg>
                    </button>
                </div>
                <button className={styles.row} type="button">
                    <span className={styles.rowText}>Luna, Antonio</span>
                </button>
                <button className={styles.row} type="button">
                    <span className={styles.rowText}>Salazar, Paul</span>
                </button>
                <div className={styles.flexFill} />
            </div>

            {/* Footer (pagination) */}
            <div className={styles.pagesBar}>
                <span className={styles.pagesLabel}>Pages</span>
                <div className={styles.pages}>
                    <button className={styles.pageBtn}>&lt;</button>
                    <button
                        className={`${styles.pageBtn} ${styles.pageActive}`}
                    >
                        1
                    </button>
                    <button className={styles.pageBtn}>2</button>
                    <span className={styles.pageDots}>..</span>
                    <button className={styles.pageBtn}>8</button>
                    <button className={styles.pageBtn}>&gt;</button>
                </div>
            </div>
        </aside>
    );
}
