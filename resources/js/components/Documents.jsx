import React, { useEffect, useState } from "react";
import styles from "../../css/volunteer.module.css";

const Documents = ({ patientId }) => {
    const [documents, setDocuments] = useState([]);

    // ✅ Listen for new documents in real time
    useEffect(() => {
        const handleNewDoc = (e) => {
            const doc = e.detail;
            // only update if this document belongs to this patient
            if (String(doc.patient_id) === String(patientId)) {
                setDocuments((prev) => [doc, ...prev]);
            }
        };

        window.addEventListener("document-added", handleNewDoc);
        return () => window.removeEventListener("document-added", handleNewDoc);
    }, [patientId]);

    return (
        <section className={styles.section}>
            <div className={styles.sectionHead}>
                <span className={styles.sectionTitle}>Documents</span>
            </div>

            {documents.length === 0 ? (
                <div className={styles.gridTable}>
                    <div className={styles.gridRow}>
                        <div className={styles.cellLabel}>Uploaded Files:</div>
                        <div className={styles.cellValue}>None yet</div>
                        <div className={styles.cellLabel}>Status:</div>
                        <div className={styles.cellValue}>Pending</div>
                    </div>
                </div>
            ) : (
                <div className={styles.gridTable}>
                    {documents.map((doc, index) => (
                        <div key={index} className={styles.gridRow}>
                            <div className={styles.cellLabel}>
                                Document Type:
                            </div>
                            <div className={styles.cellValue}>
                                {doc.doc_type}
                            </div>

                            <div className={styles.cellLabel}>Status:</div>
                            <div className={styles.cellValue}>
                                {doc.status || "Pending"}
                            </div>

                            <div className={styles.cellLabel}>File:</div>
                            <div className={styles.cellValue}>
                                {doc.file_path ? (
                                    <a
                                        href={doc.file_path}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View File
                                    </a>
                                ) : (
                                    "—"
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Documents;
