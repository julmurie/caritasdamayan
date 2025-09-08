// resources/js/Components/FlashAlerts.jsx
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Alert from "./Alert";

export default function FlashAlerts({
    autoDismissMs = 6000,
    topOffset = "top-4",
}) {
    const { props } = usePage();
    const flash = props?.flash || {};
    const [open, setOpen] = useState({
        success: !!flash.success,
        error: !!flash.error,
        info: !!flash.info,
        warning: !!flash.warning,
    });

    useEffect(() => {
        setOpen({
            success: !!flash.success,
            error: !!flash.error,
            info: !!flash.info,
            warning: !!flash.warning,
        });
    }, [flash.success, flash.error, flash.info, flash.warning]);

    return (
        <div
            // fixed, top-right, stacked; pointer-events so clicks only hit alerts
            className={`fixed ${topOffset} right-4 z-[100] w-full max-w-sm pointer-events-none space-y-3 sm:${topOffset}`}
            aria-live="polite"
        >
            {open.success && flash.success && (
                <Alert
                    variant="success"
                    onClose={() => setOpen((s) => ({ ...s, success: false }))}
                    autoDismissMs={autoDismissMs}
                    className="pointer-events-auto shadow-lg"
                >
                    {flash.success}
                </Alert>
            )}

            {open.error && flash.error && (
                <Alert
                    variant="danger"
                    onClose={() => setOpen((s) => ({ ...s, error: false }))}
                    className="pointer-events-auto shadow-lg"
                >
                    {flash.error}
                </Alert>
            )}

            {open.info && flash.info && (
                <Alert
                    variant="info"
                    onClose={() => setOpen((s) => ({ ...s, info: false }))}
                    autoDismissMs={autoDismissMs}
                    className="pointer-events-auto shadow-lg"
                >
                    {flash.info}
                </Alert>
            )}

            {open.warning && flash.warning && (
                <Alert
                    variant="warning"
                    onClose={() => setOpen((s) => ({ ...s, warning: false }))}
                    className="pointer-events-auto shadow-lg"
                >
                    {flash.warning}
                </Alert>
            )}
        </div>
    );
}
