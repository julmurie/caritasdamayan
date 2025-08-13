// resources/js/Pages/Login.jsx
// import { Head, Link } from '@inertiajs/react';

// export default function Login() {
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//             <Head title="Login" />
//             <div className="max-w-md w-full space-y-8">
//                 <div>
//                     <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//                         Welcome!
//                     </h2>
//                 </div>
//                 <div className="mt-8 space-y-6">
//                     <Link
//                         href="/admin/dashboard"
//                         className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     >
//                         Login (Temporary)
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// }


// resources/js/Pages/Login.jsx
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import LogoWithTextRed from "../../images/logo_with_text_red.svg";
import LogoForLogin from '../../images/logo_for_login.svg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const canLogin = email.trim() !== '' && pwd.trim() !== '';

  return (
    <div className="w-full min-h-screen">
      <Head title="Login" />

      {/* Two-column layout */}
      <div className="flex h-screen">
        {/* Left side */}
        <div className="flex-1 bg-white flex items-center justify-center px-4">
          <div className="w-full max-w-[532px] relative">
            {/* Logo (top-left like your PHP) */}
            <img
              src={LogoWithTextRed}
              alt="Logo with Text (Red)"
              className="fixed top-[15px] left-[15px] h-[50px]"
            />

            <h2 className="text-[50px] font-bold text-center mb-4">Welcome</h2>

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[25px] font-bold mb-0">
                  Email
                </label>

                <div
                  className="mt-2 flex items-center h-[60px] rounded border-2 border-[#c61d23] pl-[10px] shadow-[0_8px_12px_rgba(0,0,0,0.2)] gap-[10px]"
                >
                  {/* Mail SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                       fill="currentColor" className="w-10 h-10 shrink-0">
                    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                  </svg>

                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-full flex-1 text-[25px] pl-2 pr-14 border-l-2 border-l-[#c61d23] focus:outline-none focus:ring-0 focus:border-l-[#c61d23]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-[25px] font-bold mb-0">
                  Password
                </label>

                <div
                  className="mt-2 relative flex items-center h-[60px] rounded border-2 border-[#c61d23] pl-[10px] shadow-[0_8px_12px_rgba(0,0,0,0.2)] gap-[10px]"
                >
                  {/* Lock SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                       fill="currentColor" className="w-10 h-10 shrink-0">
                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                  </svg>

                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    className="h-full flex-1 text-[25px] pl-2 pr-14 border-l-2 border-l-[#c61d23] focus:outline-none focus:ring-0 focus:border-l-[#c61d23]"
                  />

                  {/* Eye toggle */}
                  <button
                    type="button"
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-2 p-0 bg-transparent"
                  >
                    {/* Closed eye (default) */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`w-10 h-10 ${showPwd ? 'hidden' : ''}`}
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
                      className={`w-10 h-10 ${showPwd ? '' : 'hidden'}`}
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
              </div>

              {/* Login button */}
                <div className="grid w-full">
                <Link
                    href="/admin/dashboard"
                    className={`text-white text-center font-bold text-[35px] rounded-full border-0 mt-16 transition-colors shadow-[0_8px_12px_rgba(0,0,0,0.2)] py-2
                    ${canLogin ? 'bg-[#c61d23] cursor-pointer' : 'bg-[#bababa] cursor-not-allowed pointer-events-none'}`}
                >
                    Login
                </Link>
                </div>


              {/* Forgot password */}
              <div className="text-center mt-4">
                <a href="#" className="text-[25px] font-bold underline text-black">
                  Forgot Password?
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Right side */}
        <div
          className="flex-1 bg-[#c61d23] bg-center bg-no-repeat bg-cover hidden sm:block"
          style={{ backgroundImage: `url(${LogoForLogin})` }}
          aria-hidden="true"
        />
      </div>

      {/* Mobile background image (mimics your CSS behavior) */}
      <div
        className="sm:hidden fixed inset-0 -z-10 bg-[#c61d23] bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: "url('/graphics/logo_for_login.svg')" }}
        aria-hidden="true"
      />
    </div>
  );
}