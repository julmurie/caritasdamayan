import Navbar from "@/components/Navbar";
import FlashAlerts from "@/Components/FlashAlerts";
import PageHeader from "@/Components/PageHeader";

export default function Dashboard() {
    return (
        <>
            <FlashAlerts autoDismissMs={6000} /> {/* shows the session flash */}
            <Navbar />
            <div className="m-8">
                <PageHeader title="Dashboard" />
            </div>
        </>
    );
}
