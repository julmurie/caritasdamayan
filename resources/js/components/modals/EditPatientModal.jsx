// resources/js/components/modals/EditPatientModal.jsx
import React, { useEffect, useState } from "react";
import styles from "../../../css/volunteer.module.css";

export default function EditPatientModal({ open, onClose, patient, onSave }) {
    const [formData, setFormData] = useState({
        patient_fname: "",
        patient_lname: "",
        patient_mname: "",
        gender: "",
        birthday: "",
        contact_no: "",
        address: "",
        clinic: "",
        parish: "",
        classification_cm: "",
        category: "",
        booklet_no: "",
        is_head_family: false,
        valid_id_no: "",
        endorsed_as_fp: false,
        first_time_visit: false,
        has_philhealth: false,
        philhealth_no: "",
    });

    useEffect(() => {
        if (patient) {
            const formattedBirthday = patient.birthday
                ? new Date(patient.birthday).toISOString().split("T")[0]
                : "";

            setFormData({
                patient_fname: patient.patient_fname || "",
                patient_lname: patient.patient_lname || "",
                patient_mname: patient.patient_mname || "",
                gender: patient.gender || "",
                birthday: formattedBirthday,
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

        const booleanFields = [
            "is_head_family",
            "endorsed_as_fp",
            "first_time_visit",
            "has_philhealth",
        ];

        if (booleanFields.includes(name)) {
            parsed = value === "1" ? true : value === "0" ? false : false;
        }

        // 🔄 dynamic logic for classification change
        if (name === "classification_cm") {
            if (value === "FP") {
                setFormData((prev) => ({
                    ...prev,
                    classification_cm: value,
                    // FP fields
                    is_head_family: prev.is_head_family ?? false,
                    // clear NFP-only
                    endorsed_as_fp: false,
                    first_time_visit: false,
                    valid_id_no: "",
                }));
                return;
            } else if (value === "NFP") {
                setFormData((prev) => ({
                    ...prev,
                    classification_cm: value,
                    endorsed_as_fp: prev.endorsed_as_fp ?? false,
                    first_time_visit: prev.first_time_visit ?? false,
                    // clear FP-only
                    is_head_family: false,
                    booklet_no: "",
                }));
                return;
            }
        }

        setFormData((prev) => ({ ...prev, [name]: parsed }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await onSave(formData);
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
                    {/* Personal Info */}
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
                        <label className={styles.formLabel}>Middle Name</label>
                        <input
                            className={styles.formInput}
                            name="patient_mname"
                            value={formData.patient_mname}
                            onChange={handleChange}
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

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Gender</label>
                        <select
                            className={styles.formInput}
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
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
                            className={styles.formInput}
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Contact No.</label>
                        <input
                            className={styles.formInput}
                            name="contact_no"
                            value={formData.contact_no}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Address</label>
                        <input
                            className={styles.formInput}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Clinic</label>
                        <input
                            className={styles.formInput}
                            name="clinic"
                            value={formData.clinic}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Parish</label>
                        <input
                            className={styles.formInput}
                            name="parish"
                            value={formData.parish}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Classification */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            Classification (CM)
                        </label>
                        <select
                            className={styles.formInput}
                            name="classification_cm"
                            value={formData.classification_cm || ""}
                            onChange={handleChange}
                        >
                            <option value="" disabled hidden>
                                Select Classification
                            </option>
                            <option value="FP">Family Partner</option>
                            <option value="NFP">Non-Family Partner</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Category</label>
                        <select
                            className={styles.formInput}
                            name="category"
                            value={formData.category ?? ""}
                            onChange={handleChange}
                        >
                            <option value="" disabled hidden>
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

                    {/* Booklet No. */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Booklet No.</label>
                        <input
                            className={styles.formInput}
                            name="booklet_no"
                            value={formData.booklet_no ?? ""}
                            onChange={handleChange}
                            disabled={formData.classification_cm !== "FP"}
                        />
                    </div>

                    {/* Is Head of Family */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            Is Head of the Family
                        </label>
                        <select
                            className={styles.formInput}
                            name="is_head_family"
                            value={
                                formData.is_head_family === true
                                    ? "1"
                                    : formData.is_head_family === false
                                    ? "0"
                                    : ""
                            }
                            onChange={handleChange}
                            disabled={formData.classification_cm !== "FP"}
                        >
                            <option value="" disabled hidden>
                                Select
                            </option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>

                    {/* Valid ID # */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Valid ID #</label>
                        <input
                            className={styles.formInput}
                            name="valid_id_no"
                            value={formData.valid_id_no ?? ""}
                            onChange={handleChange}
                            disabled={formData.classification_cm !== "NFP"}
                        />
                    </div>

                    {/* Endorsed for CM Family Partner? */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            Endorsed for CM Family Partner?
                        </label>
                        <select
                            className={styles.formInput}
                            name="endorsed_as_fp"
                            value={
                                formData.endorsed_as_fp === true
                                    ? "1"
                                    : formData.endorsed_as_fp === false
                                    ? "0"
                                    : ""
                            }
                            onChange={handleChange}
                            disabled={formData.classification_cm !== "NFP"}
                        >
                            <option value="" disabled hidden>
                                Select
                            </option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>

                    {/* First Time Visit */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            First Time Visit?
                        </label>
                        <select
                            className={styles.formInput}
                            name="first_time_visit"
                            value={
                                formData.first_time_visit === true
                                    ? "1"
                                    : formData.first_time_visit === false
                                    ? "0"
                                    : ""
                            }
                            onChange={handleChange}
                            disabled={formData.classification_cm !== "NFP"}
                        >
                            <option value="" disabled hidden>
                                Select
                            </option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>

                    {/* Has PhilHealth? */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            Has PhilHealth?
                        </label>
                        <select
                            className={styles.formInput}
                            name="has_philhealth"
                            value={
                                formData.has_philhealth === true
                                    ? "1"
                                    : formData.has_philhealth === false
                                    ? "0"
                                    : ""
                            }
                            onChange={handleChange}
                        >
                            <option value="" disabled hidden>
                                Select
                            </option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>

                    {/* Show PhilHealth No. only if has_philhealth = true */}
                    {formData.has_philhealth === true && (
                        <div className={styles.formRow}>
                            <label className={styles.formLabel}>
                                PhilHealth No.
                            </label>
                            <input
                                className={styles.formInput}
                                name="philhealth_no"
                                value={formData.philhealth_no || ""}
                                onChange={handleChange}
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
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
