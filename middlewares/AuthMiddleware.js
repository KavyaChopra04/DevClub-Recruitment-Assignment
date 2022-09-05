const {verify} = require("jsonwebtoken");
const validateToken=(req,res,next)=>{
    const accessToken = req.header("accessToken")
    if(!accessToken){
        return res.json({error: "User not logged in!"})
    }
    try{
        const validToken=verify(accessToken, "72564A672EBAC906DACECA4DD53E82A4C7D8570F821B0E917CD7A701BDF6A5CA")
        req.user=validToken;
        console.log(validToken);
        if(validToken)
        {
            return next();
        }
    } catch(err){
        return res.json({error: err});
    }
}
module.exports = {validateToken};