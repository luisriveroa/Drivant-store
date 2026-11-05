# ⚡ QuantumStore — Plataforma de Reventa de Productos Digitales

Plataforma e-commerce moderna desarrollada en **Next.js 14 (App Router)**, **TypeScript** y **Tailwind CSS**, conectada a la API de **QuantumVault (Store API v1)**. Diseñada para revendedores con márgenes de ganancia configurables, interfaz estética y arquitectura segura sin exposición de credenciales.

---

## 🚀 Características Principales

1. **Seguridad Absoluta**:
   - Tu API Key de QuantumVault (`X-API-Key`) **nunca se expone en el navegador**. Todas las llamadas pasan por tus propios Serverless Route Handlers en Next.js.
   - Los precios mayoristas base son eliminados en el backend; el cliente solo ve tus precios de venta finales.

2. **Catálogo Dinámico & Variantes**:
   - Consume en vivo `GET /products` y `GET /products/:productKey`.
   - Soporte automático para productos simples y productos con múltiples variantes (duraciones, opciones, garantías).
   - Detección de `deliverFields` para informar al cliente exactamente qué datos recibirá tras la compra.

3. **Módulo de Margen / Sobreprecio Configurable**:
   - Margen automático por rango de precio mayorista, en `MARGIN_TIERS` de `src/config/margins.ts`.
   - Sobrescritura personalizada por producto en `src/config/margins.ts`.

4. **Protección Anti-Duplicación por Timeout (Idempotencia)**:
   - Siguiendo la regla de oro de la API de QuantumVault: **ante un timeout en `/purchase`, nunca se reintenta un POST automático** (evita cobros dobles).
   - La plataforma devuelve estado HTTP `202 Accepted` y permite verificar o recuperar las credenciales entregadas en el historial de órdenes (`GET /orders/:orderId`).

5. **Entrega Inmediata en Pantalla**:
   - Tras el checkout, las credenciales, claves CDK o enlaces de activación se presentan en vivo con botones de copiado rápido.

6. **Panel de Administración Privado (`/admin`)**:
   - Consulta de saldo en vivo de tu billetera (`GET /balance`).
   - Métricas de compras realizadas y gasto total mayorista.
   - Historial de órdenes y buscador de pedidos para recuperar credenciales pasadas.

---

## 📁 Estructura del Proyecto

```
quantum-store/
├── .env.example                 # Plantilla de variables de entorno
├── next.config.js               # Configuración de Next.js
├── package.json                 # Dependencias (Next 14, Zustand, Lucide, Sonner)
├── tailwind.config.ts           # Configuración de estilos y tema brand
├── tsconfig.json                # Configuración de TypeScript
└── src/
    ├── app/
    │   ├── layout.tsx           # Layout raíz con Navbar, Footer y Toasts
    │   ├── page.tsx             # Catálogo principal con filtros y buscador
    │   ├── globals.css          # Estilos globales de Tailwind
    │   ├── admin/
    │   │   └── page.tsx         # Panel admin (Saldo de billetera y Órdenes)
    │   ├── cart/
    │   │   └── page.tsx         # Carrito, checkout y entrega de credenciales
    │   ├── product/[productKey]/
    │   │   └── page.tsx         # Ficha detallada de producto y variantes
    │   └── api/
    │       ├── balance/route.ts          # GET /api/balance (Saldo privado)
    │       ├── products/route.ts         # GET /api/products (Con sobreprecio)
    │       ├── products/[productKey]/    # GET /api/products/:key
    │       ├── purchase/route.ts         # POST /api/purchase (Con timeout safe)
    │       └── orders/                   # GET /api/orders y GET /api/orders/:id
    ├── components/
    │   ├── Navbar.tsx           # Barra de navegación con contador de carrito
    │   ├── Footer.tsx           # Pie de página
    │   ├── ProductCard.tsx      # Tarjeta estética de producto
    │   ├── ProductGrid.tsx      # Cuadrícula responsive con skeleton loaders
    │   ├── CartDrawer.tsx       # Carrito lateral deslizable
    │   ├── PurchaseModal.tsx    # Modal de confirmación de compra
    │   └── ui/
    │       ├── Button.tsx       # Botón reutilizable con estados de carga
    │       ├── Badge.tsx        # Etiquetas de stock y categoría
    │       ├── Input.tsx        # Inputs con validación visual
    │       └── Spinner.tsx      # Indicador de carga animado
    ├── config/
    │   └── margins.ts           # Configuración de márgenes de ganancia
    ├── hooks/
    │   └── useCart.ts           # Estado global del carrito con persistencia local
    └── lib/
        ├── types.ts             # Definición completa de tipos TypeScript
        ├── pricing.ts           # Algoritmo de cálculo de precio de reventa
        └── quantum-client.ts    # Cliente HTTP para la API de QuantumVault
```

