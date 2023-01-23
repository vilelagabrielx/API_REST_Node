const request = require('supertest'); // Importa o pacote supertest para simular requisições HTTP

const express = require('express'); // Importa o express para criar uma instância do servidor

const router = require('../src/routes/partner'); // Importa o arquivo de rotas

const app = express(); // Cria uma instância do express

app.use(express.json());

app.use(router); // Usa o arquivo de rotas importado para as rotas da aplicação
///
const ID = process.argv[3];

//TESTE DA ROTA getpartnerbyid
describe('GET /getpartnerbyid/:id', () => {
  // Descrição do teste

  it('Verifica o retorno de um parceiro especifico', async () => {
    // Descrição do comportamento esperado do teste

    const response = await request(app).get(`/getpartnerbyid/${ID}`); // Realiza uma requisição GET para a rota /getpartnerbyid/1
    expect(response.status).toBe(200); // Verifica se o status da resposta é 200
    expect(response.type).toBe('application/json'); // Verifica se o tipo da resposta é "application/json"
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('tradingName');
    expect(response.body).toHaveProperty('ownerName');
    expect(response.body).toHaveProperty('document');
    expect(response.body).toHaveProperty('coverageArea');
    expect(response.body).toHaveProperty('coverageArea.coordinates');
    expect(response.body).toHaveProperty('address');
    expect(response.body).toHaveProperty('address.type');
    expect(response.body).toHaveProperty('address.coordinates');
    // Verifica se o corpo da resposta é igual ao esperado
  });

  it('Verifica a mensagem padrão caso seja passado um id que não existe', async () => {
    const response = await request(app).get('/getpartnerbyid/9999999'); // Realiza uma requisição GET para a rota /getpartnerbyid/999
    expect(response.status).toBe(200); // Verifica se o status da resposta é 200
    expect(response.type).toBe('application/json'); // Verifica se o tipo da resposta é "application/json"
    expect(response.body).toEqual('Nenhum parceiro com este ID'); // Verifica se o corpo da resposta é igual ao esperado
  });
});
/////
