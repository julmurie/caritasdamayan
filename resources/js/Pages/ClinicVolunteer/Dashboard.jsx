import Navbar from "@/components/Navbar";
import FlashAlerts from "@/Components/FlashAlerts";
import PageHeader from "@/Components/PageHeader";
import Footer from "@/components/Footer";

function Dashboard() {
    return (
        <div className="flex flex-col min-h-screen">
            <FlashAlerts autoDismissMs={6000} /> {/* shows the session flash */}
            <Navbar />
            {/* Main Content */}
            <main className="flex-grow m-8">
                <PageHeader title="Dashboard" />
            </main>
            {/* Footer always at the bottom */}
            <Footer />
        </div>
    );
}

export default Dashboard;
