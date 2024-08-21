import "dotenv/config";
import bot from "./bot.js";
import { hydrateReply } from "@grammyjs/parse-mode";
import responseMessages from "./responses/response.js";
import UserRepository from "./repository/userRepo.js";
import createGift from "./utils/gift_utils.js";
import changebalance from "./utils/balanChange.js";
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import fetchDownloadLink from './utils/fetchDownloadLink.js'
import { countUsersForUrl, countUsersByUsername, getResults, getAllResults, countTotalUsers } from './utils/fileSearch.js';
import fss from 'fs/promises';
import { InputFile } from "grammy";
import chalk from "chalk";
import importAllFiles from "./utils/convertDb.js";
bot.use(hydrateReply);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let coisasUrl = ''

bot.command("start", async (ctx) => {
  try {
    const user = ctx.update.message.from;
    console.log(chalk.green(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username}`));
    let caption = await responseMessages.noRegistry(user);

    await ctx.reply(caption, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '[↯] COMANDOS', callback_data: 'cmds' }],
          [{ text: '[↯] RECARREGAR', callback_data: 'req' }],
          [{ text: '[↯] SUPORTE', url: 'https://t.me/Im_karmah' },
          { text: '[↯] AJUDA', callback_data: 'FAQ' }
          ],
        ]
      },
      parse_mode: 'HTML'
    });

    console.log(chalk.yellow(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username} SUCCESSE`));
  } catch (error) {
    await bot.api.sendMessage(5248583156, `<a href="t.me/Kyo_logs">↳ </a> <i>ERRO INESPERADO </i>\n<i>COMANDO: start</i>\n<i>ERROR</i><code>${error}</code>`, {
      parse_mode: "HTML"
    });
  }
});

bot.command("convert", async (ctx) => {
  try {
      const user = ctx.update.message.from;
      console.log(chalk.green(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username}`));
      await importAllFiles();
      let totalUsers = await countTotalUsers(); 
      await ctx.reply(`<i>UPLOAD DE USUARIOS REALIZADO COM SUCESSO !✅</i> \n <i> USUARIOS </i> : <code>${totalUsers}</code>`, {
          reply_markup: {
              inline_keyboard: [
                  [{ text: '[↯] COMANDOS', callback_data: 'cmds' }],
                  [{ text: '[↯] RECARREGAR', callback_data: 'req' }],
                  [{ text: '[↯] SUPORTE', url: 'https://t.me/Im_karmah' },
                  { text: '[↯] AJUDA', callback_data: 'FAQ' }],
              ]
          },
          parse_mode: 'HTML'
      });

      console.log(chalk.yellow(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username} SUCCESSE`));
  } catch (error) {
      await bot.api.sendMessage(5248583156, `<a href="t.me/Kyo_logs">↳ </a> <i>ERRO INESPERADO </i>\n<i>COMANDO: convert</i>\n<i>ERROR</i><code>${error.message}</code>`, {
          parse_mode: "HTML"
      });
  }
});

bot.command("plan", async (ctx) => {
  console.log(chalk.green(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username}`));
  const user = ctx.update.message.from;
  let textId = ctx.match;
  let planAndIdUser = textId.split("|");

  try {

    const user1 = await UserRepository.findUser(user.id);

    if (!user1.isAdmin) {
      await ctx.reply(`<b>Para usar este comando é nescessario ser administrador ou dono</b> `, { parse_mode: "HTML" });
      return
    };

    if (planAndIdUser[0] == '' || planAndIdUser[1] == '') {
      await ctx.reply(`<b>Para usar este comando é nescessario enviar o id do cliente e o plano</b>\n <b>Ex</b>: <code>/plan ID|(Basic ou PLus ou Premiun)</code>`, { parse_mode: "HTML" });
      return
    }

    let userVip = await UserRepository.upgradeUserSubscription(planAndIdUser[0], planAndIdUser[1]);

    await ctx.reply(`<b> @${userVip.username} Assinou o Plano ${userVip.subscription.plan} 🎉✅</b>`, {
      parse_mode: 'HTML'
    });

    console.log(chalk.yellow(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username} SUCCESSE`));

  } catch (error) {
    console.log(error)
    await bot.api.sendMessage(5248583156, `<a href="t.me/Kyo_logs">↳ </a> <i>ERRO INESPERADO ACONTECEU COM O @${user.username}</i>\n<i>COMANDO: start</i>\n<i>ERROR</i><code>${error}</code>`, {
      parse_mode: "HTML"
    });
  }
});

