const express= require("express")
const bodyParser= require("body-parser")
const cors= require("cors")
const db= require("../config")
const app= express()
const md5= require("md5")
const moment = require("moment")
const router= express.Router()
const Cryptr = require("cryptr")
const crypt = new Cryptr("14092006")//ini secretkey


router.post("/siswa/auth", (req,res) =>{
    let param = [
        req.body.username,
        md5(req.body.password)
    ]
    let sql = "select * from siswa where username = ? and password =  ?"

    db.query(sql, param, (error, result)=>{
        if(error) throw error

        if (result.length > 0){
            res.json({
                message: "Logged",
                token: crypt.encrypt(result[0].id_siswa),
                data: result
            })
        }else{
            res.json({
                message: "Invalid username/password"
            })
        }
    })
})
router.post("/petugas/auth", (req,res) =>{
    let param = [
        req.body.user,
        md5(req.body.password)
    ]
    let sql = "select * from petugas where user = ? and password =  ?"

    db.query(sql, param, (error, result)=>{
        if(error) throw error

        if (result.length > 0){
            res.json({
                message: "Logged",
                token: crypt.encrypt(result[0].id_petugas),
                data: result
            })
        }else{
            res.json({
                message: "Invalid username/password"
            })
        }
    })
})
module.exports= router;