const productInventory = [
  {
    id: 1,
    name: "Fujifilm X-Pro Mirrorless Kit",
    price: 1299,
    category: "Electronics",
    images: "./images/alexander-andrews-BX4Q0gojWAs-unsplash.png",
  },
  {
    id: 2,
    name: "Polaroid OneStep 2 I-Type Camera",
    price: 119,
    category: "Electronics",
    images: "./images/eniko-kis-KsLPTsYaqIQ-unsplash.png",
  },
  {
    id: 3,
    name: "Act+Acre Restorative Hair Mask",
    price: 48,
    category: "Beauty",
    images: "./images/glenna-haug-DuNXXPScbJM-unsplash.png",
  },
  {
    id: 4,
    name: "Nike Air Force 1 x Carhartt WIP",
    price: 185,
    category: "Footwear",
    images: "./images/maksim-larin-NOpsC3nWTzY-unsplash.png",
  },
  {
    id: 5,
    name: "Carbon Road Bike — Stealth Edition",
    price: 3800,
    category: "Sports",
    images: "./images/mikkel-bech-yjAFnkLtKY0-unsplash.png",
  },
  {
    id: 6,
    name: "Axe Black 48H Body Spray",
    price: 9,
    category: "Beauty",
    images: "./images/mojtaba-mosayebzadeh-aiEkOM732Uo-unsplash.png",
  },
  {
    id: 7,
    name: "Luxury Cosmetic Cream Jar",
    price: 64,
    category: "Beauty",
    images: "./images/pmv-chamara-x7rsBKIyzvs-unsplash.png",
  },
  {
    id: 8,
    name: "Wireless Earbuds with Carry Case",
    price: 149,
    category: "Electronics",
    images: "./images/pods.png",
  },
  {
    id: 9,
    name: "Minimalist Smart Watch",
    price: 229,
    category: "Wearables",
    images: "./images/rachit-tank-2cFZ_FB08UM-unsplash.png",
  },
];

const displayContainer = document.getElementById("display-container");
const statsPanel = document.getElementById("stats-panel");


function attachTilt(card) {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2); // -1 → 1
    const dy = (e.clientY - cy) / (rect.height / 2); // -1 → 1
    const rotX = -dy * 6; // max 6 deg
    const rotY = dx * 6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
    card.style.transition = "transform 0.08s linear";

    // Subtle highlight that tracks the cursor
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--shine-x", `${px}%`);
    card.style.setProperty("--shine-y", `${py}%`);
    card.classList.add("shining");
  });

  card.addEventListener("mouseleave", () => {
    // Spring back with a slight overshoot feel via cubic-bezier
    card.style.transition = "transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)";
    card.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    card.classList.remove("shining");
  });

  // Press down on click
  card.addEventListener("mousedown", () => {
    card.style.transition = "transform 0.1s ease";
    card.style.transform = "perspective(800px) scale(0.97)";
  });
  card.addEventListener("mouseup", () => {
    card.style.transition = "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)";
    card.style.transform = "perspective(800px) scale(1.03)";
  });
}

//  Inject shine + card base styles once
const styleTag = document.createElement("style");
styleTag.textContent = `
  .product-card {
    position: relative;
    will-change: transform;
    transform-style: preserve-3d;
    cursor: pointer;
  }
  .product-card::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      circle at var(--shine-x, 50%) var(--shine-y, 50%),
      rgba(255,255,255,0.18) 0%,
      transparent 60%
    );
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    z-index: 2;
  }
  .product-card.shining::after { opacity: 1; }

  /* Staggered entrance */
  @keyframes cardEntrance {
    from {
      opacity: 0;
      transform: translateY(28px) scale(0.95);
      filter: blur(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0px);
    }
  }
  .card-entering {
    animation: cardEntrance 0.5s cubic-bezier(0.23, 1, 0.32, 1) both;
  }

  /* Image zoom */
  .card-img-wrap { overflow: hidden; }
  .card-img-wrap img {
    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .product-card:hover .card-img-wrap img {
    transform: scale(1.08);
  }

  /* Add button spring */
  .add-btn {
    transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
                background-color 0.2s ease;
  }
  .add-btn:hover  { transform: scale(1.08); }
  .add-btn:active { transform: scale(0.92); }
`;
document.head.appendChild(styleTag);