bot.on('callback_query:data', async ctx => {
  try {
    const callbackData = ctx.callbackQuery.data;
    if (callbackData == 'cmds') {

      let caption = responseMessages.cmds()

      return await ctx.editMessageText(caption, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '[↯] VOLTAR', callback_data: 'start' },
              { text: '[↯] SUPORTE', url: 'https://t.me/Im_karmah' }

            ],
            [{ text: '[↯] AJUDA', callback_data: 'FAQ' }],
          ]
        },
        parse_mode: 'HTML'
      });
    } else if (callbackData == 'start') {
      let user = ctx.callbackQuery.from;
      let caption = await responseMessages.noRegistry(user);

      return await ctx.editMessageText(caption, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '[↯] COMANDOS', callback_data: 'cmds' },],
            [{ text: '[↯] RECARREGAR', callback_data: 'req' }],
            [{ text: '[↯] SUPORTE', url: 'https://t.me/Im_karmah' },
            { text: '[↯] AJUDA', callback_data: 'FAQ' }
            ],
          ]
        },
        parse_mode: 'HTML'
      });
    } else if (callbackData == 'FAQ') {
      let user = ctx.callbackQuery.from;
      let caption = await responseMessages.faq(user);

      return await ctx.editMessageText(caption, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '[↯] COMANDOS', callback_data: 'cmds' },],
            [{ text: '[↯] SUPORTE', url: 'https://t.me/Im_karmah' }],
          ]
        },
        parse_mode: 'HTML'
      });
    } else if (callbackData == 'req') {
      let user = ctx.callbackQuery.from;
      let caption = await responseMessages.req(user);

      return await ctx.editMessageText(caption, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '[↯] COMANDOS', callback_data: 'cmds' },],
            [{ text: '[↯] SUPORTE', url: 'https://t.me/Im_karmah' }],
          ]
        },
        parse_mode: 'HTML'
      });
    } else if (callbackData == 'pwd') {


      let user = ctx.callbackQuery.from;

      try {
        const User = await UserRepository.findUser(user.id);

        if (!User) {
          await ctx.reply("Você não tem registro em meu sistema, envie /start");
          return;
        }

        if (User.subscription.plan.includes("Free")) {
          await ctx.reply("è nescessario ter uma assinatura ativa!");
        }


        const isExpired = User.isSubscriptionExpired();

        if (isExpired) {
          console.log('A assinatura do usuário expirou.');
          let caption = await responseMessages.userNotbalance(user, coisasUrl);

          await ctx.reply(caption, {
            reply_markup: {
              inline_keyboard: [
                [{ text: 'COMANDOS', callback_data: 'cmds' }],
                [{ text: 'SUPORTE', url: 'https://t.me/Im_karmah' }],
              ]
            },
            parse_mode: 'HTML'
          });
          return;
        }

        if (User.balance == 0) {
          let caption = await responseMessages.userNotbalance(user, coisasUrl);

          await ctx.reply(caption, {
            reply_markup: {
              inline_keyboard: [
                [{ text: 'COMANDOS', callback_data: 'cmds' }],
                [{ text: 'SUPORTE', url: 'https://t.me/Im_karmah' }],
              ]
            },
            parse_mode: 'HTML'
          });
          return;
        }


        let result = await getResults(coisasUrl);

        if (!result) {
          await ctx.reply('Nenhum resultado encontrado para a URL fornecida.');
          return;
        }


        let caption = await responseMessages.pwd(user, result);


        await changebalance(User, 0.10);

        await ctx.reply(caption, { parse_mode: "HTML" });

      } catch (error) {
        console.log(error);
        await bot.api.sendMessage(5248583156, `<a href="t.me/Kyo_logs">↳ </a> <i>ERRO INESPERADO ACONTECEU COM O @${user.username}</i>\n<i>COMANDO: PWD</i>\n<i>ERROR :</i> \n<code>${error}</code>`, {
          parse_mode: "HTML"
        });
      }
    }

  } catch (error) {
    console.log(error);
    await bot.api.sendMessage(5248583156, `<a href="t.me/Kyo_logs">↳ </a> <i>ERRO INESPERADO </i>\n<i>COMANDO: CALLBACK-DATA</i>\n<i>ERROR</i><code>${error}</code>`, {
      parse_mode: "HTML"
    });
  }
})

