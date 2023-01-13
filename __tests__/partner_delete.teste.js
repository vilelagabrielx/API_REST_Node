const request = require('supertest'); // Importa o pacote supertest para simular requisições HTTP

const express = require('express'); // Importa o express para criar uma instância do servidor

const router = require('../src/routes/partner'); // Importa o arquivo de rotas

const app = express(); // Cria uma instância do express

app.use(express.json());

app.use(router); // Usa o arquivo de rotas importado para as rotas da aplicação
///
const ID = process.argv[3]

//TESTE DA ROTA de DELETE
describe('GET /deleteapartner/:id', () => 

    { // Descrição do teste

      it('Verifica se o parceiro foi apagado', async () => 
                            
            { // Descrição do comportamento esperado do teste

                const response = await request(app).get(`/deleteapartner/${ID}`); // Realiza uma requisição GET para a rota /getpartnerbyid/1
                expect(response.body).toEqual('1 parceiro removidos')
                expect(response.status).toBe(200); // Verifica se o status da resposta é 200
              // Verifica se o corpo da resposta é igual ao esperado
            }
        );

      it('Verifica a mensagem padrão caso seja passado um id que não existe', async () => 
            {
              const response = await request(app).get('/deleteapartner/9999999'); // Realiza uma requisição GET para a rota /getpartnerbyid/999
              expect(response.status).toBe(200); // Verifica se o status da resposta é 200
              expect(response.type).toBe('application/json'); // Verifica se o tipo da resposta é "application/json"
              expect(response.body).toEqual('Nenhum parceiro com este ID'); // Verifica se o corpo da resposta é igual ao esperado
            }
         );
    }
);
/////