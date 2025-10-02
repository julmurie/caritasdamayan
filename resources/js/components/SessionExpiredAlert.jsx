import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import AlertDialog from "@/Components/AlertDialog";

export default function SessionExpiredAlert() {
    const { props } = usePage();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (props.expired) {
            setOpen(true);
        }
    }, [props.expired]);

    return (
        <AlertDialog
            open={open}
            onClose={() => {
                setOpen(false);
                window.location.href = "/login";
            }}
            title="Session Expired"
            message="Your session has ended. Please log in again."
            okText="OK"
        />
    );
}
