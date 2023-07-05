const { Configuration, OpenAIApi } = require("openai");
const { getImage, getChat } = require("./Helper/functions");
const { Telegraf } = require("telegraf");

const apiKey = "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";
const tgToken = "6149657360:AAHNYopnr5AusiZEtbVNybcVUKhs8ueSwa0";

const configuration = new Configuration({
  apiKey,
});

const openai = new OpenAIApi(configuration);
module.exports = openai;

const bot = new Telegraf(tgToken);
bot.start((ctx) => ctx.reply("Welcome! You can ask anything from me."));

bot.help((ctx) => {
  ctx.reply(
    "This bot can perform the following commands:\n/image -> Create an image from text.\n/ask -> Ask anything from me."
  );
});

// Image command
bot.command("image", async (ctx) => {
  const text = ctx.message.text?.replace("/image", "")?.trim().toLowerCase();

  if (text) {
    const res = await getImage(text);

    if (res) {
      ctx.telegram.sendChatAction(ctx.message.chat.id, "upload_photo");
      ctx.telegram.sendPhoto(ctx.message.chat.id, res, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "You have to give some description after /image",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  }
});

// Chat command
bot.command("ask", async (ctx) => {
  const text = ctx.message.text?.replace("/ask", "")?.trim().toLowerCase();

  if (text) {
    ctx.telegram.sendChatAction(ctx.message.chat.id, "typing");
    const res = await getChat(text);
    if (res) {
      ctx.telegram.sendMessage(ctx.message.chat.id, res, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Please ask anything after /ask",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  }
});

bot.launch();
