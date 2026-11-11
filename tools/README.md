# CV descargable

El PDF del sitio se compila desde `../latex/Jhulen-Mallo-CV.tex`. Es la versión en español del perfil `Data_Engineer`, exportada del proyecto original `PAGE_RESUME/latex`. Todas las fuentes necesarias están incluidas en este repositorio: el documento principal, `TLCresume.sty`, `_header_es.tex` y las secciones de habilidades, educación y actividades.

Instala `pypdf` y [Tectonic](https://tectonic-typesetting.github.io/). Desde la raíz de este repositorio:

```powershell
python -m pip install pypdf
python tools/build_cv.py
```

El comando busca Tectonic en `PATH`, en `latex/tectonic.exe` o en el proyecto original junto al repositorio. Compila las fuentes y verifica que el PDF tenga una página, la certificación Generative AI Leader y su enlace de verificación. Guarda el resultado en `output/pdf/Jhulen-Mallo-CV.pdf` y lo copia a `assets/docs/Jhulen-Mallo-CV.pdf`, el archivo que utilizan los tres enlaces de descarga de `index.html`.

Para actualizar el CV, edita `latex/Jhulen-Mallo-CV.tex` y sus secciones incluidas antes de ejecutar el comando.

La primera compilación puede necesitar acceso a Internet para que Tectonic descargue los paquetes oficiales de LaTeX.
