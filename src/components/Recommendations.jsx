import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const userResult = useQuery(ME)

  if (!props.show) {
    return null
  }
  
  if (result.loading || userResult.loading)  {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  const genre = userResult.data.me.favoriteGenre

  console.log(genre)


  const filteredBooks = books.filter(book => book.genres.includes(genre))

  return (
    <div>
      <h2>recommendations</h2>

      <div>books in your favorite genre <strong>{genre}</strong></div>

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
    </div>
  )
}

export default Books
