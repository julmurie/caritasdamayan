// components/UserModal.jsx
import { useState } from "react";

export default function UserModal({
    isOpen,
    onClose,
    onSubmit,
    selectedRole,
    onRoleChange,
    formData,
    onChange,
    errors,
    isSubmitting,
    editingUserId, // ✅ new prop for detecting edit mode
    setFormData, // ✅ required for active status update
}) {
    if (!isOpen) return null;

    const RequiredLabel = ({ htmlFor, children }) => (
        <label
            htmlFor={htmlFor}
            className="block mb-2 text-sm font-medium text-gray-900"
        >
            {children} <span className="text-red-600">*</span>
        </label>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                {/* ✅ Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {editingUserId ? "Edit User" : "Register New User"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <hr className="mb-4 border-gray-300" />

                <form onSubmit={onSubmit}>
                    {/* ROLE */}
                    <div className="mb-6">
                        <RequiredLabel htmlFor="role">User Role</RequiredLabel>
                        <select
                            id="role"
                            value={selectedRole}
                            onChange={onRoleChange}
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
                            <option value="volunteer">Clinic Volunteer</option>
                            <option value="merchant">Partner Merchant</option>
                            <option value="accounting">Accounting</option>
                            <option value="treasury">Treasury</option>
                        </select>
                        {errors.role && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.role}
                            </p>
                        )}
                    </div>

                    {/* CONDITIONAL FIELDS */}
                    {selectedRole === "merchant" ? (
                        <>
                            <div className="mb-6">
                                <RequiredLabel htmlFor="branchName">
                                    Branch Name
                                </RequiredLabel>
                                <input
                                    type="text"
                                    id="branchName"
                                    value={formData.branchName}
                                    onChange={onChange}
                                    placeholder="e.g. Generika - Main Branch"
                                    maxLength={55}
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
                                <RequiredLabel htmlFor="branchItem">
                                    Branch Item
                                </RequiredLabel>
                                <select
                                    id="branchItem"
                                    value={formData.branchItem}
                                    onChange={onChange}
                                    className={`bg-gray-50 border ${
                                        errors.branchItem
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                                >
                                    <option disabled value="">
                                        Select an Item
                                    </option>
                                    <option value="product">Product</option>
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
                                    <RequiredLabel htmlFor="firstName">
                                        First Name
                                    </RequiredLabel>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={onChange}
                                        placeholder="John"
                                        maxLength={50}
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
                                    <RequiredLabel htmlFor="lastName">
                                        Last Name
                                    </RequiredLabel>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={onChange}
                                        placeholder="Doe"
                                        maxLength={25}
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

                            <div className="mb-6">
                                <RequiredLabel htmlFor="jobDescription">
                                    Job Description
                                </RequiredLabel>
                                <input
                                    type="text"
                                    id="jobDescription"
                                    value={formData.jobDescription}
                                    onChange={onChange}
                                    placeholder="e.g. Executive Director"
                                    maxLength={50}
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

                    {/* EMAIL */}
                    <div className="mb-6">
                        <RequiredLabel htmlFor="email">
                            Email Address
                        </RequiredLabel>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={onChange}
                            placeholder="myemail@example.com"
                            maxLength={55}
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

                    {/* ✅ Active Status — only visible in Edit mode */}
                    {editingUserId && (
                        <div className="mb-6">
                            <label
                                htmlFor="is_active"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Active Status
                            </label>
                            <select
                                id="is_active"
                                value={formData.is_active ? "1" : "0"}
                                onChange={(e) =>
                                    onChange({
                                        target: {
                                            id: "is_active",
                                            value: e.target.value === "1",
                                        },
                                    })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                    )}

                    {/* ✅ Buttons */}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
                                : editingUserId
                                ? "Update User"
                                : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
