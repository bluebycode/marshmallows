# Auth API module for MarshMallows

MarshMallows Auth is an API service which allows users to use the platform. It is required a person or service that acts as administrator. Users will not be able to register themselves in the platform, since an invitation is required. The administrator is the one in charge of managing those invitations.

## Routes

**/ (GET)**: System check. It will return `{ status: 'ok', version: x.x.x }` if everything is working.

**/registration (POST)** Accepts token and username as params. If the token is found in a user and it have not expired, this endpoint will respond with the information needed for the browser to request a webauthn registration. It also updates the user's username

**/registration/callback (POST)** After the webauthn action has been performed, this endpoint will receive the data generated and will save it as a "Key" assigned to a user. It also remove the registration token from the user if the key is saved.

**/login (POST)** Accepts an username. Will respond with the data necessary to perform a webauthn login for that specific user.

**/login/callback (POST)** After the webauthn action has been performed, this endpoint will check that the data from the key is correct and if it is from a key that the user owns. If everything is correct, it returns an "OK", and the user should be considered logged.

**/agent_registration (POST)** Will create an agent token with an expiration date and respond with the token

**/agent_registration/check (POST)** Accepts a token. If the token is found in the database and it has not expired, it returns an "OK", and the agent should be considered registered.

## Development

For installing or start developing this project you will need

* Ruby 2.6.5
* MySQL (mysql-server, libmysqlclient-dev)

A really helpful guide for installing Ruby can be found here: https://gorails.com/setup/

If you have already met the requirements, you will need to define some environment variables, set up the database and install the dependencies (gems):

First of all, create a `.env` file with the following variables and the values needed for connecting to a local database, the port for this app server and the web service. The last two variables are required for the customization of expiration dates.

```
MYSQL_USER="..."
MYSQL_PASS="..."
PORT=...
WEB_URL="..."

USER_TOKEN_EXPIRATION_MINUTES=...
AGENT_TOKEN_EXPIRATION_MINUTES=...
```

Install the required gems

```
$ bundle install
```

Set up the database

```
$ rails db:create
$ rails db:migrate
```

Now you're ready! You just need to start a local server:

```
$ rails server
```
