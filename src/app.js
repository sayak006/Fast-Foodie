//DATA STORED IN MONGODB
require('dotenv').config({path: '../.env'})
const express=require('express')
const app=express()
const path=require('path')
const hbs=require('hbs')
require("./db/conn.js")
const registers=require("./module/register.js")
const bodyparser=require('body-parser')
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const cookieParser=require('cookie-parser')
const auth=require('./middleware/auth.js')

const port=process.env.PORT || 3000;
const server='127.0.0.1'

//EXPRESS SPECIFIC stuffs
app.use('/static',express.static('static'));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

//PUG SPECIFIC stuffs
app.set('view engine','hbs')
app.set('views','./views')

//ENDPOINTS
app.get('/',(req,res)=>{
    res.status('200').render('index')
})
app.get('/home',(req,res)=>{
    res.status('200').render('index')
})
app.get('/login_index',auth,(req,res)=>{
    res.status('200').render('login_index',{userName:req.user.name})
})
app.get('/cart',auth,(req,res)=>{
    res.status('200').render('cart',{userName:req.user.name})
})
app.get('/signup',(req,res)=>{
    res.render('signup')
})
app.post('/signup',async (req,res)=>{
    try{
        const password=req.body.password;
        const confirm_password=req.body.confirm_password;
        if(password===confirm_password)
        {
            const registerUser=new registers({
                name: req.body.name,
                address: req.body.address,
                pincode: req.body.pincode,
                email: req.body.email,
                phone: req.body.phone,
                password:req.body.password,
                confirm_password:req.body.confirm_password
            })

            console.log('the success part '+registerUser)

            const token= await registerUser.generateAuthToken()
            console.log("the token part "+token)
            
            //set the cookie
            res.cookie('jwt',token)

            const registerd= await registerUser.save()
            console.log(registerd)
            res.status(200).render('login_index',{userName:req.body.name})
        }else{
            res.send("Password is not matching")
        }
    }catch(error){
        res.status(404).send(error)
    }
})

app.get('/login',(req,res)=>{
    res.render('login')
})
app.post('/login',async (req,res)=>{
    try{
        const input_email=req.body.email
        const input_password=req.body.password

        const userEmail=await registers.findOne({email:input_email})
        console.log(userEmail.password)
        const isMatch=await bcrypt.compare(input_password,userEmail.password)
        
        // if(userEmail.password===input_password){
        //     res.render("reg_index",{userName:userEmail.name})
        // }else{
        //     res.send("invalid email or password")
        // }
        const token= await userEmail.generateAuthToken()
        console.log("the token part "+token)
        
        //set the cookie
        res.cookie('jwt',token)
        console.log(isMatch)
        if(isMatch){
            res.render('login_index',{userName:userEmail.name})
        }else{
            res.send("invalid email or password")
        }

    }catch(error){
        res.status(404).send("Invalid email or password")
    }
})


app.get('/logout',auth,async(req,res)=>{
    try {
        console.log(req.user)
        //for single logout
        // req.user.tokens=req.user.tokens.filter((currElement)=>{
        //     return currElement.token !== req.token
        // })
        //logout from all devices
        req.user.tokens=[]
        res.clearCookie('jwt')
        console.log('logout successfully')
        await req.user.save()
        res.render('login')
    } catch (error) {
        res.status(500).send(error)  
    }
})
// app.post('/contact',(req,res)=>{
//     var myData=new details(req.body);
//     myData.save().then(()=>{
//         res.send("The user data is saved to database.")
//     }).catch(()=>{
//         res.status(404).send("The user data is not saved to database.")
//     });
// })

app.get('/pizza',(req,res)=>{
    res.render('pizza')
})
app.get('/burger',(req,res)=>{
    res.render('burger')
})
app.get('/chicken',(req,res)=>{
    res.render('chicken')
})
app.get('/login_pizza',auth,(req,res)=>{
    res.render('login_pizza',{userName:req.user.name})
})
app.get('/login_burger',auth,(req,res)=>{
    res.render('login_burger',{userName:req.user.name})
})
app.get('/login_chicken',auth,(req,res)=>{
    res.render('login_chicken',{userName:req.user.name})
})
app.listen(port,server,()=>{
    console.log(`The application is started successfully at http://${server}:${port}/`)
});