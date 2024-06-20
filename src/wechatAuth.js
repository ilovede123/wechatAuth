const axios = require('axios');

const componentAppId = 'YOUR_COMPONENT_APPID';
const componentAppSecret = 'YOUR_COMPONENT_APPSECRET';
const componentVerifyTicket = 'YOUR_COMPONENT_VERIFY_TICKET';

async function getComponentAccessToken() {
	const url = 'https://api.weixin.qq.com/cgi-bin/component/api_component_token';
	const payload = {
		component_appid: componentAppId,
		component_appsecret: componentAppSecret,
		component_verify_ticket: componentVerifyTicket
	};

	try {
		const response = await axios.post(url, payload);
		return response.data.component_access_token;
	} catch (error) {
		console.error('Error getting component access token:', error);
		throw error;
	}
}

async function getPreAuthCode(componentAccessToken) {
	const url = `https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=${componentAccessToken}`;
	const payload = {
		component_appid: componentAppId
	};

	try {
		const response = await axios.post(url, payload);
		return response.data.pre_auth_code;
	} catch (error) {
		console.error('Error getting pre auth code:', error);
		throw error;
	}
}

module.exports = {
	getComponentAccessToken,
	getPreAuthCode
};
