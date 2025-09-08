// resources/js/Components/PageHeader.jsx
import React from "react";
import { usePage } from "@inertiajs/react";
import styles from "../../css/merchant.module.css"; // where .soaTitle/.soaSubtext exist

export default function PageHeader({ title, right }) {
    const { auth } = usePage().props;
    const role = auth?.user?.role || "";
    const labelMap = {
        volunteer: "Clinic Volunteer",
    };
    const roleLabel =
        labelMap[role] ||
        (role ? role.charAt(0).toUpperCase() + role.slice(1) : "");

    return (
        <div className="mb-5">
            <div className="flex justify-between items-end flex-wrap gap-4">
                <div>
                    <h1 className={styles.soaTitle}>{title}</h1>
                    {roleLabel && (
                        <p className={styles.soaSubtext}>{roleLabel}</p>
                    )}
                </div>
                {right && <div className="shrink-0">{right}</div>}
            </div>
            <hr className="border border-gray-300" />
        </div>
    );
}
