# API Rest em NodeJS
Como parte de meus estudos, desenvolvi uma API RESTful em Node.js que utiliza MySQL como banco de dados.

Este desafio foi proposto no repositório [ZXVentures/ze-code-challenges](https://github.com/ZXVentures/ze-code-challenges/blob/master/backend.md) e me permitiu aprimorar diversas habilidades.

## DESCRIÇÃO

No desafio citado, foi proposta a criação de um serviço que disponibilize uma API REST ou GraphQL que implemente as seguintes funcionalidas:
  
    -Criação de novos usuários em uma base de dados.
  
    -Carregamento de um usuário pelo id.
  
    -Busca do usuário mais próximo que tenham área de atuação no ponto enviado, pelas coordenadas deste ponto.
  
 Alem das funcionalidades propostas, adicionei a possibilidade de deleção e atualização de um usuário.
 
## FUNCIONALIDADES

- Busca de usuários por ID - Quando é feita uma requisição do tipo *GET* na rota ***/getpartnerbyid*** passando o ID do usuário, os dados do mesmo,caso existam, serão retornados em um JSON.
  - Exemplo de Request para obter dados de um usuário de ID 1 : ***http://localhost:3000/getpartnerbyID/1***
  
- Formato do JSON obtido:
       
```json
{
  "id": 1, 
  "tradingName": "Adega da Cerveja - Pinheiros",
  "ownerName": "Zé da Silva",
  "document": "1432132123891/0001",
  "coverageArea": { 
    "type": "MultiPolygon", 
    "coordinates": [
      [[[30, 20], [45, 40], [10, 40], [30, 20]]], 
      [[[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]]
    ]
  },
  "address": { 
    "type": "Point",
    "coordinates": [-46.57421, -21.785741]
  }
}
```

- Criação, atualização e exclusão de usuários.
    
    - Para exclusão de um usuário específico, é necessário realizar uma requisição do tipo *GET* na rota ***/deleteapartner*** passando o ID do mesmo.
       - Exemplo de Request para deleção de um usuário de ID 1 : ***http://localhost:3000/deleteapartner/1***
    - Para criação, basta realizar uma requisição *POST* à aplicação na seguinte rota: ***/createapartner*** e no corpo da requisição, 
    é necessário que um JSON no formato à seguir seja enviado. 
    
        ***PONTOS IMPORTANTES***:
       - As coordenadas da ***coverageArea*** precisam ser um MultiPolygon válido respeitando o formato GeoJSON MultiPolygon (https://en.wikipedia.org/wiki/GeoJSON)
       - As coordenadas do ***address*** precisam ser um Ponto válido respeitando o formato GeoJSON Point (https://en.wikipedia.org/wiki/GeoJSON)
       - A chave ***document*** é chave única, desta forma, não podem existir 2 usuários com o mesmo document no banco de dados.

```json
{
  "id": 1, 
  "tradingName": "cervejas",
  "ownerName": "Zé da Silva",
  "document": "1432132123891/0001",
  "coverageArea": { 
    "type": "MultiPolygon", 
    "coordinates": [
      [[[30, 20], [45, 40], [10, 40], [30, 20]]], 
      [[[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]]
    ]
  },
  "address": { 
    "type": "Point",
    "coordinates": [-46.57421, -21.785741]
  }
}
```   
   - Para atualização, é necessário realizar uma requisição do tipo *POST* na rota ***/updatepartner*** passando o ID do mesmo. No corpo da requisição, 
    é necessário que um JSON com todas as colunas *COM EXCEÇÃO DA COLUNA ID, QUE SERÁ PASSADO NA REQUISIÇÃO*, incluindo as que não serão modificadas, seja enviado respeitando todas as regras anteriores.
      - Exemplo de Request para Atualização dados de um usuário de ID 1 : ***http://localhost:3000/updatepartner/1***
 ```json
 {
  "tradingName": "cervejas",
  "ownerName": "teste",
  "document": "40028922",
  "coverageArea": { 
    "type": "MultiPolygon", 
    "coordinates": [
        
    
      [ [
            [
              -43.70807012320802,
              -22.635060152555525
            ],
            [
              -43.680926754499666,
              -22.636565072818087
            ],
            [
              -43.695409610781354,
              -22.61204165978151
            ],
            [
              -43.70807012320802,
              -22.635060152555525
            ]
          ]],
      [[
            [
              -43.701739865845184,
              -22.617265424837953
            ],
            [
              -43.72495080107814,
              -22.60584371513221
            ],
            [
              -43.72159384763509,
              -22.630102648431688
            ],
            [
              -43.701739865845184,
              -22.617265424837953
            ]
          ]]
    ]
  },
  "address": { 
    "type": "Point",
    "coordinates": [-43.698233379914444, -22.627960730496646]
  }
}

```
    
- Busca do usuário próximos de um ponto(LATITUDE E LONGITUDE)
  - Para realizar a busca do usuário mais próximo de um ponto, é necessário realizar uma requisição do tipo *POST* na rota ***/getNearestPartnerByCOORDENATES***. No corpo da requisição, é necessário que um JSON no seguinte formato seja enviado, onde "X" é a latitude e "Y" é a longitude:
```json
{
 "X": "-22.628472435058594",
 "Y" : "-43.69745198889389"
}

```
  - Caso algum usuário tenha o ponto específico como área de cobertura, um JSON no seguinte formato é retornado:
```json
{
    "id": 2,
    "tradingName": "Adega da Cerveja - Pinheiros",
    "ownerName": "Fausto Silva",
    "document": "14a3203323a7aa13a83d93aa114a112aaaa/a0aa00s1",
    "coverageArea": {
        "type": "MultiPolygon",
        "coordinates": [
            [
                [
                    [
                        -43.70807012320802,
                        -22.635060152555525
                    ],
                    [
                        -43.680926754499666,
                        -22.636565072818087
                    ],
                    [
                        -43.695409610781354,
                        -22.61204165978151
                    ],
                    [
                        -43.70807012320802,
                        -22.635060152555525
                    ]
                ]
            ],
            [
                [
                    [
                        -43.701739865845184,
                        -22.617265424837953
                    ],
                    [
                        -43.72495080107814,
                        -22.60584371513221
                    ],
                    [
                        -43.72159384763509,
                        -22.630102648431688
                    ],
                    [
                        -43.701739865845184,
                        -22.617265424837953
                    ]
                ]
            ]
        ]
    },
    "address": {
        "type": "Point",
        "coordinates": [
            "-43.698233379912004",
            "-22.627960730496646"
        ]
    },
    "distance": {
        "Kilometers": 0.015434332038764376,
        "Meters": 15.434332038764376,
        "Earth radius considered(Meters)": 6371
    }
}
```

## INSTALAÇÃO

- Passo 1: Certifique-se que o NodeJS e o npm estão instalados. A versão do NodeJS utilizada neste projeto foi a v19.2.0 e a do npm 8.19.3.

- Passo 2: Clone este repositório.

- Passo 3: Instale as dependencias usando o comando "npm install".

- passo 4: Renomeie o arquivo ".env_exemplo",que se encontra na pasta "config", para ".env".

- passo 5: Coloque, no arquivo ".env" que está na pasta "config", as informações do banco de dados Mysql. A versão do MySQL utilizada neste projeto foi a 5.7.40.

- Passo 6: Abra o terminal no diretório da aplicação e execute o comando "npm start".

As tabelas e procedures necessárias para a execução da API serão criadas automaticamente.

## Testes unitários

Para implementação dos testes unitários, foi utilizada a biblioteca *Jest*. 

Para funcionalidade dos testes, a aplicação precisa ter sido executado no mínimo uma vez. Para execução de um teste específico, é necessário que o código do mesmo seja executado no terminal, no diretório em que foi feita a instalação da API. Abaixo, os codigos para cada um dos testes.

- ***npx jest partner_get.teste.js [ID]***: Teste da rota getpartnerbyid. Um ID válido de um usuário que está cadastrado no banco de dados da aplicação deve ser passado como argumento na execução. A seguir, exemplo de execução para o id 2

```
npx jest partner_get.teste.js 2
```  

- ***npx jest npx jest partner_create.teste.js [DOCUMENTO]***: Teste da rota createapartner. Uma string, aqui chamada de documento, deve ser passado como argumento na execução. A seguir, exemplo de execução para o documento 71891633600. Após a execução, um usuário será inserido no banco com o documento passado.

```
npx jest partner_create.teste.js 71891633600
```  
- ***npx jest partner_delete.teste.js [ID]***: Teste da rota deleteapartner. É necessário que o ID seja um ID válido de um usuário que está cadastrado no banco de dados da aplicação. A seguir, exemplo de execução para o id 2

```
npx jest partner_delete.teste.js 2
```  

- ***npx jest partner_getByCoord.teste [LATITUDE] [LONGITUDE]***: Teste da rota getnearestpartnerbycoordenates. Uma ponto válido de latitude e longitude deve ser passado, e é necessário que tenha um usuário cadastrado que tenha como área de cobertura o ponto passado. A seguir, exemplo de execução para o ponto -22.612008303216015 -43.70870182068599

```
npx jest partner_getByCoord.teste -22.612008303216015 -43.70870182068599
```  

- ***npx jest partner_update.teste.js  [ID]***: Teste da rota updatepartner.  É necessário que o ID seja um ID válido de um usuário que está cadastrado no banco de dados da aplicação. A seguir, exemplo de execução para o id 2

```
npx jest partner_update.teste.js 2
```  


