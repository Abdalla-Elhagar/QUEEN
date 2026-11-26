// لإضافة فعالية جديدة: انسخ مثالاً من EVENTS وعدّل الحقول؛ day من 0 (الأحد) إلى 6 (السبت).
// title وdescription وicon (أو image بديلة للأيقونة) أساسية؛ startTime وendTime مطلوبان إلا مع allDay: true. وtag وactive اختياريان.
// اجعل active: false لإخفاء الفعالية مؤقتاً دون حذفها.
// مثال: { id: "open-mic", day: 4, title: "أوبن مايك", description: "ليلة مواهب وموسيقى", startTime: "20:00", endTime: "23:00", icon: "🎤", tag: "مجاني", active: true }
const EVENTS = [
  // الاثنين: عروض طول اليوم
  {
    id: "monday-offers",
    day: 1,
    title: "عروض الاثنين",
    description: "خصومات على منتجات الكافيه طول اليوم.",
    allDay: true, // طول اليوم، مفيش وقت بداية ونهاية
    icon: "🏷️",
    tag: "عروض",
    active: true,
  },

  // الثلاثاء: موفي نايت (٣ أفلام)
  {
    id: "movie-night-1",
    day: 2,
    title: "موفي نايت: الفيلم الأول",
    description: "",
    startTime: "17:00",
    endTime: "19:00",
    icon: "🎬",
    tag: "موفي نايت",
    active: true,
  },
  {
    id: "movie-night-2",
    day: 2,
    title: "موفي نايت: الفيلم التاني",
    description: "",
    startTime: "19:20",
    endTime: "21:20",
    icon: "🎬",
    tag: "موفي نايت",
    active: true,
  },
  {
    id: "movie-night-3",
    day: 2,
    title: "موفي نايت: الفيلم التالت",
    description: "",
    startTime: "21:40",
    endTime: "23:40",
    icon: "🎬",
    tag: "موفي نايت",
    active: true,
  },
];
