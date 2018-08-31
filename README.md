# MyDiary
[![Build Status](https://travis-ci.org/sulenchy/MyDiary.svg?branch=ch-setup-travis-ci)](https://travis-ci.org/sulenchy/MyDiary) [![Maintainability](https://api.codeclimate.com/v1/badges/19d76649374cdf72e37f/maintainability)](https://codeclimate.com/github/sulenchy/MyDiary/maintainability) [![Coverage Status](https://coveralls.io/repos/github/sulenchy/MyDiary/badge.svg?branch=develop)](https://coveralls.io/github/sulenchy/MyDiary?branch=develop)

## MyDiary
MyDiary is an online journal where users can pen down their thoughts and feelings.

## Getting started
### Prerequisites for installation
1. Node js
2. Express
3. Git

### Installation
1. Clone this repository into your local machine:
```git clone https://github.com/sulenchy/MyDiary```
2. Install the dependencies:
```npm install```
3. Start the application by running the start script:
```npm start```
4. Test the endpoint using Postman


#### Run Test
```npm test```

## Gh-pages Link
https://sulenchy.github.io/MyDiary/ui/

## Client side Link
https://sulenchy-my-diary.herokuapp.com/client/index.html

## Template Pages
- /index.html
- /add-edit.html
- /entry-content.html
- /user-day-entries.html
- /user-entries.html
- /user-profile.html

## Heroku Link
https://sulenchy-my-diary.herokuapp.com/api/v1

## API Routes
|   HTTP VERB   | ENDPOINT                  | FUCTIONALITY                                          |
| ------------- | --------------------------| ----------------------------------------------------- |
| GET           | api/v1/entries            | Get all diary entries                                 |
| GET           | api/v1/entries/:id        | Get a specific diary entry                            |
| POST          | api/v1/entries            | Create a new diary entry                              |
| PUT           | api/v1/entries/:id        | Modify an existing diary entry                        |
| POST          | api/v1/auth/signup        | Register a user                                       |
| POST          | api/v1/auth/login         | Login a user                                          |
| DELETE        | api/v1/entries/:id        | Delete an existing entry                              |
| GET           | api/v1/user               | Get a user profile details                            |
| PUT           | api/v1/user               | Update user profile details                           |

# Author
Abudu Abiodun Sulaiman @sulenchy