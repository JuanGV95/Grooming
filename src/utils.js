//import multer from 'multer';
import path from 'path';
import url from 'url';


const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename)


// No se como añadirlo con websockets
// export const storage = multer.diskStorage({
//     destination: (req, file, callback) =>{
//         const folderPath = path.join(__dirname, '../public/img');
//         callback(null, folderPath);
//     },
//     filename: (req, file, callback)=>{
//         callback(null, `${Date.now()}-${file.originalname}`)
//     },
// });

