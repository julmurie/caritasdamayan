import React from "react";
import Navbar from "../../components/Navbar";
import SoaLayout from "../../components/SoaLayout";

export default function AccountingSOA() {
    return (
        <>
            <Navbar />
            <SoaLayout title="SOA" showAddButton={false} />
        </>
    );
}
