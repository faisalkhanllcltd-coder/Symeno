import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../src/data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const API_KEY = process.env.RAPIDAPI_KEY;
if (!API_KEY) {
  console.error("🚨 FATAL: RAPIDAPI_KEY environment variable is missing.");
  process.exit(1);
}

// ============================================================================
// THE AIRWALLEX / PAYONEER COMPLIANCE SHIELD
// ============================================================================
// Any product title or description containing these exact strings will be dropped.
const COMPLIANCE_BLOCKLIST = [
  // Medical & Health Claims
  "blood pressure", "posture corrector", "brace", "acupressure", "compression sock",
  "medical", "therapeutic", "healing", "supplement", "vitamin", "serum", "oil",

  // Weapons & Sharp Objects
  "razor", "blade", "knife", "dagger", "sword", "weapon", "tactical",

  // Restricted High-Profile Brands (Gray Market Risk)
  "kitchenaid", "apple", "amazon essentials", "anker", "nike", "samsung", "sony"
];

function isCompliant(title, description, brand) {
  const checkString = `${title} ${description} ${brand}`.toLowerCase();
  for (const bannedWord of COMPLIANCE_BLOCKLIST) {
    if (checkString.includes(bannedWord)) {
      return false; // Fails compliance check
    }
  }
  return true; // Passes compliance check
}
// ============================================================================


