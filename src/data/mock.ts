// Centralized demonstration data. All records are SAMPLE DATA only — not official records.
export type Rec = Record<string, any>;

export const BUSINESS = {
  name: "KALAWAR Sports",
  founder: "Mr. Santosh Uddhav Kasabe",
  director: "Ms. Ashwini Santosh Kasabe",
  address:
    "Office No. — Gat No. 601 & 602, Plot No. 83, Savarkar Nagar, P. Shiroli, Hatkanangale, Kolhapur, Maharashtra – 416122.",
  hq: "National Headquarters, Maharashtra, India.",
  phones: ["+91 70833 14435", "+91 95614 27125"],
  email: "kalawarsports@gmail.com",
  description:
    "KALAWAR Sports is a technology-driven platform working in the field of sports, fitness, martial arts, and academy management. KALAWAR Sports provides integrated digital solutions for sports federations, gyms, fitness centers, and multi-sports academies, including membership management, athlete registration, coach certification, examinations, championships, training programs, e-learning, and online payments. The platform also offers sports news, video content, social networking, e-commerce, and centralized administration through a responsive website and Android mobile applications, creating a connected digital ecosystem for sports organizations, athletes, coaches, trainers, and fitness enthusiasts.",
};

export const SPORTS = [
  "Karate", "Taekwondo", "Boxing", "Wrestling", "Martial Arts", "Cricket", "Football", "Kabaddi",
  "Basketball", "Volleyball", "Badminton", "Athletics", "Swimming", "Gymnastics", "Yoga", "Fitness",
];

export const PRODUCT_CATEGORIES = [
  "Martial Arts Uniforms", "Belts", "Boxing Gloves", "Protective Equipment", "Fitness Accessories",
  "Workout Equipment", "Cricket Equipment", "Football Equipment", "Yoga Accessories", "Sportswear", "KALAWAR Merchandise",
];

const sportImg = (s: string) =>
  ["Karate", "Taekwondo", "Martial Arts", "Boxing", "Wrestling"].includes(s) ? "martial" : ["Fitness", "Yoga", "Gymnastics"].includes(s) ? "gym" : "hero";

