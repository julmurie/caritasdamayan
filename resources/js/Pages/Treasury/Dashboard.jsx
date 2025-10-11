import Navbar from "@/components/Navbar";
import FlashAlerts from "@/Components/FlashAlerts";
import PageHeader from "@/Components/PageHeader";
import Footer from "@/components/Footer";

function Dashboard() {
    return (
        <div>
            <FlashAlerts autoDismissMs={6000} /> {/* shows the session flash */}
            <Navbar />
            <div className="px-6 py-6 min-h-screen bg-gray-50">
                {/* Header Placeholder */}
                <PageHeader title="Dashboard" />

                {/* Top Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center"
                        >
                            <div className="w-20 h-20 bg-gray-100 rounded-full mb-3"></div>
                            <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="w-10 h-3 bg-gray-100 rounded"></div>
                        </div>
                    ))}
                </div>

                {/* Bottom Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                            <ul className="space-y-4">
                                {[...Array(5)].map((_, j) => (
                                    <li
                                        key={j}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="inline-block w-2/3 h-3 bg-gray-200 rounded"></span>
                                        <span className="inline-block w-10 h-3 bg-gray-100 rounded"></span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard;
