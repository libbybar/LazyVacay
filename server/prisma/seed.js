import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hotelsSeed = [
  {
    name: "טירת הוגוורטס",
    country: "סקוטלנד",
    city: "הוגסמיד",
    stars: 5,
    description: "טירה קסומה המשקיפה אל האגם השחור ומציעה אירוח יוקרתי בין מגדלים עתיקים ומסדרונות מכושפים.",
    imageUrl: null,
    rooms: [
      { name: "חדר גריפינדור", size: 28, maxGuests: 2, price: 980, description: "חדר חמים בהשראת מגדל גריפינדור, עם נוף אל שטחי הטירה.", imageUrl: null },
      { name: "חדר סלית'רין", size: 30, maxGuests: 2, price: 1020, description: "חדר אלגנטי בגוונים עמוקים, בהשראת חדר המועדון שמתחת לאגם.", imageUrl: null },
      { name: "חדר רייבנקלו", size: 32, maxGuests: 2, price: 1050, description: "חדר מואר ומעורר השראה עם אווירה של ידע, יצירתיות וסקרנות.", imageUrl: null },
      { name: "חדר הפלפאף", size: 30, maxGuests: 3, price: 990, description: "חדר נעים ומזמין עם עיצוב טבעי ואווירה משפחתית.", imageUrl: null },
      { name: "סוויטת הנחיצות", size: 65, maxGuests: 5, price: 2400, description: "סוויטה יוקרתית המשתנה בהתאם לצורכי האורחות.", imageUrl: null }
    ]
  },
  {
    name: "אכסניית היער האסור",
    country: "סקוטלנד",
    city: "הוגסמיד",
    stars: 4,
    description: "אירוח בלב הטבע הקסום, בין עצים עתיקים, קרחות יער מוארות ירח ושבילים נסתרים.",
    imageUrl: null,
    rooms: [
      { name: "חדר ערפל היער", size: 24, maxGuests: 2, price: 760, description: "חדר שקט וקסום המוקף בנוף יערי וערפילי.", imageUrl: null },
      { name: "חדר קרן הכסף", size: 26, maxGuests: 2, price: 810, description: "חדר בהשראת היער הקסום ואגדות חדי הקרן.", imageUrl: null },
      { name: "בקתת האגריד", size: 40, maxGuests: 4, price: 1180, description: "בקתה מרווחת וחמימה עם אווירה כפרית ואירוח לבבי.", imageUrl: null },
      { name: "חדר לחישת העלים", size: 28, maxGuests: 3, price: 850, description: "חדר אינטימי עם תחושת טבע ושלווה.", imageUrl: null },
      { name: "סוויטת הירחונים", size: 55, maxGuests: 4, price: 1650, description: "סוויטה רחבת ידיים עם חלונות פנורמיים אל קרחות היער.", imageUrl: null }
    ]
  },
  {
    name: "פונדק שלושת המטאטאים",
    country: "סקוטלנד",
    city: "הוגסמיד",
    stars: 4,
    description: "פונדק כפרי וחמים עם אח בוערת, נוף מושלג ואווירה ביתית בלב הכפר הקסום.",
    imageUrl: null,
    rooms: [
      { name: "חדר האח הבוערת", size: 22, maxGuests: 2, price: 720, description: "חדר אינטימי עם אווירה חמימה וניחוח של עץ בוער.", imageUrl: null },
      { name: "חדר פנסי החורף", size: 24, maxGuests: 2, price: 780, description: "חדר מואר באור רך ובהשראת לילות החורף בהוגסמיד.", imageUrl: null },
      { name: "חדר שלג ראשון", size: 26, maxGuests: 3, price: 820, description: "חדר נעים המשקיף אל גגות הכפר המושלגים.", imageUrl: null },
      { name: "חדר ערב מושלג", size: 28, maxGuests: 3, price: 850, description: "חדר רגוע ורומנטי עם אווירת חורף קסומה.", imageUrl: null },
      { name: "סוויטת האח הגדולה", size: 48, maxGuests: 4, price: 1420, description: "סוויטה משפחתית מרווחת עם אזור אירוח פרטי.", imageUrl: null }
    ]
  },
  {
    name: "הקלחת הרותחת",
    country: "אנגליה",
    city: "לונדון",
    stars: 3,
    description: "פונדק היסטורי המסתתר בלב לונדון ומציע אירוח חמים לנוסעות בין העולם הרגיל לעולם הקסם.",
    imageUrl: null,
    rooms: [
      { name: "חדר האח המרצדת", size: 20, maxGuests: 2, price: 680, description: "חדר נעים עם עיצוב קלאסי ואווירה ביתית.", imageUrl: null },
      { name: "חדר הפנסים העתיקים", size: 22, maxGuests: 2, price: 720, description: "חדר בהשראת פונדקי הדרכים העתיקים של עולם הקוסמים.", imageUrl: null },
      { name: "חדר קורות האלון", size: 24, maxGuests: 3, price: 780, description: "חדר כפרי עם קורות עץ חשופות ועיצוב מסורתי.", imageUrl: null },
      { name: "חדר הערפל הלונדוני", size: 26, maxGuests: 3, price: 820, description: "חדר אלגנטי בהשראת הרחובות העתיקים של לונדון.", imageUrl: null },
      { name: "סוויטת המעבר הנסתר", size: 42, maxGuests: 4, price: 1250, description: "סוויטה מרווחת בהשראת המעבר הסודי לעולם הקסם.", imageUrl: null }
    ]
  }
];

async function main() {
  console.log("🪄 Packing trunks and casting seeding spells...");

  await prisma.reservation.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();


  for (const hotel of hotelsSeed) {
    await prisma.hotel.create({
      data: {
        name: hotel.name,
        country: hotel.country,
        city: hotel.city,
        stars: hotel.stars,
        description: hotel.description,
        imageUrl: hotel.imageUrl,
        rooms: {
          create: hotel.rooms 
        }
      }
    });
  }

  console.log("✨ Mischief Managed! All magical hotels and rooms created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });