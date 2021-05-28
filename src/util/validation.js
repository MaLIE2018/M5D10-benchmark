import {validationResult, checkSchema} from "express-validator"
import isNumeric from 'validator/lib/isNumeric.js'
import createError from "http-errors"

const movieSchema = {
    Title: {
      exists:{
        message: "Title is mandatory!"
      },
      isString:{
        message: "Title needs to be String"
      }
    },
    Year: {
      exists:{
        message: "Year is mandatory!"
      },
      isNumeric:{
        message: "Title needs to be number"
      }
    },
    Type: {
      exists:{
        message: "Type is mandatory!"
      },
      isString:{
        message: "Type needs to be String"
      }
    },
    Poster: {
      exists:{
        message: "Title is mandatory!"
      }
    }}

const commentSchema = {
      comment: {
        exists:{
          message: "Comment is mandatory!"
        },
        isString:{
          message: "Comment needs to be String"
        }
      },
      rate: {
        exists:{
          message: "rate is mandatory!"
        },
        isNumeric:{
          message: "rate needs to be number"
        }
      },
      author: {
        exists:{
          message: "Type is mandatory!"
        },
        isString:{
          message: "Type needs to be String"
        }
      }
}
  

export const checkMovieSchema = checkSchema(movieSchema)
export const checkCommentSchema = checkSchema(commentSchema)

export const checkValidation = (req, res, next) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      next(createError(400,{"message": errors}))
    } else{
      next()
    }
  } catch (error) {
    console.log("checkValErro", error)
    next(error)
  }
}
