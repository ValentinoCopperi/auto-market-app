const filtros = ['modelo','tipo_modelo','moneda','q','page','pageSize','marca', 'categoria', 'ciudad', 'anio', 'precio_min', 'precio_max','color','tipo_transmision','tipo_combustible','kilometraje'];


const CATEOGORIAS = ["Automovil", "Camioneta", "Motocicleta", "Comercial"]

const COLORES = [
  "Rojo",
  "Azul",
  "Verde",
  "Negro",
  "Blanco",
  "Gris",
  "Naranja",
  "Amarillo",
  "Morado",
  "Rosa",
  "Cafe",
  "Dorado",
  "Plateado",
  "Otro",
]

const TRANSMISION = ["Manual", "Automático"]

const COMBUSTIBLE = [
  "Nafta",
  "Diesel",
  "Híbrido",
  "Eléctrico",
  "Diésel",
  "Gas",
  "Otro"
]

const TIPO_MONEDA = ["USD", "ARG"]

const MARCAS = [
  "Audi",
  "BMW",
  "Chevrolet",
  "Citroen",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Jeep",
  "Kia",
  "Lexus",
  "Mazda",
  "Mercedes-Benz",
  "Nissan",
  "Peugeot",
  "Renault",
  "Subaru",
  "Toyota",
  "Volkswagen",
  "Volvo"
]

export const MODELOS_POR_MARCA: Record<string, string[]> = {
  audi: ["A3", "A4", "Q3", "Q5", "Q7"],
  bmw: ["Serie 1", "Serie 3", "X1", "X3", "X5"],
  chevrolet: ["Cruze", "Onix", "Tracker", "S10", "Spin"],
  citroen: ["C3", "C4 Cactus", "Berlingo", "Jumpy", "C-Elysée"],
  fiat: ["Cronos", "Argo", "Toro", "Strada", "Mobi", "Fiorino"],
  ford: ["Focus", "Ka", "EcoSport", "Ranger", "Fiesta"],
  honda: ["Civic", "City", "Fit", "HR-V", "CR-V"],
  hyundai: ["i10", "i20", "Creta", "Tucson", "Santa Fe"],
  jeep: ["Renegade", "Compass", "Grand Cherokee", "Wrangler"],
  kia: ["Rio", "Cerato", "Seltos", "Sportage", "Sorento"],
  lexus: ["UX", "NX", "RX", "IS"],
  mazda: ["Mazda 3", "Mazda 6", "CX-3", "CX-5", "CX-30"],
  "mercedes-benz": ["Clase A", "Clase C", "GLA", "GLC", "Sprinter"],
  nissan: ["Versa", "Sentra", "Kicks", "Frontier", "March"],
  peugeot: ["208", "2008", "3008", "Partner", "408"],
  renault: ["Sandero", "Logan", "Kangoo", "Stepway", "Duster", "Oroch"],
  subaru: ["Forester", "XV", "Outback", "Impreza"],
  toyota: ["Corolla", "Hilux", "Etios", "Yaris", "SW4"],
  volkswagen: ["Gol", "Voyage", "Amarok", "T-Cross", "Polo", "Virtus"],
  volvo: ["XC40", "XC60", "XC90", "S60", "V60"]
};


