// resources/js/components/modals/EditPatientModal.jsx
import React, { useEffect, useState } from "react";
import styles from "../../../css/volunteer.module.css";

export default function EditPatientModal({ open, onClose, patient, onUpdate }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (patient) {
            setFormData({
                patient_fname: patient.patient_fname || "",
                patient_lname: patient.patient_lname || "",
                patient_mname: patient.patient_mname || "",
                gender: patient.gender || "",
                birthday: patient.birthday || "",
                contact_no: patient.contact_no || "",
                address: patient.address || "",
                clinic: patient.clinic || "",
                parish: patient.parish || "",
                classification_cm: patient.classification_cm || "",
                category: patient.category || "",
                booklet_no: patient.booklet_no || "",
                is_head_family: patient.is_head_family ?? null,
                valid_id_no: patient.valid_id_no || "",
                endorsed_as_fp: patient.endorsed_as_fp ?? null,
                first_time_visit: patient.first_time_visit ?? null,
                has_philhealth: patient.has_philhealth ?? null,
                philhealth_no: patient.philhealth_no || "",
            });
        }
    }, [patient]);

    if (!open) return null;

    function handleChange(e) {
        const { name, value, type } = e.target;
        let parsed = value;
        if (type === "radio") {
            parsed = value === "1" ? true : value === "0" ? false : null;
        }
        setFormData((prev) => ({ ...prev, [name]: parsed }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await onUpdate(formData);
            onClose();
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to update patient");
        }
    }

    return (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Edit Patient</h3>
                    <button className={styles.modalClose} onClick={onClose}>
                        ×
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className={styles.modalBodyScrollable}
                >
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>First Name</label>
                        <input
                            className={styles.formInput}
                            name="patient_fname"
                            value={formData.patient_fname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Last Name</label>
                        <input
                            className={styles.formInput}
                            name="patient_lname"
                            value={formData.patient_lname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* You can copy the rest of the fields from AddPatientModal but bind to formData */}

                    <div className={styles.modalFooter}>
                        <button
                            type="button"
                            className={styles.btnGhost}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className={styles.btnPrimary}>
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
