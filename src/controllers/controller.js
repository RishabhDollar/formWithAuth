const bcrypt= require('bcrypt');
const connection  = require('../configs/config'); 
const jwt= require('jsonwebtoken');

module.exports.create= async function create(req, res)
{
    const data= req.body;
    if(!data) return res.send({status: false, message: "Please provide some data.."});
    // console.log(data);
    let Name= data.Name;
    if(!Name) return res.send({status: false, message: "Please provide the Name.."});
    let age= data.age;
    if(!age) return res.send({status: false, message: "Please provide the age.."});
    let DOB= data.DOB;
    if(!DOB) return res.send({status: false, message: "Please provide the DOB.."});
    let phoneNumber= data.phoneNumber;
    if(!phoneNumber) return res.send({status: false, message: "Please provide the phoneNumber.."});
    let email= data.email;
    if(!email) return res.send({status: false, message: "Please provide the email.."});
    let password= data.password;
    if(!password) return res.send({status: false, message: "Please provide the password.."});
    let sql1= ``;
    if(phoneNumber)
    {
        sql1= `SELECT * FROM user WHERE phoneNumber= '${phoneNumber}'`;
    }
    if(email)
    {
        sql1= `SELECT * FROM user WHERE email= '${email}'`;
    }
    connection.query(sql1, (error, results, fields)=>{
        if(error) console.log(error);
        console.log("result",results);
        if(results[0])
        {
            return res.send({status: false, message: "This phone number or email is already registered.."});
        } 
        else
        {
            newPassword(password);
            async function newPassword(password)
            {
                const salt=  await bcrypt.genSalt(10);
                password= await bcrypt.hash(password, salt);
                // let psw= newPassword(password);
                console.log('HERE',Name, age, DOB, phoneNumber, email, password);
                let sql= `INSERT INTO user (Name, age, DOB, phoneNumber, email, password) VALUE ('${Name}', ${age},'${DOB}', '${phoneNumber}', '${email}', '${password}')`;
                try
                {
                    connection.query(sql, (error, results, fields)=>{
                    if(error) console.log(error);
                    else
                    {
                        console.log(results);
                        res.send({status: true, message: "Data uploaded..", data: data});
                    }
                    })
                }
                catch(err)
                {
                    console.log(err);
                    res.send({status: false, message: err});
                }
            }
        }
    });

}

// module.exports.logIn= async function logIn(req, res)
// {
//     const data= req.body;
//     if(!data)return res.send({status: false, message: "Please enter the credentials.."});
//     let sql;

//     if(data.phoneNumber)
//     {
//         let phoneNumber= data.phoneNumber;
//         sql= `SELECT * FROM user WHERE phoneNumber='${phoneNumber}'`;
//         // let hash = otpTool.createNewOTP(phoneNumber,otp,key);
//     }
//     else if(data.email)
//     {
//         let email= data.email;
//         sql=`SELECT * FROM user WHERE email='${email}'`;
//         // let hash = otpTool.createNewOTP(email,otp,key);
//     }

//     connection.query(sql, (err, results, fields)=>{
//         if(err) console.log(err);
//         else 
//         {
//             console.log(results);
//             bcrypt.compare(data.password, results[0].password, function(err, result)
//             {
//                 if(err) console.log(err);
//                 else if(result)
//                 {
//                     let hash = otpTool.createNewOTP(results[0].phoneNumber,otp,key);    //expiresAfter=5
//                     res.send({status: true, hash: hash, message: "Logged In"});
//                 }
//                 else return res.send({status: false, message: "Please provide correct info.."});
//             })
            
//         }
//     })
// }

module.exports.logIn= async function logIn(req,res)
{
    let data= req.body;
    if(!data) return res.send({status: false, message: "Please enter the data.."});
    let password= data.password;
    if(!password) return res.send({status: false, message: "Please enter the password.."});
    data= data.cred;
    if(!data) return res.send({status: false, message: "Please enter the credentials.."});
    let sql=``;
    if(data.includes('@')) sql= `SELECT * FROM user WHERE email='${data}'`;
    else sql=`SELECT * FROM user WHERE phoneNumber='${data}'`;

    try
    {
        connection.query(sql, (error, results, fields)=>{
            if(error) console.log(error);
            else 
            {
                console.log("results",results);
                if(results[0])
                {
                    bcrypt.compare(password, results[0].password, function(err, result)
                    {
                        if(err) console.log(" Error from token", err);
                        else if(result)
                        {
                            let token= jwt.sign({results}, "SecretKey", {expiresIn:"0.5h"});
                            // let token= jwt.sign({Name: results}, "SecretKey", {expiresIn:"0.5h"});
                            res.setHeader("x-api-key", token);
                            res.send({status: true, token: token, message: "LoggedIn.."});
                        }
                        else 
                        {
                            console.log("Password does not match..");
                            res.send({status: false, message: "Password does not match.."});
                        }
                    })
                }
                else return res.send({status: false, message: "Please enter the valid credentials.."});
                // console.log(sql);
            }
        })
    }
    catch(err)
    {
        console.log(err);
    }
}

