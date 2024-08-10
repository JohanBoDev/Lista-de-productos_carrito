const boton_poster = document.querySelectorAll('.boton-postre');
const cuantos_poster = document.querySelectorAll('.boton-cuantos');
const aumentar_poster = document.getElementById('aumentar');
const disminuir_poster = document.querySelectorAll('.boton-disminuir');
let cantidad = document.getElementById('cantidad');

function mostrarPostre(button) {
  // Encuentra el contenedor padre del botón clicado
  const parent = button.parentElement;

  // Encuentra los botones relacionados dentro del mismo contenedor
  const botonPostre = parent.querySelector('.boton-postre');
  const cuantos_poster = parent.querySelector('.boton-cuantos');

  // Cambia el estilo display de los botones
  botonPostre.style.display = 'none';
  cuantos_poster.style.display = 'flex';
}


// Selecciona todos los contenedores de postres
const articulos = document.querySelectorAll('.desserts-grid article');

// Itera sobre cada artículo
articulos.forEach((articulo) => {
  // Encuentra los elementos específicos dentro de este artículo
  const botonAumentar = articulo.querySelector('.boton-cuantos .b'); // Botón aumentar
  const botonDisminuir = articulo.querySelector('.boton-cuantos button:first-child'); // Botón disminuir
  const cantidadElemento = articulo.querySelector('.boton-cuantos span'); // Elemento cantidad
  const nombreProducto = articulo.querySelector('.nombre').innerText; // Nombre del producto
  const precioProducto = articulo.querySelector('.valor').innerText; // Precio del producto


  // Agrega el evento de clic al botón de aumentar
  botonAumentar.addEventListener('click', function () {
    // Obtiene el valor actual y lo convierte a número
    let cantidad = parseInt(cantidadElemento.innerHTML);

    // Incrementa el valor
    cantidad += 1;

    // Actualiza el contenido del span con el nuevo valor
    cantidadElemento.innerHTML = cantidad;

    // Si la cantidad es mayor o igual a 1, mostrar el carrito
    if (cantidad >= 1) {
      mostrarCarrito(nombreProducto, cantidad, precioProducto);
    }
  });

  // Agrega el evento de clic al botón de disminuir
  botonDisminuir.addEventListener('click', function () {
    let cantidad = parseInt(cantidadElemento.innerHTML);

    // Asegúrate de que el valor no sea menor a 0
    if (cantidad > 0) {
      cantidad -= 1;
    }

    // Actualiza el contenido del span con el nuevo valor
    cantidadElemento.innerHTML = cantidad;

    // Si la cantidad es 0, puedes ocultar el producto del carrito
    if (cantidad === 0) {
      ocultarProductoDelCarrito(nombreProducto);
    }
  });
});


let total_a_pagar = 0;

function totalPagar(precio, cantidad) {
  total_a_pagar += precio * cantidad;
  document.getElementById('total').innerHTML = `$${total_a_pagar.toFixed(2)}`;
}

let totalProductosEnCarrito = 0;

function incrementarNumeroProductos() {
  totalProductosEnCarrito += 1;
  document.getElementById('numero_productos').innerText = `(${totalProductosEnCarrito})`;
}

function decrementarNumeroProductos() {
  totalProductosEnCarrito -= 1;
  document.getElementById('numero_productos').innerText = `(${totalProductosEnCarrito})`;
}

function mostrarCarrito(nombre, cantidad, precio) {
  document.getElementById('carrito_vacio').style.display = 'none';
  document.getElementById('carrito').style.display = 'block';

  let precioNumerico = parseFloat(precio.replace('$', ''));
  let totalProducto = precioNumerico * cantidad;

  let productoEnCarrito = document.querySelector(`#carrito li[data-nombre="${nombre}"]`);

  if (productoEnCarrito) {
    // El producto ya existe en el carrito, actualiza la cantidad correctamente
    let cantidadActual = parseInt(productoEnCarrito.querySelector('.cantidad_producto').innerText.replace('x', ''));
    let nuevaCantidad = cantidadActual + 1;  // Incrementa solo en 1 cada vez que se agrega el producto
    productoEnCarrito.querySelector('.cantidad_producto').innerText = `${nuevaCantidad}x`;

    // Actualiza el total del producto existente
    let nuevoTotalProducto = precioNumerico * nuevaCantidad;
    productoEnCarrito.querySelector('.total_producto').innerText = `$${nuevoTotalProducto.toFixed(2)}`;

    // Suma solo el precio de la nueva unidad añadida
    totalPagar(precioNumerico, 1);
  } else {
    // El producto no existe en el carrito, añádelo y actualiza el contador de productos
    incrementarNumeroProductos();
    totalPagar(precioNumerico, cantidad);
    const nuevoProducto = document.createElement('li');
    
    nuevoProducto.setAttribute('data-nombre', nombre);
    nuevoProducto.innerHTML = `
      <p class="nombre">${nombre}</p>
     <div class="divisor-carrito"> 
      <b class="cantidad_producto numero">${cantidad}x</b>
      <span class="precio">@${precio}</span>
      <span class="total_producto total">$${totalProducto.toFixed(2)}</span>
      <button class="boton-borrar" onclick="ocultarProductoDelCarrito('${nombre}')"><img src="assets/images/icon-remove-item.svg" alt=""></button>
    </div>
      `;
    document.querySelector('#carrito ul').appendChild(nuevoProducto);
  }
}


