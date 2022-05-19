const im= require('imagemagick');

const express = require('express')

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

  
  const upload = multer({ dest: folder })

  app.post('/pdfconvert',upload.single('file'), function (req, res, next) {
      console.log(req.file)
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
          fs.rm(filepath+'1',()=>{}),
          fs.rm(filepath,()=>{})

        }).catch((err)=>{console.log(err)
        
        
        })
          

    }
    )
   
  ).catch((err)=>{console.log(err) 
  res.status(500)
  })})




app.listen(port)
console.log("app listening on port" + port)

