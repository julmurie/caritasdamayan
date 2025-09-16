import React from "react";
import styles from "../../css/volunteer.module.css";

const Information = () => {
    return (
        <section className={styles.section}>
            <div className={styles.sectionHead}>
                <span className={styles.sectionTitle}>Initial Assessment</span>
                <button className={styles.editLink}>edit →</button>
            </div>

            <div className={styles.gridTable}>
                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Date:</div>
                    <div className={styles.cellValue}>MM/DD/YYYY</div>
                    <div className={styles.cellLabel}>Height:</div>
                    <div className={styles.cellValue}>-</div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Name:</div>
                    <div className={styles.cellValue}>-</div>
                    <div className={styles.cellLabel}>Weight:</div>
                    <div className={styles.cellValue}>-</div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Age:</div>
                    <div className={styles.cellValue}>-</div>
                    <div className={styles.cellLabel}>PR:</div>
                    <div className={styles.cellValue}>-</div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Gender:</div>
                    <div className={styles.cellValue}>-</div>
                    <div className={styles.cellLabel}>RR:</div>
                    <div className={styles.cellValue}>-</div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Temp:</div>
                    <div className={styles.cellValue}>-</div>
                    <div className={styles.cellLabel}>SpO2:</div>
                    <div className={styles.cellValue}>-</div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>BP:</div>
                    <div className={styles.cellValue}>-</div>
                    <div className={styles.cellLabel}></div>
                    <div className={styles.cellValue}></div>
                </div>
            </div>
        </section>
    );
};

export default Information;
