const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const Database = require('../models/database'); // Importa o módulo de banco de dados
const moment = require('moment');
require('dotenv').config({ path: './config/.env' });
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const database = process.env.DB_NAME;

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: 'log-%DATE%.txt',
      datePattern: 'YYYY-MM-DD'
    })
  ]
});
// Cria uma instância do banco de dados e tenta estabelecer uma conexão
// console.log(host)
const db = new Database(
                          host, 
                          user, 
                          password, 
                          database
                        );
(async () => {
  try {         
        db.getConnection()              
        db.createPartnerTable(true);        //Tenta criar as tabelas no banco de dados. 
        db.createCoverageAreaTable(true);  
        db.createAddressTable(true);       
   
  } catch (Error) {
    logger.info(`Controller/partner.js - Erro ao executar operações iniciais no banco de dados - ${Error}`)
  } finally {
    if (db.connection) {
  await db.connection.destroy();; //Quando a operação é finalizada, encerra a conexão com o banco de dados.
}
else{
  const now = moment();
      
        // Formata a data e hora atual como uma string no formato "dd/mm/yyyy hh:mm:ss"
        const date = now.format('dd/mm/yyyy hh:mm:ss');
      
  logger.info(`${date} - Controller/partner.js - Erro ao se conectar no banco de dados - ${Error}`)
}
  }
})();

class Partner {

  constructor(tradingName, ownerName, document,coverageArea,address) {
    this.tradingName = tradingName;
    this.ownerName = ownerName;
    this.document = document;
    this.coverageArea = coverageArea;
    this.address =address;
  }
  async savePartner() {
    try {
      db.getConnection();
  
      // Verifica se já existe um parceiro com o mesmo documento
      const existingPartner = await db.getPartnerByDocument(this.document);
      if (existingPartner == true) {
        throw new Error(`Já existe um parceiro com o documento ${this.document}`);
      }
  
      // Insere o novo parceiro
      const partnerResult = await db.createPartner(this.tradingName, this.ownerName,  this.document);
      const partnerId = partnerResult.insertId;
      
      // Insere o parceiro na tabela t_coverageArea
      await db.createCoverageArea(partnerId, this.coverageArea.type, JSON.stringify(this.coverageArea.coordinates[0]), JSON.stringify(this.coverageArea.coordinates[1]));
  
      // Retorna o status 201 (Created)
      return '201';
    } catch (Error) {
      // Formata a data e hora atual como uma string no formato "dd/mm/yyyy hh:mm:ss"
      const now = moment();
      const date = now.format('dd/mm/yyyy hh:mm:ss');
  
      // Registra o erro no arquivo de log
      logger.info(`${date} - Controller/partner.js - Erro ao inserir um novo parter - ${Error}`);
  
      // Retorna a mensagem de erro
      return Error.message;
    }
  }

}
module.exports = Partner;