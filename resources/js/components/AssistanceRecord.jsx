import React from "react";
import styles from "../../css/volunteer.module.css";

const AssistanceRecord = () => {
    return (
        <section className={styles.section}>
            <div className={styles.sectionHead}>
                <span className={styles.sectionTitle}>Assistance Record</span>
            </div>

            <div className={styles.gridTable}>
                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Previous Requests:</div>
                    <div className={styles.cellValue}>No history available</div>
                </div>
            </div>
        </section>
    );
};

export default AssistanceRecord;
