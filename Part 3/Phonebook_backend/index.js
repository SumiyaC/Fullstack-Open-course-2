require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/info');

const app = express();
app.use(express.json());
app.use(cors());

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

