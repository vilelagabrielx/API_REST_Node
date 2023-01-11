const mysql2 = require('mysql2/promise');

// A classe Database representa uma conexão com o banco de dados MySQL
class Database {
  // O construtor da classe recebe os parâmetros de conexão com o banco de dados: host, usuário, senha e nome do banco de dados
  constructor(host, user, password, database) {
    this.host = host;
    this.user = user;
    this.password = password;
    this.database = database;
  }

  // O método getConnection retorna a conexão com o banco de dados
  async getConnection() {
    // Se a conexão já foi criada, retorna a conexão existente
    if (this.connection) return this.connection;

    // Senão, cria uma nova conexão utilizando os parâmetros de conexão passados no construtor
    this.connection = await mysql2.createPool({
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database
    });

    // Retorna a conexão criada
    return this.connection;
  }
  
  // O método createCoverageAreaTable cria a tabela t_coverageArea no banco de dados, se ela ainda não existir
  async createCoverageAreaTable() {
    // Cria a tabela t_coverageArea no banco de dados, se ela ainda não existir
    const sql = `
      CREATE TABLE IF NOT EXISTS t_coverageArea (
        Id INTEGER AUTO_INCREMENT PRIMARY KEY,
        type TEXT NOT NULL,
        coordinateX TEXT NOT NULL,
        coordinateY TEXT NOT NULL,
        idpartner INTEGER,
        FOREIGN KEY (idpartner) REFERENCES t_partner(Id)
      );
    `;
  
    try {
      // Executa a query e obtém o resultado
      const connection = await this.getConnection();
      const [result] = await connection.query(sql);
  
      console.log('Tabela t_coverageArea criada com sucesso!');
      return result;
    } catch(error) {
      console.error(error);
      throw error;
    }
  }
// -------
  // O método createAddressTable cria a tabela t_address no banco de dados, se ela ainda não existir
  async createAddressTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS t_address ( 
        Id INTEGER AUTO_INCREMENT PRIMARY KEY, 
        type TEXT NOT NULL, coordinateX TEXT NOT NULL, 
        coordinateY TEXT NOT NULL, idpartner INTEGER, 
        FOREIGN KEY (idpartner) REFERENCES t_partner(Id) );` ;
    
    try {
    // Obtém a conexão com o banco de dados
    const connection = await this.getConnection();
    // Executa a query e obtém o resultado
    const [result] = await connection.query(sql);
    console.log('Tabela t_address criada com sucesso!');
    return result;
    } catch(error) {
    console.error(error);
    throw error;
    }
    }
  // ----------------

  // O método createPartnerTable cria a tabela t_partner no banco de dados, se ela ainda não existir
  async createPartnerTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS t_partner ( 
        Id INTEGER AUTO_INCREMENT PRIMARY KEY, 
        tradingName TEXT NOT NULL, 
        ownerName TEXT NOT NULL, 
        document TEXT NOT NULL );` ;
    
    try {
    const connection = await this.getConnection();
    const [result] = await connection.query(sql);
    console.log('Tabela t_partner criada com sucesso!');
    return result;
    } catch (error) {
    console.error(error);
    throw error;
    }
    }

  // O método createPartner insere um novo registro na tabela t_partner
  // O método createPartner insere um novo registro na tabela t_partner
async createPartner(tradingName, ownerName, document) {
  try {
  // Monta a query SQL de inserção de novo parceiro
  const sql = `INSERT INTO t_partner (tradingName, ownerName, document) 
                  VALUES (?, ?, ?)`;
  
  // Executa a query e obtém o resultado
const connection = await this.getConnection();
const [result] = await connection.query(sql, [tradingName, ownerName, document]);

return result;
} catch(error) {
  console.error(error);
  throw error;
  }
  }
// ------------------------
  // O método createCoverageArea insere um novo registro na tabela t_coverageArea
  async createCoverageArea(idpartner,type, coordinateX, coordinateY) {
    // Monta a query SQL de inserção de nova área de cobertura
    const sql = `
      INSERT INTO t_coverageArea (type, coordinateX, coordinateY, idpartner)
      VALUES (?, ?, ?, ?)
    `;
  
    try {
      // Executa a query e obtém o resultado
      const connection = await this.getConnection();
      const [result] = await connection.query(sql, [type, coordinateX, coordinateY, idpartner]);
  
      return result;
    } catch(error) {
      console.error(error);
      throw error;
    }
  }
   // O método createCoverageArea insere um novo registro na tabela t_coverageArea
   async createAdress(idpartner,type, coordinateX, coordinateY) {
    try {
      // Monta a query SQL de inserção de nova área de cobertura
      const sql = `
        INSERT INTO t_address (type, coordinateX, coordinateY, idpartner)
        VALUES (?, ?, ?, ?)
      `;
  
      // Executa a query e obtém o resultado
      const connection = await this.getConnection();
      const [result] = await connection.query(sql, [type, coordinateX, coordinateY, idpartner]);
  
      // Retorna o ID do novo registro criado
      return result.insertId;
    } catch(error) {
      console.error(error);
      throw error;
    }
  }

async getPartnerByDocument(document) {
  // Monta a query SQL de seleção de parceiro pelo documento
  const sql = `
    SELECT *
    FROM t_partner
    WHERE document = ?
  `;

  try {
    // Executa a query e obtém o resultado
    const connection = await this.getConnection();
    const [rows] = await connection.query(sql, [document]);

    // Verifica se o resultado possui algum registro
    if (rows.length > 0) {
      // Caso exista, retorna o objeto com existingPartner: true e os dados do parceiro
      return {
        existingPartner: true,
        partner: rows[0]
      }
    } else {
      // Caso contrário, retorna o objeto com existingPartner: false e dados vazios
      return {
        existingPartner: false,
        partner: {}
      }
    }
  } catch(error) {
    // console.error(error);
    throw error;
  }
}

async getPartnerByID(ID) {
  // Monta a query SQL de seleção de parceiro pelo documento
  const sql = `
  select 
    tradingName ,
    ownerName ,
    document  ,
    tca.type ,
    tca.coordinateX as coverageAreacoordinateX ,
    tca.coordinateY as coverageAreacoordinateY,
    ta.type ,
    ta.coordinateX as addresscoordinateX,
    ta.coordinateY as addresscoordinateY
from t_partner tp 
inner join t_coverageArea tca on
	tp.Id = tca.idpartner 
inner join t_address ta on
	ta.idpartner = tp.Id
  WHERE tp.Id = ?`;

  try {
    // Executa a query e obtém o resultado
    const connection = await this.getConnection();
    const [rows, fields]  = await connection.query(sql,[ID]);

    // RETORNA O JSON
    if (rows.length > 0) {
      const data = {
        "id":ID, 
        "tradingName": rows[0].tradingName,
        "ownerName": rows[0].ownerName,
        "document": rows[0].document,
        "coverageArea": { 
          "type": rows[0].coverageAreaType, 
          "coordinates": [[[rows[0].coverageAreacoordinateX, rows[0].coverageAreacoordinateY]]]
        },
        "address": { 
          "type": rows[0].addressType,
          "coordinates": [rows[0].addresscoordinateX, rows[0].addresscoordinateY]
        }
      }
      return data
    }
    else{

    return false

    }
   
  } catch(error) {
    // console.error(error);
    throw error;
  }
}





}

module.exports = Database;