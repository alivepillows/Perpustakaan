const express= require("express")
const bodyParser= require("body-parser")
const cors= require("cors")
const db= require("../config")
const app= express()
const md5= require("md5")
const moment = require("moment")
const router= express.Router()

router.get("/petugas", (req,res)=>{
    let sql = "select * from petugas"

    db.query(sql, (error, result)=>{
        let response = null
        if (error){
            response ={
                message: error.message
            }
        }else{
            response={
                count: result.length,
                petugas: result
            }
        }
        res.json(response)
    })
})

router.get("/petugas/:id", (req,res)=>{
    let data ={
        id_petugas: req.params.id_petugas
    }
    let sql = " select * from petugas where ?"
    db.query(sql, data, (error, result)=>{
        let response= null
        if(error){
            response={
                message: error.message
            
            }
        }else{
            response={
                count: result.length,
                petugas: result
            }
        }
        res.json(response)
    })

})
router.post("/petugas", (req,res)=>{
    let data={
        nama_petugas: req.body.nama_petugas,
        user: req.body.user,
        password: md5(req.body.password)
       

    }
    let sql = "insert into petugas set ?"
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

router.put("/petugas", (req, res)=>{
    let data= [
        {
        nama_petugas: req.body.nama_petugas,
        user: req.body.user,
        password: md5(req.body.password)
        
        }, 
        {
            id_petugas: req.body.id_petugas
        }
    ]
    let sql= "update petugas set ? where ?"
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
router.delete("/petugas/:id", (req, res)=>{
    let data={
        id_petugas: req.params.id
    }
    let sql=" delete from petugas where ?"
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