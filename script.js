let total = 0;
let itemCounter = 0;
let currentItem = {};
let orderNumber = 1;
let ticketItems = []; // Stockage des items pour le ticket d'impression

// Liste des viandes et leurs abréviations
const VIANDES = ['Poulet', 'Poulet mariné', 'Cordon bleu', 'Viande hachée', 'Tenders', 'Nuggets'];
const VIANDES_ABR = {
  'Poulet': 'PLT',
  'Poulet mariné': 'PLTM',
  'Cordon bleu': 'CB',
  'Viande hachée': 'ST',
  'Tenders': 'TD',
  'Nuggets': 'NG'
};

// Abréviations des crudités
const CRUDITES_ABR = {
  'Salade': 'S',
  'Tomate': 'T',
  'Oignon': 'O'
};

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
      showFinalButtons();
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
  const maxSauces = 2;

  let html = `<h3>Sauces pour ${currentItem.name}</h3>`;
  html += `<p>Maximum ${maxSauces} sauces</p>`;

  html += `
    <label><input type="checkbox" class="sauce-check" value="Ketchup"> Ketchup</label>
    <label><input type="checkbox" class="sauce-check" value="Mayo"> Mayo</label>
    <label><input type="checkbox" class="sauce-check" value="Barbecue"> Barbecue</label>
    <label><input type="checkbox" class="sauce-check" value="Algérienne"> Algérienne</label>
    <label><input type="checkbox" class="sauce-check" value="Blanche"> Blanche</label>
    <label><input type="checkbox" class="sauce-check" value="Samourai"> Samourai</label>
    <br><br>
    <button class="btn-primary" onclick="validateSauces(${maxSauces})">Suivant</button>
  `;

  content.innerHTML = html;

  // Limitation à 2 sauces
  const checkboxes = document.querySelectorAll('.sauce-check');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = document.querySelectorAll('.sauce-check:checked');
      if (checked.length >= maxSauces) {
        checkboxes.forEach(box => {
          if (!box.checked) box.disabled = true;
        });
      } else {
        checkboxes.forEach(box => box.disabled = false);
      }
    });
  });
}

function validateSauces(maxSauces) {
  const checks = document.querySelectorAll('.sauce-check:checked');
  
  if (checks.length > maxSauces) {
    alert(`Maximum ${maxSauces} sauce(s)`);
    return;
  }
  
  currentItem.sauces = [];
  checks.forEach(check => {
    currentItem.sauces.push(check.value);
  });
  
  showFinalButtons();
}

// Affiche les boutons finaux avec option d'ouvrir le panneau d'options
function showFinalButtons() {
  const content = document.getElementById("contentArea");
  const hasOptionalOptions = needsOptionalOptions();
  
  let html = `<h3>✅ ${currentItem.name} configuré</h3>`;
  html += `<p>Prix actuel: <strong>${currentItem.price.toFixed(2)}€</strong></p>`;
  
  if (hasOptionalOptions) {
    const optionCount = getOptionCount();
    html += `<div class="action-buttons">`;
    html += `<button class="btn-secondary" onclick="openOptions()">⚙️ Options + ${optionCount > 0 ? '<span class="options-badge">' + optionCount + '</span>' : ''}</button>`;
    html += `<button class="btn-primary" onclick="finalizeItem()">Ajouter au ticket</button>`;
    html += `</div>`;
  } else {
    html += `<button class="btn-primary" onclick="finalizeItem()">Ajouter au ticket</button>`;
  }
  
  content.innerHTML = html;
}

// Vérifie si le produit peut avoir des options
function needsOptionalOptions() {
  const cat = currentItem.category;
  return ['Burgers', 'Sandwichs', 'Tacos', 'Poutines', 'Assiettes', 'Salades'].includes(cat);
}

// Compte le nombre d'options ajoutées
function getOptionCount() {
  let count = 0;
  if (currentItem.grattinage) count++;
  if (currentItem.supplements.length > 0) count += currentItem.supplements.length;
  if (currentItem.comment) count++;
  return count;
}