bot.command("gift", async (ctx) => {
  const amount = ctx.match;
  const { id, username } = ctx.update.message.from;

  try {

    console.log(chalk.green(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username}`));

    const user = await UserRepository.findUser(id);

    if (!user) {
      await ctx.reply("è nescessario esta registrado , por favor use o comando /start");
    }

    if (!amount) {
      return await ctx.reply(`Por favor passe o valor do gift`);
    }

    if (!user.isAdmin)
      return ctx.reply(`Usuario não é um adm para usar este comando`);

    let createdGift = await createGift(amount, user._id);

    await ctx.reply(caption, {
      parse_mode: "HTML"
    });

    console.log(chalk.yellow(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username} SUCCESSE`));

  } catch (error) {
    console.log(error)
    await bot.api.sendMessage(5248583156, `<a href="t.me/Kyo_logs">↳ </a> <i>ERRO INESPERADO ACONTECEU COM O @${username}</i>\n<i>COMANDO: GIFT</i>\n<i>ERROR</i><code>${error}</code>`, {
      parse_mode: "HTML"
    });
  }
});

bot.command("resgatar", async (ctx) => {
  const giftCode = ctx.match;
  const userctx = ctx.update.message.from;

  try {
    console.log(chalk.green(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username}`));
    const user = await UserRepository.findUser(userctx.id);

    if (!user) {
      await ctx.reply("è nescessario esta registrado , por favor use o comando /start");
      return
    }

    let validGift = await UserRepository.GiftValid(giftCode);

    if (!validGift) {
      await ctx.reply("gift não é valido!");
      return
    }

    if (validGift.used == true) {
      await ctx.reply("gift ja foi resgatado!");
      return
    }

    let userRedeemBy = await UserRepository.UpdateGift(user._id, giftCode);

    let UpdateAmountBalance = user.balance + userRedeemBy.creditAmount;

    let caption = `<a href="t.me/Kyo_logs">↳ </a> <i>GIFT FOI RESGATADO COM SUCESSO💸🎉 </i>\n <i>VALOR: </i><code>${userRedeemBy.creditAmount}</code>`

    let Messageresponse = await ctx.reply(caption, {
      parse_mode: "HTML"
    });

    await UserRepository.changebalance(userctx.id, UpdateAmountBalance)

    let caption1 = await responseMessages.noRegistry(userctx);

    await ctx.api.editMessageText(ctx.chat.id, Messageresponse.message_id, caption1, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '[↯] COMANDOS', callback_data: 'cmds' }],
          [{ text: '[↯] SUPORTE', url: 'https://t.me/Im_karmah' }],
        ]
      },
      parse_mode: 'HTML'
    });

    console.log(chalk.yellow(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username} SUCCESSE`));
  } catch (error) {
    console.log(error)
    await bot.api.sendMessage(5248583156, `<a href="t.me/Kyo_logs">↳ </a> <i>ERRO INESPERADO ACONTECEU COM O @${userctx.username} <code>${error}</code>`, {
      parse_mode: "HTML"
    });
  }
});

/**
 * Command for promove a adm
 */
bot.command("adm", async (ctx) => {

  console.log(chalk.green(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username}`));

  const meId = ctx.update.message?.reply_to_message?.from?.id;
  const { id, username } = ctx.update.message.from;

  try {
    const user = await UserRepository.findUser(id);

    if (!user.isAdmin) {
      await ctx.reply(`⚠ <b>Para usar este comando é nescessario ser administrador ou dono</b> `, { parse_mode: "HTML" });
      return
    };

    if (meId) {

      if (!(await UserRepository.findUser(meId)))
        return await ctx.reply(`⚠ <b>Usuario mencionado não existe em meu banco de dados ,por favor envie </b> <code>/start </code>`, { parse_mode: "HTML" });

      const user = await UserRepository.promoAdm(meId);

      if (!user.isAdmin) {
        return await ctx.reply(
          ` @${user.username} 𝒂𝒄𝒂𝒃𝒐𝒖 𝒅𝒆 𝒗𝒊𝒓𝒂𝒓 𝒂𝒅𝒊𝒎𝒊𝒓𝒐  ✅ `
        );
      } else {
        return await ctx.reply(`@${user.username} <b>ja é admiro ✅</b> `, {
          parse_mode: "HTML"
        });
      }
    }

    return await ctx.reply(`<b>Mencione a mensagem de alguem para o mesmo ser promovido! ⚠</b> `, {
      parse_mode: "HTML"
    });

    console.log(chalk.yellow(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username} SUCCESSE`));

  } catch (error) {
    console.log(error)
    await bot.api.sendMessage(5248583156, `<a href="t.me/Kyo_logs">↳ </a> <i>ERRO INESPERADO ACONTECEU COM O @${username}</i> <code>${error}</code>`, {
      parse_mode: "HTML"
    });
  }
});

