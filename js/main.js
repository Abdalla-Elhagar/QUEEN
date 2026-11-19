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
let OFFERS;
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
productModal.innerHTML = `<div class="product-modal-backdrop" data-product-modal-close></div><section class="product-modal-panel" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" tabindex="-1"><button class="product-modal-close" type="button" data-product-modal-close aria-label="إغلاق">×</button><div class="product-modal-content"><button class="product-modal-image" type="button" aria-label="عرض الصورة بحجم الشاشة"><img alt=""><span>اضغط على الصورة لعرضها بحجم الشاشة</span></button><div class="product-modal-info"><span class="product-modal-category"></span><h2 id="product-modal-title"></h2><p class="product-modal-description"></p><p class="product-modal-old-price" hidden></p><strong class="product-modal-price"></strong><div class="product-modal-note-field"><label class="product-modal-note-label" for="product-modal-note">ملاحظات الطلب</label><input class="product-modal-note" id="product-modal-note" placeholder="اكتب أي ملاحظات على المنتج"></div><div class="product-modal-quantity-row"><span>الكمية</span><div class="q"><button type="button" data-modal-action="decrease" aria-label="تقليل الكمية">−</button><b class="product-modal-quantity">1</b><button type="button" data-modal-action="increase" aria-label="زيادة الكمية">+</button></div></div><button class="btn product-modal-add" type="button" data-modal-action="add">أضف للسلة</button></div></div></section>`;
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
const setProductModalCartState = (inCart) => {
  const noteField = productModal.querySelector(".product-modal-note-field");
  const quantityRow = productModal.querySelector(".product-modal-quantity-row");
  const addButton = productModal.querySelector(".product-modal-add");
  noteField.hidden = modalProductIsOffer || inCart;
  quantityRow.hidden = inCart;
  addButton.dataset.modalAction = inCart ? "remove" : "add";
  addButton.classList.toggle("remove-btn", inCart);
  addButton.textContent = inCart ? "إزالة من السلة" : "أضف للسلة";
};
const updateMenuCardCartState = (inCart, note) => {
  if (!productModalOpener || !productModalOpener.closest("#menu")) return;
  const card = productModalOpener;
  const cardNote = card.querySelector("input");
  const button = card.querySelector(".btn");
  const cardQuantity = card.querySelector(".q b");
  card.classList.toggle("in-cart", inCart);
  if (cardNote) cardNote.value = note;
  if (cardQuantity) cardQuantity.textContent = "1";
  button.dataset.a = inCart ? "remove" : "add";
  button.classList.toggle("remove-btn", inCart);
  button.textContent = inCart ? "إزالة من السلة" : "أضف للسلة";
};
const updateProductCardQuantity = (quantity) => {
  const cardQuantity =
    productModalOpener && productModalOpener.querySelector(".q b");
  if (cardQuantity) cardQuantity.textContent = String(quantity);
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
  if (!image || !title || !description || !price || !product) return;
  const category =
    card.querySelector(".offer-type") ||
    (card.closest(".menu-section") &&
      card.closest(".menu-section").querySelector(".ttl"));
  modalProduct = product;
  modalProductType = card.dataset.productType;
  modalProductIsOffer = card.classList.contains("offer-card");
  modalProductPrice = card.dataset.price
    ? Number(card.dataset.price)
    : product.price;
  const oldPrice = card.querySelector("del");
  const modalImage = productModal.querySelector(".product-modal-image img");
  modalImage.src = image.currentSrc || image.src;
  modalImage.alt = image.alt;
  productModal.querySelector(".product-modal-category").textContent = category
    ? category.textContent.trim()
    : "";
  productModal.querySelector("#product-modal-title").textContent =
    title.textContent;
  productModal.querySelector(".product-modal-description").textContent =
    description.textContent;
  const oldPriceText = productModal.querySelector(".product-modal-old-price");
  oldPriceText.hidden = !oldPrice;
  oldPriceText.textContent = oldPrice
    ? `السعر قبل العرض: ${oldPrice.textContent}`
    : "";
  productModal.querySelector(".product-modal-price").textContent =
    price.textContent;
  const existingItem = get().find(
    (item) => item.id == product.id && item.type == modalProductType,
  );
  const cardNote = card.querySelector("input");
  productModal.querySelector(".product-modal-note").value =
    cardNote && cardNote.value
      ? cardNote.value
      : existingItem
        ? existingItem.note || ""
        : "";
  const inCart = Boolean(existingItem) && !modalProductIsOffer;
  const cardQuantity = card.querySelector(".q b");
  productModal.querySelector(".product-modal-quantity").textContent =
    inCart || !cardQuantity ? "1" : cardQuantity.textContent;
  setProductModalCartState(inCart);
  productModalOpener = card;
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
    updateProductCardQuantity(Number(quantity.textContent));
  } else if (event.target.closest('[data-modal-action="decrease"]')) {
    const quantity = productModal.querySelector(".product-modal-quantity");
    quantity.textContent = Math.max(1, Number(quantity.textContent) - 1);
    updateProductCardQuantity(Number(quantity.textContent));
  } else if (event.target.closest('[data-modal-action="add"]')) {
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
      modalProductPrice,
    );
    productModal.querySelector(".product-modal-quantity").textContent = "1";
    if (modalProductIsOffer) {
      updateProductCardQuantity(1);
    } else {
      updateMenuCardCartState(true, note);
      setProductModalCartState(true);
    }
  } else if (event.target.closest('[data-modal-action="remove"]')) {
    const note = productModal.querySelector(".product-modal-note").value.trim();
    set(
      get().filter(
        (item) =>
          !(item.id == modalProduct.id && item.type == modalProductType),
      ),
    );
    updateMenuCardCartState(false, note);
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
    `<nav class="nav"><div class="nav-links"><a href="restaurant.html" class="${P == "restaurant" ? "on" : ""}">المطعم</a><a href="cafe.html" class="${P == "cafe" ? "on" : ""}">الكافيه</a><a href="offers.html" class="${P == "offers" ? "on" : ""}">العروض</a></div><a class="logo" href="index.html" aria-label="الصفحة الرئيسية"><img src="img/logo.jpeg" alt="Queen"></a><div class="nav-actions"><a class="cart-link ${P == "cart" ? "on" : ""}" href="cart.html"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L21 9H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg><span>السلة</span><span class="bdg">0</span></a></div></nav>`,
  );
  document.body.insertAdjacentHTML(
    "beforeend",
    `<footer class="site-footer"><div class="footer-shell"><div class="footer-main"><section class="footer-brand"><a class="footer-wordmark" href="index.html">QUEEN<span>✦</span></a><p>مطعم وكافيه يجمع بين المذاق المميز واللحظات الجميلة.</p><div class="footer-info">${INFO}</div></section><section class="footer-follow"><h2>تابعونا على</h2><p>يسعدنا تواصلكم ومشاركة لحظاتكم معنا</p><div class="footer-socials"><a href="${SOCIAL_LINKS.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8z"/></svg></a><a href="${SOCIAL_LINKS.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="ig-dot" cx="17.7" cy="6.8" r="1"/></svg></a></div></section></div><div class="footer-bottom"><span class="footer-copy">© ${new Date().getFullYear()} Queen · جميع الحقوق محفوظة</span><div class="footer-credit"><span class="credit-mark">RC</span><span><small>تصميم وتطوير</small><strong>Rief Code</strong></span></div></div></div></footer>`,
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
const img = (source) => {
  if (I[source]) return U(I[source]);
  return typeof source === "string" && source.startsWith("../img/")
    ? source.slice(3)
    : source;
};
function addToCart(x, type, qty, note = "", price = x.price) {
  const c = get(),
    f = c.find((i) => i.id == x.id && i.note == note && i.price == price);
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
    // الحركة بمقدار مجموعة واحدة بالظبط بالبكسل (مش نسبة) عشان الـ loop يكمل بدون نطة
    categoryMarqueeTrack.style.setProperty(
      "--category-loop-offset",
      `${-groupWidth}px`,
    );
    const duration = Math.max(12, Math.ceil(groupWidth / 50));
    categoryMarqueeTrack.style.setProperty(
      "--category-loop-duration",
      `${duration}s`,
    );
    categoryMarqueeTrack.style.setProperty(
      "--marquee-duration",
      `${duration}s`,
    );
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
            `${product.name} ${product.description} ${category.name}`
              .toLowerCase()
              .includes(normalizedQuery);
          return product.categoryId == category.id && matchesQuery;
        });
        if (!categoryProducts.length) return "";
        return (
          `<section class="menu-section"><h2 class="ttl">${category.icon} ${category.name}</h2><div class="grid">` +
          categoryProducts
            .map(
              (product, i) =>
                `<article class="card" data-product-card data-product-type="${type}" data-id="${product.id}" tabindex="0" role="group" aria-label="تفاصيل ${escapeHtml(product.name)}" aria-haspopup="dialog" style="animation-delay:${i * 0.1}s"><img src="${img(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy"><div class="bd"><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description)}</p><div class="row"><span class="price">${product.price} ج.م</span><div class="q"><button data-a="-">−</button><b>1</b><button data-a="+">+</button></div></div><input placeholder="ملاحظات (${type == "cafe" ? "بدون صوصات..." : "بدون بصل..."})"><button class="btn" data-a="add">أضف للسلة</button></div></article>`,
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
        card.querySelector("input").value = cartItem.note || "";
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
    if (categoryMarqueeTrack) {
      categoryMarqueeTrack.addEventListener(
        "touchstart",
        () => {
          categoryMarqueeTrack.classList.add("is-touch-paused");
        },
        { passive: true },
      );
      categoryMarqueeTrack.addEventListener("touchend", () => {
        categoryMarqueeTrack.classList.remove("is-touch-paused");
      });
      categoryMarqueeTrack.addEventListener("touchcancel", () => {
        categoryMarqueeTrack.classList.remove("is-touch-paused");
      });
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
    const q = cd.querySelector(".q b");
    if (a == "+") q.textContent = +q.textContent + 1;
    if (a == "-") q.textContent = Math.max(1, q.textContent - 1);
    if (a == "add") {
      const x = products.find((product) => product.id == cd.dataset.id),
        note = cd.querySelector("input").value.trim();
      addToCart(x, type, +q.textContent, note);
      q.textContent = 1;
      cd.classList.add("in-cart");
      const button = cd.querySelector('[data-a="add"]');
      button.dataset.a = "remove";
      button.classList.add("remove-btn");
      button.textContent = "إزالة من السلة";
    }
  };
  show(activeCategory);
}
function offers() {
  const items = OFFERS.map((offer) => {
    const product = PRODUCTS.find((item) => item.id == offer.id),
      category = CATEGORIES.find((item) => item.id == product.categoryId);
    return { ...offer, product, type: category.type };
  });
  const mn = $("#offers");
  mn.innerHTML =
    `<section class="offers-hero"><span class="offers-spark" aria-hidden="true">✦</span><div><span class="offers-kicker">اختيارات Queen الخاصة</span><h1>عروض تستاهل التجربة</h1><p>أشهى اختيارات المطعم والكافيه، بسعر مميز لفترة محدودة.</p></div><span class="offers-seal" aria-hidden="true">عروض<br>خاصة</span></section><div class="offers-grid">` +
    items
      .map(({ product: x, price, type }, i) => {
        const discount = Math.round(((x.price - price) / x.price) * 100);
        return `<article class="card offer-card" data-product-card data-product-type="${type}" data-id="${x.id}" data-price="${price}" tabindex="0" role="group" aria-label="تفاصيل ${escapeHtml(x.name)}" aria-haspopup="dialog" style="animation-delay:${i * 0.08}s"><div class="offer-image"><img src="${img(x.image)}" alt="${escapeHtml(x.name)}" loading="lazy"><span class="offer-tag">خصم ${discount}٪</span></div><div class="bd"><span class="offer-type">${type == "restaurant" ? "🍽 من المطعم" : "☕ من الكافيه"}</span><h3>${escapeHtml(x.name)}</h3><p>${escapeHtml(x.description)}</p><div class="row"><div class="offer-prices"><del>${x.price} ج.م</del><span class="price">${price} ج.م</span></div><div class="q"><button data-a="-" aria-label="تقليل الكمية">−</button><b>1</b><button data-a="+" aria-label="زيادة الكمية">+</button></div></div><button class="btn" data-a="add">أضف للسلة</button></div></article>`;
      })
      .join("") +
    "</div>";
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
function cart() {
  const draw = () => {
    const c = get();
    $("#items").innerHTML = c.length
      ? c
          .map(
            (x, i) =>
              `<div class="ci"><img src="${img(x.img)}"><div><b>${x.name}</b><br><small>${x.price} ج.م</small><label class="cart-note-label" for="cart-note-${i}">ملاحظة المنتج</label><input class="cart-note" id="cart-note-${i}" data-note-index="${i}" value="${escapeHtml(x.note || "")}" placeholder="أضف ملاحظة للمنتج"></div><div class="q"><button data-i="${i}" data-a="-">−</button><b>${x.qty}</b><button data-i="${i}" data-a="+">+</button></div><button class="x" data-i="${i}" data-a="x">✕</button></div>`,
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
        s.forEach((x) =>
          L.push(
            `- ${x.name} × ${x.qty} = ${x.price * x.qty} ج.م${x.note ? " (" + x.note + ")" : ""}`,
          ),
        );
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
    offerList = QUEEN_OFFERS;
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
    OFFERS = offerList;
    if (P == "restaurant" || P == "cafe") menu(P);
    if (P == "offers") offers();
  }
}
if (P == "restaurant" || P == "cafe") initParticleBackground();
