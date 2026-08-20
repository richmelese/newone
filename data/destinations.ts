import type { Destination } from '@/types';
import { unsplashPhoto, wikimediaPhoto } from '@/lib/images';

export const destinations: Destination[] = [
  {
    id: 'abajifar',
    slug: 'abajifar',
    name: 'Abajifar',
    region: 'Oromia',
    heroPhoto: wikimediaPhoto('Aba Jifar Palace, Jimma, Ethiopia (17362840816).jpg', 1600),
    cardPhoto: wikimediaPhoto('Aba Jifar Palace, Jimma, Ethiopia (17362840816).jpg', 900),
    tagline: {
      en: 'Historic royal palace & seat of the Kingdom of Jimma',
      am: 'የታሪካዊው የጅማ መንግሥት መቀመጫና ቤተ መንግሥት',
    },
    guide: {
      en: 'Abajifar Palace, located in Jiren near Jimma, was built in the 1880s as the grand seat of King Abba Jifar II. Surrounded by lush highland hills and rich coffee country, the wooden palace complex stands as a premier historic monument in southwestern Ethiopia.',
      am: 'የአባ ጅፋር ቤተ መንግሥት በጅማ አቅራቢያ በጅሬን የሚገኝ ሲሆን በ1880ዎቹ በንጉሥ አባ ጅፋር ሁለተኛ የተገነባ የንጉሣዊ መቀመጫ ነው። በአረንጓዴ ኮረብታዎችና በቡና ሀገር የተከበበ ታሪካዊ ቅርስ ነው።',
    },
    bestTime: { en: 'October – March', am: 'ጥቅምት – መጋቢት' },
    coords: { x: 34, y: 64 },
  },
  {
    id: 'axum',
    slug: 'axum',
    name: 'Axum',
    region: 'Tigray',
    heroPhoto: wikimediaPhoto('Axum Stelae, Tigray (52282003906).jpg', 1600),
    cardPhoto: wikimediaPhoto('Stelae Field in Axum, Ethiopia (2830293765).jpg', 900),
    tagline: {
      en: 'Ancient obelisks and the legend of the Ark',
      am: 'ጥንታዊ ሐውልቶችና የታቦተ ጽዮን አፈ ታሪክ',
    },
    guide: {
      en: 'Axum was the seat of an ancient empire and is said by tradition to hold the Ark of the Covenant. Towering granite stelae, royal tombs, and the Church of St. Mary of Zion draw history-minded travelers year-round.',
      am: 'አክሱም የጥንታዊ መንግሥት መቀመጫ የነበረች ስትሆን፣ በትውፊት መሠረት የታቦተ ጽዮንን ማደሪያ እንደያዘች ይነገርላታል። ረዣዥም የድንጋይ ሐውልቶች (እስቴላዎች)፣ የነገሥታት መቃብሮችና የጽዮን ማርያም ቤተ ክርስቲያን ታሪክ ወዳድ ጎብኚዎችን ዓመቱን ሙሉ ይስባሉ።',
    },
    bestTime: { en: 'October – February', am: 'ጥቅምት – የካቲት' },
    coords: { x: 41, y: 8 },
  },
  {
    id: 'ertale',
    slug: 'ertale',
    name: 'Ertale',
    region: 'Afar',
    heroPhoto: wikimediaPhoto('Erta Ale.jpg', 1600),
    cardPhoto: wikimediaPhoto('Erta Ale.jpg', 900),
    tagline: {
      en: 'Active volcano and persistent glowing lava lake',
      am: 'በዳናኪል ስምጥ ውስጥ የሚገኝ ሕያው እሳተ ጎመራና የላቫ ሐይቅ',
    },
    guide: {
      en: 'Ertale is an active shield volcano in the Afar Region of northeastern Ethiopia, famed worldwide for holding one of the rare continuous lava lakes on Earth. Adventurers trek across the Danakil Depression to witness the glowing volcanic crater beneath night skies.',
      am: 'ኤርታሌ በሰሜን ምስራቅ ኢትዮጵያ በአፋር ክልል የሚገኝ ንቁ እሳተ ጎመራ ሲሆን፣ በዓለም ላይ ካሉ ጥቂት ቋሚ የቀለጠ ላቫ ሐይቆች አንዱ በመሆን ይታወቃል።',
    },
    bestTime: { en: 'November – February', am: 'ሕዳር – የካቲት' },
    coords: { x: 62, y: 22 },
  },
  {
    id: 'lalibela',
    slug: 'lalibela',
    name: 'Lalibela',
    region: 'Amhara',
    heroPhoto: wikimediaPhoto('Bete Giyorgis 01.jpg', 1600),
    cardPhoto: wikimediaPhoto('Rock-Hewn Churches, Lalibela Ethiopia (1).jpg', 900),
    tagline: {
      en: 'Rock-hewn churches and centuries of pilgrimage',
      am: 'ከዓለት የተፈለፈሉ አብያተ ክርስቲያናትና የዘመናት ሐጅ',
    },
    guide: {
      en: 'Lalibela is home to eleven medieval monolithic churches carved directly into volcanic rock, still an active pilgrimage site for Ethiopian Orthodox Christians. Guesthouses and boutique lodges cluster near the churches for early-morning visits.',
      am: 'ላሊበላ ከድንጋይ ገዝፍ ተፈልፍለው የተሠሩ አሥራ አንድ የመካከለኛው ዘመን አብያተ ክርስቲያናት መገኛ ናት፤ አሁንም ድረስ ለኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ክርስቲያኖች የሐጅ ስፍራ ሆና ታገለግላለች። ለጠዋት ጉብኝት አመቺ እንዲሆኑ የመስተንግዶ ቤቶችና ትናንሽ ሎጆች በአብያተ ክርስቲያናቱ ዙሪያ ተሰባስበው ይገኛሉ።',
    },
    bestTime: { en: 'November – March', am: 'ሕዳር – መጋቢት' },
    coords: { x: 44, y: 26 },
  },
  {
    id: 'addis-ababa',
    slug: 'addis-ababa',
    name: 'Addis Ababa',
    region: 'Addis Ababa',
    heroPhoto: wikimediaPhoto('Addis Ababa sky view.jpg', 1600),
    cardPhoto: unsplashPhoto('1604560842632-bd795d8f1275', 900),
    tagline: {
      en: 'Ethiopia’s capital — diplomacy, culture, and city life',
      am: 'የኢትዮጵያ ዋና ከተማ — ዲፕሎማሲ፣ ባህልና የከተማ ሕይወት',
    },
    guide: {
      en: 'Addis Ababa is the diplomatic heart of Africa, home to the African Union headquarters, bustling markets like Mercato, and a fast-growing dining and hotel scene. Base yourself here for museums, live jazz, and easy connections across the country.',
      am: 'አዲስ አበባ የአፍሪካ ኅብረት ዋና መሥሪያ ቤት የሚገኝባት፣ የአፍሪካ ዲፕሎማሲያዊ ማዕከል ናት። የመርካቶ ገበያ፣ ዘመናዊ ምግብ ቤቶችና ሆቴሎች በስፋት ይገኙባታል። ለሙዚየሞች፣ ለሕያው ጃዝ ሙዚቃና ወደ ሀገሪቱ ክፍሎች ለመጓዝ ምቹ መነሻ ናት።',
    },
    bestTime: { en: 'October – March', am: 'ጥቅምት – መጋቢት' },
    coords: { x: 52, y: 58 },
  },
  {
    id: 'bahir-dar',
    slug: 'bahir-dar',
    name: 'Bahir Dar',
    region: 'Amhara',
    heroPhoto: wikimediaPhoto('ET Amhara asv2018-02 img070 Lake Tana at Bahir Dar.jpg', 1600),
    cardPhoto: wikimediaPhoto('Bahir-Dar-Strandcafe.JPG', 900),
    tagline: {
      en: 'Lakeside calm on the shores of Lake Tana',
      am: 'በጣና ሐይቅ ዳርቻ ያለ ሰላማዊ ከተማ',
    },
    guide: {
      en: 'Bahir Dar sits on Lake Tana, dotted with centuries-old monasteries reachable by boat, and just a short drive from the thundering Blue Nile Falls. Palm-lined boulevards and lakeside hotels make it one of Ethiopia’s most relaxed bases.',
      am: 'ባሕር ዳር በጣና ሐይቅ ዳርቻ ላይ የምትገኝ ከተማ ስትሆን፣ በጀልባ ሊደረስባቸው የሚችሉ ጥንታዊ ገዳማት ባለቤት ናት። ከከተማዋ ብዙም ሳትርቅ የሚገኘው የጢስ አባይ ፏፏቴ ታዋቂ ነው። በዘንባባ ዛፎች የተከበቡ መንገዶችና በሐይቅ ዳርቻ የሚገኙ ሆቴሎች ባሕር ዳርን ከኢትዮጵያ በጣም ዘና ያሉ ከተሞች አንዷ ያደርጓታል።',
    },
    bestTime: { en: 'November – February', am: 'ሕዳር – የካቲት' },
    coords: { x: 38, y: 34 },
  },
  {
    id: 'gondar',
    slug: 'gondar',
    name: 'Gondar',
    region: 'Amhara',
    heroPhoto: wikimediaPhoto('ET Gondar asv2018-02 img21 Fasil Ghebbi.jpg', 1600),
    cardPhoto: wikimediaPhoto('Fasil Ghebbi, Gondar Region-139580.jpg', 900),
    tagline: {
      en: 'The ‘Camelot of Africa’ with royal castles',
      am: 'የነገሥታት ካስትሎች ያሏት «የአፍሪካ ካሜሎት»',
    },
    guide: {
      en: 'Gondar’s Fasil Ghebbi royal compound and its cluster of stone castles earned it the nickname “Camelot of Africa.” Nearby Debre Berhan Selassie church and the Simien foothills make Gondar a rich base for both history and highland treks.',
      am: 'የጎንደር ፋሲል ግቢ የንጉሣውያን ቤተ መንግሥት ግቢና በውስጡ ያሉት የድንጋይ ካስትሎች ከተማዋን «የአፍሪካ ካሜሎት» የሚል ስያሜ አሰጥተዋታል። በአቅራቢያ የሚገኘው ደብረ ብርሃን ሥላሴ ቤተ ክርስቲያንና የስሜን ተራሮች ግርጌ፣ ጎንደርን ለታሪክና ለከፍተኛ ቦታ ጉዞ ምቹ ከተማ ያደርጓታል።',
    },
    bestTime: { en: 'October – February', am: 'ጥቅምት – የካቲት' },
    coords: { x: 40, y: 22 },
  },
  {
    id: 'harar',
    slug: 'harar',
    name: 'Harar',
    region: 'Harari',
    heroPhoto: wikimediaPhoto('Harar Gate, Walled City (8002004000).jpg', 1600),
    cardPhoto: wikimediaPhoto('Colourful street scene in Harar, Eastern Ethiopia. (33475842005).jpg', 900),
    tagline: {
      en: 'A walled city of colorful alleys and coffee',
      am: 'በቀለማት የደመቁ ጠባብ መንገዶች ያሏት ግንብ ከተማ',
    },
    guide: {
      en: 'Harar Jugol’s UNESCO-listed old town is a maze of narrow alleys, colorful houses, and over 80 mosques. Famous for its hyena feeding ritual and rich coffee culture, Harar rewards travelers who linger a few nights.',
      am: 'በዩኔስኮ ቅርስነት የተመዘገበው የሐረር ጅገል ጥንታዊ ከተማ ጠባብ መንገዶች፣ በቀለም ያሸበረቁ ቤቶችና ከሰማንያ በላይ መስጊዶች ያሉት የመንገዶች ስብስብ ነው። በጅብ አመጋገብ ሥነ ሥርዓቷና ባለ ብዙ ታሪክ ቡና ባህሏ ትታወቃለች፤ ጥቂት ሌሊቶችን የሚያድሩ ጎብኚዎችን በሚገባ ትሸልማለች።',
    },
    bestTime: { en: 'October – March', am: 'ጥቅምት – መጋቢት' },
    coords: { x: 68, y: 62 },
  },
  {
    id: 'hawassa',
    slug: 'hawassa',
    name: 'Hawassa',
    region: 'Sidama',
    heroPhoto: wikimediaPhoto('Sunset on Lake Hawassa (1) (28843927430).jpg', 1600),
    cardPhoto: wikimediaPhoto('AwasaLakesidePark.jpg', 900),
    tagline: {
      en: 'Rift Valley lake views and fresh fish markets',
      am: 'የስምጥ ሸለቆ ሐይቅ እይታና ትኩስ የዓሳ ገበያ',
    },
    guide: {
      en: 'Hawassa sits on the shores of Lake Hawassa in the Great Rift Valley, famous for its lively fish market, birdwatching, and laid-back resort atmosphere just a few hours south of Addis Ababa.',
      am: 'ሐዋሳ በስምጥ ሸለቆ ውስጥ በሚገኘው ሐዋሳ ሐይቅ ዳርቻ ላይ የተቀመጠች ከተማ ናት፤ በሕያው የዓሳ ገበያዋ፣ በአዕዋፍ መመልከቻነቷና ዘና ባለ የመዝናኛ ሁኔታዋ ትታወቃለች። ከአዲስ አበባ በጥቂት ሰዓታት መንገድ ብቻ ትገኛለች።',
    },
    bestTime: { en: 'June – September', am: 'ሰኔ – መስከረም' },
    coords: { x: 55, y: 78 },
  },
];

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
