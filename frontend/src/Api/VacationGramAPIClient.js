import axios from 'axios';

export class VacationGramAPIClient
{

  url = 'http://localhost:8000/api'

  config = {};

  // login(email, password)
  // {
  //   return new Promise((resolve, reject) =>
  //   {
  //     axios.get(`${this.url}/login`, { "email": email, "password": password })
  //       .then(resp => resolve(resp.data))
  //       .catch(resp => alert(resp));
  //   });
  // }

  login(email, password)
  {
    return new Promise((resolve, reject) =>
    {
      axios.post(
          "http://localhost:8000/api/login",
          {
            "email": email,
            "password": password,
          }
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  addUser(name, email, password)
  {
    return new Promise((resolve, reject) =>
    {
      axios.post(`${this.url}/addUser`, { name: name, email: email, password: password }, this.config)
        .then(x =>
        {
          resolve(x.data);
        })
        .catch(x =>
        {
          alert(x);
          reject(x);
        });
    });
  }
}