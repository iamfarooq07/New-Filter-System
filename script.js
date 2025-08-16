const products = [
  { id: 1, image: "./images/products/burger.png", title: "Burger1", description: "Enjoy the crispy chiken fillet in a soft bun with spicy mayo and our signature sauce", price: 100, category: "Burger", rating: 5 },
  { id: 2, image: "./images/products/shawarma.jpg", title: "Shawarma1", description: "Aromatic arabian rice with 6 pacs of hot shots with KFC famous vietnamese sauce", price: 200, category: "Shawarma", rating: 4 },
  { id: 3, image: "./images/products/piz.jpg", title: "Pizza1", description: "Crispy zinger with crispy rolled into paratha", price: 300, category: "Pizza", rating: 3 },
  { id: 4, image: "./images/products/burger.png", title: "Burger2", description: "Enjoy the crispy chiken fillet in a soft bun with spicy mayo and our signature sauce", price: 400, category: "Burger", rating: 2 },
  { id: 5, image: "./images/products/shawarma.jpg", title: "Shawarma2", description: "Aromatic arabian rice with 6 pacs of hot shots with KFC famous vietnamese sauce", price: 500, category: "Shawarma", rating: 1 },
  { id: 6, image: "./images/products/piz.jpg", title: "Pizza2", description: "Crispy zinger with crispy rolled into paratha", price: 600, category: "Pizza", rating: 5 },
  { id: 7, image: "./images/products/burger.png", title: "Burger3", description: "Enjoy the crispy chiken fillet in a soft bun with spicy mayo and our signature sauce", price: 700, category: "Burger", rating: 4 },
  { id: 8, image: "./images/products/shawarma.jpg", title: "Shawarma3", description: "Aromatic arabian rice with 6 pacs of hot shots with KFC famous vietnamese sauce", price: 800, category: "Shawarma", rating: 3 },
  { id: 9, image: "./images/products/piz.jpg", title: "Pizza3", description: "Crispy zinger with crispy rolled into paratha", price: 900, category: "Pizza", rating: 2 },
  { id: 10, image: "./images/products/piz.jpg", title: "Pizza3", description: "Crispy zinger with crispy rolled into paratha", price: 900, category: "Pizza", rating: 2 },
  { id: 11, image: "./images/products/piz.jpg", title: "Pizza3", description: "Crispy zinger with crispy rolled into paratha", price: 900, category: "Pizza", rating: 2 },
  { id: 12, image: "./images/products/piz.jpg", title: "Pizza3", description: "Crispy zinger with crispy rolled into paratha", price: 900, category: "Pizza", rating: 2 },
];

const categories = [{ id: 1, title: "Burger", image: "" },
{ id: 2, title: "Shawarma", image: "" },
{ id: 3, title: "Pizza", image: "" }];

const categoryTitles = categories.map(c => c.title);

let selectedCategory = [];
let selectedSort = "";
let selectedRating = "";
let searchQuery = "";
let currentPage = 1;
let pageSize = 6;

// ===== State =====
const findRange = () => {
  let min = products[0].price;
  let max = products[0].price;

  products.forEach(p => {
    if (p.price < min) min = p.price;
    if (p.price > max) max = p.price;
  });

  return { min, max };

};
const priceRange = findRange();

const initPriceRange = {
  min: priceRange.min,
  max: priceRange.max,
};

let selectedPrice = {
  min: priceRange.min,
  max: priceRange.max,
  isApplied: false
};

// ===== Elements =====
const categoryFilterEl = document.getElementById("categoryFilter");
const ratingFilterEl = document.getElementById("ratingFilter");
const productsGridEl = document.getElementById("productsGrid");
const priceFilterEl = document.getElementById("priceFilter");
const resultsInfoEl = document.getElementById("resultsInfo");
const paginationEl = document.getElementById("pagination");
const clearAllBtn = document.getElementById("clearAllBtn");
const pageSizeSelect = document.getElementById("pageSize");
const chipContainer = document.getElementById("chipContainer");
const colorThemes = document.getElementById("themes");
// ===== Color Themes =====

let theme = 0;

colorThemes.addEventListener("click", function () {
  if (theme == 0) {
    document.body.style.backgroundColor = "#fff";
    theme = 1;
  } else {
    document.body.style.backgroundColor = "#1B1B1B";
    theme = 0;
  }
})

