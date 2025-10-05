import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import layout from "../../../../css/volunteer.module.css";
import styles from "../../../../css/scorecard.module.css";
function LaboratoryRequest() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // or false, your default

    return (
        <div>
            <Navbar />
            {/* Shell layout (sidebar + content) */}
            <div
                className={`${layout.shell} ${
                    isSidebarOpen ? layout.shellOpen : layout.shellClosed
                }`}
                style={{ "--sideW": "240px" }}
            >
                {" "}
                {/* Sidebar (no extra wrappers; let volunteer.module.css handle width/position) */}
                <Sidebar onToggle={setIsSidebarOpen} />{" "}
                {/* Scrollable content */}
                <main
                    className={`${layout.main} ${styles.mainFix} ${styles.mainScroll}`}
                >
                    {" "}
                </main>
            </div>
        </div>
    );
}

export default LaboratoryRequest;
