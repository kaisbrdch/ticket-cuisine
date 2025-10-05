let total = 0;
let itemCounter = 0;
let currentItem = {};

// Liste des viandes pour tacos/poutines/suppléments
const VIANDES = ['Poulet', 'Poulet mariné', 'Cordon bleu', 'Viande hachée', 'Tenders', 'Nuggets'];

// Liste des suppléments à 1.50€
const SUPPLEMENTS_150 = ['Oeuf', 'Bacon', 'Boursin', 'Rosti', 'Emmental', 'Cheddar', 'Mozza', 'Chèvre', 'Chèvre miel', 'Champignon', 'Poivrons', 'Oignons crispy'];

// Liste des gratinages à 2€
const GRATINAGES = ['Emmental', 'Cheddar', 'Mozza', 'Chèvre', 'Chèvre miel'];

// Produits par catégorie
const PRODUCTS = {
  'Burgers': [
    {name: 'Classique', price: 7.9},
    {name: 'Chicken', price: 8.9},
    {name: 'Mixte', price: 9.9},
    {name: 'Duo', price: 12.9, menuDiff: 1},
    {name: 'Solo', price: 11.9, menuDiff: 1},
    {name: 'Chèvre Miel', price: 11.9},
    {name: 'Royal Cheese', price: 9.9},
    {name: 'Country', price: 9.9}
  ],
  'Sandwichs': [
    {name: 'Bavette', price: 10.9},
    {name: 'Américain', price: 8.9},
    {name: 'Curry', price: 8.9},
    {name: 'Boursin', price: 8.9},
    {name: 'Suisse', price: 8.9},
    {name: 'Forestier', price: 8.9},
    {name: 'Brazil', price: 8.9},
    {name: 'Tandoori', price: 8.9}
  ],
  'Tacos': [
    {name: '1V', price: 7.9},
    {name: '2V', price: 8.9},
    {name: '3V', price: 10.9}
  ],
  'Poutines': [
    {name: '1V', price: 7.9, menuDiff: 1},
    {name: '2V', price: 8.9, menuDiff: 1},
    {name: '3V', price: 10.9, menuDiff: 1}
  ],
  'Assiettes': [
    {name: '1V', price: 11.9},
    {name: '2V', price: 12.9},
    {name: '3V', price: 13.9}
  ],
  'Salades': [
    {name: 'Cesar', price: 8.9},
    {name: 'Mozza', price: 8.9},
    {name: 'Chèvre chaud', price: 8.9}
  ],
  'Menu Kids': [
    {name: 'Cheese', price: 5.9},
    {name: 'Nuggets', price: 5.9}
  ],
  'Petites faims': [
    {name: 'Petit Cheese', price: 3.9, single: true},
    {name: 'Mozza sticks', price: 3.9},
    {name: 'Nems', price: 4.9},
    {name: 'Nuggets', price: 4.9},
    {name: 'Bouchee', price: 3.9},
    {name: 'Japalenos', price: 3.9},
    {name: 'Samossa', price: 4.9}
  ],
  'Boissons': [
    {name: 'Eau', price: 1.5},
    {name: 'Autre', price: 2}
  ],
  'Desserts': [
    {name: 'Catégorie 1', price: 3.5},
    {name: 'Catégorie 2', price: 4.5}
  ]
};

// Affiche les produits selon la catégorie
function showCategory(category) {
  const content = document.getElementById("contentArea");
  let html = `<h3>${category}</h3>`;

  if (!PRODUCTS[category]) {
    content.innerHTML = html + "<p>Produits à définir pour cette catégorie.</p>";
    return;
  }

  PRODUCTS[category].forEach(product => {
    html += `<button onclick='startItem("${category}", ${JSON.stringify(product)})'>${product.name} - ${product.price}€</button>`;
  });

  content.innerHTML = html;
}

