// ============================================================
// Spanish product details, written from each supplier's description.
// A product without an entry shows only what its name states, and the
// conditions get confirmed by chat: see src/lib/product-info.ts
// ============================================================

export interface ProductDetail {
  /** Replaces the name built automatically from the supplier's name. */
  name?: string;
  summary?: string;
  includes?: string[];
  steps?: string[];
  notes?: string[];
  duration?: string;
  warranty?: string;
  delivery?: string;
}

const COUPON = 'Cupón';
const LINK = 'Enlace de activación';
const READY = 'Cuenta lista para usar';
const ON_MAIL = 'Se activa en tu correo';
const ON_ACCOUNT = 'Se activa en tu cuenta';
const KEY = 'Clave de activación';

const NO_WARRANTY_AFTER = 'Sin garantía después de activar';
const UNTIL_ACTIVATION = 'Solo hasta activar';
const REDEEM_7_DAYS = 'Debes canjear el cupón dentro de los 7 días posteriores a la compra, o puede vencer.';

const CRUNCHYROLL_BENEFITS = ['Sin anuncios', 'Descargas sin conexión', 'Estrenos poco después de Japón', 'Hasta 4 dispositivos (función del plan)'];
const YOUTUBE_BENEFITS = ['Videos sin anuncios', 'Reproducción en segundo plano y con la pantalla bloqueada', 'Descargas sin conexión', 'YouTube Music Premium'];
const GRAMMARLY_BENEFITS = ['Reescribe oraciones con un clic', 'Ajuste de estilo y tono', 'Sugerencias personalizadas ilimitadas', 'Detección de plagio y de contenido generado con IA', '2.000 indicaciones de IA'];
const GRAMMARLY_NOTES = ['No agregues ni cambies nada en la cuenta: se pierde la garantía.', 'Envíanos un correo sin cuenta en Grammarly para gestionar la activación.'];
const SPOTIFY_NOTES = ['No cambies el país, la región ni los datos de facturación.', 'Envíanos un correo que no tenga cuenta en Spotify: creamos la cuenta con él.'];
const REPLIT_STEPS = ['Crea tu cuenta en Replit.', 'Mejora tu cuenta desde el inicio guiado o con el botón “Upgrade to Replit Core”.', 'Elige el plan Replit Core con pago anual.', 'En la página de pago, haz clic en “Add promotion code” e ingresa tu cupón.'];
const LINKEDIN_REGION = 'En algunas cuentas puede aparecer un error de región. En ese caso no hay reemplazo.';

const VIBI: ProductDetail = {
  summary: 'Créditos de voz con IA que se usan en vibi.pro, una herramienta asociada a ElevenLabs y MiniMax. No es una cuenta directa de ElevenLabs.',
  includes: ['Modelos oficiales de ElevenLabs y MiniMax', 'Más de 10.000 voces en varios idiomas', 'Los créditos no vencen a fin de mes'],
  notes: ['Cada código se usa una sola vez.', 'Revisa que hayas iniciado sesión en la cuenta correcta antes de ingresarlo.', 'Una vez activado no se reembolsa ni se transfiere a otra cuenta.'],
  duration: 'Los créditos no vencen',
  warranty: 'Soporte si el código no activa, si los créditos son incorrectos o si falla el sistema',
  delivery: 'Código de activación',
};

const SNAPCHAT: ProductDetail = {
  summary: 'Suscripción Snapchat+ mediante una tarjeta de servicio exclusiva.',
  notes: ['Solo para usuarios de iPhone.'],
};

