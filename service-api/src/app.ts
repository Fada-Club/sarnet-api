import express from "express";
import cors from "cors";

const app = express();
app.use(cors({
    origin: function (origin, callback) {
      const allowedOrigins = ['http://localhost:3000','http://localhost:5173'];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true
  }));
app.use(express.json());
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send({message: "Hello From Aarchid API"});
});


export const startServer = async () => {
    try {
        app.listen(8080, () => console.log("Aarchid Api started on http://localhost:8080"));
    } catch (error) {
        console.log(error);
    }
}