// Ouvre le panneau d'options
function openOptions() {
  const panel = document.getElementById("optionsPanel");
  const content = document.getElementById("optionsContent");
  
  let html = '';
  
  // Section Grattinage (seulement pour certaines catégories)
  if (['Sandwichs', 'Tacos', 'Poutines'].includes(currentItem.category)) {
    html += `<div class="options-section">`;
    html += `<h4>🧀 Grattinage (+2€)</h4>`;
    html += `<label><input type="radio" name="grattinage" value="" ${!currentItem.grattinage ? 'checked' : ''}> Aucun</label>`;
    GRATINAGES.forEach(grat => {
      html += `<label><input type="radio" name="grattinage" value="${grat}" ${currentItem.grattinage === grat ? 'checked' : ''}> ${grat}</label>`;
    });
    html += `</div>`;
  }
  
  // Section Suppléments
  html += `<div class="options-section">`;
  html += `<h4>➕ Supplément viande (+2.50€)</h4>`;
  VIANDES.forEach((viande) => {
    const isChecked = currentItem.supplements.some(s => s.name === viande);
    html += `<label><input type="checkbox" class="opt-supp-viande" value="${viande}" data-price="2.5" ${isChecked ? 'checked' : ''}> ${viande}</label>`;
  });
  html += `</div>`;
  
  html += `<div class="options-section">`;
  html += `<h4>➕ Autres suppléments (+1.50€)</h4>`;
  SUPPLEMENTS_150.forEach((supp) => {
    const isChecked = currentItem.supplements.some(s => s.name === supp);
    html += `<label><input type="checkbox" class="opt-supp-other" value="${supp}" data-price="1.5" ${isChecked ? 'checked' : ''}> ${supp}</label>`;
  });
  html += `</div>`;
  
  // Section Commentaire
  html += `<div class="options-section">`;
  html += `<h4>💬 Commentaire</h4>`;
  html += `<textarea id="optItemComment" rows="3" style="width:100%;" placeholder="Ex: Sans oignon, bien cuit...">${currentItem.comment || ''}</textarea>`;
  html += `</div>`;
  
  html += `<button class="btn-primary" style="width:100%;" onclick="applyOptions()">Appliquer les options</button>`;
  
  content.innerHTML = html;
  panel.classList.add('open');
}

// Ferme le panneau d'options
function closeOptions() {
  document.getElementById("optionsPanel").classList.remove('open');
}

// Applique les options sélectionnées
function applyOptions() {
  // Recalcule le prix de base (sans les anciens suppléments et grattinage)
  currentItem.price = currentItem.isMenu ? currentItem.basePrice + currentItem.menuDiff : currentItem.basePrice;
  currentItem.supplements = [];
  currentItem.grattinage = null;
  
  // Grattinage
  const gratSelected = document.querySelector('input[name="grattinage"]:checked');
  if (gratSelected && gratSelected.value) {
    currentItem.grattinage = gratSelected.value;
    currentItem.price += 2;
  }
  
  // Suppléments viande
  document.querySelectorAll('.opt-supp-viande:checked').forEach(check => {
    const name = check.value;
    const price = parseFloat(check.dataset.price);
    currentItem.supplements.push({name, price});
    currentItem.price += price;
  });
  
  // Autres suppléments
  document.querySelectorAll('.opt-supp-other:checked').forEach(check => {
    const name = check.value;
    const price = parseFloat(check.dataset.price);
    currentItem.supplements.push({name, price});
    currentItem.price += price;
  });
  
  // Commentaire
  currentItem.comment = document.getElementById("optItemComment").value;
  
  closeOptions();
  showFinalButtons(); // Rafraîchit l'affichage avec le nouveau prix
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

// Étape: Commentaire (simplifiée - pour les produits sans options)
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
  // Récupère le commentaire si l'étape commentaire simple est affichée
  const commentField = document.getElementById("itemComment");
  if (commentField && !currentItem.comment) {
    currentItem.comment = commentField.value;
  }
  
  addItemToTicket(currentItem);
  
  document.getElementById("contentArea").innerHTML = "<p style='color:green; font-size:18px;'>✅ Ajouté au ticket!</p>";
  closeOptions(); // Ferme le panneau d'options si ouvert
  currentItem = {};
}

