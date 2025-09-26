import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import styles from "../../../css/volunteer.module.css"; // shared CSS

function MedicineRequest() {
    const [partnerType, setPartnerType] = useState("Family Partner");
    const [medicines, setMedicines] = useState([]);
    const [entry, setEntry] = useState({
        unitCost: "",
        qty: "",
        packaging: "",
        name: "",
        dosage: "",
        amount: "",
        remarks: "",
    });

    // 🔥 Sidebar state synced with Sidebar via onToggle
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const addMedicine = () => {
        if (!entry.name) return;
        setMedicines((prev) => [...prev, entry]);
        setEntry({
            unitCost: "",
            qty: "",
            packaging: "",
            name: "",
            dosage: "",
            amount: "",
            remarks: "",
        });
    };

    const baseInput =
        "w-full h-9 rounded border border-gray-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/30";
    const baseLabel = "block text-[13px] text-gray-600";
    const card = "bg-white border rounded-lg";
    const Field = ({ label, className = "", children }) => (
        <div className={className}>
            <label className={baseLabel}>{label}</label>
            <div className="mt-1">{children}</div>
        </div>
    );

    return (
        <>
            <Navbar />
            <div
                className={`${styles.shell} ${
                    sidebarOpen ? styles.shellOpen : styles.shellClosed
                }`}
            >
                {/* Sidebar with toggle callback */}
                <Sidebar active="charge-slip" onToggle={setSidebarOpen} />

                {/* Main content */}
                <main className={styles.main}>
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-4">
                        <button className="px-3 py-1.5 border rounded bg-white hover:bg-gray-50 text-sm">
                            ← Return
                        </button>
                        <h2 className="text-lg font-semibold">
                            Medicine Charge Slip
                        </h2>
                        <div className="flex items-center gap-3">
                            <button className="h-9 px-3 rounded border bg-white text-sm hover:bg-gray-50">
                                Edit
                            </button>
                            <button className="h-9 px-3 rounded border bg-white text-sm hover:bg-gray-50">
                                Print
                            </button>
                        </div>
                    </div>
                    <div className="text-right text-[12px] text-gray-500 mb-6">
                        Ref Control No.: --
                    </div>

                    {/* Upload card */}
                    <div className="mt-4">
                        <div className={`${card} p-6`}>
                            <div className="border rounded-lg h-40 grid place-items-center">
                                <div className="text-center">
                                    <button className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border bg-gray-100 hover:bg-gray-200 text-sm">
                                        Upload Document
                                    </button>
                                    <p className="text-[13px] text-gray-500 mt-2">
                                        Upload your chargeslip here
                                    </p>
                                </div>
                            </div>
                            <p className="text-[12px] text-gray-500 mt-2">
                                Kindly double check if all the fields are
                                correct
                            </p>
                        </div>
                    </div>

                    {/* Top meta form */}
                    <section className={`${card} p-5 mb-6`}>
                        <div className="grid grid-cols-12 gap-4">
                            <Field
                                label="Date"
                                className="col-span-12 sm:col-span-3 lg:col-span-2"
                            >
                                <input className={baseInput} />
                            </Field>
                            <Field
                                label="All is Well:"
                                className="col-span-12 sm:col-span-3 lg:col-span-2"
                            >
                                <input className={baseInput} />
                            </Field>
                            <Field
                                label="Partner Institution & Branch"
                                className="col-span-12 sm:col-span-6 lg:col-span-4"
                            >
                                <input className={baseInput} />
                            </Field>
                            <Field
                                label="Issuing Program:"
                                className="col-span-12 sm:col-span-12 lg:col-span-4"
                            >
                                <input className={baseInput} />
                            </Field>
                            <Field
                                label="Clinic Name"
                                className="col-span-12 sm:col-span-6 lg:col-span-4"
                            >
                                <input className={baseInput} />
                            </Field>
                            <Field
                                label="Partner Institution Name & Branch"
                                className="col-span-12 sm:col-span-6 lg:col-span-8"
                            >
                                <input className={baseInput} />
                            </Field>
                            <Field
                                label="Parish Name"
                                className="col-span-12 sm:col-span-6 lg:col-span-4"
                            >
                                <input className={baseInput} />
                            </Field>
                            <Field
                                label="Parish Address"
                                className="col-span-12 sm:col-span-6 lg:col-span-5"
                            >
                                <input className={baseInput} />
                            </Field>
                            <Field
                                label="Family Partner/Non Family Partner"
                                className="col-span-12 sm:col-span-6 lg:col-span-3"
                            >
                                <select
                                    className={baseInput}
                                    value={partnerType}
                                    onChange={(e) =>
                                        setPartnerType(e.target.value)
                                    }
                                >
                                    <option>Family Partner</option>
                                    <option>Non-Family Partner</option>
                                </select>
                            </Field>
                        </div>
                    </section>

                    {/* Row2col: Patient Details (left) + Upload (right) */}
                    <div className={styles.row2col}>
                        <section className={`${card} p-5`}>
                            <h3 className="font-semibold mb-3">
                                Patient Details
                            </h3>
                            <div className="grid grid-cols-12 gap-4">
                                <Field
                                    label="Surname"
                                    className="col-span-12 sm:col-span-3"
                                >
                                    <input className={baseInput} />
                                </Field>
                                <Field
                                    label="First Name"
                                    className="col-span-12 sm:col-span-3"
                                >
                                    <input className={baseInput} />
                                </Field>
                                <Field
                                    label="Middle Initial"
                                    className="col-span-6 sm:col-span-2"
                                >
                                    <input className={baseInput} />
                                </Field>
                                <Field
                                    label="Age"
                                    className="col-span-6 sm:col-span-2"
                                >
                                    <input className={baseInput} />
                                </Field>
                                <Field
                                    label="Address"
                                    className="col-span-12 sm:col-span-6"
                                >
                                    <input className={baseInput} />
                                </Field>
                                <Field
                                    label="Contact Number"
                                    className="col-span-12 sm:col-span-6"
                                >
                                    <input className={baseInput} />
                                </Field>
                                <Field
                                    label="Valid Government ID"
                                    className="col-span-12 sm:col-span-6"
                                >
                                    <select className={baseInput}>
                                        <option>—</option>
                                        <option>PhilHealth</option>
                                        <option>SSS</option>
                                        <option>UMID</option>
                                        <option>Passport</option>
                                    </select>
                                </Field>
                                <Field
                                    label="Patient Diagnosis"
                                    className="col-span-12 sm:col-span-6"
                                >
                                    <input className={baseInput} />
                                </Field>
                            </div>
                        </section>

                        <aside className={`${card} p-6`}>
                            <div className="border rounded-lg h-40 grid place-items-center">
                                <div className="text-center">
                                    <button className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border bg-gray-100 hover:bg-gray-200 text-sm">
                                        Upload Document
                                    </button>
                                    <p className="text-[13px] text-gray-500 mt-2">
                                        Upload your chargeslip here
                                    </p>
                                </div>
                            </div>
                            <p className="text-[12px] text-gray-500 mt-2">
                                Kindly double check if all the fields are
                                correct
                            </p>
                        </aside>
                    </div>

                    {/* Medicine Table */}
                    <section className={`${card} p-5 mt-6`}>
                        <h3 className="font-semibold mb-3">Medicine Table</h3>
                        <div className="flex flex-wrap items-end gap-2 mb-3">
                            <Field label="Unit Cost" className="w-24">
                                <input
                                    className={baseInput}
                                    value={entry.unitCost}
                                    onChange={(e) =>
                                        setEntry({
                                            ...entry,
                                            unitCost: e.target.value,
                                        })
                                    }
                                />
                            </Field>
                            <Field label="Qty." className="w-16">
                                <input
                                    className={baseInput}
                                    value={entry.qty}
                                    onChange={(e) =>
                                        setEntry({
                                            ...entry,
                                            qty: e.target.value,
                                        })
                                    }
                                />
                            </Field>
                            <Field
                                label="Unit Packaging"
                                className="min-w-[160px] flex-1"
                            >
                                <input
                                    className={baseInput}
                                    value={entry.packaging}
                                    onChange={(e) =>
                                        setEntry({
                                            ...entry,
                                            packaging: e.target.value,
                                        })
                                    }
                                />
                            </Field>
                            <Field
                                label="Name of Medicine"
                                className="min-w-[220px] flex-1"
                            >
                                <input
                                    className={baseInput}
                                    value={entry.name}
                                    onChange={(e) =>
                                        setEntry({
                                            ...entry,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </Field>
                            <Field
                                label="Dosage Strength"
                                className="min-w-[160px]"
                            >
                                <input
                                    className={baseInput}
                                    value={entry.dosage}
                                    onChange={(e) =>
                                        setEntry({
                                            ...entry,
                                            dosage: e.target.value,
                                        })
                                    }
                                />
                            </Field>
                            <Field label="Amount" className="w-28">
                                <input
                                    className={baseInput}
                                    value={entry.amount}
                                    onChange={(e) =>
                                        setEntry({
                                            ...entry,
                                            amount: e.target.value,
                                        })
                                    }
                                />
                            </Field>
                            <Field
                                label="Remarks"
                                className="min-w-[160px] flex-1"
                            >
                                <input
                                    className={baseInput}
                                    value={entry.remarks}
                                    onChange={(e) =>
                                        setEntry({
                                            ...entry,
                                            remarks: e.target.value,
                                        })
                                    }
                                />
                            </Field>
                            <button
                                onClick={addMedicine}
                                className="h-9 px-4 rounded bg-[#2e7d32] text-white text-sm font-medium hover:bg-[#276b2b]"
                            >
                                Add
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {[
                                            "Unit Cost",
                                            "Qty.",
                                            "Unit Packaging",
                                            "Name of Medicine",
                                            "Dosage Strength",
                                            "Amount",
                                            "Remarks",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="border px-2 py-2 text-left font-medium"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicines.length === 0
                                        ? Array.from({ length: 5 }).map(
                                              (_, i) => (
                                                  <tr key={i}>
                                                      {Array.from({
                                                          length: 7,
                                                      }).map((__, j) => (
                                                          <td
                                                              key={j}
                                                              className="border px-2 py-6"
                                                          >
                                                              &nbsp;
                                                          </td>
                                                      ))}
                                                  </tr>
                                              )
                                          )
                                        : medicines.map((m, i) => (
                                              <tr key={i}>
                                                  <td className="border px-2 py-2">
                                                      {m.unitCost}
                                                  </td>
                                                  <td className="border px-2 py-2">
                                                      {m.qty}
                                                  </td>
                                                  <td className="border px-2 py-2">
                                                      {m.packaging}
                                                  </td>
                                                  <td className="border px-2 py-2">
                                                      {m.name}
                                                  </td>
                                                  <td className="border px-2 py-2">
                                                      {m.dosage}
                                                  </td>
                                                  <td className="border px-2 py-2">
                                                      {m.amount}
                                                  </td>
                                                  <td className="border px-2 py-2">
                                                      {m.remarks}
                                                  </td>
                                              </tr>
                                          ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Bottom actions */}
                        <div className="fixed bottom-4 right-6 flex justify-end gap-3">
                            <button className="px-4 h-9 bg-[#495057] text-white rounded hover:bg-[#3e454b] text-sm">
                                Edit Form
                            </button>
                            <button className="px-4 h-9 bg-[#2e7d32] text-white rounded hover:bg-[#276b2b] text-sm">
                                Save Form
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

export default MedicineRequest;
