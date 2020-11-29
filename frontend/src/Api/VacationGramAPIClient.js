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

  getUserInfo(user_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.get(
          `${this.url}/users/${user_id}`,
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

  deleteUser(user_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.delete(
          `${this.url}/users/${user_id}`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  getUserTrips(user_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.get(
          `${this.url}/users/${user_id}/trips`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  getUserSavedTrips(user_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.get(
          `${this.url}/users/${user_id}/saved`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  addSavedTrip(user_id, trip_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.post(
          `${this.url}/users/${user_id}/saved`,
          {
            "trip_id": trip_id,
          },
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  didUserSaveTrip(user_id, trip_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.get(
          `${this.url}/users/${user_id}/saved/${trip_id}`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  removeSavedTrip(user_id, trip_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.delete(
          `${this.url}/users/${user_id}/saved/${trip_id}`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  getAllTrips()
  {
    return new Promise((resolve, reject) =>
    {
      axios.get(
          `${this.url}/trips`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  getAllTrips()
  {
    return new Promise((resolve, reject) =>
    {
      axios.get(
          `${this.url}/trips`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  createTrip(body, origin, destination, rating, price, title, user_id, reaction_id, image_url)
  {
    return new Promise((resolve, reject) =>
    {
      axios.post(
          `${this.url}/trips/`,
          {
            "body": body,
            "destination": destination,
            "rating": rating,
            "title": title,
            "user_id": user_id,
            "price": price,
            "origin": origin,
            "reaction_id": reaction_id,
            "image_url": image_url,
          },
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  getTrip(trip_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.get(
          `${this.url}/trips/${trip_id}`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  deleteTrip(trip_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.delete(
          `${this.url}/trips/${trip_id}`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  getComments(trip_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.get(
          `${this.url}/trips/${trip_id}/comments`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  postComment(trip_id, user_id, body)
  {
    return new Promise((resolve, reject) =>
    {
      axios.post(
          `${this.url}/trips/${trip_id}/comments`,
          {
            "user_id": user_id,
            "body": body,
          }
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  deleteComment(trip_id, comment_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.delete(
          `${this.url}/trips/${trip_id}/comments/${comment_id}`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  getCommentLikes(trip_id, comment_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.get(
          `${this.url}/trips/${trip_id}/comments/${comment_id}/likes`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  likeComment(trip_id, comment_id, user_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.post(
          `${this.url}/trips/${trip_id}/comments/${comment_id}/likes`,
          {
            "user_id": user_id
          }
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  unlikeComment(trip_id, comment_id, user_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.delete(
          `${this.url}/trips/${trip_id}/comments/${comment_id}/likes/${user_id}`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  getLikes(trip_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.get(
          `${this.url}/trips/${trip_id}/likes`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  likeTrip(trip_id, user_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.post(
          `${this.url}/trips/${trip_id}/likes`,
          {
            "user_id": user_id,
          }
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  didUserLikeTrip(trip_id, user_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.get(
          `${this.url}/trips/${trip_id}/likes/${user_id}`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  unlikeTrip(trip_id, user_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.delete(
          `${this.url}/trips/${trip_id}/likes/${user_id}`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }

  getReactionName(reaction_id)
  {
    return new Promise((resolve, reject) =>
    {
      axios.get(
          `${this.url}/reactions/${reaction_id}`,
        )
        .then(response => resolve(response.data))
        .catch(error => alert(error));
    });
  }
}