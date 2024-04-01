import { Context } from 'grammy'

class Error {
    constructor(){
     this.context = new Context()
    }
    erroInternal(){
        this.context.reply('Ocorreu um Error Interno , favor report dev @kyokiOne')
    }
}

export default new Error