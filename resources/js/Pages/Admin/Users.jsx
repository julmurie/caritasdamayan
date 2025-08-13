import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import UserModal from "@/components/UserModal";
import styles from "../../../css/users.module.css";

function Users() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        branchName: "",
        branchItem: "",
        email: "",
        jobDescription: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const tableRef = useRef(null);
    const [dataTable, setDataTable] = useState(null);
    const [editingUserId, setEditingUserId] = useState(null);

    const handleOpenModal = () => setIsModalOpen(true);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUserId(null);
        setErrors({});
        setFormData({
            firstName: "",
            lastName: "",
            branchName: "",
            branchItem: "",
            email: "",
            jobDescription: "",
        });
        setSelectedRole("");
    };

    const handleRoleChange = (e) => {
        const role = e.target.value;
        setSelectedRole(role);
        setErrors((prev) => ({ ...prev, role: "" }));
        setFormData((prev) => ({
            ...prev,
            firstName: "",
            lastName: "",
            branchName: "",
            branchItem: "",
            jobDescription: "",
            email: prev.email,
        }));
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors((prev) => ({ ...prev, [id]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!selectedRole) newErrors.role = "Please select a role";

        if (selectedRole === "merchant") {
            if (!formData.branchName.trim())
                newErrors.branchName = "Branch name is required";
            if (!formData.branchItem.trim())
                newErrors.branchItem = "Branch item is required";
        } else {
            if (!formData.firstName.trim())
                newErrors.firstName = "First name is required";
            if (!formData.lastName.trim())
                newErrors.lastName = "Last name is required";
            if (!formData.jobDescription.trim())
                newErrors.jobDescription = "Job description is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        const requestData = {
            role: selectedRole,
            email: formData.email.trim(),
            ...(selectedRole === "merchant"
                ? {
                      branchName: formData.branchName.trim(),
                      branchItem: formData.branchItem.trim(),
                  }
                : {
                      firstName: formData.firstName.trim(),
                      lastName: formData.lastName.trim(),
                      jobDescription: formData.jobDescription.trim(),
                  }),
        };

        try {
            const url = editingUserId
                ? `http://127.0.0.1:8000/api/users/${editingUserId}`
                : "http://127.0.0.1:8000/api/users";

            const method = editingUserId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Request failed");
            }

            if (dataTable) dataTable.ajax.reload(null, false);
            handleCloseModal();
            alert(editingUserId ? "User updated!" : "User created!");
        } catch (err) {
            console.error("Error:", err);
            setErrors({ submit: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (
            !dataTable &&
            tableRef.current &&
            window.$ &&
            window.$.fn.DataTable
        ) {
            const dt = $(tableRef.current).DataTable({
                processing: true,
                serverSide: true,
                ajax: {
                    url: "http://127.0.0.1:8000/api/users/datatable",
                    type: "GET",
                    dataType: "json",
                },
                order: [[0, "desc"]],
                columns: [
                    {
                        data: "role",
                        title: "Role",
                        render: (data) =>
                            data
                                ? data.charAt(0).toUpperCase() + data.slice(1)
                                : "-",
                        className: styles.roleColumn,
                    },
                    {
                        data: null,
                        title: "Name",
                        render: (data) => {
                            const name = `${data.firstname || ""} ${
                                data.lastname || ""
                            }`.trim();
                            return name || "-";
                        },
                        className: styles.nameColumn,
                    },
                    {
                        data: "branch_name",
                        title: "Branch Name",
                        render: (data) => data || "-",
                        className: styles.branchColumn,
                    },
                    {
                        data: "job_description",
                        title: "Job Description",
                        render: (data) => data || "-",
                        className: styles.jobColumn,
                    },
                    {
                        data: "email",
                        title: "Email",
                        render: (data) => data || "-",
                        className: styles.emailColumn,
                    },
                    {
                        data: null,
                        title: "Actions",
                        orderable: false,
                        searchable: false,
                        render: (data, type, row) => `
        <div class="${styles.actions}">
            <button 
                class="${styles.editBtn}" 
                data-id="${row.id}"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>

            </button>
            <button 
                class="${styles.deleteBtn}" 
                data-id="${row.id}"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
</svg>

            </button>
        </div>
    `,
                        className: styles.actionsColumn,
                    },
                ],
                responsive: {
                    details: {
                        display: $.fn.dataTable.Responsive.display.modal({
                            header: function (row) {
                                return "Details for " + row.data().email;
                            },
                        }),
                        renderer: $.fn.dataTable.Responsive.renderer.tableAll(),
                    },
                },
                autoWidth: false,
                scrollX: true,
                language: {
                    emptyTable: "No users found",
                    loadingRecords: "Loading...",
                    processing: "Processing...",
                },
                dom: '<"top"f>rt<"bottom"lip><"clear">',
                initComplete: function () {
                    // Apply your custom styles after table initialization
                    $(this).addClass(styles.dataTable);
                    $(this).find("thead th").addClass(styles.tableHeader);
                    $(this).find("tbody td").addClass(styles.tableCell);
                },
            });

            setDataTable(dt);

            // Add resize event listener
            const handleResize = () => {
                if (dt) {
                    dt.columns.adjust().responsive.recalc();
                }
            };

            window.addEventListener("resize", handleResize);

            // Edit button handler
            $(tableRef.current).on("click", `.${styles.editBtn}`, function () {
                const userId = $(this).data("id");
                handleEditUser(userId);
            });

            // Delete button handler
            $(tableRef.current).on(
                "click",
                `.${styles.deleteBtn}`,
                function () {
                    const userId = $(this).data("id");
                    handleDeleteUser(userId);
                }
            );
        }

        return () => {
            if (dataTable) {
                dataTable.destroy(true);
                $(tableRef.current).off("click", `.${styles.editBtn}`);
                $(tableRef.current).off("click", `.${styles.deleteBtn}`);
            }
        };
    }, [dataTable]);

    const handleEditUser = async (userId) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch user");

            const userData = await response.json();

            setFormData({
                firstName: userData.firstname || "",
                lastName: userData.lastname || "",
                branchName: userData.branch_name || "",
                branchItem: userData.merchant_type || "", // Note the field name change
                email: userData.email || "",
                jobDescription: userData.job_description || "",
            });

            setSelectedRole(userData.role);
            setEditingUserId(userId);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching user:", error);
            alert("Failed to load user data");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/users/${userId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    if (dataTable) {
                        dataTable.ajax.reload(null, false);
                    }
                    alert("User deleted successfully");
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || "Delete failed");
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Error deleting user");
            }
        }
    };

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.content}>
                <main>
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <h1 className={styles.title}>Users</h1>
                            <div>
                                <button
                                    onClick={handleOpenModal}
                                    className={styles.addButton}
                                >
                                    + Add User
                                </button>
                                <button className={styles.archivedButton}>
                                    Archives
                                </button>
                            </div>
                        </div>
                        <hr className={styles.divider} />
                    </div>

                    <div className={styles.tableContainer}>
                        <table
                            ref={tableRef}
                            className={`${styles.dataTable} display`}
                        >
                            {/* DataTables will generate the content */}
                        </table>
                    </div>

                    <UserModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onSubmit={handleSubmit}
                        selectedRole={selectedRole}
                        onRoleChange={handleRoleChange}
                        formData={formData}
                        onChange={handleChange}
                        errors={errors}
                        isSubmitting={isSubmitting}
                    />
                </main>
            </div>
        </div>
    );
}

export default Users;
