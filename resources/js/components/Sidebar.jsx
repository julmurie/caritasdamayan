import React, { useState } from "react";
import styles from "../../css/volunteer.module.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`${styles.sidebar} bg-light border-end ${
        isOpen ? "" : "d-none"
      }`}
    >
      {/* Header with toggle button */}
      <div className="d-flex align-items-center justify-content-between p-2 border-bottom">
        <h5 className="mb-0">Patients</h5>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className={`bi ${isOpen ? "bi-chevron-left" : "bi-chevron-right"}`}></i>
        </button>
      </div>

      <div className="p-2">
        <button className="btn btn-danger w-100 mb-2">+ Add Patient</button>
        <button className="btn btn-outline-secondary w-100 mb-2">
          Archived Patient
        </button>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search patient"
        />

        <ul className={`list-group ${styles["patient-list"]}`}>
          <li className="list-group-item active">Juan Dela Cruz</li>
          <li className="list-group-item">Maria Santos</li>
          <li className="list-group-item">Pedro Reyes</li>
          <li className="list-group-item">Ana Lopez</li>
        </ul>

        {/* Pagination */}
        <nav className="mt-3">
          <ul className="pagination pagination-sm justify-content-center">
            <li className="page-item disabled">
              <a className="page-link">«</a>
            </li>
            <li className="page-item active">
              <a className="page-link">1</a>
            </li>
            <li className="page-item">
              <a className="page-link">2</a>
            </li>
            <li className="page-item">
              <a className="page-link">3</a>
            </li>
            <li className="page-item">
              <a className="page-link">»</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
