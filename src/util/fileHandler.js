import express from "express"
import {v2 as cloudinary} from "cloudinary"
import {CloudinaryStorage} from "multer-storage-cloudinary"
import  multer  from "multer"
import { getFilePath,  getItemsExceptItem, getSingleItem, writeItems } from "./fs-tools.js"
import createError from "http-errors"
const fr = express.Router()

const filePath = getFilePath("movies.json")

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'movieCover',
  },
});

const parser = multer({ storage: storage });

fr.post('/:id/upload', parser.single("cover"), async (req, res, next) =>{
    try {
      const item = await getSingleItem(filePath, req.params.id)
      if(item){
        item.Poster = req.file.path
        const items = await getItemsExceptItem(filePath, req.params.id)
        items.push(item)
        await writeItems(filePath,items)
        res.status(201).send({imdbID:item.imdbID})
      } else{
        next(createError(404, {"message": "notFound"}))
      }
  } catch (error) {
      next(error)
      console.log("fileUploadPOst", error)
    }
})

export default fr