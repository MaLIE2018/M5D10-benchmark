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

export const getQueryResult = async(query, series="") => {
  let url =""
  if(series) {
    url = `http://www.omdbapi.com/?s=break&apikey=${process.env.OMDB_API_KEY}&${series}`
  }else{
    url = `http://www.omdbapi.com/?s=${query}&apikey=${process.env.OMDB_API_KEY}`
  }
  console.log('url:', url)
    try {
    const res = await fetch(url);
    if (!res.ok) throw new Error()
    const data = await res.json();
    return data
  } catch (error) {
    console.log("fetchMovieOMDB", error)
  }
  
}