// Démarre la création d'un item
function startItem(category, product) {
  currentItem = {
    category: category,
    name: product.name,
    basePrice: product.price,
    price: product.price,
    menuDiff: product.menuDiff || 2,
    single: product.single || false,
    isMenu: false,
    crudites: [],
    sauces: [],
    viandes: [],
    grattinage: null,
    supplements: [],
    comment: ''
  };

  // Flow selon la catégorie
  switch(category) {
    case 'Burgers':
      chooseMenuOrSolo();
      break;
    case 'Sandwichs':
      chooseMenuOrSolo();
      break;
    case 'Tacos':
    case 'Poutines':
      chooseMenuOrSolo();
      break;
    case 'Assiettes':
      chooseViandes();
      break;
    case 'Salades':
      chooseSupplements();
      break;
    case 'Menu Kids':
      addCommentStep();
      break;
    case 'Petites faims':
      choosePetitesFaimsQuantity();
      break;
    case 'Boissons':
    case 'Desserts':
      addCommentStep();
      break;
  }
}

// Étape: Menu ou Seul
function chooseMenuOrSolo() {
  const content = document.getElementById("contentArea");
  const menuPrice = currentItem.basePrice + currentItem.menuDiff;
  
  content.innerHTML = `
    <h3>${currentItem.name}</h3>
    <button onclick="selectMenuChoice(false)">Seul - ${currentItem.basePrice}€</button>
    <button onclick="selectMenuChoice(true)">Menu - ${menuPrice}€</button>
  `;
}

function selectMenuChoice(isMenu) {
  currentItem.isMenu = isMenu;
  if (isMenu) {
    currentItem.price = currentItem.basePrice + currentItem.menuDiff;
  }

  // Passe à l'étape suivante selon la catégorie
  if (currentItem.category === 'Burgers' || currentItem.category === 'Sandwichs') {
    chooseCrudites();
  } else if (currentItem.category === 'Tacos' || currentItem.category === 'Poutines') {
    chooseViandes();
  }
}

// Étape: Crudités
function chooseCrudites() {
  const content = document.getElementById("contentArea");
  content.innerHTML = `
    <h3>Crudités pour ${currentItem.name}</h3>
    <label><input type="checkbox" id="crud_salade"> Salade</label>
    <label><input type="checkbox" id="crud_tomate"> Tomate</label>
    <label><input type="checkbox" id="crud_oignon"> Oignon</label>
    <br><br>
    <button class="btn-primary" onclick="validateCrudites()">Suivant</button>
  `;
}

function validateCrudites() {
  if (document.getElementById("crud_salade").checked) currentItem.crudites.push("Salade");
  if (document.getElementById("crud_tomate").checked) currentItem.crudites.push("Tomate");
  if (document.getElementById("crud_oignon").checked) currentItem.crudites.push("Oignon");
  
  chooseSauces();
}

// Étape: Choix des viandes (pour tacos/poutines/assiettes)
function chooseViandes() {
  const nbViandes = parseInt(currentItem.name.charAt(0)) || 1;
  const content = document.getElementById("contentArea");
  
  let html = `<h3>Choix des viandes pour ${currentItem.name}</h3>`;
  html += `<p>Sélectionne ${nbViandes} viande(s):</p>`;
  
  VIANDES.forEach((viande, idx) => {
    html += `<label><input type="checkbox" id="viande_${idx}" class="viande-check"> ${viande}</label>`;
  });
  
  html += `<br><br><button class="btn-primary" onclick="validateViandes(${nbViandes})">Suivant</button>`;
  content.innerHTML = html;
}

function validateViandes(nbRequired) {
  const checks = document.querySelectorAll('.viande-check:checked');
  
  if (checks.length !== nbRequired) {
    alert(`Sélectionne exactement ${nbRequired} viande(s)`);
    return;
  }
  
  checks.forEach(check => {
    const idx = check.id.split('_')[1];
    currentItem.viandes.push(VIANDES[idx]);
  });
  
  chooseSauces();
}

