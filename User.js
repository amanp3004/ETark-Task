const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user.js');
require('../db/mongoose.js')
const { ObjectID } = require('mongodb');
const auth = require('../middleware/auth.js');

const router = new express.Router();

router.post('/signup', async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    }catch(e){
        res.status(400).send(e);
    }  
})

router.post('/login', async (req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user , token});
    } catch (error) {
        res.status(400).send();
    }
})

router.get('/home', auth , async (req,res)=>{
    res.send(req.user);
});

module.exports = router;