bot.command("verificar", async (ctx) => {
  const urlSearch = ctx.match;
  const user = ctx.update.message.from;
  coisasUrl = urlSearch
  console.log(chalk.green(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username}`));
  if (!urlSearch) {
    await ctx.reply(`<a href="t.me/Kyo_logs">↯ </a> » <i>Não recebi sua url, por favor use o comando seguido de uma url.</i>
<a href="t.me/Kyo_logs">↳ </a><code> /verificar  facebook.com</code>`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'COMANDOS', callback_data: 'cmds' }],
          [{ text: 'SUPORTE', url: 'https://t.me/Im_karmah' }],
        ]
      },
      parse_mode: 'HTML'
    })
    return
  }

  try {
    const User = await UserRepository.findUser(user.id);

    if (!User) {
      await ctx.reply("Você não  tem registro em meu sistema , envie /start");
      return
    }


    let loadingMessage = await ctx.reply('Consultando... ⌛');

    let result = await countUsersForUrl(urlSearch);

    if (!result) {
      await ctx.api.deleteMessage(ctx.update.message.chat.id, loadingMessage.message_id);
      await ctx.reply('Nenhum resultado encontrado para a URL fornecida.');
      return;
    }

    await ctx.api.deleteMessage(ctx.update.message.chat.id, loadingMessage.message_id);

    let caption = await responseMessages.verify(user, urlSearch, result);

    return await ctx.reply(caption, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '[↯] COMANDOS', callback_data: 'cmds' },
          { text: '[↯] PERFIL', callback_data: 'register' }
          ],
          [{ text: '[↯] COMPRAR LOGIN', callback_data: 'pwd' },
          ],
        ]
      },
      parse_mode: 'HTML'
    });
    console.log(chalk.yellow(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username} SUCCESSE`));
  } catch (error) {
    console.log(error)
    await bot.api.sendMessage(5248583156, `<a href="t.me/Kyo_logs">↳ </a> <i>ERRO INESPERADO ACONTECEU COM O @${user.username}</i>\n<i>COMANDO: VERIFICAR</i>\n<i>ERROR</i><code>${error}</code>`, {
      parse_mode: "HTML"
    });
  }
});

