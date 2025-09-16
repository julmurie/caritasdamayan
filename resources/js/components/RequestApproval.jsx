import React from "react";
import styles from "../../css/volunteer.module.css";

const RequestApproval = () => {
    return (
        <section className={styles.section}>
            <div className={styles.sectionHead}>
                <span className={styles.sectionTitle}>Request Approval</span>
            </div>

            <div className={styles.gridTable}>
                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Last Request:</div>
                    <div className={styles.cellValue}>None</div>
                    <div className={styles.cellLabel}>Approval Status:</div>
                    <div className={styles.cellValue}>Not submitted</div>
                </div>
            </div>
        </section>
    );
};

export default RequestApproval;
