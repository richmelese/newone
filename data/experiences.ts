import type { Experience } from '@/types';
import { experiencePhoto, pexelsPhoto, wikimediaPhoto } from '@/lib/images';

export const experiences: Experience[] = [
  {
    id: 'exp-addis-national-museum',
    destinationSlug: 'addis-ababa',
    name: { en: 'National Museum & Lucy', am: 'ብሔራዊ ሙዚየምና ሉሲ' },
    description: { en: 'See the fossil replica of Lucy and Ethiopia’s deep human history.', am: 'የሉሲን ቅሪተ አካል ቅጂና የኢትዮጵያን ጥልቅ የሰው ልጅ ታሪክ ይመልከቱ።' },
    longDescription: {
      en: 'Ethiopia’s National Museum houses the country’s most significant archaeological finds, most famously a cast of “Lucy,” the 3.2-million-year-old Australopithecus afarensis skeleton unearthed in the Afar region in 1974 (the fragile original fossil is kept separately and rarely on public view). Upper floors cover imperial regalia, traditional dress, and 20th-century Ethiopian art. Plan for about an hour, and consider hiring one of the guides near the entrance — the English labeling is sparse in places.',
      am: 'የኢትዮጵያ ብሔራዊ ሙዚየም አገሪቱ ካላት እጅግ ጠቃሚ የአርኪዮሎጂ ግኝቶች መካከል አንዱን ይይዛል፣ በተለይም በ1974 ዓ.ም. በአፋር ክልል የተገኘችው የ3.2 ሚሊዮን ዓመት እድሜ ያላት የአውስትራሎፒቲከስ አፋረንሲስ አጽም ቅጂ የሆነችው “ሉሲ” ናት (ስስ የሆነው ዋናው ቅሪተ አካል ለብቻው ተቀምጦ ለሕዝብ እምብዛም አይታይም)። የላይኞቹ ወለሎች የንጉሣውያን ልብሶችን፣ ባህላዊ አልባሳትንና የ20ኛው ክፍለ ዘመን የኢትዮጵያ ጥበብን ያሳያሉ። ወደ አንድ ሰዓት ያህል ጊዜ ይመድቡ፣ እና በአንዳንድ ቦታዎች የእንግሊዝኛ ማብራሪያ አነስተኛ ስለሆነ ከመግቢያው አጠገብ ካሉ መሪዎች አንዱን ለመቅጠር ያስቡ።',
    },
    photo: pexelsPhoto(17650078, 700),
    category: 'Culture',
  },
  {
    id: 'exp-addis-holy-trinity',
    destinationSlug: 'addis-ababa',
    name: { en: 'Holy Trinity Cathedral', am: 'ቅድስት ሥላሴ ካቴድራል' },
    description: { en: 'Ethiopia’s grandest church, resting place of Emperor Haile Selassie.', am: 'የኢትዮጵያ ታላቁ ቤተ ክርስቲያንና የቀዳማዊ ኃይለ ሥላሴ መቃብር ስፍራ።' },
    longDescription: {
      en: 'Built to commemorate liberation from Italian occupation, Holy Trinity Cathedral is the second-highest ranking church in Ethiopian Orthodox Christianity and the final resting place of Emperor Haile Selassie and Empress Menen. Stained glass windows, marble memorials, and intricate mosaics fill the interior, and the surrounding gardens hold the graves of patriots who died resisting the occupation. A guide near the entrance can point out the notable tombs and explain the cathedral’s role in modern Ethiopian history.',
      am: 'ከጣሊያን ወረራ ነፃ መውጣትን ለማስታወስ የተገነባው ቅድስት ሥላሴ ካቴድራል በኢትዮጵያ ኦርቶዶክስ ተዋህዶ ቤተ ክርስቲያን ተዋረድ ውስጥ ሁለተኛ ደረጃ ያለውና የቀዳማዊ ኃይለ ሥላሴና የእቴጌ መነን የመጨረሻ ማረፊያ ነው። የቀለም መስተዋት መስኮቶች፣ የእብነ በረድ መታሰቢያዎችና ውስብስብ ሞዛይኮች ውስጡን ይሞላሉ፣ በዙሪያው ያሉ የአትክልት ስፍራዎችም ወረራውን ሲቃወሙ የሞቱ አርበኞችን መቃብር ይይዛሉ። ከመግቢያው አጠገብ ያለ መሪ ታዋቂ መቃብሮችን ጠቁሞ ካቴድራሉ በዘመናዊ ኢትዮጵያ ታሪክ ውስጥ ያለውን ሚና ሊያብራራ ይችላል።',
    },
    photo: experiencePhoto('exp-addis-holy-trinity', 'Culture', 700),
    category: 'Culture',
  },
  {
    id: 'exp-addis-merkato-textiles',
    destinationSlug: 'addis-ababa',
    name: { en: 'Shiro Meda Weavers’ Quarter', am: 'ሽሮ ሜዳ ሸማኔዎች ሰፈር' },
    description: { en: 'Watch artisans hand-weave traditional habesha kemis on wooden looms.', am: 'ባህላዊ የሐበሻ ቀሚስ በእንጨት ማግ ላይ በእጅ ሲሸመን የእጅ ጥበብ ባለሙያዎችን ይመልከቱ።' },
    longDescription: {
      en: 'Shiro Meda is home to generations of weavers producing the hand-spun cotton shawls and dresses worn at Ethiopian holidays and weddings, each edged with the colorful woven borders known as tibeb. Narrow lanes are lined with open-fronted workshops where you can watch the whole process, from spinning thread to weaving on traditional wooden looms, and buy directly from the makers at a fraction of shop prices.',
      am: 'ሽሮ ሜዳ በኢትዮጵያ በዓላትና ሠርግ ላይ የሚለበሱ የተፈተለ የጥጥ ጋቢዎችንና ቀሚሶችን የሚያመርቱ ትውልዶች ያለፉባቸው ሸማኔዎች መኖሪያ ነው፣ እያንዳንዱም ጥልፍ ተብሎ በሚታወቀው ባለቀለም የሽመና ጠርዝ ያጌጠ ነው። ጠባብ መንገዶች ክፍት-ፊት ወርክሾፖችን ይይዛሉ፣ እዚያም ክርን ከመፍተል እስከ ባህላዊ የእንጨት ማግ ድረስ ያለውን ሙሉ ሂደት ማየትና ከሠሪዎቹ በቀጥታ ከሱቅ ዋጋ በጣም በርካሽ መግዛት ይችላሉ።',
    },
    photo: experiencePhoto('exp-addis-merkato-textiles', 'Culture', 700),
    category: 'Culture',
  },
  {
    id: 'exp-addis-meskel-square',
    destinationSlug: 'addis-ababa',
    name: { en: 'Meskel Square Heritage Walk', am: 'የመስቀል አደባባይ ቅርስ ጉዞ' },
    description: { en: 'The civic heart of Addis, host to the Meskel bonfire and holiday parades.', am: 'የመስቀል ደመራንና የበዓል ሰልፎችን የሚያስተናግድ የአዲስ አበባ ማዕከላዊ አደባባይ።' },
    photo: experiencePhoto('exp-addis-meskel-square', 'Culture', 700),
    category: 'Culture',
  },
  {
    id: 'exp-addis-entoto',
    destinationSlug: 'addis-ababa',
    name: { en: 'Entoto Hills Sunset', am: 'የእንጦጦ ተራሮች ፀሐይ ስትጠልቅ' },
    description: { en: 'Ride up to Entoto for panoramic sunset views over the capital.', am: 'ወደ እንጦጦ ወጥተው በካፒታሉ ላይ ሙሉ የፀሐይ ስትጠልቅ እይታ ይመልከቱ።' },
    longDescription: {
      en: 'At around 3,200 meters, Entoto is the highest point overlooking Addis Ababa and was once the site of Emperor Menelik II’s original capital before the court moved down into the valley. A short drive or hike up brings you past eucalyptus forest — first planted here in the 1890s to solve the city’s firewood shortage — to viewpoints where the whole capital spreads out below. Arrive an hour before sunset to catch the light changing over the hills, and bring a layer; it gets noticeably cooler than downtown after dark.',
      am: 'በ3,200 ሜትር ከፍታ ላይ የሚገኘው እንጦጦ አዲስ አበባን ከፍ ብሎ የሚመለከት ከፍተኛ ቦታ ሲሆን ቤተ መንግሥቱ ወደ ሸለቆው ከመዛወሩ በፊት የንጉሠ ነገሥት ዳግማዊ ምኒልክ የመጀመሪያ ዋና ከተማ የነበረበት ቦታ ነው። አጭር የመኪና ወይም የእግር ጉዞ በ1890ዎቹ ለከተማዋ የማገዶ እጥረት መፍትሄ ለመስጠት ለመጀመሪያ ጊዜ የተተከለውን የባህር ዛፍ ደን አልፎ መላውን ዋና ከተማ ከስር የሚያሳዩ እይታዎች ላይ ያደርስዎታል። ብርሃኑ በተራሮች ላይ ሲቀያየር ለማየት ከፀሐይ ስትጠልቅ በፊት ለአንድ ሰዓት ይድረሱ፣ እና ተጨማሪ ልብስ ይያዙ — ከምሽት በኋላ ከከተማ መሃል በጣም ይቀዘቅዛል።',
    },
    photo: pexelsPhoto(19559917, 700),
    category: 'Nature',
  },
  {
    id: 'exp-addis-unity-park',
    destinationSlug: 'addis-ababa',
    name: { en: 'Unity Park', am: 'የአንድነት ፓርክ' },
    description: { en: 'Palace grounds turned public park, with gardens, a small zoo, and museums.', am: 'ወደ ሕዝብ ፓርክ የተለወጠ የቤተ መንግሥት ግቢ፣ አትክልት ስፍራ፣ ትንሽ መካነ አራዊትና ሙዚየሞችን የያዘ።' },
    photo: experiencePhoto('exp-addis-unity-park', 'Nature', 700),
    category: 'Nature',
  },
  {
    id: 'exp-addis-gullele-garden',
    destinationSlug: 'addis-ababa',
    name: { en: 'Gullele Botanic Garden', am: 'የጉለሌ የዕፅዋት ገነት' },
    description: { en: 'Native highland forest and trails on the northern slopes above the city.', am: 'ከከተማው በላይ በሰሜናዊ ተራሮች ላይ የሚገኙ የአገር በቀል ደኖችና መንገዶች።' },
    photo: experiencePhoto('exp-addis-gullele-garden', 'Nature', 700),
    category: 'Nature',
  },
  {
    id: 'exp-addis-menagesha-forest',
    destinationSlug: 'addis-ababa',
    name: { en: 'Menagesha Suba Forest Day Trip', am: 'የመናገሻ ሱባ ደን የቀን ጉዞ' },
    description: { en: 'Hike one of Africa’s oldest forest reserves, less than an hour from the city.', am: 'ከከተማ ከአንድ ሰዓት ባነሰ ርቀት የሚገኘውን ከአፍሪካ ጥንታዊ የደን ክምችቶች አንዱን ይራመዱ።' },
    photo: experiencePhoto('exp-addis-menagesha-forest', 'Nature', 700),
    category: 'Nature',
  },
  {
    id: 'exp-bahirdar-monasteries',
    destinationSlug: 'bahir-dar',
    name: { en: 'Lake Tana Monastery Boat Tour', am: 'የጣና ሐይቅ ገዳማት የጀልባ ጉዞ' },
    description: { en: 'Cruise to island monasteries with centuries-old religious art.', am: 'የዘመናት ሃይማኖታዊ ሥዕል ወዳላቸው ደሴት ገዳማት ይጓዙ።' },
    longDescription: {
      en: 'Lake Tana’s roughly twenty island and peninsula monasteries date back as far as the 14th century, and several — including Ura Kidane Mihret and Narga Selassie — are known for vivid wall paintings depicting biblical scenes in a distinct Ethiopian style. Boats leave from the Bahir Dar waterfront and typically visit two or three monasteries over a half-day, with a stop where hippos are often spotted near the lake’s edges. Modest dress is expected inside the churches, and a small entry donation is customary at each site.',
      am: 'የጣና ሐይቅ ወደ ሃያ የሚጠጉ የደሴትና ባሕረ ገብ መሬት ገዳማት ያሉት ሲሆን ከ14ኛው ክፍለ ዘመን ጀምሮ የቆዩ ናቸው። ከእነዚህ መካከል ኡራ ኪዳነ ምሕረትና ናርጋ ሥላሴ የመጽሐፍ ቅዱስ ታሪኮችን በልዩ የኢትዮጵያ ስልት የሚያሳዩ ደማቅ የግድግዳ ሥዕሎቻቸው ይታወቃሉ። ጀልባዎች ከባሕር ዳር ወደብ ተነስተው በተለምዶ በግማሽ ቀን ውስጥ ሁለት ወይም ሦስት ገዳማትን ይጎበኛሉ፣ በሐይቁ ዳርቻ አካባቢ ጉማሬዎች ብዙ ጊዜ የሚታዩበት ማቆሚያም አለ። በአብያተ ክርስቲያናቱ ውስጥ ልከኛ አለባበስ ይጠበቃል፣ በእያንዳንዱ ስፍራ ትንሽ የመግቢያ ስጦታ መስጠት የተለመደ ነው።',
    },
    photo: pexelsPhoto(20041269, 700),
    category: 'Culture',
  },
  {
    id: 'exp-bahirdar-falls',
    destinationSlug: 'bahir-dar',
    name: { en: 'Blue Nile Falls Hike', am: 'የጢስ አባይ ፏፏቴ ጉዞ' },
    description: { en: 'A scenic walk to Ethiopia’s thundering “smoking water” falls.', am: 'ወደ ኢትዮጵያ ገዳይ «የሚያጨስ ውሃ» ፏፏቴ የሚደረግ ውብ ጉዞ።' },
    longDescription: {
      en: 'Known locally as Tis Abay, or “smoking water,” the Blue Nile Falls once stretched nearly 400 meters wide before a hydroelectric dam reduced their flow — they’re still most dramatic in the wet season, from roughly June to September. The walk from the parking area to the viewpoints takes 30–45 minutes each way over rocky, occasionally steep terrain, crossing a stone bridge with views back toward the gorge. Local guides wait at the trailhead and are worth hiring for the informal river-crossing shortcuts and background on the site.',
      am: 'በአካባቢው ትስ አባይ ወይም «የሚያጨስ ውሃ» ተብሎ የሚታወቀው የጢስ አባይ ፏፏቴ የውሃ ኃይል ማመንጫ ግድብ ፍሰቱን ከመቀነሱ በፊት ወደ 400 ሜትር ስፋት ይደርስ ነበር — አሁንም ከሰኔ እስከ መስከረም ባለው የክረምት ወቅት እጅግ አስደናቂ ሆኖ ይታያል። ከማቆሚያ ስፍራው ወደ እይታ ቦታዎች ያለው የእግር ጉዞ በአንድ አቅጣጫ 30-45 ደቂቃ የሚወስድ ሲሆን በአለታማና አልፎ አልፎ ገደላማ መሬት ላይ የሚያልፍ፣ ወደ ሸለቆው የሚመለከት የድንጋይ ድልድይ የሚያቋርጥ ነው። የአካባቢው መሪዎች በጉዞው መጀመሪያ ላይ ይጠባበቃሉ፣ መደበኛ ላልሆኑ የወንዝ መሻገሪያ አቋራጭ መንገዶችና ስለ ስፍራው ላለው መረጃ አንዱን መቅጠር ተገቢ ነው።',
    },
    photo: experiencePhoto('exp-bahirdar-falls', 'Nature', 700),
    category: 'Nature',
  },
  {
    id: 'exp-lalibela-churches',
    destinationSlug: 'lalibela',
    name: { en: 'Northern Church Cluster at Sunrise', am: 'ሰሜናዊ የቤተ ክርስቲያናት ስብስብ በጠዋት' },
    description: { en: 'Beat the crowds with an early visit to Bete Giyorgis and beyond.', am: 'ጠዋት በመነሳት ወደ ቤተ ጊዮርጊስና ሌሎችም ቀድሞ ይጎብኙ።' },
    longDescription: {
      en: 'Lalibela’s eleven monolithic churches were carved directly out of solid volcanic rock in the 12th and 13th centuries, and the northern cluster — including Bete Medhane Alem, believed to be the largest monolithic church in the world, and Bete Maryam — is the most visited group. Arriving right at opening beats both the heat and the tour-bus crowds that build up by mid-morning, and the low-angle light makes the carved facades and interior frescoes easier to photograph. Priests are usually on hand to unlock inner chambers and explain individual crosses and manuscripts for a small donation.',
      am: 'የላሊበላ አስራ አንድ ከነጠላ ድንጋይ የተጠረቡ አብያተ ክርስቲያናት በ12ኛውና በ13ኛው ክፍለ ዘመን ከጠጣር የእሳተ ገሞራ ድንጋይ በቀጥታ ተቀርፀው የተሠሩ ናቸው፣ የሰሜኑ ስብስብ — በዓለም ትልቁ ከነጠላ ድንጋይ የተሠራ ቤተ ክርስቲያን ተብሎ የሚታመነውን ቤተ መድኃኔ ዓለምንና ቤተ ማርያምን ጨምሮ — በብዛት የሚጎበኘው ስብስብ ነው። መክፈቻ ላይ ልክ መድረስ ሙቀቱንም ሆነ በጠዋት አጋማሽ የሚበዙትን የቱር አውቶብስ ተጓዦችን ያስቀራል፣ ዝቅተኛ ማዕዘን ያለው ብርሃንም የተቀረጹትን የፊት ገጽታዎችና የውስጥ ሥዕሎችን ፎቶ ለማንሳት ቀላል ያደርገዋል። ካህናት ብዙ ጊዜ የውስጥ ክፍሎችን ለመክፈትና ስለ ግለሰብ መስቀሎችና ብራናዎች ለማብራራት በትንሽ ስጦታ ተገኝተው ይጠብቃሉ።',
    },
    photo: pexelsPhoto(7438884, 700),
    category: 'Culture',
  },
  {
    id: 'exp-lalibela-market',
    destinationSlug: 'lalibela',
    name: { en: 'Saturday Market', am: 'የቅዳሜ ገበያ' },
    description: { en: 'Browse spices, textiles, and highland produce with local traders.', am: 'ከአካባቢ ነጋዴዎች ጋር ቅመማ ቅመም፣ ጨርቅና የተራራ ውጤቶች ይመልከቱ።' },
    longDescription: {
      en: 'Highlanders from villages around Lalibela walk in each Saturday to trade at this weekly market, which spills across an open hillside just outside town — expect teff, barley, and spices sold by the sack, along with hand-forged tools, rope, and secondhand clothing. It’s one of the least touristy things to do in Lalibela and a good way to see the region’s rural economy up close, though English is rarely spoken, so a guide or a few Amharic phrases go a long way. Go early; most trading wraps up by early afternoon.',
      am: 'ከላሊበላ አካባቢ ካሉ መንደሮች የመጡ ተራራማ ነዋሪዎች በየሳምንቱ ቅዳሜ ወደዚህ ገበያ በእግር ይመጣሉ፣ ገበያውም ከከተማው ውጭ ባለ ክፍት ኮረብታ ላይ ይዘረጋል — ጤፍ፣ ገብስና ቅመማ ቅመም በከረጢት ሲሸጡ፣ በእጅ የተሠሩ መሳሪያዎች፣ ገመድና አልቀዳሚ ልብሶችም ይታያሉ። ከላሊበላ ብዙም የቱሪስት ያልሆኑ ነገሮች አንዱ ሲሆን የአካባቢውን የገጠር ኢኮኖሚ በቅርበት ለማየት ጥሩ መንገድ ነው፣ ነገር ግን እንግሊዝኛ እምብዛም ስለማይነገር መሪ መያዝ ወይም ጥቂት የአማርኛ ቃላት ማወቅ ይጠቅማል። ገበያው በአብዛኛው ከሰዓት በኋላ ማለዳ ስለሚያልቅ ማለዳ ይሂዱ።',
    },
    photo: experiencePhoto('exp-lalibela-market', 'Culture', 700),
    category: 'Culture',
  },
  {
    id: 'exp-gondar-fasil',
    destinationSlug: 'gondar',
    name: { en: 'Fasil Ghebbi Royal Enclosure', am: 'የፋሲል ግቢ ንጉሣውያን ቅጥር' },
    description: { en: 'Tour six centuries-old castles built by successive emperors.', am: 'በተከታታይ ነገሥታት የተገነቡ ስድስት ካስትሎችን ይጎብኙ።' },
    longDescription: {
      en: 'Founded by Emperor Fasilides in 1636 when he made Gondar his capital, the Royal Enclosure gathers six castles and palaces built by him and his successors over the following century, blending Aksumite, Portuguese Baroque, and local architectural styles — a mix historians often point to as evidence of Gondar’s role as a crossroads of trade and ideas. A single ticket covers the whole compound, and a guide (available at the entrance) is genuinely useful here for telling the very similar-looking stone buildings apart. Set aside about 90 minutes, more if you’re combining it with the nearby Fasilides’ Bath.',
      am: 'ንጉሠ ነገሥት ፋሲልደስ ጎንደርን ዋና ከተማው ባደረገበት 1636 ዓ.ም. የተመሠረተው ይህ የንጉሣውያን ግቢ በእሱና በተከታዮቹ በቀጣዮቹ መቶ ዓመታት የተገነቡ ስድስት ካስትሎችንና ቤተ መንግሥቶችን ይይዛል፣ የአክሱማዊ፣ የፖርቱጋል ባሮክና የአካባቢውን የሕንፃ ስልቶች በማዋሃድ — ታሪክ ጸሐፊዎች ብዙ ጊዜ ጎንደር የንግድና የሐሳብ መገናኛ እንደነበረች ማስረጃ አድርገው የሚጠቅሱት ውህደት ነው። አንድ ትኬት መላውን ግቢ ይሸፍናል፣ በመግቢያው ላይ የሚገኝ መሪም በጣም ተመሳሳይ የሚመስሉትን የድንጋይ ሕንፃዎች ለመለየት እውነተኛ ጠቀሜታ አለው። ወደ 90 ደቂቃ ያህል ጊዜ ይመድቡ፣ ከአጠገቡ ካለው የፋሲልደስ መዋኛ ጋር የሚያዋህዱ ከሆነ ደግሞ ተጨማሪ ጊዜ ይያዙ።',
    },
    photo: pexelsPhoto(17853346, 700),
    category: 'History',
  },
  {
    id: 'exp-gondar-simien',
    destinationSlug: 'gondar',
    name: { en: 'Simien Mountains Day Trip', am: 'የስሜን ተራሮች የቀን ጉዞ' },
    description: { en: 'Spot gelada baboons and dramatic escarpments on a highland day hike.', am: 'በተራራማው የቀን ጉዞ ላይ ጭላዳ ዝንጀሮዎችንና አስደናቂ ገደሎችን ይመልከቱ።' },
    longDescription: {
      en: 'A UNESCO World Heritage Site, the Simien Mountains are best known for dramatic escarpments dropping over a thousand meters and for gelada baboons — a species found only in Ethiopia’s highlands — that graze in large troops right beside the trails. A day trip from Gondar typically covers the Sankaber or Chenek areas with a scout (mandatory inside the park) and a couple of hours of walking; a multi-day trek is needed to reach Ras Dashen, Ethiopia’s highest peak. Mornings are clearest before afternoon cloud builds over the escarpment, so an early start is worth it.',
      am: 'በዩኔስኮ የዓለም ቅርስ ተመዝግቦ የሚገኘው የስሜን ተራሮች ብሔራዊ ፓርክ ከሺህ ሜትር በላይ በሚወርዱ አስደናቂ ገደሎችና በኢትዮጵያ ተራራማ አካባቢዎች ብቻ በሚገኙት ጭላዳ ዝንጀሮዎች ይታወቃል፣ እነዚህም በትላልቅ መንጋዎች በመንገዶቹ አጠገብ ይሰማራሉ። ከጎንደር የሚደረግ የቀን ጉዞ በተለምዶ የሳንካበርን ወይም የቸነክን አካባቢዎች ከጠባቂ (በፓርኩ ውስጥ የግድ አስፈላጊ) ጋር እና ጥቂት ሰዓታት የእግር ጉዞን ያካትታል፤ የኢትዮጵያ ከፍተኛ ቦታ ወደሆነው ራስ ዳሸን ለመድረስ ግን የብዙ ቀናት ጉዞ ያስፈልጋል። ጠዋቶች ከሰዓት በኋላ በገደሉ ላይ ደመና ከመስፋፋቱ በፊት ግልጽ ስለሚሆኑ ማለዳ መጀመር ተገቢ ነው።',
    },
    photo: experiencePhoto('exp-gondar-simien', 'Nature', 700),
    category: 'Nature',
  },
  {
    id: 'exp-hawassa-fishmarket',
    destinationSlug: 'hawassa',
    name: { en: 'Hawassa Fish Market', am: 'የሐዋሳ ዓሳ ገበያ' },
    description: { en: 'Watch the morning catch come in and sample grilled lake fish.', am: 'የማለዳ ዓሳ ማጥመድ ውጤትን ይመልከቱና የተጠበሰ ዓሳ ይቅመሱ።' },
    longDescription: {
      en: 'Every morning, fishermen bring in tilapia and catfish caught overnight on Lake Hawassa, and the market’s grill stalls will clean, season, and fry your pick within minutes for a few dozen birr — one of the most direct lake-to-plate experiences in the country. Marabou storks and pelicans loiter around the cleaning tables waiting for scraps, which draws almost as many onlookers as the food does. Go before 9am for the freshest catch and the least crowded stalls.',
      am: 'በየማለዳው ዓሣ አጥማጆች በሐዋሳ ሐይቅ ማታ ላይ የያዙትን ጣላፒያና ጨብራ ያመጣሉ፣ የገበያው መጥበሻ ስፍራዎችም የመረጡትን በጥቂት ደቂቃዎች ውስጥ በጥቂት ብር ያጸዳሉ፣ ይቀምማሉ፣ ይጠብሳሉ — ከሐይቅ እስከ ሳህን ካሉት እጅግ ቀጥተኛ ተሞክሮዎች አንዱ ነው። ማራቡ ሽመላዎችና ፔሊካኖች ትራፊውን ለመጠበቅ በማጽጃ ጠረጴዛዎቹ ዙሪያ ይንከራተታሉ፣ ይህም ምግቡን ያህል ተመልካቾችን ይስባል። ትኩስ ዓሣና ብዙም ያልተጨናነቁ ስፍራዎችን ለማግኘት ከጠዋቱ 9 ሰዓት በፊት ይሂዱ።',
    },
    photo: pexelsPhoto(8351649, 700),
    category: 'Food',
  },
  {
    id: 'exp-hawassa-birding',
    destinationSlug: 'hawassa',
    name: { en: 'Rift Valley Birdwatching', am: 'የስምጥ ሸለቆ የአዕዋፍ መመልከቻ' },
    description: { en: 'Spot flamingos, pelicans, and fish eagles along the lakeshore.', am: 'በሐይቁ ዳርቻ ፍላሚንጎ፣ ፔሊካንና የዓሳ ንስር ይመልከቱ።' },
    photo: experiencePhoto('exp-hawassa-birding', 'Nature', 700),
    category: 'Nature',
  },
  {
    id: 'exp-axum-stelae',
    destinationSlug: 'axum',
    name: { en: 'Stelae Park & Museum', am: 'የእስቴላ ፓርክና ሙዚየም' },
    description: { en: 'Stand beside towering granite obelisks carved two millennia ago.', am: 'ከሁለት ሺህ ዓመታት በፊት የተቀረጹ ግዙፍ ሐውልቶች ጎን ቆመው ይመልከቱ።' },
    photo: pexelsPhoto(36336675, 700),
    category: 'History',
  },
  {
    id: 'exp-axum-marystzion',
    destinationSlug: 'axum',
    name: { en: 'Church of St. Mary of Zion', am: 'ጽዮን ማርያም ቤተ ክርስቲያን' },
    description: { en: 'Visit the chapel said by tradition to house the Ark of the Covenant.', am: 'በትውፊት የታቦተ ጽዮን ማደሪያ ተብሎ የሚነገርለትን ጸሎት ቤት ይጎብኙ።' },
    photo: experiencePhoto('exp-axum-marystzion', 'Culture', 700),
    category: 'Culture',
  },
  {
    id: 'exp-harar-hyena',
    destinationSlug: 'harar',
    name: { en: 'Hyena Feeding Ritual', am: 'የጅብ አመጋገብ ሥነ ሥርዓት' },
    description: { en: 'Watch the centuries-old nightly ritual of hand-feeding wild hyenas.', am: 'የዘመናት ማታ ላይ ዱር ጅቦችን በእጅ የመመገብ ሥነ ሥርዓት ይመልከቱ።' },
    photo: pexelsPhoto(10528757, 700),
    category: 'Culture',
  },
  {
    id: 'exp-harar-coffee',
    destinationSlug: 'harar',
    name: { en: 'Traditional Coffee Ceremony', am: 'ባህላዊ የቡና ሥነ ሥርዓት' },
    description: { en: 'Experience Ethiopia’s birthplace-of-coffee ritual, roast to cup.', am: 'ከቡና መገኛ ኢትዮጵያ ጀምሮ እስከ ጽዋ ድረስ ያለውን ሥነ ሥርዓት ይለማመዱ።' },
    photo: experiencePhoto('exp-harar-coffee', 'Food', 700),
    category: 'Food',
  },
  {
    id: 'exp-addis-mercato',
    destinationSlug: 'addis-ababa',
    name: { en: 'Mercato Market Walk', am: 'የመርካቶ ገበያ ጉብኝት' },
    description: { en: 'Wander Africa’s largest open-air market for spices, textiles, and crafts.', am: 'የቅመማ ቅመም፣ የጨርቅና የእጅ ሥራ ውጤቶች ማዕከል በሆነው ትልቁ የአፍሪካ ገበያ ውስጥ ይዘዋወሩ።' },
    photo: experiencePhoto('exp-addis-mercato', 'Shopping', 700),
    category: 'Shopping',
  },
  {
    id: 'exp-addis-shopping-2',
    destinationSlug: 'addis-ababa',
    name: { en: 'Friendship Square Craft Market', am: 'የወዳጅነት አደባባይ የእጅ ሥራ ገበያ' },
    description: { en: 'A tidy row of stalls selling leather goods, jewelry, and woven scarves.', am: 'የቆዳ ውጤቶች፣ ጌጣጌጦችና የተሸመኑ ሻርፖች የሚሸጡበት የተስተካከለ የሱቆች ረድፍ።' },
    longDescription: {
      en: 'A compact, easy-to-browse market just off Bole Road where a few dozen vendors sell leather bags and belts, silver and beaded jewelry, hand-woven scarves, and small woodcraft souvenirs. It’s far less overwhelming than Mercato, making it a good stop if you want authentic handmade goods without the crowds — most stallholders are used to friendly bargaining and are happy to talk through where a piece was made.',
      am: 'ከቦሌ መንገድ ትንሽ ራቅ ብሎ የሚገኝ፣ ለማየት ቀላል የሆነ ገበያ ሲሆን በደርዘን የሚቆጠሩ ሻጮች የቆዳ ቦርሳዎችንና ቀበቶዎችን፣ የብርና የዶቃ ጌጣጌጦችን፣ በእጅ የተሸመኑ ሻርፖችንና ትናንሽ የእንጨት ሥራ መታሰቢያዎችን ይሸጣሉ። ከመርካቶ በጣም ያነሰ ተጨናንቆ ስለሆነ ያለ ብዙ ሰዎች እውነተኛ በእጅ የተሠሩ ዕቃዎችን ለሚፈልጉ ጥሩ ማቆሚያ ነው — አብዛኞቹ ሻጮች ወዳጃዊ ድርድርን ለምደዋል እና ዕቃው የት እንደተሠራ ለመንገር ደስተኞች ናቸው።',
    },
    address: { en: 'Near Friendship Square, off Bole Road, Addis Ababa', am: 'ከወዳጅነት አደባባይ አጠገብ፣ ከቦሌ መንገድ ራቅ ብሎ፣ አዲስ አበባ' },
    photo: experiencePhoto('exp-addis-shopping-2', 'Shopping', 700),
    gallery: [
      experiencePhoto('exp-addis-shopping-2-stalls', 'Shopping', 900),
      experiencePhoto('exp-addis-shopping-2-leather', 'Shopping', 900),
      experiencePhoto('exp-addis-shopping-2-jewelry', 'Shopping', 900),
    ],
    category: 'Shopping',
  },
  {
    id: 'exp-addis-shola-market',
    destinationSlug: 'addis-ababa',
    name: { en: 'Shola Market Spice Walk', am: 'የሾላ ገበያ ቅመማ ቅመም ጉዞ' },
    description: { en: 'A neighborhood market piled with berbere, spices, and fresh produce.', am: 'በበርበሬ፣ ቅመማ ቅመምና ትኩስ አትክልት የተሞላ የሰፈር ገበያ።' },
    photo: experiencePhoto('exp-addis-shola-market', 'Shopping', 700),
    category: 'Shopping',
  },
  {
    id: 'exp-addis-edna-mall',
    destinationSlug: 'addis-ababa',
    name: { en: 'Edna Mall, Bole', am: 'ኤድና ሞል፣ ቦሌ' },
    description: { en: 'A modern mall with a cinema, cafes, and international brands.', am: 'ሲኒማ ቤት፣ ካፌዎችና ዓለም አቀፍ ብራንዶች ያሉት ዘመናዊ ሞል።' },
    photo: experiencePhoto('exp-addis-edna-mall', 'Shopping', 700),
    category: 'Shopping',
  },
  {
    id: 'exp-addis-jazz',
    destinationSlug: 'addis-ababa',
    name: { en: 'Live Ethio-Jazz Night', am: 'ሕያው የኢትዮ ጃዝ ምሽት' },
    description: { en: 'Catch a live set at a historic Addis jazz club after dark.', am: 'ማታ ላይ በአዲስ አበባ ታሪካዊ ጃዝ ክለብ ውስጥ ሕያው ሙዚቃ ያዳምጡ።' },
    longDescription: {
      en: 'Ethio-jazz was born in Addis Ababa, blending pentatonic Ethiopian melodies with Afro-funk and jazz improvisation. Tonight’s set brings that sound to a small, historic club downtown — expect a horn section, a packed dance floor, and a set list that stretches from smoky ballads to horn-driven grooves. Doors open at 8pm; the house band usually takes the stage around 9:30pm and plays late.',
      am: 'ኢትዮ-ጃዝ የተወለደው በአዲስ አበባ ነው፤ የኢትዮጵያን ፔንታቶኒክ ዜማዎች ከአፍሮ-ፈንክና ከጃዝ ማሻሻያ ጋር በማዋሃድ። የዛሬው ምሽት ይህን ድምጽ ወደ አንድ ትንሽ፣ ታሪካዊ ክለብ በከተማ መሃል ያመጣል — የቀንድ ክፍልን፣ የተጨናነቀ የዳንስ ወለልን፣ እና ከጭስ ባላዶች እስከ በቀንድ የሚመሩ ግሩቭስ የሚደርስ ዝርዝር ይጠብቁ። በሮች በ2፡00 ምሽት ይከፈታሉ፤ የቤት ባንዱ በተለምዶ በ3፡30 ምሽት አካባቢ መድረክ ይይዛል እና እስከ ማታ ይጫወታል።',
    },
    photo: experiencePhoto('exp-addis-jazz', 'Nightlife', 700),
    gallery: [
      experiencePhoto('exp-addis-jazz-stage', 'Nightlife', 900),
      experiencePhoto('exp-addis-jazz-crowd', 'Nightlife', 900),
      experiencePhoto('exp-addis-jazz-horns', 'Nightlife', 900),
      experiencePhoto('exp-addis-jazz-bar', 'Nightlife', 900),
    ],
    category: 'Nightlife',
    schedule: [
      { day: { en: 'Fridays', am: 'ዓርብ' }, time: '9:30 PM', title: { en: 'House band — full set', am: 'የቤት ባንድ — ሙሉ ትርኢት' } },
      { day: { en: 'Saturdays', am: 'ቅዳሜ' }, time: '9:30 PM', title: { en: 'Guest horn section night', am: 'የእንግዳ ቀንድ ክፍል ምሽት' } },
      { day: { en: 'Sundays', am: 'እሁድ' }, time: '7:00 PM', title: { en: 'Acoustic & vocals (early set)', am: 'የድምፅ ትርኢት (ቀደም ብሎ)' } },
    ],
    bookable: true,
    externalBookingUrl: 'https://www.addisjazzclub-example.com/tickets',
    externalSiteName: 'addisjazzclub-example.com',
  },
  {
    id: 'exp-addis-nightlife-2',
    destinationSlug: 'addis-ababa',
    name: { en: 'Fendika Cultural Center', am: 'ፈንዲቃ የባህል ማዕከል' },
    description: { en: 'An intimate venue for azmari music and traditional dance performances.', am: 'ለአዝማሪ ሙዚቃና ባህላዊ ዳንስ ትርኢቶች ምቹ የሆነ ትንሽ ስፍራ።' },
    photo: experiencePhoto('exp-addis-nightlife-2', 'Nightlife', 700),
    category: 'Nightlife',
    schedule: [{ day: { en: 'Thu–Sat', am: 'ሐሙስ–ቅዳሜ' }, time: '8:30 PM' }],
  },
  {
    id: 'exp-addis-nightlife-3',
    destinationSlug: 'addis-ababa',
    name: { en: 'Alize Rooftop Lounge', am: 'አሊዜ የጣራ ላይ ላውንጅ' },
    description: { en: 'Cocktails and skyline views above the Bole business district.', am: 'ከቦሌ የንግድ ስፍራ በላይ ኮክቴሎችና የከተማ እይታ።' },
    photo: experiencePhoto('exp-addis-nightlife-3', 'Nightlife', 700),
    category: 'Nightlife',
  },
  {
    id: 'exp-addis-nightlife-4',
    destinationSlug: 'addis-ababa',
    name: { en: 'H2O Lounge & Bar', am: 'ኤች2ኦ ላውንጅ እና ባር' },
    description: { en: 'A late-night spot with DJ sets and a lively dance floor.', am: 'በዲጄ ትርኢትና ሕያው የዳንስ ወለል የሚታወቅ የሌሊት ስፍራ።' },
    photo: experiencePhoto('exp-addis-nightlife-4', 'Nightlife', 700),
    category: 'Nightlife',
  },
  {
    id: 'exp-addis-art-gallery',
    destinationSlug: 'addis-ababa',
    name: { en: 'Addis Fine Art Gallery', am: 'አዲስ ጥበብ ጋለሪ' },
    description: { en: 'Contemporary Ethiopian and East African art in a converted industrial space.', am: 'በተለወጠ የኢንዱስትሪ ቦታ ውስጥ ዘመናዊ የኢትዮጵያና የምስራቅ አፍሪካ ጥበብ።' },
    longDescription: {
      en: 'A rotating program of contemporary painting, sculpture, and photography from Ethiopian and East African artists, shown across a series of bright, minimal rooms. Exhibitions typically change every six to eight weeks, so there’s usually something new even for repeat visitors. Entry is free; a small gift shop near the entrance sells prints and catalogs from past shows.',
      am: 'ከኢትዮጵያና ከምስራቅ አፍሪካ የመጡ ዘመናዊ ሥዕል፣ ቅርጻ ቅርጽና ፎቶግራፍ በተከታታይ በሚቀያየር መርሃ ግብር በብሩህ፣ ቀላል ክፍሎች ውስጥ ይታያል። ኤግዚቢሽኖች በተለምዶ በየ6-8 ሳምንቱ ይቀየራሉ፣ ስለዚህ ደጋግመው ለሚጎበኙ እንኳ አዲስ ነገር ይኖራል። መግቢያ ነጻ ነው፤ ከመግቢያ አጠገብ ያለ ትንሽ የስጦታ ሱቅ ከቀድሞ ትርኢቶች ህትመቶችንና ካታሎጎችን ይሸጣል።',
    },
    photo: experiencePhoto('exp-addis-art-gallery', 'Art Gallery', 700),
    gallery: [
      experiencePhoto('exp-addis-art-gallery-room1', 'Art Gallery', 900),
      experiencePhoto('exp-addis-art-gallery-room2', 'Art Gallery', 900),
      experiencePhoto('exp-addis-art-gallery-sculpture', 'Art Gallery', 900),
    ],
    category: 'Art Gallery',
  },
  {
    id: 'exp-addis-art-gallery-2',
    destinationSlug: 'addis-ababa',
    name: { en: 'Nubian Art Space', am: 'ኑቢያን የጥበብ ስፍራ' },
    description: { en: 'An artist-run gallery showcasing emerging Ethiopian painters and photographers.', am: 'በአርቲስቶች የሚተዳደር ብቅ ያሉ የኢትዮጵያ ሰዓሊያንና ፎቶግራፈሮችን የሚያሳይ ጋለሪ።' },
    photo: experiencePhoto('exp-addis-art-gallery-2', 'Art Gallery', 700),
    category: 'Art Gallery',
  },
  {
    id: 'exp-addis-zoma-museum',
    destinationSlug: 'addis-ababa',
    name: { en: 'Zoma Museum', am: 'ዞማ ሙዚየም' },
    description: { en: 'Hand-built mud architecture housing art, gardens, and a children’s school.', am: 'ጥበብን፣ የአትክልት ስፍራንና የልጆች ትምህርት ቤትን የያዘ በእጅ የተገነባ የጭቃ ሕንፃ።' },
    photo: experiencePhoto('exp-addis-zoma-museum', 'Art Gallery', 700),
    category: 'Art Gallery',
  },
  {
    id: 'exp-addis-guramayne-art',
    destinationSlug: 'addis-ababa',
    name: { en: 'Guramayne Art Center', am: 'ጉራማይኔ የጥበብ ማዕከል' },
    description: { en: 'A community studio and gallery supporting young Ethiopian artists.', am: 'ወጣት የኢትዮጵያ አርቲስቶችን የሚደግፍ የማህበረሰብ ስቱዲዮና ጋለሪ።' },
    photo: experiencePhoto('exp-addis-guramayne-art', 'Art Gallery', 700),
    category: 'Art Gallery',
  },
  {
    id: 'exp-addis-coffeehouse',
    destinationSlug: 'addis-ababa',
    name: { en: 'Tomoca Coffee House', am: 'ቶሞካ ቡና ቤት' },
    description: { en: 'A standing-room Addis institution roasting and pouring since the 1950s.', am: 'ከ1950ዎቹ ጀምሮ ቡና የሚጠብስና የሚያፈስ የቆመ አገልግሎት የአዲስ አበባ ተቋም።' },
    longDescription: {
      en: 'One of the oldest coffee houses in Addis Ababa, still roasting its own beans on-site and serving them at a standing bar the way it has for decades. Expect a short menu, strong coffee, and a steady stream of regulars — this is a five-minute stop for a shot of macchiato, not a sit-down café.',
      am: 'ከአዲስ አበባ ጥንታዊ ቡና ቤቶች አንዱ ሲሆን አሁንም የራሱን ቡና በቦታው እየጠበሰ ለአስርተ ዓመታት እንደነበረው በቆመ አሞሌ ላይ ያቀርባል። አጭር ዝርዝር፣ ጠንካራ ቡናና ተከታታይ ደንበኞችን ይጠብቁ — ይህ የአምስት ደቂቃ ማኪያቶ ማቆሚያ ነው፣ የተቀመጡበት ካፌ አይደለም።',
    },
    photo: experiencePhoto('exp-addis-coffeehouse', 'Coffee House', 700),
    gallery: [
      experiencePhoto('exp-addis-coffeehouse-bar', 'Coffee House', 900),
      experiencePhoto('exp-addis-coffeehouse-roast', 'Coffee House', 900),
      experiencePhoto('exp-addis-coffeehouse-cup', 'Coffee House', 900),
    ],
    category: 'Coffee House',
    menu: [
      {
        name: { en: 'Macchiato', am: 'ማኪያቶ' },
        description: { en: 'The house specialty — espresso with a touch of steamed milk.', am: 'የቤቱ ልዩ ምርት — ትንሽ የተጨመቀ ወተት ያለው ኤስፕሬሶ።' },
        priceFromEtb: 45,
      },
      {
        name: { en: 'Buna (traditional black coffee)', am: 'ቡና (ባህላዊ ጥቁር ቡና)' },
        description: { en: 'Strong, unfiltered coffee brewed the traditional way.', am: 'በባህላዊ መንገድ የተዘጋጀ ጠንካራ፣ ያልተጣራ ቡና።' },
        priceFromEtb: 35,
      },
      {
        name: { en: 'Single-origin pour over', am: 'ነጠላ-ምንጭ ፑር ኦቨር' },
        description: { en: 'Rotating single-origin beans from Yirgacheffe, Sidamo, or Harar.', am: 'ከይርጋጨፌ፣ ከሲዳማ ወይም ከሐረር የሚቀያየር ነጠላ-ምንጭ ቡና።' },
        priceFromEtb: 60,
      },
      {
        name: { en: 'Roasted beans (250g, to go)', am: 'የተጠበሰ ቡና (250 ግራም፣ ለመውሰድ)' },
        description: { en: 'Take the house roast home with you.', am: 'የቤቱን ቡና ይዘው ወደ ቤት ይሂዱ።' },
        priceFromEtb: 220,
      },
    ],
  },
  {
    id: 'exp-addis-coffeehouse-2',
    destinationSlug: 'addis-ababa',
    name: { en: 'Kaldi’s Corner — Bole', am: 'ካልዲስ ኮርነር — ቦሌ' },
    description: { en: 'A modern espresso bar popular with students and remote workers.', am: 'በተማሪዎችና በርቀት ሠራተኞች ዘንድ ተወዳጅ የሆነ ዘመናዊ ኤስፕሬሶ ባር።' },
    photo: experiencePhoto('exp-addis-coffeehouse-2', 'Coffee House', 700),
    category: 'Coffee House',
    menu: [
      { name: { en: 'Espresso', am: 'ኤስፕሬሶ' }, priceFromEtb: 40 },
      { name: { en: 'Iced macchiato', am: 'የበረዶ ማኪያቶ' }, priceFromEtb: 70 },
      { name: { en: 'Avocado toast', am: 'አቮካዶ ቶስት' }, priceFromEtb: 150 },
    ],
  },
  {
    id: 'exp-addis-coffeehouse-3',
    destinationSlug: 'addis-ababa',
    name: { en: 'Garden of Coffee', am: 'የቡና ገነት' },
    description: { en: 'An open-air coffee garden serving buna ceremonies amid greenery.', am: 'በአረንጓዴ ስፍራ ውስጥ የቡና ሥነ ሥርዓት የሚያቀርብ ክፍት አየር ቡና ገነት።' },
    photo: experiencePhoto('exp-addis-coffeehouse-3', 'Coffee House', 700),
    category: 'Coffee House',
  },
  {
    id: 'exp-addis-coffeehouse-4',
    destinationSlug: 'addis-ababa',
    name: { en: 'Adoris Coffee', am: 'አዶሪስ ቡና' },
    description: { en: 'A specialty roastery pouring single-origin Ethiopian beans.', am: 'ነጠላ-ምንጭ የኢትዮጵያ ቡናን የሚያፈስ ልዩ ቆያሪ ስፍራ።' },
    photo: pexelsPhoto(6152270, 700),
    category: 'Coffee House',
  },
  {
    id: 'exp-addis-beauty-salon',
    destinationSlug: 'addis-ababa',
    name: { en: 'Habesha Beauty & Spa', am: 'ሐበሻ ውበትና ስፓ' },
    description: { en: 'A relaxed salon and spa offering hair, nails, and traditional-inspired treatments.', am: 'ፀጉር፣ ጥፍርና በባህል የተነሳሱ ህክምናዎችን የሚያቀርብ ምቹ ሳሎንና ስፓ።' },
    longDescription: {
      en: 'A calm, modern salon just off Bole Road offering haircuts and styling, manicures and pedicures, facials, and massage — including a traditional Ethiopian coffee-scrub treatment unique to the region. Staff are used to walk-ins but recommend booking ahead for weekend slots.',
      am: 'ከቦሌ መንገድ ትንሽ ራቅ ብሎ የሚገኝ ጸጥ ያለ፣ ዘመናዊ ሳሎን ፀጉር መቁረጥና ማስተካከል፣ የእጅና የእግር ጥፍር እንክብካቤ፣ የፊት እንክብካቤና ማሳጅ ያቀርባል — ለአካባቢው ልዩ የሆነውን ባህላዊ የቡና ገላ ማሸት ጨምሮ። ሠራተኞቹ ያለ ቀጠሮ ለሚመጡ ለምደዋል፣ ነገር ግን ለቅዳሜ እሁድ ጊዜ አስቀድሞ መያዝን ይመክራሉ።',
    },
    address: { en: 'Bole Road, near Edna Mall, Addis Ababa', am: 'ቦሌ መንገድ፣ ከኤድና ሞል አጠገብ፣ አዲስ አበባ' },
    photo: '/images/beauty-salon/addis-salon-natural-hair.png',
    gallery: [
      '/images/beauty-salon/addis-salon-natural-hair.png',
      '/images/beauty-salon/addis-salon-braiding.png',
      '/images/beauty-salon/addis-salon-manicure.png',
    ],
    category: 'Beauty Salon',
    services: [
      {
        name: { en: 'Haircut & styling', am: 'ፀጉር መቁረጥና ማስተካከል' },
        photo: '/images/beauty-salon/addis-salon-natural-hair.png',
        durationMinutes: 45,
        priceFromEtb: 350,
      },
      {
        name: { en: 'Hair coloring', am: 'የፀጉር ቀለም' },
        photo: '/images/beauty-salon/addis-salon-braiding.png',
        durationMinutes: 90,
        priceFromEtb: 900,
      },
      {
        name: { en: 'Eyelash extensions', am: 'የሽፋሽፍት ቅጥያ' },
        photo: '/images/beauty-salon/addis-salon-manicure.png',
        durationMinutes: 75,
        priceFromEtb: 800,
      },
      {
        name: { en: 'Manicure & pedicure', am: 'የእጅና የእግር ጥፍር እንክብካቤ' },
        photo: '/images/beauty-salon/addis-salon-manicure.png',
        durationMinutes: 60,
        priceFromEtb: 450,
      },
      {
        name: { en: 'Classic facial', am: 'የፊት እንክብካቤ' },
        photo: '/images/beauty-salon/addis-salon-natural-hair.png',
        durationMinutes: 40,
        priceFromEtb: 500,
      },
      {
        name: { en: 'Traditional coffee-scrub massage', am: 'ባህላዊ የቡና ገላ ማሸት' },
        photo: '/images/beauty-salon/addis-salon-natural-hair.png',
        durationMinutes: 60,
        priceFromEtb: 700,
      },
    ],
    bookable: true,
    externalBookingUrl: 'https://www.habeshabeautyspa-example.com/book',
    externalSiteName: 'habeshabeautyspa-example.com',
  },
  {
    id: 'exp-addis-beauty-salon-2',
    destinationSlug: 'addis-ababa',
    name: { en: 'Sheba Wellness & Spa', am: 'ሳባ ጤናና ስፓ' },
    description: { en: 'A boutique day spa specializing in facials, massage, and bridal makeup packages.', am: 'በፊት እንክብካቤ፣ ማሳጅና የሙሽራ ሜካፕ ጥቅል የተካነ ትንሽ የቀን ስፓ።' },
    address: { en: 'Kazanchis, Addis Ababa', am: 'ካዛንቺስ፣ አዲስ አበባ' },
    photo: '/images/beauty-salon/addis-salon-braiding.png',
    gallery: [
      '/images/beauty-salon/addis-salon-braiding.png',
      '/images/beauty-salon/addis-salon-manicure.png',
    ],
    category: 'Beauty Salon',
    services: [
      {
        name: { en: 'Bridal makeup', am: 'የሙሽራ ሜካፕ' },
        photo: '/images/beauty-salon/addis-salon-braiding.png',
        durationMinutes: 90,
        priceFromEtb: 1200,
      },
      {
        name: { en: 'Deep-tissue massage', am: 'ጥልቅ ማሳጅ' },
        photo: '/images/beauty-salon/addis-salon-manicure.png',
        durationMinutes: 60,
        priceFromEtb: 650,
      },
      {
        name: { en: 'Classic manicure', am: 'መደበኛ የጥፍር እንክብካቤ' },
        photo: '/images/beauty-salon/addis-salon-manicure.png',
        durationMinutes: 35,
        priceFromEtb: 300,
      },
    ],
    bookable: true,
    externalBookingUrl: 'https://www.shebawellnessspa-example.com/book',
    externalSiteName: 'shebawellnessspa-example.com',
  },
  {
    id: 'exp-addis-hansim-beauty-salon',
    destinationSlug: 'addis-ababa',
    name: { en: 'Hansim Beauty Salon', am: 'ሃንሲም የውበት ሳሎን' },
    description: {
      en: 'A welcoming beauty salon offering hair styling, braiding, makeup, and nail care.',
      am: 'የፀጉር ማስዋብ፣ ጉንጉን፣ ሜካፕ እና የጥፍር እንክብካቤ የሚያቀርብ ምቹ የውበት ሳሎን።',
    },
    longDescription: {
      en: 'Hansim Beauty Salon provides everyday and special-occasion beauty services in a friendly setting. Guests can choose from hair styling and braiding, makeup, manicures, and pedicures.',
      am: 'ሃንሲም የውበት ሳሎን ለዕለታዊ እና ለልዩ ዝግጅቶች የውበት አገልግሎቶችን በምቹ ሁኔታ ያቀርባል። የፀጉር ማስዋብ፣ ጉንጉን፣ ሜካፕ፣ የእጅ እና የእግር ጥፍር እንክብካቤ ይገኛሉ።',
    },
    address: { en: 'Addis Ababa', am: 'አዲስ አበባ' },
    photo: '/images/beauty-salon/hansim-salon.png',
    gallery: [
      '/images/beauty-salon/hansim-salon.png',
      '/images/beauty-salon/hansim-founder.jpg',
      '/images/beauty-salon/hansim-logo.png',
    ],
    category: 'Beauty Salon',
    services: [
      {
        name: { en: 'Hair styling & braiding', am: 'የፀጉር ማስዋብና ጉንጉን' },
        photo: '/images/beauty-salon/hansim-salon.png',
        priceFromEtb: 500,
      },
      {
        name: { en: 'Makeup', am: 'ሜካፕ' },
        photo: '/images/beauty-salon/hansim-founder.jpg',
        priceFromEtb: 700,
      },
      {
        name: { en: 'Manicure & pedicure', am: 'የእጅና የእግር ጥፍር እንክብካቤ' },
        photo: '/images/beauty-salon/hansim-logo.png',
        priceFromEtb: 450,
      },
    ],
    bookable: true,
    externalBookingUrl: 'https://hansimacademy.com/',
    externalSiteName: 'hansimacademy.com',
  },
  {
    id: 'exp-addis-beauty-salon-3',
    destinationSlug: 'addis-ababa',
    name: { en: 'Zenith Beauty Lounge', am: 'ዜኒዝ የውበት ላውንጅ' },
    description: { en: 'A modern lounge specializing in gel nails, lashes, and blowouts.', am: 'በጄል ጥፍር፣ በሽፋሽፍትና በፀጉር ማድረቅ የተካነ ዘመናዊ ላውንጅ።' },
    photo: experiencePhoto('exp-addis-beauty-salon-3', 'Beauty Salon', 700),
    category: 'Beauty Salon',
  },
  {
    id: 'exp-bahirdar-zeghie',
    destinationSlug: 'bahir-dar',
    name: { en: 'Zeghie Peninsula Forest Walk', am: 'የዘጌ ባሕረ ገብ መሬት ደን ጉዞ' },
    description: { en: 'Wander coffee-forest trails linking ancient island monasteries.', am: 'ጥንታዊ ደሴት ገዳማትን የሚያገናኙ የቡና ደን መንገዶችን ይራመዱ።' },
    photo: experiencePhoto('exp-bahirdar-zeghie', 'Nature', 700),
    category: 'Nature',
  },
  {
    id: 'exp-bahirdar-market',
    destinationSlug: 'bahir-dar',
    name: { en: 'Basket & Weaving Market', am: 'የቅርጫትና ሽመና ገበያ' },
    description: { en: 'Shop handwoven baskets and cotton textiles from lakeside artisans.', am: 'ከሐይቅ ዳርቻ የእጅ ጥበብ ባለሙያዎች የተሸመኑ ቅርጫቶችንና የጥጥ ጨርቆችን ይግዙ።' },
    photo: experiencePhoto('exp-bahirdar-market', 'Shopping', 700),
    category: 'Shopping',
  },
  {
    id: 'exp-bahirdar-market-2',
    destinationSlug: 'bahir-dar',
    name: { en: 'Lakeside Souvenir Market', am: 'የሐይቅ ዳርቻ የመታሰቢያ ገበያ' },
    description: { en: 'Waterfront stalls selling papyrus art and Lake Tana-themed souvenirs.', am: 'የፓፒረስ ሥነ ጥበብና የጣና ሐይቅ ገፅታ ያላቸው የመታሰቢያ ዕቃዎች የሚሸጡበት የባህር ዳርቻ ሱቆች።' },
    photo: experiencePhoto('exp-bahirdar-market-2', 'Shopping', 700),
    category: 'Shopping',
  },
  {
    id: 'exp-lalibela-yemrehanna',
    destinationSlug: 'lalibela',
    name: { en: 'Yemrehanna Kristos Cave Church', am: 'የይምርሃነ ክርስቶስ ዋሻ ቤተ ክርስቲያን' },
    description: { en: 'Trek to a striking 11th-century church built inside a mountain cave.', am: 'በ11ኛው ክፍለ ዘመን በተራራ ዋሻ ውስጥ ወደ ተገነባ ቤተ ክርስቲያን ይጓዙ።' },
    photo: experiencePhoto('exp-lalibela-yemrehanna', 'History', 700),
    category: 'History',
  },
  {
    id: 'exp-lalibela-weaving',
    destinationSlug: 'lalibela',
    name: { en: 'Traditional Weaving Village', am: 'ባህላዊ የሽመና መንደር' },
    description: { en: 'Watch cotton scarves and shawls hand-woven on wooden looms.', am: 'የጥጥ ሻርፖችና ጋቢዎች በእንጨት ማግ ላይ በእጅ ሲሸመኑ ይመልከቱ።' },
    photo: experiencePhoto('exp-lalibela-weaving', 'Craft', 700),
    category: 'Craft',
  },
  {
    id: 'exp-lalibela-weaving-2',
    destinationSlug: 'lalibela',
    name: { en: 'Ashetan Weavers Cooperative', am: 'የአሸተን ሸማኔዎች ማህበር' },
    description: { en: 'A women-run cooperative producing hand-spun cotton shawls.', am: 'በእጅ የተፈተለ የጥጥ ጋቢ የሚያመርት በሴቶች የሚተዳደር ማህበር።' },
    photo: experiencePhoto('exp-lalibela-weaving-2', 'Craft', 700),
    category: 'Craft',
  },
  {
    id: 'exp-gondar-bath',
    destinationSlug: 'gondar',
    name: { en: 'Fasilides’ Bath', am: 'የፋሲልደስ መዋኛ ቦታ' },
    description: { en: 'Visit the emperor’s stone bathing pool, flooded yearly for Timkat.', am: 'በየዓመቱ ለጥምቀት በዓል የሚሞላውን የንጉሠ ነገሥት ድንጋይ መዋኛ ገንዳ ይጎብኙ።' },
    photo: experiencePhoto('exp-gondar-bath', 'History', 700),
    category: 'History',
  },
  {
    id: 'exp-gondar-coffeehouse',
    destinationSlug: 'gondar',
    name: { en: 'Evening Coffee House', am: 'የምሽት ቡና ቤት' },
    description: { en: 'Wind down with a slow coffee ceremony and local storytelling.', am: 'በዝግታ የቡና ሥነ ሥርዓትና በአካባቢ ታሪክ ትረካ ምሽትዎን ያሳልፉ።' },
    photo: experiencePhoto('exp-gondar-coffeehouse', 'Food', 700),
    category: 'Food',
  },
  {
    id: 'exp-hawassa-sunset',
    destinationSlug: 'hawassa',
    name: { en: 'Lake Hawassa Sunset Cruise', am: 'የሐዋሳ ሐይቅ የፀሐይ ስትጠልቅ ጉዞ' },
    description: { en: 'Glide across calm waters as hippos surface in the evening light.', am: 'ጉማሬዎች በምሽት ብርሃን ውስጥ ሲወጡ በተረጋጋ ውሃ ላይ ይንሸራተቱ።' },
    photo: experiencePhoto('exp-hawassa-sunset', 'Relaxation', 700),
    category: 'Relaxation',
  },
  {
    id: 'exp-hawassa-senkele',
    destinationSlug: 'hawassa',
    name: { en: 'Senkele Wildlife Sanctuary', am: 'የሰንቀሌ የዱር እንስሳት መጠበቂያ' },
    description: { en: 'Day trip to spot Swayne’s hartebeest and grassland wildlife.', am: 'የስዌይን ኩዳን አጋዘንና ሌሎች የሳር ምድር የዱር እንስሳትን ለማየት የቀን ጉዞ ያድርጉ።' },
    photo: experiencePhoto('exp-hawassa-senkele', 'Wildlife', 700),
    category: 'Wildlife',
  },
  {
    id: 'exp-axum-sheba',
    destinationSlug: 'axum',
    name: { en: 'Queen of Sheba’s Bath', am: 'የንግሥት ሳባ መዋኛ' },
    description: { en: 'See the ancient reservoir tied to Axum’s Queen of Sheba legend.', am: 'ከአክሱም የንግሥት ሳባ አፈ ታሪክ ጋር የተያያዘውን ጥንታዊ የውሃ ማጠራቀሚያ ይመልከቱ።' },
    photo: experiencePhoto('exp-axum-sheba', 'History', 700),
    category: 'History',
  },
  {
    id: 'exp-axum-weaving',
    destinationSlug: 'axum',
    name: { en: 'Textile Weavers’ Workshop', am: 'የሸማኔዎች ወርክሾፕ' },
    description: { en: 'Meet artisans hand-weaving traditional Tigray cotton garments.', am: 'ባህላዊ የትግራይ የጥጥ አልባሳትን በእጅ የሚሸምኑ የእጅ ጥበብ ባለሙያዎችን ያግኙ።' },
    photo: experiencePhoto('exp-axum-weaving', 'Craft', 700),
    category: 'Craft',
  },
  {
    id: 'exp-axum-weaving-2',
    destinationSlug: 'axum',
    name: { en: 'Adwa Road Textile Workshop', am: 'የአድዋ መንገድ ጨርቃ ጨርቅ ወርክሾፕ' },
    description: { en: 'A small workshop weaving traditional Tigrayan gabi blankets on foot looms.', am: 'ባህላዊ የትግራይ ጋቢ ብርድ ልብስ በእግር ማግ የሚሸምን ትንሽ ወርክሾፕ።' },
    photo: experiencePhoto('exp-axum-weaving-2', 'Craft', 700),
    category: 'Craft',
  },
  {
    id: 'exp-harar-rimbaud',
    destinationSlug: 'harar',
    name: { en: 'Arthur Rimbaud Cultural Center', am: 'የአርተር ሪምቦ የባህል ማዕከል' },
    description: { en: 'Explore the restored merchant house tied to the French poet’s years in Harar.', am: 'ከፈረንሳዊው ገጣሚ ከሐረር ቆይታ ጋር የተያያዘውን የተመለሰ የነጋዴ ቤት ያስሱ።' },
    photo: experiencePhoto('exp-harar-rimbaud', 'History', 700),
    category: 'History',
  },
  {
    id: 'exp-harar-walls',
    destinationSlug: 'harar',
    name: { en: 'Jugol Wall & Gates Walk', am: 'የጅገል ግንብና በሮች ጉዞ' },
    description: { en: 'Follow the 16th-century city walls through five historic gates.', am: 'በ16ኛው ክፍለ ዘመን የተገነባውን የከተማ ግንብ በአምስት ታሪካዊ በሮች በኩል ይከተሉ።' },
    photo: wikimediaPhoto('Harar Gate, Walled City (8002004000).jpg', 1600),
    gallery: [
      wikimediaPhoto('Harar old city.jpg', 1200),
      wikimediaPhoto('Spice Market, Harar Jugol (14449618904).jpg', 1200),
      wikimediaPhoto('Colourful street scene in Harar, Eastern Ethiopia. (33475842005).jpg', 1200),
      wikimediaPhoto('The Colors of Harar, Ethiopia (2800935157).jpg', 1200),
      wikimediaPhoto('Harar, Ethiopia.jpg', 1200),
    ],
    category: 'Culture',
  },
];

