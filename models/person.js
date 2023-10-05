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
      minlength: 8,
      validate: {
        validator: function (value) {
      
          const regex = /^(?:\d{2,3}-\d+)$/;
  
          return regex.test(value) && value.length >= 8;
        },
        message: 'Invalid number format. It must be in the format of XX-XXXXXXXX or XXX-XXXXXXXX.',
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