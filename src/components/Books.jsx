import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)

  const [genreFilter, setGenreFilter] = useState(null)

  if (!props.show) {
    return null
  }
  
  if (result.loading)  {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  // const books = []

  const genres = books.reduce((acc, book) => {
    book.genres.forEach(genre => {
      if (!acc.includes(genre)) {
        acc.push(genre)
      }
    })
    return acc
  }, [])

  const genreSelected = genreFilter
    ? 'in genre'
    : null

  const filteredBooks = genreFilter
    ? books.filter(book => book.genres.includes(genreFilter))
    : books

  return (
    <div>
      <h2>books</h2>

      <div>{genreSelected} <strong>{genreFilter}</strong></div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
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