//Category badge colours
const badgeColors = {
  Electronics: "bg-blue-100 text-blue-700",
  Beauty: "bg-pink-100 text-pink-700",
  Footwear: "bg-amber-100 text-amber-700",
  Sports: "bg-green-100 text-green-700",
  Wearables: "bg-purple-100 text-purple-700",
};

// Render
const renderUI = (items) => {
  displayContainer.innerHTML = "";

  const htmlCards = items
    .map((item) => {
      const badge = badgeColors[item.category] || "bg-slate-100 text-slate-600";
      return `
      <div class="product-card bg-white text-gray-800 rounded-2xl shadow-md overflow-hidden flex flex-col">
        <div class="card-img-wrap relative h-56 bg-slate-100">
          <img
            src="${item.images}"
            alt="${item.name}"
            class="w-full h-full object-cover"
          />
          <span class="absolute top-3 left-3 ${badge} text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            ${item.category}
          </span>
        </div>

        <div class="flex flex-col flex-1 p-5 gap-3">
          <h2 class="text-base font-semibold text-gray-900 leading-snug">${item.name}</h2>

          <div class="flex items-center justify-between mt-auto">
            <div>
              <p class="text-2xl font-bold text-gray-900">$${item.price.toFixed(2)}</p>
              <p class="text-xs text-gray-400">Free shipping</p>
            </div>

            <button
              class="add-btn px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-full"
              onclick="
                this.textContent = '✓ Added';
                this.style.backgroundColor = '#16a34a';
                setTimeout(() => {
                  this.textContent = 'Add';
                  this.style.backgroundColor = '';
                }, 1500);
              "
            >
              Add
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  displayContainer.innerHTML = htmlCards;

  // Attach tilt + staggered entrance to each card
  displayContainer.querySelectorAll(".product-card").forEach((card, i) => {
    card.style.animationDelay = `${i * 60}ms`;
    card.classList.add("card-entering");
    attachTilt(card);
  });

  console.clear();
  console.log(
    "%c--- CURRENTLY DISPLAYED ---",
    "color:#3b82f6;font-weight:bold",
  );
  items.forEach((item) => {
    console.log(`ID: ${item.id} | ${item.name} — $${item.price}`);
  });
};

// Metrics 
const calculateMetrics = () => {
  const totalValue = productInventory.reduce(
    (acc, item) => acc + item.price,
    0,
  );
  const flagshipItem = productInventory.reduce(
    (h, i) => (i.price > h.price ? i : h),
    productInventory[0],
  );

  statsPanel.innerHTML = `
    Total Inventory: <strong>$${totalValue.toLocaleString()}</strong> &nbsp;·&nbsp;
    Flagship: <strong>${flagshipItem.name} ($${flagshipItem.price.toLocaleString()})</strong>
  `;
};

// Filters 
const ACTIVE =
  "flex-shrink-0 px-4 py-2 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap filter-btn ripple-btn";
const INACTIVE =
  "flex-shrink-0 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap filter-btn ripple-btn";

const setActiveFilter = (activeId) => {
  ["btn-all", "btn-high", "btn-electronics", "btn-beauty"].forEach((id) => {
    document.getElementById(id).className = id === activeId ? ACTIVE : INACTIVE;
  });
};

document.getElementById("btn-all").addEventListener("click", () => {
  setActiveFilter("btn-all");
  renderUI(productInventory);
});
document.getElementById("btn-high").addEventListener("click", () => {
  setActiveFilter("btn-high");
  renderUI(productInventory.filter((i) => i.price > 500));
});
document.getElementById("btn-electronics").addEventListener("click", () => {
  setActiveFilter("btn-electronics");
  renderUI(productInventory.filter((i) => i.category === "Electronics"));
});
document.getElementById("btn-beauty").addEventListener("click", () => {
  setActiveFilter("btn-beauty");
  renderUI(productInventory.filter((i) => i.category === "Beauty"));
});

// Ripple on filter buttons
document.querySelectorAll(".ripple-btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    const rect = this.getBoundingClientRect();
    ripple.style.left = e.clientX - rect.left + "px";
    ripple.style.top = e.clientY - rect.top + "px";
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

//  Init 
const startApp = () => {
  renderUI(productInventory);
  calculateMetrics();
};

startApp();
