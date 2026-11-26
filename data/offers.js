// لإضافة عرض: انسخ كائنًا من OFFERS وعدّل id والعنوان والوصف وعناصر items.
// استخدم productId كما هو في data/catalog.js، وحدد qty لكل منتج؛ السعر الأصلي والخصم يُحسبان تلقائيًا من الكتالوج.
// offerPrice هو سعر العرض، وimages صور المنتجات بالترتيب (ضعها في images/offers/)، وbuttonText نص الزر.
// choices: لو العميل يختار منتجًا من قائمة (label عنوان الاختيار، pick عدد الاختيارات، options المنتجات).
// options: لو العرض له أحجام بأسعار مختلفة (label + price)، وفي هذه الحالة يُتجاهل offerPrice.
// priceFrom: true يعرض "يبدأ من" قبل السعر.
// endsAt: وقت انتهاء العروض ("01:00" يعني الواحدة بعد منتصف الليل).
// validDay رقم اليوم من 0 (الأحد) إلى 6 (السبت)، وactive: false يخفي العرض مؤقتًا.
const ENFORCE_OFFER_DAY = false;
const OFFERS = [
  {
    id: "guava-combo",
    title: "عصير جوافة + اختيارك",
    description: "عصير جوافة + اختيارك من مولتن كيك أو وافل أو 15 قطعة بان كيك",
    items: [{ productId: "guava-juice", qty: 1 }], // TODO: تأكد من الـ id في catalog.js
    choices: {
      label: "اختر الحلو",
      pick: 1,
      options: [
        { productId: "c8", label: "مولتن كيك" },
        { productId: "c9", label: "وافل" },
        { productId: "pancake-15", label: "15 قطعة بان كيك" }, // TODO: الـ id الصحيح
      ],
    },
    offerPrice: 100,
    images: [
      "images/offers/guava-juice.jpg",
      "images/offers/molten-cake.jpg",
      "images/offers/waffle.jpg",
      "images/offers/pancake.jpg",
    ],
    buttonText: "أضف العرض للسلة",
    validDay: 1,
    endsAt: "01:00",
    active: true,
  },
  {
    id: "hot-chocolate",
    title: "هوت شوكليت",
    description: "هوت شوكليت غنية في كوب كوين",
    items: [{ productId: "hot-chocolate", qty: 1 }], // TODO
    offerPrice: 45,
    images: ["images/offers/hot-chocolate.jpg"],
    buttonText: "أضف العرض للسلة",
    validDay: 1,
    endsAt: "01:00",
    active: true,
  },
  {
    id: "sandwiches",
    title: "ساندوتشات",
    description: "اختر ساندوتشك المفضل بسعر خاص",
    items: [],
    choices: {
      label: "اختر الساندوتش",
      pick: 1,
      options: [
        // TODO: ضع ساندوتشات العرض من catalog.js
        // { productId: "...", label: "..." },
      ],
    },
    offerPrice: 30,
    priceFrom: true,
    images: ["images/offers/sandwiches.jpg"],
    buttonText: "أضف العرض للسلة",
    validDay: 1,
    endsAt: "01:00",
    active: true,
  },
  {
    id: "nutella-ginger-crepe",
    title: "كريب نوتيلا وزنجر",
    description: "كريب بالنوتيلا والموز",
    items: [{ productId: "nutella-crepe", qty: 1 }], // TODO
    offerPrice: 50,
    images: ["images/offers/crepe.jpg"],
    buttonText: "أضف العرض للسلة",
    validDay: 1,
    endsAt: "01:00",
    active: true,
  },
  {
    id: "chicken-pasta",
    title: "باستا دجاج",
    description: "باستا بصوص الكريمة والدجاج",
    items: [{ productId: "chicken-pasta", qty: 1 }], // TODO
    options: [
      { label: "عادي", price: 50 },
      { label: "كبير", price: 60 },
    ],
    images: ["images/offers/pasta.jpg"],
    buttonText: "أضف العرض للسلة",
    validDay: 1,
    endsAt: "01:00",
    active: true,
  },
  {
    id: "chicken-ranch-pizza",
    title: "بيتزا تشيكن رانش",
    description: "بيتزا بالدجاج وصوص الرانش",
    items: [{ productId: "chicken-ranch-pizza", qty: 1 }], // TODO
    options: [
      { label: "وسط", price: 120 },
      { label: "كبير", price: 140 },
    ],
    images: ["images/offers/pizza.jpg"],
    buttonText: "أضف العرض للسلة",
    validDay: 1,
    endsAt: "01:00",
    active: true,
  },
];
