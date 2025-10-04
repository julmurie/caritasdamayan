import React from "react";
import styles from "../../css/volunteer.module.css";

const show = (v) =>
    v === null || v === undefined || String(v).trim() === "" ? "–" : String(v);

const fullName = (p) => {
    if (!p) return "–";
    const parts = [p.patient_lname, p.patient_fname, p.patient_mname]
        .filter(Boolean)
        .map((s) => s.trim());
    if (!parts.length) return "–";
    const [ln, fn, mn] = parts;
    return [ln, [fn, mn && `${mn[0]}.`].filter(Boolean).join(" ")]
        .filter(Boolean)
        .join(", ");
};

const ageFromBirthday = (dateStr) => {
    if (!dateStr) return "–";
    const d = new Date(dateStr);
    if (isNaN(d)) return "–";
    const t = new Date();
    let age = t.getFullYear() - d.getFullYear();
    const m = t.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--;
    return `${age}`;
};

const yesno = (v) =>
    v === true || v === 1 || v === "1"
        ? "Yes"
        : v === false || v === 0 || v === "0"
        ? "No"
        : "–";

export default function Information({ patient, onEdit }) {
    return (
        <section className={styles.section}>
            <div className={styles.sectionHead}>
                <div className={styles.sectionTitle}>Patient Profile</div>
                <button
                    type="button"
                    className={styles.editLink}
                    onClick={onEdit}
                >
                    Edit
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                        />
                    </svg>
                </button>
            </div>

            <div className={styles.gridTable}>
                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Name:</div>
                    <div className={styles.cellValue}>{fullName(patient)}</div>

                    <div className={styles.cellLabel}>Classification:</div>
                    <div className={styles.cellValue}>
                        {patient?.classification_cm
                            ? patient.classification_cm === "FP"
                                ? "Beneficiary (FP)"
                                : "Beneficiary (NFP)"
                            : "–"}
                    </div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Age:</div>
                    <div className={styles.cellValue}>
                        {ageFromBirthday(patient?.birthday)}
                    </div>

                    <div className={styles.cellLabel}>Category:</div>
                    <div className={styles.cellValue}>
                        {show(patient?.category)}
                    </div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Gender:</div>
                    <div className={styles.cellValue}>
                        {show(patient?.gender)}
                    </div>

                    <div className={styles.cellLabel}>Booklet#:</div>
                    <div className={styles.cellValue}>
                        {show(patient?.booklet_no)}
                    </div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Birthday:</div>
                    <div className={styles.cellValue}>
                        {patient?.birthday
                            ? new Date(patient.birthday).toLocaleDateString()
                            : "–"}
                    </div>

                    <div className={styles.cellLabel}>
                        Is Head of the Family:
                    </div>
                    <div className={styles.cellValue}>
                        {patient?.classification_cm === "FP"
                            ? yesno(patient?.is_head_family)
                            : "–"}
                    </div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Contact No:</div>
                    <div className={styles.cellValue}>
                        {patient?.contact_no || "–"}
                    </div>

                    <div className={styles.cellLabel}>Valid ID #:</div>
                    <div className={styles.cellValue}>
                        {show(patient?.valid_id_no)}
                    </div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Address:</div>
                    <div className={styles.cellValue}>
                        {show(patient?.address)}
                    </div>

                    <div className={styles.cellLabel}>
                        Endorsed for CM Family Partner?
                    </div>
                    <div className={styles.cellValue}>
                        {patient?.classification_cm === "NFP"
                            ? yesno(patient?.endorsed_as_fp)
                            : "–"}
                    </div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Clinic:</div>
                    <div className={styles.cellValue}>
                        {show(patient?.clinic)}
                    </div>

                    <div className={styles.cellLabel}>First Time Visit?</div>
                    <div className={styles.cellValue}>
                        {patient?.classification_cm === "NFP"
                            ? yesno(patient?.first_time_visit)
                            : "–"}
                    </div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.cellLabel}>Parish:</div>
                    <div className={styles.cellValue}>
                        {show(patient?.parish)}
                    </div>

                    <div className={styles.cellLabel}>PhilHealth No.:</div>
                    <div className={styles.cellValue}>
                        {patient?.has_philhealth
                            ? show(patient?.philhealth_no)
                            : "–"}
                    </div>
                </div>
            </div>
        </section>
    );
}
