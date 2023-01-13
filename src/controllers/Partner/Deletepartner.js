const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const Database = require('../../models/database'); // Importa o módulo de banco de dados
const moment = require('moment');
require('dotenv').config({ path: './config/.env' });
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const database = process.env.DB_NAME;

const logger = winston.createLogger
(
    {
      level: 'info', //nivel de log

      transports: 
      [

        new winston.transports.Console(), // cria uma nova instância de 
                                          //um transporte de log para o winston, 
                                          //especificamente um transporte de log para a consola (terminal). Isso significa que, quando o logger é usado para gravar mensagens, as mensagens serão exibidas na consola (terminal) também


      // é necessário instanciar o módulo winston e o DailyRotateFile juntos para que o 
      //winston possa utilizar as funcionalidades do DailyRotateFile para rotacionar os arquivos de 
      //log diariamente.
                                  
        new DailyRotateFile(
            {
            filename: 'log-%DATE%.txt',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '1d',
            dirname: 'logs',
            zippedArchive: true,
            maxDays: '1d'
            }
                          )
    ]
  }
);

const db = new Database
  (
      host, 
      user, 
      password, 
      database
  );

class Partner 
  {
      constructor(ID=null) 
        {
            this.ID = ID;
        }
      
      async DeletePartnerByID(ID)
          {
            try 
              {
                  db.getConnection();

                  // Faz a busca no banco do parceiro por ID
                  const rows = await db.DeletePartnerByID(ID);
              
                  return rows
              } catch (Error) 
                {
                    // Formata a data e hora atual como uma string no formato "dd/mm/yyyy hh:mm:ss"
                    const now = moment();
                    const date = now.format('dd/mm/yyyy hh:mm:ss');

                    // Registra o erro no arquivo de log
                    logger.info(`${date} - Controller/partner.js - Erro ao procurar parceiro - ${Error}`);

                    // Retorna a mensagem de erro
                    return Error.message;
                }
          }
      async getNearestPartnerByCOORDENATES(X,Y)
        {
          try 
            {
                  
                  db.getConnection();
          
                  // Faz a busca no banco do parceiro por ID
                  const Partner = await db.getNearestPartnerByCOORDENATES(X,Y);
                  if (Partner != false) 
                    {
                      return Partner
                    }
                  else
                  { 
                    return false
                  }
            } catch (Error) 
              {
                  // Formata a data e hora atual como uma string no formato "dd/mm/yyyy hh:mm:ss"
                  const now = moment();
                  const date = now.format('dd/mm/yyyy hh:mm:ss');
          
                  // Registra o erro no arquivo de log
                  logger.info(`${date} - Controller/partner.js - Erro ao procurar parceiro mais proximo - ${Error}`);
          
                  // Retorna a mensagem de erro
                  return Error.message;
              }

        }
  }
module.exports = Partner;