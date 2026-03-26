# Informe de Estado y Contexto Maestro: Proyecto PrecioHogar

Este documento sirve como "Contexto Maestro" para entender la arquitectura, diseño y funcionalidades del proyecto **PrecioHogar**, una plataforma de e-commerce impulsada por Inteligencia Artificial.

---

## 1. Arquitectura y Stack Tecnológico

El proyecto está construido sobre un stack moderno y eficiente diseñado para rendimiento y escalabilidad, centrado en el ecosistema de React y Google/Firebase/Supabase.

*   **Framework Principal:** **Next.js** (versión 16.2.1) utilizando el **App Router** (`src/app/`), lo que permite renderizado en el servidor (SSR) y generación de sitios estáticos para SEO y rendimiento óptimo. Se utiliza Turbopack (`--turbopack`) en desarrollo para tiempos de compilación más rápidos.
*   **Sistema de Tipado:** **TypeScript** (versión 5.9.3). El tipado es estricto por definición del proyecto (prohibido el uso de `any` explícito y enmascaramiento de errores de compilación en `next.config.ts`).
*   **Gestor de Paquetes:** **pnpm** (obligatorio según `AGENTS.md` y `package.json`).
*   **Base de Datos y Backend (Fuente de Verdad):** **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`). Toda la lógica de modelado de datos y validación recae en las APIs de Supabase. El esquema de la base de datos utiliza convención `snake_case`. El uso de ORMs como Prisma ha sido **estrictamente prohibido** para el modelado de datos, centralizando todo en Supabase.
*   **Inteligencia Artificial:** **Genkit de Google AI** (`@genkit-ai/google-genai`). Integrado para ejecutar flujos complejos alojados en `src/ai/flows/`. El modelo por defecto para generación de texto es `gemini-2.5-flash`.
*   **Hosting:** Diseñado para **Firebase App Hosting** (`apphosting.yaml`), con fallback a la configuración de cliente estándar de Firebase.

---

## 2. Análisis de Dependencias

A continuación, las librerías principales utilizadas en el proyecto (según `package.json`):

*   **UI y Componentes Base:**
    *   **Radix UI** (`@radix-ui/react-*`): Primitivas de UI accesibles (Dropdowns, modales, pestañas, acordeones, etc.).
    *   **shadcn/ui**: Capa de diseño sobre Radix UI y Tailwind CSS (los componentes residen en `src/components/ui/`).
    *   **Lucide React**: Biblioteca de iconos SVG ligeros y modernos.
*   **Estilos y Animaciones:**
    *   **Tailwind CSS** (`tailwindcss`, `tailwind-merge`, `clsx`, `tailwindcss-animate`): Sistema de utilidades CSS principal.
    *   **Framer Motion**: Utilizado para animaciones fluidas y complejas (e.g., el `HeroSection` del inicio).
    *   **Embla Carousel React**: Motor subyacente para componentes de carruseles.
*   **Estado y Formularios:**
    *   **React Hook Form** + **Zod**: Gestión de formularios eficiente con validación de esquemas estricta.
    *   **Context API**: Gestión global del estado (ej. `CartProvider` en `src/context/cart-context`). El carrito se cifra en `localStorage` usando Web Crypto API (AES-GCM).
*   **Datos y Analíticas:**
    *   **Recharts**: Creación de gráficos y visualización de datos en los dashboards de administración.
    *   **date-fns**: Manipulación de fechas en JavaScript.
*   **Backend e IA:**
    *   **Supabase SSR**: Comunicación tipada con la base de datos de Supabase desde los Server Components y Client Components de Next.js.
    *   **Firebase**: Usado para despliegue y posiblemente almacenamiento (Storage).
    *   **Genkit**: Orquestación de peticiones a los modelos LLM de Google.

---

## 3. Sistema de Diseño y UI/UX

La interfaz de usuario busca ser limpia, vibrante y muy enfocada en la estética ("Editorial Surfaces").

*   **Tailwind CSS y Variables de Tema (`tailwind.config.ts` y `globals.css`):**
    *   **Colores**: Paleta bautizada como *"The Radiant Curator"*.
        *   Fondo (`--background`): `#f7f6f5` (cálido casi blanco).
        *   Texto (`--foreground`): `#2e2f2f` (gris oscuro/negro suave).
        *   Primario (`--primary`): `#af2700` (rojo oscuro/terracota).
        *   Acento secundario/Container: `#ff7856` (naranja brillante).
    *   **Fuentes**: Tipografía con mucho carácter editorial.
        *   `font-display`: **'Epilogue'** (para títulos y encabezados grandes, a menudo en itálica y tracking ajustado).
        *   `font-body`/`font-sans`: **'Plus Jakarta Sans'** (para legibilidad en párrafos y UI).
    *   **Radios de Borde**: Redondeados acentuados (`--radius: 2rem` - 32px), creando un look amigable ("pill-shaped" buttons, tarjetas redondeadas).
