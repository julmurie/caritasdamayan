// // resources/js/Pages/Login.jsx
// import { Head, router, usePage } from "@inertiajs/react";
// import { useEffect, useState } from "react";
// import LogoWithTextRed from "../../images/logo_with_text_red.svg";
// import LogoForLogin from "../../images/logo_for_login.svg";

// import FlashAlerts from "@/Components/FlashAlerts";
// import Alert from "@/Components/Alert";

// /* ⬇️ CSS Module */
// import styles from "../../css/Login.module.css";

// export default function Login() {
//     useEffect(() => {
//         fetch("/sanctum/csrf-cookie", { credentials: "include" });
//     }, []);
//     const { props } = usePage();

//     const [email, setEmail] = useState("");
//     const [pwd, setPwd] = useState("");
//     const [showPwd, setShowPwd] = useState(false);
//     const [remember, setRemember] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const [formErrs, setFormErrs] = useState({ email: "", password: "" });
//     const [bannerErr, setBannerErr] = useState("");

//     const [lockUntil, setLockUntil] = useState(null);
//     const [remaining, setRemaining] = useState(0);

//     const canLogin = email.trim() !== "" && pwd.trim() !== "";
//     const locked = !!lockUntil;

//     useEffect(() => {
//         const retryAt = props?.flash?.retry_at;
//         if (retryAt) {
//             const ts = new Date(retryAt).getTime();
//             if (!isNaN(ts) && ts > Date.now()) setLockUntil(ts);
//         }
//     }, [props?.flash?.retry_at]);

//     useEffect(() => {
//         if (!lockUntil) return;
//         const tick = () => {
//             const secs = Math.max(
//                 0,
//                 Math.ceil((lockUntil - Date.now()) / 1000)
//             );
//             setRemaining(secs);
//             if (secs <= 0) {
//                 setLockUntil(null);
//                 setBannerErr("");
//             }
//         };
//         tick();
//         const id = setInterval(tick, 1000);
//         return () => clearInterval(id);
//     }, [lockUntil]);

//     const fmt = (s) =>
//         `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
//             s % 60
//         ).padStart(2, "0")}`;

//     async function handleSubmit(e) {
//         e.preventDefault();
//         if (loading || locked) return;

//         const errs = {
//             email: email.trim() ? "" : "Email is required",
//             password: pwd.trim() ? "" : "Password is required",
//         };
//         setFormErrs(errs);
//         setBannerErr("");
//         if (errs.email || errs.password) return;

//         setLoading(true);
//         try {
//             const apiRes = await fetch("/api/login", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Accept: "application/json",
//                 },
//                 credentials: "same-origin",
//                 body: JSON.stringify({ email, password: pwd }),
//             });
//             const apiData = await apiRes.json().catch(() => ({}));

//             if (!apiRes.ok) {
//                 if (
//                     apiRes.status === 423 ||
//                     apiData?.retry_after ||
//                     apiData?.retry_at
//                 ) {
//                     const retryAtIso = apiData?.retry_at;
//                     const retryAfterSec = apiData?.retry_after;
//                     const until = retryAtIso
//                         ? new Date(retryAtIso).getTime()
//                         : Date.now() + (retryAfterSec ?? 15 * 60) * 1000;
//                     setLockUntil(until);

//                     const mins = Math.ceil(
//                         (retryAfterSec ?? (until - Date.now()) / 1000) / 60
//                     );
//                     setBannerErr(
//                         apiData?.message ||
//                             `Too many failed attempts. Try again in ~${mins} minute(s).`
//                     );
//                 } else if (apiRes.status === 401) {
//                     const msg = apiData?.message || "Invalid credentials";

//                     // 🧩 Detect inactive accounts
//                     if (msg.toLowerCase().includes("inactive")) {
//                         setBannerErr(
//                             "Your account is inactive. Please contact the system administrator."
//                         );
//                     } else {
//                         const left =
//                             typeof apiData?.attempts_left === "number"
//                                 ? apiData.attempts_left
//                                 : undefined;
//                         setBannerErr(
//                             left !== undefined
//                                 ? `Invalid credentials. Attempts left: ${left}`
//                                 : msg
//                         );
//                     }
//                 } else {
//                     setBannerErr(apiData?.message || "Login failed");
//                 }
//                 return;
//             }

//             const csrf =
//                 document.querySelector('meta[name="csrf-token"]')?.content ||
//                 "";

//             await new Promise((resolve, reject) => {
//                 router.post(
//                     "/session-login",
//                     { email, password: pwd, remember, _token: csrf },
//                     {
//                         headers: { "X-CSRF-TOKEN": csrf },
//                         onSuccess: () => resolve(),
//                         onError: () => {
//                             setBannerErr("Session login failed");
//                             reject(new Error("Session login failed"));
//                         },
//                         preserveScroll: true,
//                     }
//                 );
//             });
//         } catch (err) {
//             setBannerErr(err?.message || "Login failed");
//         } finally {
//             setLoading(false);
//         }
//     }

