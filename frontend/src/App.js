import { useState, useEffect } from 'react'
import './App.css'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/personService'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')


  useEffect(() => {
    personService.getPersons().then(data => setPersons(data))
  }, [])


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id)
    if (window.confirm("Are you sure you want to delete this person?")) {
      personService.deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setSuccessMessage(`Deleted ${personToDelete.name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        })
    }
  }

  const addPerson = (event) => {
    event.preventDefault();
  
    const newPerson = {
      name: newName,
      number: newNumber,
    };
  
    const existingPerson = persons.find((person) => person.name === newName);
  
    if (existingPerson) {
      if (existingPerson.number === newNumber) {
        // Henkilö samalla nimellä ja numerolla on jo olemassa
        setErrorMessage(
          `Person '${newName}' with the number '${newNumber}' is already on the list`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)

        setNewName('');
        setNewNumber('');
      } 
      
      else {
        // Henkilö samalla nimellä mutta eri numerolla on olemassa
        const confirmMessage = `${newName} is already added to the phonebook. Do you want to update the old number with the new number?`;
        if (window.confirm(confirmMessage)) {
          const updatedPerson = { ...existingPerson, number: newNumber };
          personService.updatePerson(existingPerson.id, updatedPerson)

            .then((data) => {
              setPersons(persons.map((person) => (person.id === data.id ? data : person)));
              setSuccessMessage(
                `The number of ${newName} was changed successfully`
              );
              setTimeout(() => {
                setSuccessMessage(null);
              }, 3000);
              setNewName('');
              setNewNumber('');
            })
            
            .catch((error) => {
              setErrorMessage(`Information of '${newName}' has already been removed from the server`);
              setTimeout(() => {
                setErrorMessage(null);
              }, 3000);
            });
        }
      }}

      // Nimi tai numero puuttuu
   else {
    if (!newName || !newNumber) {
      setErrorMessage("Name and number are required");
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      // Nimi lisätään onnistuneesti
    } else {
      personService
        .addPerson(newPerson)
        .then((data) => {
          setPersons(persons.concat(data));
          setSuccessMessage(`${newName} added successfully`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
          setNewName('');
          setNewNumber('');
        })
        .catch((error) => {
          if (error.response || error.response.data || error.response.data.message) {
            setErrorMessage(error.response.data.error);
            
          } else {
            setErrorMessage("An error occurred while processing your request.");
          }
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        });
    }
  }
};

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()))

 
  return (
    <div>
      <h2>Phonebook</h2>

      <Notification errorMessage={errorMessage} successMessage={successMessage} />

      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange}/>

      <h3>add a new</h3>

      <PersonForm newName={newName} newNumber={newNumber} addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>

      <h3>Numbers</h3>

      <Persons filteredPersons={filteredPersons} handleDelete={handleDelete}/>
    </div>
  )

}

export default App