const express= require("express")
const bodyParser= require("body-parser")
const cors= require("cors")
const db= require("../config")
const app= express()
const md5= require("md5")
const moment = require("moment")
const router= express.Router()

router.post("/peminjaman_buku", (req,res)=>{
    let data = {
        id_siswa: req.body.id_siswa,
        id_petugas: req.body.id_petugas,
        tgl_pinjam: moment().format('YYYY-MM-DD'),
        tgl_kembali: moment().format('YYYY-MM-DD')
    }
    let peminjaman_buku = JSON.parse(req.body.id_buku)
    let sql = "insert into peminjaman_buku set ?"

    db.query(sql, data, (error,result)=>{
        let response = null

        if(error){
            res.json({message: error.message})

        }else{
            let lastID = result.insertID
            let data= []
            for (let index = 0; index < peminjaman_buku.length; index++){
                data.push([
                    lastID, peminjaman_buku[index].id_peminjaman_buku
                ])
            }
            let sql = "insert into detail_peminjaman_buku values ?"
            
            db.query(sql, [data], (error, result)=>{
                if(error){
                    res.json({message: error.message})

                }else{
                    res.json({message: "Data has been inserted"})
                }
            })
        }
    })
})

module.exports = router;