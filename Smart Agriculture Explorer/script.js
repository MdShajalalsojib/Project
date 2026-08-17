// ============================================
// AgroGuide - script.js
// AJAX (fetch) + JSON + DOM manipulation
// Falls back to embedded data if fetch fails
// (e.g. when the page is opened directly from
// disk without a local server).
// ============================================

let allCrops = [];

// Backup data used ONLY if fetch('data/crops.json') fails
const fallbackCrops = [
  {
    id: 1,
    name: "Tomato",
    category: "Vegetable",
    soil: "Loamy",
    water: "Moderate",
    sunlight: "High",
    season: "Winter",
    description:
      "Tomato is a commonly cultivated vegetable crop rich in vitamins.",
  },
  {
    id: 2,
    name: "Rice",
    category: "Cereal",
    soil: "Clay",
    water: "High",
    sunlight: "High",
    season: "Monsoon",
    description:
      "Rice is an important cereal crop requiring sufficient water and warm climate.",
  },
  {
    id: 3,
    name: "Wheat",
    category: "Cereal",
    soil: "Loamy",
    water: "Low",
    sunlight: "High",
    season: "Winter",
    description:
      "Wheat is a staple cereal grown in cooler seasons with moderate rainfall.",
  },
  {
    id: 4,
    name: "Potato",
    category: "Vegetable",
    soil: "Sandy",
    water: "Moderate",
    sunlight: "High",
    season: "Winter",
    description:
      "Potato thrives in well-drained sandy loam soil in cool weather.",
  },
  {
    id: 5,
    name: "Mango",
    category: "Fruit",
    soil: "Loamy",
    water: "Low",
    sunlight: "High",
    season: "Summer",
    description:
      "Mango is a tropical fruit tree that prefers dry weather before flowering.",
  },
  {
    id: 6,
    name: "Chickpea",
    category: "Pulse",
    soil: "Sandy",
    water: "Low",
    sunlight: "Moderate",
    season: "Winter",
    description:
      "Chickpea is a drought-tolerant pulse crop grown in the dry season.",
  },
  {
    id: 7,
    name: "Cabbage",
    category: "Vegetable",
    soil: "Loamy",
    water: "Moderate",
    sunlight: "Moderate",
    season: "Winter",
    description:
      "Cabbage grows best in cool weather with rich, well-drained soil.",
  },
  {
    id: 8,
    name: "Sugarcane",
    category: "Cereal",
    soil: "Clay",
    water: "High",
    sunlight: "High",
    season: "Summer",
    description:
      "Sugarcane is a tall tropical grass requiring plenty of water and sunlight.",
  },
  {
    id: 9,
    name: "Watermelon",
    category: "Fruit",
    soil: "Sandy",
    water: "Moderate",
    sunlight: "High",
    season: "Summer",
    description: "Watermelon grows well in sandy soil with warm temperatures.",
  },
  {
    id: 10,
    name: "Lentil",
    category: "Pulse",
    soil: "Silty",
    water: "Low",
    sunlight: "Moderate",
    season: "Winter",
    description:
      "Lentil is a nutrient-rich pulse that grows well in cool, dry conditions.",
  },
  {
    id: 11,
    name: "Chili",
    category: "Vegetable",
    soil: "Loamy",
    water: "Moderate",
    sunlight: "High",
    season: "Monsoon",
    description:
      "Chili peppers grow well in warm climates with moderate watering.",
  },
  {
    id: 12,
    name: "Banana",
    category: "Fruit",
    soil: "Silty",
    water: "High",
    sunlight: "High",
    season: "Monsoon",
    description:
      "Banana requires humid conditions and consistent moisture to thrive.",
  },
];

// DOM references
const cropResults = document.getElementById("cropResults");
const soilResults = document.getElementById("soilResults");
const waterResults = document.getElementById("waterResults");
const seasonResults = document.getElementById("seasonResults");
const searchInput = document.getElementById("cropSearchInput");
const searchBtn = document.getElementById("searchBtn");

// Load crops via AJAX (fetch); fall back to embedded data on failure
function loadCrops() {
  fetch("data/crops.json")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      allCrops = data;
      renderCrops(allCrops, cropResults);
    })
    .catch(() => {
      // Likely running from file:// with no server — use backup data
      allCrops = fallbackCrops;
      renderCrops(allCrops, cropResults);
    });
}

function createCropCard(crop) {
  const card = document.createElement("div");
  card.className = "crop-card";
  card.innerHTML = `
    <div class="crop-img-wrap">
      <img src="${crop.image}" alt="${crop.name}" class="crop-img"
           onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'crop-img-fallback',textContent:'${getCropEmoji(crop.category)}'}))">
    </div>
    <h3>${getCropEmoji(crop.category)} ${crop.name}</h3>
    <table>
      <tr><td>Category:</td><td>${crop.category}</td></tr>
      <tr><td>Soil:</td><td>${crop.soil}</td></tr>
      <tr><td>Water:</td><td>${crop.water}</td></tr>
      <tr><td>Sunlight:</td><td>${crop.sunlight}</td></tr>
      <tr><td>Season:</td><td>${crop.season}</td></tr>
    </table>
    <p style="margin-top:0.6rem; font-size:0.85rem; color:#607d8b;">${crop.description}</p>
  `;
  return card;
}

function getCropEmoji(category) {
  const map = { Cereal: "🌾", Vegetable: "🥬", Fruit: "🍎", Pulse: "🌱" };
  return map[category] || "🌿";
}

function renderCrops(cropArray, container) {
  container.innerHTML = "";
  if (cropArray.length === 0) {
    container.innerHTML = '<p class="no-results">No crops found.</p>';
    return;
  }
  cropArray.forEach((crop) => container.appendChild(createCropCard(crop)));
}

function searchCrops() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = allCrops.filter((crop) =>
    crop.name.toLowerCase().includes(term),
  );
  document.getElementById("crops").scrollIntoView({ behavior: "smooth" });
  renderCrops(filtered, cropResults);
}

searchBtn.addEventListener("click", searchCrops);
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchCrops();
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    const filtered =
      filter === "All"
        ? allCrops
        : allCrops.filter((c) => c.category === filter);
    renderCrops(filtered, cropResults);
  });
});

document.querySelectorAll(".soil-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const filtered = allCrops.filter((c) => c.soil === btn.dataset.soil);
    renderCrops(filtered, soilResults);
  });
});

document.querySelectorAll(".water-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const filtered = allCrops.filter((c) => c.water === btn.dataset.water);
    renderCrops(filtered, waterResults);
  });
});

document.querySelectorAll(".season-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const filtered = allCrops.filter((c) => c.season === btn.dataset.season);
    renderCrops(filtered, seasonResults);
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", loadCrops);
