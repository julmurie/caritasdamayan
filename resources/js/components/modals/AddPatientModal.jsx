import React, { useState } from "react";
import ReactDOM from "react-dom";
import styles from "../../../css/volunteer.module.css";

const CATEGORIES = [
    "Caritas Manila Program Volunteers",
    "Caritas in Action Referrals",
    "Referrals from Other Caritas Manila Clinics",
    "Caritas Manila Employees",
    "Parish Employees",
    "Parish Volunteers or Lay Leaders",
    "YSLEP Scholars",
    "Other Program Beneficiaries (e.g., Restorative Justice, Sanlakbay, etc.)",
];

export default function AddPatientModal({ open, onClose, onSubmit }) {
    if (!open) return null;

    const root = document.getElementById("modal-root");
    if (!root) return null;

    const [isFP, setIsFP] = useState(null); // true => FP, false => NFP, null => not selected

    function handleClassificationChange(e) {
        const v = e.target.value;
        if (v === "FP") setIsFP(true);
        else if (v === "NFP") setIsFP(false);
        else setIsFP(null);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const payload = {
            patient_fname: form.get("patient_fname"),
            patient_lname: form.get("patient_lname"),
            patient_mname: form.get("patient_mname"),
            gender: form.get("gender"),
            birthday: form.get("birthday"),
            contact_no: form.get("contact_no"),
            address: form.get("address"),
            clinic: form.get("clinic"),
            parish: form.get("parish"),
            classification_cm: form.get("classification_cm"),
            category: form.get("category"),
            booklet_no: form.get("booklet_no"),
            is_head_family: form.get("is_head_family") === "on" ? 1 : 0,
            valid_id_no: form.get("valid_id_no"),
            endorsed_as_fp: form.get("endorsed_as_fp") === "on" ? 1 : 0,
            first_time_visit: form.get("first_time_visit") === "on" ? 1 : 0,
        };
        onSave(payload);
    };

    return ReactDOM.createPortal(
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
            <div className={styles.modalCard}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Patient Information</h3>
                    <button
                        type="button"
                        className={styles.modalClose}
                        aria-label="Close"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Body (scrollable) */}
                <div className={styles.modalBody}>
                    <form className={styles.formGrid} onSubmit={handleSubmit}>
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

                        {/* Demographics */}
                        <div className={styles.formRow}>
                            <label
                                htmlFor="gender"
                                className={styles.formLabel}
                            >
                                Gender
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                className={styles.formControl}
                            >
                                <option value="">Select</option>
                                <option>Female</option>
                                <option>Male</option>
                                <option>Others</option>
                            </select>
                        </div>

                        <div className={styles.formRow}>
                            <label
                                htmlFor="birthday"
                                className={styles.formLabel}
                            >
                                Birthday
                            </label>
                            <input
                                id="birthday"
                                name="birthday"
                                className={styles.formControl}
                                type="date"
                            />
                        </div>

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
                            <label
                                htmlFor="address"
                                className={styles.formLabel}
                            >
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
                            <label
                                htmlFor="clinic"
                                className={styles.formLabel}
                            >
                                Clinic
                            </label>
                            <input
                                id="clinic"
                                name="clinic"
                                className={styles.formControl}
                                type="text"
                            />
                        </div>

                        <div className={styles.formRow}>
                            <label
                                htmlFor="parish"
                                className={styles.formLabel}
                            >
                                Parish
                            </label>
                            <input
                                id="parish"
                                name="parish"
                                className={styles.formControl}
                                type="text"
                            />
                        </div>

                        {/* Classification to CM (FP / NFP) */}
                        <div className={styles.formRow}>
                            <label className={styles.formLabel}>
                                Classification to CM
                            </label>
                            <div className={styles.inlineChoices}>
                                <label className={styles.choice}>
                                    <input
                                        type="radio"
                                        name="classification_cm"
                                        value="FP"
                                        onChange={handleClassificationChange}
                                    />
                                    <span>Beneficiary (FP)</span>
                                </label>
                                <label className={styles.choice}>
                                    <input
                                        type="radio"
                                        name="classification_cm"
                                        value="NFP"
                                        onChange={handleClassificationChange}
                                    />
                                    <span>Beneficiary (NFP)</span>
                                </label>
                            </div>
                        </div>

                        {/* Category (Annex 2) */}
                        <div className={styles.formRow}>
                            <label
                                htmlFor="category"
                                className={styles.formLabel}
                            >
                                Category as client
                            </label>
                            <select
                                id="category"
                                name="category"
                                className={styles.formControl}
                            >
                                <option value="">Select category</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* FP sub-questions */}
                        {isFP === true && (
                            <>
                                <div className={styles.formRow}>
                                    <label
                                        htmlFor="booklet_no"
                                        className={styles.formLabel}
                                    >
                                        Booklet #
                                    </label>
                                    <input
                                        id="booklet_no"
                                        name="booklet_no"
                                        className={styles.formControl}
                                        type="text"
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>
                                        Is head of the family
                                    </label>
                                    <div className={styles.inlineChoices}>
                                        <label className={styles.choice}>
                                            <input
                                                type="radio"
                                                name="is_head_of_family"
                                                value="yes"
                                            />
                                            <span>Yes</span>
                                        </label>
                                        <label className={styles.choice}>
                                            <input
                                                type="radio"
                                                name="is_head_of_family"
                                                value="no"
                                                defaultChecked
                                            />
                                            <span>No</span>
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* NFP sub-questions */}
                        {isFP === false && (
                            <>
                                <div className={styles.formRow}>
                                    <label
                                        htmlFor="valid_id_no"
                                        className={styles.formLabel}
                                    >
                                        Valid ID with #
                                    </label>
                                    <input
                                        id="valid_id_no"
                                        name="valid_id_no"
                                        className={styles.formControl}
                                        type="text"
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>
                                        Endorsed for registration as CM family
                                        partner?
                                    </label>
                                    <div className={styles.inlineChoices}>
                                        <label className={styles.choice}>
                                            <input
                                                type="radio"
                                                name="endorsed_for_registration"
                                                value="yes"
                                            />
                                            <span>Yes</span>
                                        </label>
                                        <label className={styles.choice}>
                                            <input
                                                type="radio"
                                                name="endorsed_for_registration"
                                                value="no"
                                                defaultChecked
                                            />
                                            <span>No</span>
                                        </label>
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>
                                        First time visiting the clinic?
                                    </label>
                                    <div className={styles.inlineChoices}>
                                        <label className={styles.choice}>
                                            <input
                                                type="radio"
                                                name="first_time_visit"
                                                value="yes"
                                            />
                                            <span>Yes</span>
                                        </label>
                                        <label className={styles.choice}>
                                            <input
                                                type="radio"
                                                name="first_time_visit"
                                                value="no"
                                                defaultChecked
                                            />
                                            <span>No</span>
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Actions */}
                        <div className={styles.formActions}>
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
        </div>,
        root
    );
}
