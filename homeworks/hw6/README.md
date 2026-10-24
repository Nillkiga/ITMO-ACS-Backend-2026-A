# ДЗ6. Автодеплой через GitHub Actions

Workflow: `.github/workflows/deploy.yml`. Триггер: push в `main` (и ручной запуск). `*.md`, `*.pdf`, `*.docx` деплой не запускают.

1. **check** - `docker compose config`.
2. **deploy** - `git archive` коммита -> по SSH на сервер в `/opt/myproject` -> `docker compose up -d --build` -> ожидание healthy -> запрос к gateway -> вывод SHA.

`.env` на сервере не перезаписывается (его нет в репозитории).

## Секреты репозитория

| Имя | Значение |
| --- | --- |
| `SSH_HOST` | внешний IP сервера |
| `SSH_PORT` | `2222` |
| `SSH_USER` | `keksik` |
| `SSH_KEY` | приватный ключ (файл целиком, с BEGIN/END) |
| `SSH_KNOWN_HOSTS` | вывод `ssh-keyscan -p 2222 <IP>` |

## Ограничения

Откат не реализован, HTTPS нет, удалённые из репозитория файлы на сервере остаются.


grklermnotrejntretreion