export const PRODUCT_DETAILS: Record<string, ProductDetail> = {
  // ---------- TOD Gifts ----------
  'tod--sup_bat_49': {
    summary: 'Plan Zoom Pro por 12 meses para reuniones de hasta 100 participantes.',
    notes: ['No cambies la contraseña durante la activación, para que se pueda revisar la cuenta si hay un problema. Si la cambias, avísanos.', 'Si te pide verificación en dos pasos (2FA), elige “Skip” y continúa.', 'Algunas cuentas se entregan con acceso completo al correo.'],
    duration: '12 meses',
  },
  'tod--sup_bat_80': {
    summary: 'Cupón oficial de Higgsfield Pro para usar en tu propia cuenta, con 600 créditos al mes.',
    steps: ['Regístrate en Higgsfield desde una computadora y completa el inicio.', 'Ve a Gestionar cuenta → Código promocional, ingresa el cupón y canjéalo.', 'Finaliza el pedido con tu medio de pago.'],
    notes: ['Necesitas una tarjeta bancaria propia para activar.', REDEEM_7_DAYS],
    duration: '12 meses',
    warranty: NO_WARRANTY_AFTER,
    delivery: COUPON,
  },
  'tod--nord_vpn_3m': {
    summary: 'NordVPN plan Básico para 10 dispositivos, activado con un enlace.',
    includes: ['Funciona en PC, celular y navegador'],
    notes: ['Usa una cuenta nueva y una IP nueva para activar cada enlace.', 'No necesitas medio de pago.'],
    warranty: UNTIL_ACTIVATION,
    delivery: LINK,
  },
  'tod--sup_insight_65': { summary: 'Cupón de Resend Pro para canjear en tu propia cuenta.', warranty: '1 año', delivery: COUPON },
  'tod--bolt_pro_1_year': {
    summary: 'Cupón de Bolt Pro para tu cuenta, con 10 millones de tokens al mes.',
    steps: ['Inicia sesión en tu cuenta de Bolt.', 'Elige el plan Pro con pago mensual.', 'Aplica el cupón y completa el pago.'],
    notes: ['Elige el plan mensual al aplicar el cupón. La suscripción se renueva sola cada mes.'],
    warranty: NO_WARRANTY_AFTER,
    delivery: COUPON,
  },
  'tod--sup_ai_tools_11': { summary: 'Plan Photoroom Max por 7 días.', delivery: 'Correo y acceso web al buzón' },
  'tod--sup_dodi_muse-ai2': {
    name: 'Muse AI: 31 mil millones de tokens',
    summary: 'Cuenta lista de Muse AI para crear imágenes y videos con IA. Los tokens no vencen.',
    notes: ['La descripción del proveedor indica 25 mil millones de tokens y el nombre 31 mil millones: confírmalo por chat.', 'Revisa la cuenta apenas la recibas, porque no tiene garantía.'],
    warranty: 'Sin garantía',
    delivery: 'Correo y enlace al buzón para el código de acceso',
  },
  'tod--notion_business_3m': {
    summary: 'Enlace para activar Notion Business por 3 meses en tu propio correo.',
    steps: ['Abre el enlace.', 'Activa la cuenta con tu correo y tu tarjeta.'],
    notes: ['Necesitas tu propia tarjeta válida; no se brinda soporte por pagos con tarjeta.', 'Usa una sola tarjeta por cuenta.', 'El enlace se puede reclamar hasta 4 horas después de la compra.'],
    warranty: UNTIL_ACTIVATION,
    delivery: LINK,
  },
  'tod--sup_elite1_6EC97569': {
    summary: 'Enlace para activar Super Duolingo por 1 año en tu propia cuenta. No necesitas tarjeta.',
    steps: ['Abre el enlace y actívalo con un clic.', 'Si falla, prueba con una cuenta creada con IP de India.'],
    notes: ['El enlace se puede reclamar hasta 6 horas después de la compra.'],
    warranty: UNTIL_ACTIVATION,
    delivery: LINK,
  },
  'tod--sup_gemini_DUOLINGO': {
    summary: 'Cupón oficial de Super Duolingo por 12 meses en tu propia cuenta. No necesitas tarjeta.',
    steps: ['Mantén tu cuenta abierta en el navegador.', 'Abre el enlace en otra pestaña y haz clic en “Claim Offer”.', 'Si no funciona con tu cuenta actual, crea una nueva y repite.'],
    notes: ['La activación solo funciona con una VPN de India.', 'Garantía de 5 días para reclamar el cupón sin usar.'],
    warranty: 'Completa después de activar',
    delivery: COUPON,
  },
  'tod--sup_cupponhub_1_link': {
    summary: 'Enlace para activar Crunchyroll Premium por 1 mes en tu propia cuenta.',
    steps: ['Abre el enlace en Chrome.', 'Inicia sesión o crea una cuenta nueva.', 'Completa la configuración de pago que se solicita.', 'Activa y disfruta Premium.'],
    notes: ['Requiere una cuenta nueva o elegible. Las cuentas que ya tuvieron Premium o prueba pueden no funcionar.', 'Fuera de India puede hacer falta una VPN.', 'Espera 4 o 5 días antes de cancelar el pago automático.'],
    warranty: '1 día',
    delivery: LINK,
  },
  'tod--elevenlabs_creator_3m': {
    summary: 'Cuenta lista de ElevenLabs plan Creator por 3 meses, con 131.000 créditos al mes.',
    notes: ['Cambia los datos de acceso dentro de los 30 minutos posteriores a la compra. Después no se aceptan reclamos.'],
    warranty: 'Sin garantía',
    delivery: READY,
  },
  'tod--sup_dodi_figma-edu-12m': {
    summary: 'Cuenta de Figma Educación por 2 años, con acceso al correo.',
    includes: ['Funciones premium', 'Proyectos ilimitados'],
    steps: ['Inicia sesión con los mismos datos en el correo y en Figma.', 'Agrega la verificación en dos pasos.', 'Al configurar la cuenta, elige “Figma Education”.'],
    warranty: '2 meses',
    delivery: READY,
  },
  'tod--sup_dodi_ms-offcie-365': {
    summary: 'Cuenta de organización de Microsoft 365 por 12 meses, con funciones limitadas.',
    includes: ['Word, Excel, PowerPoint, OneNote y Forms', 'Funciona en Windows, macOS, Android e iOS'],
    notes: ['El almacenamiento de OneDrive es un extra y no forma parte del producto.', 'Copilot no está incluido.'],
    warranty: '1 mes',
    delivery: READY,
  },
  'tod--surfshark_2_months_coupon': {
    summary: 'Cupón de Surfshark por 2 meses.',
    notes: ['Necesitas un medio de pago para activar.'],
    warranty: NO_WARRANTY_AFTER,
    delivery: COUPON,
  },
  'tod--__nord_vpn_3_months_shared': { summary: 'Cuenta compartida de NordVPN por 3 meses.', warranty: 'Completa, 3 meses', delivery: 'Cuenta compartida' },
  'tod--__sonyliv_premium_6_months': {
    summary: 'Código de SonyLIV Premium por 6 meses: series, deportes en vivo, películas y producciones originales.',
    steps: ['Entra a sonyliv.com/activate_offer e inicia sesión.', 'Pega el código y haz clic en “Activate Offer”.'],
    notes: ['Para un reembolso o reemplazo necesitas una grabación de pantalla.', 'No se puede sumar a una suscripción activa: úsalo cuando venza.', 'En iPhone, activa desde la web, no desde la app.'],
    delivery: 'Código de activación',
  },
  'tod--spotify_3_month_on_mail_fw': { summary: 'Spotify plan Estándar por 3 meses en tu correo.', notes: SPOTIFY_NOTES, warranty: 'Completa, 3 meses', delivery: ON_MAIL },
  'tod--___grammarly_pro_1y_on_mail': {
    summary: 'Plan pago de Grammarly por 1 año en tu cuenta.',
    steps: ['Crea una cuenta nueva de Grammarly.', 'Envíanos el correo y la contraseña de esa cuenta.'],
    warranty: '1 mes',
    delivery: ON_ACCOUNT,
  },
  'tod--__google_ai_plus_1y_on_mail': {
    summary: 'Plan Google AI Plus familiar en tu correo, con invitaciones para 5 personas.',
    includes: ['Almacenamiento compartido de 200 GB o hasta 400 GB, según la región', 'Acceso mejorado a Gemini y a sus funciones en Gmail y Docs', 'Herramientas de video e imagen, y NotebookLM ampliado', '250 créditos al mes en Flow'],
    warranty: 'Sin garantía',
    delivery: ON_MAIL,
  },
  'tod--airtable_team_plan_6_months': { summary: 'Cupón de Airtable plan Team por 6 meses.', steps: ['Elige el plan Team.', 'Aplica el cupón en la página de pago.'], delivery: COUPON },
  'tod--lovable_pro_lite_account_12m': {
    summary: 'Cuenta lista de Lovable Pro Lite por 12 meses, con 300 créditos extra al activar.',
    includes: ['Todas las funciones Pro', '5 créditos extra cada día', 'Creación de apps, herramientas y flujos de trabajo'],
    notes: ['Cambia la contraseña después de comprar.', 'Si la contraseña da error, restablécela con el acceso al correo.', 'Transferir espacios de trabajo no está cubierto ni se recomienda.'],
    warranty: 'Hasta iniciar sesión correctamente',
    delivery: READY,
  },
  'tod--sup_6a8efee33d3e2e255337c576': {
    summary: 'Wink VIP por 90 días.',
    includes: ['Biblioteca completa de herramientas de belleza con IA', 'Mejora de video a 4K', 'Eliminación avanzada de objetos', 'Transiciones VIP', 'Exportación en alta calidad sin marca de agua'],
    warranty: 'Completa',
  },
  'tod--sup_cupponhub_apple_music_5m': {
    summary: 'Enlace para activar Apple Music por 6 meses en una cuenta nueva de región India.',
    steps: ['Abre el enlace y crea una cuenta de región India.', 'Si estás fuera de India, usa una VPN en el navegador.'],
    notes: ['Necesitas tu propio medio de pago (UPI o tarjeta).', 'El enlace se puede reclamar hasta 24 horas después de la compra.'],
    duration: '6 meses',
    warranty: '1 mes después de activar',
    delivery: LINK,
  },
  'tod--__spotify_2_month_trial_codes': { summary: 'Código de prueba de Spotify por 2 meses.', notes: ['Necesitas tarjeta o UPI para activar.', 'Solo funciona en cuentas nuevas.'], delivery: 'Código de prueba' },
  'tod--__spotify_3_month_trial_codes': { summary: 'Código de prueba de Spotify por 3 meses.', notes: ['Necesitas tarjeta o UPI para activar.', 'Solo funciona en cuentas nuevas.'], delivery: 'Código de prueba' },
  'tod--magic_patterns_starter_1_year': {
    summary: 'Clave de Magic Patterns Starter por 1 año, con los pasos de activación.',
    notes: ['El soporte depende de la política del vendedor original: el reemplazo o reembolso no está garantizado.'],
    delivery: KEY,
  },
  'tod--sup_dodi_coursera-premium-12m': {
    summary: 'Cuenta lista de Coursera con acceso Premium de organización, por unos 12 meses.',
    includes: ['Cursos y certificados incluidos, a tu nombre', 'Opción de obtener Gemini por 3 meses al completar un curso de Google AI'],
    steps: ['Inicia sesión con correo, contraseña y clave 2FA.', 'Vincula tu Gmail.', 'Cambia la contraseña y agrega tu propia 2FA.'],
    notes: ['No incluye acceso al correo.', 'No cambies el correo principal.'],
    warranty: '24 horas',
    delivery: READY,
  },
  'tod--____crunchyroll_1m_on_mail__fw': { summary: 'Crunchyroll Mega Fan por 1 mes en tu correo. Entrega en unos 10 minutos.', includes: CRUNCHYROLL_BENEFITS, warranty: 'Completa', delivery: ON_MAIL },
  'tod--___autodesk_3y_on_mail_invitat': {
    summary: 'Licencia de Autodesk con 46 aplicaciones por 3 años, por invitación a tu correo.',
    includes: ['AutoCAD, Revit, Maya, 3ds Max e Inventor Professional', 'Civil 3D, Navisworks Manage, Fusion y más'],
    steps: ['Envíanos tu correo para recibir la invitación.'],
    warranty: '1 año',
    delivery: ON_MAIL,
  },
  'tod--___crunchyroll_mega_fan_1_year': {
    summary: 'Crunchyroll Mega Fan por 1 año en tu cuenta.',
    includes: CRUNCHYROLL_BENEFITS,
    steps: ['Envía tu usuario y contraseña al bot indicado en la entrega.'],
    warranty: 'Completa, por problemas de pago',
    delivery: ON_ACCOUNT,
  },
  'tod--___linkedin_buisness_12m_on_yo': {
    summary: 'LinkedIn Business por 12 meses en tu cuenta, para usuarios nuevos y antiguos.',
    includes: ['Información de empleos', 'Créditos InMail', 'Cursos de aprendizaje'],
    steps: ['Después de comprar, envía tu número de pedido y tu cuenta de LinkedIn.', 'Se te pedirá iniciar sesión para activar Premium.'],
    warranty: 'Completa',
    delivery: ON_ACCOUNT,
  },
  'tod--___netflix_premium_extra_30_da': {
    summary: 'Cuenta adicional de Netflix para uso personal por 30 días.',
    notes: ['Una cuenta por persona, en 1 dispositivo a la vez.', 'No está verificada para hogar.', 'Se puede renovar durante el año.'],
    warranty: 'Completa, 1 mes',
  },
  'tod--___p_rn_hub_premium_1_year_on_': { summary: 'Plan Premium por 1 año en tu correo.', warranty: '6 meses', delivery: ON_MAIL },
  'tod--___spotify_12_month_on_mail___': { summary: 'Spotify plan Estándar por 12 meses en tu correo.', notes: SPOTIFY_NOTES, warranty: 'Completa, 12 meses', delivery: ON_MAIL },
  'tod--___youtube_premium_12_months_f': { summary: 'YouTube Premium por 12 meses, por invitación familiar a tu correo. El plan está pagado por el periodo completo.', includes: YOUTUBE_BENEFITS, warranty: 'Completa', delivery: ON_MAIL },
  'tod--__canva_edu_pro_3_year_premium': {
    summary: 'Acceso a Canva Pro por 3 años, por invitación a un equipo educativo.',
    includes: ['Funciones Pro', 'Funciona en PC y celular'],
    warranty: '1 año',
    delivery: 'Invitación a tu correo',
  },
  'tod--__crunchyroll_private_profile_': {
    summary: 'Perfil privado con PIN de Crunchyroll Mega Fan por 1 año.',
    notes: ['Solo para uso personal, en 1 dispositivo a la vez.', 'No cambies a otro perfil.', 'No hay reembolso por iniciar sesión o reproducir en varios dispositivos.', 'Si Premium no aparece, cierra por completo la app y vuelve a abrirla.'],
    warranty: 'Completa, 12 meses',
    delivery: 'Correo, contraseña, perfil y PIN',
  },
  'tod--__grammarly_ai_pro_1_month_ful': { summary: 'Grammarly Pro por 1 mes en tu correo.', includes: GRAMMARLY_BENEFITS, notes: GRAMMARLY_NOTES, warranty: 'Completa, 1 mes', delivery: ON_MAIL },
  'tod--__miro_edu_lifetime_on_your_ma': {
    summary: 'Plan educativo de Miro de por vida, como miembro por invitación a tu correo.',
    includes: ['Colaboración con estudiantes y equipos', 'Pizarras, lecciones, diagramas y actividades interactivas'],
    notes: ['Pensado para uso educativo.', 'Las funciones dependen de las políticas actuales de Miro.'],
    duration: 'De por vida',
    warranty: '1 año',
    delivery: 'Invitación a tu correo',
  },
  'tod--__p_rn_hub_premium_1_month_on_': { summary: 'Plan Premium por 1 mes en tu correo.', warranty: 'Completa', delivery: ON_MAIL },
  'tod--__pre_made_crunchyroll_mega_fa': { summary: 'Cuenta lista de Crunchyroll Mega Fan por 1 año, con acceso al correo.', includes: CRUNCHYROLL_BENEFITS, warranty: 'Completa, por problemas de pago', delivery: READY },
  'tod--__prime_video_private_6_m__wit': { summary: 'Prime Video por 6 meses, con anuncios y acceso al correo.', warranty: '3 meses' },
  'tod--__zee_5_1_year_prem_on_your_nu': { summary: 'ZEE5 Premium por 1 año en tu número.', steps: ['Envíanos tu número de ZEE5 para la activación manual.'], warranty: 'Completa', delivery: 'Se activa en tu número' },
  'tod--grammarly_ai_pro_3_month_on_ma': { summary: 'Grammarly Pro por 3 meses en tu correo.', includes: GRAMMARLY_BENEFITS, notes: GRAMMARLY_NOTES, warranty: 'Completa, 3 meses', delivery: ON_MAIL },
  'tod--pre_made_p_rn_hub_premium_1_ye': { name: 'Pornhub Premium 1 año (cuenta lista)', summary: 'Cuenta lista con plan Premium por 1 año, con acceso a un correo Outlook.', warranty: '6 meses', delivery: READY },
  'tod--sup_053bf6e9-3092-4946-b6c8-fa': { summary: 'LinkedIn Business por 2 meses.', notes: ['Funciona en cuentas antiguas.', LINKEDIN_REGION, 'Plazo de reclamo: 3 días.'] },
  'tod--sup_3252cbea-77d0-4a11-bd8e-a1': { summary: 'LinkedIn Sales Navigator por 2 meses.', notes: ['Funciona en cuentas antiguas.', LINKEDIN_REGION, 'Plazo de reclamo: 7 días.'] },
  'tod--sup_660b7a8d-7642-40c1-93be-17': { summary: 'LinkedIn Career por 2 meses, para usuarios nuevos.', notes: ['Si aparece “no elegible”, la cuenta ya no se considera nueva y no hay reemplazo.', 'Plazo de reclamo: 5 días.'] },
  'tod--sup_8af46009-8620-4ff1-a7e9-83': { summary: 'LinkedIn Career por 3 meses, con código o enlace de activación.', notes: ['La cuenta debe tener al menos 135 días de antigüedad.'], delivery: 'Código o enlace de activación' },
  'tod--sup_1a54dd25-cbf5-429f-858d-f0': { summary: 'Cupón de ChatPRD Pro por 1 año, con los pasos de activación.', steps: ['Entra a app.chatprd.ai/plans/lenny para llegar al pago.', 'Aplica el cupón.'], notes: [REDEEM_7_DAYS], warranty: 'Completa, 1 año', delivery: COUPON },
  'tod--sup_278b1564-c93b-429b-8f4f-40': { summary: 'Cupón de Manus Pro por 1 año, con 4.000 créditos al mes.', steps: ['Elige el plan Pro anual de 4.000 créditos.', 'Aplica el cupón en la página de pago.'], notes: [REDEEM_7_DAYS], warranty: 'Completa, 1 año', delivery: COUPON },
  'tod--sup_4c738c54-135f-4f63-a90b-37': {
    summary: 'Enlace de activación de Railway Pro por 1 año.',
    steps: ['Abre el enlace y crea una cuenta nueva.', 'Ve a tu perfil → Workspace Settings → Plans.', 'Mejora al plan Pro.'],
    notes: ['La oferta solo vale para cuentas nuevas.'],
    warranty: 'Sin garantía',
    delivery: LINK,
  },
  'tod--sup_ebd1d596-87b8-47d8-9c6e-bd': {
    summary: 'Cupón oficial de Manus Pro por 12 meses en tu cuenta, con 4.000 créditos al mes.',
    steps: ['Crea tu cuenta en manus.im/campaign/lenny.', 'Copia el cupón.', 'Ingrésalo en la página de pago, en “Add promotion code”.'],
    notes: [REDEEM_7_DAYS],
    warranty: NO_WARRANTY_AFTER,
    delivery: COUPON,
  },
  'tod--youtube_premium_3_months_famil': { summary: 'YouTube Premium por 3 meses, por invitación familiar a tu correo. Funciona en todos los países.', includes: YOUTUBE_BENEFITS, warranty: 'Completa', delivery: ON_MAIL },
  'tod--youtube_premium_6_months_fam_2': { summary: 'Cuenta de YouTube Premium familiar por 6 meses, con invitaciones para 5 personas de cualquier país.', includes: YOUTUBE_BENEFITS, warranty: 'Completa', delivery: 'Correo y contraseña' },
  'tod--youtube_premium_6_months_famil': { summary: 'YouTube Premium por 6 meses, por invitación familiar a tu correo.', includes: YOUTUBE_BENEFITS, warranty: 'Completa', delivery: ON_MAIL },
  'tod--sup_cupponhub_wispr_flow_edu_12m': {
    summary: 'Cuenta lista de Wispr Flow Educación por 12 meses.',
    includes: ['Palabras ilimitadas en todos tus dispositivos', 'Más de 100 idiomas', 'Modo de comandos para editar rápido', 'Colaboración en equipo y soporte prioritario'],
    warranty: 'Sin garantía',
    delivery: READY,
  },
  'tod--sup_cupponhub_proton_vpn_14_28_days': {
    summary: 'Cuenta de Proton VPN Plus por 14 a 28 días.',
    includes: ['Servidores en más de 140 países', 'Apto para streaming y juegos', 'Secure Core y Kill Switch', 'Funciona en Windows, Android, iPhone y macOS'],
    duration: '14 a 28 días',
    delivery: READY,
  },
  'tod--sup_cupponhub_adobe_express_12_month': {
    summary: 'Enlace para activar Adobe Express Premium por 12 meses. No necesitas VPN ni tarjeta.',
    steps: ['Abre el enlace.', 'Inicia sesión con tu correo: se activa al instante.'],
    delivery: LINK,
  },
  'tod--sup_hitmeow_6a6e1dcc4e24e64b8f016b54': { ...VIBI, name: 'ElevenLabs: 1 millón de créditos (vía Vibi)' },
  'tod--sup_hitmeow_6a6e1e2e4e24e64b8f01742f': { ...VIBI, name: 'ElevenLabs: 3 millones de créditos (vía Vibi)' },
  'tod--sup_hitmeow_6a6e1eb44e24e64b8f018278': { ...VIBI, name: 'ElevenLabs: 7 millones de créditos (vía Vibi)' },
  'tod--sup_hitmeow_6a721f4db6d374ae89ca4172': { ...VIBI, name: 'ElevenLabs: 300.000 créditos (vía Vibi)' },
  'tod--sup_hitmeow_6a9d73ceeab261fc8b661bdb': { ...VIBI, name: 'ElevenLabs: 131.000 créditos (vía Vibi)' },
  'tod--sup_cheap_luxury_bot_6aad8d9ba6aee7a7eea': { summary: 'Cuenta de administrador de Microsoft 365 Familia por 1 mes. Puedes agregar hasta 5 miembros.', warranty: 'Completa', delivery: 'Correo, contraseña, token y correo de recuperación' },
  'tod--sup_cheap_luxury_bot_6ab406950944def028c': { summary: 'Cuenta de Zoom Pro por 14 días, para 100 participantes.', notes: ['No cambies la contraseña: la cuenta se renueva a los 14 días.'], warranty: 'Completa', delivery: 'Correo, contraseña y acceso web al buzón' },
  'tod--sup_cheap_luxury_bot_6ac675a961e1705a92f': {
    summary: 'Cuenta de Zoom Pro por 28 días, para 100 participantes y reuniones de hasta 30 horas.',
    notes: ['No cambies la contraseña durante la suscripción. Si lo haces, avísanos.', 'Si te pide 2FA, elige “Skip”.', 'Si recibes el código 333333, ábrelo para ver el código real de 6 dígitos. No ingreses 333333: la cuenta se bloquea 30 minutos.'],
    warranty: 'Completa',
    delivery: 'Correo, contraseña y acceso web al buzón',
  },
  'tod--sup_cupponhub_key_hma_android_pc_20_30_d': { summary: 'Clave de HMA VPN Premium por 20 a 30 días.', notes: ['Compatible con Windows, macOS y Android.', 'No funciona en iPhone ni iPad.'], duration: '20 a 30 días', warranty: 'Activa', delivery: KEY },
  'tod--sup_cupponhub_leonardo_seedance_2_5_8500': {
    name: 'Leonardo Seedance 2.5 (8.500 créditos)',
    summary: 'Cuenta lista de Leonardo plan Essential, con Seedance 2.5 y 7.500 a 8.500 créditos.',
    includes: ['Veo 3, Kling AI, Seedance, Grok y más de 25 modelos de IA'],
    notes: ['Revísala dentro de los 5 minutos posteriores a la compra. Después no se aceptan reclamos.', 'Para un reemplazo necesitas grabar la pantalla desde la compra hasta el uso.'],
    warranty: 'Sin garantía',
    delivery: READY,
  },
  'tod--sup_cupponhub_muse_ai_account_1_billion_': { name: 'Muse AI: mil millones de tokens', summary: 'Cuenta lista de Muse AI con mil millones de tokens. No necesitas tarjeta.', delivery: 'Correo, contraseña o enlace al buzón' },
  'tod--sup_cupponhub_windows_11_pro_retail_key_': {
    name: 'Windows 11 Pro: clave Retail',
    summary: 'Clave Retail de Windows 11 Pro para activar 1 PC, con pago único.',
    notes: ['Si tienes Windows Home, primero debes pasar a Pro con una clave de actualización. Te la indicamos por chat.'],
    duration: 'Pago único, para 1 PC',
    delivery: KEY,
  },
  'tod--sup_gptcheap_bot_6a78cc61aaf86fb45397edf': { summary: 'Kling AI con 66 créditos, sin plan.', duration: '30 días', warranty: 'Completa' },
  'tod--sup_gptcheap_bot_6a78cc70aaf86fb45397ee9': { name: 'Kling Pro 3.300 créditos 30 días', summary: 'Kling Pro con 3.300 créditos por 30 días.', duration: '30 días', warranty: '7 días, no 30' },
  'tod--sup_premium_115c35b7-6360-4760-96a7-121b': { summary: 'Plan Customer.io Essentials, con los pasos de activación.', steps: ['Abre el enlace de activación y regístrate.'], notes: [REDEEM_7_DAYS], warranty: 'Completa, 1 año', delivery: COUPON },
  'tod--sup_premium_37854ea4-b415-48fc-b708-106f': { summary: 'Cupón oficial de Replit Core por 12 meses en tu cuenta.', steps: REPLIT_STEPS, notes: [REDEEM_7_DAYS], warranty: NO_WARRANTY_AFTER, delivery: COUPON },
  'tod--sup_premium_8d32405c-35dc-4447-8fea-18e0': { summary: 'Cupón oficial de Replit Core por 12 meses en tu cuenta.', steps: REPLIT_STEPS, notes: [REDEEM_7_DAYS], warranty: 'Completa', delivery: COUPON },
  'tod--sup_premium_a9877c4a-f68c-42f9-8568-f8a4': { summary: 'Cupón de n8n Starter por 1 año.', steps: ['Elige el plan Starter anual.', 'Aplica el cupón en la página de pago.'], notes: [REDEEM_7_DAYS, 'Funciona en cuentas nuevas.'], warranty: 'Completa, 1 año', delivery: COUPON },
  'tod--sup_premium_acee055a-e799-410b-98d3-7a2d': { summary: 'Clave de Factory Pro por 1 año.', steps: ['Copia y pega la dirección app.factory.ai/voucher en el navegador.', 'Ingresa el código.'], notes: ['Canjéalo dentro de las 24 horas posteriores a la compra.'], warranty: NO_WARRANTY_AFTER, delivery: KEY },
  'tod--sup_premium_cd4c7aa0-3817-46de-87e2-50ce': { summary: 'Clave de n8n Starter por 1 año.', steps: ['Elige el plan Starter anual.', 'Aplica el código en la página de pago.'], notes: ['Funciona en cuentas nuevas.'], warranty: 'Sin garantía', delivery: KEY },
  'tod--sup_premium_ffb795da-0417-4800-9f18-4832': { summary: 'Clave de Framer Pro por 1 año, con los pasos de activación.', steps: ['En tu sitio, ve a Site Settings → Plans y elige Framer Pro anual.', 'Ingresa el cupón en “Add promotion code”.'], warranty: 'Solo para el canje', delivery: KEY },
  'tod--sup_productseller_6a2fda51035a6d898f2106': {
    summary: 'Cuenta privada de CapCut Pro Team por 30 días, para 2 dispositivos.',
    steps: ['Inicia sesión primero en la app del celular.', 'Luego entra a la app de computadora con código QR (no por la web).'],
    warranty: 'Completa',
    delivery: READY,
  },
  'tod--sup_productseller_6a2fe23a1c8697b163aedc': {
    summary: 'Microsoft 365: 1 mes garantizado y 11 meses de regalo.',
    includes: ['Word, Excel, PowerPoint, OneNote y Forms', '1 TB en OneDrive', 'Hasta 5 PC con Windows'],
    notes: ['Solo el primer mes está garantizado.'],
    duration: '1 mes + 11 de regalo',
    warranty: '1 mes',
    delivery: 'Correo y contraseña',
  },
  'tod--sup_productseller_6a2ff705dbe65bbecc0d3d': { name: 'Correo Outlook / Hotmail', summary: 'Correo Outlook o Hotmail con acceso completo y a los códigos de verificación.', delivery: 'Correo, contraseña y token' },
  'tod--sup_productseller_6a54b931351561c645a43e': {
    summary: 'Cuenta de Notion Plus Educación por 12 meses. Se permite cambiar el correo.',
    steps: ['Entra primero a outlook.com con tus datos.', 'Inicia sesión en Notion con el mismo correo.', 'Restablece la seguridad de la cuenta.'],
    delivery: 'Correo, contraseña de Hotmail y contraseña de Notion',
  },
  'tod--sup_productseller_6a6207cf92969197bb3829': {
    summary: 'Cuenta de iLovePDF Premium por 1 año.',
    includes: ['Todas las herramientas', 'Documentos ilimitados', 'Web, celular y escritorio', 'Firmas digitales', 'Sin anuncios', '2.000 créditos de IA'],
    steps: ['Inicia sesión en la web de iLovePDF.', 'Cambia la contraseña.'],
    delivery: 'Correo y contraseña',
  },
  'tod--sup_productseller_6a7e3ab79c0c1126fff286': { summary: 'Cuenta privada de CapCut Pro por 6 meses.', warranty: '3 meses', delivery: READY },
  'tod--sup_productseller_6a820a0b969a9635841ddb': {
    summary: 'Cuenta lista de edX Premium por 12 meses, con cursos de Harvard, MIT y otras universidades.',
    includes: ['Miles de cursos', 'Certificados verificados'],
    steps: ['Inicia sesión con los datos entregados.', 'Cambia la contraseña.'],
    notes: ['No cambies el correo: se pierde la garantía.'],
    warranty: 'Completa',
    delivery: READY,
  },
  'tod--sup_productseller_6a88be06fb032a73212a20': {
    summary: 'Licencia de estudiante de JetBrains por 1 año, con 18 productos premium.',
    includes: ['Funciona en Windows, macOS y Linux', 'Cuenta privada', 'Vence alrededor de agosto de 2027'],
    delivery: 'Correo, contraseña de Outlook y de JetBrains',
  },
  'tod--sup_productseller_6aa4551bc76bc3aeb2ebe8': { summary: 'CapCut Pro por 1 mes, con 1.600 créditos.', duration: '1 mes', warranty: 'Completa' },
  'tod--sup_productseller_6abeace70dbb401865ffb2': {
    summary: 'Enlace para activar Apple TV por 12 meses. No necesitas tarjeta.',
    steps: ['Crea una cuenta en la web de Apple TV con una VPN de EE. UU.', 'Pega el enlace y activa la suscripción.', 'Después ya no necesitas la VPN.'],
    notes: ['Puede hacer falta una cuenta nueva con IP de EE. UU.', 'El enlace se puede reclamar hasta 48 horas después de la compra.'],
    warranty: NO_WARRANTY_AFTER,
    delivery: LINK,
  },
  'tod--sup_productseller_6ad7a9668a6410951c2520': { name: 'Proxy rotativo premium (1 GB)', summary: 'Proxies rotativos con 1 GB de tráfico.', includes: ['Protocolos HTTP y SOCKS5', 'Funciona en cualquier app o navegador'], delivery: 'Datos de conexión' },
  'tod--sup_productseller_6ad84dee3db33897160f5d': { summary: 'Cuenta de Replit Core por 1 mes, con modelos de Claude y GPT.', warranty: '3 días', delivery: READY },
  'tod--sup_productseller_6ad924d880cf0bd6ce1298': {
    summary: 'CapCut Pro por 6 a 7 días, con 500 créditos.',
    steps: ['En el celular, abre la app y elige iniciar sesión con correo.', 'En la PC, escanea el código QR desde la app.', 'En Android, actualiza CapCut para tener el lector QR.'],
    notes: ['Iniciar sesión demasiadas veces anula la garantía.'],
    duration: '6 a 7 días',
    warranty: 'Completa',
    delivery: 'Correo y contraseña',
  },
  'tod--sup_default_6ae6ae21ca782692264b5153': {
    summary: 'Cuenta de Leonardo AI Premium ($40) por 1 mes.',
    includes: ['25.000 tokens rápidos al mes', 'Más de 80 modelos', 'Reserva de 75.000 tokens'],
    notes: ['Se entrega en 1 a 2 horas.', 'No hay garantía por abuso o uso de herramientas de terceros.'],
    duration: '1 mes',
    warranty: '2 días',
    delivery: READY,
  },

  // ---------- Addyocart ----------
  'addyo--2015': { summary: 'CapCut Pro individual por 1 mes.', duration: '1 mes', delivery: 'Cuenta privada, no de equipo' },
  'addyo--993': SNAPCHAT,
  'addyo--997': SNAPCHAT,
  'addyo--1005': SNAPCHAT,
  'addyo--995': { delivery: READY },
  'addyo--998': { warranty: 'Sin garantía' },
  'addyo--975': { delivery: LINK },
  'addyo--988': { duration: '9 a 10 días', warranty: '3 días' },
  'addyo--1554': { name: 'Muse AI: mil millones de tokens' },
  'addyo--1951': { name: 'Muse AI: 31 mil millones de tokens' },
  'addyo--987': { name: 'Cursor Pro + Grok + Super Grok + X Premium 12 meses' },
  'addyo--1572': { name: 'Fin AI Agent + Fin Advanced' },
  'addyo--1581': { name: 'PostHog Scale (límites mensuales x2)' },
  'addyo--1587': { name: 'ElevenReader Ultra 12 meses' },
  'addyo--1271': { name: 'HMA VPN Android/PC 20 a 30 días', delivery: KEY },
  'addyo--1000': { summary: 'Amazon Prime privado por 6 meses, con entrega inmediata.', warranty: 'Completa' },
  'addyo--1012': { name: 'NordVPN (3 meses, 6 meses o 1 año)', summary: 'NordVPN. El proveedor lista 3 meses, 6 meses y 1 año bajo este mismo producto: confirma la duración por chat.', duration: 'Se confirma por chat', warranty: 'Completa' },
  'addyo--1014': { summary: 'Coursera Plus por 12 meses.' },
  'addyo--980': { summary: 'Microsoft 365 por 1 año.', includes: ['Word, Excel, PowerPoint, OneNote y Forms'] },
  'addyo--1408': { name: 'ElevenLabs 10.000 créditos', summary: 'ElevenLabs con 10.000 créditos gratuitos.', warranty: '24 horas' },
  'addyo--989': { delivery: 'Cupón oficial' },
  'addyo--1009': { name: 'Correo Outlook privado', delivery: READY },
  'addyo--983': { delivery: 'Cupón oficial' },
};
