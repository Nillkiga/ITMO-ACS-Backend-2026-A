# Лабораторная работа 4. Развёртывание на сервере

Приложение из ЛР3 (`labs/lab3/compose.yaml`) запускается на Ubuntu-сервере в `/opt/myproject`, nginx на хосте проксирует его.

| Файл | Назначение |
| --- | --- |
| `nginx/backend.conf` | конфиг nginx: `/` -> gateway (8010), `/<сервис>/docs/` -> Swagger (8011-8014) |
| `scripts/init-env.sh` | создаёт `.env` из `.env.example` со случайными секретами |

## Порядок (на сервере, пользователь keksik)

```bash
git clone --depth 1 <URL репозитория> /tmp/repo
cp -a /tmp/repo/labs/lab3/. /opt/myproject/
cd /opt/myproject && bash /tmp/repo/labs/lab4/scripts/init-env.sh
docker compose up -d --build && docker compose ps
```

nginx (пользователь с sudo):

```bash
sudo cp /tmp/repo/labs/lab4/nginx/backend.conf /etc/nginx/sites-available/my.conf
sudo nginx -t && sudo systemctl reload nginx
curl -i http://127.0.0.1/api/restaurants
```

## Про compose

- Порты на хост только `127.0.0.1`; БД и RabbitMQ не публикуются (Docker обходит ufw).
- Секреты без значений по умолчанию: нужен `.env`.
- Уникальное имя проекта `restaurant-booking`: на сервере живут и другие compose-проекты.
- Gateway читает `JWT_SECRET`, поэтому compose передаёт его вместе с `JWT_SECRET_KEY`.
