import type { Experience, Interest } from '@/types';
import { experiences } from '@/data/experiences';
import { destinations } from '@/data/destinations';
import { hotels } from '@/data/hotels';
import { pexelsPhoto, seededPhoto } from '@/lib/images';

export const interests: Interest[] = [
  {
    id: 'highlands',
    slug: 'highlands',
    name: { en: 'Highlands', am: 'ተራሮች' },
    tagline: {
      en: 'Dramatic escarpments, gelada baboons, and cool mountain air',
      am: 'አስደናቂ ገደሎች፣ ጭላዳ ዝንጀሮዎችና ቀዝቃዛ የተራራ አየር',
    },
    heroPhoto: pexelsPhoto(19559917, 1600),
    cardPhoto: pexelsPhoto(19559917, 800),
    guide: {
      en: 'Ethiopia’s highlands are among Africa’s most dramatic landscapes — misty plateaus, deep gorges, and UNESCO-listed national parks. Trek the Simien escarpments, watch gelada baboons at sunrise, and sleep in lodges perched above the clouds.',
      am: 'የኢትዮጵያ ተራሮች ከአፍሪካ በጣም አስደናቂ የመሬት ገጽታዎች አንዱ ናቸው — ጭጋጋማ መሬቶች፣ ጥልቅ ሸለቆዎችና በዩኔስኮ የተመዘገቡ ብሔራዊ ፓርኮች። በስሜን ገደል ይጓዙ፣ ጭላዳ ዝንጀሮዎችን በጠዋት ይመልከቱና በደመና ላይ የሚገኙ ሎጆች ውስጥ ይዝናኑ።',
    },
    experienceCategories: ['Nature', 'Wildlife'],
    destinationSlugs: ['gondar', 'lalibela', 'addis-ababa'],
    highlightSections: [
      {
        title: { en: 'Walk above the clouds', am: 'በደመና ላይ ይራመዱ' },
        subtitle: {
          en: 'Escarpment trails and summit viewpoints that stop you in your tracks.',
          am: 'እግርዎን የሚያቆሙ የገደል መንገዶችና የላይኛው እይታ ቦታዎች።',
        },
        items: [
          {
            title: { en: 'Simien Mountains day trip', am: 'የስሜን ተራሮች የቀን ጉዞ' },
            description: {
              en: 'Hike dramatic ridges and look straight down into the abyss.',
              am: 'አስደናቂ ገደሎችን ይራመዱና ወደ ብስብስቱ ቀጥ ብለው ይመልከቱ።',
            },
            photo: seededPhoto('exp-gondar-simien', 700, 500),
            experienceId: 'exp-gondar-simien',
          },
          {
            title: { en: 'Entoto Hills sunset', am: 'የእንጦጦ ተራሮች ፀሐይ ስትጠልቅ' },
            description: {
              en: 'Panoramic views over Addis from the capital’s highest ridge.',
              am: 'ከካፒታሉ ከፍተኛው ገደል ላይ በአዲስ አበባ ላይ ሰፊ እይታ።',
            },
            photo: pexelsPhoto(19559917, 700),
            experienceId: 'exp-addis-entoto',
          },
          {
            title: { en: 'Lalibela highland market', am: 'የላሊበላ ተራራ ገበያ' },
            description: {
              en: 'Saturday market stalls stacked with spices and highland produce.',
              am: 'በቅመማ ቅመምና በተራራ ውጤቶች የተሞሉ የቅዳሜ ገበያ ድንኳኖች።',
            },
            photo: seededPhoto('exp-lalibela-market', 700, 500),
            experienceId: 'exp-lalibela-market',
          },
        ],
      },
      {
        title: { en: 'Meet the locals', am: 'አካባቢውን ይገናኙ' },
        subtitle: {
          en: 'Wildlife you will not find anywhere else on the continent.',
          am: 'በሌላ የአፍሪካ ክፍል የማይገኙ የዱር እንስሳት።',
        },
        items: [
          {
            title: { en: 'Gelada baboons', am: 'ጭላዳ ዝንጀሮዎች' },
            description: {
              en: 'Watch grass-eating baboons graze along the Simien escarpment.',
              am: 'ጭላዳ ዝንጀሮዎች በስሜን ገደል ዳርቻ እራስቸውን እየበሉ ይመልከቱ።',
            },
            photo: seededPhoto('exp-gondar-simien', 700, 500),
            experienceId: 'exp-gondar-simien',
          },
          {
            title: { en: 'Senkele grasslands', am: 'የሰንቀሌ ሳር ምድር' },
            description: {
              en: 'Spot rare hartebeest on a day trip from the Rift Valley.',
              am: 'ከስምጥ ሸለቆ በወጣ የቀን ጉዞ ልዩ የኩዳን አጋዘን ይመልከቱ።',
            },
            photo: seededPhoto('exp-hawassa-senkele', 700, 500),
            experienceId: 'exp-hawassa-senkele',
          },
        ],
      },
      {
        title: { en: 'Highland towns to base yourself', am: 'መነሻ ለመሆን የሚስማሙ ተራራ ከተሞች' },
        subtitle: {
          en: 'Cool air, stone churches, and castles within reach of the peaks.',
          am: 'ቀዝቃዛ አየር፣ የድንጋይ ቤተ ክርስቲያናትና ከራስ ጥቂት ርቀት ላይ ያሉ ካስትሎች።',
        },
        items: [
          {
            title: { en: 'Gondar', am: 'ጎንደር' },
            description: {
              en: 'Royal castles and the gateway to Simien National Park.',
              am: 'የንጉሣውያን ካስትሎችና ወደ ስሜን ብሔራዊ ፓርክ መግቢያ።',
            },
            photo: pexelsPhoto(17853346, 700),
            destinationSlug: 'gondar',
          },
          {
            title: { en: 'Lalibela', am: 'ላሊበላ' },
            description: {
              en: 'Rock-hewn churches perched on a highland plateau.',
              am: 'በተራራማ መሬት ላይ ከዓለት የተፈለፈሉ ቤተ ክርስቲያናት።',
            },
            photo: pexelsPhoto(7438884, 700),
            destinationSlug: 'lalibela',
          },
        ],
      },
    ],
  },
  {
    id: 'food',
    slug: 'food',
    name: { en: 'Food', am: 'ምግብ' },
    tagline: {
      en: 'Injera, coffee ceremonies, and flavors found nowhere else',
      am: 'እንጀራ፣ የቡና ሥነ ሥርዓትና በሌላ ቦታ የማይገኙ ጣዕሞች',
    },
    heroPhoto: pexelsPhoto(8351649, 1600),
    cardPhoto: pexelsPhoto(8351649, 800),
    guide: {
      en: 'Ethiopian cuisine is built around injera — a spongy flatbread topped with fragrant stews called wat. Share a communal platter, join a traditional coffee ceremony, and taste lake fish grilled fresh at dawn in Hawassa.',
      am: 'የኢትዮጵያ ምግብ በእንጀራ ዙሪያ የተሠራ ነው — በወት የሚቀመጡ ወጥ የሚባሉትን ሽቅብ የሚያስይዝ ስፖንጅ ያለው ቂጣ። በጋራ ሳህን ይመገቡ፣ በባህላዊ የቡና ሥነ ሥርዓት ይሳተፉና በሐዋሳ ጠዋት ተጠብሶ የቀረበ የሐይቅ ዓሳ ይቅመሱ።',
    },
    experienceCategories: ['Food'],
    destinationSlugs: ['addis-ababa', 'hawassa', 'harar'],
    highlightSections: [
      {
        title: { en: 'Just say yes, chef', am: 'አዎ ብለው ይቀበሉ' },
        subtitle: {
          en: 'The dishes every visitor should try at least once.',
          am: 'እያንዳንዱ ጎብኚ ቢያንስ አንድ ጊዜ መሞከር ያለባቸው ምግቦች።',
        },
        items: [
          {
            title: { en: 'Injera & wat platter', am: 'እንጀራና ወጥ ሳህን' },
            description: {
              en: 'Share a communal platter of spiced stews on spongy injera.',
              am: 'በስፖንጅ እንጀራ ላይ የቅመም ወጦችን በጋራ ሳህን ይመገቡ።',
            },
            photo: pexelsPhoto(8351649, 700),
            destinationSlug: 'addis-ababa',
          },
          {
            title: { en: 'Tibs & kitfo', am: 'ጥብስና ክትፎ' },
            description: {
              en: 'Sizzling sautéed meat and Ethiopia’s famous seasoned raw beef.',
              am: 'የሚቃጠል የተቀባ ትልቅ ስጋና ታዋቂው ክትፎ።',
            },
            photo: seededPhoto('food-tibs-kitfo', 700, 500),
            destinationSlug: 'addis-ababa',
          },
          {
            title: { en: 'Fresh lake fish', am: 'ትኩስ የሐይቅ ዓሳ' },
            description: {
              en: 'Grilled tilapia straight from Hawassa’s morning fish market.',
              am: 'ከሐዋሳ ጠዋት ዓሳ ገበያ ቀጥ ብሎ የተጠበሰ ቲላፒያ።',
            },
            photo: pexelsPhoto(8351649, 700),
            experienceId: 'exp-hawassa-fishmarket',
          },
          {
            title: { en: 'Shiro & fasting platters', am: 'ሽሮና የጾም ምግብ' },
            description: {
              en: 'Chickpea stew and lentil dishes beloved on fasting days.',
              am: 'በጾም ቀናት የሚወደዱ የሽንብራ ወጥና የምስር ምግቦች።',
            },
            photo: seededPhoto('food-shiro', 700, 500),
            destinationSlug: 'lalibela',
          },
        ],
      },
      {
        title: { en: 'Coffee, always coffee', am: 'ቡና፣ ሁልጊዜ ቡና' },
        subtitle: {
          en: 'From green bean to cup — Ethiopia’s most sacred daily ritual.',
          am: 'ከአረንጓዴ ቡና እስከ ጽዋ — የኢትዮጵያ ቅዱስ የዕለት ተዕለት ሥነ ሥርዓት።',
        },
        items: [
          {
            title: { en: 'Harar coffee ceremony', am: 'የሐረር የቡና ሥነ ሥርዓት' },
            description: {
              en: 'Roast, grind, and brew in the birthplace of Arabica coffee.',
              am: 'በአራቢካ ቡና መገኛ ስፍራ ቡናን ይቃጠሉ፣ ይፍጡና ይፍቱ።',
            },
            photo: seededPhoto('exp-harar-coffee', 700, 500),
            experienceId: 'exp-harar-coffee',
          },
          {
            title: { en: 'Gondar evening coffee house', am: 'የጎንደር የምሽት ቡና ቤት' },
            description: {
              en: 'Slow ceremony with popcorn, incense, and local storytelling.',
              am: 'በፈረንጅ፣ በዕጣንና በአካባቢ ታሪክ ትረካ የሚካሄድ ዝግታ ሥነ ሥርዓት።',
            },
            photo: seededPhoto('exp-gondar-coffeehouse', 700, 500),
            experienceId: 'exp-gondar-coffeehouse',
          },
        ],
      },
      {
        title: { en: 'Markets worth the aroma', am: 'ለሽታቸው የሚያስቀምጡ ገበያዎች' },
        subtitle: {
          en: 'Follow your nose to spice stalls, coffee sellers, and morning catches.',
          am: 'የቅመም ድንኳኖች፣ የቡና ሻጮችና ጠዋት ዓሳ መከታተል ይከተሉ።',
        },
        items: [
          {
            title: { en: 'Mercato spice walk', am: 'የመርካቶ ቅመም ጉዞ' },
            description: {
              en: 'Africa’s largest open-air market for berbere, coffee, and textiles.',
              am: 'ለበርበሬ፣ ለቡናና ለጨርቅ ትልቁ የአፍሪካ ክፍት ገበያ።',
            },
            photo: seededPhoto('exp-addis-mercato', 700, 500),
            experienceId: 'exp-addis-mercato',
          },
          {
            title: { en: 'Hawassa fish market', am: 'የሐዋሳ ዓሳ ገበያ' },
            description: {
              en: 'Watch the dawn catch arrive and eat grilled fish on the spot.',
              am: 'ጠዋት ዓሳ መገኘቱን ይመልከቱና ወዲያውኑ የተጠበሰ ዓሳ ይቅመሱ።',
            },
            photo: pexelsPhoto(8351649, 700),
            experienceId: 'exp-hawassa-fishmarket',
          },
          {
            title: { en: 'Harar spice lanes', am: 'የሐረር የቅመም መንገዶች' },
            description: {
              en: 'Walled city alleys fragrant with coffee, frankincense, and khat.',
              am: 'በቡና፣ በዕጣንና በጫት የሚነገሩ የተከበበ ከተማ ጎዳናዎች።',
            },
            photo: pexelsPhoto(10528757, 700),
            destinationSlug: 'harar',
          },
        ],
      },
    ],
    localFlavor: {
      title: { en: 'Enjoy the local flavor', am: 'የአካባቢውን ጣዕም ይቅመሱ' },
      subtitle: {
        en: 'Real food moments from travelers eating their way across Ethiopia.',
        am: 'በኢትዮጵያ ውስጥ ምግብ የሚቅመሱ ተጓዦች እውነተኛ ቅጽሎች።',
      },
      featured: {
        id: 'flavor-mercato',
        title: { en: 'Addis Mercato Street Food Walk', am: 'የአዲስ አበባ መርካቶ የመንገድ ምግብ ጉዞ' },
        photo: seededPhoto('exp-addis-mercato', 1200, 700),
        author: '@HannaInAddis',
        experienceId: 'exp-addis-mercato',
      },
      moments: [
        {
          id: 'flavor-coffee',
          title: { en: 'Harar coffee ceremony', am: 'የሐረር የቡና ሥነ ሥርዓት' },
          photo: seededPhoto('exp-harar-coffee', 700, 500),
          author: '@MikeEatsEthiopia',
          experienceId: 'exp-harar-coffee',
        },
        {
          id: 'flavor-fish',
          title: { en: 'Hawassa grilled lake fish', am: 'የሐዋሳ የተጠበሰ የሐይቅ ዓሳ' },
          photo: pexelsPhoto(8351649, 700),
          author: '@TsionTravels',
          experienceId: 'exp-hawassa-fishmarket',
        },
        {
          id: 'flavor-injera',
          title: { en: 'Communal injera platter', am: 'የጋራ እንጀራ ሳህን' },
          photo: pexelsPhoto(8351649, 700),
          author: '@DanielWanders',
          destinationSlug: 'addis-ababa',
        },
        {
          id: 'flavor-gondar-coffee',
          title: { en: 'Gondar evening coffee house', am: 'የጎንደር የምሽት ቡና ቤት' },
          photo: seededPhoto('exp-gondar-coffeehouse', 700, 500),
          author: '@SelamFoodie',
          experienceId: 'exp-gondar-coffeehouse',
        },
        {
          id: 'flavor-harar',
          title: { en: 'Harar spice alley bites', am: 'የሐረር የቅመም ጎዳና ቁራያ' },
          photo: pexelsPhoto(10528757, 700),
          author: '@YonasEats',
          destinationSlug: 'harar',
        },
      ],
    },
  },
  {
    id: 'culture',
    slug: 'culture',
    name: { en: 'Culture', am: 'ባህል' },
    tagline: {
      en: 'Rock churches, ancient kingdoms, and living traditions',
      am: 'ከዓለት የተፈለፈሉ ቤተ ክርስቲያናት፣ ጥንታዊ መንግሥታትና ሕያው ባህሎች',
    },
    heroPhoto: pexelsPhoto(7438884, 1600),
    cardPhoto: pexelsPhoto(7438884, 800),
    guide: {
      en: 'Ethiopia holds one of the world’s oldest Christian traditions and a tapestry of cultures unchanged for centuries. Explore Lalibela’s rock-hewn churches, Axum’s towering stelae, and Gondar’s royal castles — then wander markets alive with spice, music, and craft.',
      am: 'ኢትዮጵያ ከዓለም በጣም ጥንታዊ የክርስትና ባህልና ለዘመናት ያልተለወጡ ባህሎች ባለቤት ናት። የላሊበላን ከዓለት የተፈለፈሉ ቤተ ክርስቲያናት፣ የአክሱምን ከፍ ያሉ እስቴላዎችና የጎንደርን ንጉሣውያን ካስትሎች ያስሱ — ከዚያም በቅመም፣ በሙዚቃና በእጅ ሥራ የሚነቃቁ ገበያዎች ውስጥ ይዞሩ።',
    },
    experienceCategories: ['Culture', 'History'],
    destinationSlugs: ['lalibela', 'axum', 'gondar', 'harar'],
    highlightSections: [
      {
        title: { en: 'Ancient wonders', am: 'ጥንታዊ ድንቆች' },
        subtitle: {
          en: 'Stone churches, obelisks, and castles that rewrite history books.',
          am: 'ታሪክ መጽሐፍትን የሚያደሱ የድንጋይ ቤተ ክርስቲያናት፣ ሐውልቶችና ካስትሎች።',
        },
        items: [
          {
            title: { en: 'Lalibela at sunrise', am: 'ላሊበላ በጠዋት' },
            description: {
              en: 'Beat the crowds at Bete Giyorgis and the northern cluster.',
              am: 'በቤተ ጊዮርጊስና በሰሜናዊ ስብስብ ላይ ሰዎች ከመጡ በፊት ይጎብኙ።',
            },
            photo: pexelsPhoto(7438884, 700),
            experienceId: 'exp-lalibela-churches',
          },
          {
            title: { en: 'Axum’s towering stelae', am: 'የአክሱም ከፍ ያሉ እስቴላዎች' },
            description: {
              en: 'Stand beside granite obelisks carved two millennia ago.',
              am: 'ከሁለት ሺህ ዓመታት በፊት የተቀረጹ ግዙፍ ሐውልቶች ጎን ቆመው ይመልከቱ።',
            },
            photo: pexelsPhoto(36336675, 700),
            experienceId: 'exp-axum-stelae',
          },
          {
            title: { en: 'Fasil Ghebbi castles', am: 'የፋሲል ግቢ ካስትሎች' },
            description: {
              en: 'Six centuries-old castles built by successive emperors.',
              am: 'በተከታታይ ነገሥታት የተገነቡ ስድስት ካስትሎች።',
            },
            photo: pexelsPhoto(17853346, 700),
            experienceId: 'exp-gondar-fasil',
          },
        ],
      },
      {
        title: { en: 'Living traditions', am: 'ሕያው ባህሎች' },
        subtitle: {
          en: 'Rituals, crafts, and ceremonies still performed every day.',
          am: 'እስከ ዛሬ ድረስ በየቀኑ የሚካሄዱ ሥነ ሥርዓቶች፣ እጅ ሥራዎችና ሥነ-ሥርዓቶች።',
        },
        items: [
          {
            title: { en: 'Hyena feeding ritual', am: 'የጅብ አመጋገብ ሥነ ሥርዓት' },
            description: {
              en: 'Harar’s centuries-old nightly ritual of hand-feeding wild hyenas.',
              am: 'በሐረር ዱር ጅቦችን በእጅ የሚመገብ የዘመናት ማታ ሥነ ሥርዓት።',
            },
            photo: pexelsPhoto(10528757, 700),
            experienceId: 'exp-harar-hyena',
          },
          {
            title: { en: 'Traditional weaving', am: 'ባህላዊ ሽመና' },
            description: {
              en: 'Watch cotton scarves hand-woven on wooden looms in Lalibela.',
              am: 'በላሊበላ በእንጨት ማግ ላይ የጥጥ ሻርፖች በእጅ ሲሸመኑ ይመልከቱ።',
            },
            photo: seededPhoto('exp-lalibela-weaving', 700, 500),
            experienceId: 'exp-lalibela-weaving',
          },
          {
            title: { en: 'Lake Tana monasteries', am: 'የጣና ሐይቅ ገዳማት' },
            description: {
              en: 'Boat to island churches with centuries-old religious art.',
              am: 'የዘመናት ሃይማኖታዊ ሥዕል ወዳላቸው ደሴት ገዳማት በጀልባ ይጎብኙ።',
            },
            photo: pexelsPhoto(20041269, 700),
            experienceId: 'exp-bahirdar-monasteries',
          },
        ],
      },
      {
        title: { en: 'Stories in stone & cloth', am: 'በድንጋይና በጨርቅ የሚተረኩ ታሪኮች' },
        subtitle: {
          en: 'Museums, walls, and workshops that keep heritage alive.',
          am: 'ቅርስን ሕያው የሚያደርጉ ሙዚየሞች፣ ግንቦችና ወርክሾፖች።',
        },
        items: [
          {
            title: { en: 'Jugol wall walk', am: 'የጅገል ግንብ ጉዞ' },
            description: {
              en: 'Follow Harar’s 16th-century walls through five historic gates.',
              am: 'በ16ኛው ክፍለ ዘመን የተገነባውን የሐረር ግንብ በአምስት በሮች በኩል ይከተሉ።',
            },
            photo: seededPhoto('exp-harar-walls', 700, 500),
            experienceId: 'exp-harar-walls',
          },
          {
            title: { en: 'Rimbaud cultural center', am: 'የሪምቦ የባህል ማዕከል' },
            description: {
              en: 'Explore the restored merchant house tied to Harar’s literary past.',
              am: 'ከሐረር ሥነ ጽሑፍ ታሪክ ጋር የተያያዘውን የተመለሰ የነጋዴ ቤት ያስሱ።',
            },
            photo: seededPhoto('exp-harar-rimbaud', 700, 500),
            experienceId: 'exp-harar-rimbaud',
          },
          {
            title: { en: 'Tigray weaving workshop', am: 'የትግራይ ሽመና ወርክሾፕ' },
            description: {
              en: 'Meet artisans hand-weaving traditional cotton in Axum.',
              am: 'በአክሱም ባህላዊ የጥጥ አልባሳትን በእጅ የሚሸምኑ ባለሙያዎችን ያግኙ።',
            },
            photo: seededPhoto('exp-axum-weaving', 700, 500),
            experienceId: 'exp-axum-weaving',
          },
        ],
      },
    ],
  },
  {
    id: 'water',
    slug: 'water',
    name: { en: 'Water', am: 'ውሃ' },
    tagline: {
      en: 'Great lakes, thundering falls, and Rift Valley shores',
      am: 'ትልቅ ሐይቆች፣ ገዳይ ፏፏቴዎችና የስምጥ ሸለቆ ዳርቻዎች',
    },
    heroPhoto: seededPhoto('interest-water', 1600, 900),
    cardPhoto: seededPhoto('interest-water-card', 800, 600),
    guide: {
      en: 'Water defines much of Ethiopia’s beauty — from Lake Tana’s island monasteries to the Blue Nile Falls and the bird-filled shores of the Rift Valley. Boat to ancient churches, hike to misty waterfalls, and watch pelicans fish at sunrise.',
      am: 'ውሃ ከኢትዮጵያ ውበት ብዙ ክፍሎችን ይገልጻል — ከጣና ሐይቅ ደሴት ገዳማት እስከ ጢስ አባይ ፏፏቴና በስምጥ ሸለቆ ዳርቻ የሚሞሉ አዕዋፍ ድረስ። ወደ ጥንታዊ ገዳማት በጀልባ ይሂዱ፣ ወደ ጭጋጋማ ፏፏቴዎች ይጓዙና ፔሊካኖች በጠዋት ዓሳ የሚያጠጡትን ይመልከቱ።',
    },
    experienceCategories: ['Nature'],
    destinationSlugs: ['bahir-dar', 'hawassa'],
    highlightSections: [
      {
        title: { en: 'Lakes worth a slow morning', am: 'ለዝግታ ጠዋት የሚስማሙ ሐይቆች' },
        subtitle: {
          en: 'Calm water, island monasteries, and hippos at golden hour.',
          am: 'የረጋጋ ውሃ፣ ደሴት ገዳማትና በወርቅ ሰዓት ጉማሬዎች።',
        },
        items: [
          {
            title: { en: 'Lake Tana boat tour', am: 'የጣና ሐይቅ የጀልባ ጉዞ' },
            description: {
              en: 'Cruise to island monasteries with centuries-old religious art.',
              am: 'የዘመናት ሃይማኖታዊ ሥዕል ወዳላቸው ደሴት ገዳማት ይጓዙ።',
            },
            photo: pexelsPhoto(20041269, 700),
            experienceId: 'exp-bahirdar-monasteries',
          },
          {
            title: { en: 'Lake Hawassa sunset cruise', am: 'የሐዋሳ ሐይቅ የፀሐይ ስትጠልቅ ጉዞ' },
            description: {
              en: 'Glide across calm waters as hippos surface in the evening light.',
              am: 'ጉማሬዎች በምሽት ብርሃን ውስጥ ሲወጡ በተረጋጋ ውሃ ላይ ይንሸራተቱ።',
            },
            photo: seededPhoto('exp-hawassa-sunset', 700, 500),
            experienceId: 'exp-hawassa-sunset',
          },
          {
            title: { en: 'Zeghie forest walk', am: 'የዘጌ ደን ጉዞ' },
            description: {
              en: 'Coffee-forest trails linking ancient island monasteries.',
              am: 'ጥንታዊ ደሴት ገዳማትን የሚያገናኙ የቡና ደን መንገዶች።',
            },
            photo: seededPhoto('exp-bahirdar-zeghie', 700, 500),
            experienceId: 'exp-bahirdar-zeghie',
          },
        ],
      },
      {
        title: { en: 'Falls that roar', am: 'የሚጮኹ ፏፏቴዎች' },
        subtitle: {
          en: 'Misty cascades and the thundering “smoking water” of the Blue Nile.',
          am: 'ጭጋጋማ ፏፏቴዎችና የጢስ አባይ ገዳይ «የሚያጨስ ውሃ»።',
        },
        items: [
          {
            title: { en: 'Blue Nile Falls hike', am: 'የጢስ አባይ ፏፏቴ ጉዞ' },
            description: {
              en: 'A scenic walk to Ethiopia’s thundering waterfall near Bahir Dar.',
              am: 'በባሕር ዳር አቅራቢያ ወደ ኢትዮጵያ ገዳይ ፏፏቴ የሚደረግ ውብ ጉዞ።',
            },
            photo: seededPhoto('exp-bahirdar-falls', 700, 500),
            experienceId: 'exp-bahirdar-falls',
          },
        ],
      },
      {
        title: { en: 'Birds at the water’s edge', am: 'በውሃ ዳርቻ አዕዋፍ' },
        subtitle: {
          en: 'Flamingos, pelicans, and fish eagles along the Rift Valley lakes.',
          am: 'በስምጥ ሸለቆ ሐይቆች ዳርቻ ፍላሚንጎ፣ ፔሊካንና የዓሳ ንስር።',
        },
        items: [
          {
            title: { en: 'Rift Valley birdwatching', am: 'የስምጥ ሸለቆ የአዕዋፍ መመልከቻ' },
            description: {
              en: 'Spot flamingos, pelicans, and fish eagles along the lakeshore.',
              am: 'በሐይቁ ዳርቻ ፍላሚንጎ፣ ፔሊካንና የዓሳ ንስር ይመልከቱ።',
            },
            photo: seededPhoto('exp-hawassa-birding', 700, 500),
            experienceId: 'exp-hawassa-birding',
          },
          {
            title: { en: 'Hawassa fish market dawn', am: 'የሐዋሳ ዓሳ ገበያ ጥዋት' },
            description: {
              en: 'Morning bustle where fishermen, birds, and grills meet lakeside.',
              am: 'ዓሳ ያጥማጮች፣ አዕዋፍና ጥብስ በሐይቅ ዳርቻ የሚገናኙበት ጠዋት ስራ።',
            },
            photo: pexelsPhoto(8351649, 700),
            experienceId: 'exp-hawassa-fishmarket',
          },
        ],
      },
    ],
  },
];

export function getInterest(slug: string): Interest | undefined {
  return interests.find((interest) => interest.slug === slug);
}

export function getExperiencesForInterest(interest: Interest): Experience[] {
  return experiences.filter((experience) => interest.experienceCategories.includes(experience.category));
}

export function getDestinationsForInterest(interest: Interest) {
  return interest.destinationSlugs
    .map((slug) => destinations.find((destination) => destination.slug === slug))
    .filter((destination): destination is NonNullable<typeof destination> => Boolean(destination));
}

export function getHotelsForInterest(interest: Interest) {
  const slugs = new Set(interest.destinationSlugs);
  return hotels.filter((hotel) => slugs.has(hotel.destinationSlug));
}
