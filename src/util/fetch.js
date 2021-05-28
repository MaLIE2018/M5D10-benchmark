import fetch from "node-fetch"

export const getMovie = async(id) => {
  try {
    const res = await fetch(
      `http://www.omdbapi.com/?i=${id}&apikey=${process.env.OMDB_API_KEY}`
    );
    if (!res.ok) throw new Error()
    const data = await res.json();
    return data
  } catch (error) {
    console.log("fetchMovieOMDB", error)
  }
  
}

export const getQueryResult = async(query) => {
  try {
    const res = await fetch(
      `http://www.omdbapi.com/?s=${query}&apikey=${process.env.OMDB_API_KEY}`
    );
    if (!res.ok) throw new Error()
    const data = await res.json();
    return data
  } catch (error) {
    console.log("fetchMovieOMDB", error)
  }
  
}
