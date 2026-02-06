export interface LocationCity {
  name: string
  nameHe: string
}

export interface LocationRegion {
  name: string
  nameHe: string
  cities: LocationCity[]
}

export interface LocationCountry {
  code: string
  name: string
  nameHe: string
  flag: string
  regions: LocationRegion[]
}

export const LOCATIONS: LocationCountry[] = [
  {
    code: 'IL',
    name: 'Israel',
    nameHe: 'ישראל',
    flag: '🇮🇱',
    regions: [
      {
        name: 'Central',
        nameHe: 'מרכז',
        cities: [
          { name: 'Bnei Brak', nameHe: 'בני ברק' },
          { name: 'Tel Aviv', nameHe: 'תל אביב-יפו' },
          { name: 'Ramat Gan', nameHe: 'רמת גן' },
          { name: 'Petah Tikva', nameHe: 'פתח תקווה' },
          { name: 'Elad', nameHe: 'אלעד' },
          { name: "Modi'in Illit", nameHe: 'מודיעין עילית' },
          { name: 'Holon', nameHe: 'חולון' },
          { name: 'Bat Yam', nameHe: 'בת ים' },
          { name: 'Rishon LeZion', nameHe: 'ראשון לציון' },
          { name: 'Rehovot', nameHe: 'רחובות' },
          { name: 'Lod', nameHe: 'לוד' },
          { name: 'Ramla', nameHe: 'רמלה' },
          { name: 'Netanya', nameHe: 'נתניה' },
          { name: 'Herzliya', nameHe: 'הרצליה' },
          { name: "Ra'anana", nameHe: 'רעננה' },
          { name: 'Kfar Saba', nameHe: 'כפר סבא' },
          { name: 'Givat Shmuel', nameHe: 'גבעת שמואל' },
          { name: 'Ganei Tikva', nameHe: 'גני תקווה' },
          { name: 'Givatayim', nameHe: 'גבעתיים' },
          { name: 'Hod HaSharon', nameHe: 'הוד השרון' },
          { name: 'Rosh HaAyin', nameHe: 'ראש העין' },
          { name: 'Or Yehuda', nameHe: 'אור יהודה' },
        ],
      },
      {
        name: 'Jerusalem Area',
        nameHe: 'ירושלים והסביבה',
        cities: [
          { name: 'Jerusalem', nameHe: 'ירושלים' },
          { name: 'Beit Shemesh', nameHe: 'בית שמש' },
          { name: 'Beitar Illit', nameHe: 'ביתר עילית' },
          { name: 'Givat Zeev', nameHe: 'גבעת זאב' },
          { name: "Ma'ale Adumim", nameHe: 'מעלה אדומים' },
        ],
      },
      {
        name: 'South',
        nameHe: 'דרום',
        cities: [
          { name: 'Ashdod', nameHe: 'אשדוד' },
          { name: 'Ashkelon', nameHe: 'אשקלון' },
          { name: 'Beer Sheva', nameHe: 'באר שבע' },
          { name: 'Kiryat Gat', nameHe: 'קרית גת' },
          { name: 'Kiryat Malakhi', nameHe: 'קרית מלאכי' },
          { name: 'Ofakim', nameHe: 'אופקים' },
          { name: 'Sderot', nameHe: 'שדרות' },
          { name: 'Eilat', nameHe: 'אילת' },
          { name: 'Dimona', nameHe: 'דימונה' },
        ],
      },
      {
        name: 'North',
        nameHe: 'צפון',
        cities: [
          { name: 'Haifa', nameHe: 'חיפה' },
          { name: 'Safed', nameHe: 'צפת' },
          { name: 'Tiberias', nameHe: 'טבריה' },
          { name: 'Nazareth Illit', nameHe: 'נצרת עילית' },
          { name: 'Kiryat Shmona', nameHe: 'קרית שמונה' },
          { name: 'Afula', nameHe: 'עפולה' },
          { name: 'Hadera', nameHe: 'חדרה' },
          { name: 'Akko', nameHe: 'עכו' },
          { name: 'Zichron Yaakov', nameHe: 'זכרון יעקב' },
          { name: 'Kiryat Ata', nameHe: 'קרית אתא' },
          { name: 'Kiryat Bialik', nameHe: 'קרית ביאליק' },
          { name: 'Kiryat Motzkin', nameHe: 'קרית מוצקין' },
          { name: 'Kiryat Yam', nameHe: 'קרית ים' },
        ],
      },
      {
        name: 'Sharon',
        nameHe: 'שרון',
        cities: [
          { name: 'Ramat HaSharon', nameHe: 'רמת השרון' },
          { name: 'Kadima-Zoran', nameHe: 'קדימה-צורן' },
          { name: 'Beer Yaakov', nameHe: 'באר יעקב' },
          { name: 'Gedera', nameHe: 'גדרה' },
          { name: 'Yavne', nameHe: 'יבנה' },
          { name: 'Beit Shean', nameHe: 'בית שאן' },
          { name: 'Kiryat Ono', nameHe: 'קרית אונו' },
          { name: 'Or Akiva', nameHe: 'אור עקיבא' },
        ],
      },
    ],
  },
  {
    code: 'US',
    name: 'United States',
    nameHe: 'ארצות הברית',
    flag: '🇺🇸',
    regions: [
      {
        name: 'New York',
        nameHe: 'ניו יורק',
        cities: [
          { name: 'Williamsburg', nameHe: 'וויליאמסבורג' },
          { name: 'Boro Park', nameHe: 'בורו פארק' },
          { name: 'Crown Heights', nameHe: 'קראון הייטס' },
          { name: 'Flatbush', nameHe: 'פלטבוש' },
          { name: 'Monsey', nameHe: 'מונסי' },
          { name: 'Kiryas Joel', nameHe: 'קרית יואל' },
          { name: 'Far Rockaway', nameHe: 'פאר רוקאוויי' },
          { name: 'Kew Gardens Hills', nameHe: 'קיו גארדנס הילס' },
        ],
      },
      {
        name: 'New Jersey',
        nameHe: 'ניו ג\'רזי',
        cities: [
          { name: 'Lakewood', nameHe: 'לייקווד' },
          { name: 'Passaic', nameHe: 'פסייאק' },
          { name: 'Teaneck', nameHe: 'טינק' },
        ],
      },
      {
        name: 'Florida',
        nameHe: 'פלורידה',
        cities: [
          { name: 'Miami Beach', nameHe: 'מיאמי ביץ\'' },
          { name: 'Bal Harbour', nameHe: 'בל הארבור' },
        ],
      },
      {
        name: 'California',
        nameHe: 'קליפורניה',
        cities: [
          { name: 'Los Angeles', nameHe: 'לוס אנג\'לס' },
        ],
      },
    ],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    nameHe: 'בריטניה',
    flag: '🇬🇧',
    regions: [
      {
        name: 'London',
        nameHe: 'לונדון',
        cities: [
          { name: 'Stamford Hill', nameHe: 'סטמפורד היל' },
          { name: 'Golders Green', nameHe: 'גולדרס גרין' },
          { name: 'Hendon', nameHe: 'הנדון' },
          { name: 'Edgware', nameHe: 'אדג\'וור' },
        ],
      },
      {
        name: 'North England',
        nameHe: 'צפון אנגליה',
        cities: [
          { name: 'Manchester', nameHe: 'מנצ\'סטר' },
          { name: 'Gateshead', nameHe: 'גייטסהד' },
        ],
      },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    nameHe: 'קנדה',
    flag: '🇨🇦',
    regions: [
      {
        name: 'Quebec',
        nameHe: 'קוויבק',
        cities: [
          { name: 'Montreal - Outremont', nameHe: 'מונטריאול - אוטרמונט' },
          { name: 'Montreal - Tosh', nameHe: 'מונטריאול - טאש' },
          { name: 'Montreal - Côte-Saint-Luc', nameHe: 'מונטריאול - קוט סן לוק' },
        ],
      },
      {
        name: 'Ontario',
        nameHe: 'אונטריו',
        cities: [
          { name: 'Toronto', nameHe: 'טורונטו' },
        ],
      },
    ],
  },
  {
    code: 'FR',
    name: 'France',
    nameHe: 'צרפת',
    flag: '🇫🇷',
    regions: [
      {
        name: 'Paris Area',
        nameHe: 'אזור פריז',
        cities: [
          { name: 'Sarcelles', nameHe: 'סרסל' },
          { name: 'Paris 19th Arr.', nameHe: 'פריז - רובע 19' },
          { name: 'Le Raincy', nameHe: 'לה רנסי' },
        ],
      },
      {
        name: 'South',
        nameHe: 'דרום',
        cities: [
          { name: 'Marseille', nameHe: 'מרסיי' },
        ],
      },
      {
        name: 'East',
        nameHe: 'מזרח',
        cities: [
          { name: 'Strasbourg', nameHe: 'שטרסבורג' },
        ],
      },
    ],
  },
  {
    code: 'BE',
    name: 'Belgium',
    nameHe: 'בלגיה',
    flag: '🇧🇪',
    regions: [
      {
        name: 'Flanders',
        nameHe: 'פלנדריה',
        cities: [
          { name: 'Antwerp', nameHe: 'אנטוורפן' },
        ],
      },
    ],
  },
  {
    code: 'AR',
    name: 'Argentina',
    nameHe: 'ארגנטינה',
    flag: '🇦🇷',
    regions: [
      {
        name: 'Buenos Aires',
        nameHe: 'בואנוס איירס',
        cities: [
          { name: 'Once', nameHe: 'אונסה' },
          { name: 'Flores', nameHe: 'פלורס' },
        ],
      },
    ],
  },
]

// Helper: Get all cities for a given country
export function getCitiesForCountry(countryCode: string, locale: string = 'he'): string[] {
  const country = LOCATIONS.find(c => c.code === countryCode)
  if (!country) return []
  
  const cities: string[] = []
  for (const region of country.regions) {
    for (const city of region.cities) {
      cities.push(locale === 'he' ? city.nameHe : city.name)
    }
  }
  return cities.sort()
}

// Helper: Get country name by locale
export function getCountryName(countryCode: string, locale: string = 'he'): string {
  const country = LOCATIONS.find(c => c.code === countryCode)
  if (!country) return countryCode
  return locale === 'he' ? country.nameHe : country.name
}

// Helper: Get city display name by locale
export function getCityDisplayName(cityName: string, countryCode: string, locale: string = 'he'): string {
  const country = LOCATIONS.find(c => c.code === countryCode)
  if (!country) return cityName
  
  for (const region of country.regions) {
    for (const city of region.cities) {
      if (city.name === cityName || city.nameHe === cityName) {
        return locale === 'he' ? city.nameHe : city.name
      }
    }
  }
  return cityName
}

// Helper: Get all countries for selection
export function getCountryOptions(locale: string = 'he') {
  return LOCATIONS.map(c => ({
    code: c.code,
    name: locale === 'he' ? c.nameHe : c.name,
    flag: c.flag,
  }))
}
