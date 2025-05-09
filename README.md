# Posts API

Esta API permite gestionar posts con autenticación JWT. Todos los endpoints requieren un header:


A continuación se describen cada uno de los endpoints disponibles.

---

## 1. `GET /posts/me`

- **Descripción:** Obtiene todos los posts creados por el usuario autenticado.  
- **Headers:**  
  - `Authorization` (Bearer Token)  
- **Path params:** —  
- **Query params:** —  
- **Body:** —  
- **Respuesta (200):**  
  Array de objetos `Post`.

---

## 2. `GET /posts/profile/:profileId`

- **Descripción:** Obtiene todos los posts públicos (no anónimos) de un vendedor.  
- **Headers:**  
  - `Authorization` (Bearer Token)  
- **Path params:**  
  - `profileId` (string) – ID del vendedor  
- **Query params:** —  
- **Body:** — 
- **Respuesta (200):**  
  Array de objetos `Post` con `is_anonymous: false`.

---

## 3. `GET /posts`

- **Descripción:** Búsqueda global de posts con filtros y paginación. Anonimiza `seller_id` en posts anónimos (siempre `"anonymous"` si `is_anonymous: true`).  
- **Headers:**  
  - `Authorization` (Bearer Token)  
- **Query params** (todos opcionales):  
  - `priceMin` (number) – precio mínimo  
  - `priceMax` (number) – precio máximo  
  - `tag` (string) – tag a buscar  
  - `nameContains` (string) – texto parcial en el título  
  - `page` (number, default: 1) – página  
  - `limit` (number, default: 10) – resultados por página  
- **Body:** —  
- **Respuesta (200):**  
  ```json
  {
    "data": [ /* array de posts anonimizados */ ],
    "meta": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }

---

## 4. `GET /posts/:id`

- **Descripción:** Obtiene el detalle de un post. Si `is_anonymous = true` y no eres el autor, `seller_id` = `"anonymous"`.  
- **Headers:**  
  - `Authorization` (Bearer Token)  
- **Path params:**  
  - `id` (string) – ID del post  
- **Query params:** —  
- **Body:** — 
- **Respuesta (200):**  
  ```json
  {
    "_id": "607d1f77bcf86cd799439011",
    "title": "Ejemplo",
    "description": "Detalle del post",
    "tags": ["foo","bar"],
    "price": 100,
    "presentation_card_id": "card123",
    "images": ["url1"],
    "is_archived": false,
    "is_deleted": false,
    "is_anonymous": true,
    "seller_id": "anonymous",      // o el ID real si eres el autor
    "stars_amount": 3,
    "createdAt": "...",
    "updatedAt": "..."
  }

---

## 5. `POST /posts`

- **Descripción:**  
  Crea un nuevo post. El campo `seller_id` se toma del JWT del usuario autenticado.

- **Headers:**  
  - `Authorization`: Bearer `<tu_jwt>`

- **Body (JSON):**  
  ```json
  {
    "title":                "Mi título",           // obligatorio, string
    "description":          "Texto descriptivo",   // obligatorio, string
    "tags":                 ["foo","bar"],         // obligatorio, string[]
    "price":                123.45,                // obligatorio, number
    "presentation_card_id": "card123",             // obligatorio, string
    "images":               ["url1","url2"],       // obligatorio, string[]
    "is_anonymous":         true,                  // opcional, boolean
  }
- **Respuesta (200):**  
  ```json
  {
  "_id": "607d1f77bcf86cd799439011",
  "title": "Mi título",
  "description": "Texto descriptivo",
  "tags": ["foo","bar"],
  "price": 123.45,
  "presentation_card_id": "card123",
  "images": ["url1","url2"],
  "is_anonymous": true,         // por defecto false
  "stars_amount": 0,            // inicia en 0 y luego se ira actualizando
  "seller_id": "usuario123",    // tomado del JWT
  "is_deleted": false,          // por defecto false
  "is_archived": false,         // por defecto false
  "createdAt": "2025-05-09T12:00:00.000Z",
  "updatedAt": "2025-05-09T12:00:00.000Z"
  }

## 6. `PATCH /posts/delete/:id`

- **Descripción:**  
  “Borrado” lógico (`is_deleted = true`). Solo el autor.

- **Headers:**  
  - `Authorization`: Bearer `<tu_jwt>`

- **Path params:**  
  - `id` (string) – ID del post

- **Query params:** —  
- **Body:** —  

