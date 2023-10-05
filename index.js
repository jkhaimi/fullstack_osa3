const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

require('dotenv').config()
const Person = require('./models/person')

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

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// For looking for a specific person

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
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

// app.post('/api/persons', (request, response) => {
//   const body = request.body

//   if (body.name === undefined) {
//     return response.status(400).json({ error: 'name missing' })
//   }

//   const person = new Person ({
//     id: generateId(),
//     name: body.name,
//     number: body.number
//   })

//   person.save().then(savedPerson => {
//     response.json(savedPerson)
//   })


//   if (!body.name || !body.number) {
//     console.log('Name and number are required');
//     return response.status(400).json({
//       error: 'name and number are required'
//     })
//   }


//   const NameExists = persons.some(person => person.name === body.name)

//   if (NameExists) {
//     console.log("name must be unique")
//     return res.status(400).json({
//       error: 'name must be unique'
//     })
//   }

//   persons = persons.concat(person)
//   res.json(person)
//   console.log(person)
// })

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name and number are required' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then(savedPerson => {
    response.json(savedPerson);
  }).catch(error => {
    console.error('Error saving person:', error);
    response.status(500).json({ error: 'Internal server error' });
  });
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})