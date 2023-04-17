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





router.get("/siswa",(req,res)=>{
    let sql = "select * from siswa"

    db.query(sql, (error, result) => {
            let response = null
            if (error) {
                response = {
                    message: error.message
                }
            } else {
                response = {
                    count: result.length,
                    siswa: result
                }
            }
            res.json(response)
        })
})

router.get("/siswa/:id", (req,res)=>{
    let data ={
        id_siswa: req.params.id_siswa
    }
    let sql = " select * from siswa where ?"
    db.query(sql, data, (error, result)=>{
        let response= null
        if(error){
            response={
                message: error.message
            
            }
        }else{
            response={
                count: result.length,
                buku: result
            }
        }
        res.json(response)
    })

})
router.post("/siswa", (req,res)=>{
    let data={
        no_absen: req.body.no_absen,
        nama_siswa: req.body.nama_siswa,
        kelas: req.body.kelas,
        username: req.body.username,
        password: md5(req.body.password)
        

    }
    let sql = "insert into siswa set ?"
    db.query(sql, data, (error, result)=>{
        let response= null
        if(error){
            response = {
                message: error.message
            }
        }else{
            response={
                message: result.affectedRows+ "data inserted"
            }
        }
        res.json(response)
    })
})

router.put("/siswa", (req, res)=>{
    let data= [
        {
        no_absen: req.body.no_absen,
        nama_siswa: req.body.nama_siswa,
        kelas: req.body.kelas,
        username: req.body.username, 
        
        }, 
        {
            id_siswa: req.body.id_siswa
        }
    ]
    let sql= "update siswa set ? where ?"
    db.query(sql, data, (error, result)=>{
        let response= null
        if(error){
            response={
                message: error.message
            }
        }else{
            response={
                message: result.affectedRows+" data updated"
            }
        }
        res.json(response)
    })
})
router.delete("/siswa/:id", (req, res)=>{
    let data={
        id_siswa: req.params.id
    }
    let sql=" delete from siswa where ?"
    db.query(sql, data, (error,result)=>{
        let response = null
        if(error){
            response ={
                message: error.message
            }
        }else{
            response ={
                message: result.affectedRows+"data deleted"
            }
        }
        res.json(response)
    })
})

module.exports = router;