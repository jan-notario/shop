// Dades inicials
let productes = [
  { id: 1, nom: "Portàtil Pro", categoria: "Electrònica", preu: 950, stock: 4 },
  { id: 2, nom: "Camiseta cotó", categoria: "Roba", preu: 18, stock: 25 },
  { id: 3, nom: "Auriculars", categoria: "Electrònica", preu: 45, stock: 0 },
  { id: 4, nom: "Llibre JS Avançat", categoria: "Llibres", preu: 32, stock: 12 }
];

let estatOrdenacio = { columna: null, ascendent: true };

// --- RENDERITZACIÓ DE LA TAULA I METRIQUES ---
function actualitzarDashboard() {
  mostrarProductes(productes);
  actualitzarMetriques();
}

function mostrarProductes(llista) {
  const tbody = document.getElementById("taula-productes");
  tbody.innerHTML = "";

  llista.forEach(prod => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${prod.id}</td>
      <td><strong>${prod.nom}</strong></td>
      <td>${prod.categoria}</td>
      <td>${prod.preu.toFixed(2)} €</td>
      <td>${prod.stock}</td>
      <td>
        <button class="btn btn-sm btn-edit" onclick="carregarPerEditar(${prod.id})">Editar</button>
        <button class="btn btn-sm btn-delete" onclick="eliminarProducte(${prod.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


// --- TASCA 1: MÈTRIQUES DEL DASHBOARD (reduce, at, some, every) ---
function actualitzarMetriques() {
  // TODO 1.1: Utilitza 'reduce' per calcular el valor total (preu * stock)
  const total = productes.reduce((acc, prod) => acc + (prod.preu * prod.stock), 0);
  document.getElementById("val-total").innerText = `${total.toFixed(2)} €`;
  // TODO 1.2: Utilitza el mètode 'at(-1)' per obtenir l'últim producte afegit a l'array
  const ultim = productes.at(-1);
  document.getElementById("val-ultim").innerText = ultim ? ultim.nom : "-";
  // TODO 1.3: Utilitza 'some' per comprovar si hi ha cap producte sense stock (stock === 0)
  const téSenseStock = productes.some(prod => prod.stock === 0);
  document.getElementById("val-sense-stock").innerText = téSenseStock ? "⚠️ Manca stock" : "✅ Ok";
  // TODO 1.4: Utilitza 'every' per comprovar si tots els preus són superiors a 0
  const totsValids = productes.every(prod => prod.preu > 0);
  document.getElementById("val-preu-valid").innerText = totsValids ? "✅ Correcte" : "❌ Error";
}


// --- TASCA 2: AFEGIR I EDITAR PRODUCTES (push, with, map i Math.max) ---
document.getElementById("form-producte").addEventListener("submit", (e) => {
  e.preventDefault();

  const editId = document.getElementById("edit-id").value;
  const dadesForm = {
    nom: document.getElementById("nom").value,
    categoria: document.getElementById("categoria").value,
    preu: parseFloat(document.getElementById("preu").value),
    stock: parseInt(document.getElementById("stock").value)
  };

  if (editId) {
    // EDITAR PRODUCTE EXISTENT
    const idNum = parseInt(editId);

    // TODO 2.3: Troba l'índex del producte amb 'findIndex'
    const index = productes.findIndex(p => p.id === idNum);

    if (index !== -1) {
      const producteEditat = { id: idNum, ...dadesForm };
      // TODO 2.3: Actualitza l'array 'productes' utilitzant el mètode immutable 'with' (ES2023)
      productes = productes.with(index, producteEditat);
    }
  } else {
    // CREAR NOU PRODUCTE
    // TODO 2.1: Calcula la nova ID trobant la màxima actual amb 'map' i 'Math.max' (si no hi ha productes, usa 0)
    const maxId = productes.length > 0 ? Math.max(...productes.map(p => p.id)) : 0;
    const nouProducte = { id: maxId + 1, ...dadesForm };

    // TODO 2.2: Afegeix 'nouProducte' a l'array 'productes' amb 'push'
    // ESCRIU EL TEU CODI AQUÍ
    productes.push(nouProducte);
  }

  netejarFormulari();
  actualitzarDashboard();
});


// --- TASCA 3: ELIMINAR DE MANERA IMMUTABLE (findIndex i toSpliced) ---
function eliminarProducte(id) {
  // TODO 3.1: Troba l'índex del producte amb 'findIndex'
  const index = productes.findIndex(p => p.id === id);

  if (index !== -1) {
    // TODO 3.2: Reemplaça l'array 'productes' per un de nou sense el producte eliminat fent servir 'toSpliced' (ES2023)
    productes = productes.toSpliced(index, 1);
    actualitzarDashboard();
  }
}

// --- TASCA 4: CERCA AVANÇADA DEL DARRER ELEMENT (findLast) ---
document.getElementById("btn-cerca-last").addEventListener("click", () => {
  const cat = document.getElementById("cerca-cat-last").value;

  // TODO 4.1: Utilitza 'findLast' per trobar el darrer producte que pertanyi a la categoria 'cat'
  const ultimCat = productes.findLast(p => p.categoria === cat);

  if (ultimCat) {
    alert(`Darrer producte trobat de ${cat}: ${ultimCat.nom} (${ultimCat.preu}€)`);
  } else {
    alert(`No hi ha cap producte de la categoria ${cat}`);
  }
});


// --- TASCA 5: ORDENACIÓ PER COLUMNA (toSorted i toReversed) ---
document.querySelectorAll(".sortable").forEach(th => {
  th.addEventListener("click", () => {
    const columna = th.dataset.sort;

    if (estatOrdenacio.columna === columna) {
      estatOrdenacio.ascendent = !estatOrdenacio.ascendent;
    } else {
      estatOrdenacio.columna = columna;
      estatOrdenacio.ascendent = true;
    }

    // TODO 5.1: Utilitza 'toSorted' (ES2023) per obtenir un array ordenat segons la columna (nom, preu o stock)
    let llistaOrdenada = productes.toSorted((a, b) => {
      if (columna === "nom") {
        return a.nom.localeCompare(b.nom);
      } else if (columna === "preu") {
        return a.preu - b.preu;
      } else if (columna === "stock") {
        return a.stock - b.stock;
      }
    });

    // TODO 5.2: Si 'estatOrdenacio.ascendent' és fals, inverteix la llista utilitzant 'toReversed' (ES2023)
    if (!estatOrdenacio.ascendent) {
      llistaOrdenada = llistaOrdenada.toReversed();
    }

    mostrarProductes(llistaOrdenada);
  });
});


// --- TASCA 6: CERCA I FILTRES COMBINATS (filter i includes) ---
document.getElementById("input-cerca").addEventListener("input", aplicarFiltres);
document.getElementById("filtre-categoria").addEventListener("change", aplicarFiltres);

function aplicarFiltres() {
  const text = document.getElementById("input-cerca").value.toLowerCase();
  const cat = document.getElementById("filtre-categoria").value;

  // TODO 6.1: Utilitza 'filter' i el mètode 'includes' per filtrar els productes per nom i/o categoria
  const filtrats = productes.filter(p => {
    const coincideixNom = p.nom.toLowerCase().includes(text);
    const coincideixCat = cat === "Totes" || p.categoria === cat;

    return coincideixNom && coincideixCat;
  });

  mostrarProductes(filtrats);
}


// --- FUNCIONS AUXILIARS D'EDICIÓ I FORMULARI ---
function carregarPerEditar(id) {
  const prod = productes.find(p => p.id === id);
  if (!prod) return;

  document.getElementById("edit-id").value = prod.id;
  document.getElementById("nom").value = prod.nom;
  document.getElementById("categoria").value = prod.categoria;
  document.getElementById("preu").value = prod.preu;
  document.getElementById("stock").value = prod.stock;

  document.getElementById("form-title").innerText = "✏️ Editar Producte";
  document.getElementById("btn-submit").innerText = "Actualitzar (with)";
  document.getElementById("btn-cancel").style.display = "block";
}

document.getElementById("btn-cancel").addEventListener("click", netejarFormulari);

function netejarFormulari() {
  document.getElementById("form-producte").reset();
  document.getElementById("edit-id").value = "";
  document.getElementById("form-title").innerText = "➕ Afegir Producte";
  document.getElementById("btn-submit").innerText = "Guardar (push / with)";
  document.getElementById("btn-cancel").style.display = "none";
}

// Inicialització
actualitzarDashboard();