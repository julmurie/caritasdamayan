import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "../../../css/volunteer.module.css";

const empty = {
    patient_lname: "",
    patient_fname: "",
    patient_mname: "",
    address: "",
    birthday: "",
    gender: "",
    contact_no: "",
    class_id: "",
    assist_id: "",
    pb_id: "",
    cb_by: "",
    assessed_by: "",
};

export default function AddPatientModal({ onClose, onSave }) {
    const [form, setForm] = useState(empty);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");
    const [portalEl, setPortalEl] = useState(null);

    useEffect(() => {
        const root = document.getElementById("modal-root") || document.body;
        setPortalEl(root);
    }, []);

    function setField(k, v) {
        setForm((f) => ({ ...f, [k]: v }));
    }

    async function submit(e) {
        e.preventDefault();
        setErr("");
        setBusy(true);
        try {
            await onSave(form);
        } catch (e) {
            setErr(e.message || "Failed to save");
        } finally {
            setBusy(false);
        }
    }

    const modalUI = (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
            <div className={styles.modalCard}>
                <div className={styles.modalHead}>
                    <h3>Add Patient</h3>
                    <button
                        onClick={onClose}
                        className={styles.iconOnly}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form className={styles.modalBody} onSubmit={submit}>
                    {err && <div className={styles.errorBox}>{err}</div>}

                    <div className={styles.formGrid}>
                        <label>
                            Last Name*
                            <input
                                required
                                value={form.patient_lname}
                                onChange={(e) =>
                                    setField("patient_lname", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            First Name*
                            <input
                                required
                                value={form.patient_fname}
                                onChange={(e) =>
                                    setField("patient_fname", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Middle Name
                            <input
                                value={form.patient_mname}
                                onChange={(e) =>
                                    setField("patient_mname", e.target.value)
                                }
                            />
                        </label>

                        <label>
                            Address
                            <input
                                value={form.address}
                                onChange={(e) =>
                                    setField("address", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Birthday
                            <input
                                type="date"
                                value={form.birthday}
                                onChange={(e) =>
                                    setField("birthday", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Gender
                            <select
                                value={form.gender}
                                onChange={(e) =>
                                    setField("gender", e.target.value)
                                }
                            >
                                <option value="">Select</option>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </label>
                        <label>
                            Contact No
                            <input
                                value={form.contact_no}
                                onChange={(e) =>
                                    setField("contact_no", e.target.value)
                                }
                            />
                        </label>

                        {/* Optional system fields */}
                        <label>
                            Class ID
                            <input
                                value={form.class_id}
                                onChange={(e) =>
                                    setField("class_id", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Assist ID
                            <input
                                value={form.assist_id}
                                onChange={(e) =>
                                    setField("assist_id", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            PB ID
                            <input
                                value={form.pb_id}
                                onChange={(e) =>
                                    setField("pb_id", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            CB By
                            <input
                                value={form.cb_by}
                                onChange={(e) =>
                                    setField("cb_by", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Assessed By
                            <input
                                value={form.assessed_by}
                                onChange={(e) =>
                                    setField("assessed_by", e.target.value)
                                }
                            />
                        </label>
                    </div>

                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} disabled={busy}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.btnGreen}
                            disabled={busy}
                        >
                            {busy ? "Saving…" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (!portalEl) return null; // until effect runs

    return createPortal(modalUI, portalEl);
}
