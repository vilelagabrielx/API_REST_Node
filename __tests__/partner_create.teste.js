const request = require('supertest'); // Importa o pacote supertest para simular requisições HTTP

const express = require('express'); // Importa o express para criar uma instância do servidor

const router = require('../src/routes/partner'); // Importa o arquivo de rotas

const app = express(); // Cria uma instância do express

app.use(express.json());

const DOCUMENT = process.argv[3];

app.use(router); // Usa o arquivo de rotas importado para as rotas da aplicação
///
//TESTE DA ROTA createapartner
describe('POST /createapartner', () => {
  // Descrição do teste

  it('Verifica a rota de insert', async () => {
    // Descrição do comportamento esperado do teste

    const data = {
      tradingName: 'loja',
      ownerName: 'cleber bebidas',
      document: `${DOCUMENT}`,
      coverageArea: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [-43.71139421047175, -22.608501031740047],
              [-43.71139421047175, -22.612671882754825],
              [-43.708251172465964, -22.612671882754825],
              [-43.708251172465964, -22.608501031740047],
              [-43.71139421047175, -22.608501031740047],
            ],
          ],
          [
            [
              [-43.708128397544016, -22.60921507226989],
              [-43.708128397544016, -22.61033712847312],
              [-43.70680242838529, -22.61033712847312],
              [-43.70680242838529, -22.60921507226989],
              [-43.708128397544016, -22.60921507226989],
            ],
          ],
        ],
      },
      address: {
        type: 'Point',
        coordinates: [-22.610634633125176, -43.707593295436965],
      },
    };
    const response = await request(app)
      .post('/createapartner')
      .send(data)
      .expect(201);
    // Verifica se o corpo da resposta é igual ao esperado
  });
});
