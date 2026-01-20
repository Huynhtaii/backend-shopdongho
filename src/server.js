import express from "express";
import bodyParser from "body-parser"; //lấý dữ liệu như id , dùng query param
import path from "path";
import configViewEngine from "./configs/viewEngine";
import initWebRoutes from "./Routes/web";
import Connection from "./configs/connectDB";
import initAPIRoutes from "./Routes/api";
import configCors from "./configs/cors";
require("dotenv").config();

let app = express();
//config app
configViewEngine(app); 
//config cors
configCors(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Phục vụ tĩnh thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//test Connection db
Connection();
initAPIRoutes(app);
initWebRoutes(app);
let port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log("App is running at the port: " + port);
});
