const http = require('http')
const url = require('url')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const { random, chunk,} = require('lodash')
const crypto = require('crypto')

function createHmac(rounds,password){
    const salt = crypto.randomBytes(Math.ceil(rounds/2)).toString('hex').slice(0,rounds)
    const hash = crypto.createHmac('sha512',salt).update(password).digest('hex')
    return {
        salt : salt,
        hash :hash
    }
   //  return crypto.createHmac('sha512',crypto.randomBytes(Math.ceil(rounds/2)).toString('hex').slice(0,rounds)).update(password).digest('hex')
}
require('dotenv').config()
var body=""
const con = mysql.createConnection({
    port:process.env.PORT,
    host:"localhost",
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE

})
con.connect((err)=>{
    // const userid = random(0,9999999)
    // const username = "usertest"
    // const password ="something"
    // const query = "SELECT * FROM LOGINUSER";
    // const insert = `INSERT INTO loginuser (username, password, userid) VALUES ('${username}', '${password}', '${userid}')`;
    // if(err) throw err
    if(err)
    console.log("Database cannot connected?")
    // con.query(insert,(err,result,fields)=>{
    //     if(err) throw err
    //     console.log(result)
      
    // })
})

http.createServer((req,res)=>{
    var q = url.parse(req.url,true)
    if(req.method=="GET"){
        if(q.pathname=="/cookietesting"){
            if(req.headers.cookie){
            console.log(req.headers.cookie)
            res.end()}
            else{
            res.writeHead(200,{"Set-Cookie":'cookiename=cookievalue',"Access-Control-Allow-Origin":'*'})
            res.end()}
        }
     var query = q.query
    if(q.pathname=="/json"){

        res.write(q.pathname)
        res.end()
        console.log(query.ad)
        console.log(query)
        console.log(query['ad'])
    }
   
}
    if(req.method=="POST"){
        if(q.pathname=="/jsoncreateuser"){
           
            var data = ""
            req.on("data",(chunk)=>{
                data +=chunk
            })
            req.on("end",()=>{
               console.log(data)
                
              //  console.log(typeof(data))
               data = JSON.parse(data) //for content-type header:application/json
             //  data = JSON.stringify(data) //for content-type header:text/plain
               // console.log(data)
                dataPassword = createHmac(random(1,14),data.password)
                const userid = random(0,99999999)
                const query = `INSERT INTO loginuser(username,password,salt,userid ) VALUES ('${data.username}','${dataPassword.hash}','${dataPassword.salt}','${userid}')`;
                    con.query(query,(err,result)=>{
                        if (err) throw err
                       // console.log('Users Registered')
                        // console.log(result)
                        const query2 = `SELECT * FROM loginuser where userid=${userid}`
                        con.query(query2,(err,result2)=>{
                            if (err) throw err
                            //console.log(result2[0])
                            //console.log(result2[0].constructor.name)
                            //console.log(typeof(result2))

                            const token = jwt.sign({"username":result2[0].username,"userid":result2[0].userid},process.env.SECRET_KEY)
                            res.writeHead(200,{"jsontoken":token,"Access-Control-Allow-Origin":"*","Access-Control-Expose-Headers":"*"
            })
                            res.write(JSON.stringify({"jsontoken":token,"userid":result2[0].userid}))
                            res.end()
                           // con.end()
                        })
                    })
            })
           
        }
        if(q.pathname=="/login"){
           let logindata = ""
            req.on('data',(chunk)=>{
                logindata+=chunk
            })
            req.on('end',()=>{
              const  data = JSON.parse(logindata)
              try{
              con.query(`SELECT salt FROM LOGINUSER WHERE userid = ${data.username}`,(err,result)=>{
                // if (err) throw err
                if(err){
                    res.writeHead(200,{"Access-Control-Allow-Origin":"*"})
                res.write(JSON.stringify({"data":"false"}))
                res.end()
                }
                else{
                    if(!result.length){
                        res.write(JSON.stringify({"data":"false"}))
                        res.end()}
                        else {
                      data.password = crypto.createHmac('sha512',result[0].salt).update(data.password).digest('hex')
                      const query = `SELECT * FROM loginuser WHERE userid='${data.username}' AND password = '${data.password}'`
                     try{
                      con.query(query,(err,result)=>{
                      // if (err) throw err
                      if(err){
                        res.writeHead(200,{"Access-Control-Allow-Origin":"*"})
                        res.write(JSON.stringify({"data":"false"}))
                        res.end()
                      }
                      else{
                        if(!result.length){
                            res.writeHead(200,{"Access-Control-Allow-Origin":"*"})
                            res.write(JSON.stringify({"data":"false"}))
                            res.end()}
                            else{
                                const token = jwt.sign({"username":result[0].username,"userid":result[0].userid},process.env.SECRET_KEY)
                                res.writeHead(200,{"Access-Control-Allow-Origin":"*"})
                                res.write(JSON.stringify({"jsontoken":token,"userid":result[0].userid}))
                                res.end()}
                      }
                        
                      })}
                    catch{
                        res.writeHead(200,{"Access-Control-Allow-Orsigin":"*"})
                            res.write(JSON.stringify({"data":"false"}))
                            res.end() 
                    }
                    }
                }
                
              })}
              catch{
                res.writeHead(200,{"Access-Control-Allow-Orsigin":"*"})
                res.write(JSON.stringify({"data":"false"}))
                res.end()
              }
              
            })
        }
        if(q.pathname=="/verifyjwt")
       {let clientdata="";
        req.on('data',(chunk)=>{
                    clientdata+=chunk
        })
        req.on('end',()=>{
            const jswt = JSON.parse(clientdata)["jsontoken"]
            try {
                const  verify = jwt.verify(jswt,process.env.SECRET_KEY) 
                if (verify){
                    console.log(verify)
                    res.writeHead(200,{"Access-Control-Allow-Origin":"*"})
                    console.log("user verified")
                    res.write(JSON.stringify({"verify":"true","userid":verify.userid}))
                    res.end()
                }
            }catch{
               
                res.writeHead(200,{"Access-Control-Allow-Origin":"*"})
                res.write(JSON.stringify({"verify":"false"}))
                    res.end()
                    console.log("invalid user")
            }
        })
        
       
        
       
       }        
       // req.on('data',(data)=>{
        //     body +=data
        //     console.log(body)
        // })
        // req.on("end",()=>{
        //     const details = JSON.parse(body)    
                   
        //     console.log(details)
        //     console.log(body.first)
        //     console.log(body)  
        //     console.log(details.first)
        //     res.write(JSON.stringify(details))
        //     res.end()
        //     console.log(process.env)
        // })
    }
}).listen(80)