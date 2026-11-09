// All the words, links and images for the site live here.
// Edit this file to change content; the components read from it.
// Anything marked DUMMY is a placeholder to replace later.

const be = (id) => `https://mir-s3-cdn-cf.behance.net/project_modules/fs_webp/${id}.png`;

export const site = {
  name: "Abdullah",
  fullName: "Mohd. Abdullah Meraj",
  role: "Product & visual designer",
  email: "mohdabdullahmeraj1705@gmail.com",
  // Formspree form ID (the part after formspree.io/f/). Empty = the contact form opens the visitor's email app instead.
  formspree: "",
  phone: { display: "+91 70659 03592", href: "tel:+917065903592" },
  timezone: { label: "IST", iana: "Asia/Kolkata" },
  status: "Open to internships and freelance work",
  currently: { label: "Currently designing for", place: "Independent clients" },
  bookCall: "https://cal.com/mohdabdullahmeraj/chat",
};

export const hellos = [
  { word: "Hello", language: "English" },
  { word: "नमस्ते", language: "हिन्दी" },
  { word: "آداب", language: "اردو" },
  { word: "مرحبا", language: "العربية" },
  { word: "Bonjour", language: "Français" },
  { word: "Hola", language: "Español" },
  { word: "こんにちは", language: "日本語" },
];

// Hero photo stack (files in /public/photos, 640×800)
export const photos = [
  "/photos/campus.webp",
  "/photos/ferrari.webp",
  "/photos/event.webp",
  "/photos/desk.webp",
];

// Featured projects (rail + case studies) live in content/projects.js

// Newest first.
export const experience = [
  { company: "FourCore", role: "Product Designer", dates: "Jul 2026" },
  { company: "DocuHub", role: "UI/UX Designer", dates: "Jan – Mar 2026" },
  { company: "Across The Globe", role: "Visual Designer, UI/UX team", dates: "May 2024 – Jul 2026" },
  { company: "Texium Solutions", role: "Graphic Designer", dates: "Apr – May 2024" },
];

// Brands I've worked with. logo = single-colour shape file in /public/logos (transparent PNG or SVG),
// shown tinted grey via CSS mask; ratio = logo width / height. No logo → the name is shown as grey text.
// Logo files are made from the user's originals by scripts/make-logos.mjs.
export const clients = [
  { name: "Zomato", logo: "/logos/zomato.png", ratio: 4.729 },
  { name: "boAt", logo: "/logos/boat.svg", ratio: 2.433 },
  { name: "Under 25", logo: "/logos/under-25.png", ratio: 1.045, scale: 1.4 },
  { name: "Third Wave Coffee", logo: "/logos/third-wave-coffee.png", ratio: 1.600 },
  { name: "Banao", logo: "/logos/banao.png", ratio: 4.475, scale: 1.4 },
  { name: "Across The Globe", logo: "/logos/across-the-globe.png", ratio: 5.575, scale: 1.4 },
  { name: "Texium", logo: "/logos/texium.png", ratio: 3.892 },
  { name: "Interviewgod", logo: "/logos/interviewgod.png", ratio: 5.096, scale: 1.4 },
  { name: "Adarsh Furniture", logo: "/logos/adarsh-furniture.png", ratio: 2.771 },
  { name: "The Edu Ocean", logo: "/logos/edu-ocean.png", ratio: 0.883, scale: 1.4 },
  { name: "Tagsen", logo: "/logos/tagsen.png", ratio: 1.179, scale: 1.4 },
  { name: "Career Saarthi", logo: "/logos/career-saarthi.png", ratio: 1.000, scale: 1.4 },
  { name: "Dream India Network", logo: "/logos/dream-india-network.png", ratio: 2.771, scale: 1.4 },
  { name: "Found", logo: "/logos/found.png", ratio: 4.596, scale: 1.4 },
];

