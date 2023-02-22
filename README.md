What Ales You

# Local dev env vars

```
# Local dev
export DJANGO_DEBUG=True
export DJANGO_SECRET_KEY=a57f413f-79c1-4fd2-9ef3-80ca387f2532
export PG_NAME=postgres
export PG_USER=postgres
export PG_PASSWORD=postgres
export PG_HOST=db # the docker image name
export PG_PORT=5432
export ENVIRONMENT=development
export PORT=8000
```

# Useful commands

- exec into docker container: `docker-compose exec backend python backend/manage.py blah blah`
- enter postgres container: `docker-compose exec db psql -U postgres -W postgres` (password also postgres)
- see docker containers: `docker ps`

# Delete and recreate DB

- `docker-compose exec db psql -U postgres -W postgres`
- `DROP SCHEMA public CASCADE;`
- `CREATE SCHEMA public;`
- `\q` (to quit)
- `docker-compose exec backend python backend/manage.py migrate`
