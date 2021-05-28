import express from "express"
import createError from "http-errors"
import { getFilePath, getItems, getSingleItem,getItemsExceptItem, writeItems } from "../util/fs-tools.js"
import { checkMovieSchema, checkValidation } from "../util/validation.js"
import {nanoid} from "nanoid"
import {pipeline} from "stream"
import { createPDF } from "../util/pdf.js"
import { getMovie, getQueryResult } from "../util/fetch.js"
const mr = express.Router()

const filePath = getFilePath("movies.json")


mr.get("/", async (req, res,next) => {
  try {
    const movies = await getItems(filePath)
    res.status(200).send(movies)
  } catch (error) {
    console.log(error)
    next(error)
  }
})
mr.get("/:id", async (req, res,next) => {
  try {
    // const item = await getSingleItem(filePath, req.params.id)
    const item = await getMovie(req.params.id)
    item?res.status(200).send(item):next(createError(404, {"message": "notFound"}))
  } catch (error) {
    console.log(error)
    next(error)
  }
})

mr.get("/search/:query", async (req, res,next) => {
  try {
    // const item = await getSingleItem(filePath, req.params.id)
    if(req.params.query.includes("&")){
      const result = await getQueryResult(req.params.query, req.params.query.split("&")[1])
      result?res.status(200).send(result):next(createError(404, {"message": "notFound"}))
    }else{
      const result = await getQueryResult(req.params.query)
      result?res.status(200).send(result):next(createError(404, {"message": "notFound"}))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

mr.get("/:id/pdf", async (req, res,next) => {
  try {
    const item = await getSingleItem(filePath, req.params.id)
    if(item){
      res.setHeader("Content-Disposition", `attachment; filename=${item.Title}.pdf`)
      const stream = await createPDF(item)
      pipeline(stream,res, err => next(err))
    } else{
      next(createError(404, {"message": "notFound"}))
    }   
  } catch (error) {
    console.log(error)
    next(error)
  }
})

mr.put("/:id",checkMovieSchema,checkValidation, async (req, res,next) => {
  try {
    const item = await getSingleItem(filePath, req.params.id)
    item?res.status(201).send({imdbID:item.imdbID}):next(createError(404, {"message": "notFound"}))
    const items = await getItemsExceptItem(filePath,req.params.id)
    const updatedItem = {...req.body, imdbID:item.imdbID}
    items.push(updatedItem)
    await writeItems(filePath,items)
  } catch (error) {
    console.log("moviePut",error)
    next(error)
  }
})
mr.post("/",checkMovieSchema,checkValidation,async (req, res,next) => {
  try {
    const movies = await getItems(filePath)
    const newItem = {...req.body, imdbID:nanoid()}
    movies.push(newItem)
    await writeItems(filePath,movies)
    res.status(201).send({imdbID:newItem.imdbID})
  } catch (error) {
    console.log(error)
    next(error)
  }
})


mr.delete("/:id", async (req, res,next) => {
  try {
    const item = await getSingleItem(filePath, req.params.id)
    item?res.status(204).send():next(createError(404, {"message": "notFound"}))
    const items = await getItemsExceptItem(filePath,req.params.id)
    await writeItems(filePath,items)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default mr