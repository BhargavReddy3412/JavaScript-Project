// const url ="https://fake-3nts.onrender.com/products";
const url="http://localhost:3000/products"



let allProducts = [];
let currentProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

// Fetch and display products
async function getdata() {
  try {
    const data = await fetch(url);
    const result = await data.json();
    allProducts = result;
    currentProducts = allProducts;
    displayItems(currentProducts);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
getdata();

function displayItems(products) {
  const productContainer = document.getElementsByClassName("productContainer")[0];
  productContainer.innerHTML = "";
  products.forEach((product, index) => {
    const isFavorited = favourites.some(item => item.id === product.id);
    const favClass = isFavorited ? "fas fa-heart" : "far fa-heart";
    const htmlCard = `
      <div class="product" ondblclick="productDetails('${product.id}')">
        <img src="${product.image}" alt="${product.name}">
        <p>${product.name}</p>
        <p>${product.color}</p>
        <p>Price: ₹${product.price}</p>
        <button onclick="addToCart(${index})" id="CartButton">Add to Cart</button>
        <button  onclick="addToFavourites(${index}, this)">
          <i id="fav_symbol" class="${favClass}"></i>
        </button>
      </div>
    `;
    productContainer.innerHTML += htmlCard;
  });
}

// Add to Cart
function addToCart(index) {
  const product = currentProducts[index];
  cart.push(product);
  updateCartStorage();
  displayCart();
}

function displayCart() {
  const cartItemContainer = document.getElementById("cartItembox");
  const totalPriceElement = document.getElementById("totalPrice");
  if (cart.length === 0) {
    cartItemContainer.innerHTML = "Your Cart is Empty";
    totalPriceElement.textContent = "₹0.00";
  } else {
    cartItemContainer.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <p>${item.name}</p>
        <p>Price: ₹${item.price}</p>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `).join("");
    totalPriceElement.textContent = `₹${cart.reduce((sum, item) => sum + item.price, 0)}`;
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartStorage();
  displayCart();
}

 

function updateCartStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add to Favourites
function addToFavourites(index, button) {
  const product = currentProducts[index];
  const favSymbol = button.querySelector("#fav_symbol");
  const isFavorited = favourites.some(item => item.id === product.id);
  if (isFavorited) {
    favourites = favourites.filter(item => item.id !== product.id);
    favSymbol.className = "far fa-heart";
  } else {
    favourites.push(product);
    favSymbol.className = "fas fa-heart";
  }
  updateFavouritesStorage();
  displayFavourites();
}

function displayFavourites() {
  const FavouriteItemContainer = document.getElementById("FavouriteItembox");
  if (favourites.length === 0) {
    FavouriteItemContainer.innerHTML = "Your favorites are empty";
  } else {
    FavouriteItemContainer.innerHTML = favourites.map(item => `
      <div class="Favourite-item">
        <img src="${item.image}" alt="${item.name}">
        <p>${item.name}</p>
        <p>Price: ₹${item.price}</p>
        <button onclick="removeFromFavourite('${item.id}')">Remove</button>
      </div>
    `).join("");
  }
}

function removeFromFavourite(id) {
  favourites = favourites.filter(item => item.id !== id);
  updateFavouritesStorage();
  displayFavourites();
}

function updateFavouritesStorage() {
  localStorage.setItem("favourites", JSON.stringify(favourites));
}

// Product Details
function productDetails(productId) {
  const product = allProducts.find(item => item.id == productId);
  const productContainer = document.getElementsByClassName("productContainer")[0];
  const productDisplay = document.getElementById("productdisplaydescription");
  productContainer.style.display = "none";
  productDisplay.style.display = "flex";
  productDisplay.innerHTML = `
    <div>
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>${product.details}</p>
      <p>Price: ₹${product.price}</p>
      <button onclick="addToCart(${allProducts.indexOf(product)})">Add to Cart</button>
      <button onclick="goBackToProducts()">Back to Products</button>
    </div>
  `;
}

function goBackToProducts() {
  const productContainer = document.getElementsByClassName("productContainer")[0];
  const productDisplay = document.getElementById("productdisplaydescription");
  productDisplay.style.display = "none";
  productContainer.style.display = "flex";
  displayItems(currentProducts);
}

// Filters and Search
document.getElementById("home").addEventListener("click", () => {
  currentProducts = allProducts;
  displayItems(currentProducts);
});

document.getElementById("Men-product").addEventListener("click", () => {
  currentProducts = allProducts.filter(item => item.category.toLowerCase() === "men");
  displayItems(currentProducts);
});

document.getElementById("Lady-product").addEventListener("click", () => {
  currentProducts = allProducts.filter(item => item.category.toLowerCase() === "women");
  displayItems(currentProducts);
});

document.getElementById("kids-product").addEventListener("click", () => {
  currentProducts = allProducts.filter(item => item.category.toLowerCase() === "kids");
  displayItems(currentProducts);
});

document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.toLowerCase();
  currentProducts = allProducts.filter(item => item.name.toLowerCase().includes(query));
  displayItems(currentProducts);
});

// Panel Toggles
document.querySelector(".favcart").addEventListener("click", () => {
  const cartPanel = document.querySelector(".Cart");
  cartPanel.style.right = cartPanel.style.right === "0px" ? "-780px" : "0px";
  displayCart();
});

document.querySelector(".favhome").addEventListener("click", () => {
  const favPanel = document.querySelector(".Favourite");
  favPanel.style.right = favPanel.style.right === "0px" ? "-780px" : "0px";
  displayFavourites();
});

 