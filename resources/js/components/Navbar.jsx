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

import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {
  const currentRoute = usePage().url;

  const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Patient', href: '/admin/patients' },
    { name: 'Approvals', href: '/admin/approvals' },
    { name: 'Prices', href: '/admin/prices' },
    { name: 'Charge Slip', href: '/admin/charge-slips' },
    { name: 'SOA', href: '/admin/soa' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Logs', href: '/admin/logs' },
  ];

  return (
    <nav className="bg-[#B42126] border-b border-black shadow-md">
      <div className="flex items-center justify-center space-x-8 h-16">
        {navLinks.map((link) => {
          const isActive = currentRoute.startsWith(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`px-3 py-2 rounded-sm text-sm font-semibold ${
                isActive
                  ? 'bg-gray-200 text-black'
                  : 'text-white hover:text-gray-200 hover:underline'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

