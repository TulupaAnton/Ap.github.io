const renderProductCard = product => {
  const li = document.createElement('li')
  li.classList.add('product', 'item', 'column', 'aic', 'js-products')
  li.innerHTML = `
<div data-id=''>
    <div class="btn-cont">
      <img src="${product.image}" alt="car1" />
      <button class="btn-cart add-to-cart" data-name="Jeep">
        <i class="fa-solid fa-plus"></i>Add
      </button>
    </div>
    <div class="info">
      <h3>${product.name}</h3>
      <p>${product.prices[0]}</p>
      <div>
        <i class="fa-solid fa-star" style="color: #ffd43b"></i>
        <i class="fa-solid fa-star" style="color: #ffd43b"></i>
        <i class="fa-solid fa-star" style="color: #ffd43b"></i>
        <i class="fa-solid fa-star" style="color: #ffd43b"></i>
        <i class="fa-solid fa-star" style="color: #ffd43b"></i>
      </div>
      <span>${product.series}</span>
    </div>
    </div>
    
  `
  return li
}

const appendProductCard = (product, container) => {
  container.append(product)
}
const renderProductsCards = (products, container) => {
  products.forEach(product => {
    const card = renderProductCard(product)
    appendProductCard(card, container)
  })
}

export { renderProductsCards }
