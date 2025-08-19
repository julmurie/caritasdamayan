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
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Register New User</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <hr className="mb-4 border-gray-300" />

                <form onSubmit={onSubmit}>
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
                                    onChange={onChange}
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
                                    <label
                                        htmlFor="firstName"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={onChange}
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
                                        value={formData.lastName}
                                        onChange={onChange}
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
                                    value={formData.jobDescription}
                                    onChange={onChange}
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
                            onChange={onChange}
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
                            onClick={onClose}
                            className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