export function getExperiencesByDestination(destinationSlug: string): Experience[] {
  return experiences.filter((e) => e.destinationSlug === destinationSlug);
}

export function getExperience(id: string): Experience | undefined {
  return experiences.find((e) => e.id === id);
}

export function getExperiencesByDestinationAndCategory(destinationSlug: string, category: string): Experience[] {
  return experiences.filter((e) => e.destinationSlug === destinationSlug && e.category === category);
}

/** Cheapest listed price across an experience's menu/services, or undefined if it has neither. */
export function getExperienceFromPrice(experience: Experience): number | undefined {
  const prices = [
    ...(experience.menu ?? []).map((item) => item.priceFromEtb),
    ...(experience.services ?? []).map((item) => item.priceFromEtb),
  ].filter((price): price is number => price !== undefined);
  return prices.length > 0 ? Math.min(...prices) : undefined;
}

/** Every unique (destination, category) combination that appears in the data — used to statically generate category pages. */
export function getDestinationCategoryPairs(): { destinationSlug: string; category: string }[] {
  const seen = new Set<string>();
  const pairs: { destinationSlug: string; category: string }[] = [];
  experiences.forEach((e) => {
    const key = `${e.destinationSlug}::${e.category}`;
    if (seen.has(key)) return;
    seen.add(key);
    pairs.push({ destinationSlug: e.destinationSlug, category: e.category });
  });
  return pairs;
}

export function featuredExperiences(limit = 8): Experience[] {
  const seenDestinations = new Set<string>();
  const spread: Experience[] = [];
  for (const exp of experiences) {
    if (seenDestinations.has(exp.destinationSlug)) continue;
    seenDestinations.add(exp.destinationSlug);
    spread.push(exp);
  }
  for (const exp of experiences) {
    if (spread.length >= limit) break;
    if (!spread.includes(exp)) spread.push(exp);
  }
  return spread.slice(0, limit);
}

/** Spreads (destination, category) pairs across as many destinations as possible — used for the homepage teaser row. */
export function featuredCategoryPairs(limit = 8): { destinationSlug: string; category: string }[] {
  const pairs = getDestinationCategoryPairs();
  const seenDestinations = new Set<string>();
  const spread: { destinationSlug: string; category: string }[] = [];
  for (const pair of pairs) {
    if (seenDestinations.has(pair.destinationSlug)) continue;
    seenDestinations.add(pair.destinationSlug);
    spread.push(pair);
  }
  for (const pair of pairs) {
    if (spread.length >= limit) break;
    if (!spread.includes(pair)) spread.push(pair);
  }
  return spread.slice(0, limit);
}
