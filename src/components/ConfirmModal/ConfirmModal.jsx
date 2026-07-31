import "./ConfirmModal.css";

function ConfirmModal({
    open,
    title,
    message,
    confirmText = "Eliminar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
    loading = false,
}) {
    if (!open) return null;

    return (
        <div
            className="confirm-overlay"
            onClick={onCancel}
        >
            <div
                className="confirm-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{title}</h2>

                <p>{message}</p>

                <div className="confirm-actions">

                    <button
                        className="btn-cancel"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>

                    <button
                        className="btn-delete"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Eliminando..." : confirmText}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;