*   **Patrones de Diseño Visual:**
    *   **Estilo**: Se clasifica como un diseño **Moderno Editorial**, con toques **Vibrantes** y **Glassmorfismo** (`.glass`, fondos translúcidos, desenfoques).
    *   **Sombras y Profundidad**: Uso de "Ambient Shadows" (`shadow-ambient` con un suave brillo cálido basado en el color primario).
    *   **Animaciones Creadas**: Elementos flotantes, gradientes animados (`animate-gradient-slow` hero backgrounds) y microinteracciones de hover que escalan elementos (`hover:scale-105`).
*   **Componentes Principales (`src/components/ui/`):**
    *   **Botones (`button.tsx`)**: Estilos prominentes (ej. `btn-primary` con gradiente de `#af2700` a `#ff7856`, `btn-glass`). Suelen tener textos en mayúsculas, negrita y tracking amplio.
    *   **Tarjetas (`card.tsx`, `product-card.tsx`)**: Contenedores para productos sin bordes duros (`border-none`), con imágenes de gran tamaño (aspect-square) y botones superpuestos (`hover:translate-y-0`).
    *   **Layouts**: Uso extensivo de grillas y flexbox. Barras de navegación tipo cristal (`glass-header`).

---

## 4. Inventario de Recursos (Assets)

El proyecto gestiona sus recursos principalmente a través del directorio `public/` y URLs externas.

*   **Tipos de Recursos Locales (`public/`):**
    *   **Imágenes/Logos**: `logotienda.svg`, `logotienda_blanco.svg`, `logo_horizontal.png`, iconos PWA (android-chrome), favicons.
    *   **Carpetas estáticas**: `banners/`, `fondos/`, `icons/`, `edicion/`.
*   **Gestión de Imágenes:**
    *   Las imágenes UI y logotipos se procesan con el componente `<Image />` de Next.js para optimización de formatos (WebP) y resoluciones.
    *   Los recursos locales se enlazan estáticamente de forma absoluta (`/logotienda_blanco.svg`).
    *   **URLs Externas**: Se permite la carga de imágenes dinámicas a través de dominios externos permitidos en `next.config.ts` (e.g., `placehold.co`, `images.unsplash.com`, `picsum.photos`).

---

## 5. Flujos de Usuario y Funcionalidades

Actualmente, la aplicación permite las siguientes interacciones:

*   **Lado del Cliente (Tienda):**
    *   Explorar una landing page (`/`) muy visual y animada.
    *   Ver listas de productos (desde `/productos`).
    *   Añadir productos al carrito de compras desde las tarjetas de producto (`ProductCard`), con notificaciones Toast nativas. El carrito está cifrado en memoria local.
    *   Proceso de Checkout y Finalizar Compra.
*   **Panel de Administración (`/admin`):**
    *   **Gestión de Inventario (`/admin/products`)**: Tabla avanzada para ver productos (ID, SKU, Categoría, Estado, Stock, Precio).
    *   **Acciones de Producto**: Alternar visibilidad de publicación (Publicado/Borrador) y Eliminar productos con confirmación.
    *   **Integraciones de IA (Genkit - `/ai/flows/`)**: Flujos backend definidos (aunque pendientes de visualizar la UI en `/admin/ai/`), que incluyen:
        *   `analyze-image-style-flow.ts`: Extraer un estilo visual a partir de una foto.
        *   `analyze-product-flow.ts`: Identificación de productos a partir de fotos.
        *   `generate-description-flow.ts` / `generate-product-details-flow.ts`: Crear o mejorar descripciones para marketing.
        *   `remove-background-flow.ts`: Edición automatizada de imágenes.

---

## 6. Estructura de Datos y Tipos

La estructura de datos es definida por Supabase (representada en `src/lib/supabase/database.types.ts`).

*   **Base de Datos Principal (`public` schema):**
    *   **`products` (Productos)**:
        *   Campos: `id` (int), `product_id` (SKU string), `title`, `description`, `price` (float), `quantity`, `is_active`, `slug`, `image` (URL), `category_id` (Foreign Key a `categories`), `rating`, `badge`.
    *   **`categories` (Categorías)**:
        *   Campos: `id`, `name`, `slug`, `description`, `image`, `is_active`, `parent_id` (para subcategorías).
    *   **`product_features` y `product_specifications`**:
        *   Tablas relacionadas (`product_id`) que guardan características y key-value pairs técnicos del producto (ej: Dimensiones, Materiales).
    *   **`users` (Usuarios/Clientes)**:
        *   Campos: `id`, `name`, `email`, `password`, `phone`, `address`, `delivery_notes`.

*   **Manejo en TypeScript**:
    *   Las interfaces consumidas se extraen de los `Row` de `Database['public']['Tables']`.
    *   Se promueve la inferencia automática de Supabase y el uso estricto de tipos autogenerados para mutaciones e inserciones.