//     const lockSuffix = locked && remaining > 0 ? ` (${fmt(remaining)})` : "";

//     return (
//         <div className={styles.page}>
//             <Head title="Login" />

//             {/* Global flashes */}
//             <FlashAlerts autoDismissMs={6000} />

//             <div className={styles.layout}>
//                 {/* Left / Form */}
//                 <div className={styles.left}>
//                     <img
//                         src={LogoWithTextRed}
//                         alt="Logo"
//                         className={styles.logoFixed}
//                     />

//                     <div className={styles.card}>
//                         <img
//                             src={LogoWithTextRed}
//                             alt="Logo"
//                             className={styles.logoInline}
//                         />
//                         <h2 className={styles.title}>Welcome</h2>

//                         <form
//                             className={styles.form}
//                             onSubmit={handleSubmit}
//                             autoComplete="on"
//                         >
//                             {/* Email */}
//                             <div>
//                                 <div className={styles.labelRow}>
//                                     <label
//                                         htmlFor="email"
//                                         className={styles.label}
//                                     >
//                                         Email
//                                     </label>
//                                 </div>

//                                 <div
//                                     className={[
//                                         styles.inputGroup,
//                                         formErrs.email ? styles.error : "",
//                                         locked ? styles.locked : "",
//                                     ]
//                                         .join(" ")
//                                         .trim()}
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 24 24"
//                                         fill="currentColor"
//                                         className={styles.svgIcon}
//                                     >
//                                         <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
//                                         <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
//                                     </svg>

//                                     <input
//                                         id="email"
//                                         type="email"
//                                         maxLength={55}
//                                         required
//                                         autoComplete="username"
//                                         value={email}
//                                         onChange={(e) =>
//                                             setEmail(e.target.value)
//                                         }
//                                         aria-invalid={!!formErrs.email}
//                                         disabled={locked || loading}
//                                         className={styles.textInput}
//                                     />
//                                 </div>

//                                 {formErrs.email && (
//                                     <p className={styles.fieldError}>
//                                         {formErrs.email}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Password */}
//                             <div>
//                                 <div className={styles.labelRow}>
//                                     <label
//                                         htmlFor="password"
//                                         className={styles.label}
//                                     >
//                                         Password
//                                     </label>

//                                     {/* Use your actual route if you have Ziggy: href={route('password.request')} */}
//                                     <a
//                                         href="/forgot-password"
//                                         className={styles.forgotLink}
//                                     >
//                                         Forgot password?
//                                     </a>
//                                 </div>

//                                 <div
//                                     className={[
//                                         styles.inputGroup,
//                                         formErrs.password ? styles.error : "",
//                                         locked ? styles.locked : "",
//                                     ]
//                                         .join(" ")
//                                         .trim()}
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 24 24"
//                                         fill="currentColor"
//                                         className={styles.svgIcon}
//                                     >
//                                         <path
//                                             fillRule="evenodd"
//                                             d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
//                                             clipRule="evenodd"
//                                         />
//                                     </svg>

//                                     <input
//                                         id="password"
//                                         type={showPwd ? "text" : "password"}
//                                         maxLength={55}
//                                         required
//                                         autoComplete="current-password"
//                                         value={pwd}
//                                         onChange={(e) => setPwd(e.target.value)}
//                                         aria-invalid={!!formErrs.password}
//                                         disabled={locked || loading}
//                                         className={styles.textInput}
//                                     />

//                                     <button
//                                         type="button"
//                                         aria-label={
//                                             showPwd
//                                                 ? "Hide password"
//                                                 : "Show password"
//                                         }
//                                         onClick={() => setShowPwd(!showPwd)}
//                                         disabled={locked || loading}
//                                         className={styles.eyeBtn}
//                                     >
//                                         {/* Closed eye */}
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             viewBox="0 0 24 24"
//                                             fill="currentColor"
//                                             className={styles.eyeIcon}
//                                             style={{
//                                                 display: showPwd
//                                                     ? "none"
//                                                     : "block",
//                                             }}
//                                         >
//                                             <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
//                                             <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
//                                             <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
//                                         </svg>

//                                         {/* Open eye */}
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             viewBox="0 0 24 24"
//                                             fill="currentColor"
//                                             className={styles.eyeIcon}
//                                             style={{
//                                                 display: showPwd
//                                                     ? "block"
//                                                     : "none",
//                                             }}
//                                         >
//                                             <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
//                                             <path
//                                                 fillRule="evenodd"
//                                                 d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
//                                                 clipRule="evenodd"
//                                             />
//                                         </svg>
//                                     </button>
//                                 </div>

