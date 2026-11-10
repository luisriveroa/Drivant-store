// ============================================================
// Brand profiles: the color of each product cover and a short
// Spanish description shown on every product of the brand.
// ============================================================

export interface BrandProfile {
  /** Main brand color, used to tint the product cover. */
  color: string;
  about: string;
}

export const BRAND_PROFILES: Record<string, BrandProfile> = {
  // Streaming y música
  netflix: { color: '#E50914', about: 'Netflix es el servicio de streaming con series, películas y documentales, incluidas sus producciones originales.' },
  spotify: { color: '#1DB954', about: 'Spotify Premium te da música y podcasts sin anuncios, descargas para escuchar sin conexión y saltos ilimitados.' },
  youtube: { color: '#FF0000', about: 'YouTube Premium quita los anuncios de YouTube, permite reproducir en segundo plano y descargar videos, e incluye YouTube Music.' },
  crunchyroll: { color: '#F47521', about: 'Crunchyroll es la plataforma de anime con estrenos poco después de Japón, sin anuncios en sus planes Premium.' },
  'apple-music': { color: '#FA243C', about: 'Apple Music ofrece más de 100 millones de canciones sin anuncios, con audio espacial y letras en tiempo real.' },
  'apple-tv': { color: '#1D1D1F', about: 'Apple TV+ es el servicio de streaming de Apple con series y películas originales.' },
  'prime-video': { color: '#00A8E1', about: 'Prime Video es el servicio de streaming de Amazon con series, películas y producciones originales.' },
  amazon: { color: '#FF9900', about: 'Amazon Prime incluye Prime Video y beneficios de envío y compras en Amazon, según el país.' },
  zee5: { color: '#8230C6', about: 'ZEE5 es una plataforma de streaming de India con series, películas y contenido en varios idiomas.' },
  sonyliv: { color: '#1F2A5A', about: 'SonyLIV es una plataforma de streaming de India con series, películas y deportes en vivo.' },

  // Inteligencia artificial
  openai: { color: '#10A37F', about: 'ChatGPT es el asistente de inteligencia artificial de OpenAI para escribir, programar, analizar archivos y crear imágenes.' },
  copilot: { color: '#0078D4', about: 'Microsoft Copilot es el asistente de inteligencia artificial de Microsoft, integrado en Word, Excel y otras apps de Microsoft 365.' },
  gemini: { color: '#4285F4', about: 'Gemini es el asistente de inteligencia artificial de Google, integrado en Gmail, Docs y las demás apps de Google.' },
  google: { color: '#4285F4', about: 'Los planes Google AI incluyen el acceso avanzado a Gemini y almacenamiento en Google One, según el plan.' },
  grok: { color: '#111111', about: 'Grok es el asistente de inteligencia artificial de xAI, disponible en la web, en apps y en X.' },
  perplexity: { color: '#20808D', about: 'Perplexity es un buscador con inteligencia artificial que responde con fuentes citadas.' },
  kimi: { color: '#1C1C1E', about: 'Kimi es el asistente de inteligencia artificial de Moonshot AI, conocido por leer documentos largos.' },
  cursor: { color: '#111111', about: 'Cursor es un editor de código con inteligencia artificial que escribe, explica y corrige código contigo.' },
  elevenlabs: { color: '#111111', about: 'ElevenLabs genera voces realistas con inteligencia artificial, con clonación de voz y doblaje a varios idiomas.' },
  higgsfield: { color: '#1C1C1E', about: 'Higgsfield crea videos e imágenes con inteligencia artificial, con efectos de cámara cinematográficos.' },
  kling: { color: '#0A0A0A', about: 'Kling AI genera videos a partir de texto o imágenes con inteligencia artificial.' },
  leonardo: { color: '#6E3AFF', about: 'Leonardo AI genera imágenes y videos con inteligencia artificial, con varios modelos a elegir.' },
  manus: { color: '#1C1C1E', about: 'Manus es un agente de inteligencia artificial que realiza tareas completas por ti, como investigar o crear documentos.' },
  runway: { color: '#111111', about: 'Runway es una herramienta de inteligencia artificial para generar y editar video.' },
  wispr: { color: '#1C1C1E', about: 'Wispr Flow convierte tu voz en texto en cualquier app, en más de 100 idiomas.' },
  muse: { color: '#6B4EFF', about: 'Muse AI crea imágenes, videos y textos con inteligencia artificial usando tokens.' },
  suno: { color: '#111111', about: 'Suno crea canciones completas con voz e instrumentos a partir de una descripción.' },
  genspark: { color: '#111111', about: 'Genspark es un agente de inteligencia artificial que investiga y crea documentos, presentaciones e imágenes.' },
  meshy: { color: '#2E7D32', about: 'Meshy genera modelos 3D a partir de texto o imágenes con inteligencia artificial.' },
  dreamina: { color: '#1C1C1E', about: 'Dreamina, de CapCut, genera imágenes y videos con inteligencia artificial.' },
  pollo: { color: '#FF7A00', about: 'Pollo AI genera videos con varios modelos de inteligencia artificial en una sola plataforma.' },
  pippit: { color: '#111111', about: 'Pippit, de CapCut, crea videos y contenido de marketing con inteligencia artificial.' },
  pixverse: { color: '#7C3AED', about: 'PixVerse genera videos a partir de texto o imágenes con inteligencia artificial.' },
  pangram: { color: '#111111', about: 'Pangram detecta si un texto fue escrito con inteligencia artificial.' },
  chatprd: { color: '#111111', about: 'ChatPRD ayuda a escribir documentos de producto con inteligencia artificial.' },
  gamma: { color: '#7B3FE4', about: 'Gamma crea presentaciones, documentos y sitios web con inteligencia artificial.' },
  granola: { color: '#2E5E3E', about: 'Granola toma notas de tus reuniones con inteligencia artificial.' },
  fin: { color: '#1F8DED', about: 'Fin es el agente de atención al cliente con inteligencia artificial de Intercom.' },
  intercom: { color: '#1F8DED', about: 'Intercom es una plataforma de atención al cliente con chat, correo y el agente de inteligencia artificial Fin.' },

  // Diseño y video
  canva: { color: '#00C4CC', about: 'Canva es una herramienta de diseño para crear publicaciones, presentaciones y videos con plantillas.' },
  figma: { color: '#A259FF', about: 'Figma es la herramienta de diseño de interfaces y prototipos en la que se trabaja en equipo en tiempo real.' },
  adobe: { color: '#FA0F00', about: 'Adobe ofrece herramientas creativas como Express y Creative Cloud para diseño, foto y video.' },
  capcut: { color: '#111111', about: 'CapCut es un editor de video para celular y computadora, con efectos, plantillas y herramientas de inteligencia artificial.' },
  autodesk: { color: '#111111', about: 'Autodesk ofrece software profesional de diseño e ingeniería como AutoCAD, Revit, Maya y 3ds Max.' },
  framer: { color: '#0055FF', about: 'Framer permite diseñar y publicar sitios web sin programar.' },
  descript: { color: '#1C1C1E', about: 'Descript edita audio y video editando el texto de su transcripción.' },
  supercut: { color: '#FF3B5C', about: 'Supercut graba y comparte videos de tu pantalla con tu equipo.' },
  photoroom: { color: '#6C3CF3', about: 'Photoroom edita fotos de productos con inteligencia artificial, por ejemplo para quitar el fondo.' },
  wink: { color: '#111111', about: 'Wink es una app de edición de video y retoque con inteligencia artificial.' },
  mobbin: { color: '#111111', about: 'Mobbin es una biblioteca de capturas de apps reales para inspirar el diseño de interfaces.' },
  'magic-patterns': { color: '#6D28D9', about: 'Magic Patterns crea prototipos de interfaces con inteligencia artificial.' },
  meitu: { color: '#FF2D55', about: 'Meitu ofrece apps de retoque de fotos y video como Meitu, BeautyCam y Xingtu.' },
  alightmotion: { color: '#111111', about: 'Alight Motion es una app de animación y edición de video para celular.' },
  coreldraw: { color: '#2A9D3E', about: 'CorelDRAW es un programa profesional de diseño gráfico e ilustración vectorial.' },

  // Oficina y productividad
  outlook: { color: '#0078D4', about: 'Correo de Microsoft Outlook o Hotmail.' },
  office: { color: '#D83B01', about: 'Microsoft 365 incluye Word, Excel, PowerPoint y otras apps de Office, con almacenamiento en OneDrive según el plan.' },
  windows: { color: '#0078D4', about: 'Licencia para activar Windows en tu computadora.' },
  notion: { color: '#111111', about: 'Notion reúne notas, documentos, tareas y bases de datos en un solo lugar.' },
  airtable: { color: '#18BFFF', about: 'Airtable organiza datos como una hoja de cálculo con funciones de base de datos y automatizaciones.' },
  zoom: { color: '#0B5CFF', about: 'Zoom es la plataforma de videollamadas y reuniones en línea.' },
  grammarly: { color: '#15C39A', about: 'Grammarly corrige y mejora tu escritura en inglés, con sugerencias de estilo y tono.' },
  ilovepdf: { color: '#E5322D', about: 'iLovePDF une, divide, comprime, convierte y firma archivos PDF.' },
  miro: { color: '#FFD02F', about: 'Miro es una pizarra en línea para colaborar en ideas, diagramas y planificación.' },
  readwise: { color: '#111111', about: 'Readwise guarda y repasa lo que subrayas en libros y artículos.' },
  jam: { color: '#EA4C89', about: 'Jam permite reportar errores de sitios web con capturas y datos técnicos en un clic.' },
  brainfm: { color: '#3B3BB3', about: 'Brain.fm ofrece música diseñada para ayudarte a concentrarte, relajarte o dormir.' },
  headspace: { color: '#FF7E1D', about: 'Headspace es una app de meditación, sueño y bienestar.' },
  linkedin: { color: '#0A66C2', about: 'LinkedIn Premium da más visibilidad en la red profesional, mensajes InMail y cursos de LinkedIn Learning, según el plan.' },

  // Educación
  coursera: { color: '#0056D2', about: 'Coursera ofrece cursos y certificados de universidades y empresas.' },
  udemy: { color: '#A435F0', about: 'Udemy es una plataforma de cursos en línea sobre miles de temas.' },
  edx: { color: '#02262B', about: 'edX ofrece cursos de universidades como Harvard y MIT.' },
  duolingo: { color: '#58CC02', about: 'Duolingo es una app para aprender idiomas. Super quita los anuncios y da vidas ilimitadas.' },
  quizlet: { color: '#4255FF', about: 'Quizlet ayuda a estudiar con tarjetas, pruebas y juegos.' },
  scribd: { color: '#1E7B85', about: 'Scribd da acceso a libros, audiolibros y documentos.' },
  kahoot: { color: '#46178F', about: 'Kahoot! crea cuestionarios y juegos interactivos para clases y reuniones.' },
  skillshare: { color: '#00FF84', about: 'Skillshare ofrece clases en video sobre diseño, ilustración, fotografía y más.' },
  memrise: { color: '#2B3648', about: 'Memrise es una app para aprender idiomas con videos de hablantes nativos.' },
  wordwall: { color: '#E2442F', about: 'Wordwall crea actividades interactivas y juegos para clases.' },

  // Desarrollo
  replit: { color: '#F26207', about: 'Replit permite programar y publicar apps desde el navegador, con un agente de inteligencia artificial.' },
  lovable: { color: '#FF4D8D', about: 'Lovable crea apps y sitios web a partir de una descripción, con inteligencia artificial.' },
  bolt: { color: '#111111', about: 'Bolt crea apps web a partir de una descripción, con inteligencia artificial.' },
  railway: { color: '#111111', about: 'Railway aloja y despliega apps y bases de datos en la nube.' },
  n8n: { color: '#EA4B71', about: 'n8n automatiza flujos de trabajo conectando apps y servicios.' },
  jetbrains: { color: '#111111', about: 'JetBrains ofrece entornos de programación como IntelliJ IDEA, PyCharm y WebStorm.' },
  warp: { color: '#01A4FF', about: 'Warp es una terminal moderna con inteligencia artificial.' },
  resend: { color: '#111111', about: 'Resend es un servicio para enviar correos desde tus apps.' },
  posthog: { color: '#F54E00', about: 'PostHog mide cómo se usa tu producto, con analítica, grabaciones de sesiones y experimentos.' },
  customerio: { color: '#7131FF', about: 'Customer.io envía mensajes automáticos por correo, SMS y notificaciones a tus clientes.' },
  arize: { color: '#5F3DC4', about: 'Arize monitorea y evalúa modelos de inteligencia artificial.' },
  linear: { color: '#5E6AD2', about: 'Linear organiza tareas y proyectos de equipos de software.' },
  factory: { color: '#111111', about: 'Factory ofrece agentes de inteligencia artificial para programar.' },

  // VPN y seguridad
  nordvpn: { color: '#4687FF', about: 'NordVPN protege tu conexión y te deja navegar desde servidores en más de 100 países.' },
  surfshark: { color: '#1EBFBF', about: 'Surfshark es una VPN para dispositivos ilimitados.' },
  proton: { color: '#6D4AFF', about: 'Proton ofrece VPN, correo y almacenamiento cifrados.' },
  hma: { color: '#FFC107', about: 'HMA es una VPN con servidores en más de 190 países.' },
  expressvpn: { color: '#DA3940', about: 'ExpressVPN es una VPN rápida con servidores en más de 100 países.' },
  adguard: { color: '#68BC71', about: 'AdGuard VPN protege tu conexión y bloquea rastreadores.' },
  ipvanish: { color: '#70BB44', about: 'IPVanish es una VPN para dispositivos ilimitados.' },
  norton: { color: '#FFC300', about: 'Norton ofrece antivirus y VPN para proteger tus dispositivos.' },
  purevpn: { color: '#8C3CFF', about: 'PureVPN es una VPN con servidores en más de 70 países.' },
  kaspersky: { color: '#006D5C', about: 'Kaspersky ofrece antivirus y protección para tus dispositivos.' },
  proxy: { color: '#334155', about: 'Proxies para conectarte a internet desde otras direcciones IP.' },

  // Redes sociales y otros
  snapchat: { color: '#FFFC00', about: 'Snapchat+ da funciones exclusivas en Snapchat, como íconos personalizados y ver quién vuelve a ver tus historias.' },
  telegram: { color: '#229ED9', about: 'Telegram Premium duplica los límites de Telegram y suma funciones como transcripción de audios y descargas más rápidas.' },
  pornhub: { color: '#111111', about: 'Suscripción Premium para mayores de 18 años, sin anuncios.' },
};

export const DEFAULT_BRAND_COLOR = '#65A30D';
