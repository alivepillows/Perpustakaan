const express= require("express")
const bodyParser= require("body-parser")
const cors= require("cors")
const db= require("../config")
const multer = require("multer") // untuk upload file
const path = require("path") // untuk memanggil path direktori
const fs = require("fs") // untuk manajemen file
const app= express()
const router= express.Router()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, './image');
    },
    filename: (req, file, cb) => {
        // generate file name 
        cb(null, "image-"+ Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({storage: storage})

router.get("/buku", (req,res)=>{
    let data ={
        id_buku: req.params.id_buku
    }
    let sql = " select * from buku"
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


router.get("/buku/:id", (req,res)=>{
    let data ={
        id_buku: req.params.id_buku
    }
    let sql = " select * from buku where ?"
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
// endpoint untuk menambah data barang baru
router.post("/buku", upload.single("image"), (req, res) => {
    // prepare data
    let data = {
        judul_buku: req.body.judul_buku,
        jml_hal_buku: req.body.jml_hal_buku,
        keterangan_kondisi_buku: req.body.keterangan_kondisi_buku,
        image: req.file.filename
    }

    if (!req.file) {
        // jika tidak ada file yang diupload
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        // create sql insert
        let sql = "insert into buku set ?"

        // run query
        db.query(sql, data, (error, result) => {
            if(error) throw error
            res.json({
                message: result.affectedRows + " data berhasil disimpan"
            })
        })
    }
})

// endpoint untuk mengubah data barang
router.put("/buku", upload.single("image"), (req,res) => {
    let data = null, sql = null
    // paramter perubahan data
    let param = { id_buku: req.body.id_buku }

    if (!req.file) {
        // jika tidak ada file yang dikirim = update data saja
        data = {
            judul_buku: req.body.judul_buku,
        jml_hal_buku: req.body.jml_hal_buku,
        keterangan_kondisi_buku: req.body.keterangan_kondisi_buku
        }
    } else {
        // jika mengirim file = update data + reupload
        data = {
            judul_buku: req.body.judul_buku,
            jml_hal_buku: req.body.jml_hal_buku,
            keterangan_kondisi_buku: req.body.keterangan_kondisi_buku,
            image: req.file.filename
        }

        // get data yg akan diupdate utk mendapatkan nama file yang lama
        sql = "select * from buku where ?"
        // run query
        db.query(sql, param, (err, result) => {
            if (err) throw err
            // tampung nama file yang lama
            let fileName = result[0].image

            // hapus file yg lama
            let dir = path.join(__dirname,"image",fileName)
            fs.unlink(dir, (error) => {})
        })

    }

    // create sql update
    sql = "update buku set ? where ?"

    // run sql update
    db.query(sql, [data,param], (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil diubah"
            })
        }
    })
})

// endpoint untuk menghapus data barang
router.delete("/buku/:id_buku", (req,res) => {
    let param = {id_buku: req.params.id_buku}

    // ambil data yang akan dihapus
    let sql = "select * from buku where ?"
    // run query
    db.query(sql, param, (error, result) => {
        if (error) throw error
        
        // tampung nama file yang lama
        let fileName = result[0].image

        // hapus file yg lama
        let dir = path.join(__dirname,"image",fileName)
        fs.unlink(dir, (error) => {})
    })

    // create sql delete
    sql = "delete from buku where ?"

    // run query
    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil dihapus"
            })
        }      
    })
})

module.exports = router;