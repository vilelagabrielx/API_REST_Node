const request = require('supertest'); // Importa o pacote supertest para simular requisições HTTP

const express = require('express'); // Importa o express para criar uma instância do servidor

const router = require('../src/routes/partner'); // Importa o arquivo de rotas

const app = express(); // Cria uma instância do express

app.use(express.json());

const ID = process.argv[3];

app.use(router); // Usa o arquivo de rotas importado para as rotas da aplicação
///
//TESTE DA ROTA createapartner
describe('POST /updatepartner', () => {
  // Descrição do teste

  it('Verifica a rota de update', async () => {
    // Descrição do comportamento esperado do teste

    const data = {
      tradingName: 'teste',
      ownerName: 'teste',
      document: '40028922',
      coverageArea: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [-43.70807012320802, -22.635060152555525],
              [-43.680926754499666, -22.636565072818087],
              [-43.695409610781354, -22.61204165978151],
              [-43.70807012320802, -22.635060152555525],
            ],
          ],
          [
            [
              [-43.701739865845184, -22.617265424837953],
              [-43.72495080107814, -22.60584371513221],
              [-43.72159384763509, -22.630102648431688],
              [-43.701739865845184, -22.617265424837953],
            ],
          ],
        ],
      },
      address: {
        type: 'Point',
        coordinates: [-43.698233379914444, -22.627960730496646],
      },
    };
    const response = await request(app)
      .post(`/updatepartner/${ID}`)
      .send(data)
      .expect(200);
    // Verifica se o corpo da resposta é igual ao esperado
  });
});
/////