//                                 {formErrs.password && (
//                                     <p className={styles.fieldError}>
//                                         {formErrs.password}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Submit */}
//                             <div>
//                                 <button
//                                     type="submit"
//                                     disabled={!canLogin || loading || locked}
//                                     className={`${styles.submitBtn} ${
//                                         !canLogin || loading || locked
//                                             ? styles.disabled
//                                             : ""
//                                     }`}
//                                 >
//                                     {locked
//                                         ? `Try again in ${fmt(remaining)}`
//                                         : loading
//                                         ? "Signing in..."
//                                         : "Login"}
//                                 </button>
//                             </div>

//                             {/* Banner */}
//                             {bannerErr && (
//                                 <p
//                                     role="alert"
//                                     className={`${styles.banner} ${
//                                         bannerErr
//                                             .toLowerCase()
//                                             .includes("inactive")
//                                             ? styles.warningBanner // add a yellow-ish CSS variant
//                                             : ""
//                                     }`}
//                                 >
//                                     {locked && remaining > 0
//                                         ? `${bannerErr} (${fmt(remaining)})`
//                                         : bannerErr}
//                                 </p>
//                             )}

//                             {/* Remember me */}
//                             <div className={styles.rememberRow}>
//                                 <label className={styles.rememberLabel}>
//                                     <input
//                                         type="checkbox"
//                                         className={styles.checkbox}
//                                         checked={remember}
//                                         onChange={(e) =>
//                                             setRemember(e.target.checked)
//                                         }
//                                     />
//                                     Remember me
//                                 </label>
//                             </div>
//                         </form>
//                     </div>
//                 </div>

//                 {/* Right / Background (desktop) */}
//                 <div
//                     className={styles.right}
//                     style={{
//                         backgroundImage: `url(${LogoForLogin})`,
//                         backgroundColor: "var(--brand)",
//                     }}
//                     aria-hidden="true"
//                 />
//             </div>

//             {/* Mobile background (shows behind centered form) */}
//             <div
//                 className={styles.bgMobile}
//                 style={{ backgroundImage: `url(${LogoForLogin})` }}
//                 aria-hidden="true"
//             />
//         </div>
//     );
// }

// resources/js/Pages/Login.jsx
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import LogoWithTextRed from "../../images/logo_with_text_red.svg";
import LogoForLogin from "../../images/logo_for_login.svg";

import FlashAlerts from "@/Components/FlashAlerts";
import Alert from "@/Components/Alert";

/* ⬇️ CSS Module */
import styles from "../../css/Login.module.css";

