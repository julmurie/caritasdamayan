import { useState } from "react";
import Navbar from "@/components/Navbar";

function Users() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        branchName: "",
        branchItem: "product",
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
            branchItem: "product",
            email: "",
            jobDescription: "",
        });
        setSelectedRole("");
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
        // Clear error when user starts typing
        if (errors[id]) {
            setErrors((prev) => ({
                ...prev,
                [id]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!selectedRole) {
            newErrors.role = "Please select a role";
        }

        if (selectedRole === "merchant") {
            if (!formData.branchName.trim()) {
                newErrors.branch_name = "Branch name is required";
            }
        } else {
            if (!formData.firstName.trim()) {
                newErrors.first_name = "First name is required";
            }
            if (!formData.lastName.trim()) {
                newErrors.last_name = "Last name is required";
            }
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.jobDescription.trim()) {
            newErrors.job_description = "Job description is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            // Submit form logic here
            console.log("Form submitted:", { ...formData, role: selectedRole });
            // Simulate API call
            setTimeout(() => {
                setIsSubmitting(false);
                handleCloseModal();
            }, 1000);
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

                                <form onSubmit={handleSubmit}>
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
                                            onChange={(e) => {
                                                setSelectedRole(e.target.value);
                                                if (errors.role) {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        role: "",
                                                    }));
                                                }
                                            }}
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
                                                    htmlFor="branch_name"
                                                    className="block mb-2 text-sm font-medium text-gray-900"
                                                >
                                                    Branch Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="branch_name"
                                                    value={formData.branchName}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Generika - Main Branch"
                                                    className={`bg-gray-50 border ${
                                                        errors.branch_name
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                                                />
                                                {errors.branch_name && (
                                                    <p className="mt-2 text-sm text-red-600">
                                                        <span className="font-medium">
                                                            Oops!
                                                        </span>{" "}
                                                        {errors.branch_name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="mb-6">
                                                <label
                                                    htmlFor="branch_item"
                                                    className="block mb-2 text-sm font-medium text-gray-900"
                                                >
                                                    Branch Item
                                                </label>
                                                <select
                                                    id="branch_item"
                                                    value={formData.branchItem}
                                                    onChange={handleChange}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                >
                                                    <option value="product">
                                                        Product
                                                    </option>
                                                    <option value="lab">
                                                        Laboratory Service
                                                    </option>
                                                </select>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid gap-6 mb-6 md:grid-cols-2">
                                                <div>
                                                    <label
                                                        htmlFor="first_name"
                                                        className="block mb-2 text-sm font-medium text-gray-900"
                                                    >
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="first_name"
                                                        value={
                                                            formData.firstName
                                                        }
                                                        onChange={handleChange}
                                                        placeholder="John"
                                                        className={`bg-gray-50 border ${
                                                            errors.first_name
                                                                ? "border-red-500"
                                                                : "border-gray-300"
                                                        } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                                                    />
                                                    {errors.first_name && (
                                                        <p className="mt-2 text-sm text-red-600">
                                                            {errors.first_name}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="last_name"
                                                        className="block mb-2 text-sm font-medium text-gray-900"
                                                    >
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="last_name"
                                                        value={
                                                            formData.lastName
                                                        }
                                                        onChange={handleChange}
                                                        placeholder="Doe"
                                                        className={`bg-gray-50 border ${
                                                            errors.last_name
                                                                ? "border-red-500"
                                                                : "border-gray-300"
                                                        } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                                                    />
                                                    {errors.last_name && (
                                                        <p className="mt-2 text-sm text-red-600">
                                                            {errors.last_name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mb-6">
                                                <label
                                                    htmlFor="job_description"
                                                    className="block mb-2 text-sm font-medium text-gray-900"
                                                >
                                                    Job Description
                                                </label>
                                                <input
                                                    type="text"
                                                    id="job_description"
                                                    value={
                                                        formData.jobDescription
                                                    }
                                                    onChange={handleChange}
                                                    placeholder={
                                                        selectedRole ===
                                                        "merchant"
                                                            ? "e.g. Branch Manager"
                                                            : "e.g. Executive Director"
                                                    }
                                                    className={`bg-gray-50 border ${
                                                        errors.job_description
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                                                />
                                                {errors.job_description && (
                                                    <p className="mt-2 text-sm text-red-600">
                                                        {errors.job_description}
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
