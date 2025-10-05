import React, { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import styles from "../../../css/merchant.module.css";

// --- "July 05, 2025 | 5:00pm" ---
const prettyDate = (iso) => {
    const d = new Date(`${iso}T17:00:00`); // demo 5:00 PM
    const date = d.toLocaleDateString(undefined, {
        month: "long",
        day: "2-digit",
        year: "numeric",
    });
    const time = d
        .toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
        .toLowerCase();
    return `${date} | ${time}`;
};

// --- Demo data (replace with backend data) ---
const MOCK = [
    {
        id: "CL01-ABC-0001",
        patientName: "DELA CRUZ, JUAN",
        code: "CL01-ABC-0001",
        volunteer: "username.01",
        status: "Redeemed",
        fileUrl: "#",
        createdAt: "2025-07-05",
        branch: "Metro Manila Branch",
    },
    {
        id: "CL01-ABC-0002",
        patientName: "DELA CRUZ, JUAN",
        code: "CL01-ABC-0002",
        volunteer: "username.01",
        status: "Redeemed",
        fileUrl: "#",
        createdAt: "2025-07-05",
        branch: "Metro Manila Branch",
    },
    {
        id: "CL01-ABC-0003",
        patientName: "DELA CRUZ, JUAN",
        code: "CL01-ABC-0003",
        volunteer: "username.01",
        status: "Redeemed",
        fileUrl: "#",
        createdAt: "2025-07-05",
        branch: "Metro Manila Branch",
    },
];

const BRANCHES = [
    "All Branches",
    "Metro Manila Branch",
    "Cavite Branch",
    "Laguna Branch",
];
const STATUSES = ["All", "Redeemed", "Unredeemed"];
const SORTS = [
    { label: "Newest to Oldest", value: "desc" },
    { label: "Oldest to Newest", value: "asc" },
];

export default function ChargeSlips({ records = MOCK, clinic = "Generika" }) {
    const [branch, setBranch] = useState("Metro Manila Branch");
    const [query, setQuery] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("All");
    const [sort, setSort] = useState("desc");
    const [open, setOpen] = useState(null);

    const list = useMemo(() => {
        let arr = [...records];

        if (branch !== "All Branches")
            arr = arr.filter((r) => r.branch === branch);
        if (status !== "All") arr = arr.filter((r) => r.status === status);
        if (date) arr = arr.filter((r) => r.createdAt === date);

        if (query.trim()) {
            const q = query.toLowerCase();
            arr = arr.filter(
                (r) =>
                    r.patientName.toLowerCase().includes(q) ||
                    r.code.toLowerCase().includes(q) ||
                    r.volunteer.toLowerCase().includes(q)
            );
        }

        arr.sort((a, b) => {
            const da = +new Date(a.createdAt);
            const db = +new Date(b.createdAt);
            return sort === "asc" ? da - db : db - da;
        });

        return arr;
    }, [records, branch, status, date, query, sort]);

    return (
        <>
            <Navbar />

            <div className={styles.csContainer}>
                <div className={styles.csHeader}>
                    <h1>Charge Slip Records</h1>
                    <p className={styles.csSubhead}>
                        Partner Merchant | {clinic}
                    </p>
                </div>

                {/* Filters (kept minimal like your slide) */}
                <div className={styles.csFilters}>
                    <select
                        className={styles.csSelect}
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                    >
                        {BRANCHES.map((b) => (
                            <option key={b} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>

                    <input
                        className={styles.csInput}
                        placeholder="Search by name or code"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <div className={styles.csInline}>
                        <label className={styles.csLabel}>Select Date:</label>
                        <input
                            type="date"
                            className={styles.csInput}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className={styles.csInline}>
                        <label className={styles.csLabel}>Sort:</label>
                        <select
                            className={styles.csSelect}
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            {SORTS.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.csHairline} />

                <div className={styles.csGrid}>
                    {list.map((item) => (
                        <article key={item.id} className={styles.csCard}>
                            {/* RED BAND HEADER */}
                            <div className={styles.csCardHead}>
                                <div className={styles.csPatient}>
                                    Patient: <strong>{item.patientName}</strong>
                                </div>
                                <div className={styles.csCode}>{item.code}</div>
                            </div>

                            {/* ROW WITH CHIPS + DATE (exact layout) */}
                            <div className={styles.csRowArea}>
                                <button
                                    type="button"
                                    className={styles.csChipSolid}
                                >
                                    Charge Slip
                                </button>

                                <a
                                    href={item.fileUrl}
                                    className={styles.csChipHollow}
                                >
                                    file view link here...
                                </a>

                                <div className={styles.csDateRight}>
                                    {prettyDate(item.createdAt)}
                                </div>
                            </div>

                            {/* FOOTER WITH GREEN PILL ON RIGHT */}
                            <div className={styles.csCardFoot}>
                                <span
                                    className={`${styles.csPill} ${styles.csPillGreen}`}
                                >
                                    {item.status}
                                </span>

                                <button
                                    type="button"
                                    className={styles.csView}
                                    onClick={() => setOpen(item)}
                                >
                                    view details <span aria-hidden>›</span>
                                </button>
                            </div>
                        </article>
                    ))}

                    {list.length === 0 && (
                        <div className={styles.csEmpty}>No records found.</div>
                    )}
                </div>

                {/* Minimal modal (unchanged) */}
                {open && (
                    <div
                        className={styles.csModalBackdrop}
                        onClick={() => setOpen(null)}
                    >
                        <div
                            className={styles.csModal}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className={styles.csModalTitle}>
                                Charge Slip Details
                            </h3>
                            <div className={styles.csModalBody}>
                                <div className={styles.csRow}>
                                    <span>Patient:</span>
                                    <strong>{open.patientName}</strong>
                                </div>
                                <div className={styles.csRow}>
                                    <span>Code:</span>
                                    <strong>{open.code}</strong>
                                </div>
                                <div className={styles.csRow}>
                                    <span>Volunteer:</span>
                                    <strong>{open.volunteer}</strong>
                                </div>
                                <div className={styles.csRow}>
                                    <span>Status:</span>
                                    <strong>{open.status}</strong>
                                </div>
                                <div className={styles.csRow}>
                                    <span>Date:</span>
                                    <strong>
                                        {prettyDate(open.createdAt)}
                                    </strong>
                                </div>
                                <div className={styles.csRow}>
                                    <span>File:</span>
                                    <a
                                        href={open.fileUrl}
                                        className={styles.csLink}
                                    >
                                        Open file
                                    </a>
                                </div>
                            </div>
                            <div className={styles.csModalFoot}>
                                <button
                                    className={styles.csBtnGhost}
                                    onClick={() => setOpen(null)}
                                >
                                    Close
                                </button>
                                <a
                                    className={styles.csBtnPrimary}
                                    href={open.fileUrl}
                                >
                                    View File
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
