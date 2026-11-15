require('dotenv').config();
const slugify = require('slugify');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const Collection = require('../models/Collection');
const Product = require('../models/Product');
const Banner = require('../models/Banner');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');
const WebsiteSettings = require('../models/WebsiteSettings');

/**
 * IMPORTANT PHOTOGRAPHY COMPLIANCE NOTE (Section 3):
 * All seeded reference images below are legally licensed Wikimedia Commons (CC0 / CC-BY-SA)
 * and Unsplash License photographs of authentic Indian jewellery.
 * Zero AI-generated jewellery images are used.
 * Every seeded product and image is explicitly flagged with `isDemo: true` and `isDemoProduct: true`
 * so the store owner can replace all temporary reference images via the Admin Dashboard before launch.
 */

const CATEGORIES_DATA = [
  { name: 'Gold Jewellery', description: 'BIS 916 hallmarked 22K gold heirlooms hand-forged by master Indian karigars.' },
  { name: 'Silver Jewellery', description: 'Pure 92.5 sterling silver temple and artisanal jewellery.' },
  { name: 'Diamond Jewellery', description: 'EF-VVS certified natural diamond solitaires and chandelier settings in 18K gold.' },
  { name: 'Kundan Jewellery', description: 'Royal Bikaneri and Jaipuri 24K foil Kundan settings with Meenakari reverse enamelling.' },
  { name: 'Polki Jewellery', description: 'Uncut syndicate Polki diamonds set in heritage 22K gold.' },
  { name: 'Bridal Jewellery', description: 'Complete royal Indian bridal trousseau sets including rani haars, chokers, and maang tikkas.' },
  { name: 'Necklaces', description: 'Statement chokers, hanslis, satladas, and layered temple harams.' },
  { name: 'Earrings', description: 'Sculpted jhumkas, chandbalis, kanphools, and solitaire studs.' },
  { name: 'Bangles', description: 'Hand-carved kadas, pachchikam bangles, and gold stackables.' },
  { name: 'Rings', description: 'Navratna signets, cocktail rings, and certified diamond engagement bands.' },
  { name: 'Mangalsutra', description: 'Sacred black-bead and 22K gold contemporary and heritage mangalsutras.' },
  { name: 'Nose Pins', description: 'Bridal naths, Maharashtrian mukhuttis, and delicate diamond nose studs.' },
  { name: 'Temple Jewellery', description: 'South Indian Nakshi gold workmanship inspired by temple architecture.' },
];

