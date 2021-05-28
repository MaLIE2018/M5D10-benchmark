import express from "express"
import { getFilePath, getItems, getItemsExceptItem, getItemsWithMovieID, getSingleItem, writeItems } from "../util/fs-tools.js"
import {nanoid} from "nanoid"
import { checkCommentSchema, checkValidation } from "../util/validation.js"
import createHttpError from "http-errors"

const cr = express.Router()
const filePath = getFilePath("comments.json")
const filePathMovies = getFilePath("movies.json")

cr.delete("/:id", async(req, res,next) => { //_id
  try {
    const item = await getSingleItem(filePath, req.params.id,"_id")
    item?res.status(204).send():next(createHttpError(404, {"message": "notFound"}))
    const items = await getItemsExceptItem(filePath,req.params.id, "_id")
    await writeItems(filePath,items)
  } catch (error) {
    next(error)
  }
})

cr.get("/:id", async(req, res,next) => { //IMDBID
  try {
    const comments = await getItemsWithMovieID(filePath, req.params.id)
    res.status(200).send(comments)
  } catch (error) {
    console.log(error)
    next(error)
  }
})


cr.post("/:id",checkCommentSchema,checkValidation, async (req, res,next) => { //IMDBID
  try {
    const item = await getSingleItem(filePathMovies, req.params.id)
    // item?res.status(201).send({imdbID:item.imdbID}):next(createHttpError(404, {"message": "notFound"}))
    const comments = await getItems(filePath)
    const newComment = {...req.body, _id:nanoid(), imdbID:req.params.id, createdAt:new Date()}
    comments.push(newComment)
    res.status(201).send({imdbID:req.params.id})
    await writeItems(filePath,comments)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default cr
