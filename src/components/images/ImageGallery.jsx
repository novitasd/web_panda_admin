import { useRef } from "react";
import "./ImageGallery.css";

export default function ImageGallery({
    images = [],
    onAddImages,
    onDelete,
    onDeleteImage,
    onSetPrimary,
}) {
    const inputRef = useRef(null);

    function handleSelectFiles(e) {
        const files = Array.from(e.target.files);

        if (!files.length) return;

        onAddImages(files);

        // Permite volver a seleccionar el mismo archivo
        e.target.value = "";
    }

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={handleSelectFiles}
            />

            <div className="image-gallery">

                {images.map((image) => (
                    <div
                        key={image.id}
                        className="image-card"
                    >
                        <img
                            src={image.url}
                            alt=""
                        />

                        <div className="image-actions">

                            {image.isPrimary ? (
                                <span className="primary-badge">
                                    ⭐ Principal
                                </span>
                            ) : (
                                !image.isNew && (
                                    <button
                                        type="button"
                                        className="btn-primary-image"
                                        onClick={() => onSetPrimary(image.id)}
                                    >
                                        Hacer principal
                                    </button>
                                )
                            )}

                            <button
                                type="button"
                                className="btn-delete-image"
                                onClick={() => {
                                    if (image.isNew) {
                                        onDeleteImage(image.index);
                                    } else {
                                        onDelete(image.id);
                                    }
                                }}
                            >
                                Eliminar
                            </button>

                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    className="image-add-card"
                    onClick={() => inputRef.current.click()}
                >
                    <span className="image-add-icon">+</span>

                    <span className="image-add-text">
                        Agregar imágenes
                    </span>
                </button>

            </div>
        </>
    );
}