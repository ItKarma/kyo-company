import UserRepository from "../repository/userRepo.js";
import "dotenv/config";
import { countTotalUsers } from "../utils/fileSearch.js";
import formatNumber from "../utils/formatNumber.js";

class responseMessages {
    /**
     * @param {Number} userID 
     * @returns {Promise}
     * Function for clients no register in database
     */
    async noRegistry(userID) {


        let totalUsers = await countTotalUsers();
        let formatTotal = formatNumber(totalUsers)
        try {
            let user = await UserRepository.findUser(userID.id);

            if (!user) {
                user = await UserRepository.saveUser(userID.first_name, userID.id, userID.username, 0);

            }

            let caption = `<a href="t.me/Kyo_logs">安 </a> » <b>Olá ${user.first_name}, Sou KyoCloud</b>
<a href="t.me/Kyo_logs">↯ </a> » <b>Gostaria de realizar uma consulta?, veio no bot certo!</b>

<a href="t.me/Kyo_logs">↳ </a> [ <b>Nome</b> ] : <b>${user.first_name}</b>
<a href="t.me/Kyo_logs">↳ </a> [ <b>Saldo</b> ] : <b>R$ ${user.balance.toFixed(2)}</b>
<a href="t.me/Kyo_logs">↳ </a> [ <b>Plano</b> ] : <code> ${user.subscription.plan}</code>
<a href="t.me/Kyo_logs">↳ </a> [ <b>Status</b> ] : <code> ${user.subscription.status}</code>

<a href="t.me/Kyo_logs">↳ </a> <b>LOGINS</b>: <code>${formatTotal}</code>
`;
            return caption;

        } catch (error) {
            console.log(error)
        }
    }

    /**
     * @returns {String}
     * Function for clients with register in database
     */
    
    cmds() {
        let caption = `<a href="t.me/Kyo_logs">安 </a> [  <code>/cpf</code>  ] » <i>Faz uma busca dos dados de uma pessoa com o cpf </i>\n<a href="t.me/Kyo_logs">安 </a> [  <code>/pw</code>  ] » <i>Faz uma busca de login/senha pelo domínio/site </i>\n<a href="t.me/Kyo_logs">安 </a> [  <code>/verificar</code> ] » <i>verifica se tem credenciais para sua url em nossa db</i>\n<a href="t.me/Kyo_logs">安 </a> [  <code>/pwd</code> ] » <i>verifica se tem credenciais para um email ou usuario especifico em nossa db</i>`;
        return caption
    }

    async verify(userID, url, result) {

        let totalUsers = await countTotalUsers();
        let formatTotal = formatNumber(totalUsers)


        let user = await UserRepository.findUser(userID.id);
        if (!user) {
            user = await UserRepository.saveUser(userID.first_name, userID.id, userID.username, 0);
            user
        }

        let caption = `<a href="t.me/Kyo_logs">安 </a> » <i>Consulta realizada com sucesso! ✅</i>

<a href="t.me/Kyo_logs">↳ </a> [ <i>URL</i> ] : <i>${url}</i>
<a href="t.me/Kyo_logs">↳ </a>[ <i>QUANTIDADE DE LOGS</i> ] : <i>${result}</i>
<a href="t.me/Kyo_logs">↳ </a>[ <i>SALDO</i> ] : <i>${user.balance.toFixed(2)}</i>
<a href="t.me/Kyo_logs">↳ </a> [ <b>Plano</b> ] : <code> ${user.subscription.plan}</code>
<a href="t.me/Kyo_logs">↳ </a> [ <b>Status</b> ] : <code> ${user.subscription.status}</code>

<a href="t.me/Kyo_logs">↳ </a> <b>LOGINS</b>: <code>${formatTotal}</code>
`;
        return caption;
    }

    async userNotbalance(userID, url) {
        let totalUsers = await countTotalUsers();
        let formatTotal = formatNumber(totalUsers)
        let user = await UserRepository.findUser(userID.id);
        if (!user) {
            user = await UserRepository.saveUser(userID.first_name, userID.id, userID.username, 0);
        }

        let caption = `<a href="t.me/Kyo_logs">安 </a> » <i>Opa amigão é nescessario ter creditos para desfrutar deste comando! favor realize uma recarga!</i>\n
<a href="t.me/Kyo_logs">安 </a> » <i>Chame algum de nossos adm a baixo !!</i>
<a href="t.me/Kyo_logs">安 </a> » <i> @ImKarmax</i>

<a href="t.me/Kyo_logs">↳ </a> [ <i>URL</i> ] : <i>${url}</i>
<a href="t.me/Kyo_logs">↳ </a>[ <i>SALDO</i> ] : <i>${user.balance.toFixed(2)}</i>
<a href="t.me/Kyo_logs">↳ </a> [ <b>Plano</b> ] : <code> ${user.subscription.plan}</code>
<a href="t.me/Kyo_logs">↳ </a> [ <b>Status</b> ] : <code> ${user.subscription.status}</code>

<a href="t.me/Kyo_logs">↳ </a> <b>LOGINS</b>: <code>${formatTotal}</code>

`;
        return caption;
    }

