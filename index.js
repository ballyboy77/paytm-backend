const express = require("express");
const {router} = require("./Routes/index")
const cors = require("cors");
const port = process.env.PORT || 3000;

// instead of cors you can use helmet
const bodyParser = require("body-parser");




const App = express();
App.use(cors())
// App.use("/api/v1",Router);

App.use("/",router);

App.use(express.json());


App.get("/",(req,res)=>{
    res.send("<h1><center>Paytm-project")
})

App.listen(port,()=>{
    console.log('port is running')
})