export default function Login() {
    useEffect(() => {
        fetch("/sanctum/csrf-cookie", { credentials: "include" });
    }, []);
    const { props } = usePage();

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formErrs, setFormErrs] = useState({ email: "", password: "" });

    const [lockUntil, setLockUntil] = useState(null);
    const [remaining, setRemaining] = useState(0);

    const canLogin = email.trim() !== "" && pwd.trim() !== "";
    const locked = !!lockUntil;

    useEffect(() => {
        const retryAt = props?.flash?.retry_at;
        if (retryAt) {
            const ts = new Date(retryAt).getTime();
            if (!isNaN(ts) && ts > Date.now()) setLockUntil(ts);
        }
    }, [props?.flash?.retry_at]);

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
            }
        };
        tick();
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

        const errs = {
            email: email.trim() ? "" : "Email is required",
            password: pwd.trim() ? "" : "Password is required",
        };
        setFormErrs(errs);

        if (errs.email || errs.password) return;

        setLoading(true);
        try {
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
                let errorMessage = "Login failed";

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
                    errorMessage =
                        apiData?.message ||
                        `Too many failed attempts. Try again in ~${mins} minute(s).`;
                } else if (apiRes.status === 401) {
                    errorMessage = apiData?.message || "Invalid credentials";

                    // Detect inactive accounts
                    if (errorMessage.toLowerCase().includes("inactive")) {
                        errorMessage =
                            "Your account is inactive. Please contact the system administrator.";
                    } else {
                        const left =
                            typeof apiData?.attempts_left === "number"
                                ? apiData.attempts_left
                                : undefined;
                        if (left !== undefined) {
                            errorMessage = `Invalid credentials. Attempts left: ${left}`;
                        }
                    }
                }

                // Use session-login to trigger flash message properly
                const csrf =
                    document.querySelector('meta[name="csrf-token"]')
                        ?.content || "";

                await new Promise((resolve, reject) => {
                    router.post(
                        "/session-login",
                        {
                            email,
                            password: pwd,
                            remember,
                            _token: csrf,
                            // Pass the error message to trigger the flash
                            _flash_errors: errorMessage,
                        },
                        {
                            headers: { "X-CSRF-TOKEN": csrf },
                            onSuccess: () => resolve(),
                            onError: () => {
                                reject(new Error("Session login failed"));
                            },
                            preserveScroll: true,
                            replace: false, // Don't replace to allow flash to persist
                        }
                    );
                });
                return;
            }

            const csrf =
                document.querySelector('meta[name="csrf-token"]')?.content ||
                "";

            await new Promise((resolve, reject) => {
                router.post(
                    "/session-login",
                    { email, password: pwd, remember, _token: csrf },
                    {
                        headers: { "X-CSRF-TOKEN": csrf },
                        onSuccess: () => resolve(),
                        onError: () => {
                            // Error will be handled by session flash
                            reject(new Error("Session login failed"));
                        },
                        preserveScroll: true,
                    }
                );
            });
        } catch (err) {
            // Error will be handled by session flash
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.page}>
            <Head title="Login" />

            {/* Global flashes with longer duration for login errors */}
            <FlashAlerts autoDismissMs={10000} />

            <div className={styles.layout}>
                {/* Left / Form */}
                <div className={styles.left}>
                    <img
                        src={LogoWithTextRed}
                        alt="Logo"
                        className={styles.logoFixed}
                    />

                    <div className={styles.card}>
                        <img
                            src={LogoWithTextRed}
                            alt="Logo"
                            className={styles.logoInline}
                        />
                        <h2 className={styles.title}>Welcome</h2>

                        <form
                            className={styles.form}
                            onSubmit={handleSubmit}
                            autoComplete="on"
                        >
                            {/* Email */}
                            <div>
                                <div className={styles.labelRow}>
                                    <label
                                        htmlFor="email"
                                        className={styles.label}
                                    >
                                        Email
                                    </label>
                                </div>

                                <div
                                    className={[
                                        styles.inputGroup,
                                        formErrs.email ? styles.error : "",
                                        locked ? styles.locked : "",
                                    ]
                                        .join(" ")
                                        .trim()}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className={styles.svgIcon}
                                    >
                                        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                                    </svg>

                                    <input
                                        id="email"
                                        type="email"
                                        maxLength={55}
                                        required
                                        autoComplete="username"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        aria-invalid={!!formErrs.email}
                                        disabled={locked || loading}
                                        className={styles.textInput}
                                    />
                                </div>

                                {formErrs.email && (
                                    <p className={styles.fieldError}>
                                        {formErrs.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className={styles.labelRow}>
                                    <label
                                        htmlFor="password"
                                        className={styles.label}
                                    >
                                        Password
                                    </label>

                                    <a
                                        href="/forgot-password"
                                        className={styles.forgotLink}
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                <div
                                    className={[
                                        styles.inputGroup,
                                        formErrs.password ? styles.error : "",
                                        locked ? styles.locked : "",
                                    ]
                                        .join(" ")
                                        .trim()}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className={styles.svgIcon}
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
                                        maxLength={55}
                                        required
                                        autoComplete="current-password"
                                        value={pwd}
                                        onChange={(e) => setPwd(e.target.value)}
                                        aria-invalid={!!formErrs.password}
                                        disabled={locked || loading}
                                        className={styles.textInput}
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
                                        className={styles.eyeBtn}
                                    >
                                        {/* Closed eye */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className={styles.eyeIcon}
                                            style={{
                                                display: showPwd
                                                    ? "none"
                                                    : "block",
                                            }}
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
                                            className={styles.eyeIcon}
                                            style={{
                                                display: showPwd
                                                    ? "block"
                                                    : "none",
                                            }}
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
                                    <p className={styles.fieldError}>
                                        {formErrs.password}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={!canLogin || loading || locked}
                                    className={`${styles.submitBtn} ${
                                        !canLogin || loading || locked
                                            ? styles.disabled
                                            : ""
                                    }`}
                                >
                                    {locked
                                        ? `Try again in ${fmt(remaining)}`
                                        : loading
                                        ? "Signing in..."
                                        : "Login"}
                                </button>
                            </div>

                            {/* Remember me */}
                            <div className={styles.rememberRow}>
                                <label className={styles.rememberLabel}>
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={remember}
                                        onChange={(e) =>
                                            setRemember(e.target.checked)
                                        }
                                    />
                                    Remember me
                                </label>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right / Background (desktop) */}
                <div
                    className={styles.right}
                    style={{
                        backgroundImage: `url(${LogoForLogin})`,
                        backgroundColor: "var(--brand)",
                    }}
                    aria-hidden="true"
                />
            </div>

            {/* Mobile background (shows behind centered form) */}
            <div
                className={styles.bgMobile}
                style={{ backgroundImage: `url(${LogoForLogin})` }}
                aria-hidden="true"
            />
        </div>
    );
}
