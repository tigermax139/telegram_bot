const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '508235796:AAEGb0P1Y0NpegyfM6OfkQE07s8_QCmRus8';

const bot = new TelegramBot(TOKEN, {
    polling: true
});
const KB = {
    currency: 'course of',
    picture: 'picture',
    cat: 'cat',
    car: 'car',
    back: 'back'
};

bot.onText(/\/start/, msg => {
    sendGreeting(msg);
});

bot.on('message', msg => {
    switch (msg.text){
        case KB.picture:
            sendPictureScreen(msg.chat.id);
            break;
        case KB.currency:
            break;
        case KB.back:
            sendGreeting(msg, false);
            break;
        case KB.cat:
        case KB.car:
            break;
    }
} );

function sendPictureScreen(chatId) {
    bot.sendMessage(chatId, 'Check the type of picture', {
        reply_markup: {
            keyboard: [
                [KB.car, KB.cat],
                [KB.back]
            ]
        }
    })
}

function sendGreeting(msg, sayHello = true) {
    const text = sayHello
        ? `Hello, ${msg.from.first_name}! \n You have nice look!)`
        : 'What you want?';
    bot.sendMessage(msg.chat.id, text, {
        reply_markup: {
            keyboard: [
                [KB.currency, KB.picture ]
            ]
        }
    });
}