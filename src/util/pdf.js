import {pipeline} from "stream"
import fs from "fs-extra"
import {promisify} from "util"
import PdfPrinter from "pdfmake"
import {join, dirname, extname} from "path"
import {fileURLToPath} from "url"
import DatauriParser from "datauri/parser.js"
import fetch from "node-fetch"

const parser = new DatauriParser()



const getDataURI = async (url) => {
  try {
    const res = await fetch(url)
    const buffer = await res.buffer()
    const fileSuffix = extname(url) 
    const dataURI = parser.format(fileSuffix, buffer).content
    return dataURI
  } catch (error) {
    console.log("DataURI",error)
  }
}


export const createPDF = async (item) =>{
  const fontPath = join(dirname(fileURLToPath(import.meta.url)), "./fonts")

  const dataURI = await getDataURI(item.Poster)

  const fonts = {
    Roboto: {
      normal: join(fontPath,'Roboto-Regular.ttf'),
      bold: join(fontPath,'Roboto-Medium.ttf'),
      italics: join(fontPath,'Roboto-Italic.ttf'),
      bolditalics: join(fontPath,'Roboto-MediumItalic.ttf')
    }
  };
  
  const printer = new PdfPrinter(fonts);
  
  
  const docDefinition = {
    content: [
      {
        image: dataURI,
        width: 500
      },
      {
        text: item.Title,
        fontSize: 18
      },
      {
        text: item.Year,
        fontSize: 14
      },
      {
        text: item.Type,
        fontSize: 14
      },
     
    ]
  };
  
  const PDFReadableStream = printer.createPdfKitDocument(docDefinition);
  PDFReadableStream.end()
  return PDFReadableStream
}