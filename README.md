# Demo Budget App

## Concept

This is a simple budget app that allows users to input their income and expenses and see their balance.
The main objective of this project is understangind AWS CDK and using GitHub Actions to deploy the apps to ECS tasks.

### Project Structure

#### app/

The main application code is here, including Dockerfiles and app-specific env files.

#### infra/

The infrastructure needed to deploy the app, in code. Coded with AWS CDK. Keep in mind once the infrastructure layout has been defined and deployed once, you won't really deploy it again unless anything changes so this is **NOT** a folder to use in the CI/CD in case you want to fork this repository.
