var PRECIO = 60;                
var filas = ["A", "B", "C", "D", "E"];
var columnas = 8;
var elegidos = [];
var ocupados = {};
try {
  ocupados = JSON.parse(localStorage.getItem("cineOcupados")) || {};
} catch (e) {
  ocupados = {};
}
function guardar() {
  try {
    localStorage.setItem("cineOcupados", JSON.stringify(ocupados));
  } catch (e) {}
}
function funcionActual() {
  return document.getElementById("pelicula").value + "|" +
         document.getElementById("horario").value;
}
function crearAsientos() {
  var clave = funcionActual();
  if (ocupados[clave] == undefined) {
    ocupados[clave] = ["A3", "B5", "C1", "C2", "D6"]; 
  }
  var contenedor = document.getElementById("asientos");
  contenedor.innerHTML = "";
  for (var f = 0; f < filas.length; f++) {
    var fila = document.createElement("div");
    fila.className = "fila";
    for (var c = 1; c <= columnas; c++) {
      var nombre = filas[f] + c;
      var boton = document.createElement("button");
      boton.className = "asiento";
      boton.textContent = nombre;
      if (ocupados[clave].indexOf(nombre) != -1) {
        boton.classList.add("ocupado");
        boton.disabled = true;
      } else if (elegidos.indexOf(nombre) != -1) {
        boton.classList.add("elegido");
      }
      boton.onclick = elegirAsiento;
      fila.appendChild(boton);
    }
    contenedor.appendChild(fila);
  }
}
function cambioDeFuncion() {
  elegidos = [];
  document.getElementById("confirmacion").textContent = "";
  crearAsientos();
  actualizar();
}
function elegirAsiento() {
  var nombre = this.textContent;
  var cantidad = parseInt(document.getElementById("cantidad").value);
  var posicion = elegidos.indexOf(nombre);
  if (posicion != -1) {
    elegidos.splice(posicion, 1);
    this.classList.remove("elegido");
  } else if (elegidos.length < cantidad) {
    elegidos.push(nombre);
    this.classList.add("elegido");
  } else {
    alert("Solo compraste " + cantidad + " boleto(s). Cambia la cantidad para elegir más.");
  }
  actualizar();
}
function cambioDeCantidad() {
  var cantidad = parseInt(document.getElementById("cantidad").value) || 1;
  if (elegidos.length > cantidad) {
    elegidos = elegidos.slice(0, cantidad);
    crearAsientos();
  }
  actualizar();
}
function actualizar() {
  var texto = elegidos.length > 0 ? elegidos.join(", ") : "ninguno";
  document.getElementById("lista").textContent = texto;
  document.getElementById("total").textContent = elegidos.length * PRECIO;
}
function comprar() {
  var cantidad = parseInt(document.getElementById("cantidad").value);
  var mensaje = document.getElementById("confirmacion");
  if (elegidos.length != cantidad) {
    mensaje.textContent = "Escoge " + cantidad + " asiento(s) antes de comprar.";
    return;
  }
  var resumen = document.getElementById("pelicula").value + " a las " +
    document.getElementById("horario").value +
    "\nAsientos: " + elegidos.join(", ") +
    "\nTotal: $" + (cantidad * PRECIO);
  ocupados[funcionActual()] = ocupados[funcionActual()].concat(elegidos);
  guardar();
  alert("¡Compra lista!\n\n" + resumen + "\n\nAhora puedes escoger otra película.");
  window.location.href = "cine1.html";
}
var datos = new URLSearchParams(window.location.search);
var peliculaElegida = datos.get("pelicula");
if (peliculaElegida) {
  document.getElementById("pelicula").value = peliculaElegida;
}
document.getElementById("pelicula").onchange = cambioDeFuncion;
document.getElementById("horario").onchange = cambioDeFuncion;
document.getElementById("cantidad").oninput = cambioDeCantidad;
crearAsientos();