import "dotenv/config";
import connectToDatabase from "./db/connection.js";
import bot from "./bot.js";
import { hydrateReply, bold, fmt } from "@grammyjs/parse-mode";
import Errors from "./err/errors.js";
import registerResponse from "./responses/register.js";
import initalMessage from "./responses/inlineRegister.js";
import UserRepository from "./repository/userRepo.js";
await connectToDatabase();

bot.use(hydrateReply);
/**
 * Command for register user
 */
bot.command("register", async (ctx) => {
  try {
    const { username, first_name, id } = ctx.update.message.from;
    if (!(await UserRepository.findUser(id))) {
      let balance = 0;
      await ctx.replyFmt(registerResponse.noRegistry(username), {
        reply_markup: initalMessage,
      });
      await UserRepository.saveUser(first_name, id, username, balance);
    } else {
      await ctx.replyFmt(registerResponse.withRegistry(username), {
        reply_markup: initalMessage,
      });
    }
  } catch (error) {
    Errors.erroInternal();
  }
});

/**
 * Command for change User balance
 */
bot.command("saldo", async (ctx) => {
  const { text } = ctx.update.message;
  const { id } = ctx.update.message.from;
  const valuesText = text.split(" ");
  try {
    if (!valuesText[1] || !valuesText[2]) {
      return await ctx.reply(`Por favor passe os parametros certo`);
    }

    const { isAdmin } = await UserRepository.findUser(id);

    if (!isAdmin)
      return ctx.reply(`Usuario não é um adm para usar este comando`);

    if (!(await UserRepository.findUser(valuesText[1])))
      return ctx.reply(`Usuario não é existe em meu banco de dados`);

    const { username } = await UserRepository.changebalance(
      valuesText[1],
      valuesText[2]
    );

    await ctx.reply(
      `𝑶 𝒖𝒔𝒖𝒂𝒓𝒊𝒐 @${username} 𝒂𝒄𝒂𝒃𝒂 𝒅𝒆 𝒓𝒆𝒄𝒆𝒃𝒆𝒓  R$${valuesText[2]} 𝒅𝒆 𝒔𝒂𝒍𝒅𝒐 💸🎉 `
    );
  } catch (error) {
    Errors.erroInternal();
  }
});

/**
 * Command for promove a adm
 */
bot.command("adm", async (ctx) => {
  const meId = ctx.update.message.reply_to_message.from.id;
  const { text } = ctx.update.message;
  const { id } = ctx.update.message.from;
  const valuesText = text.split(" ");

  try {
    if (valuesText[1] || meId) {
      const { username } = await UserRepository.findUser(id);

      if (username !== "kyokiOne")
        return ctx.reply(
          `Usuario não é um dono ou subdono, para usar este comando entre em contato com meu dev @kyokiOne`
        );

      if (!(await UserRepository.findUser(meId)))
        return ctx.reply(`Usuario não é existe em meu banco de dados`);

      const user = await UserRepository.promoAdm(meId);

      if (!user.isAdmin) {
        return await ctx.reply(
          `𝑶 𝒖𝒔𝒖𝒂𝒓𝒊𝒐 @${user.username} 𝒂𝒄𝒂𝒃𝒐𝒖 𝒅𝒆 𝒗𝒊𝒓𝒂𝒓 𝒂𝒅𝒊𝒎𝒊𝒓𝒐  💸🎉 `
        );
      } else {
        return await ctx.reply(`𝑶 𝒖𝒔𝒖𝒂𝒓𝒊𝒐 @${user.username} ja é admiro `);
      }
    }

    return await ctx.reply(`Por favor Envie o ID do usuario
    𝐄𝐱: /adm id do cliente`);
  } catch (error) {
    Errors.erroInternal();
  }
});

/**
 * Command for check your gg
 */

bot.command("check", async (ctx) => {
  const listGG = ctx.match;
  const { id } = ctx.update.message.from;

  try {
    const user = await UserRepository.findUser(id);

    if (!user) {
      return await ctx.reply("Você não  tem registro em meu sistema");
    }

    let loadedList = listGG.split("\n");

    var { balance } = user;
    console.log(loadedList);
    loadedList.map(async (cc) => {
      if (!(balance >= 5))
        return await ctx.reply(
          "Seu saldo é muito pouco amigo, add ou compre diretamente com os admin"
        );
      balance = balance - 5;
      console.log(cc);
      const { username } = await UserRepository.changebalance(id, balance);

      await ctx.reply(`${cc} testada -5 @${username}`);
    });
  } catch (error) {
    Errors.erroInternal();
  }
});

/**
 * Command for promove a vip
 */

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
    Errors.erroInternal();
  }
});
/**
 * Command for give user information
 */
bot.command("info", async (ctx) => {
  const { id } = ctx.update.message.from;
  try {
    const user = await UserRepository.findUser(id);

    if (!user) return ctx.reply(`Usuario não é existe em meu banco de dados`);

    if (!user.isVip) {
      return await ctx.replyFmt(
        fmt`${bold(fmt` 
  ━━━━━━◇x◇━━━━━━
  ↳ [👤 𝑵𝒐𝒎𝒆 ] : ${user.first_name} 
  ↳ [🆔 𝑰𝒅 ] :  ${user.idUser} 
  ↳ [@ 𝑼𝒔𝒆𝒓 ]:  @${user.username} 
  ↳ [💰 𝑺𝒂𝒍𝒅𝒐 ] : R$ ${user.balance}
  ↳ [🤑 𝗩𝗶𝗽? ] : ❌
  ━━━━━━◇x◇━━━━━━`)}`
      );
    } else {
      return await ctx.replyFmt(
        fmt`${bold(fmt` 
  ━━━━━━◇x◇━━━━━━
  ↳ [👤 𝑵𝒐𝒎𝒆 ] : ${user.first_name} 
  ↳ [🆔 𝑰𝒅 ] :  ${user.idUser} 
  ↳ [@ 𝑼𝒔𝒆𝒓 ]:  @${user.username} 
  ↳ [💰 𝑺𝒂𝒍𝒅𝒐 ] : R$ ${user.balance}
  ↳ [🤑 𝗩𝗶𝗽? ] : ✅
  ━━━━━━◇x◇━━━━━━`)}`
      );
    }
  } catch (error) {
    Errors.erroInternal();
  }
});

/**
 * Command for listening events in chat
 */
bot.on("message", async (ctx) => {
  const Users = ctx.update.message.new_chat_members;
  const { username, id } = ctx.update.message.from;

  try {
    if (Users) {
      let { balance } = await UserRepository.findUser(id);
      Users.map(async (newMenber) => {
        balance++;
        if (newMenber.username) {
          await ctx.reply(
            `Olá @${newMenber.username} Bem vindo, add por @${username} `
          );
        } else {
          await ctx.reply(
            `Olá @${newMenber.first_name} Bem vindo , add por @${username}`
          );
        }
      });

      if (!(await UserRepository.findUser(id)))
        return ctx.reply(`Usuario não é existe em meu banco de dados`);

      await UserRepository.changebalance(id, balance);
      await ctx.reply(
        `@${username} seus saldo ja foram creditados em sua conta!. `
      );
    }
  } catch (error) {
    Errors.erroInternal();
  }
});

bot.start();
