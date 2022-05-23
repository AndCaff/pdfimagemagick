const im= require('imagemagick');
const CronJob = require('cron').CronJob;
const express = require('express')
const rimraf=require('rimraf')
const fs=require("fs")
const multer=require('multer');
const req = require('express/lib/request');
const { Z_DATA_ERROR } = require('zlib');
const { rejects } = require('assert');
const app = express()


const port = 3000
function asyncIm(cmd){

return new Promise((resolve,reject)=>{
  im.convert(cmd,(err,res)=>{
       if(err){
         reject({stdout:null, stderr:err})

       }else{

          resolve({stdout:true,stderr:null})

       }


  })


})

}

const folder="/app/ramdisk/"

const job = new CronJob('0 */10 * * * *', function() {
	const d = Date.now().toString();
	console.log("limpieza de archivos temporarios");
  let lista=fs.readdirSync(folder)
  for (elem of lista){
      
        let out=elem.toString()
        console.log(out)
        let splited=out.split("-")[1]
        console.log(splited)
        console.log("date " + d)

        if (d- splited >300000){

          if(fs.existsSync(folder+elem)){
            if(fs.lstatSync(folder+elem).isDirectory()){
              
           rimraf(folder+elem,()=>{console.log("eliminado directorio" +folder+elem)})
          }else{

            fs.rm(folder+elem,()=>{console.log("eliminado archivo" +folder+elem)})

          }
         }

        }



  }
});

job.start();
  
  //const upload = multer({ dest: folder })


  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/app/ramdisk/')
    },
    
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({
    storage: storage,
    
    fileFilter: function (req, file, cb) {
      if (file.mimetype != 'application/pdf') {
        return cb(null,false)
      }
      cb(null, true)
    },
    
    limits:{
      fileSize: 2048 * 1024
    } 

  })

  app.post('/pdfconvert',upload.single('file'), function (req, res, next) {
      if(req.file==undefined){
        res.response="bad file" 
        res.sendStatus(400)
      }else{

    let originalname=req.file.originalname
    let filepath=req.file.path
    const filename=req.file.filename
    const imagebase=req.file.filename+".png"
    fs.mkdirSync(filepath+'1')
   
    asyncIm([filepath,'-colorspace', 'RGB', '-alpha' ,'remove' ,filepath+'1'+"/"+imagebase]).then((()=>{
     
      let list=fs.readdirSync(filepath+'1'+"/")
      
      let lista=[]
        for(let elem of list){
            
           lista.push (filepath+'1'+"/"+elem)
    
        }
        
        let instructions=lista.concat([filepath+'1'+'/'+originalname])
        
        asyncIm(instructions).then((result)=>{
          res.sendFile(filepath+'1'+'/'+originalname)
          

        }).catch((err)=>{console.log(err)
        
        
        })
          

    }
    )
   
  ).catch((err)=>{console.log(err) 
  res.status(500)
  })}})




app.listen(port)
console.log("app listening on port" + port)

