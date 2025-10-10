import Navbar from "@/components/Navbar";
import FlashAlerts from "@/Components/FlashAlerts";
import PageHeader from "@/Components/PageHeader";
import Footer from "@/components/Footer";

export default function Dashboard() {
  const clinics = [
    "Archdiocesan Shrine of our Lady of Loreto",
    "Holy Family",
    "Immaculate Conception",
    "Makati Homeville Laguna",
    "Mater Dolorosa",
    "National Shrine of the Sacred Heart of Jesus",
    "Our Lady of Guadalupe",
    "Our Lady of Remedies",
    "Parish of our Lady of Abandoned",
    "Risen Christ",
    "Sagrada Familia",
    "San Agustin",
    "San Felipe Neri",
    "San Fernando de Dilao",
    "San Ildefonso",
    "San Isidro Parish Montalban",
    "San Juan Nepomuce",
    "San Rafael (Balut)",
    "San Sebastian",
    "Southville Nha Site Laguna",
    "St. John Bosco Tondo",
    "St. John the Baptist",
    "St. Pius X",
    "Sta. Cruz",
    "Sta. Monica",
    "Sto. Niño de Baseco",
    "Sto. Niño de Pandacan",
    "Sto. Niño de Tondo",
  ];

  return (
    <>
        <FlashAlerts autoDismissMs={6000} />
        <Navbar />
        <div className="m-8">
            <PageHeader title="Dashboard" />

            {/* Expense Table + Calendar */}
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                {/* Expense Table */}
                <div className="w-full lg:w-3/4 bg-white border border-red-700 rounded-lg shadow-sm">
                    {/* Header Row */}
                    <div className="flex justify-between items-center bg-red-700 text-white px-4 py-2 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-lg">
                                Expense and Budget Monitoring
                            </h2>
                            {/* Plus Icon */}
                            <button className="hover:text-gray-200 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            {/* Sort */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                            </svg>
                            {/* Filter */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                            </svg>
                            {/* Refresh */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-b-lg overflow-hidden">
                        <table className="min-w-full border-collapse border border-red-700 text-base">
                            <thead className="bg-red-100">
                                <tr className="text-left text-red-900">
                                    <th className="border border-red-700 px-3 py-0.2">Clinic</th>
                                    <th className="border border-red-700 px-3 py-0.2">Allotted Budget</th>
                                    <th className="border border-red-700 px-3 py-0.2">Medicines</th>
                                    <th className="border border-red-700 px-3 py-0.2">Laboratories</th>
                                    <th className="border border-red-700 px-3 py-0.2">Total Expenses</th>
                                    <th className="border border-red-700 px-3 py-0.2">Remaining Budget</th>
                                    <th className="border border-red-700 px-3 py-0.2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clinics.map((clinic, index) => (
                                    <tr key={index} className="hover:bg-red-50">
                                        <td className="border border-red-700 px-3 py-0.2">{index + 1}. {clinic}</td>
                                        <td className="border border-red-700 px-3 py-0.2">100,000.00</td>
                                        <td className="border border-red-700 px-3 py-0.2">0.00</td>
                                        <td className="border border-red-700 px-3 py-0.2">0.00</td>
                                        <td className="border border-red-700 px-3 py-0.2">0.00</td>
                                        <td className="border border-red-700 px-3 py-0.2">100,000.00</td>
                                        <td className="border border-red-700 px-3 py-0.2 text-center">
                                            <div className="flex justify-center gap-2">
                                                {/* Edit */}
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-700 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>

                                                {/* Archive */}
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-700 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {/* Total Row */}
                                <tr className="font-semibold bg-red-100 text-red-900">
                                    <td className="border border-red-700 px-3 py-1 text-right">Total:</td>
                                    <td className="border border-red-700 px-3 py-1">2,800,000.00</td>
                                    <td className="border border-red-700 px-3 py-1">0.00</td>
                                    <td className="border border-red-700 px-3 py-1">0.00</td>
                                    <td className="border border-red-700 px-3 py-1">0.00</td>
                                    <td className="border border-red-700 px-3 py-1">2,800,000.00</td>
                                    <td className="border border-red-700 px-3 py-1"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Date & Time Card (Now Square) */}
                <div className="lg:w-1/4 bg-white border border-red-700 rounded-lg text-center shadow-sm h-fit p-0">
                    <div className="bg-red-700 text-white text-lg py-2 rounded-t-lg font-semibold">
                        Date & Time
                    </div>
                    <div className="p-6 space-y-2">
                        <p className="text-gray-700 text-3xl font-semibold">Wednesday</p>
                        <p className="text-3xl font-bold text-gray-900 tabular-nums">September 01, 2025</p>
                        <p className="text-2xl font-bold text-gray-800 tabular-nums">12:00:00 PM</p>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </>
  );
}