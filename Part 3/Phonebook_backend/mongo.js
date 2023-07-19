//no need of this file as we distributed the mongo.js contenets to into it's own module -models>info/still keeping it here
const mongoose = require('mongoose')

const password = process.argv[2]
const url =`mongodb+srv://fullstack:${password}@cluster0.vnfg6td.mongodb.net/phonebookDB?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', phonebookSchema)

if (process.argv.length === 3) {
  // Fetch all entries in the phonebook
  console.log('phonebook:')
  Person.find({}).then((persons) => {
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    });
    mongoose.connection.close()
  });
} else if (process.argv.length === 5) {
  // Add a new entry to the phonebook
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  });
} else {
  console.log('Invalid command-line arguments.')
  mongoose.connection.close()
}