    async pwd(userID, result) {
        let totalUsers = await countTotalUsers();
        let formatTotal = formatNumber(totalUsers)
        let user = await UserRepository.findUser(userID.id);
        if (!user) {
            user = await UserRepository.saveUser(userID.first_name, userID.id, userID.username, 0);
        }

        let caption = `<a href="t.me/Kyo_logs">安 </a> » <i>Consulta realizada com sucesso! ✅</i>

<a href="t.me/Kyo_logs">↳ </a> [ <i>URL</i> ] : <code>${result.url}</code>
<a href="t.me/Kyo_logs">↳ </a> [ <i>USER</i> ] : <code>${result.user}</code>
<a href="t.me/Kyo_logs">↳ </a> [ <i>PASS</i> ] : <code>${result.pass}</code>

<a href="t.me/Kyo_logs">↳ </a> [ <i>SALDO</i> ] : <i>${user.balance.toFixed(2)}</i>
<a href="t.me/Kyo_logs">↳ </a> [ <b>Plano</b> ] : <code> ${user.subscription.plan}</code>
<a href="t.me/Kyo_logs">↳ </a> [ <b>Status</b> ] : <code> ${user.subscription.status}</code>

<a href="t.me/Kyo_logs">↳ </a> <b>LOGINS</b>: <code>${formatTotal}</code>
`;
        return caption;
    }

    async email(userID, total, email) {
        let totalUsers = await countTotalUsers();
        let formatTotal = formatNumber(totalUsers)
        let user = await UserRepository.findUser(userID.id);
        if (!user) {
            user = await UserRepository.saveUser(userID.first_name, userID.id, userID.username, 0);
            user
        }

        let caption = `<a href="t.me/Kyo_logs">安 </a> » <i>Consulta realizada com sucesso! ✅</i>

<a href="t.me/Kyo_logs">↳ </a> [ <i>USER</i> ] : <code>${email}</code>

<a href="t.me/Kyo_logs">↳ </a> [ <i>QUANTIDADE DE LOGS</i> ] : <i>${total}</i>
<a href="t.me/Kyo_logs">↳ </a> [ <i>SALDO</i> ] : <i>${user.balance.toFixed(2)}</i>
<a href="t.me/Kyo_logs">↳ </a> [ <b>Plano</b> ] : <code> ${user.subscription.plan}</code>
<a href="t.me/Kyo_logs">↳ </a> [ <b>Status</b> ] : <code> ${user.subscription.status}</code>

<a href="t.me/Kyo_logs">↳ </a> <b>LOGINS</b>: <code>${formatTotal}</code>
`;
        return caption;
    }

    async faq(userID) {
        let totalUsers = await countTotalUsers();
        let formatTotal = formatNumber(totalUsers);

        let user = await UserRepository.findUser(userID.id);
        if (!user) {
            user = await UserRepository.saveUser(userID.first_name, userID.id, userID.username, 0);
            user
        }

        let caption = `<a href="t.me/Kyo_logs">安 </a> » <i>⚠ PERGUNTAS FREQUENTES!</i>

<a href="t.me/Kyo_logs">↳ </a> [ <i>Sobre o Nosso Bot</i> ]\n<i>Oferecemos um serviço de consulta e para conseguir logins da plataforma que voce preferir! seguro e anônimo por meio de banco de dados privados!.</i>

<a href="t.me/Kyo_logs">↳ </a> [ <i>Como Funciona?</i> ]\n<i>Aperte em comandos para saber mais!.</i>

<a href="t.me/Kyo_logs">↳ </a> [ <i>Termos de Uso</i> ] : <i>Ao usar o bot, você aceita nossos termos. Abusos podem levar a penalidades como bloqueio ou redução de saldo. Não nos responsablizamos por o uso  em atividades ilegais. Reembolsos só são possíveis se o bot tiver algum erro, é nescessario prints sem borrar nada, e não garantimos logins sem segurança, consulte a plataforma da qual voce deseja o login, não garantimos live!.</i>

<a href="t.me/Kyo_logs">↳ </a> <b>LOGINS</b>: <code>${formatTotal}</code>
`;
        return caption;
    }

    async req(userID) {

        let user = await UserRepository.findUser(userID.id);
        if (!user) {
            user = await UserRepository.saveUser(userID.first_name, userID.id, userID.username, 0);
            user
        }

        let caption = `<a href="t.me/Kyo_logs">安 </a> » <i>Olá ${userID.first_name}, nescessita realizar uma recarga?</i>

<a href="t.me/Kyo_logs">安 </a> » <i>Chame nosso adm a baixo !!</i>
<a href="t.me/Kyo_logs">安 </a> » <i> @Im_karmah</i>
<a href="t.me/Kyo_logs">安 </a> » <i> @Yakultzada</i>
`;
        return caption;
    }
};

export default new responseMessages