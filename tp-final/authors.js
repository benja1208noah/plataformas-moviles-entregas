// Obtiene los parámetros que vienen en la URL (todo lo que aparece después del signo "?")
const params = new URLSearchParams(window.location.search);

// Obtiene el valor del parámetro "id" que corresponde al ID del autor
const autorId = params.get("id");

// Solo ejecuta todo este bloque si existe un ID de autor en la URL
if (autorId) {

  // URL de la imagen del autor en OpenLibrary, usando su ID
  const imagenUrl = `https://covers.openlibrary.org/a/olid/${autorId}-M.jpg`;

  /* 
  ======================================================
  =============== 1) DATOS DEL AUTOR ===================
  ======================================================
  */

  // Solicita la información del autor desde la API de OpenLibrary
  fetch(`https://openlibrary.org/authors/${autorId}.json`)
    .then(res => res.json())  // Convierte la respuesta en JSON
    .then(autor => {          // "autor" contiene los datos del autor

      // Obtiene el contenedor donde se mostrará la información del autor
      const autorDiv = document.getElementById("autor");

      // Limpia cualquier contenido previo
      autorDiv.innerHTML = "";

      // Crea la imagen del autor
      const img = document.createElement("img");
      img.src = imagenUrl;
      img.alt = "Foto del autor";
      img.className = "autor-img";

      // Crea el nombre del autor (h2)
      const h2 = document.createElement("h2");
      h2.className = "fw-bold";
      h2.textContent = autor.name;

      // Fecha de nacimiento (si no existe, muestra "Desconocida")
      const pNacimiento = document.createElement("p");
      pNacimiento.innerHTML = `<strong>Fecha de nacimiento:</strong> ${autor.birth_date || "Desconocida"}`;

      // Biografía (puede venir como texto o como objeto con "value")
      const pBio = document.createElement("p");
      pBio.textContent = autor.bio ? (autor.bio.value || autor.bio) : "Sin biografía disponible.";

      // Enlace a Wikipedia del autor, creando una URL en base a su nombre
      const linkWiki = document.createElement("a");
      linkWiki.href = `https://es.wikipedia.org/wiki/${encodeURIComponent(autor.name.replace(/ /g, "_"))}`;
      linkWiki.target = "_blank"; // abrir en otra pestaña
      linkWiki.className = "btn btn-outline-primary mt-2";
      linkWiki.textContent = "Ver en Wikipedia";

      // Agrega todos los elementos creados al contenedor del autor
      autorDiv.appendChild(img);
      autorDiv.appendChild(h2);
      autorDiv.appendChild(pNacimiento);
      autorDiv.appendChild(pBio);
      autorDiv.appendChild(linkWiki);
    })
    .catch(() => {
      // En caso de error al cargar los datos del autor

      const autorDiv = document.getElementById("autor");
      autorDiv.innerHTML = "";

      // Muestra un mensaje de error
      const alerta = document.createElement("div");
      alerta.className = "alert alert-danger";
      alerta.textContent = "No se pudo cargar la información del autor.";

      autorDiv.appendChild(alerta);
    });


  /* 
  ======================================================
  ================= 2) LIBROS DEL AUTOR ===============
  ======================================================
  */

  // Solicita las obras escritas por el autor
  fetch(`https://openlibrary.org/authors/${autorId}/works.json`)
    .then(res => res.json())  // Convierte la respuesta a JSON
    .then(data => {

      // Contenedor que mostrará los libros del autor
      const librosDiv = document.getElementById("libros");
      librosDiv.innerHTML = "";

      // Si no hay libros disponibles, muestra un mensaje
      if (!data.entries || data.entries.length === 0) {
        const msg = document.createElement("p");
        msg.className = "text-muted text-center";
        msg.textContent = "No hay libros disponibles para este autor.";
        librosDiv.appendChild(msg);
        return;
      }

      // Recorre los primeros 12 libros del autor
      data.entries.slice(0, 12).forEach(libro => {

        // Crea la URL de la portada del libro (o una imagen por defecto)
        const coverUrl = libro.covers
          ? `https://covers.openlibrary.org/b/id/${libro.covers[0]}-M.jpg`
          : "https://via.placeholder.com/128x195?text=Sin+portada";

        // Crea una columna (Bootstrap)
        const col = document.createElement("div");
        col.className = "col-6 col-md-4 col-lg-3";

        // Crea la tarjeta del libro
        const card = document.createElement("div");
        card.className = "card h-100 text-center p-3";

        // Imagen del libro
        const img = document.createElement("img");
        img.src = coverUrl;
        img.alt = "Portada";
        img.className = "card-img-top mx-auto";
        img.style.width = "128px";

        // Contenedor del texto
        const body = document.createElement("div");
        body.className = "card-body";

        // Título del libro
        const h6 = document.createElement("h6");
        h6.className = "card-title";
        h6.textContent = libro.title;

        // Ensamblado de la tarjeta
        body.appendChild(h6);
        card.appendChild(img);
        card.appendChild(body);
        col.appendChild(card);

        // Se agrega la tarjeta al contenedor principal
        librosDiv.appendChild(col);
      });

    })
    .catch(() => {
      // En caso de error al cargar los libros

      const librosDiv = document.getElementById("libros");
      librosDiv.innerHTML = "";

      const alerta = document.createElement("div");
      alerta.className = "alert alert-danger";
      alerta.textContent = "No se pudieron cargar los libros.";

      librosDiv.appendChild(alerta);
    });

} // Fin del IF que verifica si existe autorId
