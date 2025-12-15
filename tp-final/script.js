function buscarlibro() {
  // Obtiene lo que el usuario escribió en el input con id="titulo"
  const title = document.getElementById("titulo").value.trim();

  // Si el input está vacío, muestra un mensaje y corta la función
  if (!title) {
    alert("Por favor, escribí un título o autor.");
    return;
  }

  // URL de la API de OpenLibrary, codificando el título para evitar errores
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`;

  // Realiza la solicitud HTTP
  fetch(url)
    .then(res => res.json())  // Convierte la respuesta a JSON
    .then(data => {
      const resultadosDiv = document.getElementById("resultados");
      resultadosDiv.innerHTML = ""; // Limpiamos resultados anteriores

      // Si no hay resultados, mostrar alerta
      if (data.docs.length === 0) {
        const alerta = document.createElement("div");
        alerta.className = "col-12 text-center";
        alerta.innerHTML = `
          <div class="alert alert-warning w-75 mx-auto">No se encontraron resultados.</div>
        `;
        resultadosDiv.appendChild(alerta);
        return;
      }

      // Procesamos hasta 12 libros
      data.docs.slice(0, 12).forEach(book => {
        const coverId = book.cover_i;

        // URL de portada. Si falta, muestra una imagen por defecto
        const coverUrl = coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
          : "https://via.placeholder.com/150x220?text=Sin+portada";

        // Nombre del autor o texto por defecto
        const authorName = book.author_name ? book.author_name[0] : "Desconocido";

        // ID del autor para crear enlace
        const authorId = book.author_key ? book.author_key[0] : null;

        // == Creación de elementos ===
        const col = document.createElement("div");
        col.className = "col d-flex";

        const card = document.createElement("div");
        card.className = "card flex-fill text-center p-3 tarjetas";

        const img = document.createElement("img");
        img.src = coverUrl;
        img.alt = "Portada del libro";
        img.className = "card-img-top mx-auto rounded mb-3";

        const body = document.createElement("div");
        body.className = "card-body";

        const titleEl = document.createElement("h6");
        titleEl.className = "card-title fw-bold text-truncate";
        titleEl.textContent = book.title;
        titleEl.title = book.title; // Tooltip con el título completo

        const p = document.createElement("p");
        p.className = "card-text text-muted mb-0";
        p.textContent = "Autor: ";

        // Si tiene ID de autor, crear <a>. Si no, poner texto simple
        if (authorId) {
          const link = document.createElement("a");
          link.href = `authors.html?id=${authorId}`;
          link.className = "text-decoration-none";
          link.textContent = authorName;
          p.appendChild(link);
        } else {
          const span = document.createElement("span");
          span.textContent = authorName;
          p.appendChild(span);
        }

        // === Ensamblado final ===
        body.appendChild(titleEl);
        body.appendChild(p);

        card.appendChild(img);
        card.appendChild(body);

        col.appendChild(card);
        resultadosDiv.appendChild(col);
      });
    })
    .catch(error => {
      console.error(error);

      const resultadosDiv = document.getElementById("resultados");
      resultadosDiv.innerHTML = "";

      // Si hay error de red / API
      const alerta = document.createElement("div");
      alerta.className = "col-12";
      alerta.innerHTML = `
        <div class="alert alert-danger text-center w-75 mx-auto">
          Error al buscar los libros. Intentalo nuevamente.
        </div>
      `;
      resultadosDiv.appendChild(alerta);
    });
}
