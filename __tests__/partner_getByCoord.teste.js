const request = require('supertest'); // Importa o pacote supertest para simular requisições HTTP

const express = require('express'); // Importa o express para criar uma instância do servidor

const router = require('../src/routes/partner'); // Importa o arquivo de rotas

const app = express(); // Cria uma instância do express

app.use(express.json());

const X = process.argv[3];
const Y = process.argv[4];

app.use(router); // Usa o arquivo de rotas importado para as rotas da aplicação
///
//TESTE DA ROTA createapartner
describe('POST /createapartner', () => {
  // Descrição do teste

  it('Verifica o retorno dos parceiros próximos', async () => {
    // Descrição do comportamento esperado do teste

    const data = {
      X: `${X}`,
      Y: `${Y}`,
    };
    const response = await request(app)
      .post('/getNearestPartnerByCOORDENATES')
      .send(data)
      .expect(200);
    expect(response.status).toBe(200); // Verifica se o status da resposta é 200
    expect(response.type).toBe('application/json'); // Verifica se o tipo da resposta é "application/json"
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('tradingName');
    expect(response.body).toHaveProperty('ownerName');
    expect(response.body).toHaveProperty('document');
    expect(response.body).toHaveProperty('coverageArea');
    expect(response.body).toHaveProperty('coverageArea.type');
    expect(response.body).toHaveProperty('coverageArea.coordinates');
    expect(response.body).toHaveProperty('address');
    expect(response.body).toHaveProperty('address.type');
    expect(response.body).toHaveProperty('address.coordinates');
    expect(response.body).toHaveProperty('distance');
    expect(response.body).toHaveProperty('distance.Kilometers');
    expect(response.body).toHaveProperty('distance.Meters');
    expect(response.body).toHaveProperty(
      'distance.Earth radius considered(Meters)',
    );
    // Verifica se o corpo da resposta é igual ao esperado
  });
});
/////
