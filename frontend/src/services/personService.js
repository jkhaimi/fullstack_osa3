import axios from 'axios';

const baseUrl = 'https://fullstack-osa3-01ig.onrender.com/api/persons';

const getPersons = () => {
    return axios.get(baseUrl).then(response => response.data);
}

const addPerson = (newPerson) => {
    return axios.post(baseUrl, newPerson)
    .then(response => response.data);
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const updatePerson = (id, updatedPerson) => {
    return axios.put(`${baseUrl}/${id}`, updatedPerson)
    .then(response => response.data)
    .catch(error => {
        throw error.response.data
    })
}

export default { getPersons, addPerson, deletePerson, updatePerson };
