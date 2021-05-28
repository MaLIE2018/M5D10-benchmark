import express from "express"
import cors from "cors"
import createError from "http-errors"
import { badRequest, catchAll, forbidden, notFound } from "./src/util/errorHandler.js"
import mr from "./src/routes/movies.js"
import cr from "./src/routes/comments.js"
import fr from "./src/util/fileHandler.js"


const app = express()

const {PORT} =  process.env
const whiteList = [process.env.WHITELIST_DEV_URL, process.env.WHITELIST_PROD_URL]

const corsOptions = {
  origin: function(origin, next){
    if(whiteList.indexOf(origin) !== -1){
      next(null,true)
    }else{
      next(createError(403, {"message":"Origin not allowed"}))
    }
  }
}

app.use(cors(corsOptions))
app.use(express.json())


app.use("/movies", mr, fr)
app.use("/comments",cr)

app.use(badRequest, forbidden, notFound, catchAll)

app.listen(PORT, () => {
  console.log("Listening on port " + PORT)
})