import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

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
        <div className="min-h-screen bg-[#f6f8fa]">
            {/* Fixed navbar at the top (assumed ~56px tall) */}
            <Navbar />

            {/* === Layout: fixed-width sidebar + scrollable main === */}
            <div className="flex" style={{ height: "calc(100vh - 56px)" }}>
                {/* LEFT: Sidebar column (fixed width) */}
                <div className="shrink-0 w-[240px] md:w-[260px] lg:w-[280px] border-r bg-white">
                    {/* Keep sidebar visible under the fixed navbar */}
                    <div className="sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto">
                        <Sidebar active="charge-slip" />
                    </div>
                </div>

                {/* RIGHT: Page content (scrolls) */}
                <main className="flex-1 overflow-y-auto bg-[#f6f8fa] px-6 py-5">
                    <div className="max-w-[1300px]">
                        {/* Top row: Return / title / actions */}
                        <div className="flex items-center justify-between">
                            <button className="px-3 py-1.5 border rounded bg-white hover:bg-gray-50 text-sm">
                                ← Return
                            </button>
                            <h2 className="text-lg font-semibold">
                                Medicine Charge Slip
                            </h2>
                            <div className="flex items-center gap-3">
                                <button className="h-9 px-3 rounded border bg-white text-sm flex items-center gap-2 hover:bg-gray-50">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                        />
                                    </svg>

                                    <span>Edit</span>
                                </button>
                                <button className="h-9 px-3 rounded border bg-white text-sm flex items-center gap-2 hover:bg-gray-50">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                                        />
                                    </svg>

                                    <span>Print</span>
                                </button>
                            </div>
                        </div>
                        <div className="text-right text-[12px] text-gray-500 mt-1">
                            Ref Control No.: --
                        </div>

                        {/* Upload card */}
                        <div className="mt-4">
                            <div className={`${card} p-6`}>
                                <div className="border rounded-lg h-40 grid place-items-center">
                                    <div className="text-center">
                                        <button className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border bg-gray-100 hover:bg-gray-200 text-sm">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="size-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                                                />
                                            </svg>

                                            <span>Upload Document</span>
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
                        <div className="mt-5">
                            <div className={`${card} p-5`}>
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
                            </div>
                        </div>

                        {/* Patient Details */}
                        <div className="mt-6">
                            <div className={`${card} p-5`}>
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
                                        className="col-span-12 sm:col-span-2 lg:col-span-2"
                                    >
                                        <input className={baseInput} />
                                    </Field>
                                    <Field
                                        label="Contact Number"
                                        className="col-span-12 sm:col-span-4"
                                    >
                                        <input className={baseInput} />
                                    </Field>
                                    <Field
                                        label="Valid Government ID"
                                        className="col-span-12 sm:col-span-4"
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
                                        className="col-span-12 sm:col-span-4"
                                    >
                                        <input className={baseInput} />
                                    </Field>
                                </div>
                            </div>
                        </div>

                        {/* Medicine Table */}
                        <div className="mt-6 mb-20">
                            <div className={`${card} p-5`}>
                                <h3 className="font-semibold mb-3">
                                    Medicine Table
                                </h3>

                                {/* Entry row */}
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
                                                              }).map(
                                                                  (__, j) => (
                                                                      <td
                                                                          key={
                                                                              j
                                                                          }
                                                                          className="border px-2 py-6"
                                                                      >
                                                                          &nbsp;
                                                                      </td>
                                                                  )
                                                              )}
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

                                {/* Bottom actions: floating buttons */}
                                <div className="fixed bottom-4 right-6 flex justify-end gap-3">
                                    <button className="px-4 h-9 bg-[#495057] text-white rounded hover:bg-[#3e454b] text-sm">
                                        Edit Form
                                    </button>
                                    <button className="px-4 h-9 bg-[#2e7d32] text-white rounded hover:bg-[#276b2b] text-sm">
                                        Save Form
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default MedicineRequest;
