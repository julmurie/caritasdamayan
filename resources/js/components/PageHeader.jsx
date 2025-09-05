import React from "react";
import { usePage } from "@inertiajs/react";

export default function PageHeader({ title, right }) {
    const { auth } = usePage().props;
    const role = auth?.user?.role || "";
    const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                <div>
                    <h1 className="!text-3xl md:!text-4xl font-extrabold tracking-tight text-gray-900">
                        {title}
                    </h1>
                    {roleLabel && (
                        <p className="!text-base text-gray-600 mt-2">
                            {roleLabel}
                        </p>
                    )}
                </div>
                {right && <div className="shrink-0">{right}</div>}
            </div>
            <hr className="border-gray-300" />
        </div>
    );
}
