let listCours = JSON.parse(localStorage.getItem("listCours")) || [];

// Lancer l'affichage initial
localStorage.setItem("listCours", JSON.stringify(listCours));
afficherCours();
// Affiche tous les cours actuels
function afficherCours() {
  let container = document.querySelector("main");
  container.innerHTML = ""; // Nettoie l'affichage

  // Génère les blocs de cours
  listCours.forEach((element) => {
    let block = document.createElement("div");
    block.className = "block";
    block.classList.add(element.etat ? "valide" : "invalide");
    block.id = element.name;
    let checkId = `check-${element.name.replace(/\s+/g, "-")}`;
    block.innerHTML = `
        <h2 class="namVal">${element.name}</h2>
        <h2 class="nombVal">${element.nombre}kg</h2>
        <div> 
        <!-- From Uiverse.io by SelfMadeSystem --> 
        <input class="check" id="${checkId}" type="checkbox" ${
      element.etat ? "checked" : ""
    } />
    <label class="switch" for="${checkId}">
        <svg viewBox="0 0 212.4992 84.4688" overflow="visible">
        <path
        pathLength="360"
        fill="none"
        stroke="currentColor"
        d="M 42.2496 0 A 42.24 42.24 90 0 0 0 42.2496 A 42.24 42.24 90 0 0 42.2496 84.4688 A 42.24 42.24 90 0 0 84.4992 42.2496 A 42.24 42.24 90 0 0 42.2496 0 A 42.24 42.24 90 0 0 0 42.2496 A 42.24 42.24 90 0 0 42.2496 84.4688 L 170.2496 84.4688 A 42.24 42.24 90 0 0 212.4992 42.2496 A 42.24 42.24 90 0 0 170.2496 0 A 42.24 42.24 90 0 0 128 42.2496 A 42.24 42.24 90 0 0 170.2496 84.4688 A 42.24 42.24 90 0 0 212.4992 42.2496 A 42.24 42.24 90 0 0 170.2496 0 L 42.2496 0"
        ></path>
       </svg>
        </label>

        </div>
        <div class="insedeButton">
          <button class="edit">modifier</button>
          <button class="remove">supprimer</button>
        </div>
      `;

    // Ajoute les événements via JS

    block
      .querySelector(".edit")
      .addEventListener("click", (e) => formshow(false, e));
    block.querySelector(".remove").addEventListener("click", supprimer);
    block.querySelector(".check").addEventListener("click", checkF);
    container.appendChild(block);
  });

  function checkF(e) {
    let id = e.target.closest(".block").id;
    listCours = listCours.map((item) =>
      item.name === id ? { ...item, etat: !item.etat } : item
    );
    localStorage.setItem("listCours", JSON.stringify(listCours));
    afficherCours();
  }

  // Bouton d'ajout
  let addBlock = document.createElement("div");
  addBlock.className = "blockAdd";
  let btnAdd = document.createElement("button");
  btnAdd.className = "add";
  btnAdd.textContent = "+";
  btnAdd.addEventListener("click", () => formshow(true));
  addBlock.appendChild(btnAdd);
  container.appendChild(addBlock);
}

// Affiche le formulaire (ajout ou modification)
function formshow(isAdd, event = null) {
  let nameVal = "";
  let nombVal = "";
  let btnText = "ajouter";

  if (!isAdd && event) {
    nameVal = event.target
      .closest(".block")
      .querySelector(".namVal").textContent;
    nombVal = event.target
      .closest(".block")
      .querySelector(".nombVal")
      .textContent.replace("kg", "")
      .trim();
    btnText = "modifier";
  }

  // Crée le formulaire Bootstrap
  let htmlForm = `
      <form class="container-sm" id="showForm">
        <div class="mb-3">
          <label for="name" class="form-label">Ajouter quoi ?</label>
          <input class="form-control" id="name" value="${nameVal}">
        </div>
        <div class="mb-3">
          <label for="nombre" class="form-label">Combien ?</label>
          <input type="number" class="form-control" id="nombre" value="${nombVal}">
        </div>
        <button type="submit" class="btn btn-primary">${btnText}</button>
      </form>
    `;

  document.querySelector("main").innerHTML = htmlForm;

  // Attache l'événement de soumission du formulaire
  let form = document.getElementById("showForm");
  if (isAdd) {
    form.addEventListener("submit", ajouterCours);
  } else {
    form.addEventListener("submit", (e) => modifier(e, nameVal));
  }
}

// Ajouter un cours
function ajouterCours(event) {
  event.preventDefault();
  let nom = document.getElementById("name").value;
  let nombre = document.getElementById("nombre").value;
  if (nom && nombre) {
    listCours.push({ name: nom, nombre: nombre, etat: false });
    localStorage.setItem("listCours", JSON.stringify(listCours));
    afficherCours();
  }
}

// Supprimer un cours
function supprimer(event) {
  let id = event.target.closest(".block").id;
  listCours = listCours.filter((item) => item.name !== id);
  localStorage.setItem("listCours", JSON.stringify(listCours));
  afficherCours();
}

// Modifier un cours existant
function modifier(event, oldName) {
  event.preventDefault();
  let nom = document.getElementById("name").value;
  let nombre = document.getElementById("nombre").value;

  // Remplace l'ancien élément
  listCours = listCours.map((item) =>
    item.name === oldName ? { ...item, name: nom, nombre: nombre } : item
  );
  localStorage.setItem("listCours", JSON.stringify(listCours));

  afficherCours();
}
