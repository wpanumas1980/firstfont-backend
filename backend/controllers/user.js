const db = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const {username, password, name} = req.body;
    const targetUser = await db.User.findOne({where:{username}});
    
    if(targetUser){
        res.status(400).send({message: "Username already used"});
    }else{
        const salt = bcryptjs.genSaltSync(12);
        const hashedPassword = bcryptjs.hashSync(password,salt);
        await db.User.create({
            username,
            password,
            name,
            password:hashedPassword
        })
        res.status(201).send({message:"User created"});
    }
};

const login = async (req, res) => {
    const {username, password} =req.body;
    const targetUser = await db.User.findOne({where:{username}});
    if(!targetUser){
        res.status(400).send({message:"User not found"});
    }else{
        const isCorrect = bcryptjs.compareSync(password,targetUser.password);
        if(isCorrect){
            const payload = {
                id:targetUser.id,
                name:targetUser.name
            };
            const token = jwt.sign(payload,"codecamp",{expiresIn:3600});
            res.status(200).send({token});
        }else{
            res.status(400).send({message:"Password incorrect"});
        }
    }
};

module.exports = {
  register,
  login
};

/*
const login = async (req, res) => {
    const { username, password } = req.body;
    const targetUser = await db.User.findOne({ where: { username } });
    if (!targetUser) {
        res.status(400).send({ messages: Not FOUND USERNAME: ${username} })
    } else {
        const isCorrect = bcrypt.compareSync(password, targetUser.password)
        if (isCorrect) {
            const payload = {
                id: targetUser.id,
                name: targetUser.name
            }
            const token = jwt.sign(payload, "Good", { expiresIn: 3600 });
            res.status(200).send({ token });
        } else {
            res.status(400).send({ messages: "Invalid username or password" });
        }
    }
};
*/