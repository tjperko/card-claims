async function loadCards() {
  const res = await fetch("data/todays_cards.json");
  const cards = await res.json();
  const grid = document.getElementById("card-grid");

  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${card.image_url || 'https://via.placeholder.com/300x420?text=Card'}">
      <h3>${card.player}</h3>
      <p>${card.title}</p>
      <p><strong>${card.variant}</strong> • $${Number(card.price).toFixed(2)}</p>
      <button onclick='claimCard(${JSON.stringify(card)})'>Claim</button>
    `;
    grid.appendChild(div);
  });
}

let claims = [];

function claimCard(card) {
  claims.push(card);
  updateClaims();
}

function updateClaims() {
  const list = document.getElementById("claim-list");
  list.innerHTML = "";
  claims.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.player} — ${c.variant} — $${c.price}`;
    list.appendChild(li);
  });
}

document.getElementById("download").onclick = () => {
  const rows = [["player", "title", "variant", "price"]];
  claims.forEach(c => rows.push([c.player, c.title, c.variant, c.price]));

  let csv = rows.map(r => r.join(",")).join("\n");
  let blob = new Blob([csv], { type: "text/csv" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "claims.csv";
  a.click();
};

loadCards();
