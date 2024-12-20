import express from "express";
import cors from "cors";
import subscriberRouter from "./routers/subscriber.router";
import subscriptionRouter from "./routers/subscription.router";

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
    res.send({message: "Hello From Sarnet Service API"});
});
app.use('/api/subscriber', subscriberRouter);
app.use('/api/subscription', subscriptionRouter);
export const startServer = async () => {
    try {
        app.listen(8081, () => console.log("Aarchid Api started on http://localhost:8081"));
    } catch (error) {
        console.log(error);
    }
}