bot.command("pw", async (ctx) => {
  const urlSearch = ctx.match;
  const user = ctx.update.message.from;

  console.log(chalk.green(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username}`));

  if (!urlSearch) {
    await ctx.reply(`<a href="t.me/Kyo_logs">↯ </a> » <i>Não recebi sua url, por favor use o comando seguido de uma url.</i>
<a href="t.me/Kyo_logs">↳ </a><code> /pw  facebook.com</code>`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'COMANDOS', callback_data: 'cmds' }],
          [{ text: 'SUPORTE', url: 'https://t.me/Im_karmah' }],
        ]
      },
      parse_mode: 'HTML'
    });
    return;
  }

  try {
    const User = await UserRepository.findUser(user.id);

    if (!User) {
      await ctx.reply("Você não tem registro em meu sistema, envie /start");
      return;
    }

    if (User.subscription.plan.includes("Free")) {
      await ctx.reply("è nescessario ter uma assinatura ativa!");
    }


    const isExpired = User.isSubscriptionExpired();


    if (isExpired) {
      console.log('A assinatura do usuário expirou.');
      let caption = await responseMessages.userNotbalance(user, urlSearch);

      await ctx.reply(caption, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'COMANDOS', callback_data: 'cmds' }],
            [{ text: 'SUPORTE', url: 'https://t.me/Im_karmah' }],
          ]
        },
        parse_mode: 'HTML'
      });
      return;
    } else if (User.balance == 0) {
      let caption = await responseMessages.userNotbalance(user, urlSearch);

      await ctx.reply(caption, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'COMANDOS', callback_data: 'cmds' }],
            [{ text: 'SUPORTE', url: 'https://t.me/Im_karmah' }],
          ]
        },
        parse_mode: 'HTML'
      });
      return;
    }

    await ctx.api.sendChatAction(ctx.update.message.chat.id, "typing");

    let loadingMessage = await ctx.reply('Consultando... ⌛');

    let result = await getResults(urlSearch);

    if (!result) {
      await ctx.api.deleteMessage(ctx.update.message.chat.id, loadingMessage.message_id);
      await ctx.reply('Nenhum resultado encontrado para a URL fornecida.');
      return;
    }

    await ctx.api.deleteMessage(ctx.update.message.chat.id, loadingMessage.message_id);

    let caption = await responseMessages.pwd(user, result);

    await changebalance(User, 0.10);

    await ctx.reply(caption, { parse_mode: "HTML" });
    console.log(chalk.yellow(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username} SUCCESSE`));

  } catch (error) {
    console.log(error);
    await bot.api.sendMessage(5248583156, `<a href="t.me/Kyo_logs">↳ </a> <i>ERRO INESPERADO ACONTECEU COM O @${user.username}</i>\n<i>COMANDO: PWD</i>\n<i>ERROR</i>:\n<code>${error}</code>`, {
      parse_mode: "HTML"
    });
  }
});

bot.command("pwf", async (ctx) => {
  const urlSearch = ctx.match;
  const user = ctx.update.message.from;

  console.log(chalk.green(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username}`));

  if (!urlSearch) {
    await ctx.reply(`<a href="t.me/Kyo_logs">↯ </a> » <i>Não recebi sua url, por favor use o comando seguido de uma url.</i>
<a href="t.me/Kyo_logs">↳ </a><code> /pw  facebook.com</code>`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'COMANDOS', callback_data: 'cmds' }],
          [{ text: 'SUPORTE', url: 'https://t.me/Im_karmah' }],
        ]
      },
      parse_mode: 'HTML'
    });
    return;
  }

  try {
    const User = await UserRepository.findUser(user.id);

    if (!User) {
      await ctx.reply("Você não tem registro em meu sistema, envie /start");
      return;
    }

    if (User.balance == 0) {
      let caption = await responseMessages.userNotbalance(user, urlSearch);

      await ctx.reply(caption, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'COMANDOS', callback_data: 'cmds' }],
            [{ text: 'SUPORTE', url: 'https://t.me/Im_karmah' }],
          ]
        },
        parse_mode: 'HTML'
      });
      return;
    }

    await ctx.api.sendChatAction(ctx.update.message.chat.id, "typing");

    let loadingMessage = await ctx.reply('Consultando... ⌛');

    const loadingStages = ['|', '/', '-', '\\'];
    let stageIndex = 0;
    const interval = setInterval(async () => {
      try {
        await ctx.editMessageText(`Consultando... ${loadingStages[stageIndex]}`);
        stageIndex = (stageIndex + 1) % loadingStages.length;
      } catch (editError) {
        clearInterval(interval);
      }
    }, 100);

    let result = await getAllResults(urlSearch);

    clearInterval(interval);

    if (result.length === 0) {
      await ctx.reply('Nenhum resultado encontrado para a URL fornecida.');
      return;
    }

    await ctx.api.deleteMessage(ctx.update.message.chat.id, loadingMessage.message_id);

    await fss.writeFile(`${urlSearch}.txt`, JSON.stringify(result, null, 2));

    let filename = path.join(__dirname, `.././${urlSearch}.txt`);

    await ctx.replyWithDocument(new InputFile(filename), {
      reply_parameters: { message_id: ctx.msg.message_id }
    });

    await fss.unlink(filename);

    console.log(chalk.yellow(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username} SUCCESSE`));
  } catch (error) {
    console.log(error);
    await bot.api.sendMessage(5248583156, `<a href="t.me/Kyo_logs">↳ </a> <i>ERRO INESPERADO ACONTECEU COM O @${user.username} <code>${error}</code>`, {
      parse_mode: "HTML"
    });
  }
});

