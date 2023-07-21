const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
console.log('connecting to', url);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });


const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const phoneRegex = /^(?:\d{2,3}-\d+)$/;
        const isLengthValid = value.replace('-', '').length >= 8;

        return phoneRegex.test(value) && isLengthValid;
      } 
    }
  }
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model('Person', phonebookSchema);
module.exports = Person;

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
  })}

 