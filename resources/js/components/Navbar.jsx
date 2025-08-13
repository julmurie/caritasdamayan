// import { Link, usePage } from '@inertiajs/react';

// export default function Navbar() {
//   const { auth } = usePage().props;
//   const currentRoute = usePage().url;

//   const navConfig = {
//     admin: [
//       { name: 'Dashboard', href: '/admin/dashboard' },
//       { name: 'Patients', href: '/admin/patients' },
//       { name: 'Approvals', href: '/admin/approvals' },
//       { name: 'Prices', href: '/admin/prices' },
//       { name: 'Charge Slips', href: '/admin/charge-slips' },
//       { name: 'SOA', href: '/admin/soa' },
//       { name: 'Users', href: '/admin/users' },
//       { name: 'Logs', href: '/admin/logs' },
//     ],
//     clinic: [
//       { name: 'Dashboard', href: '/clinic/dashboard' },
//       { name: 'Patients', href: '/clinic/patients' },
//       { name: 'Charge Slips', href: '/clinic/charge-slips' },
//       { name: 'Prices', href: '/clinic/prices' },
//     ],
//     merchant: [
//       { name: 'Dashboard', href: '/merchant/dashboard' },
//       { name: 'Prices', href: '/merchant/prices' },
//       { name: 'Charge Slips', href: '/merchant/charge-slips' },
//       { name: 'SOA', href: '/merchant/soa' },
//     ],
//     accounting: [
//       { name: 'Dashboard', href: '/accounting/dashboard' },
//       { name: 'SOA', href: '/accounting/soa' },
//     ],
//     treasury: [
//       { name: 'Dashboard', href: '/treasury/dashboard' },
//       { name: 'SOA', href: '/treasury/soa' },
//     ],
//   };

//   const role = auth?.user?.role;
//   const links = navConfig[role] || [];

//   return (
//     <nav className="bg-white border-b border-gray-200 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           <div className="flex space-x-4">
//             {links.map((link) => {
//               const isActive = currentRoute.startsWith(link.href);
//               return (
//                 <Link
//                   key={link.name}
//                   href={link.href}
//                   className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-all ${
//                     isActive
//                       ? 'border-blue-600 text-blue-700'
//                       : 'border-transparent text-gray-600 hover:border-blue-300 hover:text-blue-600'
//                   } ${link.primary ? 'font-bold' : ''}`}
//                 >
//                   {link.name}
//                 </Link>
//               );
//             })}
//           </div>

//           <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-700">
//             <span>{auth.user.name}</span>
//             <span className="text-gray-400">|</span>
//             <span className="capitalize">{role}</span>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
import { useState, useEffect, useCallback } from "react";
import { Link, usePage } from "@inertiajs/react";
import CaritasLogo from "../../images/CaritasManilaLogo_White.svg";

export default function Navbar() {
    const { url } = usePage();
    const [open, setOpen] = useState(false);

    // inside Navbar component
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)"); // match your CSS breakpoint
        const onChange = (e) => {
            if (e.matches) setOpen(false);
        };
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    // Close mobile menu when navigating
    useEffect(() => {
        setOpen(false);
    }, [url]);

    // ESC to close for accessibility
    const onKeyDown = useCallback((e) => {
        if (e.key === "Escape") setOpen(false);
    }, []);
    useEffect(() => {
        if (!open) return;
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onKeyDown]);

    const navLinks = [
        { name: "Dashboard", href: "/admin/dashboard" },
        { name: "Patient", href: "/admin/patients" },
        { name: "Approvals", href: "/admin/approvals" },
        { name: "Prices", href: "/admin/prices" },
        { name: "Charge Slip", href: "/admin/charge-slips" },
        { name: "SOA", href: "/admin/soa" },
        { name: "Users", href: "/admin/users" },
        { name: "Logs", href: "/admin/logs" },
    ];

    const isActive = (href) => url.startsWith(href);

    return (
        <header className="navbar-header">
            <nav
                className="navbar-container"
                role="navigation"
                aria-label="Main"
            >
                {/* Left: Logo + Desktop Menu */}
                <div className="navbar-left">
                    <Link href="/admin/dashboard" aria-label="Go to Dashboard">
                        <img
                            src={CaritasLogo}
                            alt="Caritas Manila Logo"
                            className="navbar-logo"
                        />
                    </Link>

                    <ul className="navbar-menu" role="menubar">
                        {navLinks.map((link) => (
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

                {/* Right: Icons + Hamburger */}
                <div className="navbar-right">
                    {/* Icons: always visible */}
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

                    <Link
                        href="/settings"
                        aria-label="Settings"
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
                                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                            />
                        </svg>
                    </Link>

                    {/* Hamburger (visible only at/below collapse width via CSS) */}
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

            {/* Mobile dropdown: keep only nav links */}
            <div
                id="mobileMenu"
                className={`navbar-mobile ${open ? "open" : ""}`}
            >
                <ul role="menubar">
                    {navLinks.map((link) => (
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
    );
}
