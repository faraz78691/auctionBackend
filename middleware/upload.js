const multer=require('multer')
const path=require('path')  
const hash = require('random-hash'); 
const fs = require("fs");

const images = "public/images/";
const video = "public/videos/";
const data = "public/data/"


// Create the destination directory if it doesn't exist
if (!fs.existsSync(images)) {
  fs.mkdirSync(images, { recursive: true });
}

// Create the destination directory if it doesn't exist
if (!fs.existsSync(video)) {
  fs.mkdirSync(video, { recursive: true });
}

const storage_profile = multer.diskStorage({
  destination: function (req, file, cb) {
    let destination;
    console.log("file>>>>", file)

    var ext = path.extname(file.originalname);
    if (ext === ".mp4") {
      destination = video;

    }
    else if(ext === ".kml" || ext === ".geojson")
    {
      destination = data;
    }
    else {
      destination = images;
    }
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const temp = file.originalname.replace(/\s+/g, "").split(".");
    const filename = hash.generateHash({ length: 10 }) + "." + temp[1];
    cb(null, filename);
  },
});


const upload_files = multer({ storage: storage_profile });
module.exports=upload_files;