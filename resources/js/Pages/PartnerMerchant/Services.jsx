import React from "react";
import Navbar from "../../components/Navbar";
import styles from "../../../css/merchant.module.css";
import { Link } from "@inertiajs/react";

export default function Services({ merchant = "Generika", services = [] }) {
    return (
        <>
            <Navbar />
            <div className={styles.pricesContainer}>
                {/* Sidebar */}
                <aside className={styles.pricesSidebar}>
                    <div className={styles.pricesSidebarLinks}>
                        <Link
                            href="/merchant/prices"
                            className={styles.pricesSidebarLink}
                        >
                            Products
                        </Link>
                        <Link
                            href="/merchant/services"
                            className={`block px-4 py-3 bg-red-700 border-l-4 border-red-700 text-white font-bold ${styles.pricesSidebarLink} ${styles.pricesSidebarLinkActive}`}
                        >
                            Service
                        </Link>
                    </div>
                </aside>

                {/* Main */}
                <div className={styles.pricesMain}>
                    <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                        <div className={styles.pricesHeader}>
                            <h1>Services</h1>
                            <p>Partner Merchant | {merchant}</p>
                        </div>
                        <div className="space-x-2">
                            <Link
                                href="/partner/services/create"
                                className={styles.btnGreen}
                            >
                                + Add Service
                            </Link>
                            <Link
                                href="/partner/services/archived"
                                className={styles.btnDark}
                            >
                                Archived Services
                            </Link>
                        </div>
                    </div>

                    <hr className="my-4 border-gray-300" />

                    <div className={styles.pricesTableWrapper}>
                        <table className={styles.pricesTable}>
                            <thead>
                                <tr>
                                    <th>Service Name</th>
                                    <th>Standard Rate</th>
                                    <th>Discounted Rate</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className={styles.pricesNoData}
                                        >
                                            No services found.
                                        </td>
                                    </tr>
                                ) : (
                                    services.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.standard_rate}</td>
                                            <td>{item.discounted_rate}</td>
                                            <td
                                                className={
                                                    styles.pricesActionsCol
                                                }
                                            >
                                                <button
                                                    className={
                                                        styles.pricesActionBtn
                                                    }
                                                    title="Delete"
                                                >
                                                    🗑
                                                </button>
                                                <button
                                                    className={
                                                        styles.pricesActionBtn
                                                    }
                                                    title="Download"
                                                >
                                                    ⬇️
                                                </button>
                                                <button
                                                    className={
                                                        styles.pricesActionBtn
                                                    }
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.pricesPagination}>
                        <span>Pages</span>
                        <button>&larr;</button>
                        <button className="active">1</button>
                        <button>2</button>
                        <span>...</span>
                        <button>8</button>
                        <button>&rarr;</button>
                    </div>
                </div>
            </div>
        </>
    );
}
