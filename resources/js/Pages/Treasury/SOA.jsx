import React from "react";
import Navbar from "../../components/Navbar";
import SoaLayout from "../../components/SoaLayout";

export default function TreasurySOA() {
    return (
        <>
            <Navbar />
            <SoaLayout title="SOA" showAddButton={false} />
        </>
    );
}
