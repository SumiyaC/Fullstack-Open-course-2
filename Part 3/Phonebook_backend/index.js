const express = require('express')
const morgan = require('morgan')
const cors=require('cors')
const app = express()
app.use(express.json())
app.use(cors())

morgan.token('postData', (req) => {
  return JSON.stringify(req.body);
});

app.use(express.static('build'))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/info', (request, response) => {
    const currentTime = new Date();
    const numberOfEntries = persons.length;
    const html = `<p>Phonebook has info for ${numberOfEntries} people </p><p>${currentTime} </p>`;
    response.send(html);
  })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person){
        response.json(person)
        console.log(person)
    }
    else{
        console.log(person)
        response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons', (req, res) => {
    const body = req.body;
  
    if (!body.name || !body.number) {
      return res.status(400).json({
        error: 'name or number is missing',
      });
    }
  
    const isDuplicateName = persons.some((person) => person.name === body.name);
    if (isDuplicateName) {
      return res.status(400).json({
        error: 'name must be unique',
      });
    }
  
    const newPerson = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };
  
    persons = persons.concat(newPerson);
  
    res.json(newPerson);
  });
  
  const generateId = () => {
    const minId = 1;
    const maxId = 100000; // Adjust the range as needed to minimize duplicate ids
    return Math.floor(Math.random() * (maxId - minId + 1)) + minId;
  };
  

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  })