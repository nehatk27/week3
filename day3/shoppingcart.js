class Cart {
  constructor(items = [], coupon = null) {
    this.items = items;
    this.coupon = coupon;
  }

  addItem(newItem) {
    const existingItem = this.items.find((item) => item.id === newItem.id);
    let newItems;

    if (existingItem) {
      newItems = this.items.map((item) =>
        item.id === newItem.id
          ? { ...item, quantity: item.quantity + newItem.quantity }
          : item,
      );
    } else {
      newItems = [...this.items, newItem];
    }
    return new Cart(newItems, this.coupon);
  }

  removeItem(id) {
    const newArrayAfterRemoval = this.items.filter((item) => item.id !== id);
    return new Cart(newArrayAfterRemoval, this.coupon);
  }

  updateQuantity(id, newQuantity) {
    const quantityUpdatedArray = this.items.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item,
    );
    return new Cart(quantityUpdatedArray, this.coupon);
  }

  applyCoupon(coupon) {
    return new Cart(this.items, coupon);
  }

  getTotal() {
    const totalAmt = this.items.reduce((accumulator, item) => {
      return accumulator + item.price * item.quantity;
    }, 0);
    if (this.coupon) {
      return totalAmt * (1 - this.coupon);
    }
    return totalAmt;
  }
}

// State Management with Observer Pattern, LocalStorage, and Undo History
class CartStore {
  constructor() {
    this.historyStack = [];
    this.observers = [];

    const savedCartData = localStorage.getItem("shopping_cart");
    if (savedCartData) {
      try {
        const parsedData = JSON.parse(savedCartData);
        this.currentCart = new Cart(parsedData.items, parsedData.coupon);
      } catch (e) {
        console.error("Error parsing saved cart, resetting...", e);
        this.currentCart = new Cart();
      }
    } else {
      this.currentCart = new Cart();
    }
  }

  addObserver(fn) {
    this.observers.push(fn);
  }

  notifyObservers() {
    this.observers.forEach((observer) => {
      observer(this.currentCart);
    });
  }

  saveToHistory() {
    this.historyStack.push(this.currentCart);
  }

  undo() {
    if (this.historyStack.length === 0) {
      alert("No actions left to undo!");
      return;
    }
    this.currentCart = this.historyStack.pop(); // Pop the last state and assign it as current
    this.notifyObservers();
  }

  addItem(newItem) {
    this.saveToHistory();
    this.currentCart = this.currentCart.addItem(newItem);
    this.notifyObservers();
  }

  removeItem(id) {
    this.saveToHistory();
    this.currentCart = this.currentCart.removeItem(id);
    this.notifyObservers();
  }

  updateQuantity(id, newQty) {
    this.saveToHistory();
    this.currentCart = this.currentCart.updateQuantity(id, newQty);
    this.notifyObservers();
  }

  applyCoupon(coupon) {
    this.saveToHistory();
    this.currentCart = this.currentCart.applyCoupon(coupon);
    this.notifyObservers();
  }
}

const store = new CartStore();

function renderCart(cart) {
  const container = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("card-total");

  if (!container || !totalDisplay) return;
  container.innerHTML = "";

  if (cart.items.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalDisplay.textContent = "0.00";
    return;
  }

  cart.items.forEach((item) => {
    const itemRow = document.createElement("div");
    itemRow.className = "cart-row";
    itemRow.innerHTML = `
      <span>${item.name} - Rs.${item.price}</span>
      <div>
        <input type="number" value="${item.quantity}" min="1" onchange="handleQuantityChange(${item.id}, this.value)">
        <button onclick="handleRemoveItem(${item.id})">Remove</button>
      </div>
    `;
    container.appendChild(itemRow);
  });

  totalDisplay.textContent = cart.getTotal().toFixed(2);
}

function saveToLocalStorage(cart) {
  localStorage.setItem(
    "shopping_cart",
    JSON.stringify({
      items: cart.items,
      coupon: cart.coupon,
    }),
  );
}

store.addObserver(renderCart);
store.addObserver(saveToLocalStorage);

renderCart(store.currentCart);

function handleAddItem(id, name, price) {
  store.addItem({ id, name, price, quantity: 1 });
}

function handleRemoveItem(id) {
  store.removeItem(id);
}

function handleQuantityChange(id, value) {
  const cleanQuantity = parseInt(value, 10);
  if (!isNaN(cleanQuantity) && cleanQuantity > 0) {
    store.updateQuantity(id, cleanQuantity);
  }
}

function handleApplyCoupon(discountValue) {
  const discountNum = parseFloat(discountValue);
  if (!isNaN(discountNum) && discountNum >= 0 && discountNum <= 1) {
    store.applyCoupon(discountNum);
  } else {
    alert("Please enter a valid coupon float value (e.g. 0.10 for 10%)");
  }
}

function handleUndo() {
  store.undo();
}
