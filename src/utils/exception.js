export class Exception extends Error {
    constructor(message, httpCode) {
      super(message);
      this.httpCode = httpCode;
    }
  }
  
  export class BadRequest extends Exception {
    constructor(message) {
      super(message, 400);
    }
  }
  
  export class Unauthorized extends Exception {
    constructor(message) {
      super(message, 401);
    }
  }
  
  export class Forbidden extends Exception {
    constructor(message) {
      super(message, 403);
    }
  }
  
  export class NotFound extends Exception {
    constructor(message) {
      super(message, 404);
    }
  }