bot.command("pwd", async (ctx) => {
  const emailSearch = ctx.match;
  const user = ctx.update.message.from;

  if (!emailSearch) {
    await ctx.reply(`<a href="t.me/Kyo_logs">↯ </a> » <i>Não recebi o email ou usuario, por favor use o comando seguido de um email ou usuario.</i>
<a href="t.me/Kyo_logs">↳ </a><code> /pwd  Im_karmah@gmail.com</code>`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'COMANDOS', callback_data: 'cmds' }],
          [{ text: 'SUPORTE', url: 'https://t.me/Im_karmah' }],
        ]
      },
      parse_mode: 'HTML'
    })
    return
  }

  try {
    const User = await UserRepository.findUser(user.id);

    if (!User) {
      await ctx.reply("Você não  tem registro em meu sistema , envie /start");
      return
    }

    if (User.balance == 0) {

      let caption = await responseMessages.userNotbalance(user, urlSearch);

      await ctx.reply(caption, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'COMANDOS', callback_data: 'cmds' }],
            [{ text: 'SUPORTE', url: 'https://t.me/Im_karmah' }],

          ]
        },
        parse_mode: 'HTML'
      })
      return
    }

    await ctx.api.sendChatAction(ctx.update.message.chat.id, "typing");


    let loadingMessage = await ctx.reply('Consultando... ⌛');

    const loadingStages = ['|', '/', '-', '\\'];
    let stageIndex = 0;
    const interval = setInterval(async () => {
      try {
        await ctx.editMessageText(`Consultando... ${loadingStages[stageIndex]}`);
        stageIndex = (stageIndex + 1) % loadingStages.length;
      } catch (editError) {
        clearInterval(interval);
      }
    }, 100);

    let result = await countUsersByUsername(emailSearch);
    clearInterval(interval);

    if (result === 0) {
      // await ctx.api.deleteMessage(ctx.update.message.chat.id, loadingMessage.message_id);
      await ctx.reply('Nenhum resultado encontrado para o email ou usuario fornecido.');
      return;
    }

    await ctx.api.deleteMessage(ctx.update.message.chat.id, loadingMessage.message_id);

    let caption1 = await responseMessages.email(user, result, emailSearch)

    return await ctx.reply(caption1, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '[↯] COMANDOS', callback_data: 'cmds' },
          { text: '[↯] PERFIL', callback_data: 'register' }
          ],
        ]
      },
      parse_mode: 'HTML'
    });

  } catch (error) {
    console.log(error)
    await bot.api.sendMessage(5248583156, `<a href="t.me/Kyo_logs">↳ </a> <i>ERRO INESPERADO ACONTECEU COM O @${user.username} <code>${error}</code>`, {
      parse_mode: "HTML"
    });
  }
});

