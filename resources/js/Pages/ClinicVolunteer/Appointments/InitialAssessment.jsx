import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

function Field({
    id,
    label,
    children,
    required,
    className = "",
    align = "center", // "center" | "start" for textarea
}) {
    return (
        <div
            className={`flex ${
                align === "start" ? "items-start" : "items-center"
            } gap-4 ${className}`}
        >
            <label
                htmlFor={id}
                className="w-44 shrink-0 text-sm font-medium text-gray-700"
            >
                {label}
                {required ? (
                    <span className="text-red-500 ml-0.5" aria-hidden>
                        *
                    </span>
                ) : null}
            </label>
            <div className="flex-1">{children}</div>
        </div>
    );
}

const inputBase =
    "block w-full rounded-md border border-gray-300 bg-white px-3 py-[9px] text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-[#c61d22] focus:ring-2 focus:ring-[#c61d22]/50 sm:text-sm";

function InitialAssessment() {
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [form, setForm] = useState({
        date: "",
        name: "",
        age: "",
        sex: "",
        temperature: "",
        bloodPressure: "",
        height: "",
        weight: "",
        pulseRate: "",
        respiratoryRate: "",
        spo2: "",
        chiefComplaint: "",
        physician: "",
        licNo: "",
        ptrNo: "",
        s2No: "",
    });

    const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        // Light inline validation
        if (!form.name || !form.date) {
            alert("Please fill out at least Date and Name.");
            return;
        }
        setLoading(true);
        // TODO: Hook this up to an API/Inertia post
        // For now, just log the data
        console.log("Initial Assessment:", form);
        setTimeout(() => setLoading(false), 600);
    };

    return (
        <div className="min-h-screen bg-gray-50 print:bg-white">
            <Navbar />
            {/* Content with Sidebar (full-width like Referral) */}
            <div className="w-full flex">
                <Sidebar
                    onToggle={(open) => setSidebarOpen(open)}
                    onSelect={(id) => setSelectedPatientId(id)}
                    selectedId={selectedPatientId}
                />

                {/* Main content area with padding */}
                <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
                    <main>
                        <div className="mb-6 flex items-end justify-between gap-4 print:mb-3">
                            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                                Initial Patient Assessment
                            </h1>
                            <div className="text-right">
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Date
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    value={form.date}
                                    onChange={update("date")}
                                    className={`${inputBase} sm:w-56`}
                                    required
                                />
                            </div>
                        </div>

                        <form
                            onSubmit={onSubmit}
                            className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200 print:shadow-none print:ring-0 sm:p-6"
                        >
                    <div className="grid grid-cols-1 gap-4 sm:gap-5">
                        <Field id="name" label="Name" required>
                            <input
                                id="name"
                                type="text"
                                value={form.name}
                                onChange={update("name")}
                                placeholder="Last, First M.I."
                                className={inputBase}
                                required
                            />
                        </Field>

                        {/* Single-row fields */}
                        <Field id="age" label="Age">
                            <input
                                id="age"
                                type="number"
                                min="0"
                                value={form.age}
                                onChange={update("age")}
                                className={inputBase}
                            />
                        </Field>
                        <Field id="sex" label="Sex">
                            <select
                                id="sex"
                                value={form.sex}
                                onChange={update("sex")}
                                className={inputBase}
                            >
                                <option value="">Select…</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Intersex</option>
                                <option>Prefer not to say</option>
                            </select>
                        </Field>
                        <Field id="temperature" label="Temperature (°C)">
                            <input
                                id="temperature"
                                type="text"
                                inputMode="decimal"
                                placeholder="e.g. 36.8"
                                value={form.temperature}
                                onChange={update("temperature")}
                                className={inputBase}
                            />
                        </Field>
                        <Field id="bp" label="Blood Pressure (mmHg)">
                            <input
                                id="bp"
                                type="text"
                                placeholder="e.g. 120/80"
                                value={form.bloodPressure}
                                onChange={update("bloodPressure")}
                                className={inputBase}
                            />
                        </Field>
                        <Field id="height" label="Height (cm)">
                            <input
                                id="height"
                                type="number"
                                min="0"
                                step="0.1"
                                value={form.height}
                                onChange={update("height")}
                                className={inputBase}
                            />
                        </Field>
                        <Field id="weight" label="Weight (kg)">
                            <input
                                id="weight"
                                type="number"
                                min="0"
                                step="0.1"
                                value={form.weight}
                                onChange={update("weight")}
                                className={inputBase}
                            />
                        </Field>
                        <Field id="pulseRate" label="Pulse Rate (bpm)">
                            <input
                                id="pulseRate"
                                type="number"
                                min="0"
                                step="1"
                                value={form.pulseRate}
                                onChange={update("pulseRate")}
                                className={inputBase}
                            />
                        </Field>
                        <Field
                            id="respiratoryRate"
                            label="Respiratory Rate (breaths/min)"
                        >
                            <input
                                id="respiratoryRate"
                                type="number"
                                min="0"
                                step="1"
                                value={form.respiratoryRate}
                                onChange={update("respiratoryRate")}
                                className={inputBase}
                            />
                        </Field>
                        <Field id="spo2" label="SPO2 (Oxygen %)">
                            <input
                                id="spo2"
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                value={form.spo2}
                                onChange={update("spo2")}
                                className={inputBase}
                            />
                        </Field>

                        {/* Chief Complaint */}
                        <Field
                            id="chiefComplaint"
                            label="Chief Complaint"
                            align="start"
                        >
                            <textarea
                                id="chiefComplaint"
                                value={form.chiefComplaint}
                                onChange={update("chiefComplaint")}
                                rows={4}
                                placeholder="Describe the patient's main concern…"
                                className={`${inputBase} resize-y`}
                            />
                        </Field>

                        <hr className="my-2 border-gray-200" />

                        {/* Physician + credentials */}
                        <Field id="physician" label="Attending Physician">
                            <div className="flex items-center gap-2">
                                <input
                                    id="physician"
                                    type="text"
                                    value={form.physician}
                                    onChange={update("physician")}
                                    placeholder="Full name"
                                    className={`${inputBase} sm:max-w-md`}
                                />
                                <span className="text-sm text-gray-700">, M.D.</span>
                            </div>
                        </Field>

                        <Field id="licNo" label="LIC No.">
                            <input
                                id="licNo"
                                type="text"
                                value={form.licNo}
                                onChange={update("licNo")}
                                className={inputBase}
                            />
                        </Field>
                        <Field id="ptrNo" label="PTR No.">
                            <input
                                id="ptrNo"
                                type="text"
                                value={form.ptrNo}
                                onChange={update("ptrNo")}
                                className={inputBase}
                            />
                        </Field>
                        <Field id="s2No" label="S2 No.">
                            <input
                                id="s2No"
                                type="text"
                                value={form.s2No}
                                onChange={update("s2No")}
                                className={inputBase}
                            />
                        </Field>

                        {/* Actions */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-md bg-[#c61d22] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#a8181c] focus:outline-none focus:ring-2 focus:ring-[#c61d22]/50 disabled:opacity-60"
                            >
                                {loading ? "Saving…" : "Save Assessment"}
                            </button>
                        </div>
                        {/* close fields grid */}
                        </div>
                        </form>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
        
    );
}

export default InitialAssessment;
