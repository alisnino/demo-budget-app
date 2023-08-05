# Migration

## Migration file creation

```
docker compose run backend alembic revision --autogenerate -m "Comment here"
```

## Execute migration

docker compose run backend alembic upgrade head