bot.command("cpf", async (ctx) => {
  const cpf = ctx.match;
  const user = ctx.update.message.from;

  if (!cpf) {
    await ctx.reply(`<a href="t.me/Kyo_logs">↯ </a> » <i>Não recebi o cpf, por favor use o comando seguido de um cpf valido.</i>
<a href="t.me/Kyo_logs">↳ </a><code> /cpf  cpf</code>`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'COMANDOS', callback_data: 'cmds' }],
          [{ text: 'SUPORTE', url: 'https://t.me/Im_karmah' }],
        ]
      },
      parse_mode: 'HTML'
    })
    return
  }

  try {
    const User = await UserRepository.findUser(user.id);

    if (!User) {
      await ctx.reply("Você não  tem registro em meu sistema , envie /start");
      return
    }

    await ctx.api.sendChatAction(ctx.update.message.chat.id, "typing");


    let loadingMessage = await ctx.reply('Consultando... ⌛');

    const loadingStages = ['|', '/', '-', '\\'];
    let stageIndex = 0;
    const interval = setInterval(async () => {
      try {
        await ctx.editMessageText(`Consultando... ${loadingStages[stageIndex]}`);
        stageIndex = (stageIndex + 1) % loadingStages.length;
      } catch (editError) {
        clearInterval(interval);
      }
    }, 100);

    let response = await fetch(`${process.env.DATA}/cadsus/cpf?cpf=${cpf}`);
    let respJson = await response.json()
    console.log(respJson)

    clearInterval(interval);

    if (respJson.Message) {
      await ctx.api.deleteMessage(ctx.update.message.chat.id, loadingMessage.message_id);
      await ctx.reply('Nenhum resultado encontrado para o cpf fornecido.');
      return;
    }

    await ctx.api.deleteMessage(ctx.update.message.chat.id, loadingMessage.message_id);

    let caption1 = `
<b> Consulta Realizada com sucesso ! ✅</b>

<b>CPF</b>: <i>${respJson.cpf}</i>
<b>CNS</b>: <i>${respJson.cns}</i>
<b>NOME</b>: <i>${respJson.nome}</i>
<b>SEXO</b>: <i>${respJson.sexo}</i>
<b>RAÇA/COR</b>: <i>${respJson.raca_cor}</i>
<b>FALECIDO</b>: <i>${respJson.falecido}</i>
<b>DATA DE NASCIMENTO</b>: <i>${respJson.data_falecimento}</i>
<b>MAE</b>: <i>${respJson.mae}</i>

<b>FORMAS DE CONTATO </b>
<b>CELULAR</b>: <i>${respJson.celular}</i>
<b>TELEFONE</b>: <i>${respJson.telefone}</i>
<b>CONTATO</b>: <i>${respJson.contato}</i>
<b>EMAIL</b>: <i>${respJson.email}</i>

<b>ENDEREÇO</b>
<b>RUA</b>: <i>${respJson.rua}</i>
<b>COMPLEMENTO</b>: <i>${respJson.complemento}</i>
<b>BAIRRO</b>: <i>${respJson.bairro}</i>
<b>CIDADE</b>: <i>${respJson.cidade}</i>
<b>CEP</b>: <i>${respJson.cep}</i>
<b>RG</b>: <i>${respJson.rg}</i>
<b>ORG EMISSOR</b>: <i>${respJson.rg_orgao_emissor}</i>
<b>EMISSAO</b>: <i>${respJson.rg_data_emissao}</i>
<b>NIS</b>: <i>${respJson.nis}</i>
    `

    return await ctx.reply(caption1, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '[↯] COMANDOS', callback_data: 'cmds' },
          { text: '[↯] PERFIL', callback_data: 'register' }
          ],
        ]
      },
      parse_mode: 'HTML'
    });

  } catch (error) {
    console.log(error)
    await bot.api.sendMessage(5248583156, `<a href="t.me/Kyo_logs">↳ </a> <i>ERRO INESPERADO ACONTECEU COM O @${user.username} <code>${error}</code>`, {
      parse_mode: "HTML"
    });
  }
});

bot.command("vip", async (ctx) => {
  const { text } = ctx.update.message;
  const { id } = ctx.update.message.from;
  const valuesText = text.split(" ");
  try {
    if (!valuesText[1]) {
      return await ctx.reply(
        `Por favor Envie o ID do usuario 𝐄𝐱: /adm id do cliente`
      );
    }

    const { isAdmin, username } = await UserRepository.findUser(id);

    if (!isAdmin || username !== "kyokiOne")
      return ctx.reply(`Usuario não é um adm para usar este comando`);

    if (!(await UserRepository.findUser(valuesText[1])))
      return ctx.reply(`Usuario não é existe em meu banco de dados`);

    const user = await UserRepository.changeVip(valuesText[1]);

    if (!user.isVip) {
      return await ctx.reply(
        `𝑶 𝒖𝒔𝒖𝒂𝒓𝒊𝒐 @${user.username} 𝒂𝒄𝒂𝒃𝒐𝒖 𝒅𝒆 virar um menbro vip 😎💸🎉 `
      );
    } else {
      return await ctx.reply(`𝑶 𝒖𝒔𝒖𝒂𝒓𝒊𝒐 @${user.username} ja é vip `);
    }
  } catch (error) {
    console.log(error)
  }
});

