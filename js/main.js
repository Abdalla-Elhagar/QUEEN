const WA = "201129352754";
const INFO = "📍 العنوان هنا · 📞 01129352754 · 🕒 يوميًا 10 ص – 2 ص";
const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/your-page",
  instagram: "https://www.instagram.com/your-page",
};
const U = (i) =>
  `https://images.unsplash.com/photo-${i}?auto=format&fit=crop&w=600&q=70`;
const I = {
  steak: "1544025162-d76694265947",
  burger: "1568901346375-23c9450c58cd",
  pizza: "1565299624946-b28f40a0ae38",
  pasta: "1473093295043-cdd812d0e601",
  salad: "1546069901-ba9599a7e63c",
  fish: "1467003909585-2f8a72700288",
  food: "1504674900247-0877df9cc836",
  coffee: "1495474472287-4d71bcdd2085",
  c2: "1509042239860-f550ce710b93",
  latte: "1541167760496-1628856ab772",
  donut: "1551024601-bec78aea704b",
  cake: "1578985545062-69928b1d9587",
};
let CATEGORIES;
let PRODUCTS;
let PRODUCT_OFFERS;
const $ = (s) => document.querySelector(s),
  P = document.body.dataset.page;
const pageLoader = document.createElement("div");
pageLoader.className = "queen-loader";
pageLoader.setAttribute("role", "status");
pageLoader.setAttribute("aria-label", "جاري تحميل الصفحة");
pageLoader.innerHTML = `<div class="loader-stage" aria-hidden="true"><div class="loader-orbit loader-orbit-one"><span></span></div><div class="loader-orbit loader-orbit-two"><span></span></div><div class="loader-coin"><span class="loader-coin-face loader-coin-front"><b>Q</b><small>QUEEN</small></span><span class="loader-coin-face loader-coin-back"><b>✦</b><small>ROYAL</small></span></div><i class="loader-spark loader-spark-one"></i><i class="loader-spark loader-spark-two"></i><i class="loader-spark loader-spark-three"></i></div><p class="loader-caption">استعد لرحلة ملوكية بين أشهى الأطباق والحلويات</p><div class="loader-track" aria-hidden="true"><span></span></div>`;
document.body.prepend(pageLoader);
document.body.classList.add("is-loading");
let pageLoaderDismissed = false;
const dismissPageLoader = () => {
  if (pageLoaderDismissed) return;
  pageLoaderDismissed = true;
  window.setTimeout(
    () => {
      pageLoader.classList.add("is-hidden");
      window.setTimeout(() => {
        document.body.classList.remove("is-loading");
        pageLoader.remove();
      }, 700);
    },
    Math.max(0, 1200 - performance.now()),
  );
};
if (document.readyState === "complete") dismissPageLoader();
else window.addEventListener("load", dismissPageLoader, { once: true });
window.setTimeout(dismissPageLoader, 3500);
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
const productModal = document.createElement("div");
productModal.className = "product-modal";
productModal.setAttribute("aria-hidden", "true");
productModal.innerHTML = `<div class="product-modal-backdrop" data-product-modal-close></div><section class="product-modal-panel" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" tabindex="-1"><button class="product-modal-close" type="button" data-product-modal-close aria-label="إغلاق">×</button><div class="product-modal-content"><button class="product-modal-image" type="button" aria-label="عرض الصورة بحجم الشاشة"><img alt=""><span>اضغط على الصورة لعرضها بحجم الشاشة</span></button><div class="product-modal-info"><span class="product-modal-category"></span><h2 id="product-modal-title"></h2><p class="product-modal-description"></p><p class="product-modal-old-price" hidden></p><div class="product-modal-variants"></div><strong class="product-modal-price"></strong><div class="product-modal-note-field"><label class="product-modal-note-label" for="product-modal-note">ملاحظات الطلب</label><input class="product-modal-note" id="product-modal-note" placeholder="اكتب أي ملاحظات على المنتج"></div><div class="product-modal-quantity-row"><span>الكمية</span><div class="q"><button type="button" data-modal-action="decrease" aria-label="تقليل الكمية">−</button><b class="product-modal-quantity">1</b><button type="button" data-modal-action="increase" aria-label="زيادة الكمية">+</button></div></div><button class="btn product-modal-add" type="button" data-modal-action="add">أضف للسلة</button></div></div></section>`;
const productLightbox = document.createElement("div");
productLightbox.className = "product-lightbox";
productLightbox.setAttribute("aria-hidden", "true");
productLightbox.innerHTML = `<button class="product-lightbox-close" type="button" aria-label="إغلاق الصورة">×</button><img alt="">`;
productModal.append(productLightbox);
document.body.append(productModal);
let productModalOpener;
let modalProduct;
let modalProductType;
let modalProductPrice;
let modalProductIsOffer = false;
let modalProductSize;
let modalProductOptions = {};
const productHasVariants = (product) =>
  Boolean(
    product &&
      ((Array.isArray(product.sizes) && product.sizes.length) ||
        (Array.isArray(product.options) && product.options.length)),
  );
