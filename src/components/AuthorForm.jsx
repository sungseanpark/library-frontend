import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import Select from 'react-select'

import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const AuthorForm = ({ setError }) => {
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [born, setBorn] = useState('');


  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [  {query: ALL_AUTHORS } ]
  })

  const handleSelectChange = (selectedOption) => {
    setSelectedAuthor(selectedOption);
  };

  const submit = (event) => {
    event.preventDefault()

    if (!selectedAuthor) {
        setError('Please select an author');
        return;
      }


    editAuthor({
      variables: { name: selectedAuthor.value, setBornTo: parseInt(born) },
    })

    setSelectedAuthor(null)
    setBorn('')
  }

  const result = useQuery(ALL_AUTHORS)
  
  if (result.loading)  {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  const authorOptions = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }))

//   useEffect(() => {
//     if (result.data && result.data.editNumber === null) {
//       setError('person not found')
//     }
//   }, [result.data])

  return (
    <div>
      <h2>Set birthyear</h2>

      <form onSubmit={submit}>
      <div>
          <label>Select Author:</label>
          <Select
            value={selectedAuthor}
            onChange={handleSelectChange}
            options={authorOptions}
          />
        </div>
        <div>
          born <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default AuthorForm