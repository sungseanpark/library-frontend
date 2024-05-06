import { useState } from "react";
import { useApolloClient } from '@apollo/client'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import { BOOK_ADDED, ALL_BOOKS } from './queries'
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import AuthorForm from "./components/AuthorForm"
import LoginForm from "./components/LoginForm"
import Recommendations from "./components/Recommendations"

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook, genreFilter) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, (data) => {
    const allBooks = data.allBooks

    // If no genre filter, add the book to the list
    if (!genreFilter) {
      return {
        allBooks: uniqByName(allBooks.concat(addedBook)),
      }
    }

    // If genre filter, add the book to the list only if it matches the genre
    if (addedBook.genres.includes(genreFilter)) {
      return {
        allBooks: uniqByName(allBooks.concat(addedBook)),
      }
    }

    // If the book doesn't match the genre filter, return the existing list
    return data
  })
}

// function that takes care of manipulating cache
// export const updateCacheByGenre = (cache, query, addedBook, genre) => {
//   // helper that is used to eliminate saving same book twice
//   const uniqByName = (a) => {
//     let seen = new Set()
//     return a.filter((item) => {
//       let k = item.name
//       return seen.has(k) ? false : seen.add(k)
//     })
//   }

//   cache.updateQuery(query, ({ allBooks }) => {
//     if(!genre){
//       return {
//         allBooks: uniqByName(allBooks.concat(addedBook)),
//       }
//     }
//     else if(genre === addedBook.genre){
//       return {
//         allBooks: uniqByName(allBooks.concat(addedBook)),
//       }
//     }
//     else{
//       return {
//         allBooks: uniqByName(allBooks)
//       }
//     }
//   })
// }

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  // const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState("authors");

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })

  // const notify = (message) => {
  //   setErrorMessage(message)
  //   setTimeout(() => {
  //     setErrorMessage(null)
  //   }, 10000)
  // }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage("authors")
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage("authors")}>authors</button>
          <button onClick={() => setPage("books")}>books</button>
          <button onClick={() => setPage("login")}>login</button>
        </div>
  
        <Authors show={page === "authors"} />
  
        <Books show={page === "books"} />
  
        <LoginForm show={page === "login"} setToken={setToken} setPage={setPage}/>
      </div>
    );
    
  }



  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommendations")}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === "authors"} />

      <AuthorForm show={page === "authors"} />

      <Books show={page === "books"} />

      <Recommendations show={page === "recommendations"} />

      <NewBook show={page === "add"} />
    </div>
  );
};

export default App
