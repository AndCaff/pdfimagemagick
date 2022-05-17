const im= require('imagemagick');
const uuid=require('uuid')
const { exec } = require("child_process");
const express = require('express')

const fs=require("fs")
const multer=require('multer');
const req = require('express/lib/request');
const app = express()

const filefolder=function (req,res,next){
    
    const tmpfd=uuid.v4();
    const tempfolder=folder+tmpfd;
    exec('mount -t tmpfs -o size=100m myramdisk /tmp/ramdisk',()=>{fs.mkdirSync(tempfolder)});
    res.dest=tempfolder;
    next();
}



//app.use('*',filefolder)
const port = 3000


const folder="/tmp/ramdisk/"
//const storage = multer.diskStorage({
//    destination: function (req, res, cb) {
//      cb(null,res.dest)
//    },
//    filename: function (req, res, cb) {
//      console.log(JSON.stringify(req.body))
//      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//      const name= uniqueSuffix+'.pdf'
//      res.fileSavedName=name
//      cb(null, name)
//    }
///  })
  
  const upload = multer({ dest: folder })

  app.post('/pdfconvert',upload.single('file'), function (req, res, next) {
      
    let originalname=req.file.originalname
    let filepath=req.file.path
    const filename=req.file.filename
    const imagebase=req.file.filename+".png"
    fs.mkdirSync(filepath+'1')
    im.convert([filepath,'-colorspace', 'RGB', '-alpha' ,'remove' ,filepath+'1'+"/"+imagebase],(err,res)=>{
       
      let list=fs.readdirSync(filepath+'1'+"/")
       let lista=[]
        for(let elem of list){
            
           lista.push (filepath+'1'+"/"+elem)
    
        }
        
        let instructions=lista.concat([filepath+'1'+'/'+originalname])
        
        im.convert(instructions,(err,result)=>{
          console.log(res)

        })
    
    
    })
    
    setTimeout(()=>{res.sendFile(filepath+'1'+'/'+originalname)},4000)
    
  })




app.listen(port)
console.log("app listening on port" + port)

