// import ArchivedUsers from "@/Components/Archives/ArchivedUsers";
// import ArchivedProducts from "@/Components/Archives/ArchivedProducts";
// import ArchivedServices from "@/Components/Archives/ArchivedServices";

// export default function Archives({ auth }) {
//   const role = auth.user.role;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Archives</h1>

//       {/* Always visible for Admin */}
//       {role === "admin" && (
//         <section className="mb-8">
//           <h2 className="text-lg font-semibold mb-2">User Accounts</h2>
//           <ArchivedUsers />
//         </section>
//       )}

//       {/* Merchant-specific */}
//       {role === "merchant" && (
//         <>
//           <section className="mb-8">
//             <h2 className="text-lg font-semibold mb-2">Products</h2>
//             <ArchivedProducts />
//           </section>

//           <section>
//             <h2 className="text-lg font-semibold mb-2">Services</h2>
//             <ArchivedServices />
//           </section>
//         </>
//       )}
//     </div>
//   );
// }

import Navbar from "../components/Navbar";
import React from "react";

function Archives() {
    return (
        <div>
            <Navbar />
        </div>
    );
}

export default Archives;
