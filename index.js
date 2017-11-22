const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '508235796:AAEGb0P1Y0NpegyfM6OfkQE07s8_QCmRus8';
const fs = require('fs');
const request = require('request');
const  _ = require('lodash');

//const VNAU = 'http://81.30.162.30/timeTable/group?filial=0&faculty=5&course=3&group=1873&date1=06.09.2015&date2=01.11.2015&r11=5&&TimeTableForm[filial]=0&TimeTableForm[faculty]=5&TimeTableForm[course]=3&TimeTableForm[group]=1873&TimeTableForm[date1]=22.11.2017&TimeTableForm[date2]=09.01.2018'

const bot = new TelegramBot(TOKEN, {
    polling: true
});
const KB = {
    currency: 'course of',
    picture: 'picture',
    cat: 'cat',
    car: 'car',
    back: 'back',
    table: 'TimeTable'
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
            sendPictureByName(msg.chat.id, msg.text);
            break;
        case KB.table:
            sendTableScreen(msg.chat.id, msg.date);
            break;
    }
} );

bot.on('callback_query', query => {
    console.log(JSON.stringify(query, null, 3));
    const base = query.data;
    const symbol = 'RUB';

    bot.answerCallbackQuery({
        callback_query_id: query.id,
        text: `You change: ${base}`
    });

    request(`https://api.fixer.io/latest?symbols=${symbol}&base=${base}`, (error, response, body) => {
        if(error) throw new Error(error)

        if(response.statusCode === 200) {
            const currencyData = JSON.parse(body);
            const html = `<b>1 ${base}</b> - <em>${currencyData.rates[symbol]} ${symbol}</em>`

            bot.sendMessage(query.message.chat.id, html, {
                parse_mode: 'HTML'
            } );
        }


    });
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
                [KB.currency, KB.picture ],
                [KB.table]
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

/****teamTable****/
function sendTableScreen(chatId, date) {
    timeConverter(date, chatId);
   // bot.sendMessage(chatId, `test ${time}`);
}
function timeConverter(UNIX_timestamp, chatId) {
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    const time = date + '-' + month + '-' + year;

    bot.sendMessage(chatId, `test ${time}`);

    fs.readFile(`${__dirname}/img/table/${time}.png`, (error, picture) => {
        if (error) throw new Error(error);

        bot.sendPhoto(chatId, picture).then( () => {
            bot.sendMessage(chatId, `Completed! :)`);
        });
    })
}