// Étape: Sauces
function chooseSauces() {
  const content = document.getElementById("contentArea");
  const maxSauces = (currentItem.category === 'Burgers') ? 2 : 99;
  
  let html = `<h3>Sauces pour ${currentItem.name}</h3>`;
  if (maxSauces === 2) html += `<p>Maximum 2 sauces</p>`;
  
  html += `
    <label><input type="checkbox" class="sauce-check"> Ketchup</label>
    <label><input type="checkbox" class="sauce-check"> Mayo</label>
    <label><input type="checkbox" class="sauce-check"> Barbecue</label>
    <label><input type="checkbox" class="sauce-check"> Algérienne</label>
    <label><input type="checkbox" class="sauce-check"> Blanche</label>
    <label><input type="checkbox" class="sauce-check"> Samourai</label>
    <br><br>
    <button class="btn-primary" onclick="validateSauces(${maxSauces})">Suivant</button>
  `;
  
  content.innerHTML = html;
}

function validateSauces(maxSauces) {
  const checks = document.querySelectorAll('.sauce-check:checked');
  
  if (checks.length > maxSauces) {
    alert(`Maximum ${maxSauces} sauce(s)`);
    return;
  }
  
  currentItem.sauces = [];
  checks.forEach(check => {
    currentItem.sauces.push(check.parentElement.textContent.trim());
  });
  
  // Passe à l'étape suivante selon la catégorie
  if (currentItem.category === 'Sandwichs' || currentItem.category === 'Tacos' || currentItem.category === 'Poutines') {
    chooseGrattinage();
  } else if (currentItem.category === 'Assiettes') {
    chooseSupplements();
  } else {
    chooseSupplements();
  }
}

// Étape: Grattinage
function chooseGrattinage() {
  const content = document.getElementById("contentArea");
  
  let html = `<h3>Grattinage (optionnel) - +2€</h3>`;
  html += `<label><input type="radio" name="grattinage" value=""> Aucun</label>`;
  
  GRATINAGES.forEach(grat => {
    html += `<label><input type="radio" name="grattinage" value="${grat}"> ${grat}</label>`;
  });
  
  html += `<br><br><button class="btn-primary" onclick="validateGrattinage()">Suivant</button>`;
  content.innerHTML = html;
}

function validateGrattinage() {
  const selected = document.querySelector('input[name="grattinage"]:checked');
  if (selected && selected.value) {
    currentItem.grattinage = selected.value;
    currentItem.price += 2;
  }
  
  chooseSupplements();
}

// Étape: Suppléments
function chooseSupplements() {
  const content = document.getElementById("contentArea");
  
  let html = `<h3>Suppléments (optionnel)</h3>`;
  
  // Suppléments viande à 2.5€
  html += `<div class="supplement-section">`;
  html += `<h4>Supplément viande (+2.50€)</h4>`;
  VIANDES.forEach((viande, idx) => {
    html += `<label><input type="checkbox" class="supp-viande" data-price="2.5"> ${viande}</label>`;
  });
  html += `</div>`;
  
  // Suppléments à 1.50€
  html += `<div class="supplement-section">`;
  html += `<h4>Autres suppléments (+1.50€)</h4>`;
  SUPPLEMENTS_150.forEach((supp, idx) => {
    html += `<label><input type="checkbox" class="supp-other" data-price="1.5"> ${supp}</label>`;
  });
  html += `</div>`;
  
  html += `<br><br><button class="btn-primary" onclick="validateSupplements()">Suivant</button>`;
  content.innerHTML = html;
}

function validateSupplements() {
  // Récupère les suppléments viande
  document.querySelectorAll('.supp-viande:checked').forEach(check => {
    const name = check.parentElement.textContent.trim();
    const price = parseFloat(check.dataset.price);
    currentItem.supplements.push({name, price});
    currentItem.price += price;
  });
  
  // Récupère les autres suppléments
  document.querySelectorAll('.supp-other:checked').forEach(check => {
    const name = check.parentElement.textContent.trim();
    const price = parseFloat(check.dataset.price);
    currentItem.supplements.push({name, price});
    currentItem.price += price;
  });
  
  addCommentStep();
}

