**MUST USE NODE VERSION 15.2.1 & NPM VERSION 7.0.8**

## VacationGram
A simple vacation sharing social website to document and discover new trips around the globe.

### Setup instructions

#### node.js setup

Navigate to `./backend` and `.frontend` and run `npm install` (`yarn` also works)

#### docker-compose

Navigate to project root and run `docker-compose up`.
Use `docker-compose up -d` for detached headless start.

#### Once you're finished

From the project root, run `docker-compose down` to shut down the containers. **It is important that you do this**

### Info

#### Login Credentials for Database

If you need to connect to the DB manually, credentials are located in `./backend/.env`

---

##### Based on [a sample docker-compose project](https://github.com/liamlows/Sample_Docker-Compose_Project-CLOUD) by [@liamlows](https://github.com/liamlows)
