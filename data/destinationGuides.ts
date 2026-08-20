import type { DestinationGuide } from '@/types';
import { unsplashPhoto, wikimediaPhoto } from '@/lib/images';

export const destinationGuides: Record<string, DestinationGuide> = {
  'abajifar': {
    sections: [
      {
        title: { en: 'The Wooden Palace of Jiren', am: 'የጅሬን የእንጨት ቤተ መንግሥት' },
        body: {
          en: 'Built in the late 19th century on the hill of Jiren, Aba Jifar Palace stands as an architectural masterpiece constructed from indigenous timber, bamboo, and traditional materials. The expansive complex includes royal residential quarters, reception halls, mosques, and a traditional courtroom.',
          am: 'በ19ኛው ክፍለ ዘመን መገባደጃ ላይ በጅሬን ኮረብታ ላይ የተገነባው የአባ ጅፋር ቤተ መንግሥት በዋነኝነት ከእንጨት፣ ከቀርከሃና ከባህላዊ ቁሳቁሶች የተሠራ የስነ ሕንፃ ድንቅ ነው። ውስብስቡ የንጉሣዊ መኖሪያ ክፍሎችን፣ የእንግዳ መቀበያ አዳራሾችን፣ መስጊዶችንና ባህላዊ የፍርድ ቤት አዳራሽን ያካትታል።',
        },
        photo: wikimediaPhoto('Aba Jifar Palace, Jimma, Ethiopia (17362840816).jpg', 1200),
      },
      {
        title: { en: 'Coffee Heritage and Southwestern Culture', am: 'የቡና ቅርስና የደቡብ ምዕራብ ባህል' },
        body: {
          en: 'Jimma is the cultural hub of southwestern Ethiopia and the historic birthplace of Arabica coffee. Visitors can tour local coffee farms, historical archives, and bustling local markets brimming with fresh spices and honey.',
          am: 'ጅማ የደቡብ ምዕራብ ኢትዮጵያ የባህል ማዕከል እንዲሁም የአረቢካ ቡና ታሪካዊ መገኛ ናት። ጎብኚዎች የአካባቢውን የቡና እርሻዎች፣ ታሪካዊ ማዕከላትና በቅመማ ቅመም የተሞሉ ገበያዎችን መጎብኘት ይችላሉ።',
        },
        photo: wikimediaPhoto('Aba Jifar Palace, Jimma, Ethiopia (17362840816).jpg', 900),
      },
    ],
    gallery: [
      wikimediaPhoto('Aba Jifar Palace, Jimma, Ethiopia (17362840816).jpg', 1200),
    ],
  },
  'ertale': {
    sections: [
      {
        title: { en: 'The Persistent Lava Lake', am: 'ቋሚው የላቫ ሐይቅ' },
        body: {
          en: 'Erta Ale is world-famous for containing one of the planet’s few continuous active lava lakes. Trekking to the crater rim at dusk allows visitors to watch radiant molten lava churn and bubble against the dark desert night.',
          am: 'ኤርታሌ በዓለም ላይ ካሉ ጥቂት ቋሚ የቀለጠ ላቫ ሐይቆች አንዱ በመሆን በዓለም አቀፍ ደረጃ ታዋቂ ነው። በምሽት ወደ እሳተ ጎመራው ጫፍ መጓዝ በጨለማው የበረሃ ምሽት የሚፈላውን የቀለጠ አለት ለመመልከት ያስችላል።',
        },
        photo: wikimediaPhoto('Erta Ale.jpg', 1200),
      },
      {
        title: { en: 'Danakil Depression Expedition', am: 'የዳናኪል ስምጥ ጉዞ' },
        body: {
          en: 'Journeying to Erta Ale leads travelers through the extraordinary Danakil Depression, featuring vast salt flats, mineral-rich hydrothermal springs, and traditional Afar salt caravans.',
          am: 'ወደ ኤርታሌ የሚደረግ ጉዞ ተጓዦችን በሰፊ የጨው ሜዳዎች፣ በማዕድን የበለጸጉ የውሃ ምንጮችና በባህላዊ የአፋር የጨው ካራቫኖች ወደተሞላው አስደናቂው የዳናኪል ስምጥ ይመራል።',
        },
        photo: wikimediaPhoto('Erta Ale.jpg', 900),
      },
    ],
    gallery: [
      wikimediaPhoto('Erta Ale.jpg', 1200),
    ],
  },
  'addis-ababa': {
    sections: [
      {
        title: { en: 'Museums, markets, and modern Addis', am: 'ሙዚየሞች፣ ገበያዎችና ዘመናዊ አዲስ አበባ' },
        body: {
          en: 'Start at the National Museum to see Lucy, then dive into Mercato — one of Africa’s largest open-air markets. Entoto Park offers panoramic views over the capital, while Bole Road and Kazanchis are packed with restaurants serving injera, kitfo, and third-wave coffee.',
          am: 'በብሔራዊ ሙዚየም ሉሲን ይመልከቱ፣ ከዚያም በአንድ ከአፍሪካ ትልልቁ ክፍት ገበያዎች አንዱ የሆነው መርካቶ ውስጥ ይግቡ። እንጦጦ ፓርክ ከከተማው ላይ ሰፊ እይታ ይሰጣል፤ ቦሌ መንገድና ቃዛንቺስ በእንጀራ፣ ክትፎና ዘመናዊ ቡና የተሞሉ ምግብ ቤቶች ተደራጅተዋል።',
        },
        photo: unsplashPhoto('1626598442658-ea6a1a5943df', 1200),
      },
      {
        title: { en: 'Live jazz and nightlife', am: 'ሕያው ጃዝና የሌሊት ሕይወት' },
        body: {
          en: 'Addis helped pioneer Ethio-jazz, and venues across the city still host live bands most nights. Jazzamba Lounge and Fendika Cultural Center are longtime favorites; newer rooftop bars in Bole keep the scene fresh for visitors who want music after dinner.',
          am: 'አዲስ አበባ ኢትዮ-ጃዝን ለማስተዋወቅ ተሰማሪ ከተሞች አንዷ ናት፤ በከተማው ዙሪያ ባሉ ቦታዎች ብዙ ሌሊቶች ሕያው ባንዶች ይጫወታሉ። ጃዛምባ ላውንጅና ፈንዲካ ባህላዊ ማዕከል የረጅም ጊዜ ተወዳጆች ሲሆኑ፣ በቦሌ ያሉ አዳዲስ የጣራ ባሮች ለእራት በኋላ ሙዚቃ ለሚፈልጉ ጎብኚዎች ሁኔታውን አዲስ ያደርጋሉ።',
        },
        photo: unsplashPhoto('1512654458600-cf5387bd9428', 900),
      },
      {
        title: { en: 'Gateway to the rest of Ethiopia', am: 'ወደ ኢትዮጵያ ሌሎች ክፍሎች መግቢያ' },
        body: {
          en: 'Bole International Airport connects Addis to every corner of the country. Many travelers spend two or three nights here before flying to Lalibela, Bahir Dar, or the south — making it the natural hub for comparing hotels before you commit to a route.',
          am: 'ቦሌ ዓለም አቀፍ አውራጃ ጥበቃ አዲስ አበባን ከሀገሪቱ እያንዳንዱ ጥቅል ጋር ያገናኛል። ብዙ ጎብኚዎች ወደ ላሊበላ፣ ባሕር ዳር ወይም ደቡብ ከመብረር በፊት ሁለት ወይም ሶስት ሌሊት እዚህ ያሳልፋሉ — ስለዚህ ለጉዞ ከመወሰን በፊት ሆቴሎችን ለማነጻጸር ተፈጥሮ የተሠራ መሃል ናት።',
        },
        photo: unsplashPhoto('1594663582551-5f3c037cd587', 1200),
      },
      {
        title: { en: 'Shopping, crafts, and contemporary art', am: 'ገበያ፣ የእጅ ሥራና ዘመናዊ ስነ ጥበብ' },
        body: {
          en: 'Beyond Mercato, boutiques in Bole and Kazanchis sell modern Ethiopian design, while galleries such as the Zoma Museum showcase contemporary artists. Weekend craft markets are a good stop for hand-woven scarves, silver crosses, and coffee ready to take home.',
          am: 'ከመርካቶ ባሻገር በቦሌና በቃዛንቺስ ያሉ ትናንሽ ሱቆች ዘመናዊ የኢትዮጵያ ንድፍ ይሸጣሉ፤ እንደ ዞማ ሙዚየም ያሉ ጋለሪዎችም ዘመናዊ ሠዓሊያንን ያስተዋውቃሉ። የሳምንት መጨረሻ የእጅ ሥራ ገበያዎች የተጠለፉ ሻርፖችን፣ የብር መስቀሎችንና ወደ ቤት የሚወሰድ ቡና ለመግዛት ጥሩ ማቆሚያ ናቸው።',
        },
        photo: unsplashPhoto('1597807132214-cd7d59a77714', 900),
      },
    ],
    gallery: [
      unsplashPhoto('1571946080923-a81668948f52', 1200),
      unsplashPhoto('1624314138470-5a2f24623f10', 900),
      unsplashPhoto('1614981816670-3e65f4cfdb28', 1200),
      unsplashPhoto('1614970205881-4f9ea5b6462a', 900),
      unsplashPhoto('1553687334-0161f3d4aca9', 1200),
    ],
  },
  'bahir-dar': {
    sections: [
      {
        title: { en: 'Lake Tana and island monasteries', am: 'ጣና ሐይቅና የደሴት ገዳማት' },
        body: {
          en: 'Boat trips across Lake Tana reach monasteries hidden on forested islands, many with vivid 17th-century murals. Half-day and full-day excursions depart from the lakeside — book early in high season and bring sun protection for the open water.',
          am: 'በጣና ሐይቅ ላይ የጀልባ ጉዞዎች ወደ በደረቃ ደሴቶች ላይ የተደበቁ ገዳማት ይደርሳሉ፤ ብዙዎቹ በ17ኛው ክፍተ ክፍል ቀለማት ያላቸው ናቸው። ከሐይቁ ዳርቻ ግማሽ ቀን እና ሙሉ ቀን ጉዞዎች ይጀምራሉ — በከፍተኛ ወቅት ቀደም ብለው ይያዙና ለክፍት ውሃ ፀሐይ መከላከያ ይዘው ይሂዱ።',
        },
        photo: wikimediaPhoto('ET Amhara asv2018-02 img070 Lake Tana at Bahir Dar.jpg', 1200),
      },
      {
        title: { en: 'Blue Nile Falls', am: 'የጢስ አባይ ፏፏቴ' },
        body: {
          en: 'Tis Abay — the Blue Nile Falls — roars just outside town when the river is full, sending mist across the gorge. The walk from the parking area takes about 45 minutes each way; after heavy rains the falls are at their most dramatic.',
          am: 'ጢስ አባይ — የጢስ አባይ ፏፏቴ — ወንዙ ሲሞላ ከከተማው ውጭ በጮሃ ይፈሳል፣ ጭቃውን በገደል ውስጥ ይሰራጫል። ከመኪና ማቆሚያው የሚደረገው ጉዞ በእያንዳንዱ አቅጣጫ ወደ 45 ደቂቃዎች ይወስዳል፤ ከከባድ ዝናብ በኋላ ፏፏቴው በጣም አስደናቂ ይሆናል።',
        },
        photo: unsplashPhoto('1668939581252-470c103ac7da', 900),
      },
      {
        title: { en: 'Lakeside stays and slow evenings', am: 'በሐይቅ ዳርቻ ማረፊያዎችና ዘና ያሉ ምሽቶች' },
        body: {
          en: 'Resorts and guesthouses line the shore with sunset views over the water. Evenings are unhurried — fish straight from the market, a walk along the boulevard, and an early start for monastery boats the next morning.',
          am: 'መዝናኛ ቦታዎችና መስተንግዶ ቤቶች በዳርቻው ላይ በውሃ ላይ የፀሐይ መጥለቻ እይታዎችን ያቀርባሉ። ምሽቶች ዘና የተሞላባቸው ናቸው — ከገበያው ትኩስ ዓሳ፣ በቦልቨርድ ላይ ጉዞ፣ እና በሚቀጥለው ጠዋት ለገዳም ጀልባዎች ቀደም ብለው መነሻ።',
        },
        photo: wikimediaPhoto('View from Shore of Lake Tana - Bahir Dar - Ethiopia - 02 (8677069911).jpg', 1200),
      },
      {
        title: { en: 'Papyrus boats and local markets', am: 'ታንኳና የአካባቢ ገበያዎች' },
        body: {
          en: 'Traditional tankwa — papyrus reed boats — still ferry fishermen and goods across Lake Tana much as they have for centuries. The daily market near the harbor is worth a wander for honey, spices, and handwoven baskets before or after a monastery trip.',
          am: 'ባህላዊ ታንኳዎች — ከፓፒረስ ሸንበቆ የተሠሩ ጀልባዎች — አሁንም ዓሣ አጥማጆችንና ዕቃዎችን በጣና ሐይቅ ላይ ለዘመናት እንዳደረጉት ያጓጉዛሉ። በወደቡ አቅራቢያ ያለው ዕለታዊ ገበያ ከገዳም ጉዞ በፊት ወይም በኋላ ማርን፣ ቅመሞችንና የተጠለፉ ቅርጫቶችን ለማየት ጥሩ ማቆሚያ ነው።',
        },
        photo: wikimediaPhoto('Working on Lake Tana in Bahir Dar, Ethiopia.jpg', 900),
      },
    ],
    gallery: [
      unsplashPhoto('1625141440931-984750bf960a', 1200),
      wikimediaPhoto('Bahir Dar.JPG', 900),
      wikimediaPhoto('Bahir-Dar-Strandcafe.JPG', 1200),
      wikimediaPhoto('Papyrus tankwa boat on Lake Tana (5494263879).jpg', 900),
      unsplashPhoto('1668939581252-470c103ac7da', 1200),
    ],
  },
  'lalibela': {
    sections: [
      {
        title: { en: 'The rock-hewn churches', am: 'ከዓለት የተፈለፈሉ አብያተ ክርስቲያናት' },
        body: {
          en: 'Eleven churches were carved from solid rock in the 12th and 13th centuries, linked by tunnels and trenches. Bet Giyorgis — shaped like a cross — is the most photographed; the northern cluster rewards a full morning with a local guide who can explain the symbolism in each chapel.',
          am: 'አሥራ አንድ አብያተ ክርስቲያናት በ12ኛው እና 13ኛው ክፍተ ክፍል ከጠንካራ ድንጋይ ተቀርጸዋል፤ በዋሻዎችና በዋሻዎች ይገናኛሉ። መስቀል ቅርፅ ያለው ቤተ ጊዮርጊስ በጣም የሚፈጠረው ነው፤ ሰሜናዊው ቡድን ምልክቱን በእያንዳንዱ ካፔላ ላይ የሚያብራራ የአካባቢ መሪ ካለው ሙሉ ጠዋት ይጠብቀዋል።',
        },
        photo: wikimediaPhoto('Bete Giyorgis 01.jpg', 1200),
      },
      {
        title: { en: 'Pilgrimage and Timkat', am: 'ሐጅና ጥምቀት' },
        body: {
          en: 'Lalibela remains a living pilgrimage site. During Timkat (Epiphany) in January, processions fill the courtyards with candles and chanting. Outside festival weeks the town is quieter, but morning prayer still drifts from the churches at dawn.',
          am: 'ላሊበላ እስከ አሁን ድረስ ሕያው የሐጅ ስፍራ ናት። በጥር ወር በሚከበረው ጥምቀት ወቅት ሂደቶች አደባባዮችን በሻማዎችና በመዝሙር ይሞላሉ። ከበዓሉ ሳምንታት ውጭ ከተማዋ ይበልጥ ሰላማዊ ናት፤ ግን ጠዋት ጸሎት ከአብያተ ክርስቲያናቱ በእለቱ ሲነጋላ ገና ይሰማል።',
        },
        photo: wikimediaPhoto('Bete Giyorgis-Lalibela-Prêtre (2).jpg', 900),
      },
      {
        title: { en: 'Highland lodges near the sites', am: 'በቦታዎቹ አቅራቢያ ያሉ የከፍተኛ ቦታ ሎጆች' },
        body: {
          en: 'Most visitors stay within walking distance of the church complexes. Simple guesthouses suit budget travelers; cliff-edge lodges offer sunrise views over the Lasta mountains — worth the early alarm for photographers.',
          am: 'ብዙ ጎብኚዎች ከአብያተ ክርስቲያናት ድርሻዎች በእግር ርቀት ውስጥ ይኖራሉ። ቀላል መስተንግዶ ቤቶች በበጀት የሚጓዙትን ይስማማሉ፤ በገደል ዳርባ ላይ ያሉ ሎጆች በላስታ ተራሮች ላይ የፀሐይ መውጫ እይታ ያቀርባሉ — ለፎቶግራፍ አድናቂዎች ቀደም ብለው መንቃት ይገባቸዋል።',
        },
        photo: unsplashPhoto('1572888195250-3037a59d3578', 1200),
      },
      {
        title: { en: 'Beyond the churches', am: 'ከአብያተ ክርስቲያናት ባሻገር' },
        body: {
          en: 'A short walk or mule ride from town reaches Asheton Maryam, a clifftop monastery with sweeping views over the Lasta highlands. Local markets sell wooden crosses and woven textiles, and village homestays offer a quieter look at rural highland life.',
          am: 'ከከተማው በእግር ወይም በበቅሎ አጭር ጉዞ ወደ አሸተን ማርያም — በላስታ ተራሮች ላይ ሰፊ እይታ ያለው የገደል ጫፍ ገዳም — ይደርሳል። የአካባቢ ገበያዎች የእንጨት መስቀሎችንና የተጠለፉ ጨርቆችን ይሸጣሉ፤ የመንደር ማረፊያዎችም የገጠር ከፍተኛ ቦታ ኑሮን በጸጥታ ለማየት ዕድል ይሰጣሉ።',
        },
        photo: unsplashPhoto('1646647689051-ed33eecf1c21', 900),
      },
    ],
    gallery: [
      wikimediaPhoto('Rock-Hewn Churches, Lalibela Ethiopia (1).jpg', 1200),
      wikimediaPhoto('Bete Giyorgis 05.jpg', 900),
      wikimediaPhoto('Lalibela Churches 2 (28470646216).jpg', 1200),
      wikimediaPhoto('The Threshold, Lalibela, Ethiopia (3298418137).jpg', 900),
      unsplashPhoto('1564101183558-eacfd7e02d4f', 1200),
    ],
  },
  'gondar': {
    sections: [
      {
        title: { en: 'Fasil Ghebbi royal compound', am: 'የፋሲል ግቢ የንጉሣውያን ግቢ' },
        body: {
          en: 'Within the royal enclosure, stone castles and palaces built by Emperor Fasilides and his successors still stand. Fasilides’ Bath fills for Timkat celebrations; the main castle’s towers and banquet halls hint at Gondar’s 17th-century grandeur.',
          am: 'በንጉሣውያን ግቢው ውስጥ በአፄ ፋሲልዬደስና ተከታዮቹ የተገነቡ የድንጋይ ካስትሎችና ቤተ መንግሥቶች አሁንም ቆመዋል። የፋሲልዬደስ መዋኛ ገንዳ ለጥምቀት በዓል ይሞላል፤ ዋናው ካስትል ግንቦቹና የግብዣ አዳራሾቹ የ17ኛው ክፍተ ክፍል ጎንደርን ትልቅነት ያሳያሉ።',
        },
        photo: wikimediaPhoto('ET Gondar asv2018-02 img21 Fasil Ghebbi.jpg', 1200),
      },
      {
        title: { en: 'Debre Berhan Selassie', am: 'ደብረ ብርሃን ሥላሴ' },
        body: {
          en: 'This hillside church is famous for its ceiling of hundreds of angel faces and vivid wall paintings. It survived the Mahdist war when, according to legend, a swarm of bees drove attackers away — a story guides still tell with a smile.',
          am: 'ይህ የአንበሳ ተራራ ቤተ ክርስቲያን በመደበኛ ጣሪያው ላይ በመቶዎች የሚቆጠሩ የመልአክ ፊቶችና ብሩህ የግድግዳ ስዕሎች ታዋቂ ነው። በማህዲስት ጦርነት ዘመን በበራራ ወሽመድ ተጥቂዎችን እንደኰረደባት በአፈ ታሪክ ሲነገር የቀረች ናት — መሪዎች እስከ አሁን በፈገግ ታሪኩን ይነግራሉ።',
        },
        photo: wikimediaPhoto('ET Gondar asv2018-02 img42 Debre Berhan Selassie.jpg', 900),
      },
      {
        title: { en: 'Simien Mountains access', am: 'ወደ ስሜን ተራሮች መዳረሻ' },
        body: {
          en: 'Gondar is the usual staging point for Simien National Park — home to gelada baboons, walia ibex, and escarpment trails. Many travelers combine two nights in Gondar with a multi-day trek or a scenic drive into the highlands.',
          am: 'ጎንደር ለስሜን ብሔራዊ ፓርክ — የጌላዳ ባቡኖች፣ ዋሊያ ኢብክስና የገደል ዱካዎች መኖሪያ — የተለመደ መነሻ ነጥብ ናት። ብዙ ጎብኚዎች በጎንደር ሁለት ሌሊት ከብዙ ቀን ጉዞ ወይም ከከፍተኛ ቦታ ወደ ስሜን የሚደረግ ስኬታማ መንገድ ጉዞ ጋር ያጣምራሉ።',
        },
        photo: wikimediaPhoto('Simien Mountains National Park - Ethiopia.jpg', 1200),
      },
      {
        title: { en: 'Markets, coffee, and local life', am: 'ገበያ፣ ቡናና የአካባቢ ኑሮ' },
        body: {
          en: 'Piassa, Gondar’s central square, is lined with cafés and shops selling silver jewelry and traditional dress. A sunset coffee ceremony here — or in a nearby restaurant courtyard — is a relaxed way to end a day of touring castles and churches.',
          am: 'ፒያሳ፣ የጎንደር ማዕከላዊ አደባባይ፣ በካፌዎችና የብር ጌጣ ጌጦችንና ባህላዊ አልባሳትን በሚሸጡ ሱቆች የተከበበ ነው። እዚህ ወይም በአቅራቢያ ባለ ምግብ ቤት ግቢ ውስጥ የፀሐይ መጥለቂያ የቡና ሥነ ሥርዓት ቤተ መንግሥቶችንና አብያተ ክርስቲያናትን የጎበኙበትን ቀን ለመዝጋት ዘና ያለ መንገድ ነው።',
        },
        photo: wikimediaPhoto('ET Gondar asv2018-02 img13 Fasil Ghebbi.jpg', 900),
      },
    ],
    gallery: [
      wikimediaPhoto('Fasil Ghebbi, Gondar Region-139580.jpg', 1200),
      wikimediaPhoto('ET Gondar asv2018-02 img11 Fasil Ghebbi.jpg', 900),
      wikimediaPhoto('ET Gondar asv2018-02 img21 Fasil Ghebbi.jpg', 1200),
      wikimediaPhoto('ET Gondar asv2018-02 img13 Fasil Ghebbi.jpg', 900),
      wikimediaPhoto('Fasil Ghebbi, Gondar Region-107594.jpg', 1200),
    ],
  },
  'hawassa': {
    sections: [
      {
        title: { en: 'The fish market at dawn', am: 'በጥዋት የዓሳ ገበያ' },
        body: {
          en: 'Lake Hawassa’s shoreline market comes alive at sunrise as fishermen land tilapia and catfish. Pelicans and marabou storks compete for scraps — a raw, photogenic scene that sets the tone for a relaxed Rift Valley stay.',
          am: 'የሐዋሳ ሐይቅ ዳርቻ ገበያ በፀሐይ ሲነጋ ዓሳምያዎች ቲላፒያና አሣን ወደ ዳርቻ ሲያመጡ ይነቃል። ፔሊካኖችና ማራቦ ስቶርኮች ለቀሪያዎች ይተላለፋሉ — ለዘና የተሞላ የስምጥ ሸለቆ ማረፊያ የሚያሳይ ጥሩ ፎቶ የሚሰጥ ትርኢት ነው።',
        },
        photo: wikimediaPhoto('Fish market at Lake Hawassa (1) (28510610004).jpg', 1200),
      },
      {
        title: { en: 'Birding and boat rides', am: 'የወፍ መመልከቻና የጀልባ ጉዞ' },
        body: {
          en: 'The lake and surrounding wetlands attract serious birders year-round. Short boat trips reach pelican nesting sites and quiet coves; resorts often arrange guides who know the best spots for kingfishers and African fish eagles.',
          am: 'ሐይቁና ዙሪያው ያሉ የጥሱ ቦታዎች ዓመቱን ሙሉ ለአዕዋፍ መመልከቻ ባለሙያዎች ይሳባሉ። አጫጭር የጀልባ ጉዞዎች ወደ ፔሊካን መቀመጫዎችና ወደ ሰላማዊ ወሮች ይደርሳሉ፤ መዝናኛ ቦታዎች ብዙውን ጊዜ ለንጉሣዊ ዓሳ ሳህንና ለአፍሪካዊ ዓሳ ንሥር የተሻሉ ቦታዎችን የሚያውቁ መሪዎችን ያዘጋጃሉ።',
        },
        photo: wikimediaPhoto('AwasaMarabou03.jpg', 900),
      },
      {
        title: { en: 'Resort town atmosphere', am: 'የመዝናኛ ከተማ ሁኔታ' },
        body: {
          en: 'Just 275 km from Addis, Hawassa draws weekend visitors and conference guests. Lakeside resorts with pools and restaurants dominate the hotel scene; it is an easy add-on after the historic north or before continuing deeper into the south.',
          am: 'ከአዲስ አበባ መቃበል 275 ኪ.ሜ ብቻ ስራቷ ስለሆነ ሐዋሳ የሳምንት መጨረሻ ጎብኚዎችንና የስብሰባ እንግዶችን ይሳባል። በሐይቁ ዳርቻ ያሉ መዝናኛ ቦታዎች ከመዋኛ ገንዳና ከምግብ ቤቶች ጋር የሆቴል ሁኔታን ይመራሉ፤ ከታሪካዊ ሰሜን በኋላ ወይም ወደ ደቡብ ከመቀጠል በፊት ቀላል ተጨማሪ ጉዞ ነው።',
        },
        photo: wikimediaPhoto('AwasaLakesidePark.jpg', 1200),
      },
      {
        title: { en: 'Local food and nightlife', am: 'የአካባቢ ምግብና የሌሊት ሕይወት' },
        body: {
          en: 'The fish market’s grilled tilapia stalls double as an informal dinner spot at sunset, and lakeside restaurants stay lively into the evening. Hawassa is also an easy base for day trips to nearby Rift Valley lakes such as Abijatta-Shalla National Park.',
          am: 'የዓሳ ገበያው የተጠበሰ ቲላፒያ ማቆሚያዎች በፀሐይ መጥለቂያ ጊዜ መደበኛ ያልሆነ የእራት ቦታ ይሆናሉ፤ በሐይቅ ዳርቻ ያሉ ምግብ ቤቶችም እስከ ማታ ድረስ ሕያው ሆነው ይቆያሉ። ሐዋሳ ወደ አቢጃታ-ሻላ ብሔራዊ ፓርክ ላሉ የስምጥ ሸለቆ ሐይቆች ለቀን ጉዞ ምቹ መነሻም ናት።',
        },
        photo: wikimediaPhoto('Fresh fish food from hawassa lake.jpg', 900),
      },
    ],
    gallery: [
      wikimediaPhoto('Sunset on Lake Hawassa (1) (28843927430).jpg', 1200),
      wikimediaPhoto('Fishing Boats In Lake Hawassa.jpg', 900),
      wikimediaPhoto('Hawassa lake, Ethiopia.jpg', 1200),
      wikimediaPhoto('Reed Boat, Lake Hawassa (10903076965).jpg', 900),
      wikimediaPhoto('View of Lake Hawassa.jpg', 1200),
    ],
  },
  'axum': {
    sections: [
      {
        title: { en: 'Granite stelae and royal tombs', am: 'የድንጋይ ሐውልቶችና የንጉሣዊ መቃብሮች' },
        body: {
          en: 'The field of stelae includes the fallen Great Stele — once the largest single stone ever erected. Underground tombs and palace ruins spread across the site; a licensed guide helps connect the stones to the ancient Kingdom of Aksum.',
          am: 'የሐውልት ሜዳው ውስጥ የወደቀው ታላቁ ሐውልት — ቀድሞ የተነሳ ትልቁ ነጠላ ድንጋይ — ይገኛል። በቁፋሮ መቃብሮችና የቤተ መንግሥት ቅርሶች በቦታው ላይ ተበታተነዋል፤ ፈቃድ ያለው መሪ ድንጋዮቹን ከጥንታዊ የአክሱም መንግሥት ጋር ያገናኛል።',
        },
        photo: wikimediaPhoto('Axum Stelae, Tigray (52282003906).jpg', 1200),
      },
      {
        title: { en: 'Church of St. Mary of Zion', am: 'የጽዮን ማርያም ቤተ ክርስቲያን' },
        body: {
          en: 'Ethiopian tradition holds that the Ark of the Covenant rests in a chapel on this compound, guarded by a single monk. The old and new churches stand side by side; visitors can tour the grounds even when the inner chapel remains closed.',
          am: 'በኢትዮጵያ ትውፊት መሠረት ታቦተ ጽዮን በዚህ ግቢ ውስጥ በአንድ ነገሠታዊ መነክሳዊ የሚጠበቅበት ቦታ ላይ እንደሚኖር ይነገራል። ጥንታዊውና አዲሱ ቤተ ክርስቲያናት በጎን ደረጃ ይቆማሉ፤ ውስጣዊው ካፔላ ሲዘጋ ጎብኚዎች ግቢውን መዞር ይችላሉ።',
        },
        photo: wikimediaPhoto('Adam & Eve & the Serpent - Facade of I Yesus Church - Axum (Aksum) - Ethiopia (8701140705).jpg', 900),
      },
      {
        title: { en: 'Queen of Sheba and ancient trade', am: 'የሳባ ንግሥትና ጥንታዊ ንግድ' },
        body: {
          en: 'Legends tie Axum to the Queen of Sheba and to trade routes that once reached Rome and India. The archaeological museum displays coins, inscriptions, and artifacts that ground the myths in real history — essential context before you explore the stelae field.',
          am: 'አፈ ታሪኮች አክሱምን ከሳባ ንግሥትና ከሮም እና ከሕንድ የሚደርሱ ንግድ መንገዶች ጋር ያገናኛሉ። የአርኪዮሎጂ ሙዚየሙ ሳንቲሞችን፣ ጽሁፎችንና ቅርሶችን ያሳያል — ከሐውልት ሜዳው ከመዞር በፊት አስፈላጊ የታሪክ ዳራ ነው።',
        },
        photo: wikimediaPhoto('Aksum-107549.jpg', 1200),
      },
      {
        title: { en: 'Getting there and local flavor', am: 'ወደ አክሱም መድረሻና የአካባቢ ጣዕም' },
        body: {
          en: 'Axum is reachable by a short flight from Addis or as part of a historic-route drive through Tigray. The town’s markets sell honey wine (tej) and injera made from Tigray’s distinct grains — a good introduction to the region’s cuisine before heading further into the highlands.',
          am: 'አክሱም ከአዲስ አበባ በአጭር በረራ ወይም በትግራይ በኩል በሚደረግ ታሪካዊ የመንገድ ጉዞ ሊደረስበት ይችላል። የከተማዋ ገበያዎች ጠጅንና ከትግራይ ልዩ እህሎች የተሠራ እንጀራ ይሸጣሉ — ወደ ከፍተኛ ቦታዎች ከመቀጠልዎ በፊት የአካባቢውን ምግብ ለመተዋወቅ ጥሩ መግቢያ ነው።',
        },
        photo: wikimediaPhoto('Axum Tigray.jpg', 900),
      },
    ],
    gallery: [
      wikimediaPhoto('Stelae Field in Axum, Ethiopia (2830293765).jpg', 1200),
      wikimediaPhoto('Obelisk at Axum.jpg', 900),
      wikimediaPhoto('Aksum-107550.jpg', 1200),
      wikimediaPhoto('Aksum Quarry for Obelisks.jpg', 900),
      wikimediaPhoto('Obleisks of Axum.jpg', 1200),
    ],
  },
  'harar': {
    sections: [
      {
        title: { en: 'Inside the Jugol walls', am: 'በጅገል ግንብ ውስጥ' },
        body: {
          en: 'Five historic gates lead into Harar Jugol, where over 80 mosques and countless alleys fit inside less than one square kilometer. Painted facades in green, blue, and pink make every turn a photograph — best explored on foot with a local guide.',
          am: 'አምስት ታሪካዊ በሮች ወደ ሐረር ጅገል ያስገባሉ፤ ከሰማንያ በላይ መስጊዶችና ብዙ ጠባብ መንገዶች በአንድ ካሬ ኪሎ ሜትር ውስጥ ይገኛሉ። በአረንጓዴ፣ በሰማያዊና በሮዝ ቀለማት የተሸበረቁ ፊቶች እያንዳንዱን ጥብቅ ፎቶ ያደርገዋል — በአካባቢ መሪ ከእግር መዞር ይመረጣል።',
        },
        photo: wikimediaPhoto('Harar Gate, Walled City (8002004000).jpg', 1200),
      },
      {
        title: { en: 'Hyena feeding ritual', am: 'የጅብ አመጋገብ ሥነ ሥርዓት' },
        body: {
          en: 'Each night outside the walls, hyena men call spotted hyenas by name and hand-feed them meat. The tradition is centuries old and controversial — but remains one of Harar’s most talked-about experiences for visitors who venture out after dark.',
          am: 'በእያንዳንዱ ሌሊት ከግንቡ ውጭ ጅብ ሰብአዊዎች በስም የሚጠሩትን ነብረ ጅቦችን ይጥራሉና ስጋ ይሰጣሉ። ባህሉ ጥንታዊ ሲሆን አስተውሎ የሚታየውም ነው — ነገር ግን ከግንቡ በኋላ ለሚወጡ ጎብኚዎች ከሐረር በጣም የሚነገሩ ተሞክሮዎች አንዱ ነው።',
        },
        photo: wikimediaPhoto('Hyena Man in Ethiopia.jpg', 900),
      },
      {
        title: { en: 'Coffee birthplace culture', am: 'የቡና መገዛ ባህል' },
        body: {
          en: 'Eastern Ethiopia claims a deep coffee heritage, and Harar’s old town is full of tiny coffee houses serving thick, spiced bunna. Spend an afternoon in a traditional home ceremony — the pace here is slower and more intimate than in the capital.',
          am: 'ምስራቅ ኢትዮጵያ ለቡና ጥልቅ ቅርስ አላት ይላል፤ የሐረር ጥንታዊ ከተማ በጣም ውፍራት ቡና የሚሰጡ ትናንሽ ቡና ቤቶችን ተደራጀቷል። በባህላዊ የቤት ሥነ ሥርዓት ከሰዓት ያሳልፉ — እዚህ ፍጥነቱ ከዋና ከተማው ይበልጥ ዘና የተሞላና ቅርብ ነው።',
        },
        photo: wikimediaPhoto('Traditional Harari Wares (8415736119).jpg', 1200),
      },
      {
        title: { en: 'Markets and Harari crafts', am: 'ገበያና የሐረሪ የእጅ ሥራ' },
        body: {
          en: 'Harar’s markets are known for tightly woven baskets and colorful handwoven textiles unique to the Harari people. The squares near the old gates are good places to watch artisans work and pick up souvenirs made the traditional way.',
          am: 'የሐረር ገበያዎች ለሐረሪ ሕዝብ ልዩ በሆኑ በጥብቅ የተጠለፉ ቅርጫቶችና ባለ ብዙ ቀለም በተጠለፉ ጨርቆች ይታወቃሉ። በአሮጌዎቹ በሮች አቅራቢያ ያሉ የገበያ አደባባዮች የእጅ ባለሙያዎችን ሥራ ለመመልከትና በባህላዊ መንገድ የተሠሩ መታሰቢያዎችን ለመግዛት ጥሩ ቦታዎች ናቸው።',
        },
        photo: wikimediaPhoto('Colourful street scene in Harar, Eastern Ethiopia. (33475842005).jpg', 900),
      },
    ],
    gallery: [
      wikimediaPhoto('Harar, Ethiopia - 52016203786.jpg', 1200),
      wikimediaPhoto('Harar, Ethiopia.jpg', 900),
      wikimediaPhoto('The Colors of Harar, Ethiopia (2800935157).jpg', 1200),
      wikimediaPhoto('Spice Market, Harar Jugol (14449618904).jpg', 900),
      wikimediaPhoto('Harar old city.jpg', 1200),
    ],
  },
};

export function getDestinationGuide(slug: string): DestinationGuide | undefined {
  return destinationGuides[slug];
}
