import React from 'react';

const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
<form onSubmit={addPerson}>
<p>name: <input value={newName} onChange={handleNameChange} /></p>
<p>number: <input value={newNumber} onChange={handleNumberChange} /></p>
<button type="submit">add</button>
</form>
)};

export default PersonForm;