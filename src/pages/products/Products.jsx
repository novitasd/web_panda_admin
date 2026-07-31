import { useEffect, useState } from "react";

import ProductTable from "../../components/products/ProductTable";
import ProductModal from "../../components/products/ProductModal";
import ProductForm from "../../components/products/ProductForm";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../../services/product.service";

import {
    uploadImages,
    deleteImage,
    setPrimaryImage,
} from "../../services/image.service";

import {
    getSizes,
    createSize,
} from "../../services/size.service";

import {
    createProductSize,
} from "../../services/productSize.service";

import {
    createInventoryMovement,
} from "../../services/inventoryMovement.service";

import { toast } from "react-toastify";

import "./Products.css";




function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

async function loadProducts() {
    try {
        const response = await getProducts();

        setProducts(response.data);

        return response.data;

    } catch (error) {
        console.error(error);

        toast.error("No se pudieron cargar los productos.");

        return [];
    } finally {
        setLoading(false);
    }
}

async function saveProductSizes(productId, sizes) {
    if (!sizes?.length) return;

    let availableSizes = await getSizes();

    for (const item of sizes) {
        const sizeName = String(item.name).trim();
        const stock = Number(item.stock);

        if (!sizeName) {
            throw new Error("Hay una talla vacía.");
        }

        if (!Number.isInteger(stock) || stock < 0) {
            throw new Error(
                `El stock de la talla ${sizeName} no es válido.`
            );
        }

        let size = availableSizes.find(
            (currentSize) =>
                String(currentSize.name)
                    .trim()
                    .toLowerCase() ===
                sizeName.toLowerCase()
        );

        // Crear talla global si todavía no existe
        if (!size) {
            const response = await createSize(sizeName);

            size = response.data ?? response;

            availableSizes = [
                ...availableSizes,
                size,
            ];
        }

        // Asociar talla al producto
        const response = await createProductSize(
            productId,
            size.id
        );

        const productSize =
            response.data ?? response;

        // Agregar stock inicial
        if (stock > 0) {
            await createInventoryMovement({
                productSizeId: productSize.id,
                type: "ENTRY",
                quantity: stock,
                reason: "Stock inicial desde administrador",
            });
        }
    }
}

async function handleSubmitProduct(product) {
    try {
        const {
            images,
            sizes,
            ...productData
        } = product;

        // =====================================
        // EDITAR PRODUCTO
        // =====================================
        if (selectedProduct) {

            await updateProduct(
                selectedProduct.id,
                productData
            );

            // Guardar solamente las tallas nuevas
            // agregadas desde el formulario.
            if (sizes?.length > 0) {
                await saveProductSizes(
                    selectedProduct.id,
                    sizes
                );
            }

            // Subir imágenes nuevas
            if (images?.length > 0) {
                await uploadImages(
                    selectedProduct.id,
                    images
                );
            }

            toast.success(
                "Producto actualizado correctamente"
            );
        }

        // =====================================
        // CREAR PRODUCTO
        // =====================================
        else {

            const newProduct =
                await createProduct(productData);

            // Crear tallas + stock
            if (sizes?.length > 0) {
                await saveProductSizes(
                    newProduct.id,
                    sizes
                );
            }

            // Subir imágenes
            if (images?.length > 0) {
                await uploadImages(
                    newProduct.id,
                    images
                );
            }

            toast.success(
                "Producto creado correctamente"
            );
        }

        handleCloseModal();

        await loadProducts();

    } catch (error) {
        console.error(
            "Error guardando producto:",
            error
        );

        toast.error(
            error.response?.data?.message ||
            error.message ||
            "Ocurrió un error guardando el producto."
        );
    }
}

async function handleDeleteImage(imageId) {
    try {
        await deleteImage(imageId);

        setSelectedProduct((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                images: (prev.images ?? []).filter(
                    (img) => img.id !== imageId
                ),
            };
        });

        toast.success("Imagen eliminada correctamente");

        await loadProducts();

    } catch (error) {
        console.error(error);

        toast.error(
            error.response?.data?.message ||
            "No se pudo eliminar la imagen."
        );
    }
}
async function handleSetPrimaryImage(imageId) {
    try {
        await setPrimaryImage(imageId);

        setSelectedProduct((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                images: (prev.images ?? []).map((img) => ({
                    ...img,
                    isPrimary: img.id === imageId,
                })),
            };
        });

        toast.success("Imagen principal actualizada");

        await loadProducts();

    } catch (error) {
        console.error(error);

        toast.error(
            error.response?.data?.message ||
            "No se pudo actualizar la imagen principal."
        );
    }
}


    function handleOpenCreate() {
        setSelectedProduct(null);
        setOpenModal(true);
    }

   async function handleEdit(product) {
    try {
        const fullProduct = await getProductById(product.id);

        setSelectedProduct(fullProduct);

        setOpenModal(true);

    } catch (error) {
        console.error(error);

        toast.error("No se pudo cargar el producto.");
    }
}

    function handleCloseModal() {
        setSelectedProduct(null);
        setOpenModal(false);
    }

    function handleDelete(product) {
        setProductToDelete(product);
        setOpenDeleteModal(true);
    }

    async function handleConfirmDelete() {
        try {
            setDeleting(true);

            await deleteProduct(productToDelete.id);

            toast.success("Producto eliminado correctamente");

            setOpenDeleteModal(false);
            setProductToDelete(null);

            await loadProducts();

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Error eliminando producto."
            );

        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return <p>Cargando productos...</p>;
    }

    return (
        <div className="products-page">

            <div className="products-header">

                <h1>Productos</h1>

                <div className="products-actions">

                    <input
                        type="text"
                        placeholder="Buscar producto..."
                    />

                    <button onClick={handleOpenCreate}>
                        + Nuevo producto
                    </button>

                </div>

            </div>

            <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ProductModal
                open={openModal}
                title={
                    selectedProduct
                        ? "Editar producto"
                        : "Nuevo producto"
                }
                onClose={handleCloseModal}
            >
                <ProductForm
    product={selectedProduct}
    onSubmit={handleSubmitProduct}
    onDeleteImage={handleDeleteImage}
    onSetPrimaryImage={handleSetPrimaryImage}
/>
            </ProductModal>

            <ConfirmModal
                open={openDeleteModal}
                title="Eliminar producto"
                message={
                    productToDelete
                        ? `¿Seguro que deseas eliminar "${productToDelete.name}"?`
                        : ""
                }
                onCancel={() => {
                    setOpenDeleteModal(false);
                    setProductToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                loading={deleting}
            />

        </div>
    );
}

export default Products;