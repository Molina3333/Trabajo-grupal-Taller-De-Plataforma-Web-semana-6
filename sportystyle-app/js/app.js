// 1. Catálogo de productos
const productos = [
    { id: 1, categoria: 'Camisetas', nombre: 'Camiseta Dry-Fit', desc: 'Transpirable y ligera.', precio: 15000, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { id: 2, categoria: 'Pantalones', nombre: 'Pantalon Jogger', desc: 'Ideal para running.', precio: 25000, img: 'https://images.unsplash.com/photo-1580087442627-6200f7b99799?w=400' },
    { id: 3, categoria: 'Accesorios', nombre: 'Botella Pro 1L', desc: 'Acero inoxidable.', precio: 12000, img: 'https://images.unsplash.com/photo-1602143393494-710f81745291?w=400' }
];

let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

// 2. Renderizar productos
const renderProductos = () => {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = productos.map(p => `
        <div class="producto-card">
            <img src="${p.img}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p>${p.desc}</p>
            <p><strong>$${p.precio}</strong></p>
            <button class="btn-primary" onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
        </div>
    `).join('');
};

// 3. Gestión del carrito
window.agregarAlCarrito = (id) => {
    const producto = productos.find(p => p.id === id);
    const existe = carrito.find(item => item.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarrito();
};

const actualizarCarrito = () => {
    const contenedor = document.getElementById('carrito-items');
    const totalSpan = document.getElementById('total-precio');
    
    // Guardar en Session Storage
    sessionStorage.setItem('carrito', JSON.stringify(carrito));

    contenedor.innerHTML = carrito.map(item => `
        <div class="item-carrito">
            <span>${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}</span>
        </div>
    `).join('');

    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    totalSpan.innerText = total;
};

// 4. Proceso de Pago
document.getElementById('btn-ir-pago').addEventListener('click', () => {
    if (carrito.length === 0) return alert("El carrito está vacío");
    document.getElementById('checkout-section').classList.remove('hidden');
    window.scrollTo(0, document.body.scrollHeight);
});

document.getElementById('form-pago').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;

    // Validaciones simples
    if (!email.includes('@') || !email.includes('.')) {
        return alert("Por favor ingresa un correo electrónico válido.");
    }

    if (isNaN(telefono) || telefono.length < 8) {
        return alert("El teléfono debe contener solo números y al menos 8 dígitos.");
    }

    // Mostrar Confirmación
    mostrarConfirmacion();
});

const mostrarConfirmacion = () => {
    const detalle = document.getElementById('detalle-pedido');
    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    let htmlDetalle = '<ul>';
    carrito.forEach(i => {
        htmlDetalle += `<li>${i.nombre} (x${i.cantidad}) - $${i.precio * i.cantidad}</li>`;
    });
    htmlDetalle += `</ul><p><strong>Total pagado: $${total}</strong></p>`;

    detalle.innerHTML = htmlDetalle;
    
    // Ocultar tienda y mostrar confirmación
    document.getElementById('productos').classList.add('hidden');
    document.getElementById('carrito-section').classList.add('hidden');
    document.getElementById('checkout-section').classList.add('hidden');
    document.getElementById('confirmacion-section').classList.remove('hidden');

    // Limpiar carrito al finalizar
    sessionStorage.removeItem('carrito');
};

// Inicializar
renderProductos();
actualizarCarrito();