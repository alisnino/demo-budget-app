import express from "express";
import { expressMiddleware } from "./routes/router";

const app = express();

app.use("/", expressMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
