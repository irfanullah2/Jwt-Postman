// Make protected route, get a token, use token to access protected route
const express=require('express');
const jwt=require('jsonwebtoken');

const app=express();
const port = process.env.PORT || 3000;

app.get('/api', (req,res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/post', verifytoken,  (req,res) => {
    jwt.verify(req.token, 'secretkey', {expiresIn: '30s'} ,(err,authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                message:'Post created...',
                authData
            });
        }
    })
    });

app.post('/api/login', (req,res) => {
    //Mock user
    const user={
        id:1,
        username:'asad',
        email:'asad@gmail.com'
    }
    jwt.sign({ user }, 'secretkey', { expiresIn: '30s' }, (err, token) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json({
                token,
                expiresIn: 60 
            });
        }
    });
});

// Format of token 
// Authorization: Bearer <access_token>

// Verify Token 
function verifytoken(req,res,next){
    // Get Auth Value 
    const bearerHeader=req.headers['authorization'];
    // Check if bearer is undefined 
    if(typeof bearerHeader !== 'undefined'){
        // Slpit at the space
        const bearer= bearerHeader.split(' ');
        //Get token from array
        const bearerToken= bearer[1];
        // Set the Token 
        req.token=bearerToken;
        //Next middleware
        next();
    }else{
        // Forbidden
        res.sendStatus(403);
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });