# JOSNISHOP Frontend

Este proyecto es el frontend de **JOSNISHOP**, una plataforma de compras en línea desarrollada con React, TypeScript y Vite.

---

## Estructura de Carpetas

```
FRONTEND/
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
│
├── public/
│   └── logo.png
│
└── src/
    ├── App.css
    ├── App.tsx
    ├── main.tsx
    ├── vite-env.d.ts
    │
    ├── assets/
    │   ├── css/
    │   │   ├── carrito.css
    │   │   ├── categorias.css
    │   │   ├── contactanos.css
    │   │   ├── inicio.css
    │   │   ├── login.css
    │   │   ├── nosotros.css
    │   │   ├── noticias.css
    │   │   ├── panel.css
    │   │   ├── pedido.css
    │   │   ├── Perfil.css
    │   │   ├── recuperar.css
    │   │   ├── register.css
    │   │   ├── reseña.css
    │   │   └── categorias/
    │   └── IMG/
    │       ├── inicio_video.mp4
    │       ├── logo.png
    │       ├── nosotros.png
    │       ├── noticias1.png
    │       ├── noticias2.png
    │       ├── noticias3.png
    │       └── categorias/
    │
    ├── components/
    │   ├── Categorias/
    │   ├── hamburguesa/
    │   │   ├── contactanos.tsx
    │   │   ├── nosotros.tsx
    │   │   └── noticias.tsx
    │   ├── panel/
    │   │   ├── Categorias.tsx
    │   │   ├── detalle.tsx
    │   │   ├── Inventario.tsx
    │   │   ├── ModalResena.tsx
    │   │   ├── Pedidos.tsx
    │   │   ├── Perfil.tsx
    │   │   ├── Producto.tsx
    │   │   └── resenas.tsx
    │   └── Productos_index/
    │       ├── producto_audifonosE6S.tsx
    │       ├── producto_AuricularesPro.tsx
    │       ├── producto_bolso.tsx
    │       ├── producto_cafeteria.tsx
    │       ├── producto_cocina.tsx
    │       ├── producto_lienzo.tsx
    │       ├── producto_perro.tsx
    │       ├── producto_play.tsx
    │       ├── producto_reloj.tsx
    │       ├── producto_set.tsx
    │       ├── producto_sofa.tsx
    │       └── producto_zapatillas.tsx
    │
    ├── pages/
    │   ├── carrito.tsx
    │   ├── categorias.tsx
    │   ├── inicio.tsx
    │   ├── login.tsx
    │   ├── Panel.tsx
    │   ├── recuperar_contrasena.tsx
    │   └── register.tsx
    │
    └── services/
        └── (servicios y utilidades)
```

---

## Principales Archivos y Carpetas

- **index.html**  
  Archivo HTML principal donde se monta la aplicación React.

- **vite.config.ts**  
  Configuración de Vite para el proyecto.

- **public/**  
  Archivos estáticos accesibles desde la raíz del sitio (por ejemplo, favicon/logo).

- **src/App.tsx**  
  Componente principal de la aplicación.

- **src/main.tsx**  
  Punto de entrada de React, configuración de rutas con React Router.

- **src/App.css**  
  Estilos globales de la aplicación.

- **src/assets/**  
  Recursos multimedia y CSS adicionales.

- **src/pages/login.tsx**  
  Página de inicio de sesión.

- **src/components/**  
  Componentes reutilizables (puedes agregar aquí tus propios componentes).

- **src/services/**  
  Servicios y utilidades para la app.

---

## Instalación y Uso

1. **Instala las dependencias:**
   ```bash
   npm install
   ```

2. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abre en tu navegador:**  
   [http://localhost:5173](http://localhost:5173) (o el puerto que indique Vite).

---

## Funcionalidades Destacadas

- **Sistema de reseñas:**  
  Los usuarios pueden dejar, editar y eliminar reseñas de productos.  
  El modal de reseñas tiene fondo borroso y diseño moderno.

- **Panel de administración:**  
  Visualización y gestión de productos, inventario, pedidos y reseñas.

- **Notificaciones:**  
  El backend envía alertas por correo al vendedor cada vez que se publica una nueva reseña.

- **Filtrado de comentarios:**  
  Los comentarios ofensivos o inapropiados son detectados y bloqueados antes de publicar o editar una reseña.

- **Diseño responsivo:**  
  Adaptado para dispositivos móviles y escritorio.

---

## Tecnologías Utilizadas

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/)
- [Font Awesome](https://fontawesome.com/) (íconos)
- [CSS moderno](https://developer.mozilla.org/es/docs/Web/CSS) (panel.css, reseña.css, etc.)

---

## Notas

- Los archivos multimedia y el logo deben estar en la carpeta `public` o en `src/assets/IMG/` según su uso.
- Para agregar nuevas páginas, crea archivos en `src/pages/` y añade la ruta en `main.tsx`.
- Los estilos globales están en `src/App.css`, pero puedes agregar más en `src/assets/css/`.
- El modal de reseñas utiliza `reseña.css` para el fondo borroso y tarjeta centrada.
- El sistema de reseñas está conectado con el backend para notificar al vendedor por correo y filtrar comentarios ofensivos.

---

## Autor

JOSNISHOP - Compra sin límites

---
