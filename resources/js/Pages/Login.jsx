// resources/js/Pages/Login.jsx
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import LogoWithTextRed from "../../images/logo_with_text_red.svg";
import LogoForLogin from "../../images/logo_for_login.svg";

// Reusable alerts
import FlashAlerts from "@/Components/FlashAlerts";
import Alert from "@/Components/Alert";

export default function Login() {
    const { props } = usePage();

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);

    // field-level errors
    const [formErrs, setFormErrs] = useState({ email: "", password: "" });
    // top banner (attempts left / locked)
    const [bannerErr, setBannerErr] = useState("");

    // lock state
    const [lockUntil, setLockUntil] = useState(null); // ms timestamp
    const [remaining, setRemaining] = useState(0); // seconds

    const canLogin = email.trim() !== "" && pwd.trim() !== "";
    const locked = !!lockUntil;

    // If server flashed a retry_at (optional), start countdown
    useEffect(() => {
        const retryAt = props?.flash?.retry_at;
        if (retryAt) {
            const ts = new Date(retryAt).getTime();
            if (!isNaN(ts) && ts > Date.now()) setLockUntil(ts);
        }
    }, [props?.flash?.retry_at]);

    // --- Countdown effect ---
    useEffect(() => {
        if (!lockUntil) return;
        const tick = () => {
            const secs = Math.max(
                0,
                Math.ceil((lockUntil - Date.now()) / 1000)
            );
            setRemaining(secs);
            if (secs <= 0) {
                setLockUntil(null);
                setBannerErr(""); // clear banner on unlock
            }
        };
        tick(); // initialize immediately
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [lockUntil]);

    const fmt = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
            s % 60
        ).padStart(2, "0")}`;

    async function handleSubmit(e) {
        e.preventDefault();
        if (loading || locked) return;

        // simple client validation
        const errs = {
            email: email.trim() ? "" : "Email is required",
            password: pwd.trim() ? "" : "Password is required",
        };
        setFormErrs(errs);
        setBannerErr("");
        if (errs.email || errs.password) return;

        setLoading(true);
        try {
            // 1) API login to enforce attempts/lock
            const apiRes = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "same-origin",
                body: JSON.stringify({ email, password: pwd }),
            });
            const apiData = await apiRes.json().catch(() => ({}));

            if (!apiRes.ok) {
                // Locked now (423) or just hit 0 attempts (401 with retry info)
                if (
                    apiRes.status === 423 ||
                    apiData?.retry_after ||
                    apiData?.retry_at
                ) {
                    const retryAtIso = apiData?.retry_at;
                    const retryAfterSec = apiData?.retry_after;
                    const until = retryAtIso
                        ? new Date(retryAtIso).getTime()
                        : Date.now() + (retryAfterSec ?? 15 * 60) * 1000;
                    setLockUntil(until);

                    const mins = Math.ceil(
                        (retryAfterSec ?? (until - Date.now()) / 1000) / 60
                    );
                    setBannerErr(
                        apiData?.message ||
                            `Too many failed attempts. Try again in ~${mins} minute(s).`
                    );
                } else if (apiRes.status === 401) {
                    const left =
                        typeof apiData?.attempts_left === "number"
                            ? apiData.attempts_left
                            : undefined;
                    setBannerErr(
                        left !== undefined
                            ? `Invalid credentials. Attempts left: ${left}`
                            : apiData?.message || "Invalid credentials"
                    );
                } else {
                    setBannerErr(apiData?.message || "Login failed");
                }
                return;
            }

            // 2) Establish session via /session-login (server decides redirect)
            const csrf =
                document.querySelector('meta[name="csrf-token"]')?.content ||
                "";

            await new Promise((resolve, reject) => {
                router.post(
                    "/session-login",
                    { email, password: pwd, remember, _token: csrf },
                    {
                        // 👇 added explicit CSRF header (small but important)
                        headers: { "X-CSRF-TOKEN": csrf },
                        onSuccess: () => resolve(),
                        onError: () => {
                            setBannerErr("Session login failed");
                            reject(new Error("Session login failed"));
                        },
                        preserveScroll: true,
                    }
                );
            });
        } catch (err) {
            setBannerErr(err?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    const lockSuffix = locked && remaining > 0 ? ` (${fmt(remaining)})` : "";

    return (
        <div className="w-full min-h-screen">
            <Head title="Login" />
            <div className="flex h-screen">
                {/* Left */}
                <div className="flex-1 bg-white flex items-center justify-center px-4">
                    <div className="w-full max-w-[532px] relative">
                        {/* Global server flashes (success/error/info/warning) */}
                        <FlashAlerts autoDismissMs={6000} />

                        {/* Client-side login error/lock alert */}
                        {bannerErr && (
                            <div className="fixed top-4 right-4 z-[101] w-full max-w-sm pointer-events-none">
                                <Alert
                                    variant="danger"
                                    onClose={() => setBannerErr("")}
                                    className="pointer-events-auto shadow-lg"
                                >
                                    {locked && remaining > 0
                                        ? `${bannerErr} (${fmt(remaining)})`
                                        : bannerErr}
                                </Alert>
                            </div>
                        )}
                        {/* Logo + Title */}
                        <img
                            src={LogoWithTextRed}
                            alt="Logo with Text (Red)"
                            className="fixed top-[15px] left-[15px] h-[50px]"
                        />
                        <h2 className="text-[50px] font-bold text-center mb-2">
                            Welcome
                        </h2>

                        {/* JS submit to show attempts/lock */}
                        <form
                            className="space-y-6"
                            onSubmit={handleSubmit}
                            autoComplete="on"
                        >
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-[25px] font-bold mb-1"
                                >
                                    Email
                                </label>
                                <div
                                    className={`mt-1 flex items-center h-[60px] rounded border-2 pl-[10px] shadow-[0_8px_12px_rgba(0,0,0,0.2)] gap-[10px] ${
                                        formErrs.email
                                            ? "border-red-500"
                                            : "border-[#c61d23]"
                                    } ${locked ? "opacity-60" : ""}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-10 h-10 shrink-0"
                                    >
                                        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                                    </svg>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        autoComplete="username"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        aria-invalid={!!formErrs.email}
                                        disabled={locked || loading}
                                        className="h-full flex-1 text-[25px] pl-2 pr-14 border-l-2 border-l-[#c61d23] focus:outline-none focus:ring-0 disabled:bg-gray-100"
                                    />
                                </div>
                                {formErrs.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {formErrs.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-[25px] font-bold mb-1"
                                >
                                    Password
                                </label>
                                <div
                                    className={`mt-1 relative flex items-center h-[60px] rounded border-2 pl-[10px] shadow-[0_8px_12px_rgba(0,0,0,0.2)] gap-[10px] ${
                                        formErrs.password
                                            ? "border-red-500"
                                            : "border-[#c61d23]"
                                    } ${locked ? "opacity-60" : ""}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-10 h-10 shrink-0"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <input
                                        id="password"
                                        type={showPwd ? "text" : "password"}
                                        required
                                        autoComplete="current-password"
                                        value={pwd}
                                        onChange={(e) => setPwd(e.target.value)}
                                        aria-invalid={!!formErrs.password}
                                        disabled={locked || loading}
                                        className="h-full flex-1 text-[25px] pl-2 pr-14 border-l-2 border-l-[#c61d23] focus:outline-none focus:ring-0 disabled:bg-gray-100"
                                    />

                                    <button
                                        type="button"
                                        aria-label={
                                            showPwd
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        onClick={() => setShowPwd(!showPwd)}
                                        disabled={locked || loading}
                                        className="absolute right-2 p-0 bg-transparent disabled:opacity-50"
                                    >
                                        {/* Closed eye */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className={`w-10 h-10 ${
                                                showPwd ? "hidden" : ""
                                            }`}
                                        >
                                            <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                            <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                            <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                        </svg>
                                        {/* Open eye */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className={`w-10 h-10 ${
                                                showPwd ? "" : "hidden"
                                            }`}
                                        >
                                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                            <path
                                                fillRule="evenodd"
                                                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                {formErrs.password && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {formErrs.password}
                                    </p>
                                )}
                            </div>

                            {/* Login button */}
                            <div className="grid w-full">
                                <button
                                    type="submit"
                                    disabled={!canLogin || loading || locked}
                                    className={`text-white text-center font-bold text-[35px] rounded-full border-0 transition-colors shadow-[0_8px_12px_rgba(0,0,0,0.2)] py-2
                    ${
                        !canLogin || loading || locked
                            ? "bg-[#bababa] cursor-not-allowed"
                            : "bg-[#c61d23] cursor-pointer"
                    }`}
                                >
                                    {locked
                                        ? `Try again in ${fmt(remaining)}`
                                        : loading
                                        ? "Signing in..."
                                        : "Login"}
                                </button>
                            </div>
                            {/* Banner */}
                            {bannerErr && (
                                <p
                                    role="alert"
                                    className="text-center text-red-600 text-[18px]"
                                >
                                    {locked && remaining > 0
                                        ? `${bannerErr} (${fmt(remaining)})`
                                        : bannerErr}
                                </p>
                            )}

                            <div className="flex justify-between items-center gap-11 mt-4">
                                <label className="flex items-center gap-3 text-[25px] font-bold text-black">
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6"
                                        checked={remember}
                                        onChange={(e) =>
                                            setRemember(e.target.checked)
                                        }
                                    />
                                    Remember me
                                </label>
                                <a
                                    href="#"
                                    className="text-[25px] font-bold underline text-black"
                                >
                                    Forgot Password?
                                </a>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right */}
                <div
                    className="flex-1 bg-[#c61d23] bg-center bg-no-repeat bg-cover hidden sm:block"
                    style={{ backgroundImage: `url(${LogoForLogin})` }}
                    aria-hidden="true"
                />
            </div>

            {/* Mobile background */}
            <div
                className="sm:hidden fixed inset-0 -z-10 bg-[#c61d23] bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url(${LogoForLogin})` }}
                aria-hidden="true"
            />
        </div>
    );
}
