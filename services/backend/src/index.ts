import express from "express";
import { expressMiddleware } from "./routes/router";
import cors from "cors";

const app = express();

app.use(
  "/api/",
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  }),
  expressMiddleware
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
