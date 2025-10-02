import CaritasLogo from "../../images/CaritasManilaLogo_White.svg";

export default function Footer() {
    return (
        <footer className="bg-red-700 text-white py-3 w-full">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                {/* Logo on far left */}
                <div className="flex items-center mt-2">
                    <img
                        src={CaritasLogo}
                        alt="Caritas Manila Logo"
                        className="h-14 w-auto object-contain"
                    />
                </div>

                {/* Right side info */}
                <div className="flex flex-col sm:flex-row gap-6 flex-1 justify-end">
                    {/* System Info */}
                    <div className="text-center sm:text-left max-w-sm">
                        <p className="font-bold text-sm">
                            Caritas Damayan Health Information System (HIS)
                        </p>
                        <p className="text-xs">
                            is a preventive health and disaster management
                            program of Caritas Manila.
                        </p>
                    </div>

                    {/* Program Info */}
                    <div className="text-center sm:text-left max-w-sm">
                        <p className="font-bold text-sm">All is Well Program</p>
                        <p className="text-xs">
                            constitutes the primary level of health care,
                            designed to provide immediate health care to the
                            urban poor population.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="text-center sm:text-left">
                        <p className="font-semibold text-sm">Contact</p>
                        <p className="text-sm font-bold">+632 8562-0020</p>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-2 text-center text-xs text-gray-200">
                © 2025 Caritas Damayan
            </div>
        </footer>
    );
}
