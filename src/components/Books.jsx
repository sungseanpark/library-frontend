import { useState } from 'react'
import { useQuery, useSubscription } from '@apollo/client'
import { ALL_BOOKS_BY_GENRE, BOOK_ADDED, ALL_BOOKS } from '../queries'
import { updateCache } from '../App'

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState(null)

  const { loading: loadingByGenre, error: errorByGenre, data: dataByGenre } = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre: genreFilter },
  })

  const { loading, error, data } = useQuery(ALL_BOOKS, {})

  const genres = Array.from(
    new Set(data ? data.allBooks.flatMap(book => book.genres) : [])
  )

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      if (!genreFilter || addedBook.genres.includes(genreFilter)) {
        updateCache(client.cache, { query: ALL_BOOKS_BY_GENRE, variables: { genre: genreFilter } }, addedBook, genreFilter)
      }
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook, genreFilter)
    },
  })

  if (!props.show) {
    return null
  }

  if (loading || loadingByGenre) {
    return <div>loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }
  if (errorByGenre) {
    return <div>Error: {errorByGenre.message}</div>
  }

  const books = genreFilter ? dataByGenre.allBooks : data.allBooks

  const genreSelected = genreFilter
    ? `in genre: ${genreFilter}`
    : null

  return (
    <div>
      <h2>Books</h2>
      <div>{genreSelected}</div>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map(book => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => setGenreFilter(genre)}
            disabled={genre === genreFilter}
          >
            {genre}
          </button>
        ))}
        <button onClick={() => setGenreFilter(null)}>All genres</button>
      </div>
    </div>
  )
}

export default Books
