// Registrar Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("pwa-sw.js");
}

let db;
const DB_NAME = "CherryDB";
const STORE_NAME = "cerezas";

const req = indexedDB.open(DB_NAME, 1);
req.onupgradeneeded = e => {
  const db = e.target.result;
  if (!db.objectStoreNames.contains(STORE_NAME)) {
    db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
  }
};
req.onsuccess = e => {
  db = e.target.result;
  listar();
};

// Agregar
document.getElementById("agregar").onclick = () => {
  const nombre = document.getElementById("nombre").value.trim();
  const cantidad = parseInt(document.getElementById("cantidad").value);
  if (!nombre || !cantidad) return alert("Completa todos los campos");
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).add({ nombre, cantidad });
  tx.oncomplete = () => {
    listar();
    document.getElementById("nombre").value = "";
    document.getElementById("cantidad").value = "";
  };
};

// Listar
function listar() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  store.openCursor().onsuccess = e => {
    const cursor = e.target.result;
    if (cursor) {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${cursor.value.nombre} - ${cursor.value.cantidad} unidades</span>
        <div>
          <button onclick="editar(${cursor.key}, '${cursor.value.nombre}', ${cursor.value.cantidad})">Editar</button>
          <button onclick="eliminar(${cursor.key})">Eliminar</button>
        </div>
      `;
      lista.appendChild(li);
      cursor.continue();
    }
  };
}

// Editar
function editar(id, nombreActual, cantidadActual) {
  const nombre = prompt("Nuevo nombre:", nombreActual);
  const cantidad = parseInt(prompt("Nueva cantidad:", cantidadActual));
  if (!nombre || !cantidad) return;
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).put({ id, nombre, cantidad });
  tx.oncomplete = listar;
}

// Eliminar
function eliminar(id) {
  if (!confirm("¿Eliminar esta cereza?")) return;
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).delete(id);
  tx.oncomplete = listar;
}