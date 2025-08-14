import styles from "../../css/scorecard.module.css";

export default function Scorecard() {
    const criticalCases = [
        "All cancers (malignant masses) including carcinoma in situ and related conditions",
        "Blood Dyscrasias (Leukemia, Idiopathic Thrombocytopenic Purpura, etc)",
        "Central Nervous System Infections (Poliomyelitis/Meningitis/Encephalitis)",
        "Cerebrovascular Accident (Stroke, Cerebral, Cerebellar and Intracranial Hemorrhage) and related conditions",
        "Chronic Cardiovascular Diseases (Complicated Hypertension and related conditions, Aortic Dissection, Abdominal Aortic Aneurysm, etc.)",
        "Chronic Endocrine Disorders and their complications (Dyslipidemia, Impaired Fasting Glucose, Impaired Glucose Tolerance, Obesity, Diabetes Mellitus, Hormonal Dysfunctions, etc.) excluding surgical treatment/procedures for obesity-exclusion",
        "Chronic Gastrointestinal Diseases (ex. Irritable Bowel Syndrome, Crohn’s disease)",
        "Chronic Genito-urinary Disorders",
        "Chronic Kidney Disease/Failure",
        "Chronic Liver Parenchymal Diseases (Liver Cirrhosis, Chronic hepatitis, etc)",
        "Chronic Pulmonary Diseases except asthma (COPD, emphysema, and other chronic lung disease)",
        "Collagen-Vascular/Connective Tissue/Immunologic Disorders",
        "Complications of immuno-compromised state (except HIV/AIDS)",
    ];

    return (
        <div className={styles.scorecard}>
            {/* Title */}
            <div className={styles.header}>
                Caritas Manila Assistance Score Card (CMAS CARD)
            </div>

            {/* Indicator 1 */}
            <section className={styles.section}>
                <div className={styles.bar}>
                    <div>
                        Indicator 1 <small> | Level of Poor</small>
                    </div>
                    <div className={styles.barRight} />
                </div>

                <div className={styles.optionsGrid}>
                    <label className={styles.option}>
                        <input type="radio" name="poverty" value="ultra" />
                        <span>
                            Ultra Poor <small>(Below 12,000 income)</small>
                        </span>
                    </label>

                    <label className={styles.option}>
                        <input type="radio" name="poverty" value="moderate" />
                        <span>
                            Moderate <small>(12,001–20,000)</small>
                        </span>
                    </label>

                    <label className={styles.option}>
                        <input type="radio" name="poverty" value="vnp" />
                        <span>
                            Vulnerable Non Poor <small>(Above 20,001)</small>
                        </span>
                    </label>
                </div>
            </section>

            {/* Indicator 2 */}
            <section className={styles.section}>
                <div className={styles.bar}>
                    <div>
                        Indicator 2 <small> | Household</small>
                    </div>
                    <div className={styles.barRight} />
                </div>

                <div className={styles.optionsGrid}>
                    <label className={styles.option}>
                        <input type="radio" name="household" value="gt5" />
                        <span>More than 5 members</span>
                    </label>
                    <label className={styles.option}>
                        <input type="radio" name="household" value="3to4" />
                        <span>3–4 members</span>
                    </label>
                    <label className={styles.option}>
                        <input type="radio" name="household" value="1to2" />
                        <span>1–2 members</span>
                    </label>
                    <label className={styles.option}>
                        <input type="radio" name="household" value="1" />
                        <span>1 person</span>
                    </label>
                </div>
            </section>

            {/* Indicator 3 */}
            <section className={styles.section}>
                <div className={styles.bar}>
                    <div>
                        Indicator 3 <small> | Medical Cases</small>
                    </div>
                    <div className={styles.barRight}>
                        <input
                            className={styles.search}
                            type="search"
                            placeholder="Search"
                        />
                    </div>
                </div>

                {/* Critical/Dreaded */}
                <details className={styles.fold} open>
                    <summary className={styles.foldSummary}>
                        Critical/Dreaded Case
                    </summary>
                    <ol className={styles.caseList}>
                        {criticalCases.map((text, i) => (
                            <li key={i} className={styles.caseItem}>
                                <div className={styles.caseText}>{text}</div>
                                <input
                                    className={styles.caseRadio}
                                    type="radio"
                                    name="critical"
                                    value={i + 1}
                                />
                            </li>
                        ))}
                    </ol>
                </details>

                {/* Other groups (placeholders) */}
                <details className={styles.fold}>
                    <summary className={styles.foldSummary}>
                        Non-dreaded Case
                    </summary>
                    <div style={{ padding: 12, color: "#6b7280" }}>
                        — items go here —
                    </div>
                </details>

                <details className={styles.fold}>
                    <summary className={styles.foldSummary}>
                        Economic and Social Crisis
                    </summary>
                    <div style={{ padding: 12, color: "#6b7280" }}>
                        — items go here —
                    </div>
                </details>

                <details className={styles.fold}>
                    <summary className={styles.foldSummary}>
                        Situational and Spiritual Crisis
                    </summary>
                    <div style={{ padding: 12, color: "#6b7280" }}>
                        — items go here —
                    </div>
                </details>
            </section>

            {/* Scoring table */}
            <div className={styles.scoring}>
                <table className={styles.scoringTable}>
                    <thead>
                        <tr>
                            <th>Scoring</th>
                            <th>Maximum Value of Assistance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>10 – 12 pts</td>
                            <td>2,501 – 5,000</td>
                        </tr>
                        <tr>
                            <td>7 – 9 pts</td>
                            <td>2,001 – 2,500</td>
                        </tr>
                        <tr>
                            <td>4 – 6 pts</td>
                            <td>1,001 – 2,000</td>
                        </tr>
                        <tr>
                            <td>1 – 3 pts</td>
                            <td>500 – 1,000</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr className={styles.footnote}>
                            <td colSpan={2}>
                                * any assistance higher than 5,000 must be
                                referred to Caritas Manila – Islas &amp; Damayan
                                Office for review &amp; reconsideration of
                                Program Officer/Manager and approved by the
                                Executive Director
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
