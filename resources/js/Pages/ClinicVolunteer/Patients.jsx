import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import styles from "../../../css/volunteer.module.css";
import { Link } from "@inertiajs/react";

import Information from "@/components/Information";
import Documents from "@/components/Documents";
import RequestApproval from "@/components/RequestApproval";
import AssistanceRecord from "@/components/AssistanceRecord";

const Patients = () => {
    const [activeTab, setActiveTab] = useState("information");

    const renderTab = () => {
        switch (activeTab) {
            case "information":
                return <Information />;
            case "documents":
                return <Documents />;
            case "approval":
                return <RequestApproval />;
            case "history":
                return <AssistanceRecord />;
            default:
                return <Information />;
        }
    };

    return (
        <>
            <Navbar />

            {/* 2-col shell with push sidebar */}
            <div className={styles.shell} style={{ "--sideW": "240px" }}>
                {/* Sidebar */}
                <Sidebar />

                {/* Main content */}
                <main className={styles.main}>
                    {/* ===== TOP: Patient card (left) + Add panels (right) ===== */}
                    <div className={styles.row2col}>
                        {/* Patient header card (kept) */}
                        <section className={styles.pHeaderCard}>
                            <div className={styles.pHeaderInner}>
                                <div className={styles.pAvatar} aria-hidden />
                                <div className={styles.pMeta}>
                                    <h2 className={styles.pName}>
                                        Dela Cruz, Juan
                                    </h2>
                                    <div className={styles.pSub}>
                                        Male | 38 years old
                                    </div>

                                    <div className={styles.pCodes}>
                                        <div>
                                            <span className={styles.pCodeLabel}>
                                                Patient Number:
                                            </span>
                                            <span className={styles.pCodeValue}>
                                                00001
                                            </span>
                                        </div>
                                        <div>
                                            <span className={styles.pCodeLabel}>
                                                Patient Code:
                                            </span>
                                            <span className={styles.pCodeValue}>
                                                ABC01
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Right side: Add Documents + Add Appointment */}
                        <div className={styles.rightPanels}>
                            <aside className={styles.docPanel}>
                                <h4 className={styles.panelTitle}>
                                    Add Documents
                                </h4>
                                <div className={styles.docGrid}>
                                    <Link
                                        href="/volunteer/documents/score-card"
                                        className={styles.docBtn}
                                    >
                                        Score Card
                                    </Link>
                                    <Link
                                        href="/volunteer/documents/medicine-request"
                                        className={styles.docBtn}
                                    >
                                        Medicine Request
                                    </Link>
                                    <Link
                                        href="/volunteer/documents/laboratory-request"
                                        className={styles.docBtn}
                                    >
                                        Laboratory Request
                                    </Link>
                                </div>
                            </aside>

                            <aside className={styles.docPanel}>
                                <h4 className={styles.panelTitle}>
                                    Add Appointment
                                </h4>
                                <div className={styles.docGrid}>
                                    <Link
                                        href="/volunteer/appointments/donated-item"
                                        className={styles.docBtn}
                                    >
                                        Donated Item
                                    </Link>
                                    <Link
                                        href="/volunteer/appointments/referral"
                                        className={styles.docBtn}
                                    >
                                        Referral
                                    </Link>
                                    <Link
                                        href="/volunteer/appointments/initial-assessment"
                                        className={styles.docBtn}
                                    >
                                        Initial Assessment
                                    </Link>
                                    <Link
                                        href="/volunteer/appointments/consultation"
                                        className={styles.docBtn}
                                    >
                                        Consultation
                                    </Link>
                                </div>
                            </aside>
                        </div>
                    </div>

                    {/* ===== TABS (kept) ===== */}
                    <ul className={styles.tabBar}>
                        <li
                            className={`${styles.tab} ${
                                activeTab === "information"
                                    ? styles.tabActive
                                    : ""
                            }`}
                            onClick={() => setActiveTab("information")}
                        >
                            Information
                        </li>
                        <li
                            className={`${styles.tab} ${
                                activeTab === "documents"
                                    ? styles.tabActive
                                    : ""
                            }`}
                            onClick={() => setActiveTab("documents")}
                        >
                            Documents
                        </li>
                        <li
                            className={`${styles.tab} ${
                                activeTab === "approval" ? styles.tabActive : ""
                            }`}
                            onClick={() => setActiveTab("approval")}
                        >
                            Request Approval
                        </li>
                        <li
                            className={`${styles.tab} ${
                                activeTab === "history" ? styles.tabActive : ""
                            }`}
                            onClick={() => setActiveTab("history")}
                        >
                            Assistance Record
                        </li>
                    </ul>

                    {/* ===== TAB BODY (only this area changes on click) ===== */}
                    <div className={styles.tabContent}>{renderTab()}</div>
                </main>
            </div>
        </>
    );
};

export default Patients;
