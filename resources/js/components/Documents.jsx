import React from "react";
import styles from "../../css/volunteer.module.css";

const Documents = () => {
    return (
        <section className={styles.section}>
            <div className={styles.sectionHead}>
                <span className={styles.sectionTitle}>Documents</span>
            </div>

            <div className={styles.gridTable}>
                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Uploaded Files:</div>
                    <div className={styles.cellValue}>None yet</div>
                    <div className={styles.cellLabel}>Status:</div>
                    <div className={styles.cellValue}>Pending</div>
                </div>
            </div>
        </section>
    );
};

export default Documents;
