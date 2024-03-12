import { expect } from "chai";
import supertest from "supertest";

const requester = supertest('http://localhost:8080');

describe("Auth tests", function () {
  it('debe registrar un usuario correctamente', async function () {
    this.email = `jd${Date.now() / 1000}@gmail.com`;
    this.password = Date.now().toString();
    const userMock = {
      first_name: 'Juan',
      last_name: 'David',
      email: this.email,
      password: this.password,
      role: 'admin',
    };

    const response = await requester
      .post('/api/auth/register')
      .send(userMock);

    // Verificar el código de estado
    expect(response.status).to.equal(201);

    // Verificar el cuerpo de la respuesta
    expect(response.body).to.have.property('id');
    expect(response.body).to.have.property('role', 'admin');
  });
});
