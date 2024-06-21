const express = require('express');
const { getComponentAccessToken, getPreAuthCode } = require('./src/wechatAuth');

const app = express();
const port = 3000;
const redirectUri = 'YOUR_REDIRECT_URI';


app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
