import React from "react";
import Navbar from "../../components/Navbar";
import styles from "../../../css/merchant.module.css";

export default function Dashboard() {
    return (
        <>
            <Navbar />
            <div className={styles.dashboardContainer}>
                <div className={styles.header}>
                    <h1>Dashboard</h1>
                    <p>Partner Merchant | Generika</p>
                    <hr className="my-4 border-gray-300" />
                </div>

                <div className={styles.statGrid}>
                    <div className={styles.statCard}>
                        <h2>Unredeemed Charge Slips</h2>
                        <p className={styles.statNumber}>8</p>
                        <a href="#">view all →</a>
                    </div>

                    <div className={styles.statCard}>
                        <h2>Charge Slips Redeemed for this Month</h2>
                        <p className={styles.statNumber}>120</p>
                        <a href="#">view all →</a>
                    </div>

                    <div className={styles.statCard}>
                        <h2>Pending SOAs</h2>
                        <p className={styles.statNumber}>4</p>
                        <a href="#">view all →</a>
                    </div>
                </div>

                <div className={styles.bottomGrid}>
                    <div className={styles.card}>
                        <h3>Recent Activity</h3>
                        <ul>
                            <li>
                                <span>• SOA #102 approved by Accounting</span>
                                <span className={styles.time}>48 mins ago</span>
                            </li>
                            <li>
                                <span>• SOA #103 flagged for compliance</span>
                                <span className={styles.time}>1 hour ago</span>
                            </li>
                            <li>
                                <span>
                                    • Charge Slip for Juan Dela Cruz redeemed
                                </span>
                                <span className={styles.time}>
                                    12 hours ago
                                </span>
                            </li>
                            <li>
                                <span>• New SOA #104 submitted</span>
                                <span className={styles.time}>1 day ago</span>
                            </li>
                            <li>
                                <span>• Price of Medicine updated</span>
                                <span className={styles.time}>2 weeks ago</span>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.card}>
                        <h3>SOA Status</h3>
                        <ul>
                            <li>
                                <span>• For Checking with Admin</span>
                                <span className={styles.count}>3</span>
                            </li>
                            <li>
                                <span>• For Accounting</span>
                                <span className={styles.count}>2</span>
                            </li>
                            <li>
                                <span>• With Compliance</span>
                                <span className={styles.count}>1</span>
                            </li>
                            <li>
                                <span>• For Treasury</span>
                                <span className={styles.count}>5</span>
                            </li>
                            <li>
                                <span>• Check Released</span>
                                <span className={styles.count}>10</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