// Étape: Quantité pour petites faims
function choosePetitesFaimsQuantity() {
  if (currentItem.single) {
    // Petit Cheese est vendu seul
    addCommentStep();
    return;
  }
  
  const content = document.getElementById("contentArea");
  content.innerHTML = `
    <h3>${currentItem.name} - ${currentItem.basePrice}€ par 3</h3>
    <p>Choisis un multiple de 3:</p>
    <button onclick="setPetitesFaimsQty(3)">3 - ${currentItem.basePrice}€</button>
    <button onclick="setPetitesFaimsQty(6)">6 - ${(currentItem.basePrice * 2).toFixed(2)}€</button>
    <button onclick="setPetitesFaimsQty(9)">9 - ${(currentItem.basePrice * 3).toFixed(2)}€</button>
    <button onclick="setPetitesFaimsQty(12)">12 - ${(currentItem.basePrice * 4).toFixed(2)}€</button>
  `;
}

function setPetitesFaimsQty(qty) {
  const multiplier = qty / 3;
  currentItem.name = `${currentItem.name} x${qty}`;
  currentItem.price = currentItem.basePrice * multiplier;
  addCommentStep();
}

// Étape: Commentaire
function addCommentStep() {
  const content = document.getElementById("contentArea");
  content.innerHTML = `
    <h3>Ajouter un commentaire (optionnel)</h3>
    <textarea id="itemComment" rows="4" style="width:100%; max-width:400px;" placeholder="Ex: Sans oignon, bien cuit..."></textarea>
    <br><br>
    <button class="btn-primary" onclick="finalizeItem()">Ajouter au ticket</button>
  `;
}

// Finalise et ajoute l'item au ticket
function finalizeItem() {
  const comment = document.getElementById("itemComment")?.value || '';
  currentItem.comment = comment;
  
  addItemToTicket(currentItem);
  
  document.getElementById("contentArea").innerHTML = "<p style='color:green; font-size:18px;'>✅ Ajouté au ticket!</p>";
  currentItem = {};
}

// Ajoute un item au ticket
function addItemToTicket(item) {
  const itemsDiv = document.getElementById("items");
  const itemId = itemCounter++;
  
  const div = document.createElement("div");
  div.className = "ticket-item";
  div.id = `item-${itemId}`;
  
  let details = '';
  
  // Construction des détails
  if (item.isMenu) details += '(MENU) ';
  if (item.crudites.length > 0) details += `\nCrudités: ${item.crudites.join(', ')}`;
  if (item.viandes.length > 0) details += `\nViandes: ${item.viandes.join(', ')}`;
  if (item.sauces.length > 0) details += `\nSauces: ${item.sauces.join(', ')}`;
  if (item.grattinage) details += `\nGrattinage: ${item.grattinage}`;
  if (item.supplements.length > 0) {
    details += `\nSupp: ${item.supplements.map(s => s.name).join(', ')}`;
  }
  
  let html = `
    <div class="ticket-item-header">
      <span>${item.name}</span>
      <span>${item.price.toFixed(2)}€ <button class="remove-btn" onclick="removeItem(${itemId}, ${item.price})">×</button></span>
    </div>
  `;
  
  if (details) {
    html += `<div class="ticket-item-details">${details}</div>`;
  }
  
  if (item.comment) {
    html += `<div class="ticket-item-comment">💬 ${item.comment}</div>`;
  }
  
  div.innerHTML = html;
  itemsDiv.appendChild(div);
  
  total += item.price;
  updateTotal();
}

// Supprime un item du ticket
function removeItem(itemId, price) {
  const item = document.getElementById(`item-${itemId}`);
  if (item) {
    item.remove();
    total -= price;
    updateTotal();
  }
}

// Met à jour le total
function updateTotal() {
  document.getElementById("total").textContent = total.toFixed(2);
}

// Imprime le ticket
function printTicket() {
  window.print();
}

// Efface le ticket
function clearTicket() {
  if (confirm("Effacer tout le ticket?")) {
    document.getElementById("items").innerHTML = "";
    document.getElementById("globalComment").value = "";
    total = 0;
    updateTotal();
  }
}