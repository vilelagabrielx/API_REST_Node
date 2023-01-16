const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const Database = require('../../models/database'); // Importa o módulo de banco de dados
const moment = require('moment');
require('dotenv').config({ path: './config/.env' });
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const database = process.env.DB_NAME;

let now = moment();

let date = now.format('dd/mm/yyyy hh:mm:ss');

const logger = winston.createLogger({
    level: 'info', //nivel de log

    transports: [

    new winston.transports.Console(), // cria uma nova instância de 
                                      //um transporte de log para o winston, 
                                                                        //especificamente um transporte de log para a consola (terminal). Isso significa que, quando o logger é usado para gravar mensagens, as mensagens serão exibidas na consola (terminal) também


// é necessário instanciar o módulo winston e o DailyRotateFile juntos para que o 
//winston possa utilizar as funcionalidades do DailyRotateFile para rotacionar os arquivos de 
//log diariamente.
                             
  new DailyRotateFile({

                        filename: 'log-%DATE%.txt',
                        datePattern: 'YYYY-MM-DD',
                        maxSize: '20m',
                        maxFiles: '1d',
                        dirname: 'logs',
                        zippedArchive: true,
                        maxDays: '14d'


}
  )
              ]
});
// Cria uma instância do banco de dados e tenta estabelecer uma conexão

const db = new Database(
                          host, 
                          user, 
                          password, 
                          database
                        );
(async () => {

  //INICIO DO BLOQUE QUE É EXECUTADO ASSIM QUE O MODULO É IMPORTADO

  try {//Inicio da estrutura trycatch mais abrangente
    
          try {

                await db.getConnection();

              } catch (Error) {

                                date = now.format('dd/mm/yyyy hh:mm:ss');

                                logger.info(`${date} - Erro ao conectar no banco de dados - ${Error}`);
                  
                              }
        
        try {
            
              await db.createPartnerTable(true);

            } catch (Error) {
                              date = now.format('dd/mm/yyyy hh:mm:ss');
                              logger.info(`${date} -Erro ao criar tabela de parceiros - ${Error}`);
                            }
        
        try {
                  await db.createCoverageAreaTable(true);
            } catch (Error) {
                              date = now.format('dd/mm/yyyy hh:mm:ss');
                              logger.info(`${date} -Erro ao criar tabela de áreas de cobertura - ${Error}`);
                            }
        
        try {
                  await db.createAddressTable(true); 
            } catch (Error) {
                            date = now.format('dd/mm/yyyy hh:mm:ss');
                            logger.info(`${date} - Erro ao criar tabela de endereços - ${Error}`);
                            }
        
        try {
                  await db.createAddressTable(true); 
            } catch (Error) {
                        date = now.format('dd/mm/yyyy hh:mm:ss');
                        logger.info(`${date} - Erro ao criar tabela de endereços - ${Error}`);
                            }
      try {
       
            await db.createUpdateProcedure(true); 

      } catch (Error) {
                        if(Error.message == 'PROCEDURE sp_atualiza_partner already exists'){
                            //NÃO FAZ NADA.
                           console.log(Error)
                        }
                        else{
                              date = now.format('dd/mm/yyyy hh:mm:ss');
                              logger.info(`${date} - Erro ao criar procedure de update das tabelas - ${Error}`);
                            }
        
                      }

   //Fim da estrutura trycatch mais abrangente       
  } catch (Error) {
                    date = now.format('dd/mm/yyyy hh:mm:ss');
                    logger.info(`${date} - Controller/partner.js - Erro ao executar operações iniciais no banco de dados - ${Error}`)
                  } finally {
                    if (db.connection) {

                          await db.connection.end(); //Quando a operação é finalizada, encerra a 
                                                    //conexão com o banco de dados.
                      
                                       }
                else{
                      const now = moment();
                          
                            // Formata a data e hora atual como uma string no formato "dd/mm/yyyy hh:mm:ss"
                            date = now.format('dd/mm/yyyy hh:mm:ss');
                          
                      logger.info(`${date} - Controller/partner.js - Erro ao se conectar no banco de dados - ${Error}`)
                    }
                            }
})();//FIM DO BLOQUE QUE É EXECUTADO ASSIM QUE A CLASSE É IMPORTADA

class Partner 
{

      constructor(tradingName, ownerName, document,coverageArea,address) {
        this.tradingName = tradingName;
        this.ownerName = ownerName;
        this.document = document;
        this.coverageArea = coverageArea;
        this.address =address;
                                                                          }
      async savePartner() 
      {
        
            try {
                
                    await db.createPool();
                    await db.getConnection();
                    
                    // Verifica se já existe um parceiro com o mesmo documento
                    const existingPartner = await db.getPartnerByDocument(this.document);
                    if (existingPartner.existingPartner == true) {
                            throw new Error(`Já existe um parceiro com o documento ${this.document}`);
                                                                }
                    else{
                          // Insere o novo parceiro
                          const partnerResult = await db.createPartner(this.tradingName, this.ownerName,  this.document);
                          const partnerId = partnerResult.insertId;

                          const coordinates = this.coverageArea.coordinates
                        
                          await db.createCoverageArea(partnerId, this.coverageArea.type,  JSON.stringify(this.coverageArea));
                          
                          // Insere o parceiro na tabela t_adress
                          
                          await db.createAdress(partnerId,this.address.type, JSON.stringify(this.address.coordinates[0]), JSON.stringify(this.address.coordinates[1]));
                          // Retorna o status 201 (Created)
                          return 201
                        }
                } catch (Error) {
              // Formata a data e hora atual como uma string no formato "dd/mm/yyyy hh:mm:ss"
              const now = moment();
              date = now.format('dd/mm/yyyy hh:mm:ss');
          
              // Registra o erro no arquivo de log
              logger.info(`${date} - Controller/partner.js - Erro ao inserir um novo parter - ${Error}`);
          
              // Retorna a mensagem de erro
              return Error.message;
            }
      }

}
module.exports = Partner;