import { useState, useEffect, useCallback } from "react";
import { router } from "@inertiajs/react";
import { Link, usePage } from "@inertiajs/react";
import CaritasLogo from "../../images/CaritasManilaLogo_White.svg";
import ConfirmDialog from "@/Components/ConfirmDialog";
import Alert from "@/Components/Alert";

export default function Navbar() {
    const { url, props } = usePage();
    const roleFromProps = props?.auth?.user?.role ?? null;

    const [open, setOpen] = useState(false);
    const [role, setRole] = useState(roleFromProps);

    // derive role from Inertia props first, fallback to localStorage ("me")
    useEffect(() => {
        if (roleFromProps) {
            setRole(roleFromProps);
            return;
        }
        try {
            const me = JSON.parse(localStorage.getItem("me") || "null");
            if (me?.role) setRole(me.role);
        } catch {
            /* ignore */
        }
    }, [roleFromProps]);

    // close mobile when crossing breakpoint (match your CSS: 1024px)
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)");
        const onChange = (e) => e.matches && setOpen(false);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    // close on route change
    useEffect(() => setOpen(false), [url]);

    // close on ESC
    const onKeyDown = useCallback(
        (e) => e.key === "Escape" && setOpen(false),
        []
    );
    useEffect(() => {
        if (!open) return;
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onKeyDown]);

    // role-based links (exactly from your comment)
    const navConfig = {
        admin: [
            { name: "Dashboard", href: "/admin/dashboard" },
            { name: "Patients", href: "/admin/patients" },
            { name: "Approvals", href: "/admin/approvals" },
            { name: "Prices", href: "/admin/prices" },
            { name: "Charge Slips", href: "/admin/charge-slips" },
            { name: "SOA", href: "/admin/soa" },
            { name: "Users", href: "/admin/users" },
            { name: "Logs", href: "/admin/logs" },
        ],
        volunteer: [
            { name: "Dashboard", href: "/volunteer/dashboard" },
            { name: "Patients", href: "/volunteer/patients" },
            { name: "Charge Slips", href: "/volunteer/charge-slips" },
            { name: "Prices", href: "/volunteer/prices" },
        ],
        merchant: [
            { name: "Dashboard", href: "/merchant/dashboard" },
            { name: "Prices", href: "/merchant/prices" },
            { name: "Charge Slips", href: "/merchant/charge-slips" },
            { name: "SOA", href: "/merchant/soa" },
        ],
        accounting: [
            { name: "Dashboard", href: "/accounting/dashboard" },
            { name: "SOA", href: "/accounting/soa" },
        ],
        treasury: [
            { name: "Dashboard", href: "/treasury/dashboard" },
            { name: "SOA", href: "/treasury/soa" },
        ],
    };

    const links = role && navConfig[role] ? navConfig[role] : [];

    const isActive = (href) => url.startsWith(href);
    const logoHref = links.length ? links[0].href : "/";

    // ===== New: confirm + toast states =====
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [toast, setToast] = useState(null); // { variant: "success"|"danger"|..., msg: string }

    const openLogoutConfirm = () => setShowLogoutConfirm(true);

    const doLogout = () => {
        setShowLogoutConfirm(false);
        router.post(
            "/logout",
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    // If you also use API token calls, clear local token cache
                    localStorage.removeItem("token");
                    localStorage.removeItem("me");
                    // Success toast after redirect is handled by server flash -> FlashAlerts
                },
                onError: () => {
                    setToast({
                        variant: "danger",
                        msg: "Logout failed. Please try again.",
                    });
                },
            }
        );
    };

    return (
        <>
            {/* Floating toast (uses your Alert component) */}
            {toast && (
                <div className="fixed top-3 right-3 z-[9999] w-[min(420px,calc(100%-1rem))]">
                    <Alert
                        variant={toast.variant}
                        autoDismissMs={4000}
                        onClose={() => setToast(null)}
                    >
                        {toast.msg}
                    </Alert>
                </div>
            )}

            {/* Logout confirm dialog */}
            <ConfirmDialog
                open={showLogoutConfirm}
                variant="danger"
                title="Log out?"
                message="You will be signed out of your session."
                confirmText="Log out"
                cancelText="Cancel"
                onCancel={() => setShowLogoutConfirm(false)}
                onConfirm={doLogout}
            />
            <header className="navbar-header">
                <nav
                    className="navbar-container"
                    role="navigation"
                    aria-label="Main"
                >
                    {/* Left: Logo + Desktop menu */}
                    <div className="navbar-left">
                        <img
                            src={CaritasLogo}
                            alt="Caritas Manila Logo"
                            className="navbar-logo"
                        />

                        <ul className="navbar-menu" role="menubar">
                            {links.map((link) => (
                                <li key={link.name} role="none">
                                    <Link
                                        href={link.href}
                                        role="menuitem"
                                        className={`navbar-link ${
                                            isActive(link.href) ? "active" : ""
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: icons (always visible) + hamburger */}
                    <div className="navbar-right">
                        <Link
                            href="/profile"
                            aria-label="User Profile"
                            className="navbar-icon-link"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                            </svg>
                        </Link>

                        <Link
                            href="/notifications"
                            aria-label="Notifications"
                            className="navbar-icon-link"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                                />
                            </svg>
                        </Link>

                        {/* Logout -> open confirm dialog */}
                        <button
                            onClick={openLogoutConfirm}
                            aria-label="Logout"
                            className="navbar-icon-link"
                            style={{ background: "transparent", border: 0 }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                                />
                            </svg>
                        </button>

                        {/* Hamburger (CSS controls visibility at <=1024px) */}
                        <button
                            className="navbar-hamburger"
                            onClick={() => setOpen((v) => !v)}
                            aria-label="Toggle menu"
                            aria-controls="mobileMenu"
                            aria-expanded={open}
                        >
                            {open ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </nav>

                {/* Mobile dropdown (role-based links) */}
                <div
                    id="mobileMenu"
                    className={`navbar-mobile ${open ? "open" : ""}`}
                >
                    <ul role="menubar">
                        {links.map((link) => (
                            <li key={link.name} role="none">
                                <Link
                                    href={link.href}
                                    role="menuitem"
                                    className={`navbar-mobile-link ${
                                        isActive(link.href) ? "active" : ""
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </header>
        </>
    );
}
