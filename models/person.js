const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
  })

  const Person = mongoose.model('Person', personSchema)

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  if (process.argv[3] && process.argv[4]) {
    person.save().then(result => {
      console.log(`added ${person.name} with number ${person.number} to phonebook`)
      console.log(person)
    })}
    else {
        Person.find({}).then(result => {
          console.log("Phonebook:");
          result.forEach(person => {
            console.log(person.name + " " + person.number);
          });
        })
      }

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.id
  }
})


module.exports = mongoose.model('Person', personSchema)