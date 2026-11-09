// Featured projects: the cover shown on the home rail + the full case study at /work/<slug>.
// Text comes from Abdullah's own Figma notes and Behance slides.
// In body paragraphs, ==text== renders as a yellow highlight.
// coverPosition (optional): which part of the cover stays visible on the rail, e.g. "0% 50%" = left edge.
// Figure kinds: "wide" (full-width image), "screens" (row of phone screens), "tall" (long page in a scroll frame),
// "logos" (transparent logo files on the page, no box), "pair" (two images side by side).
// Items marked TODO need input from Abdullah.

const w = (slug, name) => `/work/${slug}/${name}.webp`;

export const projects = [
  {
    slug: "under-25",
    title: "Under 25",
    tags: "Product Design · App Redesign",
    cover: w("under-25", "cover"),
    coverPosition: "0% 50%", // keep the logo + title on the left; crop from the right
    summary:
      "A redesign of Under 25, the student community app where young people earn through missions, find opportunities and connect with each other.",
    meta: [
      ["Role", "Product Designer"],
      ["Project", "App redesign (UI/UX)"],
      ["Services", "UX audit, UI design, Interactive prototype"],
      ["Scope", "Onboarding, Home, Chat, Spaces, Opportunities, Missions, Payouts, Search, Profile"],
      ["Tools", "Figma"],
    ],
    sections: [
      {
        id: "problem",
        title: "The problem",
        body: [
          "Under 25 has a lot going for it: missions that pay, jobs, spaces and a community of young creatives. The old app made all of that ==hard to find and harder to use==, with cluttered cards, weak hierarchy and calls to action that got lost.",
          "The goal was to ==streamline navigation, modernise the visual style and improve usability== across every core section, so the app feels as energetic as the people using it.",
        ],
      },
      {
        id: "first-impression",
        title: "A first impression that says it all",
        body: [
          "The new onboarding is minimal and bold, built around one line: ==“where students earn.”== The old version was crowded with cards and icons. Clean typography, strong contrast and deliberate whitespace now create a premium first impression and make “Skip” and “Next” obvious and easy to tap.",
        ],
        figures: [{ kind: "screens", items: [{ src: w("under-25", "s-onboarding"), label: "Redesign" }], caption: "Onboarding: one message, one action." }],
      },
      {
        id: "home",
        title: "A home that knows you",
        body: [
          "Home now greets you by name, ==“Welcome Back, Abdullah”==, a small touch the old app never had. The layout has a clearer hierarchy, better spacing and a rebuilt bottom tab bar.",
          "The sticky “create post” button that floated over everything is gone. Posting now has its own page in the tab bar, which ==removes visual clutter== from the feed. The sidebar became a full-screen overlay with the profile front and centre.",
        ],
        figures: [
          {
            kind: "screens",
            items: [
              { src: w("under-25", "s-home"), label: "Redesign" },
              { src: w("under-25", "s-home-old"), label: "Before" },
            ],
            caption: "Home, before and after.",
          },
        ],
      },
      {
        id: "opportunities",
        title: "Opportunities that feel urgent",
        body: [
          "The old Opportunities page was static and text-heavy. A ==deadline progress bar== now shows how much time each mission has left, a small clock flags limited-time missions, and new filters like Designing and Video-Making help people find work that fits their skills.",
          "Missions can be saved with one tap to compare later, and a cleaner Sort By modal switches between trending and latest.",
        ],
        figures: [
          {
            kind: "screens",
            items: [
              { src: w("under-25", "s-opp-2"), label: "My missions" },
              { src: w("under-25", "s-opp-3"), label: "Jobs" },
              { src: w("under-25", "s-opp-old"), label: "Before" },
            ],
            caption: "Opportunities: urgency you can see at a glance.",
          },
        ],
      },
      {
        id: "missions",
        title: "Missions, minus the noise",
        body: [
          "The mission details screen drops unnecessary text and adds a progress bar and minimal icons. Reward, deadline and status are clearly separated, and a ==“Slide to Start Mission”== control makes the main action impossible to miss.",
        ],
        figures: [{ kind: "screens", items: [{ src: w("under-25", "s-mission") , label: "Redesign" }] }],
      },
      {
        id: "beyond",
        title: "Beyond the app",
        body: ["The same energy carried into a website redesign and in-app announcement posters, so the brand feels consistent wherever students meet it."],
        figures: [
          { kind: "wide", src: w("under-25", "web"), caption: "Under 25 website redesign." },
          { kind: "wide", src: w("under-25", "poster"), caption: "“What’s new” poster for the app." },
        ],
      },
      {
        id: "landed",
        title: "Where it landed",
        body: [
          "A ==fully interactive Figma prototype== covering every core flow, from onboarding and sign-up to chat, spaces, missions, payouts, search, posting and profile. Each screen is clearer, calmer and quicker to act on than the version it replaces.",
        ],
      },
    ],
  },
  {
    slug: "xpulse",
    title: "XPulse",
    tags: "Product Design · Gaming Community Hub",
    cover: w("xpulse", "cover"),
    coverPosition: "0% 50%",
    summary:
      "XPulse, a next-gen gaming arena where college players squad up, compete and rise through the ranks. My entry for DesignVerse by Wooble, which placed runner-up.",
    meta: [
      ["Role", "Product Designer (UI, UX, branding)"],
      ["Project", "DesignVerse by Wooble"],
      ["Services", "Landing page, Player dashboard, Visual design, Interactive prototype"],
      ["Results", "Runner-up · Featured on Wooble"],
      [
        "Links",
        [
          { label: "Figma prototype", href: "https://www.figma.com/proto/rjXZLxGYQwQA6AHUsSsoRr/Mohd.-Abdullah-Meraj_DesignVerse?node-id=2187-5&starting-point-node-id=2187%3A5" },
          { label: "Live on Wooble", href: "https://wooble.org/mohd-abdullahmeraj9676" },
        ],
      ],
    ],
    sections: [
      {
        id: "challenge",
        title: "The challenge",
        body: [
          "DesignVerse is Wooble’s design challenge for students who want to show ==proof over paper==: real, finished work instead of certificates and bios.",
          "College gamers already live across a dozen apps: one for matchmaking, one for chat, one for scores, one for showing off. I wanted to bring all of that into ==one place that makes every match feel like it counts==.",
        ],
      },
      {
        id: "idea",
        title: "One hub, infinite XP",
        body: [
          "XPulse is a gaming community hub for college players. You squad up, battle in weekly showdowns, earn badges and climb the ranks, and ==everything you do earns XP==.",
          "The visual language feels like walking into an arena at night: a dark interface lit by violet glows, gradient headlines, and dotted wave textures that pulse behind the content.",
        ],
        figures: [{ kind: "wide", src: w("xpulse", "l-hero"), caption: "“One Hub. Infinite XP.” The landing page hero." }],
      },
      {
        id: "landing",
        title: "A landing page that feels like a lobby",
        body: [
          "The hero says it in one line, ==“One Hub. Infinite XP.”==, with a live “2,378 online” counter so the place already feels busy.",
          "“Unlock the XPulse Advantage” explains the product in four cards: Battle in Weekly Showdowns, Squad Up & Strategize, Your XP Dashboard, and Earn Badges & Level Up. A stack of player notes under “What the Squad’s Saying” adds social proof, and the page closes on ==“Power up. Squad up. Let the XP begin.”==",
        ],
        figures: [
          { kind: "wide", src: w("xpulse", "l-advantage"), caption: "“Unlock the XPulse Advantage”: four cards, one for each part of the product." },
          { kind: "wide", src: w("xpulse", "l-squad"), caption: "“What the Squad’s Saying”: a stack of player notes." },
        ],
      },
      {
        id: "dashboard",
        title: "Your XP, at a glance",
        body: [
          "Once you’re in, the dashboard greets you by your gamer tag and puts your progress up front: rank, streak and an ==XP bar that shows exactly how close the next level is==.",
          "Around it sit the global leaderboard, your badges, total matches and XP, alerts, a “Countdown to Combat” timer for the next match, and the tournaments coming up.",
        ],
        figures: [
          { kind: "wide", src: w("xpulse", "d-hero"), caption: "Welcome back: profile, streak, rank and XP progress." },
          { kind: "wide", src: w("xpulse", "d-panels"), caption: "Global leaderboard, stats, badges, match countdown and alerts." },
          { kind: "wide", src: w("xpulse", "d-upcoming"), caption: "What’s coming up: upcoming tournaments." },
        ],
      },
      {
        id: "details",
        title: "Small details, big energy",
        body: [
          "Buttons, badges and tournament toggles were built as components with hover states, so the whole prototype feels alive when you click through it.",
        ],
        figures: [{ kind: "wide", src: w("xpulse", "l-cta"), caption: "“Power up. Squad up. Let the XP begin.” The closing call to action." }],
      },
      {
        id: "landed",
        title: "Where it landed",
        body: [
          "XPulse placed ==runner-up at DesignVerse==. Before the results were even out, I found Wooble’s team using my portfolio in their FAQs as a reference for other participants.",
          "Wooble’s CEO wrote a post about the project, describing it as a full landing page for a gaming community hub that ==“a company can literally look at and say: hire him, he’s ready.”== The project is now featured on Wooble’s site.",
        ],
      },
    ],
  },
  {
    slug: "plantry",
    title: "Plantry",
    tags: "Brand Identity · Packaging · Web",
    cover: w("plantry", "cover"),
    summary:
      "A brand for Plantry, a plant-based protein powder for people who want to get stronger without giving up their values. Logo, typography, packaging and a website, made for the NSUT Designathon.",
    meta: [
      ["Role", "Brand & Visual Designer"],
      ["Project", "NSUT Designathon"],
      ["Services", "Brand strategy, Logo & monogram, Typography, Packaging, Website"],
      ["Tools", "Figma, Photoshop, CorelDRAW"],
    ],
    sections: [
      {
        id: "problem",
        title: "The problem",
        body: [
          "Walk down any protein aisle and it all looks the same: heavy tubs, aggressive type and labels that feel more like a supplement lab than food. Most of it is also ==dairy-based and heavily processed==, which leaves vegans and people who simply want cleaner food with very few choices that feel made for them.",
          "The brief was to build a plant-based protein brand from scratch, one that feels ==fresh, friendly and close to nature==, and works everywhere it shows up: on the shelf, in your hand and on a screen.",
        ],
      },
      {
        id: "what",
        title: "What is Plantry",
        body: [
          "Plantry is a fresh, plant-based alternative to help you on your health journey while keeping your veganism intact. The name is ==a combination of plants and pantry==, bringing both worlds together to give you a plant-based answer to your health and fitness needs.",
          "Its protein powder offers a break from the heavily processed dairy products that rule the industry.",
        ],
      },
      {
        id: "audience",
        title: "Who it’s for",
        body: [
          "Plantry serves ==the children of mother nature== who thrive to be the best version of themselves, from fitness enthusiasts to anyone who is simply health-focused.",
          "The belief behind it is simple: ==everyone should be able to embrace the value protein can bring== to their lives. Plant-based products bring a sense of comfort and familiarity, so the brand had to feel warm and approachable, never intimidating.",
        ],
      },
      {
        id: "logo",
        title: "A logo that grows",
        body: [
          "Just like the people it’s for, the Plantry logo is connected to nature: a rounded, hand-drawn wordmark trails off in a line of dots into a ==small leaf, like a seed growing into a plant==.",
          "The leaf also stands on its own as the monogram. It represents not only mother nature but the part of her that lives in every being, because ==nature is not a place to visit, it’s home.== It works as an app icon, a sticker or a stamp on the back of a pouch.",
        ],
        figures: [
          {
            kind: "logos",
            items: [
              { src: w("plantry", "logo-primary"), alt: "Plantry primary logo", h: "clamp(3.5rem, 9vw, 5.5rem)" },
            ],
            caption: "The Plantry primary logo.",
          },
        ],
      },
      {
        id: "typography",
        title: "Type with a personality",
        body: [
          "Headlines use Drowner, a chunky, rounded display face that feels soft and playful, almost edible. Poppins does the quiet work underneath, keeping ingredients, nutrition facts and website copy ==clean and easy to read==.",
        ],
        figures: [{ kind: "wide", src: w("plantry", "type"), caption: "Drowner for headlines, Poppins for everything else." }],
      },
      {
        id: "packaging",
        title: "Packaging you want on your shelf",
        body: [
          "Instead of a tub, Plantry comes in ==soft, resealable pouches== printed with a seed-like pattern, each flavour in its own bright colour so you can spot yours at a glance.",
          "The product shots put the pouches where the ingredients come from, on fresh grass and among clouds, to make the brand feel ==light, natural and a little bit fun==.",
        ],
        figures: [
          { kind: "wide", src: w("plantry", "pack-annotated"), caption: "Pouch details, called out on the grass." },
          { kind: "wide", src: w("plantry", "pack-flavours"), caption: "One pattern, three flavours." },
        ],
      },
      {
        id: "range",
        title: "Beyond the pouch",
        body: [
          "A good brand system should stretch. Plantry’s range grows into ==Multi Vitamin Tablets==, in deep green bottles covered with falling leaves, so every product is recognisable even without reading the label.",
          "The same green and the trailing-leaf logo carry onto a canvas tote bag, protein bars and merch, ==the bits people actually carry around==, so the brand keeps showing up long after the first scoop.",
        ],
        figures: [
          {
            kind: "pair",
            items: [
              { src: w("plantry", "bottles"), alt: "Plantry Multi Vitamin Tablets bottles" },
              { src: w("plantry", "tote"), alt: "Plantry tote bag" },
            ],
            caption: "Multi Vitamin Tablets and the Plantry tote bag.",
          },
        ],
      },
      {
        id: "website",
        title: "The website",
        body: [
          "The website carries the same doodled shapes, clouds and grass into the browser. It explains ==why plant-based protein matters==, introduces the range and makes it easy to pick a flavour.",
        ],
        figures: [
          { kind: "wide", src: w("plantry", "web-laptop"), caption: "The Plantry homepage." },
          { kind: "wide", src: w("plantry", "web-page"), caption: "“Why plant based?” and the rest of the page." },
        ],
      },
      {
        id: "landed",
        title: "Where it landed",
        body: [
          "A complete, ready-to-launch brand system: a name with a story, a logo and monogram, a type pairing, pouches, vitamin bottles, merch and a website, all speaking ==one friendly, plant-first language== from shelf to screen.",
        ],
      },
    ],
  },
  {
    slug: "brew-and-chill",
    title: "Brew & Chill",
    tags: "Brand Identity · Web Design",
    cover: w("brew-and-chill", "cover"),
    summary:
      "A logo and website for Brew & Chill, a cozy café known for handcrafted coffee, poetry nights and open mics. Made for UI/UX Wars.",
    meta: [
      ["Role", "UI/UX & Brand Designer"],
      ["Project", "UI/UX Wars"],
      ["Client", "Brew & Chill café (brief)"],
      ["Services", "Logo, Typography, Website design"],
      ["Tools", "Figma"],
    ],
    sections: [
      {
        id: "brief",
        title: "The brief",
        body: [
          "Karan owns a cozy little coffee shop named “Brew & Chill”. His café is known for its handcrafted coffee, warm interiors and artistic décor, which attract both students and working professionals.",
          "The shop has become a local favourite for casual hangouts, ==poetry nights and open-mic sessions==. Karan now wants an online presence that reflects ==the same charm and vibe as his café==.",
        ],
      },
      {
        id: "approach",
        title: "Making a website feel like a café",
        body: [
          "Most café websites look like the same template: a stock photo, a menu PDF and a map. Brew & Chill isn’t a chain, it’s ==a place people go to feel at home==, so the site had to feel handmade and personal, not corporate.",
          "The idea was simple: scrolling the site should feel like walking in. Warm cream like the walls, a deep coffee red for the brand, pastries and drinks you can almost smell, and ==Karan himself saying hello== before you see the menu.",
        ],
      },
      {
        id: "logo",
        title: "The logo",
        body: [
          "I designed a bold, artistic logo that creatively merges ==the letters ‘B’ & ‘C’== in a warm, inviting style.",
          "The playful curves and compact design capture the cozy, vibrant vibe of Brew & Chill, reflecting ==its charm and community spirit==. It’s small enough to stamp on a cup sleeve and bold enough to work as a sign.",
        ],
        figures: [{ kind: "logos", items: [{ src: w("brew-and-chill", "logo"), alt: "Brew & Chill B&C logo", h: "clamp(7rem, 18vw, 11rem)" }] }],
      },
      {
        id: "typography",
        title: "Type with a little attitude",
        body: [
          "Headlines use Jt Gilboys, a chunky, retro display face with a hand-lettered bounce that feels at home on a chalkboard menu. Poppins keeps the menu, Karan’s story and the café details ==clean and easy to read==.",
        ],
        figures: [{ kind: "wide", src: w("brew-and-chill", "type"), caption: "Jt Gilboys and Poppins." }],
      },
      {
        id: "website",
        title: "The website",
        body: [
          "The homepage opens with the name surrounded by ==donuts, cookies, pies and coffee==, floating like they’ve just come out of the kitchen.",
          "Next, “Meet Karan…” introduces the person behind the counter: a passionate coffee lover and storyteller who believes every cup has its own rhythm. His story leads straight into the menu, set over iced lattes and matcha.",
        ],
        figures: [
          { kind: "wide", src: w("brew-and-chill", "site-hero"), caption: "The homepage hero." },
          { kind: "wide", src: w("brew-and-chill", "site-karan"), caption: "Meet Karan, and the menu." },
        ],
      },
      {
        id: "community",
        title: "Poetry nights, open mics, good vibes",
        body: [
          "A photo gallery shows the café as people actually experience it: bookshelves, art on the walls, laptops and live music. Then a ==scrolling ticker of “poetry nights. open mics. good vibes.”== says what Brew & Chill is about in one line, before “Visit us” with the phone number, email and address.",
        ],
        figures: [
          { kind: "wide", src: w("brew-and-chill", "site-gallery"), caption: "The space." },
          { kind: "wide", src: w("brew-and-chill", "site-visit"), caption: "The ticker and Visit us." },
        ],
      },
      {
        id: "landed",
        title: "Where it landed",
        body: [
          "A complete identity and homepage for a neighbourhood café: a logo, a type pairing, a warm palette and ==a website that feels like the place itself==, so regulars recognise it instantly and new visitors know exactly what kind of evening they’re in for.",
        ],
      },
    ],
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);
