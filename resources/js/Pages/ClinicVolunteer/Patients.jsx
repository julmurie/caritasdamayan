// import ScoreCard from "../../components/ScoreCard";
// import Navbar from "../../components/Navbar";

// function Patient() {
//     return (
//         <div>
//             <Navbar />
//             <ScoreCard />
//         </div>
//     );
// }

// export default Patient;

import React from "react";
import Sidebar from "../../components/Sidebar";
import styles from "../../../css/Volunteer.module.css";

const Patient = () => {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>

            <div className={styles.mainContent}>
                {/* Top Tabs */}
                <ul className={styles.navTabs}>
                    <li className={`${styles.navTab} ${styles.active}`}>
                        Initial Assessment
                    </li>
                    <li className={styles.navTab}>Patient Profile</li>
                </ul>

                {/* Sub Tabs */}
                <ul className={styles.navPills}>
                    <li className={`${styles.navPill} ${styles.active}`}>
                        Information
                    </li>
                    <li className={styles.navPill}>Documents</li>
                    <li className={styles.navPill}>Request Approval</li>
                    <li className={styles.navPill}>Request History</li>
                </ul>

                {/* Patient Info Table */}
                <div className={styles.card}>
                    <h6>Patient Information</h6>
                    <table>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <td>Juan Dela Cruz</td>
                            </tr>
                            <tr>
                                <th>Age</th>
                                <td>32</td>
                            </tr>
                            <tr>
                                <th>Gender</th>
                                <td>Male</td>
                            </tr>
                            <tr>
                                <th>Address</th>
                                <td>Quezon City</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Buttons for Documents */}
                <div className={styles.card}>
                    <h6>Documents</h6>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                        }}
                    >
                        <button className={styles.btn}>Score Card</button>
                        <button className={styles.btn}>Medicine Request</button>
                        <button className={styles.btn}>
                            Laboratory Request
                        </button>
                        <button className={styles.btn}>Others</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Patients;