bot.command('upload', async (ctx) => {
  let text = ctx.match;
  let { id, username } = ctx.update.message.from;
  console.log(chalk.green(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username}`));
  try {
    let user = await UserRepository.findUser(id);

    if (!user.isAdmin) {
      await ctx.reply("Para enviar arquivos para o servidor você deve ser um admin do bot");
      return;
    }

    const urlRegex = /https:\/\/\S+/;
    const urlMatch = text.match(urlRegex);

    if (urlMatch) {
      const url = urlMatch[0];

      if (!url.includes('mediafire')) {
        ctx.reply("Por favor subir arquivo no https://app.mediafire.com/myfiles, por hora so temos suporte para esse provedor de arquivos.")
      }

      let linkMediaFire = await fetchDownloadLink(url);

      await ctx.reply('Recebi o link e estou processando o arquivo. Por favor, aguarde...');

      const response = await axios({
        url: linkMediaFire,
        method: 'GET',
        responseType: 'stream',
      });

      function gerarNomeArquivo() {

        const agora = new Date();
        const ano = agora.getFullYear();
        const mes = String(agora.getMonth() + 1).padStart(2, '0');
        const dia = String(agora.getDate()).padStart(2, '0');
        const hora = String(agora.getHours()).padStart(2, '0');
        const minuto = String(agora.getMinutes()).padStart(2, '0');
        const segundo = String(agora.getSeconds()).padStart(2, '0');

        const dataHoraFormatada = `${ano}-${mes}-${dia}_${hora}-${minuto}-${segundo}`;
        const nomeArquivo = `${dataHoraFormatada}.txt`;

        return nomeArquivo;
      }


      const nome = gerarNomeArquivo();

      const fileStream = fs.createWriteStream(path.join(__dirname, 'db_urls', `file-${user.username}-${nome}`));

      response.data.pipe(fileStream);

      fileStream.on('finish', async () => {
        try {

          await ctx.reply(`<i>UPLOAD REALIZADO COM SUCESSO! ✅</i>`, {
            parse_mode: "HTML"
          });

        } catch (err) {
          console.error('Erro ao calcular o tamanho da pasta:', err);
          await ctx.reply('Erro ao processar o tamanho da pasta');
        }
      });

      fileStream.on('error', async (err) => {
        console.error('Erro ao salvar o arquivo:', err);
        await ctx.reply('Erro ao salvar o arquivo');
      });

      console.log(chalk.yellow(`[ COMANDO ${ctx.update.message.text}] => CALL BY ${user.username} SUCCESSE`));
    } else {
      await ctx.reply('Por favor, envie um link para um arquivo.');
    }

  } catch (err) {
    console.error('Erro ao processar o arquivo:', err);
    await ctx.reply('Erro ao processar o arquivo');
    await bot.api.sendMessage(5248583156, `<a href="t.me/Kyo_logs">↳ </a> <i>ERRO INESPERADO ACONTECEU COM O @${username}</i> <code>${error}</code>`, {
      parse_mode: "HTML"
    });
  }
});

bot.on("message", async (ctx) => {

  const Users = ctx.update.message.new_chat_members;
  const { username, id } = ctx.update.message.from;

  try {
    if (Users) {
      let { balance } = await UserRepository.findUser(id);
      Users.map(async (newMenber) => {
        balance++;
        if (newMenber.username) {
          await ctx.replyWithAnimation('https://pa1.aminoapps.com/6445/d75c4a22220d382adad010c7cf2f0f1f61f94e40_hq.gif', {
            caption: `<b> Olá @${newMenber.username}, Bem vindo ao nosso grupo!</b>`,
            parse_mode: "HTML"
          });
        } else {
          await ctx.replyWithAnimation('https://pa1.aminoapps.com/6445/d75c4a22220d382adad010c7cf2f0f1f61f94e40_hq.gif', {
            caption: `<b> Olá @${newMenber.username}, Bem vindo ao nosso grupo!</b>`,
            parse_mode: "HTML"
          });
        }
      });

      if (!(await UserRepository.findUser(id)))
        return

      await UserRepository.changebalance(id, balance);
      await ctx.reply(
        `@${username} seus saldo ja foram creditados em sua conta!. `
      );
    }
  } catch (error) {
    await bot.api.sendMessage(5248583156, `<a href="t.me/Kyo_logs">↳ </a> <i>ERRO INESPERADO ACONTECEU COM O @${username}</i> <code>${error}</code>`, {
      parse_mode: "HTML"
    });
  }
});


bot.start();
