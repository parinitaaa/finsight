const express = require("express");
const protect = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");


const router = express.Router();

const cookieOptions={
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 30*24 * 60 * 60 * 1000 //30days
}

const generateToken=(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});
}

router.post("/register", async (req, res) => {
    
        const { name, email, password } = req.body;
        if (!name || !email || !password) { 
            return res.status(400).json({ msg: "Missing fields" });
        }
        const userExists = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ msg: "User already exists, try logging in instead" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, hashedPassword] );  

            const token=generateToken(newUser.rows[0].id);
            res.cookie('token', token, cookieOptions);
            return res.status(201).json({ msg: "Signup successful", user: { id: newUser.rows[0].id, email: newUser.rows[0].email } 
            });
        } );
router.post("/login",async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) { 
            return res.status(400).json({ msg: "Missing fields" });
        }
        const user=await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ msg: "user not available" });
        }
        const userData=user.rows[0];
        const isMatch= await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "wrong password" });
        }
         const token=generateToken(userData.id);
            res.cookie('token', token, cookieOptions);
            return res.status(201).json({ msg: "login successful", user: { id: userData.id,name:userData.name, email:userData.email } 
            });
        } );

router.get('/me',protect,async(req,res)=>{
    res.json(req.user);
});

router.post('/logout',(req,res)=>{
    res.cookie('token','',{ ...cookieOptions, maxAge:1}); //1millisecond
    res.json({msg:'Logged out successfully'});
})

module.exports = router;