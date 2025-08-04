import { useState } from "react";
import Navbar from "@/components/Navbar";

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

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
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

    // NEW: when you pick a role, clear out the other fields + errors.role
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
            // Keep email if already entered
            email: prev.email,
        }));
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
        if (errors[id]) {
            setErrors((prev) => ({ ...prev, [id]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!selectedRole) {
            newErrors.role = "Please select a role";
        }

        if (selectedRole === "merchant") {
            if (!formData.branchName.trim()) {
                newErrors.branchName = "Branch name is required";
            }
            if (!formData.branchItem.trim()) {
                newErrors.branchItem = "Branch item is required";
            }
        } else {
            if (!formData.firstName.trim()) {
                newErrors.firstName = "First name is required";
            }
            if (!formData.lastName.trim()) {
                newErrors.lastName = "Last name is required";
            }
            if (!formData.jobDescription.trim()) {
                newErrors.jobDescription = "Job description is required";
            }
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        // 1) Build a clean payload
        let requestData = {
            role: selectedRole,
            email: formData.email.trim(),
        };

        if (selectedRole === "merchant") {
            requestData.branchName = formData.branchName.trim();
            requestData.branchItem = formData.branchItem;
        } else {
            requestData.firstName = formData.firstName.trim();
            requestData.lastName = formData.lastName.trim();
            requestData.jobDescription = formData.jobDescription.trim();
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const fieldErrors = {};
                    Object.entries(data.errors).forEach(([field, msgs]) => {
                        fieldErrors[field] = msgs[0];
                    });
                    setErrors(fieldErrors);
                } else {
                    setErrors({
                        submit: data.error || "Server error occurred",
                    });
                }
            } else {
                handleCloseModal();
                // optionally refresh user list or show a toast
            }
        } catch (err) {
            console.error("Network error:", err);
            setErrors({ submit: "Network error. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
                <main>
                    <div className="header">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-4xl font-bold text-gray-800">
                                Users
                            </h1>
                            <button
                                onClick={handleOpenModal}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                + Add User
                            </button>
                        </div>
                        <hr className="mb-4 border-gray-300" />
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">
                                        Register New User
                                    </h2>
                                    <button
                                        onClick={handleCloseModal}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <hr className="mb-4 border-gray-300" />

                                <form onSubmit={handleRegister}>
                                    <div className="mb-6">
                                        <label
                                            htmlFor="role"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            User Role
                                        </label>
                                        <select
                                            id="role"
                                            value={selectedRole}
                                            onChange={handleRoleChange}
                                            className={`bg-gray-50 border ${
                                                errors.role
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                                        >
                                            <option disabled value="">
                                                Choose a role
                                            </option>
                                            <option value="admin">Admin</option>
                                            <option value="volunteer">
                                                Clinic Volunteer
                                            </option>
                                            <option value="merchant">
                                                Partner Merchant
                                            </option>
                                            <option value="accounting">
                                                Accounting
                                            </option>
                                            <option value="treasury">
                                                Treasury
                                            </option>
                                        </select>
                                        {errors.role && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.role}
                                            </p>
                                        )}
                                    </div>

                                    {selectedRole === "merchant" ? (
                                        <>
                                            <div className="mb-6">
                                                <label
                                                    htmlFor="branchName"
                                                    className="block mb-2 text-sm font-medium text-gray-900"
                                                >
                                                    Branch Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="branchName"
                                                    value={formData.branchName}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Generika - Main Branch"
                                                    className={`bg-gray-50 border ${
                                                        errors.branchName
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                                                />
                                                {errors.branchName && (
                                                    <p className="mt-2 text-sm text-red-600">
                                                        {errors.branchName}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="mb-6">
                                                <label
                                                    htmlFor="branchItem"
                                                    className="block mb-2 text-sm font-medium text-gray-900"
                                                >
                                                    Branch Item
                                                </label>
                                                <select
                                                    id="branchItem"
                                                    value={formData.branchItem}
                                                    onChange={handleChange}
                                                    className={`bg-gray-50 border ${
                                                        errors.branchItem
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                                                >
                                                    <option disabled value="">
                                                        Select an Item
                                                    </option>
                                                    <option value="product">
                                                        Product
                                                    </option>
                                                    <option value="lab">
                                                        Laboratory Service
                                                    </option>
                                                </select>
                                                {errors.branchItem && (
                                                    <p className="mt-2 text-sm text-red-600">
                                                        {errors.branchItem}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid gap-6 mb-6 md:grid-cols-2">
                                                <div>
                                                    <label
                                                        htmlFor="firstName"
                                                        className="block mb-2 text-sm font-medium text-gray-900"
                                                    >
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="firstName"
                                                        value={
                                                            formData.firstName
                                                        }
                                                        onChange={handleChange}
                                                        placeholder="John"
                                                        className={`bg-gray-50 border ${
                                                            errors.firstName
                                                                ? "border-red-500"
                                                                : "border-gray-300"
                                                        } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                                                    />
                                                    {errors.firstName && (
                                                        <p className="mt-2 text-sm text-red-600">
                                                            {errors.firstName}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="lastName"
                                                        className="block mb-2 text-sm font-medium text-gray-900"
                                                    >
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="lastName"
                                                        value={
                                                            formData.lastName
                                                        }
                                                        onChange={handleChange}
                                                        placeholder="Doe"
                                                        className={`bg-gray-50 border ${
                                                            errors.lastName
                                                                ? "border-red-500"
                                                                : "border-gray-300"
                                                        } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                                                    />
                                                    {errors.lastName && (
                                                        <p className="mt-2 text-sm text-red-600">
                                                            {errors.lastName}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Only show job description for non-merchant roles */}
                                            <div className="mb-6">
                                                <label
                                                    htmlFor="jobDescription"
                                                    className="block mb-2 text-sm font-medium text-gray-900"
                                                >
                                                    Job Description
                                                </label>
                                                <input
                                                    type="text"
                                                    id="jobDescription"
                                                    value={
                                                        formData.jobDescription
                                                    }
                                                    onChange={handleChange}
                                                    placeholder="e.g. Executive Director"
                                                    className={`bg-gray-50 border ${
                                                        errors.jobDescription
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                                                />
                                                {errors.jobDescription && (
                                                    <p className="mt-2 text-sm text-red-600">
                                                        {errors.jobDescription}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <div className="mb-6">
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="myemail@example.com"
                                            className={`bg-gray-50 border ${
                                                errors.email
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                                        />
                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {errors.submit && (
                                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                                            {errors.submit}
                                        </div>
                                    )}

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting
                                                ? "Saving..."
                                                : "Save"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Users;
