# Diego Ramirez Magaña — Portafolio personal

Portafolio personal construido con HTML, CSS y JavaScript vanilla. Sin frameworks ni dependencias — todos los sistemas (tema, i18n, animaciones, formulario) están implementados desde cero.

**Live:** https://epinki07.github.io/portfolio/

---

## Stack

| Capa | Tecnología |
|---|---|
| Markup | HTML5 semántico (ARIA, JSON-LD, OpenGraph) |
| Estilos | CSS3 con custom properties, responsive en 3 breakpoints |
| Lógica | JavaScript ES6+ vanilla (sin dependencias) |
| Hosting | GitHub Pages (rama `main`) |
| Formulario | Formspree (fetch API, sin backend propio) |

---

## Estructura

```
portfolio/
├── css/
│   └── styles.css        # Estilos globales + tema claro/oscuro
├── js/
│   ├── main.js           # Lógica: tema, i18n, animaciones, formulario
│   └── i18n.js           # Traducciones ES / EN
├── assets/               # Assets estáticos adicionales
├── cv/                   # CV en PDF (próximamente)
├── index.html            # Página principal
├── profile.jpg           # Foto de perfil
├── buildathon-constancia.png  # Certificado StarkNet Buildathon 2025
├── robots.txt
└── sitemap.xml
```

---

## Funcionalidades

- **Tema claro/oscuro** — persiste en `localStorage`
- **Internacionalización** — ES/EN sin librerías externas
- **Scroll reveal** — Intersection Observer API
- **Skill bars animadas** — animación on-scroll
- **Formulario de contacto** — envío via Formspree, estados de éxito/error
- **Modal lightbox** — certificado del Buildathon
- **SEO estructurado** — JSON-LD Schema.org Person, sitemap con hreflang
- **Responsive** — mobile-first, breakpoints en 768px y 560px

---

## Correr localmente

No necesita build ni `npm install`. Basta con servir los archivos estáticos:

```bash
# Con Python
python3 -m http.server 3000

# Con Node (npx)
npx serve .

# Con VS Code
# Instala la extensión Live Server y abre con Go Live
```

Luego abre `http://localhost:3000` en el navegador.

---

## Configurar el formulario de contacto

El formulario usa [Formspree](https://formspree.io):

1. Crea una cuenta en formspree.io
2. Crea un nuevo form y copia el ID (ej. `mldepjvo`)
3. En `js/main.js`, reemplaza `YOUR_FORMSPREE_ID` con tu ID:
   ```js
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_ID';
   ```

---

## Sobre mí

Estudiante de **Ingeniería en Software y Negocios Digitales** en el Tecnológico del Software (Mérida, México). Busco prácticas y roles junior en backend.

- **Email:** dramirezmagana@gmail.com
- **LinkedIn:** [diego-ramirez-magaña](https://www.linkedin.com/in/diego-ramirez-maga%C3%B1a-b15022298/)
- **GitHub:** [epinki07](https://github.com/epinki07)
