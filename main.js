import { renderProductsCards } from './modules/productCards.js'

document.addEventListener('DOMContentLoaded', () => {
  const cartItemCount = document.querySelector('.cart-count')
  const cartItemList = document.querySelector('.cart-items')
  const cartTotal = document.querySelector('.cart-total')
  const cartIcon = document.querySelector('.cart-container')
  const sidebar = document.getElementById('sidebar')
  const productContainer = document.querySelector('.js-products-list')

  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || []
  let totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0

  function saveCartToLocalStorage () {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
    localStorage.setItem('totalAmount', totalAmount.toFixed(2))
  }

  function updateCartUI () {
    updateCartItemCount(cartItems.reduce((acc, item) => acc + item.quantity, 0))
    updateCartItems()
    updateCartTotal()
    saveCartToLocalStorage()
  }

  function updateCartItemCount (count) {
    cartItemCount.textContent = count
  }
  ;/!FILTER!/
  const filterButtons = document.querySelectorAll('.filter-btn')

  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', event => {
      const filter = event.target.getAttribute('data-f')
      filterProducts(filter)
    })
  })

  function filterProducts (filter) {
    fetch('../products.json')
      .then(res => res.json())
      .then(products => {
        let filteredProducts =
          filter === 'All'
            ? products
            : products.filter(product => product.series === filter)

        const productContainer = document.querySelector('.js-products-list')
        productContainer.innerHTML = ''

        renderProductsCards(filteredProducts, productContainer)

        attachAddToCartListeners(filteredProducts)
      })
      .catch(error => console.error('Ошибка загрузки данных:', error))
  }
  ;/!inputSearch filter!/
  inputSearch.addEventListener('input', () => {
    const searchValue = inputSearch.value.toLowerCase()
    fetch('../products.json')
      .then(res => res.json())
      .then(products => {
        const searchedProducts = products.filter(product =>
          product.name.toLowerCase().includes(searchValue)
        )
        productContainer.innerHTML = ''
        renderProductsCards(searchedProducts, productContainer)
        attachAddToCartListeners(searchedProducts)
      })
      .catch(error => console.error('Ошибка загрузки данных:', error))
  })
  ;/! input range !/

  function updateCartItems () {
    cartItemList.innerHTML = ''
    cartItems.forEach((item, index) => {
      const cartItem = document.createElement('div')
      cartItem.classList.add('cart-item', 'individual-cart-item')
      cartItem.innerHTML = `
      <span class="cart-item-name">${item.name}</span>
      <img src="${item.image}" alt="${
        item.name
      }" style="width: 200px; height: 200px; object-fit: cover;" class="cart-item-img" />
      <div class='cart-controls'>
        <button class="decrease-btn" data-index="${index}">-</button>
        <span>${item.quantity}</span>
        <button class="increase-btn" data-index="${index}">+</button>
      </div>
      <span class='cart-item-price'>$${(item.price * item.quantity).toFixed(
        2
      )}</span>
      <button class="remove-btn" data-index="${index}">
        <i class="fa-solid fa-times"></i>
      </button>`

      cartItemList.append(cartItem)
    })

    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', event => {
        const index = event.target.closest('.remove-btn').dataset.index
        removeItemsFromCart(index)
      })
    })

    document.querySelectorAll('.increase-btn').forEach(button => {
      button.addEventListener('click', event => {
        const index = event.target.dataset.index
        cartItems[index].quantity++
        totalAmount += cartItems[index].price
        updateCartUI()
      })
    })

    document.querySelectorAll('.decrease-btn').forEach(button => {
      button.addEventListener('click', event => {
        const index = event.target.dataset.index
        if (cartItems[index].quantity > 1) {
          cartItems[index].quantity--
          totalAmount -= cartItems[index].price
        } else {
          removeItemsFromCart(index)
        }
        updateCartUI()
      })
    })
  }

  function removeItemsFromCart (index) {
    const removedItem = cartItems.splice(index, 1)[0]
    totalAmount -= removedItem.price * removedItem.quantity
    updateCartUI()
  }

  function updateCartTotal () {
    cartTotal.textContent = `$${totalAmount.toFixed(2)}`
  }

  cartIcon.addEventListener('click', () => {
    sidebar.classList.toggle('open')
  })

  document.querySelector('.sidebar-close').addEventListener('click', () => {
    sidebar.classList.remove('open')
  })

  //TODO
  fetch('../products.json')
    .then(res => res.json())
    .then(products => {
      renderProductsCards(products, productContainer)
      attachAddToCartListeners(products)
    })
    .catch(error => console.error('Ошибка загрузки данных:', error))

  function attachAddToCartListeners (products) {
    document.querySelectorAll('.add-to-cart').forEach((button, index) => {
      button.addEventListener('click', () => {
        const product = products[index]
        const price =
          parseFloat(product.prices[0].replace(/\$/g, '').replace(/\s/g, '')) ||
          0
        const image = Array.isArray(product.image)
          ? product.image[0]
          : product.image

        const item = {
          name: product.name,
          price: price,
          image: image,
          quantity: 1
        }

        const existingItem = cartItems.find(
          cartItem => cartItem.name === item.name
        )
        if (existingItem) {
          existingItem.quantity++
        } else {
          cartItems.push(item)
        }

        totalAmount += item.price
        updateCartUI()
      })
    })
  }

  updateCartUI()
})
