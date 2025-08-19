// import React, { useEffect, useRef, useState } from "react";
// import Navbar from "../../components/Navbar";
// import styles from "../../../css/merchant.module.css";
// import { router } from "@inertiajs/react";

// export default function SOA({ merchant = "Generika" }) {
//     const tableRef = useRef(null);
//     const [recordsFound, setRecordsFound] = useState(0);

//     useEffect(() => {
//         if (!tableRef.current || !window.$?.fn?.DataTable) return;

//         // suppress default alerts
//         window.$.fn.dataTable.ext.errMode = "none";

//         const $t = window.$(tableRef.current);

//         // destroy existing
//         if (window.$.fn.dataTable.isDataTable(tableRef.current)) {
//             $t.DataTable().destroy(true);
//         }

//         const dt = $t.DataTable({
//             processing: true,
//             serverSide: true,
//             responsive: true,
//             ajax: {
//                 url: "/merchant/soa/datatable",
//                 type: "GET",
//                 dataType: "json",
//                 error: function (xhr) {
//                     console.error(
//                         "DataTables AJAX error:",
//                         xhr.status,
//                         xhr.responseText
//                     );
//                 },
//             },
//             lengthMenu: [
//                 [20, 50, 100, -1],
//                 [20, 50, 100, "All"],
//             ],
//             dom: "Bfrtip",
//             buttons: [
//                 "pageLength",
//                 "colvis",
//                 { extend: "csv", title: `soa_${merchant}` },
//                 { extend: "excel", title: `soa_${merchant}` },
//                 { extend: "print", title: `SOA – ${merchant}` },
//             ],
//             columns: [
//                 { data: "number", title: "SOA Number" },
//                 { data: "soa_date", title: "SOA Date" },
//                 { data: "cover_period", title: "Cover Period" },
//                 { data: "charge_slip", title: "Charge Slip" },
//                 { data: "total_amount", title: "Total Amount" },
//                 { data: "attachment", title: "Attachment" },
//                 { data: "status", title: "Status" },
//                 {
//                     data: null,
//                     title: "Action",
//                     orderable: false,
//                     searchable: false,
//                     render: (data, type, row) => `
//                         <div class="flex gap-2">
//                             <button class="btn-edit" data-id="${row.id}" title="Edit">✏️</button>
//                             <button class="btn-delete" data-id="${row.id}" title="Delete">🗑</button>
//                         </div>
//                     `,
//                 },
//             ],
//             order: [[1, "desc"]],
//             initComplete: function () {
//                 const api = this.api();
//                 api.columns().every(function (idx) {
//                     const th = $t.find("thead tr:eq(1) th").eq(idx);
//                     const input = th.find("input");
//                     if (input.length) {
//                         input.on("keyup change", function () {
//                             api.column(idx).search(this.value).draw();
//                         });
//                     }
//                 });
//             },
//             drawCallback: function (settings) {
//                 if (
//                     settings.json &&
//                     typeof settings.json.recordsFiltered === "number"
//                 ) {
//                     setRecordsFound(settings.json.recordsFiltered);
//                 } else {
//                     const info = this.api().page.info();
//                     setRecordsFound(
//                         info.recordsDisplay ?? info.recordsTotal ?? 0
//                     );
//                 }
//             },
//         });

//         // delegated events
//         $t.on("click", ".btn-delete", function () {
//             const id = this.getAttribute("data-id");
//             if (!id) return;
//             if (confirm("Delete this SOA?")) {
//                 router.delete(`/merchant/soa/${id}`, {
//                     onSuccess: () => dt.ajax.reload(),
//                 });
//             }
//         });

//         $t.on("click", ".btn-edit", function () {
//             const id = this.getAttribute("data-id");
//             if (id) {
//                 router.visit(`/merchant/soa/${id}/edit`);
//             }
//         });

//         return () => {
//             $t.off("click", ".btn-delete");
//             $t.off("click", ".btn-edit");
//             if (window.$.fn.dataTable.isDataTable(tableRef.current)) {
//                 $t.DataTable().destroy(true);
//             }
//         };
//     }, [merchant]);

//     return (
//         <>
//             <Navbar />
//             <div className={styles.soaContainer}>
//                 {/* Header */}
//                 <h1 className={styles.soaTitle}>SOA</h1>
//                 <p className={styles.soaSubtext}>
//                     Partner Merchant | {merchant}
//                 </p>

//                 {/* Top Actions */}
//                 <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
//                     <div className="flex items-center gap-4">
//                         <button
//                             onClick={() =>
//                                 tableRef.current &&
//                                 window.$(tableRef.current).DataTable().draw()
//                             }
//                             className={styles.soaBtnRed}
//                         >
//                             Search
//                         </button>
//                         <button
//                             className={styles.soaReset}
//                             onClick={() => {
//                                 window
//                                     .$(tableRef.current)
//                                     .find("thead tr:eq(1) input")
//                                     .val("")
//                                     .trigger("change");
//                             }}
//                         >
//                             Reset Filter
//                         </button>
//                         <span>{recordsFound} records found</span>
//                     </div>
//                     <button
//                         className={styles.soaBtnGreen}
//                         onClick={() => router.visit("/merchant/soa/create")}
//                     >
//                         Add Record
//                     </button>
//                 </div>

//                 {/* Table */}
//                 <table ref={tableRef} className={styles.soaTable}>
//                     <thead>
//                         <tr>
//                             <th>SOA Number</th>
//                             <th>SOA Date</th>
//                             <th>Cover Period</th>
//                             <th>Charge Slip</th>
//                             <th>Total Amount</th>
//                             <th>Attachment</th>
//                             <th>Status</th>
//                             <th>Action</th>
//                         </tr>
//                         <tr>
//                             <th>
//                                 <input type="text" placeholder="" />
//                             </th>
//                             <th>
//                                 <input
//                                     type="text"
//                                     placeholder="YYYY-MM-DD or A|B"
//                                 />
//                             </th>
//                             <th>
//                                 <input type="text" placeholder="" />
//                             </th>
//                             <th>
//                                 <input type="text" placeholder="" />
//                             </th>
//                             <th>
//                                 <input
//                                     type="text"
//                                     placeholder="min|max or value"
//                                 />
//                             </th>
//                             <th>
//                                 <input type="text" placeholder="" />
//                             </th>
//                             <th>
//                                 <input type="text" placeholder="" />
//                             </th>
//                             <th></th>
//                         </tr>
//                     </thead>
//                 </table>
//             </div>
//         </>
//     );
// }
