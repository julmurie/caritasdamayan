import React, { useEffect, useState } from "react";
import styles from "../../../css/volunteer.module.css";

export default function AddPatientModal({ open, onClose, onSave }) {
    const [classification, setClassification] = useState(""); // FP / NFP
    const [hasPhilhealth, setHasPhilhealth] = useState(null); // true / false

    // close on Esc
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose?.();
        }
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        // helper to coerce to real boolean
        const toBool = (val) => {
            if (val === "1" || val === 1 || val === true) return true;
            if (val === "0" || val === 0 || val === false) return false;
            return false; // default to false if empty
        };

        const payload = {
            patient_fname: fd.get("patient_fname")?.trim() || "",
            patient_lname: fd.get("patient_lname")?.trim() || "",
            patient_mname: fd.get("patient_mname")?.trim() || null,
            gender: fd.get("gender") || null,
            birthday: fd.get("birthday") || null,
            contact_no: fd.get("contact_no")?.trim() || null,
            address: fd.get("address")?.trim() || null,
            clinic: fd.get("clinic")?.trim() || null,
            parish: fd.get("parish")?.trim() || null,

            classification_cm: fd.get("classification_cm") || null,
            category: fd.get("category") || null,

            // FP
            booklet_no: fd.get("booklet_no")?.trim() || null,
            is_head_family: toBool(fd.get("is_head_family")),

            // NFP
            valid_id_no: fd.get("valid_id_no")?.trim() || null,
            endorsed_as_fp: toBool(fd.get("endorsed_as_fp")),
            first_time_visit: toBool(fd.get("first_time_visit")),

            // Philhealth
            has_philhealth: toBool(fd.get("has_philhealth")),
            philhealth_no: fd.get("philhealth_no")?.trim() || null,
        };

        try {
            await onSave(payload);
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to save patient");
        }
    }

    return (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Patient Information</h3>
                    <button
                        type="button"
                        className={styles.modalClose}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className={styles.modalBodyScrollable}
                >
                    {/* Names */}
                    <div className={styles.formRow}>
                        <label
                            htmlFor="patient_fname"
                            className={styles.formLabel}
                        >
                            First Name <span className={styles.req}>*</span>
                        </label>
                        <input
                            id="patient_fname"
                            name="patient_fname"
                            required
                            className={styles.formControl}
                            type="text"
                            placeholder="e.g. Juan"
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label
                            htmlFor="patient_lname"
                            className={styles.formLabel}
                        >
                            Last Name <span className={styles.req}>*</span>
                        </label>
                        <input
                            id="patient_lname"
                            name="patient_lname"
                            required
                            className={styles.formControl}
                            type="text"
                            placeholder="e.g. Dela Cruz"
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label
                            htmlFor="patient_mname"
                            className={styles.formLabel}
                        >
                            Middle Name
                        </label>
                        <input
                            id="patient_mname"
                            name="patient_mname"
                            className={styles.formControl}
                            type="text"
                            placeholder="(optional)"
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Gender</label>
                        <select
                            name="gender"
                            className={styles.formInput}
                            defaultValue=""
                        >
                            <option value="" disabled hidden>
                                Select
                            </option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Birthday</label>
                        <input
                            type="date"
                            name="birthday"
                            className={styles.formInput}
                        />
                    </div>

                    {/* Contact */}
                    <div className={styles.formRow}>
                        <label
                            htmlFor="contact_no"
                            className={styles.formLabel}
                        >
                            Contact No
                        </label>
                        <input
                            id="contact_no"
                            name="contact_no"
                            className={styles.formControl}
                            type="text"
                            placeholder="e.g. 09xxxxxxxxx"
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label htmlFor="address" className={styles.formLabel}>
                            Address
                        </label>
                        <input
                            id="address"
                            name="address"
                            className={styles.formControl}
                            type="text"
                            placeholder="Street / Barangay / City"
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Clinic</label>
                        <input name="clinic" className={styles.formInput} />
                    </div>
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Parish</label>
                        <input name="parish" className={styles.formInput} />
                    </div>

                    {/* Classification */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            Classification to CM Beneficiary
                        </label>
                        <div className={styles.inlineGroup}>
                            <label>
                                <input
                                    type="radio"
                                    name="classification_cm"
                                    value="FP"
                                    checked={classification === "FP"}
                                    onChange={() => setClassification("FP")}
                                />{" "}
                                FP (Family Partner)
                            </label>
                            <label style={{ marginLeft: "12px" }}>
                                <input
                                    type="radio"
                                    name="classification_cm"
                                    value="NFP"
                                    checked={classification === "NFP"}
                                    onChange={() => setClassification("NFP")}
                                />{" "}
                                NFP (Non-Family Partner)
                            </label>
                        </div>
                    </div>

                    {/* FP fields */}
                    {classification === "FP" && (
                        <>
                            <div className={styles.formRow}>
                                <label className={styles.formLabel}>
                                    Booklet #
                                </label>
                                <input
                                    name="booklet_no"
                                    className={styles.formInput}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <label className={styles.formLabel}>
                                    Head of Family?
                                </label>
                                <div className={styles.inlineGroup}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="is_head_family"
                                            value="1"
                                        />{" "}
                                        Yes
                                    </label>
                                    <label style={{ marginLeft: "12px" }}>
                                        <input
                                            type="radio"
                                            name="is_head_family"
                                            value="0"
                                            defaultChecked
                                        />{" "}
                                        No
                                    </label>
                                </div>
                            </div>
                        </>
                    )}

                    {/* NFP fields */}
                    {classification === "NFP" && (
                        <>
                            <div className={styles.formRow}>
                                <label className={styles.formLabel}>
                                    Valid ID #
                                </label>
                                <input
                                    name="valid_id_no"
                                    className={styles.formInput}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <label className={styles.formLabel}>
                                    Endorsed for CM Family Partner?
                                </label>
                                <div className={styles.inlineGroup}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="endorsed_as_fp"
                                            value="1"
                                        />{" "}
                                        Yes
                                    </label>
                                    <label style={{ marginLeft: "12px" }}>
                                        <input
                                            type="radio"
                                            name="endorsed_as_fp"
                                            value="0"
                                            defaultChecked
                                        />{" "}
                                        No
                                    </label>
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <label className={styles.formLabel}>
                                    First time visit?
                                </label>
                                <div className={styles.inlineGroup}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="first_time_visit"
                                            value="1"
                                        />{" "}
                                        Yes
                                    </label>
                                    <label style={{ marginLeft: "12px" }}>
                                        <input
                                            type="radio"
                                            name="first_time_visit"
                                            value="0"
                                            defaultChecked
                                        />{" "}
                                        No
                                    </label>
                                </div>
                            </div>
                        </>
                    )}

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Category</label>
                        <select
                            name="category"
                            className={styles.formInput}
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select category
                            </option>
                            <option value="Caritas Manila Program Volunteers">
                                Caritas Manila Program Volunteers
                            </option>
                            <option value="Caritas in Action Referrals">
                                Caritas in Action Referrals
                            </option>
                            <option value="Referrals from Other Caritas Manila Clinics">
                                Referrals from Other Caritas Manila Clinics
                            </option>
                            <option value="Caritas Manila Employees">
                                Caritas Manila Employees
                            </option>
                            <option value="Parish Employees">
                                Parish Employees
                            </option>
                            <option value="Parish Volunteers or Lay Leaders">
                                Parish Volunteers or Lay Leaders
                            </option>
                            <option value="YSLEP Scholars">
                                YSLEP Scholars
                            </option>
                            <option value="Other Program Beneficiaries">
                                Other Program Beneficiaries
                            </option>
                        </select>
                    </div>

                    {/* PhilHealth */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>PhilHealth</label>
                        <div className={styles.inlineGroup}>
                            <label>
                                <input
                                    type="radio"
                                    name="has_philhealth"
                                    value="1"
                                    checked={hasPhilhealth === true}
                                    onChange={() => setHasPhilhealth(true)}
                                />{" "}
                                Yes
                            </label>
                            <label style={{ marginLeft: "12px" }}>
                                <input
                                    type="radio"
                                    name="has_philhealth"
                                    value="0"
                                    checked={hasPhilhealth === false}
                                    onChange={() => setHasPhilhealth(false)}
                                />{" "}
                                No
                            </label>
                        </div>
                    </div>
                    {hasPhilhealth && (
                        <div className={styles.formRow}>
                            <label className={styles.formLabel}>
                                PhilHealth No.
                            </label>
                            <input
                                name="philhealth_no"
                                className={styles.formInput}
                            />
                        </div>
                    )}

                    <div className={styles.modalFooter}>
                        <button
                            type="button"
                            className={styles.btnGhost}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className={styles.btnPrimary}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
