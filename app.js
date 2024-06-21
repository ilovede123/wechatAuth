const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const qrImage = require('qr-image');
const xml2js = require('xml2js');

const app = express();
app.use(bodyParser.text({ type: 'text/xml' }));

const appId = 'YOUR_APP_ID';
const appSecret = 'YOUR_APP_SECRET';
const token = 'YOUR_COMPONENT_TOKEN';
const encodingAESKey = 'YOUR_ENCODING_AES_KEY';

let componentVerifyTicket = '';


app.get('/', (req, res) => {
	res.send('success')
})


// 接收微信服务器推送的Component Verify Ticket
app.post('/callback', (req, res) => {
	const rawBody = req.body;

	xml2js.parseString(rawBody, { explicitArray: false }, (err, result) => {
		if (err) {
			return res.status(500).send('Failed to parse XML');
		}

		const message = result.xml;
		if (message.InfoType === 'component_verify_ticket') {
			componentVerifyTicket = message.ComponentVerifyTicket;
			console.log('Received Component Verify Ticket:', componentVerifyTicket);
			// 可以将componentVerifyTicket保存到数据库或者内存中，以便后续使用
		}

		res.send('success');
	});
});

// 获取Component Access Token
function getComponentAccessToken(callback) {
	const url = 'https://api.weixin.qq.com/cgi-bin/component/api_component_token';
	const body = {
		component_appid: appId,
		component_appsecret: appSecret,
		component_verify_ticket: componentVerifyTicket
	};

	request.post({ url, json: true, body }, (err, res, body) => {
		if (err) {
			return callback(err);
		}
		const componentAccessToken = body.component_access_token;
		callback(null, componentAccessToken);
	});
}

// 获取预授权码并生成二维码
app.get('/generateQRCode', (req, res) => {
	getComponentAccessToken((err, componentAccessToken) => {
		if (err) {
			return res.status(500).send('Failed to get component access token');
		}

		const url = `https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=${componentAccessToken}`;
		const body = { component_appid: appId };

		request.post({ url, json: true, body }, (err, res, body) => {
			if (err) {
				return res.status(500).send('Failed to get pre auth code');
			}

			const preAuthCode = body.pre_auth_code;
			const redirectUri = encodeURIComponent('YOUR_REDIRECT_URI');
			const authUrl = `https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=${appId}&pre_auth_code=${preAuthCode}&redirect_uri=${redirectUri}`;
			const qrCode = qrImage.image(authUrl, { type: 'png' });
			res.setHeader('Content-type', 'image/png');
			qrCode.pipe(res);
		});
	});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
