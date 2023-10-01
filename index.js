const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

morgan.token('person-info', (req) => {
  if (req.method === 'POST') {
    const body = JSON.stringify(req.body)
    return body
  }
})

app.use(morgan(':method :url :status - :response-time ms :person-info'));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

// For the main page

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// For the info page

app.get('/info', (req, res) => {
  const RequestTime = new Date().toString();
  res.send(`Phonebook has info of ${persons.length} people. <br> ${RequestTime}`)
})

// For looking at all the persons

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// For looking for a specific person

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => {
    console.log(person.id, typeof person.id, id, typeof id, person.id === id)
    return person.id === id
  })
  console.log(person)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// For deleting a person

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

// For adding a new person

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.floor(Math.random() * 100)
    : 0;
  return maxId + 1;
};

app.post('/api/persons', (req, res) => {
  const body = req.body

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  if (!body.name || !body.number) {
    console.log('Name and number are required');
    return res.status(400).json({
      error: 'name and number are required'
    })
  }


  const NameExists = persons.some(person => person.name === body.name)

  if (NameExists) {
    console.log("name must be unique")
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  persons = persons.concat(person)
  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})