# Uniformes Farfaglia – Maqueta

Maqueta **no funcional** del nuevo sitio de Uniformes Farfaglia, para mostrar y aprobar el proyecto. Es HTML, CSS y JavaScript puro, sin dependencias ni compilación, pensada para publicarse en GitHub Pages.

> Los precios, productos y textos son de ejemplo. Carrito, búsqueda y formularios están simulados.

## Estructura

```
farfaglia-demo/
├── index.html        Inicio
├── 404.html          Página de error
├── css/
│   ├── tokens.css    Colores, tipografía y espaciados
│   ├── base.css      Reset y estilos generales
│   └── style.css     Estilos de las secciones
├── js/
│   └── main.js       Interacciones simuladas
├── assets/
│   ├── img/          Imágenes
│   └── fonts/        Tipografías
└── .nojekyll         Evita el procesamiento de Jekyll en GitHub Pages
```

## Ver en tu computadora

Abrí `index.html` en el navegador. O, para simular mejor la publicación, desde la carpeta:

```bash
python3 -m http.server 8000
```

y entrá a http://localhost:8000.

## Subir a GitHub y publicar

1. Creá un repositorio vacío en GitHub (por ejemplo `farfaglia-demo`).
2. En la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Estructura inicial de la maqueta"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/farfaglia-demo.git
git push -u origin main
```

3. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
4. Tras uno o dos minutos, el sitio queda en `https://TU_USUARIO.github.io/farfaglia-demo/`.

## Reglas del proyecto

- Usar **rutas relativas** (`./css/style.css`), nunca `/css/style.css`, o los archivos no cargan en GitHub Pages.
- Todo lo que use la maqueta (imágenes, tipografías) va dentro del repo.
- Las páginas llevan `noindex` para que Google no indexe la maqueta.