// module.exports.getAll= async function getAll(req, res)
// {
//     const data= req.body;
//     if(!data) return res.send({status: false, message: "Please provide the data.."});
//     let sql=``;
//     let hash= req.header["x-api-key"];
//     if(data.phoneNumber)
//     {
//         let phoneNumber= data.phoneNumber;
//         sql=`SELECT * FROM user WHERE phoneNumber= '${phoneNumber}'`;
        
//     }
//     if(data.email)
//     {
//         let email= data.email;
//         sql=`SELECT * FROM user WHERE phoneNumber= '${email}'`;
//     }
//     connection.query(sql, (error, results, fields)=>{
//         if(error) console.log(error);
//         else 
//         {
//             console.log(results[0]);
//             if(otpTool.verifyOTP(results[0].phoneNumber, otp, hash, key))
//             {
//                 res.send({status: true, message: results[0]});
//             }
//         }
//     })

// }

module.exports.getAll= async function getAll(req, res)
{
    
    let sql=`SELECT * FROM user`;
    connection.query(sql, (error, results, fields)=>{
        if(error) console.log(error);
        else
        {
            console.log(results);
            res.send({status: true, message: results});
        }
    })
}

module.exports.getData= async function getData(req, res)
{
    let token= req.header('Authorization', 'Bearer');
    console.log('Token from getData...',token);
    if(!token) return res.send({status: false, message: "Token is not present.."});

    let splittingToken= token.split(' ');
    let data= jwt.verify(splittingToken[1], "SecretKey");
    if(!data) return res.send({status: false, message: "Token is not valid.."});
    // console.log("here is the decoded data",data.results[0].phoneNumber);
    let phoneNumber= data.results[0].phoneNumber;
    let sql=`SELECT * FROM user WHERE phoneNumber= '${phoneNumber}'`;
    connection.query(sql, (err, results, fields)=>{
        if(err) console.log(err);
        else
        {
            console.log(results);
            if(results[0]) return res.send({status: true, data: results[0]});
            else
            {
                console.log("No data to show");
                res.send({status: false, message: "No data to show"});
            }
        }
    })
}

module.exports.forgetPassword= async function forgetPassword(req, res)
{
    let data= req.body;
    data= data.cred;
    if(!data) return res.send({statu: false, message: "Please provide either phoneNumber or email address"});
    let sql=``;
    if(data.includes('@')) sql=`SELECT email, phoneNumber FROM user WHERE email='${data}'`;
    else sql=`SELECT * FROM user WHERE phoneNumber= '${data}'`;
    try
    {
        connection.query(sql, (err, results, fields)=>{
            if(err) console.log(err);
            else 
            {
                console.log(results);
                if(results[0])
                {
                    let token= jwt.sign({results}, "SecurityCode", {expiresIn:"0.5h"});
                    res.header("x-api-key", token);
                    res.send({status: true, token: token});
                }
                else 
                {
                    console.log("Wrong data");
                    res.send({status: false, message: "Wrong data.."});
                }
            }
        })
    }
    catch(err)
    {
        console.log(err);
    }


}

module.exports.changePassword= async function changePassword(req, res)  
{
    let data= req.body;
    //data= cred, password, newPassword
    if(!data) return res.send({status: false, message: "Please provide data.."});
    let password= data.password;
    if(!password) return res.send({status: false, message: "Please provide password.."});
    let newPass= data.newPassword;
    if(!newPass) return res.send({status: false, message: "Please provide new password.."});
    if(!data.cred) return res.send({status: false, message: "Please provide either the email or phoneNumber.."});
    let sql=``;
    let email=``;
    let phoneNumber=``;
    // console.log(data);
    if(data.cred.includes('@')) 
    {
        email= data.cred;
        sql=`SELECT password, phoneNumber, email FROM user WHERE email= '${email}'`;
    }
    else
    {
        phoneNumber= data.cred;
        sql=`SELECT password, phoneNumber, email FROM user WHERE phoneNumber= '${phoneNumber}'`;
    }
    connection.query(sql, (err, results, fields)=>{
        if(err) console.log(err);
        else 
        {
            // console.log("Results of select",results);
            email= results[0].email;
            phoneNumber= results[0].phoneNumber;
            // console.log("email", email);

            bcrypt.compare(password, results[0].password, function(error, result)
            {
                if(error) console.log(error);
                else if(result)
                {
                    newPassword(newPass);
                    async function newPassword(newPass)
                    {
                       const salt=  await bcrypt.genSalt(10);
                        let pwd= await bcrypt.hash(newPass, salt);

                        // let psw= newPassword(password);
                        // console.log('HERE',password);
                        // console.log('encrypted password', pwd);

                        let sql= `UPDATE user SET password= '${pwd}' WHERE phoneNumber='${phoneNumber}' AND email= '${email}'`;
                        try
                        {
                            // console.log("phoneNumber", phoneNumber, "email", email, "password",password,"pwd", pwd);

                            connection.query(sql, (error, results, fields)=>{
                            if(error) console.log(error);
                            else
                            {
                                console.log(results);
                                res.send({status: true, message: "Data uploaded..", data: data});
                            }
                            })
                        }
                        catch(err)
                        {
                            console.log(err);
                            res.send({status: false, message: err});
                        }
                    }
                }
                else 
                {
                    res.send({status: false, message: "Email address or PhoneNumber does not matches with the password.."});
                }
            })
        }
    })

}

