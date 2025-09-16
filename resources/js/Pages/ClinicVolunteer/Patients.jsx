// resources/js/Pages/patient/Patients.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import styles from "../../../css/volunteer.module.css";

import Information from "@/components/Information";
import Documents from "@/components/Documents";
import RequestApproval from "@/components/RequestApproval";
import AssistanceRecord from "@/components/AssistanceRecord";

import { fetchPatientById } from "@/api/patients";

const Patients = () => {
    const [activeTab, setActiveTab] = useState("information");
    const [selectedId, setSelectedId] = useState(null);
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(false);

    // derive an age if the API doesn't send one
    const withAge = useMemo(() => {
        if (!patient) return null;
        if (patient.age) return patient; // backend already computed
        if (!patient.birthday) return patient;
        const b = new Date(patient.birthday);
        if (Number.isNaN(b.getTime())) return patient;
        const now = new Date();
        let age = now.getFullYear() - b.getFullYear();
        const m = now.getMonth() - b.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
        return { ...patient, age };
    }, [patient]);

    useEffect(() => {
        let cancelled = false;
        async function run() {
            if (!selectedId) return;
            setLoading(true);
            try {
                const data = await fetchPatientById(selectedId);
                if (!cancelled) setPatient(data);
            } catch (e) {
                console.error(e);
                if (!cancelled) setPatient(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        run();
        return () => {
            cancelled = true;
        };
    }, [selectedId]);

    const renderTab = () => {
        switch (activeTab) {
            case "information":
                return <Information patient={withAge} loading={loading} />;
            case "documents":
                return <Documents patientId={selectedId} />;
            case "approval":
                return <RequestApproval patientId={selectedId} />;
            case "history":
                return <AssistanceRecord patientId={selectedId} />;
            default:
                return <Information patient={withAge} loading={loading} />;
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.shell} style={{ "--sideW": "240px" }}>
                {/* ⬇️ pass selectedId so Sidebar can highlight and avoid re-selecting */}
                <Sidebar onSelect={setSelectedId} selectedId={selectedId} />

                <main className={styles.main}>
                    <div className={styles.row2col}>
                        <section className={styles.pHeaderCard}>
                            <div className={styles.pHeaderInner}>
                                <div className={styles.pAvatar} aria-hidden />
                                <div className={styles.pMeta}>
                                    <h2 className={styles.pName}>
                                        {withAge
                                            ? `${
                                                  withAge.patient_lname ?? "—"
                                              }, ${
                                                  withAge.patient_fname ?? "—"
                                              }`
                                            : "—"}
                                    </h2>
                                    <div className={styles.pSub}>
                                        {withAge?.gender ?? "—"}
                                        {withAge?.age != null
                                            ? ` | ${withAge.age} years old`
                                            : ""}
                                    </div>
                                    <div className={styles.pCodes}>
                                        <div>
                                            <span className={styles.pCodeLabel}>
                                                Patient Number:
                                            </span>
                                            <span className={styles.pCodeValue}>
                                                {withAge?.patient_no ?? "—"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className={styles.pCodeLabel}>
                                                Patient Code:
                                            </span>
                                            <span className={styles.pCodeValue}>
                                                {withAge?.patient_code ?? "—"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Add Documents / Add Appointment panels (unchanged) */}
                        <div className={styles.rightPanels}>
                            <aside className={styles.docPanel}>
                                <h4 className={styles.panelTitle}>
                                    Add Documents
                                </h4>
                                <div className={styles.docGrid}>
                                    <button className={styles.docBtn}>
                                        Score Card
                                    </button>
                                    <button className={styles.docBtn}>
                                        Medicine Request
                                    </button>
                                    <button className={styles.docBtn}>
                                        Laboratory Request
                                    </button>
                                </div>
                            </aside>

                            <aside className={styles.docPanel}>
                                <h4 className={styles.panelTitle}>
                                    Add Appointment
                                </h4>
                                <div className={styles.docGrid}>
                                    <button className={styles.docBtn}>
                                        Donated Item
                                    </button>
                                    <button className={styles.docBtn}>
                                        Referral
                                    </button>
                                    <button className={styles.docBtn}>
                                        Initial Assessment
                                    </button>
                                    <button className={styles.docBtn}>
                                        Consultation
                                    </button>
                                </div>
                            </aside>
                        </div>
                    </div>

                    {/* Tabs */}
                    <ul className={styles.tabBar}>
                        {[
                            ["information", "Information"],
                            ["documents", "Documents"],
                            ["approval", "Request Approval"],
                            ["history", "Assistance Record"],
                        ].map(([key, label]) => (
                            <li
                                key={key}
                                className={`${styles.tab} ${
                                    activeTab === key ? styles.tabActive : ""
                                }`}
                                onClick={() => setActiveTab(key)}
                                style={{ cursor: "pointer" }}
                            >
                                {label}
                            </li>
                        ))}
                    </ul>

                    <div className={styles.tabContent}>{renderTab()}</div>
                </main>
            </div>
        </>
    );
};

export default Patients;