const seedAll = async () => {
  try {
    await connectDB();
    await Promise.all([
      Category.deleteMany({}),
      Collection.deleteMany({}),
      Product.deleteMany({}),
      Banner.deleteMany({}),
      Testimonial.deleteMany({}),
      FAQ.deleteMany({}),
    ]);

    const createdCategories = await Category.insertMany(
      CATEGORIES_DATA.map((cat, idx) => ({
        name: cat.name,
        slug: slugify(cat.name, { lower: true, strict: true }),
        description: cat.description,
        displayOrder: idx + 1,
        isActive: true,
        image: {
          url: 'https://commons.wikimedia.org/wiki/Special:FilePath/British_Museum_The_Islamic_world_Necklace_Kundan_India_21022019_7703.jpg?width=800',
          alt: `${cat.name} reference photography`,
          isDemo: true,
          licenseInfo: 'Wikimedia Commons CC0 1.0 Public Domain Dedication (Vassil)',
        },
      }))
    );

    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.name] = c._id;
    });

    const collections = await Collection.insertMany([
      {
        name: 'Royal Mewar Bridal Trousseau',
        slug: 'royal-mewar-bridal-trousseau',
        subtitle: '22K Jadau Kundan & Uncut Polki Heirlooms',
        description: 'Inspired by royal Rajputana archives, featuring hand-foiled Kundan chokers and emerald drops.',
        bannerImage: {
          url: 'https://commons.wikimedia.org/wiki/Special:FilePath/British_Museum_The_Islamic_world_Necklace_Kundan_India_21022019_7703.jpg?width=1200',
          alt: 'Royal Kundan necklace with pearls, rubies, diamonds and emerald',
          isDemo: true,
          licenseInfo: 'Wikimedia Commons CC0 1.0 Public Domain',
        },
        isFeatured: true,
        isVisible: true,
        displayOrder: 1,
      },
      {
        name: 'Dakshin Temple Nakshi',
        slug: 'dakshin-temple-nakshi',
        subtitle: 'Antique 22K Gold Repoussé Workmanship',
        description: 'Sacred mango-motif harams, Lakshmi jhumkas, and sculpted kadas crafted in South India.',
        bannerImage: {
          url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Khalili_Collection_Islamic_Art_jly_1261.5.jpg?width=1200',
          alt: 'South Indian mango-shaped gold Kundan necklace with pearls',
          isDemo: true,
          licenseInfo: 'Khalili Collection / Wikimedia Commons CC-BY-SA 3.0 IGO',
        },
        isFeatured: true,
        isVisible: true,
        displayOrder: 2,
      },
    ]);

    await Product.insertMany([
      {
        name: 'Maharani Bikaneri Jadau Kundan & Emerald Choker [DEMO REFERENCE]',
        sku: 'AAR-KND-001',
        slug: 'maharani-bikaneri-jadau-kundan-emerald-choker',
        shortDescription: 'Hand-foiled 22K gold Kundan bridal necklace with Burmese ruby cabochons and emerald drops.',
        fullDescription:
          'Crafted over 420 hours by master Bikaneri karigars, this ceremonial Kundan necklace sets uncut flat diamonds in refined 24K gold kundala foil on a 22K hallmarked chassis, finished with hand-painted Meenakari floral motifs on the reverse.',
        category: catMap['Kundan Jewellery'],
        collectionRef: collections[0]._id,
        price: 385000,
        originalPrice: 410000,
        metalType: 'Kundan & Gold',
        purity: '22K (916 BIS Hallmarked) + 24K Kundan Foil',
        purityVerified: true,
        weightGrams: 68.4,
        weightVerified: true,
        stoneDetails: 'Uncut Polki, Cabochon Rubies, Zambian Emerald Drops & Basra-style Seed Pearls',
        occasion: 'Bridal',
        sizes: ['Adjustable Silk Dori (14–18 inches)'],
        specifications: [
          { label: 'Gross Weight', value: '68.40 grams' },
          { label: 'Net Gold Weight', value: '52.10 grams' },
          { label: 'Hallmark Certification', value: 'BIS 916 HUID Verified' },
          { label: 'Reverse Finish', value: 'Jaipuri Red & Green Meenakari Enamel' },
        ],
        availability: 'In Store & Ready',
        isFeatured: true,
        isNewArrival: true,
        isBestseller: true,
        isDemoProduct: true,
        images: [
          {
            url: 'https://commons.wikimedia.org/wiki/Special:FilePath/British_Museum_The_Islamic_world_Necklace_Kundan_India_21022019_7703.jpg?width=900',
            publicId: 'demo_kundan_001',
            alt: 'Royal Kundan necklace with pearls, rubies, diamonds and emerald on display',
            isMain: true,
            order: 0,
            isDemo: true,
            licenseSource: 'Wikimedia Commons CC0 1.0 Public Domain (Author: Vassil)',
            licenseUrl: 'https://commons.wikimedia.org/wiki/File:British_Museum_The_Islamic_world_Necklace_Kundan_India_21022019_7703.jpg',
          },
        ],
      },
      {
        name: 'Madurai Mango-Mala Temple Kundan Haram [DEMO REFERENCE]',
        sku: 'AAR-TMP-002',
        slug: 'madurai-mango-mala-temple-kundan-haram',
        shortDescription: '32 mango-motif gold units with openwork central pendant and pearl clusters.',
        fullDescription:
          'Inspired by 19th-century Tamil Nadu bridal heirlooms, this temple haram links 32 sculpted mango (manga-malai) units threaded on quadruple gold chains with foiled rubies, emeralds, and natural pearl droplets.',
        category: catMap['Temple Jewellery'],
        collectionRef: collections[1]._id,
        price: 442000,
        originalPrice: null,
        metalType: 'Temple Gold',
        purity: '22K (916 BIS Hallmarked)',
        purityVerified: true,
        weightGrams: 76.2,
        weightVerified: true,
        stoneDetails: 'Foiled Rubies, Emeralds & Natural Pearl Drops',
        occasion: 'Temple & Ceremonial',
        sizes: ['Standard 20 inches'],
        specifications: [
          { label: 'Gross Weight', value: '76.20 grams' },
          { label: 'Motif Count', value: '32 Mango Units + Central Pendant' },
          { label: 'Origin Craft', value: 'Tamil Nadu Temple Goldsmithing' },
        ],
        availability: 'In Store & Ready',
        isFeatured: true,
        isNewArrival: false,
        isBestseller: true,
        isDemoProduct: true,
        images: [
          {
            url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Khalili_Collection_Islamic_Art_jly_1261.5.jpg?width=900',
            publicId: 'demo_temple_002',
            alt: 'South Indian gold mango-unit Kundan necklace with rubies, emeralds and pendant pearls',
            isMain: true,
            order: 0,
            isDemo: true,
            licenseSource: 'Khalili Collection / Wikimedia Commons CC-BY-SA 3.0 IGO',
            licenseUrl: 'https://commons.wikimedia.org/wiki/File:Khalili_Collection_Islamic_Art_jly_1261.5.jpg',
          },
        ],
      },
    ]);

    await Banner.create({
      title: 'Timeless Indian Jewellery',
      subtitle:
        'Handcrafted 22K Hallmarked Gold, Royal Bikaneri Kundan, and Certified Uncut Polki Heirlooms. Discover our curated showroom collections.',
      badgeText: 'BIS 916 Hallmarked • Heritage Karigari',
      ctaPrimaryText: 'Explore Collections',
      ctaPrimaryLink: '/collections',
      ctaSecondaryText: 'Visit Our Store',
      ctaSecondaryLink: '/contact',
      image: {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/British_Museum_The_Islamic_world_Necklace_Kundan_India_21022019_7703.jpg?width=1200',
        alt: 'AARANYA Timeless Indian Jewellery Hero Showcase',
        isDemo: true,
        licenseInfo: 'Wikimedia Commons CC0 1.0 Public Domain',
      },
      displayOrder: 1,
      isActive: true,
    });

    await Testimonial.insertMany([
      {
        customerName: 'Aditi Singhania',
        customerLocation: 'New Delhi',
        occasionPurchased: 'Bridal Trousseau Consultation',
        rating: 5,
        comment:
          'We visited the AARANYA showroom after shortlisting three Kundan chokers via WhatsApp. Every piece carried verified BIS 916 HUID stamps and clear net-gold breakdowns.',
        isApproved: true,
        displayOrder: 1,
      },
      {
        customerName: 'Meenakshi Iyer',
        customerLocation: 'Bengaluru',
        occasionPurchased: 'Temple Haram & Jhumka Set',
        rating: 5,
        comment:
          'The antique Nakshi detailing on the mango-mala haram feels like an authentic museum piece. Their showroom team walked us through every stone weight transparently.',
        isApproved: true,
        displayOrder: 2,
      },
    ]);

    await FAQ.insertMany([
      {
        category: 'Jewellery Materials',
        question: 'Are all AARANYA gold jewellery pieces BIS Hallmarked?',
        answer:
          'Yes. Every 22K (916) and 18K (750) gold creation carries an official BIS Hallmark with a unique 6-digit HUID code verifiable on the BIS Care App, alongside separate gross weight and net gold weight disclosures.',
        displayOrder: 1,
      },
      {
        category: 'Product Availability',
        question: 'Can I reserve a piece online before visiting the store?',
        answer:
          'Click "Enquire on WhatsApp" on any product page to share the exact SKU with our showroom concierge. We can hold in-stock pieces for 48 hours for your private viewing appointment.',
        displayOrder: 2,
      },
      {
        category: 'Store Visits',
        question: 'Do I need an appointment to visit the AARANYA showroom?',
        answer:
          'Walk-ins are always welcome during business hours (Tuesday–Sunday, 11:00 AM – 8:00 PM). For bridal trousseau consultations, we recommend booking a private slot via our Contact page or WhatsApp.',
        displayOrder: 3,
      },
      {
        category: 'Jewellery Care',
        question: 'How should I care for Kundan, Polki, and Meenakari jewellery?',
        answer:
          'Store Kundan and Polki pieces individually in soft muslin pouches away from moisture, perfumes, and ultrasonic cleaners. Wipe gently with a dry lint-free chamois cloth after each wear.',
        displayOrder: 4,
      },
      {
        category: 'Customisation',
        question: 'Do you offer bespoke bridal customisation?',
        answer:
          'Yes. Our karigars can customise necklace lengths, emerald/ruby bead drops, and matching jhumkas or હાથफूल (hathphool). Custom commissions typically require 14 to 28 days.',
        displayOrder: 5,
      },
      {
        category: 'Returns and Exchanges',
        question: 'What is your exchange and buyback policy?',
        answer:
          'Unused showroom purchases in original condition with tags and hallmark certificates are eligible for 100% value exchange within 7 days, subject to physical inspection at our store.',
        displayOrder: 6,
      },
    ]);

    await WebsiteSettings.findOneAndUpdate({}, {}, { upsert: true, new: true });

    console.log('[SeedData] AARANYA database seeded with licensed reference catalogue.');
    process.exit(0);
  } catch (err) {
    console.error('[SeedData Error]:', err);
    process.exit(1);
  }
};

seedAll();
