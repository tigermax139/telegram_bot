const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '508235796:AAEGb0P1Y0NpegyfM6OfkQE07s8_QCmRus8';
const fs = require('fs');
const  _ = require('lodash');

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

const PicSrcs = {
    [KB.cat]: [
        'cat.png',
        'cat1.jpg',
        'cat2.jpg',
        'cat3.jpg',
        'cat4.jpg'
    ],
    [KB.car]: [
        'car.png',
        'car1.png',
        'car2.jpg',
        'car3.jpg',
        'car4.jpg'
    ]
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
            sendCurrencyScreen(msg.chat.id);
            break;
        case KB.back:
            sendGreeting(msg, false);
            break;
        case KB.cat:
        case KB.car:
            sendPictureByName(msg.chat.id, msg.text)
            break;
    }
} );

bot.on('callback_query', query => {
    console.log(JSON.stringify(query, null, 3));
});

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

function sendPictureByName(chatId, picName) {
    const srcs = PicSrcs[picName];

    const src = srcs[_.random(0, srcs.length - 1)];

    bot.sendMessage(chatId, `Loading ....`);

    fs.readFile(`${__dirname}/img/${src}`, (error, picture) => {
        if (error) throw new Error(error);

        bot.sendPhoto(chatId, picture).then( () => {
            bot.sendMessage(chatId, `Completed! :)`);
        });
    })
}

function sendCurrencyScreen(chatId, ) {
    bot.sendMessage(chatId, `Change a type of current:`, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: `Dollar`,
                    callback_data: `USD`
                }],
                [{
                    text: `Euro`,
                    callback_data: `EUR`
                }]

            ]

        }
    })
}