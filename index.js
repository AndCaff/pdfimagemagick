const im= require('imagemagick');
const uuid=require('uuid')
const tmpfd=uuid.v4()
const fs=require("fs")
const folder="./temp/" + tmpfd
const filename="dd.pdf"
const imagebase="dd.png"
fs.mkdirSync(folder)
im.convert([filename,'-colorspace', 'RGB', '-alpha' ,'remove' ,folder+"/"+imagebase],(err,res)=>{
    let list=fs.readdirSync(folder)
   let lista=[]
    for(let elem of list){
        
       lista.push (folder+"/"+elem)

    }
    
    let instructions=lista.concat([folder+'/'+filename])
    
    im.convert(instructions)


})


