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

          return /^[0-9]{2,3}-[0-9]+$/.test(value); 
        },
        message: 'Puhelinnumero ei ole oikeassa muodossa',
      },
    },
  });

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.id
  }
})

module.exports = mongoose.model('Person', personSchema)