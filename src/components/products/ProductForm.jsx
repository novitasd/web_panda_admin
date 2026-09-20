import { useEffect, useState } from "react";

import {
    getSizes,
    createSize,
} from "../../services/size.service";
import { getStockByProduct } from "../../services/stock.service";
import { createProductSize } from "../../services/productSize.service";
import { createInventoryMovement } from "../../services/inventoryMovement.service";

import { getBrands } from "../../services/brand.service";
import { getCategories } from "../../services/category.service";
import ImageGallery from "../images/ImageGallery";
import "./ProductForm.css";

function ProductForm({
    product,
    onSubmit,
    onDeleteImage,
    onSetPrimaryImage,
}) {
    function getInitialForm() {
    return {
        name: "",
        description: "",
        price: "",
        offerPrice: "",
        brandId: "",
        categoryId: "",
        active: true,
        featured: false,
    };
}
const [form, setForm] = useState(getInitialForm());
    useEffect(() => {
    loadData();
}, []);

const [brands, setBrands] = useState([]);
const [categories, setCategories] = useState([]);
const [images, setImages] = useState([]);

const [sizes, setSizes] = useState([]);
const [productStock, setProductStock] = useState([]);

const [loadingStock, setLoadingStock] = useState(false);
const [saving, setSaving] = useState(false);
const [sizeName, setSizeName] = useState("");
const [sizeStock, setSizeStock] = useState("");
const [pendingSizes, setPendingSizes] = useState([]);



async function loadData() {
    try {
        const [brandsData, categoriesData, sizesData] =
    await Promise.all([
        getBrands(),
        getCategories(),
        getSizes(),
    ]);

setBrands(brandsData);
setCategories(categoriesData);
setSizes(sizesData);
    } catch (error) {
        console.error(error);
    }
}
useEffect(() => {
    if (!product) {
        setForm(getInitialForm());
        setImages([]);
        return;
    }

    setForm({
        name: product.name ?? "",
        description: product.description ?? "",
        price: product.price ?? "",
        offerPrice: product.offerPrice ?? "",
        brandId: product.brandId ?? "",
        categoryId: product.categoryId ?? "",
        active: product.active,
        featured: product.featured,
    });

    setImages([]);
}, [product]);

async function loadProductStock(productId) {
    try {
        setLoadingStock(true);

        const data = await getStockByProduct(productId);

        setProductStock(data);
    } catch (error) {
        console.error("Error cargando inventario:", error);
    } finally {
        setLoadingStock(false);
    }
}

useEffect(() => {
    if (product?.id) {
        loadProductStock(product.id);
    } else {
        setProductStock([]);
    }

    // Limpiar tallas temporales al cambiar de producto
    setPendingSizes([]);
    setSizeName("");
    setSizeStock("");

}, [product?.id]);


async function handleStockAdjustment(productSizeId, quantity) {
    const newStock = Number(quantity);

    if (
        !Number.isInteger(newStock) ||
        newStock < 0
    ) {
        alert("El stock no es válido.");
        return;
    }

    try {
        await createInventoryMovement({
            productSizeId,
            type: "ADJUSTMENT",
            quantity: newStock,
            reason: "Ajuste manual desde administrador",
        });

        await loadProductStock(product.id);

    } catch (error) {
        console.error("Error actualizando stock:", error);

        alert(
            error.response?.data?.message ||
            "No se pudo actualizar el stock."
        );
    }
}


    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleAddImages(files) {
    setImages((prev) => [...prev, ...files]);
}

function handleRemoveNewImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
}

const previewImages = [
    ...(product?.images || []),

    ...images.map((file, index) => ({
        id: `new-${index}`,
        url: URL.createObjectURL(file),
        file,
        isPrimary: false,
        isNew: true,
        index,
    })),
];