// ===========================
// ===== Filtering =====
const getFiltered = () => {
  return products.filter(product => {
    let categoryMatch = true;
    if (selectedCategory.length && product.category) {
      categoryMatch = selectedCategory.includes(product.category);
    }

    let priceMatch = true;
    if (selectedPrice.isApplied) {
      priceMatch = product.price >= selectedPrice.min && product.price <= selectedPrice.max;
    }

    let ratingMatch = true;
    if (selectedRating) {
      ratingMatch = product.rating >= selectedRating;
    }

    let searchMatch = true;
    if (searchQuery) {
      searchMatch = product.title.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery);
    }

    return categoryMatch && priceMatch && ratingMatch && searchMatch;
  });
};


// ===== UI Helpers =====
const formatCurrency = (n) => `Rs ${n}`;

const setRangeFill = (input) => {
  const min = Number(input.min);
  const max = Number(input.max);
  const val = Number(input.value);
  const percent = ((val - min) / (max - min)) * 100;
  input.style.background = `linear-gradient(90deg, #0ea5e9 ${percent}%, #e5e7eb ${percent}%)`;
};

// ===== Event Handlers =====
window.onChangeCategory = (category, checked) => {
  if (checked) {
    if (!selectedCategory.includes(category)) {
      selectedCategory.push(category);
    }
  } else {
    selectedCategory = selectedCategory.filter(c => c !== category);
  }

  chipContainer.innerHTML = selectedCategory
    .map(cat => `
      <button onclick="removeChip('${cat}')" 
              class="flex items-center gap-1 bg-gray-600 px-3 py-3 rounded-md text-sm">
        ${cat} <i class="fa-solid fa-xmark text-black"></i>
      </button>
    `)
    .join('');

  currentPage = 1;
  render();
};


window.removeChip = (cat) => {
  selectedCategory = selectedCategory.filter(c => c !== cat);

  const checkbox = document.querySelector(`input[type="checkbox"][value="${cat}"]`);
  if (checkbox) checkbox.checked = false;

  chipContainer.innerHTML = selectedCategory
    .map(c => `
      <button onclick="removeChip('${c}')" 
              class="flex items-center gap-1 bg-gray-600 px-3 py-3 rounded-md text-sm">
        ${c} <i class="fa-solid fa-xmark text-black"></i>
      </button>
    `)
    .join('');

  render();
};


window.onChangePrice = (value) => {
  const v = Number(value);
  selectedPrice.max = v;
  selectedPrice.isApplied = true;
  currentPage = 1;
  renderPriceFilter(false);
  renderMain();
};

const clearAll = () => {
  selectedCategory = [];
  selectedPrice = {
    min: initPriceRange.min,
    max: initPriceRange.max,
    isApplied: false
  };
  currentPage = 1;
  render();
};

const changePage = (page) => {
  currentPage = page;
  renderMain();
};

// ===== Render Pieces =====
const renderCategoryFilter = () => {
  categoryFilterEl.innerHTML = categoryTitles.map(category => `
          <label class="inline-flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" class="w-4 h-4 rounded cursor-pointer" ${selectedCategory.includes(category) ? 'checked' : ''} onchange="onChangeCategory('${category}', this.checked)" />
            <span>${category}</span>
          </label>
        `).join('');
};

const renderPriceFilter = (rebuild = true) => {
  if (rebuild) {
    priceFilterEl.innerHTML = `
            <input type="range" name="price" id="priceRange" min="${initPriceRange.min}" max="${initPriceRange.max}" value="${selectedPrice.max}" class="w-full" oninput="onChangePrice(this.value)" />
            <div class="flex justify-between text-sm text-neutral-300">
        
            </div>
          `;
  } else {
    const currentPrice = document.getElementById('currentPrice');
    if (currentPrice) currentPrice.textContent = formatCurrency(selectedPrice.max);
  }
  // update fill
  const range = document.getElementById('priceRange');
  if (range) setRangeFill(range);
};
// ****************

