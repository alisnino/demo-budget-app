# Demo Budget App

## Concept

This is a simple budget app that allows users to input their income and expenses and see their balance.
The main objective of this project is understangind AWS CDK and using GitHub Actions to deploy the apps to ECS tasks.

### Project Structure

#### app/

The main application code is here, including Dockerfiles and app-specific env files.

##### About the Python interpreter

Coding with VSCode might be easier if you setup venv first (the recommended Python version is noted at `/main/backend/.python-version`).

```
python3 -m venv .venv
```

Then, activate the venv:

```
source .venv/bin/activate
```

Or reload the VSCode window and it should take care of things for you.

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
