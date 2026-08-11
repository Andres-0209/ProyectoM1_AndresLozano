# 🎨 Colorfly Studio — Generador de Paletas de Colores

Aplicación web que permite generar paletas de colores aleatorias en distintos formatos, pensada como una herramienta rápida de apoyo para diseñadores y desarrolladores frontend.

🔗 **Demo en vivo (GitHub Pages):** https://andres-0209.github.io/ProyectoM1_AndresLozano/
📦 **Repositorio:** https://github.com/Andres-0209/ProyectoM1_AndresLozano.git

---

## 1. Descripción del proyecto

**Colorfly Studio** es una aplicación web (MVP) que genera paletas de colores aleatorias de forma instantánea, sin necesidad de recargar la página.

**¿Para qué sirve?**
Ayuda a diseñadores, desarrolladores y creativos a explorar combinaciones de color rápidamente, obtener sus códigos en distintos formatos y guardar las paletas que más les gusten para reutilizarlas después.

**¿Qué problema resuelve?**
Evita tener que usar herramientas externas o generar colores manualmente. Todo el flujo —generar, ver el código, copiarlo y guardarlo— ocurre en una sola pantalla.

**Tecnologías utilizadas:**
- HTML5 semántico
- CSS3 (variables CSS, Flexbox, diseño responsive)
- JavaScript vanilla (sin frameworks ni dependencias externas)
- `localStorage` del navegador para persistir paletas guardadas

---

## 2. Funcionalidades

- **Selección de cantidad de colores:** el usuario elige entre 6, 8 o 9 colores mediante botones.
- **Generación aleatoria:** un algoritmo genera valores de matiz (H), saturación (S) y luminosidad (L) aleatorios dentro de rangos que garantizan colores agradables y legibles.
- **Formatos de color:** cada color puede visualizarse en **HSL**, **HEX** o **RGBA**, seleccionable desde un menú desplegable.
- **Bloqueo de colores:** cada círculo de color tiene un candado que permite "fijar" un color para que no cambie al generar una nueva paleta.
- **Botón "Generar paleta":** crea una nueva combinación de colores respetando los que estén bloqueados.
- **Botón "Guardar paleta":** almacena la paleta actual en el historial, persistido en el navegador (`localStorage`).
- **Historial de paletas guardadas:** muestra las paletas guardadas en miniatura, con opción de eliminarlas individualmente.
- **Copiar código HEX:** al hacer clic sobre cualquier círculo de color se copia su código HEX al portapapeles.
- **Microfeedback visual:**
  - Un *toast* (mensaje flotante) confirma cuando un color fue copiado.
  - Un mensaje temporal confirma cuando la paleta fue generada o guardada con éxito.
- **Accesibilidad:** etiquetas descriptivas (`aria-label`) en los botones de bloqueo, foco de teclado visible en todos los controles interactivos, y contraste cuidado entre texto y fondo.
- **Diseño responsive:** la interfaz se adapta a pantallas de escritorio, tablet y móvil.

---

## 3. Manual de usuario

Sigue estos pasos para usar Colorfly Studio:

1. **Abrir la aplicación**
   Ingresa a la demo publicada: https://andres-0209.github.io/ProyectoM1_AndresLozano/
   (o abre el archivo `index.html` localmente si la ejecutas en tu computador).

2. **Elegir el formato de color**
   En el panel izquierdo, usa el menú desplegable **"FORMATO DE COLOR"** para elegir cómo quieres ver el código de cada color: `HSL`, `HEX` o `RGBA`. El texto debajo de cada círculo se actualizará automáticamente.

3. **Seleccionar la cantidad de colores**
   Haz clic en uno de los botones circulares **6**, **8** o **9** para definir cuántos colores tendrá tu paleta. La cuadrícula se ajustará al instante.

4. **Generar una paleta**
   Presiona el botón **"GENERAR PALETA"**. Se crearán nuevos colores aleatorios y aparecerá un mensaje de confirmación ("Paleta generada con éxito").

5. **Bloquear un color (opcional)**
   Si te gusta un color en particular y no quieres que cambie al generar una nueva paleta, haz clic en el pequeño candado ubicado en la esquina superior derecha de su círculo. El candado se cerrará indicando que ese color está fijado. Vuelve a hacer clic para desbloquearlo.

6. **Consultar los códigos de color**
   Debajo de cada círculo se muestra el código correspondiente al formato elegido (HSL, HEX o RGBA).

7. **Copiar un color**
   Haz clic directamente sobre el círculo de color que quieras copiar. Su código HEX se copiará automáticamente al portapapeles y aparecerá un aviso confirmando la copia.