// Ajoute un item au ticket
function addItemToTicket(item) {
  const itemsDiv = document.getElementById("items");
  const itemId = itemCounter++;
  
  // Stocke l'item pour l'impression
  ticketItems.push({...item, itemId});
  
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
    
    // Retire l'item du tableau
    ticketItems = ticketItems.filter(ti => ti.itemId !== itemId);
  }
}

// Met à jour le total
function updateTotal() {
  document.getElementById("total").textContent = total.toFixed(2);
}

// Réinitialise le numéro de commande
function resetOrderNumber() {
  if (confirm("Réinitialiser le numéro de commande à 0001 ?")) {
    orderNumber = 1;
    updateOrderNumberDisplay();
  }
}

// Met à jour l'affichage du numéro de commande
function updateOrderNumberDisplay() {
  document.getElementById("orderNumberDisplay").textContent = orderNumber.toString().padStart(4, '0');
}

// Génère le ticket d'impression au format 80mm
function generatePrintTicket() {
  const now = new Date();
  const date = now.toLocaleDateString('fr-FR');
  const time = now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
  const globalComment = document.getElementById("globalComment").value;
  
  let ticket = '';
  ticket += '================================\n';
  ticket += `   TICKET CUISINE #${orderNumber.toString().padStart(4, '0')}\n`;
  ticket += `  ${date} - ${time}\n`;
  ticket += '================================\n\n';
  
  ticketItems.forEach((item, index) => {
    // Titre du produit
    const itemTitle = `${item.category.toUpperCase()} ${item.name}${item.isMenu ? ' MENU' : ''}`;
    ticket += `[${index + 1}] ${itemTitle}\n`;
    
    // Viandes (abrégées)
    if (item.viandes.length > 0) {
      const viandesAbr = item.viandes.map(v => VIANDES_ABR[v] || v).join(', ');
      ticket += `    ${viandesAbr}\n`;
    }
    
    // Crudités (abrégées)
    if (item.crudites.length > 0) {
      const cruditesAbr = item.crudites.map(c => CRUDITES_ABR[c] || c).join(', ');
      ticket += `    ${cruditesAbr}\n`;
    }
    
    // Sauces (une par ligne)
    if (item.sauces.length > 0) {
      item.sauces.forEach(sauce => {
        ticket += `    ${sauce}\n`;
      });
    }
    
    // Grattinage
    if (item.grattinage) {
      ticket += `    GR ${item.grattinage}\n`;
    }
    
    // Suppléments
    if (item.supplements.length > 0) {
      item.supplements.forEach(supp => {
        const suppName = VIANDES_ABR[supp.name] || supp.name;
        ticket += `    +${suppName}\n`;
      });
    }
    
    // Commentaire
    if (item.comment) {
      ticket += `    💬 ${item.comment}\n`;
    }
    
    ticket += '\n';
  });
  
  ticket += '================================\n';
  
  // Commentaire général
  if (globalComment) {
    ticket += '  Commentaire général:\n';
    ticket += `  ${globalComment}\n`;
    ticket += '================================\n';
  }
  
  return ticket;
}

function printTicket() {
  if (ticketItems.length === 0) {
    alert("Le ticket est vide !");
    return;
  }
  
  const printTicketDiv = document.getElementById("printTicket");
  const ticketContent = generatePrintTicket();
  
  printTicketDiv.innerHTML = `<pre>${ticketContent}</pre>`;
  
  // ✅ Affiche temporairement le ticket pour l'impression
  printTicketDiv.style.display = "block";

  // Incrémente le numéro de commande
  orderNumber++;
  updateOrderNumberDisplay();
  
  window.print();

  // ✅ Re-cache après impression
  printTicketDiv.style.display = "none";
}

// Efface le ticket
function clearTicket() {
  if (confirm("Effacer tout le ticket?")) {
    document.getElementById("items").innerHTML = "";
    document.getElementById("globalComment").value = "";
    ticketItems = [];
    total = 0;
    updateTotal();
  }
}

// Initialisation
updateOrderNumberDisplay();