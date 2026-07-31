import "./ImageUploader.css";

function ImageUploader({ onChange }) {

    function handleFiles(e) {

        const files = Array.from(e.target.files);

        onChange(files);

        // Permite volver a seleccionar el mismo archivo si se desea
        e.target.value = "";
    }

    return (
        <label className="image-upload">

            <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleFiles}
            />

            <span>+ Agregar imágenes</span>

        </label>
    );
}

export default ImageUploader;