async function handleSubmit(e) {
    e.preventDefault();

    // Evita múltiples clics mientras se guarda
    if (saving) return;

    try {
        setSaving(true);

        await onSubmit({
            ...form,

            images,

            sizes: pendingSizes.map((item) => ({
                name: item.name,
                stock: item.stock,
            })),

            price: Number(form.price),

            offerPrice: form.offerPrice
                ? Number(form.offerPrice)
                : null,
        });

    } catch (error) {
        console.error("Error guardando producto:", error);

    } finally {
        setSaving(false);
    }
}

function handleAddPendingSize() {
    const name = sizeName.trim();
    const stock = Number(sizeStock);

    if (!name) {
        alert("Ingresa una talla.");
        return;
    }

    if (
        sizeStock === "" ||
        !Number.isInteger(stock) ||
        stock < 0
    ) {
        alert("Ingresa un stock válido.");
        return;
    }

    const existsPending = pendingSizes.some(
        (item) =>
            item.name.toLowerCase() ===
            name.toLowerCase()
    );

    const existsProduct = productStock.some(
        (item) =>
            item.size?.name?.toLowerCase() ===
            name.toLowerCase()
    );

    if (existsPending || existsProduct) {
        alert("Esta talla ya fue agregada.");
        return;
    }

    setPendingSizes((prev) => [
        ...prev,
        {
            id: crypto.randomUUID(),
            name,
            stock,
        },
    ]);

    setSizeName("");
    setSizeStock("");
}

function increasePendingStock(id) {
    setPendingSizes((prev) =>
        prev.map((item) =>
            item.id === id
                ? {
                    ...item,
                    stock: item.stock + 1,
                }
                : item
        )
    );
}

function decreasePendingStock(id) {
    setPendingSizes((prev) =>
        prev.map((item) =>
            item.id === id
                ? {
                    ...item,
                    stock: Math.max(
                        0,
                        item.stock - 1
                    ),
                }
                : item
        )
    );
}

function removePendingSize(id) {
    setPendingSizes((prev) =>
        prev.filter((item) => item.id !== id)
    );
}


