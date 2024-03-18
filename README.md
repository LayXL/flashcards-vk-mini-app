# flashcards-vk-mini-app

## Команды

### Билд клиента

```shell
git pull && npx yarn build:client
```

### Билд сервера

```shell
git pull && docker compose up -d --build server
```

### Билд клиента и сервера

```shell
git pull && docker compose up -d --build server && npx yarn build:client
```