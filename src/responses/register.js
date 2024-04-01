import { bold, fmt } from "@grammyjs/parse-mode";

 class registerResponse {
    /**
     * @param {String} username 
     * @returns {FormattedString}
     * Function for clients no register in database
     */
    noRegistry(username){
        return fmt`${bold(fmt`Olá @${username} salvando seus dados agora .!
        Link do meu canal abaixo `)}`;
    }

    /**
     * @param {String} username 
     * @returns {FormattedString}
     * Function for clients with register in database
     */
    withRegistry(username){
       return fmt`${bold(fmt`Olá @${username} Você ja esta em minha base de dados
  
        Link do meu canal abaixo `)}`
    }
};

export default   new registerResponse