---

## 🛠️ Instalación y Uso Local

### 1. Clonar o navegar a la carpeta:
```bash
cd quantum-store
```

### 2. Instalar dependencias:
```bash
npm install
```

### 3. Configurar variables de entorno:
Crea un archivo `.env.local` en la raíz (puedes copiar de `.env.example`):
```env
# Tu API Key de QuantumVault (Privada)
QUANTUMVAULT_API_KEY=qv_live_tu_api_key_aqui

# URL base oficial de la API
QUANTUMVAULT_BASE_URL=https://www.quantumvault.me/api/v1


# Nombre de tu tienda
NEXT_PUBLIC_STORE_NAME=MiTiendaDigital
```

### 4. Iniciar servidor de desarrollo:
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
Accede al panel de administración en [http://localhost:3000/admin](http://localhost:3000/admin).

---

## ⚙️ Configuración de Márgenes de Ganancia

Puedes ajustar los márgenes de dos formas:

1. **Automáticamente por rango de precio** en `MARGIN_TIERS` de `src/config/margins.ts`:
   ```typescript
   export const MARGIN_TIERS: MarginTier[] = [
     { upTo: 1, percent: 100 },        // menos de $1: +100%
     { upTo: 5, percent: 50 },         // $1 a $4.99: +50%
     { upTo: 20, percent: 35 },        // $5 a $19.99: +35%
     { upTo: Infinity, percent: 25 },  // $20 o más: +25%
   ];
   ```

2. **Por producto específico** (tiene prioridad sobre los rangos) en `src/config/margins.ts`:
   ```typescript
   export const productMarginOverrides: ProductMarginOverride[] = [
     // Agregar monto fijo de $0.20 al correo Outlook:
     { productKey: 'outlook_mail', margin: { type: 'fixed', value: 0.20 } },
     // O agregar un 50% de ganancia a un producto de alta demanda:
     { productKey: 'google_ai_pro_gemini', margin: { type: 'percentage', value: 50 } },
   ];
   ```

---

## 🌐 Despliegue Gratuito en Vercel (Recomendado)

Next.js está optimizado de forma nativa para Vercel:

1. Sube tu código a un repositorio en **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - QuantumStore"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/quantum-store.git
   git push -u origin main
   ```

2. Entra a [vercel.com](https://vercel.com) e inicia sesión con GitHub.
3. Haz clic en **"Add New Project"** e importa tu repositorio `quantum-store`.
4. En la sección **Environment Variables**, agrega:
   - `QUANTUMVAULT_API_KEY`: `qv_live_...`
   - `QUANTUMVAULT_BASE_URL`: `https://www.quantumvault.me/api/v1`
   - `NEXT_PUBLIC_STORE_NAME`: `El nombre de tu tienda`
   - `ADMIN_PASSWORD`: contraseña larga para `/admin` (usuario `admin`). Sin ella, el panel queda bloqueado.
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` y `NEXT_PUBLIC_TELEGRAM_USERNAME` (opcional): cambian los canales de pedidos definidos en `src/app/cart/page.tsx`.
   - `ADDYO_API_KEY` (opcional): activa Addyocart como proveedor.
   - `TOD_API_KEY` (opcional): activa TOD Gifts como segundo proveedor. Qué se publica se define en `src/config/catalog-filter.ts`.
   - `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` (opcional): aviso de cada pedido nuevo con el total verificado por el servidor.
5. Haz clic en **Deploy**. En menos de 2 minutos tu tienda estará online en `https://tu-tienda.vercel.app`.
