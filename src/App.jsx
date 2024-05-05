import { useState } from "react";
import { useApolloClient } from '@apollo/client'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import { BOOK_ADDED } from './queries'
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import AuthorForm from "./components/AuthorForm"
import LoginForm from "./components/LoginForm"
import Recommendations from "./components/Recommendations"

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  // const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState("authors");

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data)
      window.alert(`New book ${data.data.bookAdded.title} added`)
    }
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
