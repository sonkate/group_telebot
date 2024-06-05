const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const client = require('./configs/connectDB');
require('dotenv').config();
const app = express()
const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
    try {
        // Check if the message contains new chat members
        if (msg.new_chat_members) {
            msg.new_chat_members.forEach(async (member) => {
                bot.sendMessage(chatId, `Hello ${member.first_name}, welcome to the group!`);
                // add database verify telegram
                const queryInsertVerifiedTele=`
                    INSERT INTO verified_telegrams(
                    user_id, username, is_join)
                    VALUES ( $1, $2, $3);
                `;
                const valueInsertVerifiedTele = [member.member.id, member.username, true];
                const resultVerifiedTele = await client.query(queryInsertVerifiedTele, valueInsertVerifiedTele);
                const telegramId = resultVerifiedTele.rows[0].id;
            });
        }
    } catch (error) {
        console.log('Error when verify telegram or twitter')
    }
  
//   bot.sendMessage(chatId, `
//     user_id: ${msg.from.id}
//     user_name: ${msg.from.username}
//   `)
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server is running on port localhost:${PORT}`);
});