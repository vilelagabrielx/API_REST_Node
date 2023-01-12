# REST API usando NodeJS
Como parte de meus estudos, desenvolvi uma API REST baseada em Node.js e utilizando MySQL como banco de dados.
Este desafio foi proposto no repositório [ZXVentures/ze-code-challenges](https://github.com/ZXVentures/ze-code-challenges/blob/master/backend.md) e me permitiu aprimorar diversas habilidades.

## FUNCIONALIDADES

A API oferece as seguintes funcionalidades:
- Pesquisa de usuários por ID - Quando é feita uma requisição do tipo *GET* na rota ***/getpartnerbyID*** passando o ID do usuário, os dados do mesmo são retornados em um JSON.
  - Exemplo de Request para obter dados de um usuário de ID 1 : ***http://localhost:3000/getpartnerbyid/1***
  
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
    - Para criação, basta realizar uma requisição *POST* à aplicação na seguinte rota : ***/createapartner*** e no corpo da requisição, 
    é necessário que um JSON no formato à seguir seja passado. 
    
        ***PONTOS IMPORTANTES***:
       - As coordenadas da ***coverageArea*** precisam ser um MultiPolygon válido respeitando o formato GeoJSON MultiPolygon (https://en.wikipedia.org/wiki/GeoJSON)
       - As coordenadas do ***address*** precisam ser um Ponto válido respeitando o formato GeoJSON Point (https://en.wikipedia.org/wiki/GeoJSON)
       - A coluna ***document*** é chave única, desta forma, não podem existir 2 parceiros com o mesmo document no banco de dados.

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
   - Para atualização, é necessário realizar uma requisição do tipo *POST* na rota ***/updatePartner*** passando o ID do mesmo. No corpo da requisição, 
    é necessário que um JSON com todas as colunas, incluindo as que não serão modificadas seja passado, respeitando todas as regras anteriores.
      - Exemplo de Request para Atualização dados de um usuário de ID 1 : ***http://localhost:3000/updatePartner/1***
    
- Busca de parceiros próximos de um ponto(LATITUDE E LONGITUDE)
  - Para realizar a busca de parceiro próximos de um ponto, é necessário realizar uma requisição do tipo *GET* na rota ***/getnearestpartnerbycoordenates***. No corpo da requisição, é necessário que um JSON no seguinte formato seja passado, onde "X" é a latitude e "Y" é a longitude:
```json
{
 "X": "-22.628472435058594",
 "Y" : "-43.69745198889389"
}

```
  - Caso algum parceira tenha o ponto específico como área de cobertura, um JSON no seguinte formato é retornado:
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
