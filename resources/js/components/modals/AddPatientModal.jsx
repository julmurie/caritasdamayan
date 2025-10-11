import React, { useEffect, useState } from "react";
import styles from "../../../css/volunteer.module.css";

export default function AddPatientModal({ open, onClose, onSave }) {
    const [classification, setClassification] = useState("");
    const [hasPhilhealth, setHasPhilhealth] = useState(null);
    const [errors, setErrors] = useState({});
    const errorText = "mt-1 text-xs text-red-600";

    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose?.();
        }
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    const validate = (data) => {
        const newErrors = {};

        // NAME FIELDS
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

        // GENDER
        if (!data.gender) newErrors.gender = "Gender is required.";

        // BIRTHDAY
        if (!data.birthday) newErrors.birthday = "Birthday is required.";
        else {
            const birthDate = new Date(data.birthday);
            const today = new Date();
            if (birthDate > today)
                newErrors.birthday = "Birthday cannot be in the future.";
        }

        // CONTACT NUMBER
        if (!data.contact_no)
            newErrors.contact_no = "Contact number is required.";
        else if (isNaN(data.contact_no))
            newErrors.contact_no =
                "Contact number should only contain numbers.";
        else if (data.contact_no.length !== 11)
            newErrors.contact_no = "Contact number must be exactly 11 digits.";

        // ADDRESS
        if (!data.address) newErrors.address = "Address is required.";
        else if (data.address.length < 5)
            newErrors.address = "Please enter a complete address.";
        else if (data.address.length > 255)
            newErrors.address = "Address cannot exceed 255 characters.";

        // CLINIC AND PARISH
        if (data.clinic && data.clinic.length < 3)
            newErrors.clinic = "Clinic name must be at least 3 characters.";
        else if (data.clinic && data.clinic.length > 100)
            newErrors.clinic = "Clinic name cannot exceed 100 characters.";

        if (data.parish && data.parish.length < 3)
            newErrors.parish = "Parish name must be at least 3 characters.";
        else if (data.parish && data.parish.length > 100)
            newErrors.parish = "Parish name cannot exceed 100 characters.";

        // CLASSIFICATION AND CATEGORY
        if (!data.classification_cm)
            newErrors.classification_cm = "Classification is required.";

        if (!data.category) newErrors.category = "Category is required.";

        // OPTIONAL IDs
        if (data.booklet_no && data.booklet_no.length > 30)
            newErrors.booklet_no =
                "Booklet number cannot exceed 30 characters.";

        if (data.valid_id_no && data.valid_id_no.length > 30)
            newErrors.valid_id_no =
                "Valid ID number cannot exceed 30 characters.";

        // PHILHEALTH
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

    async function handleSubmit(e) {
        e.preventDefault();

        const fd = new FormData(e.currentTarget);
        const toBool = (v) => v === "1" || v === 1 || v === true;

        const payload = {
            patient_fname: fd.get("patient_fname")?.trim(),
            patient_lname: fd.get("patient_lname")?.trim(),
            patient_mname: fd.get("patient_mname")?.trim() || "",
            gender: fd.get("gender") || "",
            birthday: fd.get("birthday") || "",
            contact_no: fd.get("contact_no")?.trim() || "",
            address: fd.get("address")?.trim() || "",
            clinic: fd.get("clinic")?.trim() || "",
            parish: fd.get("parish")?.trim() || "",
            classification_cm: fd.get("classification_cm") || "",
            category: fd.get("category") || "",
            booklet_no: fd.get("booklet_no")?.trim() || "",
            is_head_family: toBool(fd.get("is_head_family")),
            valid_id_no: fd.get("valid_id_no")?.trim() || "",
            endorsed_as_fp: toBool(fd.get("endorsed_as_fp")),
            first_time_visit: toBool(fd.get("first_time_visit")),
            has_philhealth: toBool(fd.get("has_philhealth")),
            philhealth_no: fd.get("philhealth_no")?.trim() || "",
        };

        // ✅ Validate using payload only
        const validationErrors = validate(payload);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            await onSave(payload);
            onClose();
        } catch (err) {
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
                        <div>
                            {" "}
                            <input
                                id="patient_fname"
                                name="patient_fname"
                                required
                                className={styles.formControl}
                                type="text"
                                placeholder="e.g. Juan"
                            />
                            {errors.patient_fname && (
                                <p className={errorText}>
                                    {errors.patient_fname}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <label
                            htmlFor="patient_lname"
                            className={styles.formLabel}
                        >
                            Last Name <span className={styles.req}>*</span>
                        </label>
                        <div>
                            <input
                                id="patient_lname"
                                name="patient_lname"
                                required
                                className={styles.formControl}
                                type="text"
                                placeholder="e.g. Dela Cruz"
                            />
                            {errors.patient_lname && (
                                <p className={errorText}>
                                    {errors.patient_lname}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <label
                            htmlFor="patient_mname"
                            className={styles.formLabel}
                        >
                            Middle Name
                        </label>
                        <div>
                            {" "}
                            <input
                                id="patient_mname"
                                name="patient_mname"
                                className={styles.formControl}
                                type="text"
                                placeholder="(optional)"
                            />
                            {errors.patient_mname && (
                                <p className={errorText}>
                                    {errors.patient_mname}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Gender</label>
                        <div>
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
                            {errors.gender && (
                                <p className={errorText}>{errors.gender}</p>
                            )}
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Birthday</label>
                        <div>
                            <input
                                type="date"
                                name="birthday"
                                className={styles.formInput}
                            />
                            {errors.birthday && (
                                <p className={errorText}>{errors.birthday}</p>
                            )}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className={styles.formRow}>
                        <label
                            htmlFor="contact_no"
                            className={styles.formLabel}
                        >
                            Contact No
                        </label>
                        <div>
                            <input
                                id="contact_no"
                                name="contact_no"
                                className={styles.formControl}
                                type="text"
                                inputMode="numeric"
                                minLength={11}
                                maxLength={11}
                                placeholder="e.g. 09xxxxxxxxx"
                            />
                            {errors.contact_no && (
                                <p className={errorText}>{errors.contact_no}</p>
                            )}
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <label htmlFor="address" className={styles.formLabel}>
                            Address
                        </label>
                        <div>
                            <input
                                id="address"
                                name="address"
                                className={styles.formControl}
                                type="text"
                                placeholder="Street / Barangay / City"
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
                            <input name="clinic" className={styles.formInput} />
                            {errors.clinic && (
                                <p className={errorText}>{errors.clinic}</p>
                            )}
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Parish</label>
                        <div>
                            {" "}
                            <input name="parish" className={styles.formInput} />
                            {errors.parish && (
                                <p className={errorText}>{errors.parish}</p>
                            )}
                        </div>
                    </div>

                    {/* Classification */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            Classification to CM Beneficiary
                        </label>
                        <div className={styles.inlineGroup}>
                            <div>
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
                                        onChange={() =>
                                            setClassification("NFP")
                                        }
                                    />{" "}
                                    NFP (Non-Family Partner)
                                </label>
                                {errors.classification_cm && (
                                    <p className={errorText}>
                                        {errors.classification_cm}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* FP fields */}
                    {classification === "FP" && (
                        <>
                            <div className={styles.formRow}>
                                <label className={styles.formLabel}>
                                    Booklet #
                                </label>
                                <div>
                                    <input
                                        name="booklet_no"
                                        className={styles.formInput}
                                    />
                                    {errors.booklet_no && (
                                        <p className={errorText}>
                                            {errors.booklet_no}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <label className={styles.formLabel}>
                                    Head of Family?
                                </label>
                                <div className={styles.inlineGroup}>
                                    <div>
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
                                <div>
                                    <input
                                        name="valid_id_no"
                                        className={styles.formInput}
                                    />
                                    {errors.valid_id_no && (
                                        <p className={errorText}>
                                            {errors.valid_id_no}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <label className={styles.formLabel}>
                                    Endorsed for CM Family Partner?
                                </label>
                                <div className={styles.inlineGroup}>
                                    <div>
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
                            </div>
                            <div className={styles.formRow}>
                                <label className={styles.formLabel}>
                                    First time visit?
                                </label>
                                <div className={styles.inlineGroup}>
                                    <div>
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
                            </div>
                        </>
                    )}

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Category</label>
                        <div>
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
                            {errors.category && (
                                <p className={errorText}>{errors.category}</p>
                            )}
                        </div>
                    </div>

                    {/* PhilHealth */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>PhilHealth</label>
                        <div className={styles.inlineGroup}>
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        name="has_philhealth"
                                        value="1"
                                        checked={hasPhilhealth === true}
                                        onChange={() => setHasPhilhealth(true)}
                                        required
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
                                        required
                                    />{" "}
                                    No
                                </label>
                                {errors.has_philhealth && (
                                    <p className={errorText}>
                                        {errors.has_philhealth}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    {hasPhilhealth && (
                        <div className={styles.formRow}>
                            <label className={styles.formLabel}>
                                PhilHealth No.
                            </label>
                            <div>
                                <input
                                    name="philhealth_no"
                                    className={styles.formInput}
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
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