const renderProducts = (items) => {
  productsGridEl.innerHTML = items.map(product => `
          <div class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
            <div class="rounded-2xl shadow-lg bg-[#1B1B1B] overflow-hidden border border-neutral-800">
              <img src="${product.image}" alt="${product.title}" class="object-cover w-full h-[200px] md:h-[220px]"/>
              <div class="p-4 space-y-2">
                <h3 class="font-medium text-xl">${product.title}</h3>
                <div class="flex items-center gap-2">
                  <div class="flex">
                    ${Array(5).fill().map((_, i) => `
                      <svg aria-hidden="true" class="w-4 h-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-500'}" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    `).join('')}
                  </div>
                  <span class="text-sm text-neutral-400">(${product.rating})</span>
                </div>
                <p class="text-sm text-neutral-300 line-clamp-3">${product.description}</p>
                <div class="flex items-center justify-between pt-2">
                  <span class="text-lg">${formatCurrency(product.price)}</span>
                  <button class="hover:text-gray-300" title="Add to cart">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join('');
};

const renderResultsInfo = (total, start, end) => {
  resultsInfoEl.textContent = `${total} results • Showing ${start}-${end}`;
};



const renderPagination = (totalItems) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  currentPage = Math.min(currentPage, totalPages);
  const btn = (label, page, disabled = false, active = false) => `
          <button ${disabled ? 'disabled' : ''} onclick="changePage(${page})" class="px-3 py-1 rounded-md border ${active ? 'bg-sky-600 border-sky-500' : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700'} disabled:opacity-50">${label}</button>
        `;

  const windowSize = 5;
  let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  let end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  let numbers = '';
  for (let p = start; p <= end; p++) {
    numbers += btn(p, p, false, p === currentPage);
  }

  paginationEl.innerHTML = [
    btn('Prev', Math.max(1, currentPage - 1), currentPage === 1),
    numbers,
    btn('Next', Math.min(totalPages, currentPage + 1), currentPage === totalPages)
  ].join('');
};

// ===== Combined renders =====
const sortProducts = (items) => {
  if (selectedSort === "ratingHightToLow") {
    return items.sort((a, b) => b.rating - a.rating);
  } else if (selectedSort === "ratingLowToHight") {
    return items.sort((a, b) => a.rating - b.rating);
  } else if (selectedSort === "PriceHightToLow") {
    return items.sort((a, b) => b.price - a.price);
  } else if (selectedSort === "PriceLowToHight") {
    return items.sort((a, b) => a.price - b.price);
  } else {
    return items;
  }

};
const renderMain = () => {
  let filtered = getFiltered();

  filtered = sortProducts(filtered);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  currentPage = Math.min(currentPage, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageItems = filtered.slice(startIndex, endIndex);

  renderProducts(pageItems);
  renderResultsInfo(total, total ? startIndex + 1 : 0, endIndex);
  renderPagination(total);
};
document.getElementById("sortingSelect").addEventListener("change", (e) => {
  selectedSort = e.target.value;
  currentPage = 1;
  renderMain();
});
// Rating filter
const onChangeRatingHandler = (rating) => {
  console.log(rating);
  selectedRating = rating;
  console.log("selectedRating", selectedRating);

  renderRatingFilter();
  // renderProducts();
  renderMain();
};
const renderRatingFilter = () => {
  console.log("selectedRating --> ", selectedRating);
  ratingFilterEl.innerHTML = [5, 4, 3, 2, 1]
    .map(
      (rating) => `
        <div class="flex items-center gap-2 cursor-pointer" onclick="onChangeRatingHandler(${rating})">
            <div class="flex justify-start">
                ${Array(5)
          .fill()
          .map(
            (_, i) => `
                    <svg
                        aria-hidden="true"
                        class="w-5 h-5 ${i < rating
                ? "text-yellow-400"
                : "text-gray-300 dark:text-gray-500"
              } ${rating == selectedRating ? "!text-[#ff3d47]" : ""}"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                `
          )
          .join("")}
            </div>
            <p class="text-gray-400">
                ${rating === 5 ? 5.0 : rating.toFixed(1) + " +"}
            </p>
        </div>
    `
    )
    .join("");
};
// search fuvnctionality
const onSearchHandler = (event) => {
  searchQuery = event.target.value.toLowerCase();
  renderMain(); // sab filters + pagination dobara chalega
};


const render = () => {
  renderCategoryFilter();
  renderRatingFilter();
  renderPriceFilter();
  renderMain();
};


// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  render();
  clearAllBtn.addEventListener('click', clearAll);
  pageSizeSelect.addEventListener('change', (e) => { pageSize = Number(e.target.value); currentPage = 1; renderMain(); });
});