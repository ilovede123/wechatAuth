const express = require('express');
const { getComponentAccessToken, getPreAuthCode } = require('./wechatAuth');

const app = express();
const port = 3000;
const redirectUri = 'YOUR_REDIRECT_URI';

app.get('/generateAuthUrl', async (req, res) => {
	try {
		const componentAccessToken = await getComponentAccessToken();
		const preAuthCode = await getPreAuthCode(componentAccessToken);
		const authUrl = `https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=${componentAppId}&pre_auth_code=${preAuthCode}&redirect_uri=${redirectUri}`;
		res.send({ authUrl });
	} catch (error) {
		res.status(500).send({ error: 'Failed to generate auth URL' });
	}
});

app.get('/authCallback', async (req, res) => {
	const authorizationCode = req.query.auth_code;
	const componentAccessToken = await getComponentAccessToken();

	const url = `https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=${componentAccessToken}`;
	const payload = {
		component_appid: componentAppId,
		authorization_code: authorizationCode
	};

	try {
		const response = await axios.post(url, payload);
		const authorizationInfo = response.data.authorization_info;
		res.send({ authorizationInfo });
	} catch (error) {
		console.error('Error getting authorization info:', error);
		res.status(500).send({ error: 'Failed to get authorization info' });
	}
});


app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
