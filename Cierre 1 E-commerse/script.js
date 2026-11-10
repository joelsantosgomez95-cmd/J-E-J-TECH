const productos = [
    { id: 1, nombre: "HP Pavilion 15", precio: 28990, categoria: "Windows" },
    { id: 2, nombre: "MacBook Air M2", precio: 54990, categoria: "MacBook" },
    { id: 3, nombre: "Lenovo IdeaPad 3", precio: 22990, categoria: "Windows" },
    { id: 4, nombre: "Acer Nitro 5", precio: 45990, categoria: "Gaming" },
    { id: 5, nombre: "ASUS Vivobook 15", precio: 26990, categoria: "Windows" },
    { id: 6, nombre: "Dell Inspiron 15", precio: 30990, categoria: "Windows" }
];

const CLAVE_CARRITO = "carrito";

function cargarCarrito() {
    try {
        const guardado = localStorage.getItem(CLAVE_CARRITO);
        const carritoGuardado = guardado ? JSON.parse(guardado) : [];

        if (!Array.isArray(carritoGuardado)) {
            throw new Error("El contenido guardado no es una lista.");
        }

        return carritoGuardado.filter((item) => {
            return item !== null
                && typeof item === "object"
                && productos.some((producto) => producto.id === item.id)
                && Number.isInteger(item.cantidad)
                && item.cantidad > 0;
        });
    } catch (error) {
        console.error("No se pudo cargar el carrito guardado.", error);
        return [];
    }
}

let carrito = cargarCarrito();

function guardarCarrito() {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (error) {
        console.error("No se pudo guardar el carrito en este navegador.", error);
        alert("No se pudo guardar el carrito en este navegador.");
    }

    mostrarCarrito();
}

function agregarCarrito(id) {
    const producto = productos.find((item) => item.id === id);

    if (!producto) {
        console.error(`No se encontró el producto con el identificador ${id}.`);
        return;
    }

    const productoEnCarrito = carrito.find((item) => item.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito();
    alert("Producto agregado al carrito correctamente.");
}

function crearDetalle(texto) {
    const detalle = document.createElement("p");
    detalle.textContent = texto;
    return detalle;
}

function mostrarCarrito() {
    const lista = document.getElementById("productos-carrito");
    const cantidad = document.getElementById("cantidad");
    const total = document.getElementById("total");

    if (!lista || !cantidad || !total) {
        return;
    }

    lista.replaceChildren();

    let unidades = 0;
    let suma = 0;

    if (carrito.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "Tu carrito está vacío.";
        lista.append(mensaje);
    }

    carrito.forEach((item) => {
        const producto = productos.find((actual) => actual.id === item.id);

        if (!producto) {
            return;
        }

        const subtotal = producto.precio * item.cantidad;
        unidades += item.cantidad;
        suma += subtotal;

        const fila = document.createElement("div");
        fila.className = "producto-carrito";

        const detalles = document.createElement("div");
        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;
        detalles.append(
            nombre,
            crearDetalle(`Precio: RD$${producto.precio.toLocaleString("es-DO")}`),
            crearDetalle(`Cantidad: ${item.cantidad}`),
            crearDetalle(`Subtotal: RD$${subtotal.toLocaleString("es-DO")}`)
        );

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.setAttribute("aria-label", `Eliminar ${producto.nombre} del carrito`);
        botonEliminar.innerHTML = '<i class="fa-solid fa-trash" aria-hidden="true"></i> Eliminar';
        botonEliminar.addEventListener("click", () => eliminarProducto(producto.id));

        fila.append(detalles, botonEliminar);
        lista.append(fila);
    });

    cantidad.textContent = String(unidades);
    total.textContent = `RD$${suma.toLocaleString("es-DO")}`;
}

function eliminarProducto(id) {
    carrito = carrito.filter((item) => item.id !== id);
    guardarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    alert("El carrito ha sido vaciado.");
}

function finalizarCompra() {
    if (carrito.length === 0) {
        alert("Primero debes agregar un producto.");
        return;
    }

    alert("Tu compra ha sido preparada correctamente. Gracias por elegir JEJ TECH.");
    carrito = [];
    guardarCarrito();
}

function filtrarProductos() {
    const busqueda = document.getElementById("buscar").value.trim().toLocaleLowerCase("es");
    const categoria = document.getElementById("categoria").value;
    const precioMaximo = document.getElementById("precio").value;
    const tarjetas = document.querySelectorAll("#lista-productos .producto");

    tarjetas.forEach((tarjeta) => {
        const nombre = tarjeta.querySelector("h3").textContent.toLocaleLowerCase("es");
        const precioTexto = tarjeta.querySelector("h4").textContent;
        const precio = Number(precioTexto.replace(/[^\d]/g, ""));
        const categoriaProducto = tarjeta.dataset.categoria;

        const coincideNombre = nombre.includes(busqueda);
        const coincideCategoria = categoria === "Todas" || categoria === categoriaProducto;
        const coincidePrecio = precioMaximo === "Todos" || precio <= Number(precioMaximo);

        tarjeta.hidden = !(coincideNombre && coincideCategoria && coincidePrecio);
    });
}

function configurarFormulario() {
    const formulario = document.getElementById("formulario");

    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!formulario.checkValidity()) {
            formulario.reportValidity();
            return;
        }

        const nombre = document.getElementById("nombre").value.trim();
        alert(`Gracias ${nombre}. Tu información fue recibida.`);
        formulario.reset();
    });
}

function iniciarPagina() {
    document.getElementById("buscar").addEventListener("input", filtrarProductos);
    document.getElementById("categoria").addEventListener("change", filtrarProductos);
    document.getElementById("precio").addEventListener("change", filtrarProductos);
    configurarFormulario();
    mostrarCarrito();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarPagina);
} else {
    iniciarPagina();
}
