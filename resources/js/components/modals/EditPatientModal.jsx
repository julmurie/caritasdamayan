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
    const [errors, setErrors] = useState({});
    const errorText = "mt-1 text-xs text-red-600";

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

    const validate = (data) => {
        const newErrors = {};

        // 🧍 NAME FIELDS
        if (!data.patient_fname)
            newErrors.patient_fname = "First name is required.";
        else if (data.patient_fname.length < 2)
            newErrors.patient_fname =
                "First name must be at least 2 characters.";
        else if (data.patient_fname.length > 50)
            newErrors.patient_fname = "First name cannot exceed 50 characters.";

        if (!data.patient_lname)
            newErrors.patient_lname = "Last name is required.";
        else if (data.patient_lname.length < 2)
            newErrors.patient_lname =
                "Last name must be at least 2 characters.";
        else if (data.patient_lname.length > 50)
            newErrors.patient_lname = "Last name cannot exceed 50 characters.";

        if (data.patient_mname.length < 2)
            newErrors.patient_mname =
                "Middle name must be at least 2 characters.";
        else if (data.patient_mname.length > 50)
            newErrors.patient_mname =
                "Middle name cannot exceed 50 characters.";

        // ⚧ GENDER
        if (!data.gender) newErrors.gender = "Gender is required.";

        // 🎂 BIRTHDAY
        if (!data.birthday) newErrors.birthday = "Birthday is required.";
        else {
            const birthDate = new Date(data.birthday);
            const today = new Date();
            if (birthDate > today)
                newErrors.birthday = "Birthday cannot be in the future.";
        }

        // 📞 CONTACT NUMBER
        if (!data.contact_no)
            newErrors.contact_no = "Contact number is required.";
        else if (isNaN(data.contact_no))
            newErrors.contact_no =
                "Contact number should only contain numbers.";
        else if (data.contact_no.length !== 11)
            newErrors.contact_no = "Contact number must be exactly 11 digits.";

        // 🏠 ADDRESS
        if (!data.address) newErrors.address = "Address is required.";
        else if (data.address.length < 5)
            newErrors.address = "Please enter a complete address.";
        else if (data.address.length > 255)
            newErrors.address = "Address cannot exceed 255 characters.";

        // 🏥 CLINIC AND PARISH
        if (data.clinic && data.clinic.length < 3)
            newErrors.clinic = "Clinic name must be at least 3 characters.";
        else if (data.clinic && data.clinic.length > 100)
            newErrors.clinic = "Clinic name cannot exceed 100 characters.";

        if (data.parish && data.parish.length < 3)
            newErrors.parish = "Parish name must be at least 3 characters.";
        else if (data.parish && data.parish.length > 100)
            newErrors.parish = "Parish name cannot exceed 100 characters.";

        // 📋 CLASSIFICATION AND CATEGORY
        if (!data.classification_cm)
            newErrors.classification_cm = "Classification is required.";
        if (!data.category) newErrors.category = "Category is required.";

        // 📘 CONDITIONAL IDS ✅
        if (data.booklet_no.length > 30)
            newErrors.booklet_no =
                "Booklet number cannot exceed 30 characters.";

        if (data.valid_id_no.length > 30)
            newErrors.valid_id_no =
                "Valid ID number cannot exceed 30 characters.";

        // 🩺 PHILHEALTH
        if (data.has_philhealth === null || data.has_philhealth === undefined)
            newErrors.has_philhealth =
                "Please select if the patient has PhilHealth.";

        if (data.has_philhealth && !data.philhealth_no)
            newErrors.philhealth_no = "PhilHealth number is required.";
        else if (data.philhealth_no && data.philhealth_no.length > 30)
            newErrors.philhealth_no =
                "PhilHealth number cannot exceed 30 characters.";

        return newErrors;
    };

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

        const validationErrors = validate(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            await onSave(formData);
            onClose();
        } catch (err) {
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
                        <div>
                            {" "}
                            <input
                                className={styles.formInput}
                                name="patient_fname"
                                value={formData.patient_fname}
                                onChange={handleChange}
                                required
                            />
                            {errors.patient_fname && (
                                <p className={errorText}>
                                    {errors.patient_fname}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Middle Name</label>
                        <div>
                            {" "}
                            <input
                                className={styles.formInput}
                                name="patient_mname"
                                value={formData.patient_mname}
                                onChange={handleChange}
                            />
                            {errors.patient_mname && (
                                <p className={errorText}>
                                    {errors.patient_mname}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Last Name</label>
                        <div>
                            <input
                                className={styles.formInput}
                                name="patient_lname"
                                value={formData.patient_lname}
                                onChange={handleChange}
                                required
                            />
                            {errors.patient_lname && (
                                <p className={errorText}>
                                    {errors.patient_lname}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Gender</label>
                        <div>
                            {" "}
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
                            {errors.gender && (
                                <p className={errorText}>{errors.gender}</p>
                            )}
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Birthday</label>
                        <div>
                            {" "}
                            <input
                                type="date"
                                className={styles.formInput}
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleChange}
                            />
                            {errors.birthday && (
                                <p className={errorText}>{errors.birthday}</p>
                            )}
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Contact No.</label>
                        <div>
                            {" "}
                            <input
                                className={styles.formInput}
                                name="contact_no"
                                value={formData.contact_no}
                                onChange={handleChange}
                            />
                            {errors.contact_no && (
                                <p className={errorText}>{errors.contact_no}</p>
                            )}
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Address</label>
                        <div>
                            {" "}
                            <input
                                className={styles.formInput}
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                            {errors.address && (
                                <p className={errorText}>{errors.address}</p>
                            )}
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Clinic</label>
                        <div>
                            {" "}
                            <input
                                className={styles.formInput}
                                name="clinic"
                                value={formData.clinic}
                                onChange={handleChange}
                                minLength={3}
                                maxLength={100}
                            />
                            {errors.clinic && (
                                <p className={errorText}>{errors.clinic}</p>
                            )}
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Parish</label>
                        <div>
                            {" "}
                            <input
                                className={styles.formInput}
                                name="parish"
                                value={formData.parish}
                                onChange={handleChange}
                                minLength={3}
                                maxLength={100}
                            />
                            {errors.parish && (
                                <p className={errorText}>{errors.parish}</p>
                            )}
                        </div>
                    </div>

                    {/* Classification */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            Classification (CM)
                        </label>
                        <div>
                            {" "}
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
                            {errors.classification_cm && (
                                <p className={errorText}>
                                    {errors.classification_cm}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Category */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Category</label>
                        <div>
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
                            {errors.category && (
                                <p className={errorText}>{errors.category}</p>
                            )}
                        </div>
                    </div>

                    {/* Booklet No. */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Booklet No.</label>
                        <div>
                            {" "}
                            <input
                                className={styles.formInput}
                                name="booklet_no"
                                value={formData.booklet_no ?? ""}
                                onChange={handleChange}
                                disabled={formData.classification_cm !== "FP"}
                            />
                            {errors.booklet_no && (
                                <p className={errorText}>{errors.booklet_no}</p>
                            )}
                        </div>
                    </div>

                    {/* Is Head of Family */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            Is Head of the Family
                        </label>
                        <div>
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
                    </div>

                    {/* Valid ID # */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Valid ID #</label>
                        <div>
                            <input
                                className={styles.formInput}
                                name="valid_id_no"
                                value={formData.valid_id_no ?? ""}
                                onChange={handleChange}
                                disabled={formData.classification_cm !== "NFP"}
                            />
                            {errors.valid_id_no && (
                                <p className={errorText}>
                                    {errors.valid_id_no}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Endorsed for CM Family Partner? */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            Endorsed for CM Family Partner?
                        </label>
                        <div>
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
                    </div>

                    {/* First Time Visit */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            First Time Visit?
                        </label>
                        <div>
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
                    </div>

                    {/* Has PhilHealth? */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            Has PhilHealth?
                        </label>
                        <div>
                            <select
                                className={styles.formInput}
                                name="has_philhealth"
                                required
                                value={
                                    formData.has_philhealth === true
                                        ? "1"
                                        : formData.has_philhealth === false
                                        ? "0"
                                        : ""
                                }
                                onChange={handleChange}
                            >
                                {errors.has_philhealth && (
                                    <p className={errorText}>
                                        {errors.has_philhealth}
                                    </p>
                                )}
                                <option value="" disabled hidden>
                                    Select
                                </option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                            {errors.has_philhealth && (
                                <p className={errorText}>
                                    {errors.has_philhealth}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Show PhilHealth No. only if has_philhealth = true */}
                    {formData.has_philhealth === true && (
                        <div className={styles.formRow}>
                            <label className={styles.formLabel}>
                                PhilHealth No.
                            </label>
                            <div>
                                <input
                                    className={styles.formInput}
                                    name="philhealth_no"
                                    value={formData.philhealth_no || ""}
                                    onChange={handleChange}
                                />
                                {errors.philhealth_no && (
                                    <p className={errorText}>
                                        {errors.philhealth_no}
                                    </p>
                                )}
                            </div>
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
