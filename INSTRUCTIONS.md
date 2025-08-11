# Instruções do projeto

## 1. Execução do docker
Para rodar o banco de dados
```
docker compose up
```
```
docker compose up -d
```
</br>

## 2. Execução das migrations
Para criar as tabelas no banco de dados

```
npx knex migrate:latest
```
</br>

## 3. Execução dos seeds
Para popular o banco de dados

```
npx knex seed:run
```

</br>
</br>

## Reset
Para resetar o banco de dados

```
npm run db:reset
```