export const initialDb: Record<string, Rec[]> = {
  sports: SPORTS.map((name, i) => ({ id: `SP${i + 1}`, name, status: "Active", img: sportImg(name) })),
  academies: [
    ["Shiroli Karate Dojo", "Karate", "Kolhapur", "Maharashtra", "Martial Arts", "Sensei R. Patil", "Open"],
    ["Pune Taekwondo Centre", "Taekwondo", "Pune", "Maharashtra", "Martial Arts", "Coach A. Joshi", "Open"],
    ["Sangli Wrestling Akhada", "Wrestling", "Sangli", "Maharashtra", "Traditional", "Vastad M. Jadhav", "Waitlist"],
    ["Belagavi Cricket Academy", "Cricket", "Belagavi", "Karnataka", "Multi-Sport", "Coach S. Kulkarni", "Open"],
    ["Nashik Football Club Academy", "Football", "Nashik", "Maharashtra", "Team Sports", "Coach D. Fernandes", "Open"],
    ["Goa Boxing Arena", "Boxing", "Panaji", "Goa", "Combat", "Coach L. D'Souza", "Closed"],
    ["Satara Kabaddi School", "Kabaddi", "Satara", "Maharashtra", "Team Sports", "Coach P. Shinde", "Open"],
    ["Hubballi Aquatic & Athletics", "Swimming", "Hubballi", "Karnataka", "Multi-Sport", "Coach K. Rao", "Waitlist"],
  ].map(([name, sport, city, state, type, coach, status], i) => ({
    id: `AC${i + 1}`, name, sport, city, state, type, coach, status,
    programs: ["Beginner Batch", "Intermediate Batch", "Competition Squad"].slice(0, 2 + (i % 2)).join(", "),
    img: sportImg(sport as string),
  })),
  branches: [
    { id: "BR1", name: "Shiroli Main Branch", academy: "Shiroli Karate Dojo", city: "Kolhapur", state: "Maharashtra", status: "Active" },
    { id: "BR2", name: "Ichalkaranji Branch", academy: "Shiroli Karate Dojo", city: "Ichalkaranji", state: "Maharashtra", status: "Active" },
    { id: "BR3", name: "Kothrud Branch", academy: "Pune Taekwondo Centre", city: "Pune", state: "Maharashtra", status: "Inactive" },
  ],
  gyms: [
    ["Iron Pulse Fitness", "Kolhapur", "Maharashtra", "V. More", 3],
    ["Peak Form Gym", "Pune", "Maharashtra", "N. Deshmukh", 2],
    ["Core Strength Studio", "Belagavi", "Karnataka", "R. Hegde", 1],
    ["FlexZone Wellness", "Panaji", "Goa", "S. Naik", 1],
    ["Titan Training Hub", "Sangli", "Maharashtra", "A. Pawar", 2],
  ].map(([name, city, state, owner, branches], i) => ({ id: `GY${i + 1}`, name, city, state, owner, branches, status: i === 3 ? "Pending" : "Active", img: "gym" })),
  trainers: [
    ["Rahul Patil", "Karate & Self-Defence", "Kolhapur", 9], ["Anita Joshi", "Taekwondo", "Pune", 7],
    ["Vikram More", "Strength Training", "Kolhapur", 11], ["Neha Deshmukh", "Yoga & Mobility", "Pune", 6],
    ["Sameer Kulkarni", "Cricket Batting", "Belagavi", 12], ["Leena D'Souza", "Boxing", "Panaji", 8],
    ["Pooja Shinde", "HIIT & Tabata", "Satara", 5], ["Karan Rao", "Swimming", "Hubballi", 10],
  ].map(([name, specialty, city, exp], i) => ({ id: `TR${i + 1}`, name, specialty, city, experience: `${exp} yrs`, role: i % 3 === 0 ? "Coach" : "Trainer", status: "Active" })),
  referees: [
    { id: "RF1", name: "Mahesh Gaikwad", sport: "Karate", level: "State", state: "Maharashtra", status: "Certified" },
    { id: "RF2", name: "Sunita Kale", sport: "Kabaddi", level: "District", state: "Maharashtra", status: "Certified" },
    { id: "RF3", name: "Ajay Naik", sport: "Boxing", level: "National", state: "Goa", status: "Renewal Due" },
  ],
  officials: [
    { id: "OF1", name: "Dr. Prakash Mane", role: "Examiner", sport: "Karate", state: "Maharashtra", status: "Active" },
    { id: "OF2", name: "Kavita Bhosale", role: "Technical Official", sport: "Taekwondo", state: "Maharashtra", status: "Active" },
  ],
  hierarchy: [
    { id: "HI1", level: "National", name: "KALAWAR National Body (Sample)", region: "India", head: "Super Admin", state: "All" },
    { id: "HI2", level: "State", name: "Maharashtra State Unit (Sample)", region: "Maharashtra", head: "State Admin", state: "Maharashtra" },
    { id: "HI3", level: "State", name: "Karnataka State Unit (Sample)", region: "Karnataka", head: "State Admin", state: "Karnataka" },
    { id: "HI4", level: "District", name: "Kolhapur District Unit (Sample)", region: "Kolhapur", head: "District Admin", state: "Maharashtra" },
    { id: "HI5", level: "District", name: "Pune District Unit (Sample)", region: "Pune", head: "District Admin", state: "Maharashtra" },
  ],
  affiliations: [
    { id: "AF1", academy: "Shiroli Karate Dojo", state: "Maharashtra", applied: "2026-08-02", expiry: "2027-08-01", status: "Approved" },
    { id: "AF2", academy: "Goa Boxing Arena", state: "Goa", applied: "2026-09-14", expiry: "-", status: "Pending" },
    { id: "AF3", academy: "Satara Kabaddi School", state: "Maharashtra", applied: "2026-09-28", expiry: "-", status: "Pending" },
    { id: "AF4", academy: "Pune Taekwondo Centre", state: "Maharashtra", applied: "2025-06-10", expiry: "2026-06-09", status: "Expired" },
  ],
  members: [
    ["Aarav Kasabe", "Karate", "Green", "Shiroli Karate Dojo", "Maharashtra"], ["Sneha Pawar", "Karate", "Blue", "Shiroli Karate Dojo", "Maharashtra"],
    ["Rohan Jadhav", "Wrestling", "-", "Sangli Wrestling Akhada", "Maharashtra"], ["Isha Kulkarni", "Cricket", "-", "Belagavi Cricket Academy", "Karnataka"],
    ["Omkar Shinde", "Kabaddi", "-", "Satara Kabaddi School", "Maharashtra"], ["Tanvi Joshi", "Taekwondo", "Red", "Pune Taekwondo Centre", "Maharashtra"],
    ["Yash Naik", "Boxing", "-", "Goa Boxing Arena", "Goa"], ["Priya Rao", "Swimming", "-", "Hubballi Aquatic & Athletics", "Karnataka"],
  ].map(([name, sport, belt, academy, state], i) => ({ id: `KS-M-${1001 + i}`, name, sport, belt, academy, state, type: i % 3 === 0 ? "Athlete" : "Student", status: i === 6 ? "Expired" : "Active", expiry: `2027-0${(i % 9) + 1}-15` })),
  belts: [
    { id: "BL1", member: "Aarav Kasabe", from: "Yellow", to: "Green", date: "2026-05-12", examiner: "Dr. Prakash Mane", result: "Pass" },
    { id: "BL2", member: "Sneha Pawar", from: "Green", to: "Blue", date: "2026-07-20", examiner: "Dr. Prakash Mane", result: "Pass" },
    { id: "BL3", member: "Tanvi Joshi", from: "Blue", to: "Red", date: "2026-09-03", examiner: "Kavita Bhosale", result: "Pass" },
  ],
  forms: Array.from({ length: 12 }, (_, i) => ({ id: `AN${i + 1}`, name: `KALAWAR Anukkama ${i + 1}`, belt: ["White", "Yellow", "Orange", "Green", "Blue", "Purple", "Brown III", "Brown II", "Brown I", "Black 1st Dan", "Black 2nd Dan", "Black 3rd Dan"][i], moves: 18 + i * 3, status: "Published" })),
  exams: [
    { id: "EX1", title: "Colour Belt Grading — Kolhapur", type: "Belt Examination", date: "2026-11-15", fee: 600, venue: "Shiroli Karate Dojo", status: "Open" },
    { id: "EX2", title: "Black Belt Examination", type: "Black Belt", date: "2026-12-06", fee: 2500, venue: "Kolhapur Sports Complex", status: "Open" },
    { id: "EX3", title: "Dan Grading — 2nd Dan", type: "Dan Grading", date: "2027-01-18", fee: 3500, venue: "Pune", status: "Upcoming" },
    { id: "EX4", title: "Referee Certification Level 1", type: "Referee", date: "2026-11-29", fee: 1500, venue: "Online Demo", status: "Open" },
  ],
  results: [
    { id: "RS1", exam: "Colour Belt Grading — Sep 2026", member: "Tanvi Joshi", score: 86, grade: "Red Belt", result: "Pass" },
    { id: "RS2", exam: "Colour Belt Grading — Sep 2026", member: "Sneha Pawar", score: 74, grade: "Blue Belt", result: "Pass" },
    { id: "RS3", exam: "Referee Level 1 — Aug 2026", member: "Sunita Kale", score: 58, grade: "-", result: "Re-attempt" },
  ],
  certificates: [
    { id: "KS-CERT-2026-0001", name: "Tanvi Joshi", title: "Red Belt — Taekwondo", issued: "2026-09-10", status: "Valid" },
    { id: "KS-CERT-2026-0002", name: "Sneha Pawar", title: "Blue Belt — Karate", issued: "2026-07-25", status: "Valid" },
    { id: "KS-CERT-2026-0003", name: "Sunita Kale", title: "District Referee — Kabaddi", issued: "2026-03-02", status: "Valid" },
    { id: "KS-CERT-2025-0114", name: "Ajay Naik", title: "National Referee — Boxing", issued: "2025-01-15", status: "Expired" },
  ],
  championships: [
    ["KALAWAR State Karate Championship", "Karate", "Kolhapur Sports Complex, Kolhapur", "2026-11-22", "2026-11-10", "Kata, Kumite U-14, U-18, Senior", "Open", 800],
    ["Western India Taekwondo Open", "Taekwondo", "Balewadi Stadium, Pune", "2026-12-13", "2026-11-30", "Poomsae, Kyorugi", "Open", 1000],
    ["Kolhapur District Kabaddi Cup", "Kabaddi", "Shahu Stadium, Kolhapur", "2026-10-18", "2026-10-05", "Men, Women, U-17", "Completed", 1500],
    ["Inter-Academy Cricket League", "Cricket", "KSCA Ground, Belagavi", "2027-01-10", "2026-12-20", "U-16, U-19", "Open", 5000],
    ["Coastal Boxing Invitational", "Boxing", "Campal Indoor Stadium, Panaji", "2026-10-22", "2026-10-08", "Youth, Elite", "Live Demo", 900],
    ["KALAWAR Fitness Challenge", "Fitness", "Iron Pulse Fitness, Kolhapur", "2027-02-07", "2027-01-25", "Deadlift, Pull-ups, Rowing", "Upcoming", 500],
  ].map(([title, sport, venue, date, deadline, categories, status, fee], i) => ({ id: `CH${i + 1}`, title, sport, venue, date, deadline, categories, status, fee, img: sportImg(sport as string) })),
  fixtures: [
    { id: "FX1", championship: "KALAWAR State Karate Championship", match: "Kumite U-18 QF1", players: "A. Kasabe vs R. More", time: "2026-11-22 10:00", result: "Scheduled" },
    { id: "FX2", championship: "Kolhapur District Kabaddi Cup", match: "Final", players: "Shiroli Tigers vs Kagal Warriors", time: "2026-10-18 17:00", result: "Shiroli Tigers 34–29" },
    { id: "FX3", championship: "Coastal Boxing Invitational", match: "Elite 69kg SF", players: "Y. Naik vs P. Gomes", time: "2026-10-22 15:30", result: "In progress (demo)" },
  ],
  rankings: [
    { id: "RK1", name: "Aarav Kasabe", sport: "Karate", points: 1240, gold: 3, silver: 1, bronze: 2 },
    { id: "RK2", name: "Tanvi Joshi", sport: "Taekwondo", points: 1180, gold: 2, silver: 3, bronze: 0 },
    { id: "RK3", name: "Yash Naik", sport: "Boxing", points: 990, gold: 1, silver: 2, bronze: 1 },
    { id: "RK4", name: "Omkar Shinde", sport: "Kabaddi", points: 860, gold: 1, silver: 0, bronze: 3 },
  ],
  programs: [
    ["Strength Training", "Build raw strength with progressive compound lifts."], ["Weight Loss", "Calorie-aware training with cardio and resistance work."],
    ["Weight Gain", "Hypertrophy-focused plans with nutrition guidance."], ["Cardio", "Improve heart health and endurance."],
    ["HIIT", "Short, intense intervals for maximum conditioning."], ["Tabata", "20s on / 10s off protocols for fast fat burn."],
    ["Yoga", "Breath, balance and strength through asanas."], ["Flexibility and Mobility", "Joint health and range-of-motion drills."],
    ["Functional Fitness", "Real-world movement patterns and core stability."], ["Personal Training", "One-on-one coaching tailored to your goals."],
  ].map(([name, desc], i) => ({ id: `PG${i + 1}`, name, desc, schedule: ["Mon/Wed/Fri 6:00 AM", "Tue/Thu/Sat 7:00 PM", "Daily 6:30 AM"][i % 3], trainer: ["Vikram More", "Pooja Shinde", "Neha Deshmukh"][i % 3], capacity: 20, booked: 8 + i, img: "gym" })),
  plans: [
    { id: "PL1", name: "Monthly", duration: "1 month", price: 1200, kind: "Gym" },
    { id: "PL2", name: "Quarterly", duration: "3 months", price: 3200, kind: "Gym" },
    { id: "PL3", name: "Half-Yearly", duration: "6 months", price: 5800, kind: "Gym" },
    { id: "PL4", name: "Yearly", duration: "12 months", price: 9999, kind: "Gym" },
    { id: "PL5", name: "Free", duration: "Forever", price: 0, kind: "Platform" },
    { id: "PL6", name: "Premium Monthly", duration: "1 month", price: 199, kind: "Platform" },
    { id: "PL7", name: "Premium Yearly", duration: "12 months", price: 1999, kind: "Platform" },
  ],
  classes: [
    { id: "GC1", name: "Morning HIIT", gym: "Iron Pulse Fitness", time: "06:00", capacity: 15, booked: 12 },
    { id: "GC2", name: "Evening Yoga", gym: "Peak Form Gym", time: "18:30", capacity: 20, booked: 20 },
    { id: "GC3", name: "Functional Circuit", gym: "Titan Training Hub", time: "07:30", capacity: 12, booked: 5 },
  ],
  attendance: [
    { id: "AT1", member: "Aarav Kasabe", place: "Shiroli Karate Dojo", date: "2026-10-21", status: "Present" },
    { id: "AT2", member: "Sneha Pawar", place: "Shiroli Karate Dojo", date: "2026-10-21", status: "Absent" },
    { id: "AT3", member: "Rohit Sawant", place: "Iron Pulse Fitness", date: "2026-10-21", status: "Present" },
  ],
  progress: [
    { id: "FP1", member: "Rohit Sawant", date: "2026-08-01", weight: 86, height: 175, bodyFat: 24 },
    { id: "FP2", member: "Rohit Sawant", date: "2026-09-01", weight: 83, height: 175, bodyFat: 22 },
    { id: "FP3", member: "Rohit Sawant", date: "2026-10-01", weight: 81, height: 175, bodyFat: 20 },
  ],
  courses: [
    ["Karate Foundations", "Martial Arts", "Rahul Patil", "6 weeks", "Beginner", 0],
    ["Advanced Kata & Bunkai", "Martial Arts", "Rahul Patil", "8 weeks", "Advanced", 2499],
    ["Certified Fitness Trainer Level 1", "Fitness", "Vikram More", "10 weeks", "Intermediate", 6999],
    ["Coach Training: Youth Development", "Coach Training", "Sameer Kulkarni", "4 weeks", "Intermediate", 3499],
    ["Referee Training: Karate Kumite", "Referee Training", "Mahesh Gaikwad", "3 weeks", "Intermediate", 1999],
    ["Yoga for Athletes", "Fitness", "Neha Deshmukh", "5 weeks", "Beginner", 0],
    ["Sports Nutrition Essentials", "Sports Education", "Pooja Shinde", "4 weeks", "Beginner", 1499],
    ["Boxing Technique Masterclass", "Martial Arts", "Leena D'Souza", "6 weeks", "Advanced", 2999],
  ].map(([title, category, instructor, duration, level, fee], i) => ({
    id: `CO${i + 1}`, title, category, instructor, duration, level, fee, status: i === 7 ? "Coming Soon" : "Enrolling",
    modules: ["Introduction & Safety", "Core Techniques", "Drills & Practice", "Assessment Prep"].join("|"), img: (category as string).includes("Martial") || (category as string).includes("Referee") ? "martial" : "gym",
  })),
  news: [
    ["Kolhapur District Kabaddi Cup concludes (sample)", "Sports News", "2026-10-19"],
    ["New colour-belt grading schedule announced (sample)", "Federation Announcements", "2026-10-12"],
    ["5 mobility drills every athlete should do", "Fitness News", "2026-10-08"],
    ["Understanding Anukkama forms 1–4", "Martial Arts Updates", "2026-10-02"],
    ["Shiroli Karate Dojo opens new branch (sample)", "Academy Updates", "2026-09-27"],
    ["Sample achievement: Tanvi Joshi earns Red Belt", "Player Achievements", "2026-09-12"],
    ["Coach spotlight: Sameer Kulkarni's youth program", "Coach Achievements", "2026-09-05"],
    ["Medal winners — Western Open preview (sample)", "Medal Winners", "2026-08-30"],
  ].map(([title, category, date], i) => ({ id: `NW${i + 1}`, title, category, date, summary: "Sample article summary for demonstration. Replace with official KALAWAR Sports content once available.", body: "This is demonstration article content. In the live platform, editors will publish verified news, announcements and achievement stories from the admin panel.", img: ["hero", "martial", "gym", "martial"][i % 4] })),
  events: [
    { id: "EV1", title: "Open Training Camp — Kolhapur", date: "2026-11-02", place: "Kolhapur", status: "Upcoming" },
    { id: "EV2", title: "Coastal Boxing Invitational", date: "2026-10-22", place: "Panaji", status: "Live Demo" },
    { id: "EV3", title: "Kabaddi Cup Final", date: "2026-10-18", place: "Kolhapur", status: "Completed" },
  ],
  galleries: [
    { id: "GA1", title: "State Karate Training Camp", category: "Training", photos: 24, img: "martial" },
    { id: "GA2", title: "Kabaddi Cup 2026", category: "Championship", photos: 40, img: "hero" },
    { id: "GA3", title: "Gym Opening Day", category: "Fitness", photos: 16, img: "gym" },
  ],
  videos: [
    ["Kata demonstration: Anukkama 3", "Rahul Patil", "Martial Arts", "reel"], ["5-minute Tabata burner", "Pooja Shinde", "Workout Tutorials", "reel"],
    ["Kabaddi Cup final highlights", "KALAWAR Media", "Championship Highlights", "long"], ["Proper deadlift form", "Vikram More", "Workout Tutorials", "reel"],
    ["Taekwondo spinning kick drill", "Anita Joshi", "Martial Arts", "reel"], ["Morning yoga flow", "Neha Deshmukh", "Fitness", "reel"],
    ["Cricket batting footwork", "Sameer Kulkarni", "Training Videos", "long"], ["Boxing combo basics", "Leena D'Souza", "Training Videos", "reel"],
    ["Swimming freestyle breathing", "Karan Rao", "Training Videos", "long"], ["Belt grading day vlog", "KALAWAR Media", "Championship Highlights", "reel"],
  ].map(([title, creator, category, type], i) => ({ id: `VD${i + 1}`, title, creator, category, type, views: 1200 + i * 731, likes: 90 + i * 17, img: ["martial", "gym", "hero", "gym", "martial"][i % 5], status: "Published" })),
  products: [
    ["Karate Gi — Competition White", "Martial Arts Uniforms", 2499, 10, 24, "S,M,L,XL", "White"],
    ["Taekwondo Dobok V-Neck", "Martial Arts Uniforms", 1899, 0, 15, "S,M,L", "White,Black"],
    ["Cotton Belt — Rank Colours", "Belts", 299, 0, 120, "2.4m,2.8m,3.0m", "White,Yellow,Green,Blue,Brown,Black"],
    ["Pro Training Boxing Gloves 12oz", "Boxing Gloves", 2299, 15, 18, "10oz,12oz,14oz", "Red,Black"],
    ["Shin & Instep Guard Set", "Protective Equipment", 1299, 0, 30, "S,M,L", "Blue,Red"],
    ["Resistance Band Set (5 levels)", "Fitness Accessories", 899, 20, 60, "", "Multi"],
    ["Hex Dumbbell Pair 10kg", "Workout Equipment", 3499, 5, 8, "", "Black"],
    ["English Willow Cricket Bat", "Cricket Equipment", 6499, 12, 6, "SH,LH", "Natural"],
    ["Match Football Size 5", "Football Equipment", 1199, 0, 0, "", "White"],
    ["Eco Yoga Mat 6mm", "Yoga Accessories", 1499, 10, 40, "", "Blue,Green"],
    ["Dri-Fit Training Tee", "Sportswear", 799, 0, 75, "S,M,L,XL", "Navy,Orange"],
    ["KALAWAR Logo Hoodie", "KALAWAR Merchandise", 1599, 0, 32, "S,M,L,XL", "Navy"],
  ].map(([name, category, price, discount, stock, sizes, colors], i) => ({
    id: `KSP-${101 + i}`, sku: `KS-${(category as string).slice(0, 3).toUpperCase()}-${101 + i}`, name, category, price, discount, stock, sizes, colors,
    desc: `Sample product description for ${name}. Specifications shown are for demonstration.`, img: "gear",
  })),
  orders: [
    { id: "ORD-26001", customer: "Aarav Kasabe", items: "Karate Gi — Competition White x1", total: 2249, date: "2026-10-10", status: "Delivered", payment: "UPI (demo)" },
    { id: "ORD-26002", customer: "Isha Kulkarni", items: "English Willow Cricket Bat x1", total: 5719, date: "2026-10-18", status: "Shipped", payment: "Card (demo)" },
    { id: "ORD-26003", customer: "Rohit Sawant", items: "Hex Dumbbell Pair 10kg x1", total: 3324, date: "2026-10-21", status: "Processing", payment: "Net Banking (demo)" },
  ],
  refunds: [
    { id: "RF-001", order: "ORD-26001", customer: "Aarav Kasabe", type: "Refund", reason: "Size issue", status: "Pending" },
  ],
  transactions: [
    { id: "TXN-9001", user: "Rohit Sawant", purpose: "Gym Membership — Quarterly", amount: 3200, date: "2026-09-01", status: "Success" },
    { id: "TXN-9002", user: "Tanvi Joshi", purpose: "Examination Fee", amount: 600, date: "2026-08-28", status: "Success" },
    { id: "TXN-9003", user: "Isha Kulkarni", purpose: "Championship Registration", amount: 5000, date: "2026-10-12", status: "Refunded" },
    { id: "TXN-9004", user: "Omkar Shinde", purpose: "Course Fee", amount: 1499, date: "2026-10-15", status: "Pending" },
  ],
  subscriptions: [
    { id: "SUB-1", user: "Rohit Sawant", plan: "Quarterly", start: "2026-09-01", expiry: "2026-11-30", status: "Active" },
    { id: "SUB-2", user: "Sneha Pawar", plan: "Premium Monthly", start: "2026-10-01", expiry: "2026-10-31", status: "Expiring" },
    { id: "SUB-3", user: "Yash Naik", plan: "Yearly", start: "2025-10-01", expiry: "2026-09-30", status: "Expired" },
  ],
  notifications: [
    { id: "NT1", title: "Membership expiring soon", body: "Your Premium Monthly plan expires on 31 Oct (demo).", type: "Membership", date: "2026-10-21", read: false },
    { id: "NT2", title: "Exam registration open", body: "Colour Belt Grading — Kolhapur is open for registration.", type: "Examination", date: "2026-10-20", read: false },
    { id: "NT3", title: "Championship alert", body: "State Karate Championship deadline: 10 Nov.", type: "Championship", date: "2026-10-18", read: true },
    { id: "NT4", title: "Payment confirmed (demo)", body: "Demo payment of ₹1,499 recorded.", type: "Payment", date: "2026-10-15", read: true },
  ],
  templates: [
    { id: "TP1", channel: "Push", title: "Renewal reminder", recipients: "Expiring members", body: "Hi {name}, your membership expires on {date}.", status: "Draft" },
    { id: "TP2", channel: "Email", title: "Exam result published", recipients: "Exam candidates", body: "Your result for {exam} is now available.", status: "Draft" },
    { id: "TP3", channel: "SMS/OTP", title: "OTP verification", recipients: "New registrations", body: "Your KALAWAR OTP is {otp} (demo).", status: "Draft" },
    { id: "TP4", channel: "WhatsApp", title: "Championship alert", recipients: "All athletes", body: "Registration for {event} closes on {date}.", status: "Draft" },
  ],
  enquiries: [
    { id: "EN1", name: "Mahesh Patil", email: "mahesh@example.com", phone: "+91 98220 00000", subject: "Academy affiliation", status: "New" },
  ],
  registrations: [],
  reports: [
    { id: "UR1", content: "Video: Boxing combo basics", reason: "Misleading", reporter: "user123", status: "Open" },
  ],
  comments: [
    { id: "CM1", video: "VD1", user: "Sneha", text: "Great form!" },
  ],
  banners: [
    { id: "BN1", title: "ONE PLATFORM. EVERY SPORT. ENDLESS POSSIBILITIES.", section: "Home Hero", status: "Active" },
    { id: "BN2", title: "State Karate Championship — Register now", section: "Home Strip", status: "Active" },
  ],
  admins: [
    { id: "AD1", name: "Demo Super Admin", email: "admin@kalawarsports.demo", role: "Super Admin", scope: "All", status: "Active" },
    { id: "AD2", name: "Demo State Admin", email: "state@kalawarsports.demo", role: "State Administrator", scope: "Maharashtra", status: "Active" },
    { id: "AD3", name: "Demo Academy Admin", email: "academy@kalawarsports.demo", role: "Academy Administrator", scope: "Shiroli Karate Dojo", status: "Active" },
  ],
  logs: [
    { id: "LG1", actor: "Demo Super Admin", action: "Approved affiliation AF1", date: "2026-10-20 11:02" },
  ],
  settings: [
    { id: "ST1", key: "Phone 1", value: "+91 70833 14435" }, { id: "ST2", key: "Phone 2", value: "+91 95614 27125" },
    { id: "ST3", key: "Email", value: "kalawarsports@gmail.com" }, { id: "ST4", key: "Android deep link scheme", value: "kalawar://" },
    { id: "ST5", key: "Payment provider", value: "Not configured (Razorpay placeholder)" },
  ],
  policies: [
    { id: "privacy", title: "Privacy Policy", body: "This demonstration website does not transmit personal data to any server. Data entered is kept only in your browser for the prototype. A complete privacy policy will be published by KALAWAR Sports before launch." },
    { id: "terms", title: "Terms & Conditions", body: "This is a prototype. All listings, prices, events and records are sample data. Final terms will be provided by KALAWAR Sports." },
    { id: "refund", title: "Refund & Cancellation Policy", body: "Refund and cancellation requests in this demo are simulated. No money is charged or refunded. The official policy will be published before payments go live." },
    { id: "shipping", title: "Shipping Policy", body: "Shipment tracking shown in this demo is simulated and not connected to any courier. Official shipping terms will be published at launch." },
  ],
};

export const ROLES = [
  "Super Admin", "India-Level Administrator", "State Administrator", "District Administrator", "Federation Administrator",
  "Academy Administrator", "Gym Owner", "Branch Manager", "Trainer", "Finance Administrator", "Content Administrator",
  "Store Administrator", "Student/Member",
] as const;

// Data-scope simulation per role (front-end only)
export const ROLE_SCOPE: Record<string, { field: string; value: string } | null> = {
  "State Administrator": { field: "state", value: "Maharashtra" },
  "District Administrator": { field: "city", value: "Kolhapur" },
  "Academy Administrator": { field: "academy", value: "Shiroli Karate Dojo" },
};
