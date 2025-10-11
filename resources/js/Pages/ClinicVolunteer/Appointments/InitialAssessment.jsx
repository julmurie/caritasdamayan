import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

function InitialAssessment() {
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [errors, setErrors] = useState({});
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
        const newErrors = {};
        if (!form.name) newErrors.name = "Please input Name.";
        if (!form.date) newErrors.date = "Please input Date.";
        if (!form.age) newErrors.age = "Please input Age.";
        if (!form.sex) newErrors.sex = "Please input Sex.";
        if (!form.temperature) newErrors.temperature = "Please input Temperature.";
        if (!form.bloodPressure) newErrors.bloodPressure = "Please input Blood Pressure.";
        if (!form.height) newErrors.height = "Please input Height.";
        if (!form.weight) newErrors.weight = "Please input Weight.";
        if (!form.pulseRate) newErrors.pulseRate = "Please input Pulse Rate.";
        if (!form.respiratoryRate) newErrors.respiratoryRate = "Please input Respiratory Rate.";
        if (!form.spo2) newErrors.spo2 = "Please input SPO2 (Oxygen).";
        if (!form.physician) newErrors.physician = "Please input Physician Name.";
        if (!form.licNo) newErrors.licNo = "Please input LIC No.";
        if (!form.ptrNo) newErrors.ptrNo = "Please input PTR No.";
        if (!form.s2No) newErrors.s2No = "Please input S2 No.";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        console.log("Initial Assessment:", form);
        setTimeout(() => setLoading(false), 600);
    };

    const inputStyle =
        "w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col print:bg-white">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar
                    onToggle={(open) => setSidebarOpen(open)}
                    onSelect={(id) => setSelectedPatientId(id)}
                    selectedId={selectedPatientId}
                />

                {/* MAIN CONTAINER */}
                <div className="flex-1 min-w-0 bg-white p-4 md:p-8 shadow-inner">
                    <main className="mx-auto max-w-5xl border border-dashed border-gray-400 rounded-md p-4 md:p-8 bg-white">
                        <h2 className="mb-4 text-center text-xl font-bold text-black">
                            INITIAL PATIENT ASSESSMENT
                        </h2>

                        {/* SECTION I */}
                        <h3 className="mb-2 text-lg font-semibold">
                            <span className="underline">I. VITAL SIGN RECORD:</span>
                            <span className="text-red-500">*</span>
                        </h3>

                        {/* Date aligned right on desktop, left on mobile, no label shift */}
                        <div className="flex justify-start md:justify-end mb-4">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 whitespace-nowrap w-full md:w-auto">
                            
                            {/* Label stays fixed */}
                            <div>
                            <label htmlFor="date" className="font-medium md:self-center ">
                                Date:
                            </label>
                            </div>

                            {/* Input + Error grouped together */}
                            <div className="flex flex-col w-full md:w-auto">
                            <input
                                id="date"
                                type="date"
                                value={form.date}
                                onChange={update("date")}
                                required
                                className="border border-gray-400 rounded-md px-2 py-1 text-sm focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50 w-full md:w-auto"
                            />
                            {errors.date && (
                                <p className="text-xs text-red-600 mt-1">{errors.date}</p>
                            )}
                            </div>
                        </div>
                        </div>

                        {/* Name */}
                        <div className="flex flex-col md:flex-row items-start gap-2 mb-3">
                            <div className="md:w-20">
                                <label className="font-medium whitespace-nowrap pt-[2px]">Name:</label>
                            </div>
                            <div className="flex flex-col w-full">
                                <input
                                    id="name"
                                    type="text"
                                    value={form.name}
                                    onChange={update("name")}
                                    required
                                    className="border border-gray-400 rounded-md px-3 py-1 text-sm focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50"
                                />
                                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                            </div>
                        </div>

                        {/* Age, Sex, Temp */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Age */}
                            <div className="flex flex-col md:flex-row items-start gap-2">
                                <div className="md:w-32">
                                    <label className="font-medium whitespace-nowrap pt-[2px]">Age:</label>
                                </div>
                                <div className="flex flex-col w-full">
                                    <input id="age" type="number" min="1"
                                        value={form.age} onChange={update("age")} required
                                        className="border border-gray-400 rounded-md px-2 py-1 text-sm focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50" />
                                    {errors.age && <p className="text-xs text-red-600 mt-1">{errors.age}</p>}
                                </div>
                            </div>

                            {/* Sex */}
                            <div className="flex flex-col md:flex-row items-start gap-2">
                                <div className="md:w-16">
                                    <label className="font-medium whitespace-nowrap pt-[2px]">Sex:</label>
                                </div>
                                <div className="flex flex-col w-full">
                                    <select
                                        id="sex"
                                        value={form.sex}
                                        onChange={update("sex")}
                                        required
                                        className="w-full border border-gray-400 rounded-md px-3 py-1 text-sm bg-white focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50"
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Others">Others</option>
                                    </select>
                                    {errors.sex && <p className="text-xs text-red-600 mt-1">{errors.sex}</p>}
                                </div>
                            </div>

                            {/* Temperature */}
                            <div className="flex flex-col md:flex-row items-start gap-2">
                                <div className="md:w-28">
                                    <label className="font-medium whitespace-nowrap pt-[2px]">Temperature:</label>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="relative flex w-full">
                                        <input id="temperature" type="number" min="0"
                                            value={form.temperature} onChange={update("temperature")} required
                                            className="w-full border border-gray-400 rounded-l-md px-3 py-1 text-sm focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50" />
                                        <span className="flex items-center justify-center w-16 bg-gray-200 border border-l-0 border-gray-400 rounded-r-md text-gray-700 text-xs font-semibold">
                                            °C
                                        </span>
                                    </div>
                                    {errors.temperature && <p className="text-xs text-red-600 mt-1">{errors.temperature}</p>}
                                </div>
                            </div>
                        </div>

                        {/* BP & Height */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            {/* Blood Pressure */}
                            <div className="flex flex-col md:flex-row items-start gap-2">
                                <div className="md:w-36">
                                    <label className="font-medium whitespace-nowrap pt-[2px]">Blood Pressure:</label>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="relative flex w-full">
                                        <input id="bp" type="text"
                                            value={form.bloodPressure} onChange={update("bloodPressure")} required
                                            className="w-full border border-gray-400 rounded-l-md px-3 py-1 text-sm focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50" />
                                        <span className="flex items-center justify-center w-16 bg-gray-200 border border-l-0 border-gray-400 rounded-r-md text-gray-700 text-xs font-semibold">
                                            mmHg
                                        </span>
                                    </div>
                                    {errors.bloodPressure && <p className="text-xs text-red-600 mt-1">{errors.bloodPressure}</p>}
                                </div>
                            </div>

                            {/* Height */}
                            <div className="flex flex-col md:flex-row items-start gap-2">
                                <div className="md:w-20">
                                    <label className="font-medium whitespace-nowrap pt-[2px]">Height:</label>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="relative flex w-full">
                                        <input id="height" type="number" min="0"
                                            value={form.height} onChange={update("height")} required
                                            className="w-full border border-gray-400 rounded-l-md px-3 py-1 text-sm focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50" />
                                        <span className="flex items-center justify-center w-16 bg-gray-200 border border-l-0 border-gray-400 rounded-r-md text-gray-700 text-xs font-semibold">
                                            cm
                                        </span>
                                    </div>
                                    {errors.height && <p className="text-xs text-red-600 mt-1">{errors.height}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Weight & Pulse Rate */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            {/* Weight */}
                            <div className="flex flex-col md:flex-row items-start gap-2">
                                <div className="md:w-24">
                                    <label className="font-medium whitespace-nowrap pt-[2px]">Weight:</label>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="relative flex w-full">
                                        <input id="weight" type="number" min="0"
                                            value={form.weight} onChange={update("weight")} required
                                            className="w-full border border-gray-400 rounded-l-md px-3 py-1 text-sm focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50" />
                                        <span className="flex items-center justify-center w-16 bg-gray-200 border border-l-0 border-gray-400 rounded-r-md text-gray-700 text-xs font-semibold">
                                            kg
                                        </span>
                                    </div>
                                    {errors.weight && <p className="text-xs text-red-600 mt-1">{errors.weight}</p>}
                                </div>
                            </div>

                            {/* Pulse Rate */}
                            <div className="flex flex-col md:flex-row items-start gap-2">
                                <div className="md:w-28">
                                    <label className="font-medium whitespace-nowrap pt-[2px]">Pulse Rate:</label>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="relative flex w-full">
                                        <input id="pulseRate" type="number" min="0"
                                            value={form.pulseRate} onChange={update("pulseRate")} required
                                            className="w-full border border-gray-400 rounded-l-md px-3 py-1 text-sm focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50" />
                                        <span className="flex items-center justify-center w-16 bg-gray-200 border border-l-0 border-gray-400 rounded-r-md text-gray-700 text-xs font-semibold">
                                            bpm
                                        </span>
                                    </div>
                                    {errors.pulseRate && <p className="text-xs text-red-600 mt-1">{errors.pulseRate}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Respiratory & SPO2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            {/* Respiratory Rate */}
                            <div className="flex flex-col md:flex-row items-start gap-2">
                                <div className="md:w-40">
                                    <label className="font-medium whitespace-nowrap pt-[2px]">Respiratory Rate:</label>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="relative flex w-full">
                                        <input id="respiratoryRate" type="number" min="0"
                                            value={form.respiratoryRate} onChange={update("respiratoryRate")} required
                                            className="w-full border border-gray-400 rounded-l-md px-3 py-1 text-sm focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50" />
                                        <span className="flex items-center justify-center w-16 bg-gray-200 border border-l-0 border-gray-400 rounded-r-md text-gray-700 text-xs font-semibold">
                                            bpm
                                        </span>
                                    </div>
                                    {errors.respiratoryRate && <p className="text-xs text-red-600 mt-1">{errors.respiratoryRate}</p>}
                                </div>
                            </div>

                            {/* SPO2 */}
                            <div className="flex flex-col md:flex-row items-start gap-2">
                                <div className="md:w-32">
                                    <label className="font-medium whitespace-nowrap pt-[2px]">SPO2 (Oxygen):</label>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="relative flex w-full">
                                        <input id="spo2" type="number" min="0"
                                            value={form.spo2} onChange={update("spo2")} required
                                            className="w-full border border-gray-400 rounded-l-md px-3 py-1 text-sm focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50" />
                                        <span className="flex items-center justify-center w-16 bg-gray-200 border border-l-0 border-gray-400 rounded-r-md text-gray-700 text-xs font-semibold">
                                            %
                                        </span>
                                    </div>
                                    {errors.spo2 && <p className="text-xs text-red-600 mt-1">{errors.spo2}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SECTION II */}
                        <h3 className="mt-8 mb-2 text-lg font-semibold underline">
                            II. CHIEF COMPLAINT:
                        </h3>
                        <div className="flex flex-col">
                            <textarea
                                id="chiefComplaint"
                                rows={3}
                                value={form.chiefComplaint}
                                onChange={update("chiefComplaint")}
                                placeholder="Enter patient's main concern..."
                                className={`${inputStyle} resize-y border border-gray-300 bg-white`}
                            ></textarea>
                        </div>

                        {/* SECTION III */}
                        <h3 className="mt-8 mb-2 text-lg font-semibold">
                            <span className="underline">III. ATTENDING PHYSICIAN:</span>
                            <span className="text-red-500">*</span>
                        </h3>
                        <div className="space-y-3 text-base">
                            <div className="flex flex-col">
                                <label className="font-medium whitespace-nowrap">Name:</label>
                                <input
                                    id="physician"
                                    type="text"
                                    value={form.physician}
                                    onChange={update("physician")}
                                    required
                                    placeholder="Full Name, M.D."
                                    className={inputStyle}
                                />
                                {errors.physician && <p className="text-xs text-red-600 mt-1">{errors.physician}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="flex flex-col">
                                    <label className="font-medium whitespace-nowrap">LIC No.:</label>
                                    <input id="licNo" type="number" min="0"
                                        value={form.licNo} onChange={update("licNo")} required className={inputStyle} />
                                    {errors.licNo && <p className="text-xs text-red-600 mt-1">{errors.licNo}</p>}
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-medium whitespace-nowrap">PTR No.:</label>
                                    <input id="ptrNo" type="number" min="0"
                                        value={form.ptrNo} onChange={update("ptrNo")} required className={inputStyle} />
                                    {errors.ptrNo && <p className="text-xs text-red-600 mt-1">{errors.ptrNo}</p>}
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-medium whitespace-nowrap">S2 No.:</label>
                                    <input id="s2No" type="number" min="0"
                                        value={form.s2No} onChange={update("s2No")} required className={inputStyle} />
                                    {errors.s2No && <p className="text-xs text-red-600 mt-1">{errors.s2No}</p>}
                                </div>
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="mt-10 flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 w-full sm:w-auto"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                onClick={onSubmit}
                                disabled={loading}
                                className="rounded-md bg-[#2e7d32] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#276b2b] disabled:opacity-60 w-full sm:w-auto"
                            >
                                {loading ? "Saving…" : "Save Assessment"}
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default InitialAssessment;