return (
    <form className="product-form" onSubmit={handleSubmit}>

        {/* INFORMACIÓN */}

        <section className="form-section">

            <h3 className="section-title">
                Información del producto
            </h3>

            <div className="form-group">
                <label>Nombre</label>

                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                />
            </div>
                {product && (
        <div className="form-group">
            <label>SKU</label>

            <input
                type="text"
                value={product.sku ?? ""}
                readOnly
                className="sku-readonly"
            />

            <small className="form-help">
                Código interno generado automáticamente.
            </small>
        </div>
    )}

            <div className="form-row">

                <div className="form-group">
                    <label>Precio</label>

                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Precio oferta</label>

                    <input
                        type="number"
                        name="offerPrice"
                        value={form.offerPrice}
                        onChange={handleChange}
                    />
                </div>

            </div>

            <div className="form-row">

                <div className="form-group">

                    <label>Marca</label>

                    <select
                        name="brandId"
                        value={form.brandId}
                        onChange={handleChange}
                    >
                        <option value="">
                            Seleccione una marca
                        </option>

                        {brands.map((brand) => (
                            <option
                                key={brand.id}
                                value={brand.id}
                            >
                                {brand.name}
                            </option>
                        ))}
                    </select>

                </div>

                <div className="form-group">

                    <label>Categoría</label>

                    <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                    >
                        <option value="">
                            Seleccione una categoría
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>

                </div>

            </div>

            <div className="form-group">

                <label>Descripción</label>

                <textarea
                    rows="5"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                />

            </div>

        </section>
{/* TALLAS E INVENTARIO */}

<section className="form-section">

    <h3 className="section-title">
        Tallas e inventario
    </h3>

    <p className="section-description">
        Agrega las tallas disponibles y la cantidad
        de pares de cada una.
    </p>

    {/* NUEVA TALLA */}

    <div className="inventory-new-row">

        <div className="form-group">
            <label>Talla</label>

            <input
                type="text"
                value={sizeName}
                onChange={(e) =>
                    setSizeName(e.target.value)
                }
                placeholder="Ej. 36"
                maxLength={10}
            />
        </div>

        <div className="form-group">
            <label>Stock</label>

            <input
                type="number"
                min="0"
                step="1"
                value={sizeStock}
                onChange={(e) =>
                    setSizeStock(e.target.value)
                }
                placeholder="0"
            />
        </div>

        <button
            type="button"
            className="inventory-add-button"
            onClick={handleAddPendingSize}
        >
            + Agregar
        </button>

    </div>


    {/* TALLAS YA GUARDADAS */}

    {product?.id && (

        <div className="inventory-current">

            {loadingStock ? (

                <p className="section-description">
                    Cargando inventario...
                </p>

            ) : productStock.length > 0 ? (

                <>
                    <span className="inventory-subtitle">
                        Inventario actual
                    </span>

                    {productStock.map((item) => (

                        <div
                            className="inventory-stock-row"
                            key={item.id}
                        >

                            <div className="inventory-stock-size">
                                <span>Talla</span>

                                <strong>
                                    {item.size?.name}
                                </strong>
                            </div>

                            <div className="inventory-counter">

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleStockAdjustment(
                                            item.id,
                                            Math.max(
                                                0,
                                                item.stock - 1
                                            )
                                        )
                                    }
                                    disabled={item.stock <= 0}
                                >
                                    −
                                </button>

                                <strong>
                                    {item.stock}
                                </strong>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleStockAdjustment(
                                            item.id,
                                            item.stock + 1
                                        )
                                    }
                                >
                                    +
                                </button>

                            </div>

                        </div>

                    ))}
                </>

            ) : null}

        </div>

    )}


    {/* TALLAS NUEVAS */}

    {pendingSizes.length > 0 && (

        <div className="inventory-pending">

            <span className="inventory-subtitle">
                Tallas por guardar
            </span>

            {pendingSizes.map((item) => (

                <div
                    className="inventory-stock-row"
                    key={item.id}
                >

                    <div className="inventory-stock-size">

                        <span>Talla</span>

                        <strong>
                            {item.name}
                        </strong>

                    </div>

                    <div className="inventory-counter">

                        <button
                            type="button"
                            onClick={() =>
                                decreasePendingStock(
                                    item.id
                                )
                            }
                            disabled={item.stock <= 0}
                        >
                            −
                        </button>

                        <strong>
                            {item.stock}
                        </strong>

                        <button
                            type="button"
                            onClick={() =>
                                increasePendingStock(
                                    item.id
                                )
                            }
                        >
                            +
                        </button>

                    </div>

                    <button
                        type="button"
                        className="inventory-remove"
                        onClick={() =>
                            removePendingSize(item.id)
                        }
                    >
                        Eliminar
                    </button>

                </div>

            ))}

        </div>

    )}

</section>



        {/* IMÁGENES */}

        <section className="form-section">

            <h3 className="section-title">
                Imágenes
            </h3>

            <p className="section-description">
                Agrega una o varias imágenes. La primera imagen será la principal.
            </p>

          <ImageGallery
    images={previewImages}
    onAddImages={handleAddImages}
    onDeleteImage={handleRemoveNewImage}
    onDelete={onDeleteImage}
    onSetPrimary={onSetPrimaryImage}
/>

        </section>

        {/* ESTADO */}

        <section className="form-section">

            <h3 className="section-title">
                Estado
            </h3>

            <div className="checkbox-group">

                <label className="checkbox-item">

                    <input
                        type="checkbox"
                        name="featured"
                        checked={form.featured}
                        onChange={handleChange}
                    />

                    <span>Producto destacado</span>

                </label>

                <label className="checkbox-item">

                    <input
                        type="checkbox"
                        name="active"
                        checked={form.active}
                        onChange={handleChange}
                    />

                    <span>Producto activo</span>

                </label>

            </div>

        </section>

        <button
    type="submit"
    className="save-button"
    disabled={saving}
>
    {saving ? (
        <>
            <span className="save-spinner"></span>
            Guardando...
        </>
    ) : (
        product
            ? "Guardar cambios"
            : "Guardar producto"
    )}
</button>
    </form>
);
}

export default ProductForm;