// 20 CURATED CATEGORIES (USA/CANADA COMPLIANT)
const SEARCH_TARGETS = [
  // ── CATEGORY 01: Pour-Over & Filter Coffee
  { cat: "Pour-Over Coffee", catSlug: "pour-over-coffee", brand: "AeroBrew", query: "reusable stainless pour over coffee dripper" },
  { cat: "Pour-Over Coffee", catSlug: "pour-over-coffee", brand: "AeroBrew", query: "stainless steel coffee filter cone permanent" },
  { cat: "Pour-Over Coffee", catSlug: "pour-over-coffee", brand: "AeroBrew", query: "gooseneck kettle pour over coffee" },
  { cat: "Pour-Over Coffee", catSlug: "pour-over-coffee", brand: "BrewHaven", query: "glass carafe pour over coffee server" },
  { cat: "Pour-Over Coffee", catSlug: "pour-over-coffee", brand: "BrewHaven", query: "coffee scale timer pour over" },
  { cat: "Pour-Over Coffee", catSlug: "pour-over-coffee", brand: "BrewHaven", query: "paper coffee filters cone pack" },
  { cat: "Pour-Over Coffee", catSlug: "pour-over-coffee", brand: "Drip & Grind", query: "coffee grinder hand manual burr" },
  { cat: "Pour-Over Coffee", catSlug: "pour-over-coffee", brand: "Drip & Grind", query: "travel coffee dripper portable compact" },
  { cat: "Pour-Over Coffee", catSlug: "pour-over-coffee", brand: "Drip & Grind", query: "silicone coffee dripper folding travel" },
  { cat: "Pour-Over Coffee", catSlug: "pour-over-coffee", brand: "Roast & Revel", query: "coffee canister airtight stainless" },
  { cat: "Pour-Over Coffee", catSlug: "pour-over-coffee", brand: "Roast & Revel", query: "coffee spoon scoop measuring stainless" },
  { cat: "Pour-Over Coffee", catSlug: "pour-over-coffee", brand: "Roast & Revel", query: "coffee mat pour over bar mat" },

  // ── CATEGORY 03: Kitchen Tools & Gadgets
  { cat: "Kitchen Tools", catSlug: "kitchen-tools", brand: "ChefCore", query: "magnetic measuring spoons stainless set" },
  { cat: "Kitchen Tools", catSlug: "kitchen-tools", brand: "ChefCore", query: "adjustable mandoline slicer vegetable" },
  { cat: "Kitchen Tools", catSlug: "kitchen-tools", brand: "ChefCore", query: "silicone kitchen utensils set wooden handle" },
  { cat: "Kitchen Tools", catSlug: "kitchen-tools", brand: "SliceRight", query: "avocado slicer tool pitter splitter" },
  { cat: "Kitchen Tools", catSlug: "kitchen-tools", brand: "SliceRight", query: "herb stripper herb scissors stainless" },
  { cat: "Kitchen Tools", catSlug: "kitchen-tools", brand: "SliceRight", query: "garlic press rocker stainless steel" },
  { cat: "Kitchen Tools", catSlug: "kitchen-tools", brand: "CulinaPrep", query: "silicone baking mat set non stick" },
  { cat: "Kitchen Tools", catSlug: "kitchen-tools", brand: "CulinaPrep", query: "pastry brush silicone basting" },
  { cat: "Kitchen Tools", catSlug: "kitchen-tools", brand: "CulinaPrep", query: "bench scraper dough cutter stainless" },
  { cat: "Kitchen Tools", catSlug: "kitchen-tools", brand: "PantryPro", query: "airtight food storage containers set" },
  { cat: "Kitchen Tools", catSlug: "kitchen-tools", brand: "PantryPro", query: "oil dispenser glass bottle kitchen" },
  { cat: "Kitchen Tools", catSlug: "kitchen-tools", brand: "PantryPro", query: "spice jar set airtight glass labels" },

  // ── CATEGORY 06: Home Organization
  { cat: "Home Organization", catSlug: "home-organization", brand: "TidySpace", query: "fabric packing cubes set luggage organizer" },
  { cat: "Home Organization", catSlug: "home-organization", brand: "TidySpace", query: "drawer organizer dividers bamboo" },
  { cat: "Home Organization", catSlug: "home-organization", brand: "TidySpace", query: "closet organizer shelf dividers" },
  { cat: "Home Organization", catSlug: "home-organization", brand: "NeatNook", query: "acrylic makeup organizer clear drawer" },
  { cat: "Home Organization", catSlug: "home-organization", brand: "NeatNook", query: "pantry labels waterproof chalkboard sticker" },
  { cat: "Home Organization", catSlug: "home-organization", brand: "NeatNook", query: "stackable storage bins fabric foldable" },
  { cat: "Home Organization", catSlug: "home-organization", brand: "PureShelf", query: "under sink organizer sliding cabinet" },
  { cat: "Home Organization", catSlug: "home-organization", brand: "PureShelf", query: "countertop organizer tiered shelf" },
  { cat: "Home Organization", catSlug: "home-organization", brand: "PureShelf", query: "refrigerator organizer bins clear set" },
  { cat: "Home Organization", catSlug: "home-organization", brand: "OrderMade", query: "cord organizer cable clips adhesive" },
  { cat: "Home Organization", catSlug: "home-organization", brand: "OrderMade", query: "key holder wall mount hooks entryway" },
  { cat: "Home Organization", catSlug: "home-organization", brand: "OrderMade", query: "magazine file holder desk organizer" },

  // ── CATEGORY 10: Bath & Shower
  { cat: "Bath & Shower", catSlug: "bath-shower", brand: "Zenith Bath", query: "silicone body scrubber brush shower" },
  { cat: "Bath & Shower", catSlug: "bath-shower", brand: "Zenith Bath", query: "bath caddy tray bamboo adjustable" },
  { cat: "Bath & Shower", catSlug: "bath-shower", brand: "Zenith Bath", query: "shower shelf caddy suction cup rust proof" },
  { cat: "Bath & Shower", catSlug: "bath-shower", brand: "LatherLux", query: "soap dispenser pump bottle glass bathroom" },
  { cat: "Bath & Shower", catSlug: "bath-shower", brand: "LatherLux", query: "loofah set natural exfoliating sponge" },
  { cat: "Bath & Shower", catSlug: "bath-shower", brand: "LatherLux", query: "bath salt soak set gift epsom mineral" },
  { cat: "Bath & Shower", catSlug: "bath-shower", brand: "SudsStudio", query: "shampoo bar holder bamboo soap dish" },
  { cat: "Bath & Shower", catSlug: "bath-shower", brand: "SudsStudio", query: "bath towel hook adhesive wall mount" },
  { cat: "Bath & Shower", catSlug: "bath-shower", brand: "SudsStudio", query: "non slip bath mat shower cushion" },
  { cat: "Bath & Shower", catSlug: "bath-shower", brand: "RinseRight", query: "handheld shower head filter chlorine" },
  { cat: "Bath & Shower", catSlug: "bath-shower", brand: "RinseRight", query: "shower cap reusable waterproof adult" },
  { cat: "Bath & Shower", catSlug: "bath-shower", brand: "RinseRight", query: "body brush dry brushing set long handle" },

  // ── CATEGORY 11: Fitness Accessories
  { cat: "Fitness Accessories", catSlug: "fitness-accessories", brand: "CoreFit", query: "fabric resistance bands set glutes" },
  { cat: "Fitness Accessories", catSlug: "fitness-accessories", brand: "CoreFit", query: "yoga block set foam brick pair" },
  { cat: "Fitness Accessories", catSlug: "fitness-accessories", brand: "CoreFit", query: "ab roller wheel core exercise" },
  { cat: "Fitness Accessories", catSlug: "fitness-accessories", brand: "FlexLine", query: "jump rope bearing weighted speed" },
  { cat: "Fitness Accessories", catSlug: "fitness-accessories", brand: "FlexLine", query: "stretch strap yoga flexibility" },
  { cat: "Fitness Accessories", catSlug: "fitness-accessories", brand: "FlexLine", query: "ankle weights set women workout" },
  { cat: "Fitness Accessories", catSlug: "fitness-accessories", brand: "RepReady", query: "gym gloves weight lifting grip" },
  { cat: "Fitness Accessories", catSlug: "fitness-accessories", brand: "RepReady", query: "foam roller muscle massage recovery" },
  { cat: "Fitness Accessories", catSlug: "fitness-accessories", brand: "RepReady", query: "workout towel gym microfiber" },
  { cat: "Fitness Accessories", catSlug: "fitness-accessories", brand: "PeakPulse", query: "resistance tube set door anchor handles" },
  { cat: "Fitness Accessories", catSlug: "fitness-accessories", brand: "PeakPulse", query: "massage ball set lacrosse trigger point" },
  { cat: "Fitness Accessories", catSlug: "fitness-accessories", brand: "PeakPulse", query: "fitness tracker journal planner workout" },

  // ── CATEGORY 13: Everyday Carry (EDC)
  { cat: "Everyday Carry", catSlug: "everyday-carry", brand: "Apex Minimal", query: "slim minimalist wallet front pocket leather" },
  { cat: "Everyday Carry", catSlug: "everyday-carry", brand: "Apex Minimal", query: "titanium money clip card holder" },
  { cat: "Everyday Carry", catSlug: "everyday-carry", brand: "Apex Minimal", query: "keychain organizer multi key holder compact" },
  { cat: "Everyday Carry", catSlug: "everyday-carry", brand: "CarryRight", query: "carabiner clip multi tool small lightweight" },
  { cat: "Everyday Carry", catSlug: "everyday-carry", brand: "CarryRight", query: "pen holder clip belt loop stainless" },
  { cat: "Everyday Carry", catSlug: "everyday-carry", brand: "CarryRight", query: "pill organizer compact daily travel" },
  { cat: "Everyday Carry", catSlug: "everyday-carry", brand: "PocketFab", query: "small notebook pocket EDC memo" },
  { cat: "Everyday Carry", catSlug: "everyday-carry", brand: "PocketFab", query: "paracord bracelet survival wristband" },
  { cat: "Everyday Carry", catSlug: "everyday-carry", brand: "PocketFab", query: "mini flashlight keychain small bright" },
  { cat: "Everyday Carry", catSlug: "everyday-carry", brand: "DayGear", query: "tote bag canvas reusable market shopping" },
  { cat: "Everyday Carry", catSlug: "everyday-carry", brand: "DayGear", query: "zipper pouch organizer small accessories" },
  { cat: "Everyday Carry", catSlug: "everyday-carry", brand: "DayGear", query: "badge holder reel retractable ID clip" },

  // ── CATEGORY 14: Travel Accessories
  { cat: "Travel Accessories", catSlug: "travel-accessories", brand: "AeroTravel", query: "RFID passport wallet travel holder" },
  { cat: "Travel Accessories", catSlug: "travel-accessories", brand: "AeroTravel", query: "luggage tag leather personalized" },
  { cat: "Travel Accessories", catSlug: "travel-accessories", brand: "AeroTravel", query: "packing cubes compression set travel" },
  { cat: "Travel Accessories", catSlug: "travel-accessories", brand: "RoamKit", query: "travel bottles set leak proof tsa" },
  { cat: "Travel Accessories", catSlug: "travel-accessories", brand: "RoamKit", query: "travel toiletry bag hanging organizer" },
  { cat: "Travel Accessories", catSlug: "travel-accessories", brand: "RoamKit", query: "travel pillow inflatable neck compact" },
  { cat: "Travel Accessories", catSlug: "travel-accessories", brand: "JetSet Co", query: "travel adapter universal compact plug" },
  { cat: "Travel Accessories", catSlug: "travel-accessories", brand: "JetSet Co", query: "cable organizer travel tech pouch" },
  { cat: "Travel Accessories", catSlug: "travel-accessories", brand: "JetSet Co", query: "luggage strap belt suitcase security" },
  { cat: "Travel Accessories", catSlug: "travel-accessories", brand: "MapMade", query: "scratch map world travel poster" },
  { cat: "Travel Accessories", catSlug: "travel-accessories", brand: "MapMade", query: "travel journal passport size notebook" },
  { cat: "Travel Accessories", catSlug: "travel-accessories", brand: "MapMade", query: "dry bag waterproof pouch phone roll top" },

  // ── CATEGORY 15: Pet Accessories
  { cat: "Pet Accessories", catSlug: "pet-accessories", brand: "Paws & Trek", query: "reflective dog leash heavy duty 6ft" },
  { cat: "Pet Accessories", catSlug: "pet-accessories", brand: "Paws & Trek", query: "collapsible silicone dog bowl travel" },
  { cat: "Pet Accessories", catSlug: "pet-accessories", brand: "Paws & Trek", query: "dog poop bag holder leash dispenser" },
  { cat: "Pet Accessories", catSlug: "pet-accessories", brand: "FurFriend", query: "cat self groomer brush wall corner" },
  { cat: "Pet Accessories", catSlug: "pet-accessories", brand: "FurFriend", query: "pet deshedding brush tool grooming" },
  { cat: "Pet Accessories", catSlug: "pet-accessories", brand: "FurFriend", query: "cat toy interactive ball set feather" },
  { cat: "Pet Accessories", catSlug: "pet-accessories", brand: "PetNest", query: "slow feeder bowl dog cat ceramic" },
  { cat: "Pet Accessories", catSlug: "pet-accessories", brand: "PetNest", query: "dog bandana set washable cotton" },
  { cat: "Pet Accessories", catSlug: "pet-accessories", brand: "PetNest", query: "pet blanket fleece washable couch" },
  { cat: "Pet Accessories", catSlug: "pet-accessories", brand: "WildTail", query: "pet water bottle portable dog drinking" },
  { cat: "Pet Accessories", catSlug: "pet-accessories", brand: "WildTail", query: "cat tunnel toy collapsible play tube" },
  { cat: "Pet Accessories", catSlug: "pet-accessories", brand: "WildTail", query: "pet nail file grinder small quiet" },

  // ── CATEGORY 16: Plant Care & Indoor Garden
  { cat: "Plant Care", catSlug: "plant-care", brand: "Verdant Supply", query: "brass soil moisture meter indoor plants" },
  { cat: "Plant Care", catSlug: "plant-care", brand: "Verdant Supply", query: "self watering planter insert globe" },
  { cat: "Plant Care", catSlug: "plant-care", brand: "Verdant Supply", query: "plant mister spray bottle glass" },
  { cat: "Plant Care", catSlug: "plant-care", brand: "RootRise", query: "propagation station glass vase set" },
  { cat: "Plant Care", catSlug: "plant-care", brand: "RootRise", query: "ceramic plant pot drainage hole small" },
  { cat: "Plant Care", catSlug: "plant-care", brand: "RootRise", query: "plant labels markers waterproof stake" },
  { cat: "Plant Care", catSlug: "plant-care", brand: "LeafLore", query: "pruning shears bonsai scissors precision" },
  { cat: "Plant Care", catSlug: "plant-care", brand: "LeafLore", query: "plant hangers macrame cotton handmade" },
  { cat: "Plant Care", catSlug: "plant-care", brand: "LeafLore", query: "plant food liquid fertilizer small bottle" },
  { cat: "Plant Care", catSlug: "plant-care", brand: "SproutKit", query: "grow light LED clip plant indoor" },
  { cat: "Plant Care", catSlug: "plant-care", brand: "SproutKit", query: "seed starting kit tray dome indoor" },
  { cat: "Plant Care", catSlug: "plant-care", brand: "SproutKit", query: "herb garden kit kitchen windowsill" },

  // ── CATEGORY 19: Cleaning & Laundry
  { cat: "Cleaning & Laundry", catSlug: "cleaning-laundry", brand: "CleanSet", query: "microfiber cleaning cloth set kitchen" },
  { cat: "Cleaning & Laundry", catSlug: "cleaning-laundry", brand: "CleanSet", query: "scrub brush set bathroom grout tile" },
  { cat: "Cleaning & Laundry", catSlug: "cleaning-laundry", brand: "CleanSet", query: "drain hair catcher strainer shower" },
  { cat: "Cleaning & Laundry", catSlug: "cleaning-laundry", brand: "FreshFold", query: "laundry mesh bag delicate wash zipper" },
  { cat: "Cleaning & Laundry", catSlug: "cleaning-laundry", brand: "FreshFold", query: "wrinkle release spray clothes travel" },
  { cat: "Cleaning & Laundry", catSlug: "cleaning-laundry", brand: "FreshFold", query: "lint roller set sheets travel refill" },
  { cat: "Cleaning & Laundry", catSlug: "cleaning-laundry", brand: "PressLine", query: "travel steamer garment portable wrinkle" },
  { cat: "Cleaning & Laundry", catSlug: "cleaning-laundry", brand: "PressLine", query: "clothespin set stainless rust proof" },
  { cat: "Cleaning & Laundry", catSlug: "cleaning-laundry", brand: "PressLine", query: "foldable laundry bag large capacity" },
  { cat: "Cleaning & Laundry", catSlug: "cleaning-laundry", brand: "SpotFree", query: "stain remover pen travel stick" },
  { cat: "Cleaning & Laundry", catSlug: "cleaning-laundry", brand: "SpotFree", query: "washing net fine mesh lingerie" },
  { cat: "Cleaning & Laundry", catSlug: "cleaning-laundry", brand: "SpotFree", query: "vacuum storage bags travel clothing" },

  // ── CATEGORY 26: Baby & Toddler Accessories
  { cat: "Baby Accessories", catSlug: "baby-accessories", brand: "TinyNest", query: "silicone teether toy baby set" },
  { cat: "Baby Accessories", catSlug: "baby-accessories", brand: "TinyNest", query: "baby food storage containers silicone" },
  { cat: "Baby Accessories", catSlug: "baby-accessories", brand: "TinyNest", query: "baby nail file safe newborn set" },
  { cat: "Baby Accessories", catSlug: "baby-accessories", brand: "LittleHold", query: "silicone bib pocket waterproof baby" },
  { cat: "Baby Accessories", catSlug: "baby-accessories", brand: "LittleHold", query: "pacifier clip holder set baby" },
  { cat: "Baby Accessories", catSlug: "baby-accessories", brand: "LittleHold", query: "baby hair band bow set soft" },
  { cat: "Baby Accessories", catSlug: "baby-accessories", brand: "MiniMade", query: "reusable snack bag set small kids" },
  { cat: "Baby Accessories", catSlug: "baby-accessories", brand: "MiniMade", query: "kids water bottle straw sippy" },
  { cat: "Baby Accessories", catSlug: "baby-accessories", brand: "MiniMade", query: "crayons set twist triangle toddler" },
  { cat: "Baby Accessories", catSlug: "baby-accessories", brand: "SproutWear", query: "baby sock set non slip newborn" },
  { cat: "Baby Accessories", catSlug: "baby-accessories", brand: "SproutWear", query: "muslin swaddle blanket set cotton" },
  { cat: "Baby Accessories", catSlug: "baby-accessories", brand: "SproutWear", query: "baby sun hat summer adjustable" },

  // ── CATEGORY 27: Men's Grooming (Cleaned)
  { cat: "Men's Grooming", catSlug: "mens-grooming", brand: "Groom & Go", query: "beard comb pocket travel wooden" },
  { cat: "Men's Grooming", catSlug: "mens-grooming", brand: "Groom & Go", query: "beard brush boar bristle wood handle" },
  { cat: "Men's Grooming", catSlug: "mens-grooming", brand: "Groom & Go", query: "shaving brush synthetic knot set" },
  // FIXED: Removed "razor stand chrome holder blade" to prevent weapon flags
  { cat: "Men's Grooming", catSlug: "mens-grooming", brand: "ShaveCraft", query: "beard shaping tool template comb" },
  { cat: "Men's Grooming", catSlug: "mens-grooming", brand: "ShaveCraft", query: "alum block aftershave styptic" },
  { cat: "Men's Grooming", catSlug: "mens-grooming", brand: "EdgeKit", query: "nose ear trimmer manual small" },
  { cat: "Men's Grooming", catSlug: "mens-grooming", brand: "EdgeKit", query: "cuticle pusher nail set men grooming" },
  { cat: "Men's Grooming", catSlug: "mens-grooming", brand: "EdgeKit", query: "dopp kit bag toiletry travel men" },
  { cat: "Men's Grooming", catSlug: "mens-grooming", brand: "NeatLine", query: "nail clipper set stainless mens" },
  { cat: "Men's Grooming", catSlug: "mens-grooming", brand: "NeatLine", query: "cologne atomizer refillable travel spray" },
  { cat: "Men's Grooming", catSlug: "mens-grooming", brand: "NeatLine", query: "face roller ice derma tool mens" },

  // ── CATEGORY 28: Outdoor & Picnic
  { cat: "Outdoor & Picnic", catSlug: "outdoor-picnic", brand: "OutKraft", query: "picnic blanket waterproof foldable sand" },
  { cat: "Outdoor & Picnic", catSlug: "outdoor-picnic", brand: "OutKraft", query: "bamboo picnic cutlery set reusable" },
  { cat: "Outdoor & Picnic", catSlug: "outdoor-picnic", brand: "OutKraft", query: "portable coffee press travel mug" },
  { cat: "Outdoor & Picnic", catSlug: "outdoor-picnic", brand: "GreenTrail", query: "reusable food wrap beeswax set" },
  { cat: "Outdoor & Picnic", catSlug: "outdoor-picnic", brand: "GreenTrail", query: "stainless straw set bamboo carrying case" },
  { cat: "Outdoor & Picnic", catSlug: "outdoor-picnic", brand: "GreenTrail", query: "silicone zip bag reusable freezer" },
  { cat: "Outdoor & Picnic", catSlug: "outdoor-picnic", brand: "PackLight", query: "lightweight foldable hat sun packable" },
  { cat: "Outdoor & Picnic", catSlug: "outdoor-picnic", brand: "PackLight", query: "travel umbrella compact wind resistant" },
  { cat: "Outdoor & Picnic", catSlug: "outdoor-picnic", brand: "PackLight", query: "bug repellent bracelet citronella" },
  { cat: "Outdoor & Picnic", catSlug: "outdoor-picnic", brand: "CampBite", query: "s'mores kit roasting set bamboo" },
  { cat: "Outdoor & Picnic", catSlug: "outdoor-picnic", brand: "CampBite", query: "camp mug enamel set hiking" },
  { cat: "Outdoor & Picnic", catSlug: "outdoor-picnic", brand: "CampBite", query: "waterproof dry bag pouch phone hiking" },

  // ── CATEGORY 29: Wellness & Supplements Accessories (Cleaned)
  { cat: "Wellness Accessories", catSlug: "wellness-accessories", brand: "PureHabit", query: "pill organizer 7 day weekly compartment" },
  { cat: "Wellness Accessories", catSlug: "wellness-accessories", brand: "PureHabit", query: "vitamin storage case daily portable" },
  { cat: "Wellness Accessories", catSlug: "wellness-accessories", brand: "PureHabit", query: "protein shaker bottle blender ball" },
  // FIXED: Removed "posture corrector" and "blood pressure monitor" to prevent medical flags
  { cat: "Wellness Accessories", catSlug: "wellness-accessories", brand: "BodyRite", query: "eye mask heat warm soothing" },
  { cat: "Wellness Accessories", catSlug: "wellness-accessories", brand: "BodyRite", query: "hot cold gel pack reusable back" },
  { cat: "Wellness Accessories", catSlug: "wellness-accessories", brand: "MindBody Co", query: "foot massager roller ball spiked" },
  { cat: "Wellness Accessories", catSlug: "wellness-accessories", brand: "MindBody Co", query: "tongue scraper stainless steel set" },
  { cat: "Wellness Accessories", catSlug: "wellness-accessories", brand: "ZenDose", query: "herbal tea infuser strainer stainless" },
  { cat: "Wellness Accessories", catSlug: "wellness-accessories", brand: "ZenDose", query: "meal prep containers set glass" },
  { cat: "Wellness Accessories", catSlug: "wellness-accessories", brand: "ZenDose", query: "water filter pitcher small countertop" },

  // ── CATEGORY 30: Party & Gifting
  { cat: "Party & Gifting", catSlug: "party-gifting", brand: "WrapRight", query: "gift wrapping paper set flat sheet" },
  { cat: "Party & Gifting", catSlug: "party-gifting", brand: "WrapRight", query: "ribbon bow set satin gift wrapping" },
  { cat: "Party & Gifting", catSlug: "party-gifting", brand: "WrapRight", query: "kraft gift tags set string label" },
  { cat: "Party & Gifting", catSlug: "party-gifting", brand: "TieTheBow", query: "tissue paper set bulk decorative" },
  { cat: "Party & Gifting", catSlug: "party-gifting", brand: "TieTheBow", query: "gift box set small square cardboard" },
  { cat: "Party & Gifting", catSlug: "party-gifting", brand: "TieTheBow", query: "reusable gift bag set fabric" },
  { cat: "Party & Gifting", catSlug: "party-gifting", brand: "FestiveKit", query: "balloon set rose gold metallic party" },
  { cat: "Party & Gifting", catSlug: "party-gifting", brand: "FestiveKit", query: "cake topper set birthday acrylic" },
  { cat: "Party & Gifting", catSlug: "party-gifting", brand: "FestiveKit", query: "confetti set biodegradable party" },
  { cat: "Party & Gifting", catSlug: "party-gifting", brand: "MementoMade", query: "photo album small pocket prints" },
  { cat: "Party & Gifting", catSlug: "party-gifting", brand: "MementoMade", query: "greeting card set blank assorted" },
  { cat: "Party & Gifting", catSlug: "party-gifting", brand: "MementoMade", query: "mini envelope set letter writing set" },

  // ── CATEGORY 35: Gift Boxes & Packaging
  { cat: "Gift Boxes & Packaging", catSlug: "gift-boxes-packaging", brand: "BoxCraft", query: "kraft gift box set small medium" },
  { cat: "Gift Boxes & Packaging", catSlug: "gift-boxes-packaging", brand: "BoxCraft", query: "corrugated shipping box small mailer" },
  { cat: "Gift Boxes & Packaging", catSlug: "gift-boxes-packaging", brand: "BoxCraft", query: "window box favor packaging set" },
  { cat: "Gift Boxes & Packaging", catSlug: "gift-boxes-packaging", brand: "WrapHouse", query: "magnetic closure gift box rigid set" },
  { cat: "Gift Boxes & Packaging", catSlug: "gift-boxes-packaging", brand: "WrapHouse", query: "organza bag set sheer jewelry pouch" },
  { cat: "Gift Boxes & Packaging", catSlug: "gift-boxes-packaging", brand: "WrapHouse", query: "twine string natural jute packaging" },
  { cat: "Gift Boxes & Packaging", catSlug: "gift-boxes-packaging", brand: "PackWell", query: "filler paper shredded kraft box" },
  { cat: "Gift Boxes & Packaging", catSlug: "gift-boxes-packaging", brand: "PackWell", query: "bubble wrap roll small fragile" },
  { cat: "Gift Boxes & Packaging", catSlug: "gift-boxes-packaging", brand: "PackWell", query: "thank you card set business small" },
  { cat: "Gift Boxes & Packaging", catSlug: "gift-boxes-packaging", brand: "SealIt", query: "wax seal kit stamper envelope set" },
  { cat: "Gift Boxes & Packaging", catSlug: "gift-boxes-packaging", brand: "SealIt", query: "label sticker set waterproof round" },
  { cat: "Gift Boxes & Packaging", catSlug: "gift-boxes-packaging", brand: "SealIt", query: "ribbon pull bow set gift decoration" },

  // ── CATEGORY 36: Jewellery Accessories
  { cat: "Jewellery Accessories", catSlug: "jewellery-accessories", brand: "TrinketsHaven", query: "jewellery organizer stand holder tree" },
  { cat: "Jewellery Accessories", catSlug: "jewellery-accessories", brand: "TrinketsHaven", query: "ring dish ceramic tray small" },
  { cat: "Jewellery Accessories", catSlug: "jewellery-accessories", brand: "TrinketsHaven", query: "necklace display stand bust holder" },
  { cat: "Jewellery Accessories", catSlug: "jewellery-accessories", brand: "ClaspRight", query: "earring organizer acrylic display stand" },
  { cat: "Jewellery Accessories", catSlug: "jewellery-accessories", brand: "ClaspRight", query: "jewelry storage roll travel leather" },
  { cat: "Jewellery Accessories", catSlug: "jewellery-accessories", brand: "ClaspRight", query: "anti tarnish strip set silver" },
  { cat: "Jewellery Accessories", catSlug: "jewellery-accessories", brand: "GemKeep", query: "jewelry cleaning cloth polishing silver" },
  { cat: "Jewellery Accessories", catSlug: "jewellery-accessories", brand: "GemKeep", query: "ring sizer tool set finger gauge" },
  { cat: "Jewellery Accessories", catSlug: "jewellery-accessories", brand: "GemKeep", query: "jewelry repair kit pliers tool" },
  { cat: "Jewellery Accessories", catSlug: "jewellery-accessories", brand: "SparkCase", query: "small jewelry box travel case" },
  { cat: "Jewellery Accessories", catSlug: "jewellery-accessories", brand: "SparkCase", query: "bracelet clasp helper tool one hand" },
  { cat: "Jewellery Accessories", catSlug: "jewellery-accessories", brand: "SparkCase", query: "charm bracelet making kit beads set" },

  // ── CATEGORY 37: Spice & Pantry Tools
  { cat: "Spice & Pantry Tools", catSlug: "spice-pantry-tools", brand: "SpiceVault", query: "magnetic spice tin set stackable" },
  { cat: "Spice & Pantry Tools", catSlug: "spice-pantry-tools", brand: "SpiceVault", query: "mortar pestle set granite small" },
  { cat: "Spice & Pantry Tools", catSlug: "spice-pantry-tools", brand: "SpiceVault", query: "spice grinder manual ceramic burr" },
  { cat: "Spice & Pantry Tools", catSlug: "spice-pantry-tools", brand: "PantryLine", query: "jar labels waterproof pantry set" },
  { cat: "Spice & Pantry Tools", catSlug: "spice-pantry-tools", brand: "PantryLine", query: "condiment dispenser squeeze bottle set" },
  { cat: "Spice & Pantry Tools", catSlug: "spice-pantry-tools", brand: "PantryLine", query: "oil pourer spout bottle set stainless" },
  { cat: "Spice & Pantry Tools", catSlug: "spice-pantry-tools", brand: "GrindRight", query: "pepper salt grinder set refillable" },
  { cat: "Spice & Pantry Tools", catSlug: "spice-pantry-tools", brand: "GrindRight", query: "kitchen timer mechanical analog" },
  { cat: "Spice & Pantry Tools", catSlug: "spice-pantry-tools", brand: "GrindRight", query: "recipe card holder binder kitchen" },
  { cat: "Spice & Pantry Tools", catSlug: "spice-pantry-tools", brand: "HerbLab", query: "herb keeper fresh storage fridge" },
  { cat: "Spice & Pantry Tools", catSlug: "spice-pantry-tools", brand: "HerbLab", query: "food thermometer instant read kitchen" },
  { cat: "Spice & Pantry Tools", catSlug: "spice-pantry-tools", brand: "HerbLab", query: "reusable coffee pod filter refillable" },

  // ── CATEGORY 39: Men's Accessories
  { cat: "Men's Accessories", catSlug: "mens-accessories", brand: "VaultClip", query: "money clip slim stainless steel" },
  { cat: "Men's Accessories", catSlug: "mens-accessories", brand: "VaultClip", query: "card holder slim bifold leather" },
  { cat: "Men's Accessories", catSlug: "mens-accessories", brand: "VaultClip", query: "cufflinks set silver minimalist" },
  { cat: "Men's Accessories", catSlug: "mens-accessories", brand: "TieRight", query: "tie bar clip set gold silver" },
  { cat: "Men's Accessories", catSlug: "mens-accessories", brand: "TieRight", query: "belt accessories buckle replacement" },
  { cat: "Men's Accessories", catSlug: "mens-accessories", brand: "TieRight", query: "lapel pin set enamel small" },
  { cat: "Men's Accessories", catSlug: "mens-accessories", brand: "GentFrame", query: "sunglasses cleaning kit pouch microfiber" },
  { cat: "Men's Accessories", catSlug: "mens-accessories", brand: "GentFrame", query: "watch roll case travel holder leather" },
  { cat: "Men's Accessories", catSlug: "mens-accessories", brand: "GentFrame", query: "pocket square set men formal" },
  { cat: "Men's Accessories", catSlug: "mens-accessories", brand: "ClassicKnot", query: "sock set men patterned crew gift" },
  { cat: "Men's Accessories", catSlug: "mens-accessories", brand: "ClassicKnot", query: "men gloves leather lined winter" },
  { cat: "Men's Accessories", catSlug: "mens-accessories", brand: "ClassicKnot", query: "cologne travel set atomizer sampler" },

  // ── CATEGORY 40: Women's Accessories
  { cat: "Women's Accessories", catSlug: "womens-accessories", brand: "PearlLine", query: "pearl pin set hair bridal" },
  { cat: "Women's Accessories", catSlug: "womens-accessories", brand: "PearlLine", query: "silk scarf small square neck" },
  { cat: "Women's Accessories", catSlug: "womens-accessories", brand: "PearlLine", query: "tote bag lightweight foldable women" },
  { cat: "Women's Accessories", catSlug: "womens-accessories", brand: "BloomBag", query: "makeup bag pouch zipper large" },
  { cat: "Women's Accessories", catSlug: "womens-accessories", brand: "BloomBag", query: "coin purse small leather zip" },
  { cat: "Women's Accessories", catSlug: "womens-accessories", brand: "BloomBag", query: "phone wallet card holder women" },
  { cat: "Women's Accessories", catSlug: "womens-accessories", brand: "GraceCase", query: "sunglasses case hard shell compact" },
  { cat: "Women's Accessories", catSlug: "womens-accessories", brand: "GraceCase", query: "mirror compact foldable pocket" },
  { cat: "Women's Accessories", catSlug: "womens-accessories", brand: "GraceCase", query: "umbrella compact mini automatic women" },
  { cat: "Women's Accessories", catSlug: "womens-accessories", brand: "VelvetPouch", query: "jewelry pouch drawstring velvet set" },
  { cat: "Women's Accessories", catSlug: "womens-accessories", brand: "VelvetPouch", query: "hair tie set seamless thick sport" },
  { cat: "Women's Accessories", catSlug: "womens-accessories", brand: "VelvetPouch", query: "gloves women wool lined winter" }
];

