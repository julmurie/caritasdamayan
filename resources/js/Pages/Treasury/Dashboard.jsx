import Navbar from "@/components/Navbar";
import FlashAlerts from "@/Components/FlashAlerts";
import PageHeader from "@/Components/PageHeader";

function Dashboard() {
    return (
        <div>
            <FlashAlerts autoDismissMs={6000} /> {/* shows the session flash */}
            <Navbar />
            <div className="m-8">
                <PageHeader title="Dashboard" />
            </div>
        </div>
    );
}

export default Dashboard;