// Playground: everything on /playground (in this order). w/h = real image size, used for the grid.
// Images are made by scripts/build-playground.mjs.
// big: true = one of the user's favourite pieces, shown in the larger "featured" rows on /playground
// Order = order on the page: full-size posts/mockups first, then logos & web mockups, then the small old thumbnails.
export const playground = [
  { src: "/playground/found-red.webp", alt: "Found poster", w: 1120, h: 1400, big: true },
  { src: "/playground/rapidry-1.webp", alt: "Rapidry post", w: 1080, h: 1350, big: true },
  { src: "/playground/found-green.webp", alt: "Found poster", w: 1120, h: 1400, big: true },
  { src: "/playground/zomato-gear.webp", alt: "Zomato gear", w: 1400, h: 889, big: true },
  { src: "/playground/vibesquad-1.webp", alt: "VibeSquad post", w: 1120, h: 1400, big: true },
  { src: "/playground/dashboard-phones.webp", alt: "Banking app on phones", w: 1074, h: 725, big: true },
  { src: "/playground/w-p0-galaxy-tab-s8-ultra-1.webp", alt: "Design work", w: 1000, h: 667, big: true },
  { src: "/playground/under25-whats-new.webp", alt: "What's new in the Under 25 app", w: 621, h: 1000, big: true },
  { src: "/playground/hack-2.webp", alt: "Hack 2.0 poster", w: 707, h: 1000 },
  { src: "/playground/interviewgod-1.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/bode.webp", alt: "Bode magazine", w: 1400, h: 788, big: true },
  { src: "/playground/treasure-hunt.webp", alt: "Treasure Hunt poster", w: 707, h: 1000 },
  { src: "/playground/vidya-1.webp", alt: "Vidya post", w: 1080, h: 1350 },
  { src: "/playground/metvy-1.webp", alt: "Metvy post", w: 1080, h: 1350, big: true },
  { src: "/playground/design-space-hq.webp", alt: "The Design Space website", w: 1600, h: 993, big: true },
  { src: "/playground/spray-the-word.webp", alt: "Spray the Word poster", w: 1000, h: 1000 },
  { src: "/playground/edu-ocean-1.webp", alt: "EduOcean story", w: 788, h: 1400 },
  { src: "/playground/codetrek.webp", alt: "CodeTrek poster", w: 707, h: 1000, big: true },
  { src: "/playground/missions-tee.webp", alt: "Missions t-shirt", w: 1400, h: 693, big: true },
  { src: "/playground/vibesquad-2.webp", alt: "VibeSquad post", w: 1120, h: 1400 },
  { src: "/playground/interviewgod-genz.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/verdia-hand.webp", alt: "Verdia app", w: 1400, h: 844, big: true },
  { src: "/playground/adarsh.webp", alt: "Adarsh Furniture Christmas post", w: 1080, h: 1080 },
  { src: "/playground/brand-brawl.webp", alt: "Brand Brawl poster", w: 706, h: 1000 },
  { src: "/playground/vidya-2.webp", alt: "Vidya post", w: 1080, h: 1350 },
  { src: "/playground/troubleshoot-1.webp", alt: "Troubleshoot Ideathon post", w: 1080, h: 1350 },
  { src: "/playground/metvy-4.webp", alt: "Metvy post", w: 1080, h: 1350 },
  { src: "/playground/interviewgod-apple.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/calling-all.webp", alt: "Calling All Enthusiasts poster", w: 1400, h: 786, big: true },
  { src: "/playground/vibesquad-3.webp", alt: "VibeSquad post", w: 1120, h: 1400 },
  { src: "/playground/tees.webp", alt: "T-shirt designs", w: 1400, h: 885, big: true },
  { src: "/playground/headphones.webp", alt: "Always a listener post", w: 1000, h: 1000 },
  { src: "/playground/nct-hashtag.webp", alt: "NCT Hashtag poster", w: 707, h: 1000 },
  { src: "/playground/rapidry-2.webp", alt: "Rapidry post", w: 1080, h: 1350, big: true },
  { src: "/playground/interviewgod-2.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/prayaban.webp", alt: "Prayaban website", w: 1000, h: 621 },
  { src: "/playground/vidya-4.webp", alt: "Vidya post", w: 1080, h: 1350 },
  { src: "/playground/edu-ocean-3.webp", alt: "EduOcean story", w: 788, h: 1400 },
  { src: "/playground/found-cream.webp", alt: "Found poster", w: 1120, h: 1400 },
  { src: "/playground/laptop.webp", alt: "Fashion store website on a laptop", w: 1000, h: 861, big: true },
  { src: "/playground/vibesquad-4.webp", alt: "VibeSquad post", w: 1120, h: 1400 },
  { src: "/playground/troubleshoot-2.webp", alt: "Troubleshoot Ideathon post", w: 1080, h: 1350 },
  { src: "/playground/metvy-6.webp", alt: "Metvy post", w: 1080, h: 1350 },
  { src: "/playground/interviewgod-pharma.webp", alt: "InterviewGod post", w: 1080, h: 1350, big: true },
  { src: "/playground/interviewgod-did-you-know.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/metvy-2b.webp", alt: "Metvy post", w: 1080, h: 1350 },
  { src: "/playground/interviewgod-c74.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/edu-ocean-c1a.webp", alt: "EduOcean post", w: 1080, h: 1350 },
  { src: "/playground/vidya-3.webp", alt: "Vidya post", w: 1080, h: 1350 },
  { src: "/playground/rapidry-c2.webp", alt: "Rapidry post", w: 1080, h: 1350, big: true },
  { src: "/playground/metvy-3b.webp", alt: "Metvy post", w: 1080, h: 1350 },
  { src: "/playground/interviewgod-c75.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/edu-ocean-c1b.webp", alt: "EduOcean post", w: 1080, h: 1350 },
  { src: "/playground/vidya-5.webp", alt: "Vidya post", w: 1080, h: 1350 },
  { src: "/playground/rapidry-c3.webp", alt: "Rapidry post", w: 1080, h: 1350 },
  { src: "/playground/metvy-4b.webp", alt: "Metvy post", w: 1080, h: 1350 },
  { src: "/playground/interviewgod-c76.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/edu-ocean-c1c.webp", alt: "EduOcean post", w: 1080, h: 1350 },
  { src: "/playground/vidya-6.webp", alt: "Vidya post", w: 1080, h: 1350 },
  { src: "/playground/rapidry-c4.webp", alt: "Rapidry post", w: 1080, h: 1350 },
  { src: "/playground/metvy-5b.webp", alt: "Metvy post", w: 1080, h: 1350 },
  { src: "/playground/interviewgod-c91.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/edu-ocean-c1d.webp", alt: "EduOcean post", w: 1080, h: 1350 },
  { src: "/playground/vibesquad-5.webp", alt: "VibeSquad post", w: 1120, h: 1400, big: true },
  { src: "/playground/troubleshoot-0.webp", alt: "Troubleshoot Ideathon post", w: 1080, h: 1350 },
  { src: "/playground/metvy-7b.webp", alt: "Metvy post", w: 1080, h: 1350 },
  { src: "/playground/interviewgod-c92.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/edu-ocean-i2.webp", alt: "EduOcean post", w: 788, h: 1400 },
  { src: "/playground/metvy-8b.webp", alt: "Metvy post", w: 1080, h: 1350 },
  { src: "/playground/interviewgod-c93.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/metvy-10b.webp", alt: "Metvy post", w: 1080, h: 1350 },
  { src: "/playground/interviewgod-c185.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/interviewgod-c187.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/interviewgod-c806.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/interviewgod-c807.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/interviewgod-3.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/interviewgod-4.webp", alt: "InterviewGod post", w: 1080, h: 1350 },
  { src: "/playground/w-logos-screenshot_20250208-210809_drive-1.webp", alt: "Design work", w: 1000, h: 573 },
  { src: "/playground/w-logos-frame-3.webp", alt: "Design work", w: 1000, h: 913 },
  { src: "/playground/w-logos-group-28646.webp", alt: "Design work", w: 1000, h: 1000 },
  { src: "/playground/w-logos-screenshot_20250208-210751_drive-1.webp", alt: "Design work", w: 926, h: 1000 },
  { src: "/playground/w-logos-screenshot_20250208-210800_drive-1.webp", alt: "Design work", w: 941, h: 1000 },
  { src: "/playground/w-logos-hashtag_1_1_20241013_142347_0000-1.webp", alt: "Design work", w: 1000, h: 1000 },
  { src: "/playground/w-logos-1.webp", alt: "Design work", w: 1000, h: 1000 },
  { src: "/playground/w-p2-frame-33-_2_-1-1.webp", alt: "Design work", w: 1000, h: 621 },
  { src: "/playground/w-p0-add-a-heading_20240411_122844_0000-1.webp", alt: "Design work", w: 1296, h: 678 },
  { src: "/playground/w-p0-galaxy-tab-s8-ultra.webp", alt: "Design work", w: 1000, h: 750 },
  { src: "/playground/w-p0-1_20240307_203818_0000-1.webp", alt: "Design work", w: 1000, h: 1000 },
  { src: "/playground/w-p0-3x-hairfall-free-damage-free_20240427_180352_0000-1.webp", alt: "Design work", w: 1000, h: 1000 },
  { src: "/playground/w-p0-hashtag_11-1.webp", alt: "Design work", w: 1000, h: 1000 },
  { src: "/playground/w-p0-lakshadweep_20240409_192107_0000-1.webp", alt: "Design work", w: 1000, h: 1000 },
  { src: "/playground/w-p0-happy-raksha-bandhan_20241104_160457_0000.webp", alt: "Design work", w: 1000, h: 951 },
];

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mohdabdullahmeraj/" },
  { label: "Behance", href: "https://www.behance.net/mohdameraj" },
  { label: "Instagram", href: "https://www.instagram.com/figuringoutwithabd" },
];

export const sections = [
  { id: "intro", label: "About me" },
  { id: "work", label: "Featured projects" },
  { id: "experience", label: "Experience" },
  { id: "clients", label: "Worked with" },
  { id: "archive", label: "Archive" },
  { id: "contact", label: "Say hello" },
];
