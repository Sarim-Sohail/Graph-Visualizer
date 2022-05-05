const fs = require('fs');
const readline=require('readline');
const readable=require('stream').Readable
const express=require("express")
const app=express()
const path=require('path')
const port=3000;
let inputFile='./data1.txt';
var http=require('http')
var formidable=require('formidable')
let outputFile='./data.json';
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
app.use(express.static(path.join(__dirname,"")));


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.get('/', (req, res) => {
    res.redirect("index.html")
  })

  app.get('/fileSubmit', (req, res) => {
    res.redirect("fileSubmit.html")
  })

app.post('/fileupload',upload.single("filetoupload"),(req,res,next)=>{
    console.log("meow");
    
    
    const file=req.file;
    console.log("meow");
    const multerText = Buffer.from(file.buffer).toString("utf-8"); // this reads and converts the contents of the text file into string

    const result = { // the final object which will hold the content of the file under fileText key.
      fileText: multerText,
    };
    fs.writeFile('data1.txt', result["fileText"], function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
        readData();
      });
    
    res.redirect("index.html");
});



  app.listen(port, () => {
    console.log("listening");
  })

function readData(){
    const allFileContents = fs.readFileSync(inputFile, 'utf-8');
    let numnod = 0;
    let linecounter = 0
    lines = allFileContents.split(/\r?\n/);
    numnod = parseInt(lines[2]);
    let solve = parseInt(lines[lines.length-1]);
    let data = {
        // "solveFor": solve,
        "nodes":[],
        "edges":[]
    };
    let nodecounter = 0;
    let emptylinecounter = 0;
    let numedges = 0;
    let sourcecounter=0;
    lines.forEach(line =>  {
    
        if(!(linecounter < 4)) {
            if (nodecounter < numnod) {
                let splittedline = line.split(/\t/);
                data["nodes"].push({
                    "id": parseInt(splittedline[0]),
                    "x": parseFloat(splittedline[1])*1000,
                    "y": parseFloat(splittedline[2])*1000
                })
                nodecounter++;
            }
            if (emptylinecounter == 1) {
                let splittedline = line.split(/[ \t]/);
                //parseInt(splittedline[0]);
                for(let i = 0; i < (splittedline.length - 2) / 4; i++) {
                    // 1 + (4 * i);
                    // 3 + (4 * i);
                    data["edges"].push({
                        "id": numedges,
                        "source": sourcecounter,
                        "target": parseFloat(splittedline[1 + (4 * i)]),
                        "weight": parseFloat((parseFloat(splittedline[3 + (4 * i)])/10000000).toFixed(2))
                    })
                    numedges++;
    
                }
                sourcecounter++;
            }
            if (line == '') {
                emptylinecounter++;
            }
    
        }       
        
    
            //JSON.parse(line);
            
            //fs.writeFile(outputFile,line,err=>{});
        linecounter++;
    });
    fs.writeFile(outputFile,JSON.stringify(data, null, 4),err=>{});
    console.log(JSON.stringify(data, null, 4))
    console.log(numnod);
    console.log(solve);
}

