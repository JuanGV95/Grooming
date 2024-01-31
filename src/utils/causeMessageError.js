export const generatorUserError = (data) => {
    return `Todos los campos son requeridos y deben ser validos 😱.
      Lista de campos recibidos en la solicitud:
      - first_name  : ${data.first_name}
      - last_name   : ${data.last_name}
      - email       : ${data.email}
      `;
  };
  
  export const generatorUserIdError = (id) => {
    return `Se debe enviar un identificador valido 😱.
      Valor recibido: ${id}
    `;
  };

  export const generatorProductError = (data) => {
    return `Todos los campos son requeridos y deben ser validos 😱.
      Lista de campos recibidos en la solicitud:
      - title        : ${data.title}
      - description  : ${data.description} 
      - price        : ${data.price}
      - status       : ${data.status}
      - category     : ${data.category}
      - thumbnails   : ${data.thumbnails} 
      - code         : ${data.code}
      - stock        : ${data.stock} 
      `;
  }; 