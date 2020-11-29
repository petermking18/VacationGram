import axios from 'axios';

export class VacationGramAPIClient
{

  url = 'http://localhost:8000/api'

  config = {};

  login(email, password)
  {
    return new Promise((resolve, reject) =>
    {
      axios.post(
          `${this.url}/login`,
          {
            "email": email,
            "password": password,
          },
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  register(name, email, password)
  {
    return new Promise((resolve, reject) =>
    {
      axios.post(
          `${this.url}/users`,
          {
            "name": name,
            "email": email,
            "password": password,
          },
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  getUserInfo(id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.get(
          `${this.url}/users/${id}`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  getAllUsers()
  {
    return new Promise((resolve, reject) =>
    {
      axios.get(
          `${this.url}/users`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  deleteUser(id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.delete(
          `${this.url}/users/${id}`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }
}