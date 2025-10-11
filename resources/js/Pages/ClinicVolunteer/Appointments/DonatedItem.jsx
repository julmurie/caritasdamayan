import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

function DonatedItem() {
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        date: "",
        name: "",
        age: "",
        sex: "",
        received: false,
        items: [
            { name: "", quantity: "" },
        ],
        needOtherAssistance: "no", // "yes" | "no"
    });

    const inputStyle =
        "w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50";

    const update = (key) => (e) => {
        const value = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    // Initialize from URL (?patientId=123)
    useEffect(() => {
        try {
            const pid = new URLSearchParams(window.location.search).get("patientId");
            if (pid) setSelectedPatientId(pid);
        } catch (_) {}
    }, []);

    // Intentionally do not auto-fill Name/Age/Sex for Donated Item.

    const numberOfItems = useMemo(() => form.items.filter((i) => i.name?.trim()).length, [form.items]);

    const setItemField = (idx, key, value) => {
        setForm((prev) => {
            const next = [...prev.items];
            next[idx] = { ...next[idx], [key]: value };
            return { ...prev, items: next };
        });
    };

    const addItem = () => {
        setForm((prev) => ({ ...prev, items: [...prev.items, { name: "", quantity: "" }] }));
    };

    const removeItem = (idx) => {
        setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!form.date) newErrors.date = "Please input Date.";
        if (numberOfItems <= 0) newErrors.items = "Please add at least 1 item.";

        // Per-item validation
        form.items.forEach((it, i) => {
            const rowErr = {};
            if (!it.name?.trim()) rowErr.name = "Item name is required.";
            if (!it.quantity || Number(it.quantity) <= 0) rowErr.quantity = "Quantity must be greater than 0.";
            if (Object.keys(rowErr).length) {
                if (!newErrors.itemRows) newErrors.itemRows = {};
                newErrors.itemRows[i] = rowErr;
            }
        });

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        const payload = {
            patientId: selectedPatientId,
            date: form.date,
            name: form.name,
            age: form.age,
            sex: form.sex,
            received: form.received,
            items: form.items
                .filter((i) => i.name?.trim())
                .map((i) => ({ name: i.name.trim(), quantity: Number(i.quantity) })),
            numberOfItems,
            needOtherAssistance: form.needOtherAssistance,
        };
        console.log("Donated Item Submission:", payload);
        setTimeout(() => setLoading(false), 600);
    };

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
                        <h2 className="mb-4 text-center text-xl font-bold text-black">DONATED ITEM</h2>

                        {/* Date aligned similar to Initial Assessment */}
                        <div className="flex justify-start md:justify-end mb-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 whitespace-nowrap w-full md:w-auto">
                                <div>
                                    <label htmlFor="date" className="font-medium md:self-center ">
                                        Date:
                                    </label>
                                </div>
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

                        {/* Patient header fields */}
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
                                    className={`border border-gray-400 rounded-md px-3 py-1 text-sm focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50`}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Age */}
                            <div className="flex flex-col md:flex-row items-start gap-2">
                                <div className="md:w-32">
                                    <label className="font-medium whitespace-nowrap pt-[2px]">Age:</label>
                                </div>
                                <div className="flex flex-col w-full">
                                    <input
                                        id="age"
                                        type="number"
                                        min="1"
                                        value={form.age}
                                        onChange={update("age")}
                                        required
                                        className={`border border-gray-400 rounded-md px-2 py-1 text-sm focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50`}
                                    />
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
                                        className={`w-full border border-gray-400 rounded-md px-3 py-1 text-sm bg-white focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50`}
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                            </div>

                            {/* Number of Items */}
                            <div className="flex flex-col md:flex-row items-start gap-2">
                                <div className="md:w-40">
                                    <label className="font-medium whitespace-nowrap pt-[2px]">Number of Items:</label>
                                </div>
                                <div className="flex flex-col w-full md:max-w-[200px]">
                                    <input
                                        id="numItems"
                                        type="number"
                                        min="1"
                                        value={numberOfItems || ""}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            if (val > 0) {
                                                // optional: auto-adjust items array length if needed
                                            }
                                        }}
                                        className="w-full border border-gray-400 rounded-md px-2 py-1 text-sm focus:border-[#c61d22] focus:ring-1 focus:ring-[#c61d22]/50"
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Received the Item */}
                        <div className="mt-6 flex items-center gap-3">
                            <input
                                id="received"
                                type="checkbox"
                                checked={form.received}
                                onChange={update("received")}
                                className="h-4 w-4"
                            />
                            <label htmlFor="received" className="font-medium">Received the Item</label>
                        </div>

                        {/* Items list */}
                        <h3 className="mt-6 mb-2 text-lg font-semibold">Items</h3>
                        {errors.items && (
                            <p className="text-sm text-red-600 mb-2">{errors.items}</p>
                        )}
                        <div className="space-y-3">
                            {form.items.map((it, idx) => {
                                const rowErr = errors.itemRows?.[idx] || {};
                                return (
                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                                        <div className="md:col-span-7">
                                            <label className="block text-sm font-medium mb-1">Name of Item</label>
                                            <input
                                                type="text"
                                                value={it.name}
                                                onChange={(e) => setItemField(idx, "name", e.target.value)}
                                                className={inputStyle}
                                                placeholder="e.g., Paracetamol"
                                            />
                                            {rowErr.name && (
                                                <p className="text-xs text-red-600 mt-1">{rowErr.name}</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="block text-sm font-medium mb-1">Quantity per item</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={it.quantity}
                                                onChange={(e) => setItemField(idx, "quantity", e.target.value)}
                                                className={inputStyle}
                                                placeholder="e.g., 10"
                                            />
                                            {rowErr.quantity && (
                                                <p className="text-xs text-red-600 mt-1">{rowErr.quantity}</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2 flex md:justify-end">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(idx)}
                                                className="mt-6 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            <div>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="rounded-md bg-[#1e88e5] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1565c0]"
                                >
                                    Add Item
                                </button>
                            </div>
                        </div>

                        {/* Need other assistance? */}
                        <div className="mt-8">
                            <label className="font-semibold">Need other assistance?</label>
                            <div className="mt-2 flex gap-6">
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="needOtherAssistance"
                                        value="yes"
                                        checked={form.needOtherAssistance === "yes"}
                                        onChange={update("needOtherAssistance")}
                                    />
                                    Yes
                                </label>
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="needOtherAssistance"
                                        value="no"
                                        checked={form.needOtherAssistance === "no"}
                                        onChange={update("needOtherAssistance")}
                                    />
                                    No
                                </label>
                            </div>
                            {form.needOtherAssistance === "yes" && (
                                <p className="text-sm text-gray-600 mt-2">Proceed to other assistance after saving.</p>
                            )}
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
                                {loading ? "Saving…" : "Save Donated Item"}
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default DonatedItem;
