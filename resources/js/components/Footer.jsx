import CaritasLogo from "../../images/CaritasManilaLogo_White.svg";

export default function Footer() {
    return (
        // Match navbar color and fixed height (navbar is 64px tall)
        <footer className="bg-[#c61d22] text-white w-full">
            {/* Responsive container: stacked rows on mobile, 64px three-column on lg+ */}
            <div className="w-full px-6 h-auto lg:h-16 flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-between gap-1 lg:gap-6 overflow-x-hidden">
                {/* Logo (hidden on mobile, shown on desktop; matches navbar sizing) */}
                <div className="hidden lg:flex items-center flex-shrink-0">
                    <img src={CaritasLogo} alt="Caritas Manila Logo" className="navbar-logo" />
                </div>

                {/* Info rows: two lines on mobile, horizontal center on desktop */}
                <div className="flex flex-col items-center text-[11px] sm:text-xs lg:text-xs gap-2 lg:gap-8 flex-1 min-w-0 lg:flex-row lg:justify-center mt-1 lg:mt-0">
                    <p className="text-center lg:truncate lg:max-w-[42ch] 2xl:lg:max-w-[100ch]">
                        <span className="font-semibold">Caritas Damayan Health Information System (HIS)</span> — preventive health and disaster management program of Caritas Manila
                    </p>
                    <p className="text-center lg:truncate lg:max-w-[40ch] 2xl:lg:max-w-[64ch]">
                        <span className="font-semibold">All is Well Program</span> — primary level care for immediate health needs of urban poor
                    </p>
                </div>

                {/* Contact row: third row on mobile, right-aligned on desktop */}
                <div className="flex items-center gap-3 text-[11px] sm:text-xs lg:text-xs whitespace-nowrap mt-1 mb-1 lg:mt-0 lg:mb-0">
                    <span className="font-semibold">Contact:</span>
                    <span className="font-bold">+632 8562-0020</span>
                    <span className="hidden sm:inline text-gray-100">|</span>
                    <span className="text-gray-100">© 2025 Caritas Damayan</span>
                </div>
            </div>
        </footer>
    );
}
