const jwt = require('jsonwebtoken');

module.exports.auth= async function auth(req, res, next)
{
    try
    {
        // let token= req.headers["x-api-key"];
        let token= req.header('Authorization', 'Bearer');
        console.log("token is here",token);
        if(!token) return res.send({status: false, message: "Please provide the token.."});
        let splittingToken= token.split(' ');
        let decodeToken= jwt.verify(splittingToken[1], "SecretKey");
        if(!decodeToken) return res.send({status: false, message: "Please provide the right credentials.."});
        console.log("from Auth", decodeToken);
        next();
    }
    catch(err)
    {
        console.log(err);
    }
}