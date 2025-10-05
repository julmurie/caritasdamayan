import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import layout from "../../../../css/volunteer.module.css";
import styles from "../../../../css/scorecard.module.css";

function ScoreCard() {
    const [search, setSearch] = useState("");
    const [openGroups, setOpenGroups] = useState({
        critical: false,
        nonDreaded: false,
        economic: false,
        situational: false,
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // or false, your default

    const criticalCases = [
        "All cancers (malignant masses) including carcinoma in situ and related conditions",
        "Blood Dyscrasias (Leukemia, Idiopathic Thrombocytopenic Purpura, etc)",
        "Central Nervous System Infections (Poliomyelitis/Meningitis/Encephalitis)",
        "Cerebrovascular Accident (Stroke, Cerebral, Cerebellar and Intracranial Hemorrhage) and related conditions",
        "Chronic Cardiovascular Diseases (Complicated Hypertension and related conditions, Aortic Dissection, Abdominal Aortic Aneurysm, etc.)",
        "Chronic Endocrine Disorders and their complications (Dyslipidemia, Impaired Fasting Glucose, Impaired Glucose Tolerance, Obesity, Diabetes Mellitus, Hormonal Dysfunctions, etc.) excluding surgical treatment/procedures for obesity-exclusion",
        "Chronic Gastrointestinal Diseases (ex. Irritable Bowel Syndrome, Crohn’s disease)",
        "Chronic Genito-urinary Disorders",
        "Chronic Kidney Disease/Failure",
        "Chronic Liver Parenchymal Diseases (Liver Cirrhosis, Chronic hepatitis, etc)",
        "Chronic Pulmonary Diseases except asthma (COPD, emphysema, and other chronic lung disease)",
        "Collagen-Vascular/Connective Tissue/Immunologic Disorders",
        "Complications of immuno-compromised state (except HIV/AIDS)",
    ];
    const nonDreadedCases = [
        "All tumors (benign masses)",
        "Anal Fistulae",
        "Arthritis",
        "Bronchial Asthma",
        "Buergher’s Disease",
        "Cataract and Glaucoma",
        "Cholecystitis, Cholelithiasis, Cholecystolithiasis and Choledocholithiasis",
        "Ear-Nose-Throat conditions requiring surgery (except cancers which are considered dreaded conditions)",
        "Endometrioses/Dysfunctional Uterine Bleeding (except if caused by uterine malignancies)",
        "Gastric or Duodenal Ulcers",
        "Hallux valgus",
        "Hemorrhoids",
        "Hernias (Congenital Hernia will have coverage as listed in the Congenital Clause)",
        "Migraine",
        "Muscular Dystrophies (Duchenne, Becker, limb girdle, facioscapsulohumeral, myotonic, oculopharyngeal, distal, and Emery-Dreifuss)",
        "Ovarian cysts (except Ovarian Malignancies)",
        "Peripheral Nervous System Diseases (except Multiple Sclerosis and GBS)",
        "Tuberculosis (Pulmonary or Extrapulmonary including Pott’s disease)",
        "Uncomplicated Hypertension",
        "Urinary Tract Stones/Calculi",
        "Maintenance medications for above illnesses",
    ];

    const economicSocialCases = [
        "Loss of Job",
        "No source of Income",
        "Pandemic situations e.g. COVID-19",
        "Abandoned",
        "Homeless/Streetdweller",
        "Contractual work",
        "Farmers, Fisherfolk, Indigenous people",
        "PWD, Senior",
        "Missing persons / Grieving",
    ];

    const situationalSpiritualCases = [
        "Hunger",
        "Funeral Assistance",
        "Casket",
        "Medical Donated Equipments",
        "Maintenance medications not under Critical Non-Dreaded Conditions e.g. Hypertensive medications, Anticholesterol, Arthritis",
        "Basic Medications for short term common illnesses such as colds, flu, cough, low grade infection etc.",
    ];

    // --- selections (scores) ---
    const [poverty, setPoverty] = useState(null); // 3 / 2 / 1
    const [household, setHousehold] = useState(null); // 4 / 3 / 2 / 1
    const [medical, setMedical] = useState(null); // 5 / 4 / 3 / 2

    // compute total score
    const totalScore = useMemo(() => {
        const vals = [poverty, household, medical].filter((v) => v != null);
        return vals.length ? vals.reduce((a, b) => a + b, 0) : null;
    }, [poverty, household, medical]);

    // map score → budget range (from your table)
    const budgetRange = useMemo(() => {
        if (totalScore == null) return null;
        if (totalScore >= 10) return "2,501 – 5,000";
        if (totalScore >= 7) return "2,001 – 2,500";
        if (totalScore >= 4) return "1,001 – 2,000";
        if (totalScore >= 1) return "500 – 1,000";
        return null;
    }, [totalScore]);

    // clear everything for the "Clear Selection" button
    const clearAllSelections = () => {
        setPoverty(null);
        setHousehold(null);
        setMedical(null);
    };

    // Handle search
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearch(term);

        // Reset folds
        let newOpen = {
            critical: false,
            nonDreaded: false,
            economic: false,
            situational: false,
        };

        if (term) {
            if (criticalCases.some((c) => c.toLowerCase().includes(term)))
                newOpen.critical = true;
            if (nonDreadedCases.some((c) => c.toLowerCase().includes(term)))
                newOpen.nonDreaded = true;
            if (economicSocialCases.some((c) => c.toLowerCase().includes(term)))
                newOpen.economic = true;
            if (
                situationalSpiritualCases.some((c) =>
                    c.toLowerCase().includes(term)
                )
            )
                newOpen.situational = true;
        }

        setOpenGroups(newOpen);
    };

    // Highlight matched text
    const highlightText = (text) => {
        if (!search) return text;
        const regex = new RegExp(`(${search})`, "gi");
        return text.split(regex).map((part, i) =>
            regex.test(part) ? (
                <mark key={i} style={{ background: "#fde047" }}>
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    return (
        <div className={styles.page}>
            {/* Navbar */}
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
                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-4 mx-8">
                        <button className="px-3 py-1.5 border rounded bg-white hover:bg-gray-50 text-sm">
                            ← Return
                        </button>
                        <div className="flex items-center gap-3">
                            <button className="h-9 px-3 rounded border bg-white text-sm flex items-center gap-2 hover:bg-gray-50">
                                {/* edit icon */}
                                <span>Edit</span>
                            </button>
                            <button className="h-9 px-3 rounded border bg-white text-sm flex items-center gap-2 hover:bg-gray-50">
                                {/* print icon */}
                                <span>Print</span>
                            </button>
                        </div>
                    </div>
                    {/* Scorecard */}
                    <div className={styles.scorecard}>
                        <div className={styles.header}>
                            Caritas Manila Assistance Score Card (CMAS CARD)
                        </div>

                        {/* Indicator 1 */}
                        <section className={styles.section}>
                            <div className={styles.bar}>
                                <div>
                                    Indicator 1 <small> | Level of Poor</small>
                                </div>
                            </div>

                            <div className={styles.optionsRow}>
                                <label className={styles.option}>
                                    <input
                                        type="radio"
                                        name="poverty"
                                        value="ultra"
                                        checked={poverty === 3}
                                        onChange={() => setPoverty(3)}
                                    />
                                    <div className={styles.optionText}>
                                        <span>Ultra Poor</span>
                                        <small>(Below 12,000 income)</small>
                                    </div>
                                    <span className={styles.score}>3</span>
                                </label>
                                <label className={styles.option}>
                                    <input
                                        type="radio"
                                        name="poverty"
                                        value="moderate"
                                        checked={poverty === 2}
                                        onChange={() => setPoverty(2)}
                                    />
                                    <div className={styles.optionText}>
                                        <span>Moderate</span>
                                        <small>(12,001–20,000)</small>
                                    </div>
                                    <span className={styles.score}>2</span>
                                </label>
                                <label className={styles.option}>
                                    <input
                                        type="radio"
                                        name="poverty"
                                        value="vnp"
                                        checked={poverty === 1}
                                        onChange={() => setPoverty(1)}
                                    />
                                    <div className={styles.optionText}>
                                        <span>Vulnerable Non Poor</span>
                                        <small>(Above 20,001)</small>
                                    </div>
                                    <span className={styles.score}>1</span>
                                </label>
                            </div>
                        </section>

                        {/* Indicator 2 */}
                        <section className={styles.section}>
                            <div className={styles.bar}>
                                <div>
                                    Indicator 2 <small> | Household</small>
                                </div>
                            </div>

                            <div className={styles.optionsRow}>
                                <label className={styles.option}>
                                    <input
                                        type="radio"
                                        name="household"
                                        value="gt5"
                                        checked={household === 4}
                                        onChange={() => setHousehold(4)}
                                    />
                                    <div className={styles.optionText}>
                                        <span>More than 5 members</span>
                                    </div>
                                    <span className={styles.score}>4</span>
                                </label>

                                <label className={styles.option}>
                                    <input
                                        type="radio"
                                        name="household"
                                        value="3to4"
                                        checked={household === 3}
                                        onChange={() => setHousehold(3)}
                                    />
                                    <div className={styles.optionText}>
                                        <span>3–4 members</span>
                                    </div>
                                    <span className={styles.score}>3</span>
                                </label>

                                <label className={styles.option}>
                                    <input
                                        type="radio"
                                        name="household"
                                        value="1to2"
                                        checked={household === 2}
                                        onChange={() => setHousehold(2)}
                                    />
                                    <div className={styles.optionText}>
                                        <span>1–2 members</span>
                                    </div>
                                    <span className={styles.score}>2</span>
                                </label>

                                <label className={styles.option}>
                                    <input
                                        type="radio"
                                        name="household"
                                        value="1"
                                        checked={household === 1}
                                        onChange={() => setHousehold(1)}
                                    />
                                    <div className={styles.optionText}>
                                        <span>1 person</span>
                                    </div>
                                    <span className={styles.score}>1</span>
                                </label>
                            </div>
                        </section>

                        {/* Indicator 3 */}
                        <section className={styles.section}>
                            <div className="bg-white pb-4">
                                <div className={styles.bar}>
                                    <div>
                                        Indicator 3{" "}
                                        <small> | Medical Cases</small>
                                    </div>
                                    <div className={styles.barRight}>
                                        <input
                                            className={styles.search}
                                            type="search"
                                            placeholder="Search"
                                            value={search}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                </div>

                                {/* CRITICAL / DREADED */}
                                <details
                                    className={styles.fold}
                                    open={openGroups.critical}
                                >
                                    <summary className={styles.foldSummary}>
                                        <input
                                            className={styles.caseRadio}
                                            type="radio"
                                            name="medical_case"
                                            value="critical"
                                            checked={medical === 5}
                                            onChange={() => setMedical(5)}
                                            aria-label="Select Critical/Dreaded Case"
                                        />
                                        <span>Critical/Dreaded Case</span>
                                        <span className={styles.caseScore}>
                                            5
                                        </span>
                                    </summary>
                                    <ol className={styles.caseList}>
                                        {criticalCases.map((text, i) => (
                                            <li
                                                key={i}
                                                className={styles.caseItem}
                                            >
                                                <div
                                                    className={styles.caseText}
                                                >
                                                    {highlightText(text)}
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </details>

                                {/* NON-DREADED */}
                                <details
                                    className={styles.fold}
                                    open={openGroups.nonDreaded}
                                >
                                    <summary className={styles.foldSummary}>
                                        <input
                                            className={styles.caseRadio}
                                            type="radio"
                                            name="medical_case"
                                            value="non_dreaded"
                                            checked={medical === 4}
                                            onChange={() => setMedical(4)}
                                        />
                                        <span>Non-dreaded Case</span>
                                        <span className={styles.caseScore}>
                                            4
                                        </span>
                                    </summary>
                                    <ol className={styles.caseList}>
                                        {nonDreadedCases.map((text, i) => (
                                            <li
                                                key={i}
                                                className={styles.caseItem}
                                            >
                                                <div
                                                    className={styles.caseText}
                                                >
                                                    {highlightText(text)}
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </details>

                                {/* ECONOMIC & SOCIAL CRISIS */}
                                <details
                                    className={styles.fold}
                                    open={openGroups.economic}
                                >
                                    <summary className={styles.foldSummary}>
                                        <input
                                            className={styles.caseRadio}
                                            type="radio"
                                            name="medical_case"
                                            value="economic_social"
                                            checked={medical === 3}
                                            onChange={() => setMedical(3)}
                                        />
                                        <span>Economic and Social Crisis</span>
                                        <span className={styles.caseScore}>
                                            3
                                        </span>
                                    </summary>
                                    <ol className={styles.caseList}>
                                        {economicSocialCases.map((text, i) => (
                                            <li
                                                key={i}
                                                className={styles.caseItem}
                                            >
                                                <div
                                                    className={styles.caseText}
                                                >
                                                    {highlightText(text)}
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </details>

                                {/* SITUATIONAL & SPIRITUAL CRISIS */}
                                <details
                                    className={styles.fold}
                                    open={openGroups.situational}
                                >
                                    <summary className={styles.foldSummary}>
                                        <input
                                            className={styles.caseRadio}
                                            type="radio"
                                            name="medical_case"
                                            value="situational_spiritual"
                                            checked={medical === 2}
                                            onChange={() => setMedical(2)}
                                        />
                                        <span>
                                            Situational and Spiritual Crisis
                                        </span>
                                        <span className={styles.caseScore}>
                                            2
                                        </span>
                                    </summary>
                                    <ol className={styles.caseList}>
                                        {situationalSpiritualCases.map(
                                            (text, i) => (
                                                <li
                                                    key={i}
                                                    className={styles.caseItem}
                                                >
                                                    <div
                                                        className={
                                                            styles.caseText
                                                        }
                                                    >
                                                        {highlightText(text)}
                                                    </div>
                                                </li>
                                            )
                                        )}
                                    </ol>
                                </details>
                            </div>
                        </section>

                        {/* Scoring Table */}
                        <div className={styles.scoring}>
                            <table className={styles.scoringTable}>
                                <thead>
                                    <tr>
                                        <th>Scoring</th>
                                        <th>Maximum Value of Assistance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>10 – 12 pts</td>
                                        <td>2,501 – 5,000</td>
                                    </tr>
                                    <tr>
                                        <td>7 – 9 pts</td>
                                        <td>2,001 – 2,500</td>
                                    </tr>
                                    <tr>
                                        <td>4 – 6 pts</td>
                                        <td>1,001 – 2,000</td>
                                    </tr>
                                    <tr>
                                        <td>1 – 3 pts</td>
                                        <td>500 – 1,000</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr className={styles.footnote}>
                                        <td colSpan={2}>
                                            * any assistance higher than 5,000
                                            must be referred to Caritas Manila –
                                            Islas &amp; Damayan Office for
                                            review &amp; reconsideration of
                                            Program Officer/Manager and approved
                                            by the Executive Director
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </main>
                {/* Floating score / budget info + actions */}
                <div className="fixed right-6 bottom-4 flex flex-col items-end gap-2 z-[60]">
                    {/* Alert card */}
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-300 text-amber-800 rounded px-3 py-2 shadow-sm">
                        <div>
                            <div className="font-semibold">
                                Current Score: {totalScore ?? "--"}
                            </div>
                            <div className="font-semibold">
                                Budget Range: {budgetRange ?? "--"}
                            </div>
                        </div>
                        {/* small warning icon */}
                        {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.518 11.596c.75 1.336-.213 2.995-1.742 2.995H3.48c-1.53 0-2.492-1.659-1.742-2.995L8.257 3.1zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a.75.75 0 01-.75-.75v-3.5a.75.75 0 011.5 0v3.5A.75.75 0 0110 12z"
                                clipRule="evenodd"
                            />
                        </svg> */}
                    </div>

                    {/* Buttons row */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={clearAllSelections}
                            className="px-4 h-9 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                        >
                            Clear Selection
                        </button>

                        <button className="px-4 h-9 bg-[#2e7d32] text-white rounded hover:bg-[#276b2b] text-sm">
                            Save Form
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScoreCard;
