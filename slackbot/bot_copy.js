//보고 따라한 페이지 : https://speakerdeck.com/kwanlae/slack-bot

const botkit = require('botkit');
const keys = require('./keys');

//api ai 추가 
const apiaiBotkit = require('api-ai-botkit');

const apiai = apiaiBotkit(keys.apiaiToken);

const controller = botkit.slackbot({
	debug: false,
	log: true
});
//api ai 추가 끝 

//dm답변
const botScope = [
	'direct_message',
	'direct_mention',
	'mention'
];

//dm 질문에 대한 답변 설정 
controller.hears('안녕',botScope,(bot,message) => {
	bot.reply(message,'안녕, 나는 로봇이에요.');
});

controller.hears('교재구매방법',botScope,(bot,message) => {
	bot.reply(message,'1)필요한 교재 정보 확인(교재명,저자,출판사)\n2) 해당 교재의 재고 확인\n3)필요 구매 수량 확인\n(업무절차라서 생략) ');
});

controller.hears('디자인요청',botScope,(bot,message) => {
	bot.reply(message,'[업무처리절차]\n 1)미리 일정협의\n 2) 레퍼런스 전달\n 3) 기획내용(상세페이지) 또는 문구전달(현수막, x배너등의경우)');
});

controller.hears('개강',botScope,(bot,message) => {
	bot.reply(message,'[체크리스트]\n 1) \n 1-1)\n 2)\n 3) \n 4) \n 5)');
});

//api ai 기능추가 
controller.hears('.*',botScope,(bot,message) => {
	apiai.process(message,bot);
});

apiai.all((message, resp, bot) => {
	console.log(resp.result.action);
});

const actionsDefault = [
	'input.unknown',
	'input.welcome'
];

actionsDefault.forEach((action) => {
	apiai.action(action, (message, resp, bot) =>{
		const responseText = resp.result.fulfillment.speech;
		bot.reply(message, responseText);
	});	
});

apiai.action('plus', (message, resp, bot) => {
	const x = Number(resp.result.parameters.x);
	const y = Number(resp.result.parameters.y);
	const sum = x + y;

	bot.reply(message, `결과 : ${sum}`);
});
//apiai 기능추가 끝 


controller.spawn({
	token: keys.botAPIToken
}).startRTM();

