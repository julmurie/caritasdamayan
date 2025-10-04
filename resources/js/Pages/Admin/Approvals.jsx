import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import styles from "../../../css/approvals.module.css";

// demo data (replace with backend fetch)
const MOCK_CHARGE_SLIPS = [
    {
        id: "CL01-ABC-0001",
        patientName: "DELA CRUZ, JUAN",
        volunteer: "username.01",
        role: "Clinic Volunteer",
        createdAt: "July 05, 2025 | 5:00pm",
        docs: [
            { label: "Score Card", url: "#", created: "mm/dd/yy hh:mm" },
            { label: "Charge Slip", url: "#", created: "mm/dd/yy hh:mm" },
        ],
        delayed: "3 Days Delayed",
    },
    {
        id: "CL01-ABC-0002",
        patientName: "SANTOS, MARIA",
        volunteer: "username.02",
        role: "Clinic Volunteer",
        createdAt: "July 05, 2025 | 5:00pm",
        docs: [
            { label: "Score Card", url: "#", created: "mm/dd/yy hh:mm" },
            { label: "Charge Slip", url: "#", created: "mm/dd/yy hh:mm" },
        ],
        delayed: null,
    },
];

const MOCK_SOA = [
    {
        id: "PM01-ABC-0001",
        merchant: "Generika",
        partner: "username.01",
        role: "Partner Merchant",
        createdAt: "July 05, 2025 | 5:00pm",
        docs: [{ label: "SOA", url: "#", created: "mm/dd/yy hh:mm" }],
    },
    {
        id: "PM01-ABC-0002",
        merchant: "Generika",
        partner: "username.02",
        role: "Partner Merchant",
        createdAt: "July 05, 2025 | 5:00pm",
        docs: [{ label: "SOA", url: "#", created: "mm/dd/yy hh:mm" }],
    },
];

function Approvals() {
    const [chargeSlips] = useState(MOCK_CHARGE_SLIPS);
    const [soas] = useState(MOCK_SOA);

    return (
        <div>
            <Navbar />

            <div className={styles.page}>
                {/* === CHARGE SLIP COLUMN === */}
                <section className={styles.panel}>
                    <h1 className={styles.panelTitle}>Charge Slip</h1>

                    {/* Filters */}
                    <div className={styles.filters}>
                        <select className={styles.select}>
                            <option>Metro Manila Branch</option>
                            <option>Cavite Branch</option>
                            <option>Laguna Branch</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search by name or code"
                            className={styles.input}
                        />
                        <input type="date" className={styles.input} />
                        <select className={styles.select}>
                            <option>Newest to Oldest</option>
                            <option>Oldest to Newest</option>
                        </select>
                    </div>

                    {/* List */}
                    <div className={styles.cardList}>
                        {chargeSlips.map((item) => (
                            <article key={item.id} className={styles.card}>
                                <div className={styles.cardHead}>
                                    <span>
                                        Patient:{" "}
                                        <strong>{item.patientName}</strong>
                                    </span>
                                    <span className={styles.code}>
                                        {item.id}
                                    </span>
                                </div>

                                <div className={styles.cardBody}>
                                    <div className={styles.userRow}>
                                        <div className={styles.avatar} />
                                        <div>
                                            <div className={styles.username}>
                                                {item.volunteer}
                                            </div>
                                            <div className={styles.role}>
                                                {item.role}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.meta}>
                                        Requested Approval on {item.createdAt}
                                    </div>
                                    <p className={styles.patientNote}>
                                        Patient is …
                                    </p>

                                    <div className={styles.docs}>
                                        {item.docs.map((d, i) => (
                                            <div
                                                key={i}
                                                className={styles.docRow}
                                            >
                                                <span
                                                    className={styles.docLabel}
                                                >
                                                    {d.label}
                                                </span>
                                                <a
                                                    href={d.url}
                                                    className={styles.docLink}
                                                >
                                                    file view link here...
                                                </a>
                                                <span
                                                    className={styles.docMeta}
                                                >
                                                    Created at: {d.created}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.actions}>
                                        <input
                                            type="text"
                                            placeholder="Add remark..."
                                            className={styles.input}
                                        />
                                        <button className={styles.btnGreen}>
                                            Approve
                                        </button>
                                        <button className={styles.btnRed}>
                                            Reject
                                        </button>
                                    </div>

                                    {item.delayed && (
                                        <div className={styles.delay}>
                                            {item.delayed}
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* === SOA COLUMN === */}
                <section className={styles.panel}>
                    <h1 className={styles.panelTitle}>SOA</h1>

                    {/* Filters */}
                    <div className={styles.filters}>
                        <select className={styles.select}>
                            <option>Generika</option>
                            <option>Mercury Drug</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search by name or code"
                            className={styles.input}
                        />
                        <input type="date" className={styles.input} />
                        <select className={styles.select}>
                            <option>Newest to Oldest</option>
                            <option>Oldest to Newest</option>
                        </select>
                    </div>

                    {/* List */}
                    <div className={styles.cardList}>
                        {soas.map((item) => (
                            <article key={item.id} className={styles.card}>
                                <div className={styles.cardHead}>
                                    <span>
                                        Partner Merchant:{" "}
                                        <strong>{item.merchant}</strong>
                                    </span>
                                    <span className={styles.code}>
                                        {item.id}
                                    </span>
                                </div>

                                <div className={styles.cardBody}>
                                    <div className={styles.userRow}>
                                        <div className={styles.avatar} />
                                        <div>
                                            <div className={styles.username}>
                                                {item.partner}
                                            </div>
                                            <div className={styles.role}>
                                                {item.role}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.meta}>
                                        Delivered on {item.createdAt}
                                    </div>

                                    <div className={styles.docs}>
                                        {item.docs.map((d, i) => (
                                            <div
                                                key={i}
                                                className={styles.docRow}
                                            >
                                                <span
                                                    className={styles.docLabel}
                                                >
                                                    {d.label}
                                                </span>
                                                <a
                                                    href={d.url}
                                                    className={styles.docLink}
                                                >
                                                    file view link here...
                                                </a>
                                                <span
                                                    className={styles.docMeta}
                                                >
                                                    Created at: {d.created}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.actions}>
                                        <input
                                            type="text"
                                            placeholder="Add remark..."
                                            className={styles.input}
                                        />
                                        <button className={styles.btnGreen}>
                                            Approve
                                        </button>
                                        <button className={styles.btnRed}>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Approvals;