8. **Guardar una paleta**
   Si quieres conservar la combinación actual, presiona **"GUARDAR PALETA"**. Aparecerá un mensaje de confirmación y la paleta se añadirá a la sección **"PALETAS GUARDADAS"**, en la parte inferior de la pantalla.

9. **Eliminar una paleta guardada**
   En el historial, cada paleta guardada tiene un botón **"Eliminar"** que la borra de forma permanente del navegador.

10. **Repetir el proceso**
    Puedes cambiar el formato, la cantidad de colores, bloquear nuevos colores y generar paletas tantas veces como quieras; todo ocurre sin recargar la página.

---

## 4. Decisiones técnicas

- **Estructura de carpetas:** se separaron claramente los archivos de estructura (`index.html`), estilos (`css/styles.css`) y lógica (`js/script.js`) para mantener el principio de separación de responsabilidades y facilitar el mantenimiento.
- **Por qué JavaScript vanilla:** al tratarse de un MVP, no se requería la complejidad de un framework. Vanilla JS permite un código ligero, sin dependencias ni proceso de build, ideal para desplegar directamente en GitHub Pages.
- **Generación de colores:** se generan valores aleatorios de matiz (0–360°), saturación (50%–85%) y luminosidad (35%–70%) en formato HSL. Estos rangos se eligieron deliberadamente para evitar colores demasiado oscuros, demasiado claros o poco saturados, que dificultarían la lectura del texto y la identificación del color. A partir del HSL se calculan matemáticamente los valores RGB y, desde ahí, el código HEX.
- **Renderizado dinámico:** el DOM del área de colores se reconstruye completamente en cada generación (`grid.innerHTML = ""` seguido de la creación de nodos), asegurando que nunca queden tarjetas sobrantes o vacías al cambiar la cantidad seleccionada.
- **Bloqueo de colores:** el estado de cada color (`locked`) se guarda en un objeto de estado en memoria; al generar una nueva paleta, solo se reemplazan los colores no bloqueados.
- **Persistencia de paletas guardadas:** se utiliza `localStorage` del navegador (sin backend), ideal para un MVP que no requiere autenticación ni base de datos.
- **Microfeedback:**
  - El aviso de "color copiado" se implementa como un *toast* real creado dinámicamente en JavaScript, reutilizado en cada copia.
  - Los avisos de "paleta generada" y "paleta guardada" se implementan con CSS puro, ancladas mediante `::after` y `position: absolute` directamente al botón correspondiente, evitando que su posición dependa del tamaño del contenedor de historial.
- **Accesibilidad:** se usó HTML semántico (`header`, `main`, `aside`, `section`), se conservó el foco visible (`:focus-visible`) en todos los controles interactivos, se añadieron `aria-label` descriptivos en los botones de bloqueo, y se cuidó el contraste de color entre texto y fondo oscuro.

---

## 5. Instalación local

Sigue estos pasos para ejecutar el proyecto en tu computador:

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Andres-0209/ProyectoM1_AndresLozano.git
   ```

2. **Acceder a la carpeta del proyecto**
   ```bash
   cd ProyectoM1_AndresLozano
   ```

3. **Instalar dependencias**
   No aplica — el proyecto no utiliza dependencias externas ni gestor de paquetes (HTML, CSS y JS puro).

4. **Ejecutar la aplicación localmente**
   Puedes abrir el archivo `index.html` directamente con doble clic, o servirlo con un servidor local (recomendado para evitar restricciones del navegador):
   ```bash
   # Con la extensión "Live Server" de VS Code
   # o con Python:
   python3 -m http.server 5500
   ```

5. **Abrir en el navegador**
   Si usaste un servidor local, visita:
   ```
   http://localhost:5500
   ```
   Si abriste el archivo directamente, se cargará automáticamente en tu navegador predeterminado.

---

## 6. Despliegue en GitHub Pages

El proyecto está desplegado en:
🔗 https://andres-0209.github.io/ProyectoM1_AndresLozano/

Pasos seguidos para el despliegue:

1. Se subió el código a la rama `main` del repositorio público `ProyectoM1_AndresLozano`.
2. En GitHub, se accedió a **Settings → Pages**.
3. En **Source**, se seleccionó la rama `main` y la carpeta raíz (`/root`).
4. Se guardaron los cambios y GitHub generó automáticamente la URL pública del sitio.
5. Se verificó que el sitio cargara correctamente, mostrando la interfaz, generando paletas y guardando el historial sin errores en la consola.

---

## Licencia

Proyecto desarrollado con fines educativos como parte del Proyecto M1.