const TARGET_FILE = path.join(dataDir, 'rapidapi-catalog.json');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function cleanTitle(raw) {
  let t = raw.split(',')[0].split('|')[0].split('-')[0].trim();
  return t.length > 65 ? t.substring(0, 65) + '…' : t;
}

function parsePrice(raw) {
  if (!raw) return null;
  const n = parseFloat(raw.replace(/[^0-9.]/g, ''));
  return isNaN(n) ? null : n;
}

function fallbackPrice(cat) {
  const bands = {
    default: [12, 49],
    tools: [9, 39],
    accessory: [8, 35],
    decor: [15, 59],
    grooming: [10, 45],
    wellness: [12, 55],
  };
  const key = /tool|gadget|kit/i.test(cat) ? 'tools'
    : /decor|lamp|light|candle/i.test(cat) ? 'decor'
      : /groom|skin|hair/i.test(cat) ? 'grooming'
        : /wellness|fitness|meditat/i.test(cat) ? 'wellness'
          : /wallet|bag|pouch|case|holder/i.test(cat) ? 'accessory'
            : 'default';
  const [min, max] = bands[key];
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

async function fetchCatalog() {
  // CRITICAL TOKEN GUARD: Only execute the first 2 queries of EVERY category (40 total calls)
  const SAFE_TARGETS = [];
  const categoryCounts = {};

  for (const target of SEARCH_TARGETS) {
    if (!categoryCounts[target.cat]) categoryCounts[target.cat] = 0;
    if (categoryCounts[target.cat] < 2) {
      SAFE_TARGETS.push(target);
      categoryCounts[target.cat]++;
    }
  }

  console.log(`\n🚀 Symeno Catalog Ingest — Executing ${SAFE_TARGETS.length} protected queries across 20 categories.\n`);

  let catalog = [];
  let fetched = 0;
  let failed = 0;
  let blockedCount = 0; // Tracking compliance blocks

  for (const target of SAFE_TARGETS) {
    const url = `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(target.query)}&page=1&country=US&sort_by=REVIEWS`;

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com',
          'x-rapidapi-key': API_KEY
        }
      });

      const json = await res.json();

      if (!json?.data?.products?.length) {
        console.warn(`  ⚠ No results — ${target.cat} / ${target.brand} / "${target.query}"`);
        failed++;
        await delay(1000);
        continue;
      }

      // Filter products through the Compliance Shield BEFORE mapping
      const validRawProducts = json.data.products.filter(item => {
        const isSafe = isCompliant(item.product_title, "", target.brand);
        if (!isSafe) blockedCount++;
        return isSafe;
      });

      // Take top 3 compliant products per query
      const products = validRawProducts.slice(0, 3).map(item => {
        const basePrice = parsePrice(item.product_price) ?? fallbackPrice(target.cat);
        const retailPrice = parsePrice(item.product_original_price) ?? (basePrice * 1.25);

        return {
          id: item.asin,
          slug: item.product_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 55),
          category: target.cat,
          categorySlug: target.catSlug,
          brand: target.brand,
          title: cleanTitle(item.product_title),
          description: `${target.brand} ${target.cat.toLowerCase()} — authentic quality, carefully selected for everyday use.`,
          basePrice,
          retailPrice: retailPrice > basePrice ? parseFloat(retailPrice.toFixed(2)) : null,
          rating: item.product_star_rating ? parseFloat(item.product_star_rating) : null,
          reviewCount: item.product_num_ratings ?? null,
          stockStatus: 'IN_STOCK',
          images: item.product_photo ? [item.product_photo] : [],
          source: 'rapidapi',
        };
      });

      catalog.push(...products);
      fetched++;
      const pct = ((fetched / SAFE_TARGETS.length) * 100).toFixed(1);
      console.log(`  ✓ [${pct}%] ${target.cat} › ${target.brand} — ${products.length} products (Blocked: ${blockedCount})`);
      await delay(1200);
    } catch (err) {
      console.error(`  ✗ Error — ${target.cat} / "${target.query}":`, err.message);
      failed++;
      await delay(1500);
    }
  }

  const seen = new Set();
  const unique = catalog.filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  fs.writeFileSync(TARGET_FILE, JSON.stringify(unique, null, 2));
  console.log(`\n✅ INGEST COMPLETE. Saved ${unique.length} compliant products to ${TARGET_FILE}.`);
  console.log(`🛡️ COMPLIANCE SHIELD: Successfully blocked ${blockedCount} restricted items from entering the catalog.`);
}

fetchCatalog();