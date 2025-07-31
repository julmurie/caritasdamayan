import React from "react";
import Navbar from "../../components/Navbar";
import styles from "../../../css/merchant.module.css";

export default function SOA({ merchant = "Generika", soaRecords = [] }) {
    return (
        <>
            <Navbar />
            <div className={styles.soaContainer}>
                {/* Header */}
                <h1 className={styles.soaTitle}>SOA</h1>
                <p className={styles.soaSubtext}>
                    Partner Merchant | {merchant}
                </p>

                {/* Top Actions */}
                <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        <button className={styles.soaBtnRed}>Search</button>
                        <button className={styles.soaReset}>
                            Reset Filter
                        </button>
                        <span>{soaRecords.length} records found</span>
                    </div>
                    <button className={styles.soaBtnGreen}>Add Record</button>
                </div>

                {/* Table */}
                <table className={styles.soaTable}>
                    <thead>
                        <tr>
                            <th>SOA Number</th>
                            <th>SOA Date</th>
                            <th>Cover Period</th>
                            <th>Charge Slip</th>
                            <th>Total Amount</th>
                            <th>Attachment</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        <tr>
                            {Array.from({ length: 8 }).map((_, idx) => (
                                <th key={idx}>
                                    <input type="text" placeholder="" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {soaRecords.length === 0 ? (
                            <tr>
                                <td colSpan="8">No records found.</td>
                            </tr>
                        ) : (
                            soaRecords.map((soa, index) => (
                                <tr key={index}>
                                    <td>{soa.number}</td>
                                    <td>{soa.date}</td>
                                    <td>{soa.cover_period}</td>
                                    <td>{soa.charge_slip}</td>
                                    <td>{soa.total_amount}</td>
                                    <td>{soa.attachment}</td>
                                    <td>{soa.status}</td>
                                    <td>
                                        <button title="Edit">✏️</button>
                                        <button title="Delete">🗑</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className={styles.soaPagination}>
                    <select>
                        <option>20</option>
                        <option>50</option>
                        <option>100</option>
                    </select>
                    <span>per page</span>
                    <button>&larr;</button>
                    <button className="active">1</button>
                    <button>2</button>
                    <span>...</span>
                    <button>3</button>
                    <button>&rarr;</button>
                </div>
            </div>
        </>
    );
}
