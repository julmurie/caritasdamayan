import styles from "../../css/users.module.css";

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    itemName = "this user",
}) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                >
                    <svg
                        className={styles.closeIcon}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
                <div className={styles.modalContent}>
                    <svg
                        className={styles.warningIcon}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                    <h3 className={styles.confirmationText}>
                        Are you sure you want to delete {itemName}?
                    </h3>
                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            className={styles.confirmButton}
                            onClick={onConfirm}
                        >
                            Yes, I'm sure
                        </button>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                        >
                            No, cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