export const TIPOS_POR_MODELO: Record<string, string[]> = {
  // Toyota
  corolla: ["Sedan", "Hybrid"],
  hilux: ["Cabina Simple", "Cabina Doble", "4x4"],
  etios: ["Sedan", "Hatchback"],
  yaris: ["Sedan", "Hatchback"],
  sw4: ["SUV", "4x4"],

  // Volkswagen
  gol: ["Trend", "Power", "Sedan"],
  voyage: ["Sedan"],
  amarok: ["Cabina Doble", "Cabina Simple", "4x4"],
  "t-cross": ["Comfortline", "Highline", "Trendline"],
  polo: ["Trendline", "Highline", "GTI"],
  virtus: ["Sedan", "Comfortline", "Highline"],

  // Fiat
  cronos: ["Drive", "Precision", "Sedan"],
  argo: ["Drive", "Trekking", "Hatchback"],
  toro: ["Freedom", "Volcano", "4x4"],
  strada: ["Working", "Volcano", "Cabina Plus"],
  mobi: ["Easy", "Like"],
  fiorino: ["Cargo"],

  // Peugeot
  "208": ["Like", "Active", "GT"],
  "2008": ["Allure", "GT"],
  "3008": ["Allure", "GT Line", "Hybrid4"],
  partner: ["Furgón", "Patagónica"],
  "408": ["Allure", "Feline", "Sedan"],

  // Renault
  sandero: ["Life", "Zen", "Stepway"],
  logan: ["Sedan", "Zen", "Intens"],
  kangoo: ["Furgón", "Pasajeros", "Express"],
  stepway: ["Zen", "Intens", "Outsider"],
  duster: ["SUV", "Zen", "Intens"],
  oroch: ["Zen", "Outsider", "4x4"],

  // Chevrolet
  cruze: ["LT", "LTZ", "Premier"],
  onix: ["Joy", "LT", "Plus"],
  tracker: ["LT", "Premier"],
  s10: ["Cabina Doble", "High Country", "4x4"],
  spin: ["Activ", "Premier"],

  // Ford
  focus: ["Sedan", "Hatchback", "Titanium"],
  ka: ["Sedan", "Hatchback", "Freestyle"],
  ecosport: ["Trend", "Titanium", "Storm"],
  ranger: ["Cabina Simple", "Cabina Doble", "XLT", "Limited"],
  fiesta: ["Sedan", "Hatchback", "Titanium"],

  // Nissan
  versa: ["Sense", "Advance"],
  sentra: ["Advance", "Exclusive"],
  kicks: ["Advance", "Exclusive", "SUV"],
  frontier: ["S", "X-Gear", "LE"],
  march: ["Active", "Sense"],

  // Honda
  civic: ["Sedan", "EX", "Touring"],
  city: ["Sedan", "EXL"],
  fit: ["EX", "EXL"],
  "hr-v": ["EX", "Touring"],
  "cr-v": ["EX", "Touring"],

  // Jeep
  renegade: ["Sport", "Longitude", "Trailhawk"],
  compass: ["Sport", "Longitude", "Limited"],
  "grand cherokee": ["Limited", "Overland", "SRT"],
  wrangler: ["Sport", "Rubicon", "Unlimited"],

  // Hyundai
  creta: ["GLS", "Limited", "SUV"],
  tucson: ["GLS", "Limited", "Hybrid"],
  "santa fe": ["GLS", "SUV"],
  i10: ["Hatchback"],
  i20: ["Hatchback", "Active"],

  // Kia
  rio: ["EX", "SX"],
  cerato: ["EX", "SX", "Sedan"],
  seltos: ["SUV", "EX", "GT Line"],
  sportage: ["LX", "EX", "GT Line"],
  sorento: ["EX", "SX", "SUV"],

  // Citroën
  c3: ["Live", "Feel", "Shine"],
  "c4 cactus": ["Live", "Feel", "Shine"],
  berlingo: ["Furgón", "Multispace"],
  jumpy: ["Furgón", "Combi"],
  "c-elysée": ["Sedan"],

  // Mercedes-Benz
  "clase a": ["Hatchback", "Sedan"],
  "clase c": ["Sedan", "AMG Line"],
  gla: ["SUV", "GLA 200"],
  glc: ["SUV", "Coupé"],
  sprinter: ["Furgón", "Chasis", "Pasajeros"],

  // BMW
  "serie 1": ["Hatchback", "120i", "M135i"],
  "serie 3": ["Sedan", "320i", "330i"],
  x1: ["sDrive18i", "xDrive20i"],
  x3: ["xDrive20i", "xDrive30e"],
  x5: ["xDrive45e", "M Sport"],

  // Audi
  a3: ["Sedan", "Sportback"],
  a4: ["Sedan", "S Line"],
  q3: ["SUV", "Sportback"],
  q5: ["SUV", "Sportback"],
  q7: ["SUV", "7 Asientos"],

  // Mazda
  "mazda 3": ["Sedan", "Hatchback"],
  "mazda 6": ["Sedan"],
  "cx-3": ["SUV", "Touring"],
  "cx-5": ["SUV", "Signature"],
  "cx-30": ["SUV", "Premium"],

  // Lexus
  ux: ["UX 200", "UX 250h"],
  nx: ["NX 250", "NX 350h"],
  rx: ["RX 350", "RX 500h"],
  is: ["IS 300", "IS 350 F Sport"],

  // Subaru
  forester: ["XS", "Sport", "Limited"],
  xv: ["SUV", "2.0i", "Premium"],
  outback: ["2.5i", "Limited"],
  impreza: ["Sedan", "Hatchback"],

  // Volvo
  xc40: ["Momentum", "Inscription"],
  xc60: ["Momentum", "R-Design", "Hybrid"],
  xc90: ["Inscription", "Recharge"],
  s60: ["Sedan", "R-Design"],
  v60: ["Station Wagon", "Cross Country"]
};


const CIUDADES = [
  "Buenos Aires",
  "Córdoba",
  "Rosario",
  "Mendoza",
  "San Miguel de Tucumán",
  "La Plata",
  "Mar del Plata",
  "Salta",
  "Santa Fe",
  "San Juan",
  "Resistencia",
  "Neuquén",
  "San Salvador de Jujuy",
  "Bahía Blanca",
  "Posadas",
  "Santiago del Estero",
  "Paraná",
  "Formosa",
  "San Luis",
  "La Rioja",
  "Comodoro Rivadavia",
  "Río Cuarto",
  "San Rafael",
  "Tandil",
  "Viedma",
  "Bariloche",
  "Trelew",
  "Puerto Madryn",
  "Ushuaia",
  "Río Gallegos",
  "Catamarca",
  "Concordia",
  "Junín",
  "Olavarría",
  "Villa María",
  "Pergamino",
  "Rafaela",
  "Chivilcoy",
  "Mercedes",
  "Zárate",
  "Otro"
];

export { CIUDADES, filtros, CATEOGORIAS, COLORES, TRANSMISION, COMBUSTIBLE, TIPO_MONEDA, MARCAS };