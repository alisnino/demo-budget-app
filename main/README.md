# App architecture

## Containers

The app is composed of two containers, one for the frontend and one for the backend. The frontend is a simple NextJS (React) app and the backend is a simple Python app with Flask. For development purposes, a container to setup a local database is also included. Everything should work by using docker compose.

```
docker compose up
```

## Technology stack

### Frontend

- Base: NextJS
- UI: Chakra UI
- ...

### Backend

- Base: Python
- Framework: Flask
- ORM: SQLAlchemy
- ...
