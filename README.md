# Demo Budget App

## Concept

This is a simple budget app that allows users to input their income and expenses and see their balance.
The main objective of this project is understangind AWS CDK and using GitHub Actions to deploy the apps to ECS tasks.

### Project Structure

#### app/

The main application code is here, including Dockerfiles and app-specific env files.

#### infra/

The infrastructure needed to deploy the app, in code. Coded with AWS CDK. Keep in mind once the infrastructure layout has been defined and deployed once, you won't really deploy it again unless anything changes so this is **NOT** a folder to use in the CI/CD in case you want to fork this repository.

### Quick Commands

#### Run the app

```
cd main
docker compose up
```

#### Create a migration file after changing the models

```
cd main
docker compose run backend flask db migrate -m "migration message"
```

#### Apply your new migrations

```
cd main
docker compose run backend flask db upgrade
```

### Other notes

#### Environment variables

To test the backend on your AWS configuration, you might want to set up the following environment variables in `/main/backend/docker/local.env` during local development:

```
AWS_DEFAULT_REGION=
COGNITO_USER_POOL_ID=
COGNITO_CLIENT_ID=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

#### About the Python interpreter

Coding with VSCode might be easier if you setup venv first (the recommended Python version is noted at `/main/backend/.python-version`).

```
python3 -m venv .venv
```

Then, activate the venv:

```
source .venv/bin/activate
```

Or reload the VSCode window and it should take care of things for you.
