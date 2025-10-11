import React, { useState } from "react";
import styles from "../../css/volunteer.module.css";

const RequestApproval = () => {
    const [scoreCard, setScoreCard] = useState("");
    const [chargeSlip, setChargeSlip] = useState("");
    const [validId, setValidId] = useState("");
    const [prescription, setPrescription] = useState("");
    const [remarks, setRemarks] = useState("");

    const maxRemarksLength = 500;
    const isComplete = scoreCard && chargeSlip;

    const handleSend = () => {
        console.log("Mock Submit:", {
            scoreCard,
            chargeSlip,
            validId,
            prescription,
            remarks,
        });
        alert("Request submitted successfully (mock)!");
    };

    return (
        <section className={styles.section}>
            <div className={styles.sectionHead}>
                <span className={styles.sectionTitle}>Request Approval</span>
            </div>

            <div className="bg-white border border-gray-300 rounded p-4">
                {/* REQUIRED SECTION */}
                <h4 className="font-semibold text-gray-700 mb-2">Required:</h4>
                <div className="space-y-2">
                    {/* Score Card */}
                    <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <div className="w-1/3 font-medium text-gray-800">
                            Score Card
                        </div>
                        <input
                            type="text"
                            placeholder="file view link here..."
                            value={scoreCard}
                            onChange={(e) => setScoreCard(e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        {scoreCard ? (
                            <span className="text-green-600 ml-2">✔</span>
                        ) : (
                            <span className="text-gray-400 ml-2">–</span>
                        )}
                    </div>

                    {/* Charge Slip */}
                    <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <div className="w-1/3 font-medium text-gray-800">
                            Charge Slip
                        </div>
                        <input
                            type="text"
                            placeholder="-"
                            value={chargeSlip}
                            onChange={(e) => setChargeSlip(e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        {chargeSlip ? (
                            <span className="text-green-600 ml-2">✔</span>
                        ) : (
                            <span className="text-amber-500 ml-2">⚠</span>
                        )}
                    </div>
                </div>

                {/* OPTIONAL SECTION */}
                <h4 className="font-semibold text-gray-700 mt-4 mb-2">
                    Optional:
                </h4>
                <div className="space-y-2">
                    {/* Valid ID */}
                    <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <div className="w-1/3 font-medium text-gray-800">
                            Valid ID
                        </div>
                        <input
                            type="text"
                            placeholder="-"
                            value={validId}
                            onChange={(e) => setValidId(e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                    </div>

                    {/* Doctor’s Prescription */}
                    <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <div className="w-1/3 font-medium text-gray-800">
                            Doctor's Prescription
                        </div>
                        <input
                            type="text"
                            placeholder="-"
                            value={prescription}
                            onChange={(e) => setPrescription(e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                    </div>
                </div>

                {/* REMARKS */}
                <div className="mt-5">
                    <textarea
                        placeholder="Add Remarks here..."
                        maxLength={maxRemarksLength}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 text-sm h-32"
                    ></textarea>
                    <div className="text-right text-xs text-gray-500 mb-2">
                        {remarks.length}/{maxRemarksLength}
                    </div>

                    {/* Validation message + Send Button */}
                    {!isComplete && (
                        <div className="text-sm text-red-600 flex items-center mb-2">
                            ⚠ Complete the requirements to proceed
                        </div>
                    )}

                    <button
                        disabled={!isComplete}
                        onClick={handleSend}
                        className={`w-full sm:w-auto px-5 py-2 rounded text-white ${
                            isComplete
                                ? "bg-red-700 hover:bg-red-800"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Send
                    </button>
                </div>
            </div>
        </section>
    );
};

export default RequestApproval;
