# REST API usando NodeJS
Como parte de meus estudos, desenvolvi uma API REST baseada em Node.js e utilizando MySQL como banco de dados.
Este desafio foi proposto no repositório [ZXVentures/ze-code-challenges](https://github.com/ZXVentures/ze-code-challenges/blob/master/backend.md) e me permitiu aprimorar diversas habilidades.

A API oferece as seguintes funcionalidades:
- Pesquisa de usuários por ID - Quando é feita uma requisição do tipo *GET* na rota ***/getpartnerbyID*** passando o ID do usuário, os dados do mesmo são retornados em um JSON.
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
