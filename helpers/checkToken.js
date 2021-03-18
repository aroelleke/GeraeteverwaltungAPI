var jwt = require('jsonwebtoken');
var jwtConfig = require('../environment/jsonwebtoken');



const checkToken = (token, userID) => {
	if (!token || !userID) { return 0 };
	try {
		var decoded = jwt.verify(token, jwtConfig.privateKey);
	} catch (err) {
		res.send({ error: 'JSON Web Token could not be verified.' })
	}
	if (decoded.userID != userID) { return -1 };
	return 1;
};

const checkToken_MiddlewareFunction = (req, res, next) => {
	var tokenVerify = checkToken(req.token, req.userID);
	switch (tokenVerify) {
		case -1: {
			res.send({ error: 'Invalid token' });
			break;
		}
		case 0: {
			res.send({ error: 'Missing arguments' });
			break;
		}
		case 1: {
			next();
			break;
		}
	}
}

module.exports = checkToken_MiddlewareFunction;