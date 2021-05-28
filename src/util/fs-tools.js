import {fileURLToPath} from "url"
import {dirname, join} from "path"
import fs from "fs-extra"


export const dataPath = join(dirname(fileURLToPath(import.meta.url)),"../data")

export const getFilePath = (fileName) => join(dataPath, fileName)


export const getItems = async (filePath) => await fs.readJSON(filePath)

export const getSingleItem = async(filePath, id, field="imdbID") => {
  const items = await fs.readJSON(filePath)
  const item = items.find(item => item[field] === id)
  return item
}


export const getItemsExceptItem = async(filePath, id, field="imdbID") => {
  const items = await fs.readJSON(filePath)
  return items.filter(item => item[field] !== id)
}



export const writeItems = async(filePath, data) => await fs.writeJSON(filePath, data)