function ocultarProductoDelCarrito(nombre) {
  const producto = document.querySelector(`#carrito li[data-nombre="${nombre}"]`);
  if (producto) {
    // Restar el total de este producto al total general antes de eliminarlo
    let cantidadProducto = parseInt(producto.querySelector('.cantidad_producto').innerText);
    let precioProducto = parseFloat(producto.querySelector('span').innerText.replace('$', ''));
    total_a_pagar -= precioProducto * cantidadProducto;
    document.getElementById('total').innerHTML = `$${total_a_pagar.toFixed(2)}`;

    // Elimina el producto del carrito
    producto.remove();
    decrementarNumeroProductos(); // Decrementa el número de productos en el carrito
  }

  // Revisa si hay productos restantes en el carrito
  const productosRestantes = document.querySelectorAll('#carrito ul li');
  const productosValidos = Array.from(productosRestantes).filter(li => li.innerHTML.trim() !== "");
  
  console.log("Productos restantes:", productosValidos.length, productosValidos); // Log para depuración

  if (productosValidos.length === 0) {
    // Muestra el apartado de carrito vacío
    console.log("Carrito vacío, mostrando el apartado de carrito vacío.");
    document.getElementById('carrito_vacio').style.display = 'flex';
    // Oculta el carrito con productos
    document.getElementById('carrito').style.display = 'none';
    total_a_pagar = 0; // Resetea el total a pagar si no hay productos
    document.getElementById('total').innerHTML = `$${total_a_pagar.toFixed(2)}`;
    
    // Reinicia el contador de productos en el carrito
    totalProductosEnCarrito = 0;
    document.getElementById('numero_productos').innerText = `(0)`;
  } else {
    console.log("Carrito con productos, mostrando el apartado de carrito con productos.");

  }
}

function actualizarModalConCarrito() {
  const productosModal = document.getElementById('productos_modal');
  productosModal.innerHTML = ''; // Limpiar la lista antes de agregar los productos

  // Crear un contenedor con fondo claro
  const contenedorProductos = document.createElement('div');
  contenedorProductos.classList.add('fondo-claro', 'p-4', 'rounded-lg');

  // Seleccionar todos los productos en el carrito
  const productosCarrito = document.querySelectorAll('#carrito ul li');

  productosCarrito.forEach(productoEnCarrito => {
    const nombre = productoEnCarrito.querySelector('.nombre').innerText;
    const cantidad = productoEnCarrito.querySelector('.cantidad_producto').innerText;
    const precio = productoEnCarrito.querySelector('.precio').innerText;
    const total = productoEnCarrito.querySelector('.total_producto').innerText;

    // Agregar el prefijo `image-` al nombre del producto y construir la ruta de la imagen
    const nombreImagen = `image-${nombre.toLowerCase().replace(/ /g, '-')}-thumbnail.jpg`;
    const imagenSrc = `assets/images/${nombreImagen}`;

    // Crear el elemento `li` para el modal
    const item = document.createElement('li');
    item.classList.add('producto-modal', 'mb-2');
    item.innerHTML = `
      <div class="flex items-start  gap-x-3 divisor">
          <img src="${imagenSrc}"  class="w-2 h-2 object-cover mr-4 thumbnail">
        <div class="flex flex-col">
        <p class="nombre ml">${nombre}</p>
          <div class="johan">
            <b class="cantidad numero">${cantidad}</b>
            <span class="precio numero">${precio}</span>
            <span class="total_producto total ml2">${total}</span>
          </div>
        </div>
      </div>
    `;

    contenedorProductos.appendChild(item);
  });

  // Mostrar el total al final de la lista en el modal
  const total = document.getElementById('total').innerText;
  const totalItem = document.createElement('div');
  totalItem.classList.add('order_total', 'text-right', 'mt-2');
  totalItem.innerHTML = `
    <p class="text-xs fuente">Order total</p>
    <span class="text-lg font-bold fuente">${total}</span>
  `;
  contenedorProductos.appendChild(totalItem);

  // Añadir el contenedor con fondo claro al modal
  productosModal.appendChild(contenedorProductos);
}

// Llamar a esta función cuando se abra el modal
function mostrarModal() {
  actualizarModalConCarrito(); // Llenar el modal con los productos del carrito
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
}




function reiniciarOrden() {
  // Vaciar el contenido del carrito
  const carrito = document.querySelector('#carrito ul');
  carrito.innerHTML = '';

  // Restablecer la cantidad de productos en el carrito
  totalProductosEnCarrito = 0;
  document.getElementById('numero_productos').innerText = `(0)`;

  // Reiniciar el total a pagar
  total_a_pagar = 0;
  document.getElementById('total').innerHTML = `$${total_a_pagar.toFixed(2)}`;

  // Mostrar el mensaje de carrito vacío y ocultar el carrito
  document.getElementById('carrito_vacio').style.display = 'flex';
  document.getElementById('carrito').style.display = 'none';

  // Reiniciar las cantidades de los productos en la interfaz
  const cantidadElementos = document.querySelectorAll('.boton-cuantos span');
  cantidadElementos.forEach(cantidad => cantidad.innerHTML = '0');

  // Ocultar el modal
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

// Añadir el evento al botón de "Start New Order"
const botonNuevoPedido = document.querySelector('.reiniciar');
botonNuevoPedido.addEventListener('click', reiniciarOrden);
