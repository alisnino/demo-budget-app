# Migration

## Migration file creation

```
docker compose run prisma yarn workspace @packages/prisma prisma migrate dev --name <migration-name>
```

## Execute migration

docker compose run prisma yarn workspace @packages/prisma prisma migrate dev --skip-seed