- **Respuestas:**  
  - **200 OK** (post actualizado)  
    ```json
    {
      "_id": "607d1f77bcf86cd799439011",
      "is_deleted": true,
      // … otros campos …
    }
---

## 7. `PATCH /posts/undelete/:id`

- **Descripción:**  
  Revierte borrado lógico (`is_deleted = false`). Solo el autor.

- **Headers:**  
  - `Authorization`: Bearer `<tu_jwt>`

- **Path params:**  
  - `id` (string)

- **Body / Query:** —  

- **Respuestas:**  
  - **200 OK** (post actualizado)  
    ```json
    {
      "_id": "607d1f77bcf86cd799439011",
      "is_deleted": false,
      // … otros campos …
    }
---

## 8. `PUT /posts/:id`

- **Descripción:** Actualiza uno o más campos de un post existente. Solo el autor puede hacerlo.  
- **Headers:**  
  - `Authorization` (Bearer Token)  
- **Path params:**  
  - `id` (string) – ID del post a actualizar  
- **Body (JSON, todos opcionales):**  
  ```json
  {
    "title":                "Nuevo título",        // opcional, string  
    "description":          "Nueva descripción",   // opcional, string  
    "tags":                 ["x","y"],             // opcional, string[]  
    "price":                999.99,                // opcional, number  
    "presentation_card_id": "card456",             // opcional, string  
    "images":               ["url3","url4"]        // opcional, string[]  
  }
- **Respuestas:**  
  - **200 OK** (post actualizado)  
    ```json
    {
    "_id": "607d1f77bcf86cd799439011",
    "title": "Nuevo título",
    "description": "Descripción actualizada",
    "tags": ["x","y"],
    "price": 999.99,
    "presentation_card_id": "card456",
    "images": ["url3","url4"],
    "is_anonymous": false,
    "is_archived": false,
    "is_deleted": false,
    "seller_id": "usuario123",
    "stars_amount": 5,
    "createdAt": "2025-05-09T12:00:00.000Z",
    "updatedAt": "2025-05-09T12:10:00.000Z"  
    }

---

## 9. `PATCH /posts/archive/:id`

- **Descripción:** Marca un post como archivado (`is_archived = true`). Solo el autor puede hacerlo.  
- **Headers:**  
  - `Authorization` (Bearer Token)  
- **Path params:**  
  - `id` (string) – ID del post a archivar  
- **Body:** —  
- **Respuesta (200):**  
  ```json
  {
    "_id": "607d1f77bcf86cd799439011",
    "is_archived": true,
    // …otros campos…
  }

---

## 10. `PATCH /posts/unarchive/:id`

- **Descripción:** Revierte el archivado de un post (`is_archived = false`). Solo el autor puede hacerlo.  
- **Headers:**  
  - `Authorization` (Bearer Token)  
- **Path params:**  
  - `id` (string) – ID del post a desarchivar  
- **Body:** —  
- **Respuesta (200):**  
  ```json
  {
    "_id": "607d1f77bcf86cd799439011",
    "is_archived": false,
    // …otros campos…
  }

---

## 11. `PATCH /posts/anonymous/:id`

- **Descripción:** Marca un post como anónimo (`is_anonymous = true`). Solo el autor puede hacerlo.  
- **Headers:**  
  - `Authorization` (Bearer Token)  
- **Path params:**  
  - `id` (string) – ID del post a marcar como anónimo  
- **Body:** —  
- **Respuesta (200):**  
  ```json
  {
    "_id": "607d1f77bcf86cd799439011",
    "is_anonymous": true,
    // …otros campos…
  }

---

## 12. `PATCH /posts/unanonymous/:id`

- **Descripción:** Revierte el anonimato de un post (`is_anonymous = false`). Solo el autor puede hacerlo.  
- **Headers:**  
  - `Authorization` (Bearer Token)  
- **Path params:**  
  - `id` (string) – ID del post a desmarcar como anónimo  
- **Body:** —  
- **Respuesta (200):**  
  ```json
  {
    "_id": "607d1f77bcf86cd799439011",
    "is_anonymous": false,
    // …otros campos…
  }
---

## 13. `PATCH /posts/rate/:id`

- **Descripción:**  
  Añade una valoración numérica (0–5) a un post y recalcula su promedio. Cualquiera excepto el creador puede hacerlo.  
- **Headers:**  
  - `Authorization` (Bearer Token)  
- **Path params:**  
  - `id` (string) – ID del post a valorar  
- **Body (JSON):**  
  ```json
  {
    "rating": 5   // obligatorio, number entre 0 y 5
  }
- **Respuesta (200):**  
  ```json
  {
  "_id": "607d1f77bcf86cd799439011",
  "stars_amount": 4.5,    // nuevo promedio
  "ratings_count": 2,     // total de valoraciones
  // …otros campos del post…
  }

