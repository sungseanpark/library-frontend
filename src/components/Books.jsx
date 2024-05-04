import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS_BY_GENRE } from '../queries'

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState(null)

  const { loading, error, data } = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre: genreFilter }
  })

  if (!props.show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const books = data.allBooks

  const genres = books.reduce((acc, book) => {
    book.genres.forEach(genre => {
      if (!acc.includes(genre)) {
        acc.push(genre)
      }
    })
    return acc
  }, [])

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
          <button key={genre} onClick={() => setGenreFilter(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setGenreFilter(null)}>All genres</button>
      </div>
    </div>
  )
}

export default Books