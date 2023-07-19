require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/info');

const app = express();
app.use(express.json());
app.use(cors());

morgan.token('postData', (req) => {
  return JSON.stringify(req.body);
});

app.use(express.static('build'));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

// Route handler to fetch all phonebook entries
app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  }).catch((error) => {
    response.status(500).json({ error: 'Server error' });
  });
});

// Route handler for fetching info
app.get('/info', (request, response) => {
  Person.find({}).then((people) => {
    const currentTime = new Date();
    const numberOfEntries = people.length;
    const html = `<p>Phonebook has info for ${numberOfEntries} people</p><p>${currentTime}</p>`;
    response.send(html);
  }).catch((error) => {
    response.status(500).json({ error: 'Server error' });
  });
});

// Route handler for fetching a specific person by id
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      response.status(400).json({ error: 'Invalid ID format' });
    });
});

// Route handler for deleting a person by id
// app.delete('/api/persons/:id', (request, response) => {
//   const id = request.params.id;
//   Person.findByIdAndRemove(id)
//     .then(() => {
//       response.status(204).end();
//     })
//     .catch((error) => {
//       response.status(400).json({ error: 'Invalid ID format' });
//     });
// });
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;

  Person.findByIdAndRemove(id)
    .then(deletedPerson => {
      if (deletedPerson) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => {
      response.status(500).json({ error: 'Server error' });
    });
});

// Route handler for adding a new person

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing',
    });
  }

// Check if the name already exists in the database
Person.findOne({ name: body.name })
  .then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({
        error: 'name must be unique',
      });
    }

    // Create a new person using the Person model
    const newPerson = new Person({
      name: body.name,
      number: body.number,
    });

    // Save the new person to the database
    newPerson.save()
      .then(savedPerson => {
        response.json(savedPerson);
      })
      .catch(error => {
        response.status(500).json({ error: 'Server error' });
      });
  })
  .catch(error => {
    response.status(500).json({ error: 'Server error' });
  });
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


// MongoDB connection
// const url = process.env.MONGODB_URI;
// console.log('connecting to', url);

// mongoose
//   .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then((result) => {
//     console.log('connected to MongoDB');
//     const PORT = process.env.PORT || 3001;
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.log('error connecting to MongoDB:', error.message);
//   });

// const express = require('express')
// const morgan = require('morgan')
// const cors=require('cors')
// const app = express()
// app.use(express.json())
// app.use(cors())

// morgan.token('postData', (req) => {
//   return JSON.stringify(req.body);
// });

// app.use(express.static('build'))

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

// app.get('/api/persons', (request, response) => {
//     response.json(persons)
//   })

// app.get('/info', (request, response) => {
//     const currentTime = new Date();
//     const numberOfEntries = persons.length;
//     const html = `<p>Phonebook has info for ${numberOfEntries} people </p><p>${currentTime} </p>`;
//     response.send(html);
//   })

// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = persons.find(person => person.id === id)
//     if (person){
//         response.json(person)
//         console.log(person)
//     }
//     else{
//         console.log(person)
//         response.status(404).end()
//     }
//   })

// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     persons = persons.filter(person => person.id !== id)
  
//     response.status(204).end()
//   })

//   app.post('/api/persons', (req, res) => {
//     const body = req.body;
  
//     if (!body.name || !body.number) {
//       return res.status(400).json({
//         error: 'name or number is missing',
//       });
//     }
  
//     const isDuplicateName = persons.some((person) => person.name === body.name);
//     if (isDuplicateName) {
//       return res.status(400).json({
//         error: 'name must be unique',
//       });
//     }
  
//     const newPerson = {
//       id: generateId(),
//       name: body.name,
//       number: body.number,
//     };
  
//     persons = persons.concat(newPerson);
  
//     res.json(newPerson);
//   });
  
//   const generateId = () => {
//     const minId = 1;
//     const maxId = 100000; // Adjust the range as needed to minimize duplicate ids
//     return Math.floor(Math.random() * (maxId - minId + 1)) + minId;
//   };
  

// const PORT = process.env.PORT || 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
//   })
// .....................
// require('dotenv').config()
// const express = require('express')
// const morgan = require('morgan')
// const cors=require('cors')
// const ppl = require('./models/info')

// const app = express()
// app.use(express.json())
// app.use(cors())

// morgan.token('postData', (req) => {
//   return JSON.stringify(req.body);
// });

// app.use(express.static('build'))

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

// app.get('/api/persons', (request, response) => {
//   ppl.find({}).then(people => {
//     response.json(people)
//   })
//   })

//   app.get('/info', (request, response) => {
//     ppl.find({}).then(people => {
//       const currentTime = new Date();
//       const numberOfEntries = people.length;
//       const html = `<p>Phonebook has info for ${numberOfEntries} people</p><p>${currentTime}</p>`;
//       response.send(html);
//     }).catch(error => {
//       response.status(500).json({ error: 'Server error' });
//     });
//   });


//   app.get('/api/persons/:id', (request, response) => {
//     const id = request.params.id
  
//     ppl.findById(id).then(person => {
//       if (person) {
//         response.json(person)
//       } else {
//         response.status(404).end()
//       }
//     }).catch(error => {
//       response.status(400).json({ error: 'Invalid ID format' })
//     })
//   })


//   app.delete('/api/persons/:id', (request, response) => {
//     const id = request.params.id
  
//     ppl.findByIdAndRemove(id).then(() => {
//       response.status(204).end()
//     }).catch(error => {
//       response.status(400).json({ error: 'Invalid ID format' })
//     })
//   })

 
// app.post('/api/persons', (request, response) => {
//   const body = request.body

//   if (body.content === undefined) {
//     return response.status(400).json({ 
//       error: 'content missing' 
//     })
//   }

//   const person = new ppl({
//     content: body.content,
//     important: body.important || false,
//   })

//   person.save().then(savedPerson => {
//     response.json(savedPerson)
//   })
// })

// const PORT = process.env.PORT
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
//   })