import api from "../api/axios";

export async function uploadImages(productId, files) {
    const uploads = [];

    for (const file of files) {
        const formData = new FormData();

        formData.append("productId", productId);
        formData.append("image", file);

        const { data } = await api.post(
            "/product-images",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        uploads.push(data);
    }

    return uploads;
}

export async function deleteImage(id) {
    const { data } = await api.delete(
        `/product-images/${id}`
    );

    return data;
}

export async function setPrimaryImage(id) {
    const { data } = await api.patch(
        `/product-images/${id}/primary`
    );

    return data;
}