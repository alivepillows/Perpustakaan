const express= require("express")
const bodyParser= require("body-parser")
const cors= require("cors")
const app= express()
const multer = require("multer") // untuk upload file
const path = require("path") // untuk memanggil path direktori
const fs = require("fs") // untuk manajemen file
const md5 = require("md5")
const Cryptr = require("cryptr")
const crypt = new Cryptr("14092006")//ini secretkey
const db= require("./config")
const router= express.Router()
const mysql= require("mysql")


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

validateToken = ()=>{
    return (req, res, next)=>{
        if (!req.get("Token")){
            res.json({
                message: "Acces Forbidden"
            })
        }else{
            let token = req.get("Token")
            let decryptToken = crypt.decrypt(token)
            let sql = "select * from siswa where ?"
            let param = {id_siswa: decryptToken}

            db.query(sql, param, (error, result)=> {
                if (error) throw error
                if (result.length > 0) {
                    next()
                }else{
                    res.json({
                        message: "Invalid Token"
                    })
                }
            }) 

            
        }
    }
}

validateToken = ()=>{
    return (req, res, next)=>{
        if (!req.get("Token")){
            res.json({
                message: "Acces Forbidden"
            })
        }else{
            let token = req.get("Token")
            let decryptToken = crypt.decrypt(token)
            let sql = "select * from petugas where ?"
            let param = {id_petugas: decryptToken}

            db.query(sql, param, (error, result)=> {
                if (error) throw error
                if (result.length > 0) {
                    next()
                }else{
                    res.json({
                        message: "Invalid Token"
                    })
                }
            }) 

            
        }
    }
}

const buku = require("./router/buku")
app.use(buku)

const petugas = require("./router/petugas")
app.use("/petugas", validateToken(), petugas)

const user = require("./router/admin")
app.use(user)

const transaksi = require("./router/transaksi")
app.use(transaksi)
// app.use(petugas)
// app.use(siswa)
// app.use(transaksi)

const siswa = require("./router/siswa")
app.use("/siswa",validateToken(), siswa)




app.listen(8000, ()=>{
    console.log("Run on port 5000")
})