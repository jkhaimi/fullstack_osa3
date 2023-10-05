const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://jessehaimi:${password}@cluster0.dw6u4kq.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: Number,
    minlength: 1,
    required: true
  },
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

if (person.name && person.number) {
  person.save().then(result => {
    console.log(`added ${person.name} with number ${person.number} to phonebook`)
    mongoose.connection.close()
  })}
  else {
      Person.find({}).then(result => {
        console.log("Phonebook:");
        result.forEach(person => {
          console.log(person.name + " " + person.number);
          mongoose.connection.close()
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