const updateProductVariantState = () => {
  const product = modalProduct;
  if (!product) return;
  const size = modalProductIsOffer ? undefined : modalProductSize;
  const options = (modalProductIsOffer ? [] : product.options || []).map(
    (option) => ({
      id: option.id,
      label: option.label,
      choice: modalProductOptions[option.id] || "",
    }),
  );
  const missingRequiredOption = (
    modalProductIsOffer ? [] : product.options || []
  ).some((option) => option.required && !modalProductOptions[option.id]);
  modalProductPrice = modalProductIsOffer
    ? Number(productModalOpener.dataset.price)
    : size
      ? size.price
      : product.price;
  productModal.querySelector(".product-modal-price").textContent =
    `${modalProductPrice} ج.م`;
  const addButton = productModal.querySelector(".product-modal-add");
  addButton.disabled = missingRequiredOption;
  const selectionLabels = [
    ...(size
      ? [`${product.sizeLabel || "الحجم"}: ${size.label}`]
      : []),
    ...options
      .filter((option) => option.choice)
      .map((option) => `${option.label}: ${option.choice}`),
  ];
  return {
    price: modalProductPrice,
    variantLabel: modalProductIsOffer ? "" : selectionLabels.join("، "),
    variantKey:
      !modalProductIsOffer && productHasVariants(product)
        ? JSON.stringify({
            size: size ? size.id : "",
            options: options.map(({ id, choice }) => [id, choice]),
          })
        : undefined,
    variantOptions: options.filter((option) => option.choice),
  };
};
const renderProductVariants = (product, showVariants) => {
  const variants = productModal.querySelector(".product-modal-variants");
  if (!showVariants) {
    variants.innerHTML = "";
    modalProductSize = undefined;
    modalProductOptions = {};
    return;
  }
  modalProductSize =
    Array.isArray(product.sizes) && product.sizes.length
      ? product.sizes[0]
      : undefined;
  modalProductOptions = {};
  variants.innerHTML = [
    ...(product.sizes && product.sizes.length
      ? [
          `<fieldset class="product-modal-variant-group"><legend>${escapeHtml(product.sizeLabel || "الحجم")}</legend><div class="product-modal-variant-choices">${product.sizes
            .map(
              (size, index) =>
                `<label><input type="radio" name="product-size" data-product-size="${index}" ${index === 0 ? "checked" : ""}><span>${escapeHtml(size.label)} <small>${size.price} ج.م</small></span></label>`,
            )
            .join("")}</div></fieldset>`,
        ]
      : []),
    ...(product.options || []).map(
      (option, optionIndex) =>
        `<fieldset class="product-modal-variant-group"><legend>${escapeHtml(option.label)}${option.required ? " *" : ""}</legend><div class="product-modal-variant-choices">${(option.choices || [])
          .map(
            (choice, choiceIndex) =>
              `<label><input type="radio" name="product-option-${optionIndex}" data-product-option="${escapeHtml(option.id)}" value="${escapeHtml(choice)}"><span>${escapeHtml(choice)}</span></label>`,
          )
          .join("")}</div></fieldset>`,
    ),
  ].join("");
};
const setProductModalCartState = (inCart) => {
  const noteField = productModal.querySelector(".product-modal-note-field");
  const quantityRow = productModal.querySelector(".product-modal-quantity-row");
  const variants = productModal.querySelector(".product-modal-variants");
  const addButton = productModal.querySelector(".product-modal-add");
  noteField.hidden = modalProductIsOffer || inCart;
  quantityRow.hidden = inCart;
  variants.hidden = inCart;
  addButton.dataset.modalAction = inCart ? "remove" : "add";
  addButton.classList.toggle("remove-btn", inCart);
  addButton.textContent = inCart ? "إزالة من السلة" : "أضف للسلة";
  if (inCart) addButton.disabled = false;
  else updateProductVariantState();
};
const updateMenuCardCartState = (inCart) => {
  if (!productModalOpener || !productModalOpener.closest("#menu")) return;
  const card = productModalOpener;
  const button = card.querySelector(".btn");
  card.classList.toggle("in-cart", inCart);
  button.dataset.a = inCart ? "remove" : "add";
  button.classList.toggle("remove-btn", inCart);
  button.textContent = inCart ? "إزالة من السلة" : "أضف للسلة";
};
const closeProductLightbox = () => {
  productLightbox.classList.remove("is-open");
  productLightbox.setAttribute("aria-hidden", "true");
  productModal
    .querySelector(".product-modal-panel")
    .setAttribute("aria-hidden", "false");
  productModal.querySelector(".product-modal-image").focus();
};
const closeProductModal = () => {
  closeProductLightbox();
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("product-modal-open");
  if (productModalOpener && productModalOpener.isConnected)
    productModalOpener.focus();
  productModalOpener = null;
};
const openProductLightbox = () => {
  const image = productModal.querySelector(".product-modal-image img");
  const lightboxImage = productLightbox.querySelector("img");
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  productLightbox.setAttribute(
    "aria-label",
    `صورة ${productModal.querySelector("#product-modal-title").textContent}`,
  );
  productModal
    .querySelector(".product-modal-panel")
    .setAttribute("aria-hidden", "true");
  productLightbox.classList.add("is-open");
  productLightbox.setAttribute("aria-hidden", "false");
  productLightbox.querySelector("button").focus();
};
const openProductModal = (card) => {
  const image = card.querySelector("img");
  const title = card.querySelector(".bd h3");
  const description = card.querySelector(".bd p");
  const price = card.querySelector(".price");
  const product = PRODUCTS.find((item) => item.id == card.dataset.id);
  if (!image || !title || !price || !product) return;
  const category =
    card.querySelector(".offer-type") ||
    (card.closest(".menu-section") &&
      card.closest(".menu-section").querySelector(".ttl"));
  modalProduct = product;
  modalProductType = card.dataset.productType;
  modalProductIsOffer = card.classList.contains("offer-card");
  productModalOpener = card;
  const oldPrice = card.querySelector("del");
  const modalImage = productModal.querySelector(".product-modal-image img");
  modalImage.src = image.currentSrc || image.src;
  modalImage.alt = image.alt;
  productModal.querySelector(".product-modal-category").textContent = category
    ? category.textContent.trim()
    : "";
  productModal.querySelector("#product-modal-title").textContent =
    title.textContent;
  const descriptionText = productModal.querySelector(
    ".product-modal-description",
  );
  descriptionText.textContent = description ? description.textContent : "";
  descriptionText.hidden = !descriptionText.textContent.trim();
  const oldPriceText = productModal.querySelector(".product-modal-old-price");
  oldPriceText.hidden = !oldPrice;
  oldPriceText.textContent = oldPrice
    ? `السعر قبل العرض: ${oldPrice.textContent}`
    : "";
  renderProductVariants(product, !modalProductIsOffer);
  updateProductVariantState();
  const existingItem = get().find(
    (item) =>
      item.id == product.id &&
      item.type == modalProductType,
  );
  productModal.querySelector(".product-modal-note").value =
    existingItem ? existingItem.note || "" : "";
  const inCart = Boolean(existingItem) && !modalProductIsOffer;
  productModal.querySelector(".product-modal-quantity").textContent = "1";
  setProductModalCartState(inCart);
  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("product-modal-open");
  productModal.querySelector(".product-modal-close").focus();
};
const keepFocusInside = (event, container) => {
  if (event.key !== "Tab") return;
  const focusable = Array.from(
    container.querySelectorAll(
      'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(
    (element) =>
      element.getClientRects().length &&
      window.getComputedStyle(element).visibility !== "hidden",
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};
productModal.addEventListener("click", (event) => {
  if (event.target.closest(".product-modal-image")) openProductLightbox();
  else if (event.target.closest('[data-modal-action="increase"]')) {
    const quantity = productModal.querySelector(".product-modal-quantity");
    quantity.textContent = Number(quantity.textContent) + 1;
  } else if (event.target.closest('[data-modal-action="decrease"]')) {
    const quantity = productModal.querySelector(".product-modal-quantity");
    quantity.textContent = Math.max(1, Number(quantity.textContent) - 1);
  } else if (event.target.closest('[data-modal-action="add"]')) {
    const variant = updateProductVariantState();
    if (productModal.querySelector(".product-modal-add").disabled) return;
    const quantity = Number(
      productModal.querySelector(".product-modal-quantity").textContent,
    );
    const note = modalProductIsOffer
      ? ""
      : productModal.querySelector(".product-modal-note").value.trim();
    addToCart(
      modalProduct,
      modalProductType,
      quantity,
      note,
      variant.price,
      {
        variantKey: variant.variantKey,
        variantLabel: variant.variantLabel,
        variantOptions: variant.variantOptions,
      },
    );
    updateMenuCardCartState(true);
    setProductModalCartState(true);
  } else if (event.target.closest('[data-modal-action="remove"]')) {
    set(
      get().filter(
        (item) =>
          !(item.id == modalProduct.id && item.type == modalProductType),
      ),
    );
    productModal.querySelector(".product-modal-quantity").textContent = "1";
    updateMenuCardCartState(false);
    setProductModalCartState(false);
    toast("تمت الإزالة من السلة");
  } else if (event.target.closest("[data-product-modal-close]")) {
    closeProductModal();
  }
});
productModal.addEventListener("input", (event) => {
  if (event.target.matches(".product-modal-note")) {
    const cardNote =
      productModalOpener && productModalOpener.querySelector("input");
    if (cardNote) cardNote.value = event.target.value;
  }
});
productModal.addEventListener("change", (event) => {
  if (event.target.matches("[data-product-size]")) {
    modalProductSize =
      modalProduct.sizes[Number(event.target.dataset.productSize)];
  } else if (event.target.matches("[data-product-option]")) {
    modalProductOptions[event.target.dataset.productOption] =
      event.target.value;
  } else {
    return;
  }
  updateProductVariantState();
});
productLightbox.addEventListener("click", (event) => {
  if (
    event.target === productLightbox ||
    event.target.closest(".product-lightbox-close")
  )
    closeProductLightbox();
});
document.addEventListener("click", (event) => {
  const card = event.target.closest(".card[data-product-card]");
  if (card && !event.target.closest("button, input, textarea, select, a"))
    openProductModal(card);
});
document.addEventListener("keydown", (event) => {
  if (productLightbox.classList.contains("is-open")) {
    if (event.key === "Escape") closeProductLightbox();
    else keepFocusInside(event, productLightbox);
    return;
  }
  if (productModal.classList.contains("is-open")) {
    if (event.key === "Escape") closeProductModal();
    else keepFocusInside(event, productModal);
    return;
  }
  const card = event.target.closest(".card[data-product-card]");
  if (
    card &&
    (event.key === "Enter" || event.key === " ") &&
    event.target === card
  ) {
    event.preventDefault();
    openProductModal(card);
  }
});
const get = () => JSON.parse(localStorage.getItem("qc") || "[]"),
  set = (c) => {
    localStorage.setItem("qc", JSON.stringify(c));
    count();
  };
const count = () => {
  const b = $(".bdg");
  if (b) b.textContent = get().reduce((a, x) => a + x.qty, 0);
};
const toast = (t) => {
  let e =
    $(".toast") ||
    document.body.appendChild(
      Object.assign(document.createElement("div"), { className: "toast" }),
    );
  e.textContent = t;
  e.classList.add("on");
  setTimeout(() => e.classList.remove("on"), 1600);
};
if (P !== "home") {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<nav class="nav"><div class="nav-links"><a href="restaurant.html" class="${P == "restaurant" ? "on" : ""}">المطعم</a><a href="cafe.html" class="${P == "cafe" ? "on" : ""}">الكافيه</a><a href="offers.html" class="${P == "offers" ? "on" : ""}">العروض والفعاليات</a></div><a class="logo" href="index.html" aria-label="الصفحة الرئيسية"><img src="img/logo.jpeg" alt="Queen"></a><div class="nav-actions"><a class="cart-link ${P == "cart" ? "on" : ""}" href="cart.html"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L21 9H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg><span>السلة</span><span class="bdg">0</span></a></div></nav>`,
  );
  document.body.insertAdjacentHTML(
    "beforeend",
    `<footer class="site-footer"><div class="footer-shell"><div class="footer-main"><section class="footer-brand"><a class="footer-wordmark" href="index.html">QUEEN<span>✦</span></a><p>مطعم وكافيه يجمع بين المذاق المميز واللحظات الجميلة.</p><a class="footer-offers-link" href="offers.html">العروض والفعاليات</a><div class="footer-info">${INFO}</div></section><section class="footer-follow"><h2>تابعونا على</h2><p>يسعدنا تواصلكم ومشاركة لحظاتكم معنا</p><div class="footer-socials"><a href="${SOCIAL_LINKS.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8z"/></svg></a><a href="${SOCIAL_LINKS.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="ig-dot" cx="17.7" cy="6.8" r="1"/></svg></a></div></section></div><div class="footer-bottom"><span class="footer-copy">© ${new Date().getFullYear()} Queen · جميع الحقوق محفوظة</span><div class="footer-credit"><span class="credit-mark">RC</span><span><small>تصميم وتطوير</small><strong>Rief Code</strong></span></div></div></div></footer>`,
  );
}
count();
const home = $(".home");
if (home) {
  home.addEventListener("click", (e) => {
    const panel = e.target.closest(".panel");
    if (!panel || !home.contains(panel)) return;
    e.preventDefault();
    if (home.classList.contains("is-selecting")) return;
    const bounds = panel.getBoundingClientRect();
    panel.style.setProperty("--start-x", `${bounds.left}px`);
    panel.style.setProperty("--start-y", `${bounds.top}px`);
    panel.style.setProperty(
      "--start-scale-x",
      bounds.width / window.innerWidth,
    );
    panel.style.setProperty(
      "--start-scale-y",
      bounds.height / window.innerHeight,
    );
    home.classList.add("is-selecting");
    panel.classList.add("selected");
    window.setTimeout(
      () => window.location.assign(panel.href),
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 700,
    );
  });
}
document.addEventListener("mousemove", (e) => {
  const t = e.target.closest(".tilt,.card");
  document.querySelectorAll(".tilt,.card").forEach((x) => {
    if (x !== t) x.style.transform = "";
  });
  if (!t) return;
  const r = t.getBoundingClientRect(),
    x = (e.clientX - r.left) / r.width - 0.5,
    y = (e.clientY - r.top) / r.height - 0.5,
    k = t.classList.contains("tilt") ? 24 : 14;
  t.style.transform = `perspective(800px) rotateY(${x * k}deg) rotateX(${-y * k}deg)`;
});
const EMPTY_PRODUCT_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#29231a"/><stop offset="1" stop-color="#090909"/></linearGradient></defs><rect width="640" height="480" fill="url(#g)"/><circle cx="320" cy="220" r="112" fill="none" stroke="#c9a24b" stroke-opacity=".65" stroke-width="3"/><path d="M248 228h144l-20 62h-104zM270 218c8-39 27-58 50-58s42 19 50 58" fill="none" stroke="#f1d58a" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/><path d="M285 320h70" stroke="#c9a24b" stroke-linecap="round" stroke-width="5"/><text x="320" y="376" fill="#c9a24b" font-family="sans-serif" font-size="24" letter-spacing="8" text-anchor="middle">QUEEN</text></svg>',
)}`;
const img = (source) => {
  if (typeof source !== "string" || !source.trim()) return EMPTY_PRODUCT_IMAGE;
  if (I[source]) return U(I[source]);
  return typeof source === "string" && source.startsWith("../img/")
    ? source.slice(3)
    : source;
};
function addToCart(x, type, qty, note = "", price = x.price, details = {}) {
  const c = get(),
    f = c.find(
      (i) =>
        i.id == x.id &&
        i.note == note &&
        i.price == price &&
        i.variantKey === details.variantKey,
    );
  if (f) f.qty += qty;
  else
    c.push({
      id: x.id,
      name: x.name,
      price,
      img: x.image,
      type,
      qty,
      note,
      ...details,
    });
  set(c);
  toast("تمت الإضافة للسلة ✓");
}
function menu(type) {
  const cats = CATEGORIES.filter((category) => category.type == type),
    products = PRODUCTS,
    sb = $("#side"),
    categoryTabs = $("#categories"),
    searchInput = $("#product-search"),
    categoryFilter = $("#category-filter"),
    mn = $("#menu");
  const categoryNav = categoryTabs || sb;
  const categoryMarqueeTrack =
    categoryFilter && categoryFilter.querySelector(".category-marquee-track");
  const categoryScrollArea =
    categoryFilter && categoryFilter.querySelector(".category-scroll-area");
  categoryNav.innerHTML =
    (categoryTabs
      ? `<button data-n="all"><span>✦</span><b>الكل</b></button>`
      : "") +
    cats
      .map(
        (c, n) =>
          `<button data-n="${n}"><span>${c.icon}</span><b>${c.name}</b></button>`,
      )
      .join("");
  if (categoryTabs && categoryMarqueeTrack) {
    categoryMarqueeTrack
      .querySelectorAll(".category-tabs-copy")
      .forEach((copy) => copy.remove());
    categoryTabs.setAttribute("dir", "rtl");
  }
  let activeCategory = categoryTabs ? "all" : "0";
  let searchQuery = "";
  let categoryLayoutFrame = 0;
  let lastCategoryLayoutKey = "";
  let categoryGroupWidth = 0;
  let categoryOffset = 0;
  // بيرجّع الـ offset لنطاق (-عرض_المجموعة .. 0] عشان الـ loop لا نهائي في الاتجاهين
  function wrapCategoryOffset(value) {
    if (!categoryGroupWidth) return 0;
    const m =
      ((-value % categoryGroupWidth) + categoryGroupWidth) % categoryGroupWidth;
    return m === 0 ? 0 : -m;
  }
  function renderCategoryOffset() {
    if (!categoryMarqueeTrack) return;
    categoryMarqueeTrack.style.transform = `translate3d(${categoryOffset}px, 0, 0)`;
  }
  function updateCategoryLayout() {
    if (!categoryTabs || !categoryFilter || !categoryScrollArea) return;
    categoryFilter.classList.add("has-overflow");
    categoryTabs.classList.remove("is-centered");
    if (!categoryMarqueeTrack) return;

    // قياس دقيق (بالكسور) لمجموعة واحدة، من غير ما نعتمد على النسخ المكررة
    const viewportWidth = categoryScrollArea.clientWidth;
    const groupWidth = categoryTabs.getBoundingClientRect().width;
    if (!viewportWidth || !groupWidth) return;

    // عدد النسخ: عرضها كله لازم يغطي الشاشة + مجموعة واحدة (اللي بتتحرك)
    const repeatCount = Math.max(
      6,
      Math.ceil((viewportWidth * 2) / groupWidth) + 1,
    );
    const existingCopies = categoryMarqueeTrack.querySelectorAll(
      ".category-tabs-copy",
    );
    const key = `${viewportWidth}|${groupWidth}|${repeatCount}`;
    // لو مفيش تغيير فعلي، متعيدش بناء النسخ (بيمنع الرعشة عند كل ضغطة/بحث)
    if (
      key === lastCategoryLayoutKey &&
      existingCopies.length === repeatCount - 1
    )
      return;
    lastCategoryLayoutKey = key;

    existingCopies.forEach((copy) => copy.remove());
    for (let copyIndex = 1; copyIndex < repeatCount; copyIndex++) {
      const copy = categoryTabs.cloneNode(true);
      copy.removeAttribute("id");
      copy.classList.remove("is-centered");
      copy.classList.add("category-tabs-copy");
      copy.setAttribute("aria-hidden", "true");
      copy.setAttribute("dir", "rtl");
      copy.querySelectorAll("button").forEach((button) => {
        button.setAttribute("tabindex", "-1");
      });
      categoryMarqueeTrack.append(copy);
    }
    categoryGroupWidth = groupWidth;
    categoryOffset = wrapCategoryOffset(categoryOffset);
    renderCategoryOffset();
  }
  function show(n = activeCategory) {
    activeCategory = n;
    const selectedCategories = n === "all" ? cats : [cats[Number(n)]];
    const normalizedQuery = searchQuery.toLowerCase();
    (categoryFilter || categoryNav)
      .querySelectorAll(".category-tabs button")
      .forEach((button) => {
        const active = button.dataset.n === String(n);
        button.classList.toggle("on", active);
        button.setAttribute("aria-pressed", String(active));
      });
    const sections = selectedCategories
      .map((category) => {
        const categoryProducts = products.filter((product) => {
          const matchesQuery =
            !normalizedQuery ||
            `${product.name} ${product.description || ""} ${category.name}`
              .toLowerCase()
              .includes(normalizedQuery);
          return product.categoryId == category.id && matchesQuery;
        });
        if (!categoryProducts.length) return "";
        return (
          `<section class="menu-section"><h2 class="ttl">${category.icon} ${category.name}</h2><div class="grid">` +
          categoryProducts
            .map(
              (product, i) => {
                const lowestPrice =
                  product.sizes && product.sizes.length
                    ? Math.min(...product.sizes.map((size) => size.price))
                    : product.price;
                const priceLabel =
                  product.sizes && product.sizes.length
                    ? `يبدأ من ${lowestPrice} ج.م`
                    : `${product.price} ج.م`;
                return `<article class="card" data-product-card data-product-type="${type}" data-id="${escapeHtml(product.id)}" tabindex="0" role="group" aria-label="تفاصيل ${escapeHtml(product.name)}" aria-haspopup="dialog" style="animation-delay:${i * 0.1}s"><img src="${escapeHtml(img(product.image))}" alt="${escapeHtml(product.name)}" loading="lazy"><div class="bd"><h3>${escapeHtml(product.name)}</h3>${product.description ? `<p>${escapeHtml(product.description)}</p>` : ""}<div class="row"><span class="price">${priceLabel}</span></div><button class="btn" data-a="add">عرض</button></div></article>`;
              },
            )
            .join("") +
          "</div></section>"
        );
      })
      .join("");
    mn.innerHTML =
      sections ||
      `<p class="menu-empty" role="status">${normalizedQuery ? "لا توجد منتجات مطابقة للبحث" : "لا توجد منتجات في هذا القسم"}</p>`;
    mn.querySelectorAll(".card").forEach((card) => {
      const cartItem = get().find(
        (item) => item.id == card.dataset.id && item.type == type,
      );
      if (cartItem) {
        card.classList.add("in-cart");
        const button = card.querySelector('[data-a="add"]');
        button.dataset.a = "remove";
        button.classList.add("remove-btn");
        button.textContent = "إزالة من السلة";
      }
    });
    updateCategoryLayout();
  }
  (categoryFilter || categoryNav).addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b && (b.closest(".category-tabs") || !categoryTabs)) show(b.dataset.n);
  });
  if (searchInput)
    searchInput.addEventListener("input", () => {
      searchQuery = searchInput.value.trim();
      show();
    });
  if (categoryTabs) {
    const scheduleCategoryLayout = () => {
      window.cancelAnimationFrame(categoryLayoutFrame);
      categoryLayoutFrame = window.requestAnimationFrame(updateCategoryLayout);
    };
    if (categoryMarqueeTrack && categoryScrollArea) {
      const AUTO_SPEED = 50; // بكسل/ثانية، اتجاه الحركة التلقائية ناحية الشمال
      const DRAG_THRESHOLD = 6; // أقل مسافة تعتبر سحب وليست ضغطة
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      let hovering = false;
      let pressed = false;
      let dragging = false;
      let suppressClick = false;
      let pointerId = null;
      let startX = 0;
      let startOffset = 0;
      let lastTime = 0;

      // الحركة التلقائية: بتقف مع الماوس فوق الشريط، أثناء الضغط/السحب، أو مع التركيز بالكيبورد
      const tick = (time) => {
        const dt = Math.min((time - (lastTime || time)) / 1000, 0.1);
        lastTime = time;
        if (
          !reduceMotion.matches &&
          !hovering &&
          !pressed &&
          !categoryMarqueeTrack.matches(":focus-within")
        ) {
          categoryOffset = wrapCategoryOffset(categoryOffset - AUTO_SPEED * dt);
          renderCategoryOffset();
        }
        window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);

      categoryScrollArea.addEventListener("pointerenter", (e) => {
        if (e.pointerType === "mouse") hovering = true;
      });
      categoryScrollArea.addEventListener("pointerleave", (e) => {
        if (e.pointerType === "mouse") hovering = false;
      });

      categoryScrollArea.addEventListener("pointerdown", (e) => {
        if (reduceMotion.matches) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;
        pressed = true;
        dragging = false;
        suppressClick = false;
        pointerId = e.pointerId;
        startX = e.clientX;
        startOffset = categoryOffset;
      });

      categoryScrollArea.addEventListener("pointermove", (e) => {
        if (!pressed || e.pointerId !== pointerId) return;
        const dx = e.clientX - startX;
        if (!dragging) {
          if (Math.abs(dx) < DRAG_THRESHOLD) return;
          dragging = true;
          categoryScrollArea.classList.add("is-dragging");
          try {
            categoryScrollArea.setPointerCapture(pointerId);
          } catch (err) {}
        }
        // السحب يمين = الشريط يتحرك يمين، والعكس
        categoryOffset = wrapCategoryOffset(startOffset + dx);
        renderCategoryOffset();
      });

      const endDrag = (e) => {
        if (!pressed || (e && e.pointerId !== pointerId)) return;
        pressed = false;
        if (dragging) {
          dragging = false;
          // نمنع الـ click اللي بيجي بعد السحب عشان ما يفتحش كاتيجوري بالغلط
          suppressClick = true;
          window.setTimeout(() => {
            suppressClick = false;
          }, 50);
          categoryScrollArea.classList.remove("is-dragging");
        }
      };
      categoryScrollArea.addEventListener("pointerup", endDrag);
      categoryScrollArea.addEventListener("pointercancel", endDrag);
      categoryScrollArea.addEventListener("lostpointercapture", (e) => {
        if (e.target === categoryScrollArea) endDrag(e);
      });

      categoryFilter.addEventListener(
        "click",
        (e) => {
          if (suppressClick) {
            e.stopPropagation();
            e.preventDefault();
          }
        },
        true,
      );
    }
    window.addEventListener("resize", scheduleCategoryLayout);
    if ("ResizeObserver" in window && categoryScrollArea) {
      const categoryResizeObserver = new ResizeObserver(scheduleCategoryLayout);
      categoryResizeObserver.observe(categoryScrollArea);
    }
  }
  if (document.fonts && document.fonts.ready)
    document.fonts.ready.then(updateCategoryLayout);
  mn.onclick = (e) => {
    const a = e.target.dataset.a,
      cd = e.target.closest(".card");
    if (!a) return;
    if (a == "remove") {
      set(
        get().filter(
          (item) => !(item.id == cd.dataset.id && item.type == type),
        ),
      );
      cd.classList.remove("in-cart");
      const button = cd.querySelector('[data-a="remove"]');
      button.dataset.a = "add";
      button.classList.remove("remove-btn");
      button.textContent = "أضف للسلة";
      toast("تمت الإزالة من السلة");
      return;
    }
    if (a == "add") {
      openProductModal(cd);
    }
  };
  show(activeCategory);
}
function offers() {
  const items = PRODUCT_OFFERS.map((offer) => {
    const product = PRODUCTS.find((item) => item.id == offer.id),
      category = CATEGORIES.find((item) => item.id == product.categoryId);
    return { ...offer, product, type: category.type };
  });
  const bundleOffers = resolveBundleOffers();
  const mn = $("#offers");
  mn.innerHTML =
    `<section class="offers-hero"><span class="offers-spark" aria-hidden="true">✦</span><div><span class="offers-kicker">اختيارات Queen الخاصة</span><h1>العروض والفعاليات</h1><p>عروض مميزة وفعاليات تجمعنا على أحلى الأوقات.</p></div><span class="offers-seal" aria-hidden="true">عروض<br>وفعاليات</span></section>` +
    eventsSectionMarkup() +
    `<div class="offers-grid">` +
    items
      .map(({ product: x, price, type }, i) => {
        const discount = Math.round(((x.price - price) / x.price) * 100);
        return `<article class="card offer-card" data-product-card data-product-type="${type}" data-id="${escapeHtml(x.id)}" data-price="${price}" tabindex="0" role="group" aria-label="تفاصيل ${escapeHtml(x.name)}" aria-haspopup="dialog" style="animation-delay:${i * 0.08}s"><div class="offer-image"><img src="${escapeHtml(img(x.image))}" alt="${escapeHtml(x.name)}" loading="lazy"><span class="offer-tag">خصم ${discount}٪</span></div><div class="bd"><span class="offer-type">${type == "restaurant" ? "🍽 من المطعم" : "☕ من الكافيه"}</span><h3>${escapeHtml(x.name)}</h3>${x.description ? `<p>${escapeHtml(x.description)}</p>` : ""}<div class="row"><div class="offer-prices"><del>${x.price} ج.م</del><span class="price">${price} ج.م</span></div><div class="q"><button data-a="-" aria-label="تقليل الكمية">−</button><b>1</b><button data-a="+" aria-label="زيادة الكمية">+</button></div></div><button class="btn" data-a="add">أضف للسلة</button></div></article>`;
      })
      .join("") +
    "</div>";
  initEventTabs(mn, bundleOffers);
  mn.onclick = (e) => {
    const button = e.target.closest("button"),
      card = e.target.closest(".offer-card");
    if (!button || !card) return;
    const quantity = card.querySelector(".q b");
    if (button.dataset.a == "+")
      quantity.textContent = +quantity.textContent + 1;
    if (button.dataset.a == "-")
      quantity.textContent = Math.max(1, +quantity.textContent - 1);
    if (button.dataset.a == "add") {
      const item = items.find(({ id }) => id == card.dataset.id);
      addToCart(item.product, item.type, +quantity.textContent, "", item.price);
      quantity.textContent = 1;
    }
  };
}
const EVENT_DAYS = [
  { day: 6, name: "السبت" },
  { day: 0, name: "الأحد" },
  { day: 1, name: "الإثنين" },
  { day: 2, name: "الثلاثاء" },
  { day: 3, name: "الأربعاء" },
  { day: 4, name: "الخميس" },
  { day: 5, name: "الجمعة" },
];
function resolveBundleOffers() {
  if (!Array.isArray(OFFERS)) return [];
  return OFFERS.filter((offer) => offer && offer.active !== false)
    .map((offer) => {
      if (!Array.isArray(offer.items || [])) {
        console.warn(
          `تعذر قراءة منتجات العرض "${offer.id || "بدون اسم"}".`,
        );
        return null;
      }
      const base = resolveOfferProducts(offer, offer.items || [], "أساسي");
      let choiceOptions = [];
      let choicePick = 0;
      if (offer.choices) {
        if (
          !Array.isArray(offer.choices.options) ||
          !offer.choices.options.length
        )
          return null;
        const choices = resolveOfferProducts(
          offer,
          offer.choices.options,
          "اختيار",
        );
        choiceOptions = choices.items;
        choicePick = Number(offer.choices.pick) || 1;
        if (
          !Number.isInteger(choicePick) ||
          choicePick < 1 ||
          choicePick > choiceOptions.length
        ) {
          console.warn(
            `تم تجاهل العرض "${offer.id}": عدد الاختيارات المطلوبة غير صالح.`,
          );
          return null;
        }
      }
      let sizeOptions = [];
      if (offer.options !== undefined) {
        if (!Array.isArray(offer.options)) {
          console.warn(
            `تم تجاهل العرض "${offer.id}": خيارات السعر غير صالحة.`,
          );
          return null;
        }
        sizeOptions = offer.options.filter((option) => {
          if (
            !option ||
            typeof option.label !== "string" ||
            !Number.isFinite(option.price) ||
            option.price < 0
          ) {
            console.warn(
              `تم تجاهل خيار سعر غير صالح في العرض "${offer.id}".`,
            );
            return false;
          }
          return true;
        });
        if (!sizeOptions.length) return null;
      }
      const offerPrice =
        typeof offer.offerPrice === "number" ? offer.offerPrice : NaN;
      if (
        !sizeOptions.length &&
        (!Number.isFinite(offerPrice) || offerPrice < 0)
      ) {
        console.warn(`تم تجاهل العرض "${offer.id}": سعر العرض غير صالح.`);
        return null;
      }
      return {
        ...offer,
        items: base.items,
        originalPriceKnown: base.complete,
        choiceOptions,
        choicePick,
        sizeOptions,
        offerPrice,
      };
    })
    .filter(Boolean);
}
function resolveOfferProducts(offer, entries, kind) {
  let complete = true;
  const items = [];
  entries.forEach((entry) => {
    const product =
      entry && PRODUCTS.find((item) => item.id === entry.productId);
    if (!product) {
      console.warn(
        `العرض "${offer.id}": المنتج "${entry && entry.productId}" غير موجود في الكتالوج؛ تم تجاهل ${kind} المنتج فقط.`,
      );
      complete = false;
      return;
    }
    const qty = entry.qty === undefined ? 1 : entry.qty;
    if (!Number.isInteger(qty) || qty < 1) {
      console.warn(
        `العرض "${offer.id}": كمية ${kind} المنتج "${entry.productId}" غير صالحة.`,
      );
      complete = false;
      return;
    }
    const priceKnown =
      typeof product.price === "number" &&
      Number.isFinite(product.price) &&
      product.price >= 0;
    if (!priceKnown) complete = false;
    items.push({
      product,
      qty,
      label: entry.label || product.name,
      priceKnown,
    });
  });
  return { items, complete };
}
function bundleOfferPriceState(offer, choiceIndexes, sizeIndex) {
  const sizeOption = offer.sizeOptions[sizeIndex];
  const price = sizeOption ? sizeOption.price : offer.offerPrice;
  let originalPrice = 0;
  let originalPriceKnown = offer.originalPriceKnown;
  offer.items.forEach((item) => {
    if (item.priceKnown) originalPrice += item.product.price * item.qty;
  });
  if (offer.choices) {
    if (choiceIndexes.length !== offer.choicePick) {
      originalPriceKnown = false;
    } else {
      choiceIndexes.forEach((index) => {
        const choice = offer.choiceOptions[index];
        if (!choice || !choice.priceKnown) originalPriceKnown = false;
        else originalPrice += choice.product.price * choice.qty;
      });
    }
  }
  const discount =
    originalPriceKnown && originalPrice > price ? originalPrice - price : 0;
  return { price, originalPrice, originalPriceKnown, discount, sizeOption };
}
function formatOfferEndTime(time) {
  if (typeof time !== "string") return "";
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return "";
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return "";
  const formatNumber = (number) =>
    new Intl.NumberFormat("ar-EG", { useGrouping: false }).format(number);
  const period =
    hour < 5 || hour >= 21
      ? "ليلاً"
      : hour < 12
        ? "صباحًا"
        : hour === 12
          ? "ظهرًا"
          : hour < 17
            ? "بعد الظهر"
            : "مساءً";
  return `${formatNumber(hour % 12 || 12)}:${String(formatNumber(minute)).padStart(2, "٠")} ${period}`;
}
function bundleOfferSliderMarkup(offers) {
  const slider = offers.length
    ? `<div class="offer-slider" data-offer-slider tabindex="0" role="region" aria-label="عروض الاثنين">
        <div class="offer-slider-viewport">
          <div class="offer-slider-track" dir="ltr">
            ${offers
              .map((offer, index) => {
                const imageSources =
                  Array.isArray(offer.images) && offer.images.length
                    ? offer.images
                    : [
                        ...offer.items.map((item) => item.product.image),
                        ...offer.choiceOptions.map(
                          (item) => item.product.image,
                        ),
                      ];
                const images = imageSources
                  .map((source, imageIndex) => {
                    const itemName =
                      offer.items[imageIndex] &&
                      offer.items[imageIndex].product.name;
                    const choiceName =
                      offer.choiceOptions[imageIndex - offer.items.length] &&
                      offer.choiceOptions[
                        imageIndex - offer.items.length
                      ].label;
                    return `<div class="offer-slide-image"><img src="${escapeHtml(img(source))}" alt="${escapeHtml(itemName || choiceName || offer.title)}" loading="${index ? "lazy" : "eager"}"><span class="offer-slide-image-fallback" aria-hidden="true" hidden>✦</span></div>${
                      imageIndex < imageSources.length - 1
                        ? '<span class="offer-slide-plus" aria-hidden="true">+</span>'
                        : ""
                    }`;
                  })
                  .join("");
                const dayAvailable =
                  !ENFORCE_OFFER_DAY || new Date().getDay() === offer.validDay;
                const validDay = EVENT_DAYS.find(
                  ({ day }) => day === offer.validDay,
                );
                const validDayName =
                  offer.validDay === 1
                    ? "الاثنين"
                    : validDay
                      ? validDay.name
                      : "الاثنين";
                const buttonText = dayAvailable
                  ? offer.buttonText || "أضف العرض للسلة"
                  : `العرض ده متاح يوم ${validDayName} فقط`;
                const priceState = bundleOfferPriceState(offer, [], 0);
                const choicesMarkup = offer.choices
                  ? `<fieldset class="offer-slide-selection offer-slide-choices"><legend>${escapeHtml(offer.choices.label || "اختار المنتجات")}</legend><div class="offer-selection-buttons">${offer.choiceOptions
                      .map(
                        (choice, choiceIndex) =>
                          `<button class="offer-selection-chip" type="button" data-choice-offer="${escapeHtml(offer.id)}" data-choice-index="${choiceIndex}" aria-pressed="false">${escapeHtml(choice.label)}</button>`,
                      )
                      .join("")}</div><small data-choice-summary="${escapeHtml(offer.id)}">اختار ${offer.choicePick}</small></fieldset>`
                  : "";
                const sizesMarkup = offer.sizeOptions.length
                  ? `<fieldset class="offer-slide-selection offer-slide-sizes"><legend>اختار الحجم</legend><div class="offer-selection-buttons">${offer.sizeOptions
                      .map(
                        (option, optionIndex) =>
                          `<button class="offer-selection-chip" type="button" data-size-offer="${escapeHtml(offer.id)}" data-size-index="${optionIndex}" aria-pressed="${optionIndex === 0}">${escapeHtml(option.label)}</button>`,
                      )
                      .join("")}</div></fieldset>`
                  : "";
                const disabled = !dayAvailable || Boolean(offer.choices);
                return `<article class="offer-slide" dir="rtl" data-offer-slide="${escapeHtml(offer.id)}" role="group" aria-roledescription="شريحة" aria-label="${index + 1} من ${offers.length}">
                  <div class="offer-slide-content">
                    <span class="offer-slide-badge" data-offer-badge>${priceState.discount > 0 ? `وفّر ${priceState.discount} جنيه` : "عرض"}</span>
                    <h3>${escapeHtml(offer.title)}</h3>
                    <p class="offer-slide-description">${escapeHtml(offer.description)}</p>
                    ${choicesMarkup}${sizesMarkup}
                    <ul class="offer-slide-items">${offer.items
                      .map(
                        ({ product, qty }) =>
                          `<li><span>${escapeHtml(product.name)}</span><b>× ${qty}</b></li>`,
                      )
                      .join("")}${offer.choices ? `<li data-choice-summary-row><span>${escapeHtml(offer.choices.label || "الاختيار")}: لم يتم الاختيار</span></li>` : ""}</ul>
                    ${offer.endsAt && formatOfferEndTime(offer.endsAt) ? `<p class="offer-slide-expiry">العروض لحد الساعة ${formatOfferEndTime(offer.endsAt)}</p>` : ""}
                    <div class="offer-slide-prices">
                      <del data-offer-original ${priceState.discount > 0 ? "" : "hidden"}>${priceState.originalPrice} جنيه</del>
                      <span class="offer-slide-price-current">${offer.priceFrom ? '<span class="offer-slide-price-prefix">يبدأ من</span>' : ""}<strong data-offer-current-price>${priceState.price} جنيه</strong></span>
                    </div>
                    <button class="btn offer-slide-add" type="button" data-offer-add="${escapeHtml(offer.id)}" ${disabled ? "disabled" : ""}>${escapeHtml(buttonText)}</button>
                  </div>
                  <div class="offer-slide-media" role="group" aria-label="صور المنتجات">${images}</div>
                </article>`;
              })
              .join("")}
          </div>
          ${
            offers.length > 1
              ? '<button class="offer-slider-arrow offer-slider-prev" type="button" data-offer-prev aria-label="العرض السابق">→</button><button class="offer-slider-arrow offer-slider-next" type="button" data-offer-next aria-label="العرض التالي">←</button>'
              : ""
          }
        </div>
        ${
          offers.length > 1
            ? `<div class="offer-slider-dots" role="group" aria-label="اختيار العرض">${offers
                .map(
                  (_, index) =>
                    `<button type="button" data-offer-dot="${index}" aria-label="العرض ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"></button>`,
                )
                .join("")}</div>`
            : ""
        }
      </div>`
    : '<p class="events-empty offer-slider-empty">العروض الجديدة لسه بتتحضر، تابعونا قريبًا ✨</p>';
  return `<section class="monday-offers" aria-labelledby="monday-offers-title"><div class="monday-offers-heading"><span class="offers-kicker">عروض طول اليوم</span><h3 id="monday-offers-title">عروض الاثنين</h3><p>اختيارات مميزة بسعر باقة أوفر.</p></div>${slider}</section>`;
}
const activeEvents = () =>
  EVENTS.filter((event) => event.active !== false).map((event) => ({
    ...event,
    startMinutes: event.allDay ? -1 : eventTimeInMinutes(event.startTime),
  }));
function eventTimeInMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
function formatEventTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const formatNumber = (number) =>
    new Intl.NumberFormat("ar-EG", { useGrouping: false }).format(number);
  return `${formatNumber(hours % 12 || 12)}:${formatNumber(minutes)} ${hours < 12 ? "ص" : "م"}`;
}
function eventTimeLabel(event) {
  return event.allDay
    ? "طول اليوم"
    : `${formatEventTime(event.startTime)} - ${formatEventTime(event.endTime)}`;
}
function initBundleOfferSlider(container, offers) {
  const slider = container.querySelector("[data-offer-slider]");
  if (!slider) return () => {};
  const track = slider.querySelector(".offer-slider-track");
  const slides = Array.from(track.querySelectorAll(".offer-slide"));
  const dots = Array.from(slider.querySelectorAll("[data-offer-dot]"));
  const selections = new Map(
    offers.map((offer) => [
      offer.id,
      { choiceIndexes: [], sizeIndex: 0 },
    ]),
  );
  let currentIndex = 0;
  let pointerStartX = null;
  let pointerStartY = null;
  let pointerId = null;
  let dragging = false;
  let suppressClick = false;
  let autoplay;
  const getSlide = (offer) =>
    slides.find((slide) => slide.dataset.offerSlide === offer.id);
  const updateOffer = (offer) => {
    const slide = getSlide(offer);
    const selection = selections.get(offer.id);
    if (!slide || !selection) return;
    slide.querySelectorAll("[data-choice-index]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(
          selection.choiceIndexes.includes(Number(button.dataset.choiceIndex)),
        ),
      );
    });
    slide.querySelectorAll("[data-size-index]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(Number(button.dataset.sizeIndex) === selection.sizeIndex),
      );
    });
    const selectedChoices = selection.choiceIndexes.map(
      (choiceIndex) => offer.choiceOptions[choiceIndex],
    );
    const selectedNames = selectedChoices.map((choice) => choice.label);
    const summary = slide.querySelector("[data-choice-summary]");
    if (summary)
      summary.textContent = selectedNames.length
        ? `تم اختيار: ${selectedNames.join("، ")}`
        : `اختار ${offer.choicePick}`;
    const summaryRow = slide.querySelector("[data-choice-summary-row]");
    if (summaryRow)
      summaryRow.textContent = selectedNames.length
        ? `${offer.choices.label || "الاختيار"}: ${selectedNames.join("، ")}`
        : `${offer.choices.label || "الاختيار"}: لم يتم الاختيار`;

    const priceState = bundleOfferPriceState(
      offer,
      selection.choiceIndexes,
      selection.sizeIndex,
    );
    slide.querySelector("[data-offer-current-price]").textContent =
      `${priceState.price} جنيه`;
    const original = slide.querySelector("[data-offer-original]");
    original.hidden = priceState.discount <= 0;
    original.textContent = `${priceState.originalPrice} جنيه`;
    slide.querySelector("[data-offer-badge]").textContent =
      priceState.discount > 0
        ? `وفّر ${priceState.discount} جنيه`
        : "عرض";
    const button = slide.querySelector("[data-offer-add]");
    const dayAvailable =
      !ENFORCE_OFFER_DAY || new Date().getDay() === offer.validDay;
    const choiceComplete =
      !offer.choices ||
      selection.choiceIndexes.length === offer.choicePick;
    button.disabled = !dayAvailable || !choiceComplete;
    if (!dayAvailable) {
      const validDay = EVENT_DAYS.find(({ day }) => day === offer.validDay);
      const validDayName =
        offer.validDay === 1
          ? "الاثنين"
          : validDay
            ? validDay.name
            : "الاثنين";
      button.textContent = `العرض ده متاح يوم ${validDayName} فقط`;
    } else {
      button.textContent = offer.buttonText || "أضف العرض للسلة";
    }
  };
  const stopAutoplay = () => {
    window.clearInterval(autoplay);
    autoplay = null;
  };
  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(${currentIndex * 100}%)`;
    slides.forEach((slide, slideIndex) => {
      slide.setAttribute("aria-hidden", String(slideIndex !== currentIndex));
      slide.inert = slideIndex !== currentIndex;
    });
    dots.forEach((dot, dotIndex) => {
      dot.setAttribute(
        "aria-current",
        String(dotIndex === currentIndex),
      );
    });
  };
  offers.forEach(updateOffer);
  showSlide(0);
  slider.addEventListener("click", (event) => {
    stopAutoplay();
    const previous = event.target.closest("[data-offer-prev]");
    const next = event.target.closest("[data-offer-next]");
    const dot = event.target.closest("[data-offer-dot]");
    const choiceButton = event.target.closest("[data-choice-offer]");
    const sizeButton = event.target.closest("[data-size-offer]");
    const addButton = event.target.closest("[data-offer-add]");
    if (previous) showSlide(currentIndex - 1);
    else if (next) showSlide(currentIndex + 1);
    else if (dot) showSlide(Number(dot.dataset.offerDot));
    else if (choiceButton) {
      const offer = offers.find(
        (item) => item.id === choiceButton.dataset.choiceOffer,
      );
      if (!offer) return;
      const selection = selections.get(offer.id);
      const choiceIndex = Number(choiceButton.dataset.choiceIndex);
      const selected = new Set(selection.choiceIndexes);
      if (selected.has(choiceIndex)) selected.delete(choiceIndex);
      else if (offer.choicePick === 1) {
        selected.clear();
        selected.add(choiceIndex);
      } else if (selected.size < offer.choicePick) selected.add(choiceIndex);
      selection.choiceIndexes = Array.from(selected).sort((a, b) => a - b);
      updateOffer(offer);
    } else if (sizeButton) {
      const offer = offers.find(
        (item) => item.id === sizeButton.dataset.sizeOffer,
      );
      if (!offer) return;
      selections.get(offer.id).sizeIndex = Number(sizeButton.dataset.sizeIndex);
      updateOffer(offer);
    } else if (addButton) {
      const offer = offers.find(
        (item) => item.id === addButton.dataset.offerAdd,
      );
      if (
        !offer ||
        (ENFORCE_OFFER_DAY && new Date().getDay() !== offer.validDay)
      )
        return;
      const selection = selections.get(offer.id);
      if (
        offer.choices &&
        selection.choiceIndexes.length !== offer.choicePick
      )
        return;
      const selectedChoices = selection.choiceIndexes.map(
        (choiceIndex) => offer.choiceOptions[choiceIndex],
      );
      const bundleItems = [
        ...offer.items.map(({ product, qty }) => ({
          name: product.name,
          qty,
        })),
        ...selectedChoices.map(({ label, qty }) => ({ name: label, qty })),
      ];
      const sizeOption = offer.sizeOptions[selection.sizeIndex];
      const selectionLabels = [
        ...selectedChoices.map(({ label }) => label),
        ...(sizeOption ? [sizeOption.label] : []),
      ];
      const cartName = selectionLabels.length
        ? `${offer.title} (${selectionLabels.join("، ")})`
        : offer.title;
      const firstProduct =
        offer.items[0] && offer.items[0].product
          ? offer.items[0].product
          : selectedChoices[0] && selectedChoices[0].product;
      const category = CATEGORIES.find(
        (item) => firstProduct && item.id === firstProduct.categoryId,
      );
      const priceState = bundleOfferPriceState(
        offer,
        selection.choiceIndexes,
        selection.sizeIndex,
      );
      addToCart(
        {
          id: `bundle:${offer.id}`,
          name: cartName,
          image:
            offer.images && offer.images[0]
              ? offer.images[0]
              : firstProduct
                ? firstProduct.image
                : "coffee",
        },
        category ? category.type : "cafe",
        1,
        "",
        priceState.price,
        {
          bundleItems,
          bundleSize: sizeOption ? sizeOption.label : "",
          variantKey: `${selection.choiceIndexes.join(",")}|${selection.sizeIndex}`,
        },
      );
      const originalText = addButton.textContent;
      addButton.textContent = "اتضاف العرض للسلة ✓";
      addButton.classList.add("is-added");
      window.setTimeout(() => {
        if (!addButton.isConnected) return;
        addButton.textContent = originalText;
        addButton.classList.remove("is-added");
      }, 1100);
    }
  });
  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") showSlide(currentIndex + 1);
    else if (event.key === "ArrowLeft") showSlide(currentIndex - 1);
    else return;
    event.preventDefault();
    stopAutoplay();
  });
  const resetPointerDrag = (event) => {
    if (event && pointerId !== null && event.pointerId !== pointerId) return;
    pointerStartX = null;
    pointerStartY = null;
    pointerId = null;
    dragging = false;
    slider.classList.remove("is-dragging");
  };
  slider.addEventListener("pointerdown", (event) => {
    if (
      pointerId !== null ||
      (event.pointerType === "mouse" && event.button !== 0)
    )
      return;
    stopAutoplay();
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    pointerId = event.pointerId;
  });
  window.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId || pointerStartX === null) return;
    const distanceX = event.clientX - pointerStartX;
    const distanceY = event.clientY - pointerStartY;
    if (!dragging) {
      if (Math.abs(distanceX) < 45 || Math.abs(distanceX) <= Math.abs(distanceY))
        return;
      dragging = true;
      slider.classList.add("is-dragging");
      slider.setPointerCapture(pointerId);
    }
    event.preventDefault();
  });
  window.addEventListener("pointerup", (event) => {
    if (event.pointerId !== pointerId || pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    const wasDragging = dragging;
    resetPointerDrag();
    if (!wasDragging) return;
    showSlide(currentIndex + (distance > 0 ? 1 : -1));
    suppressClick = true;
    window.setTimeout(() => {
      suppressClick = false;
    }, 50);
  });
  window.addEventListener("pointercancel", resetPointerDrag);
  slider.addEventListener("lostpointercapture", (event) => {
    if (event.pointerId === pointerId) resetPointerDrag();
  });
  slider.addEventListener(
    "click",
    (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );
  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("focusin", stopAutoplay);
  slider.addEventListener(
    "error",
    (event) => {
      if (!event.target.matches(".offer-slide-image img")) return;
      event.target.hidden = true;
      event.target.parentElement
        .querySelector(".offer-slide-image-fallback")
        .hidden = false;
    },
    true,
  );
  if (
    slides.length > 1 &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    autoplay = window.setInterval(() => showSlide(currentIndex + 1), 5000);
  return stopAutoplay;
}
function eventsSectionMarkup() {
  const events = activeEvents();
  const today = new Date().getDay();
  const todayEvents = events
    .filter((event) => event.day === today)
    .sort((a, b) => a.startMinutes - b.startMinutes);
  const todaySection = todayEvents.length
    ? `<section class="events-today" aria-labelledby="events-today-title"><h3 id="events-today-title">إيفينتات النهارده</h3><ul>${todayEvents
        .map(
          (event) =>
            `<li><span>${escapeHtml(event.icon || "✨")} ${escapeHtml(event.title)}</span><time>${eventTimeLabel(event)}</time></li>`,
        )
        .join("")}</ul></section>`
    : "";
  const tabs = EVENT_DAYS.map(({ day, name }) => {
    const count = events.filter((event) => event.day === day).length;
    return `<button class="event-day-tab" id="event-tab-${day}" type="button" role="tab" aria-selected="false" aria-controls="events-day-panel" tabindex="-1" data-event-day="${day}"><span>${name}</span>${day === today ? '<span class="event-today-badge">النهارده</span>' : ""}${count ? `<span class="event-day-dot" aria-label="${count} فعاليات"></span>` : ""}</button>`;
  }).join("");
  return `<section class="events-section" aria-labelledby="events-heading"><div class="events-heading"><span class="offers-kicker">مواعيدنا الأسبوعية</span><h2 id="events-heading">الإيفينتات</h2><p>اختار يومك واكتشف الفعاليات اللي مستنياك.</p></div>${todaySection}<div class="events-tabs" role="tablist" aria-label="أيام الأسبوع">${tabs}</div><div class="events-day-panel" id="events-day-panel" role="tabpanel" tabindex="0" aria-live="polite"></div></section>`;
}
function initEventTabs(container, bundleOffers) {
  const tablist = container.querySelector('[role="tablist"]');
  const panel = container.querySelector("#events-day-panel");
  const events = activeEvents();
  const today = new Date().getDay();
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const hasMondayTab = tabs.some(
    (tab) => Number(tab.dataset.eventDay) === 1,
  );
  let stopOfferAutoplay = () => {};
  const renderDay = (day, focusTab = false) => {
    const selectedTab = tabs.find((tab) => Number(tab.dataset.eventDay) === day);
    if (!selectedTab) return;
    stopOfferAutoplay();
    tabs.forEach((tab) => {
      const selected = tab === selectedTab;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", selectedTab.id);
    const dayEvents = events
      .filter((event) => event.day === day)
      .sort((a, b) => a.startMinutes - b.startMinutes);
    const eventMarkup = dayEvents.length
      ? `<div class="events-grid">${dayEvents
          .map(
            (event, index) =>
              `<article class="event-card" style="animation-delay:${index * 0.06}s"><div class="event-icon">${event.image ? `<img src="${escapeHtml(event.image)}" alt="${escapeHtml(event.title)}" loading="lazy">` : `<span aria-hidden="true">${escapeHtml(event.icon || "✨")}</span>`}</div><div class="event-content"><div class="event-card-heading"><h3>${escapeHtml(event.title)}</h3>${event.tag ? `<span class="event-tag">${escapeHtml(event.tag)}</span>` : ""}</div><p>${escapeHtml(event.description)}</p><time>${eventTimeLabel(event)}</time></div></article>`,
          )
          .join("")}</div>`
      : '<p class="events-empty">مفيش فعاليات النهارده، بس العروض مستنياك 😉</p>';
    panel.innerHTML = `${day === 1 ? bundleOfferSliderMarkup(bundleOffers) : ""}${eventMarkup}`;
    if (day === 1)
      stopOfferAutoplay = initBundleOfferSlider(panel, bundleOffers);
    if (focusTab) selectedTab.focus();
  };
  tablist.addEventListener("click", (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab) renderDay(Number(tab.dataset.eventDay));
  });
  tablist.addEventListener("keydown", (event) => {
    const currentIndex = tabs.indexOf(event.target.closest('[role="tab"]'));
    if (currentIndex < 0) return;
    let nextIndex = currentIndex;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex + 1) % tabs.length;
    else if (event.key === "ArrowRight")
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    renderDay(Number(tabs[nextIndex].dataset.eventDay), true);
  });
  renderDay(today);
  if (!hasMondayTab) {
    const section = container.querySelector(".events-section");
    section.insertAdjacentHTML(
      "beforebegin",
      bundleOfferSliderMarkup(bundleOffers),
    );
    stopOfferAutoplay = initBundleOfferSlider(container, bundleOffers);
  }
}
function cart() {
  const draw = () => {
    const c = get();
    $("#items").innerHTML = c.length
      ? c
          .map(
            (x, i) =>
              `<div class="ci"><img src="${escapeHtml(img(x.img))}" alt="${escapeHtml(x.name)}"><div><b>${escapeHtml(x.name)}</b><br><small>${x.price} ج.م</small>${x.variantLabel ? `<small class="cart-bundle-details">${escapeHtml(x.variantLabel)}</small>` : ""}${x.bundleSize ? `<small class="cart-bundle-details">الحجم: ${escapeHtml(x.bundleSize)}</small>` : ""}${Array.isArray(x.bundleItems) && x.bundleItems.length ? `<small class="cart-bundle-details">يشمل: ${x.bundleItems.map((item) => `${escapeHtml(item.name)} × ${item.qty}`).join("، ")}</small>` : ""}<label class="cart-note-label" for="cart-note-${i}">ملاحظة المنتج</label><input class="cart-note" id="cart-note-${i}" data-note-index="${i}" value="${escapeHtml(x.note || "")}" placeholder="أضف ملاحظة للمنتج"></div><div class="q"><button data-i="${i}" data-a="-" aria-label="تقليل الكمية">−</button><b>${x.qty}</b><button data-i="${i}" data-a="+" aria-label="زيادة الكمية">+</button></div><button class="x" data-i="${i}" data-a="x" aria-label="إزالة ${escapeHtml(x.name)}">✕</button></div>`,
          )
          .join("")
      : "<p>السلة فارغة. <a href='restaurant.html' style='color:var(--g)'>تصفح المطعم</a></p>";
    $("#sum").innerHTML = c.length
      ? `<div class="tot"><span>الإجمالي</span><span>${c.reduce((a, x) => a + x.price * x.qty, 0)} ج.م</span></div>`
      : "";
    $("#form").style.display = c.length ? "block" : "none";
  };
  $("#items").onclick = (e) => {
    const a = e.target.dataset.a;
    if (!a) return;
    const c = get(),
      i = e.target.dataset.i;
    if (a == "+") c[i].qty++;
    if (a == "-" && c[i].qty > 1) c[i].qty--;
    if (a == "x") c.splice(i, 1);
    set(c);
    draw();
  };
  $("#items").addEventListener("input", (e) => {
    const index = e.target.dataset.noteIndex;
    if (index === undefined) return;
    const c = get();
    if (!c[index]) return;
    c[index].note = e.target.value;
    set(c);
  });
  const updateDeliveryFields = () => {
    $("#delivery-fields").hidden = $("#takeawayType").value != "delivery";
  };
  const updateOrderFields = () => {
    const isDineIn = $("#serviceType").value == "dine-in";
    $("#dine-in-fields").hidden = !isDineIn;
    $("#takeaway-fields").hidden = isDineIn;
    updateDeliveryFields();
  };
  $("#serviceType").addEventListener("change", updateOrderFields);
  $("#takeawayType").addEventListener("change", updateDeliveryFields);
  updateOrderFields();
  $("#go").onclick = () => {
    const n = $("#nm").value.trim(),
      p = $("#ph").value.trim();
    if (!n || !p) return toast("اكتب الاسم والموبايل");
    const mode = $("#serviceType").value,
      takeawayType = $("#takeawayType").value,
      tableNumber = $("#tableNumber").value.trim(),
      address = $("#ad").value.trim();
    if (
      mode == "dine-in" &&
      (!tableNumber ||
        !Number.isInteger(Number(tableNumber)) ||
        Number(tableNumber) < 1)
    )
      return toast("اكتب رقم طاولة صحيح");
    if (mode == "takeaway" && takeawayType == "delivery" && !address)
      return toast("اكتب عنوان التوصيل");
    const c = get(),
      orderDetails =
        mode == "dine-in"
          ? [`نوع الطلب: صالة`, `رقم الطاولة: ${tableNumber}`]
          : [
              `نوع الطلب: تيك أواي`,
              `طريقة الاستلام: ${takeawayType == "delivery" ? "توصيل" : "استلام من المكان"}`,
              ...(takeawayType == "delivery" ? [`العنوان: ${address}`] : []),
            ],
      L = [
        "*طلب جديد من Queen*",
        `الاسم: ${n}`,
        `الموبايل: ${p}`,
        ...orderDetails,
        "",
      ];
    [
      ["restaurant", "المطعم"],
      ["cafe", "الكافيه"],
    ].forEach(([t, h]) => {
      const s = c.filter((x) => x.type == t);
      if (s.length) {
        L.push("*" + h + "*");
        s.forEach((x) => {
          L.push(
            `- ${x.name} × ${x.qty} = ${x.price * x.qty} ج.م${x.note ? " (" + x.note + ")" : ""}`,
          );
          if (x.variantLabel)
            L.push(`  ${x.variantLabel}`);
          if (x.bundleSize)
            L.push(`  الحجم: ${x.bundleSize}`);
          if (Array.isArray(x.bundleItems) && x.bundleItems.length)
            L.push(
              `  محتويات العرض: ${x.bundleItems.map((item) => `${item.name} × ${item.qty}`).join("، ")}`,
            );
        });
      }
    });
    L.push("", `*الإجمالي: ${c.reduce((a, x) => a + x.price * x.qty, 0)} ج.م*`);
    if ($("#nt").value) L.push("ملاحظات: " + $("#nt").value);
    const whatsappWindow = window.open(
      `https://wa.me/${WA}?text=${encodeURIComponent(L.join("\n"))}`,
      "_blank",
    );
    if (!whatsappWindow)
      return toast("تعذر فتح واتساب. اسمح بالنوافذ المنبثقة ثم أعد المحاولة");
    const destination =
      c[c.length - 1].type == "cafe" ? "cafe.html" : "restaurant.html";
    set([]);
    window.location.assign(destination);
  };
  draw();
}
function initParticleBackground() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  particlesJS("particles-bg", {
    particles: {
      number: {
        value: 120,
        density: { enable: true, value_area: 800 },
      },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: {
        value: 0.62,
        random: true,
        anim: { enable: true, speed: 0.7, opacity_min: 0.2, sync: false },
      },
      size: { value: 3.2, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.22,
        width: 1.2,
      },
      move: {
        enable: !reduceMotion,
        speed: 1.1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "window",
      events: {
        onhover: { enable: !reduceMotion, mode: "repulse" },
        onclick: { enable: false },
        resize: true,
      },
      modes: { repulse: { distance: 150, duration: 0.45 } },
    },
    retina_detect: true,
    responsive: [
      {
        breakpoint: 700,
        options: {
          particles: {
            number: {
              value: 68,
              density: { enable: true, value_area: 550 },
            },
            line_linked: {
              enable: true,
              distance: 105,
              color: "#ffffff",
              opacity: 0.16,
            },
          },
          interactivity: {
            events: { onhover: { enable: false } },
          },
        },
      },
    ],
  });
}
if (P == "cart") cart();
if (P == "restaurant" || P == "cafe" || P == "offers") {
  const categories = QUEEN_CATEGORIES,
    products = QUEEN_PRODUCTS,
    offerList =
      typeof QUEEN_OFFERS === "undefined" ? [] : QUEEN_OFFERS;
  if (
    !Array.isArray(categories) ||
    !Array.isArray(products) ||
    !Array.isArray(offerList)
  ) {
    const error = new Error("ملف المنتجات والأقسام غير موجود أو غير صالح");
    console.error("تعذر تحميل بيانات المنتجات والأقسام:", error);
    const target = P == "offers" ? $("#offers") : $("#menu");
    target.textContent = error.message;
  } else {
    CATEGORIES = categories;
    PRODUCTS = products;
    PRODUCT_OFFERS = offerList;
    if (P == "restaurant" || P == "cafe") menu(P);
    if (P == "offers") {
      if (!Array.isArray(EVENTS)) {
        const error = new Error("ملف الفعاليات غير موجود أو غير صالح");
        console.error("تعذر تحميل بيانات الفعاليات:", error);
        $("#offers").textContent = error.message;
      } else if (typeof OFFERS === "undefined" || !Array.isArray(OFFERS)) {
        const error = new Error("ملف عروض الباقات غير موجود أو غير صالح");
        console.error("تعذر تحميل بيانات عروض الباقات:", error);
        $("#offers").textContent = error.message;
      } else {
        offers();
      }
    }
  }
}
if (P == "restaurant" || P == "cafe") initParticleBackground();
