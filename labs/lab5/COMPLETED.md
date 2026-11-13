# ЛР5: Настройка Ansible - выполнено

## Что сделано

### 1. Доработка ЛР4 (Healthcheck + CI/CD)
✅ Добавлены health эндпоинты во все микросервисы (`/health`)
✅ Создан скрипт `scripts/healthcheck.sh` для проверки всех сервисов
✅ Разделён CI/CD pipeline на 3 job: `check` → `deploy` → `healthcheck`
✅ Добавлена интеграция мониторинга (Grafana, Prometheus, Loki, Promtail)
✅ Обновлён `docker-compose.yaml` с мониторингом
✅ Docker Compose теперь обновляет только изменённые контейнеры

### 2. Структура ЛР5 (Ansible)
Создана полная структура для автоматизации настройки серверов:

```
labs/lab5/
├── ansible.cfg                      # Конфигурация Ansible
├── inventory/
│   └── hosts.yml                   # Описание целевых серверов
├── group_vars/
│   └── all.yml                     # Переменные для всех хостов
├── playbooks/
│   ├── setup.yml                   # Полная настройка сервера
│   ├── quick-setup.yml             # Быстрая настройка (Docker + Nginx)
│   ├── deploy.yml                  # Деплой приложения
│   └── update.yml                  # Обновление пакетов
├── roles/
│   ├── common/                     # Базовая настройка системы
│   ├── docker/                     # Установка Docker + Compose
│   ├── nginx/                      # Nginx reverse proxy
│   ├── security/                   # UFW, SSH hardening, Fail2ban
│   └── app/                        # Подготовка приложения
├── bootstrap.sh                     # Скрипт первого запуска
├── test.sh                         # Тест синтаксиса
├── Makefile                        # Удобные команды
└── README.md                       # Документация

```

### 3. Роли Ansible

#### `common` - Базовая настройка
- Настройка timezone, locale
- Обновление пакетов
- Установка базовых утилит (git, vim, htop, etc.)
- Настройка sysctl для производительности
- Создание пользователя приложения

#### `docker` - Docker и Compose
- Удаление старых версий Docker
- Установка Docker CE + Docker Compose v2
- Настройка daemon.json (логи, storage driver)
- Добавление пользователей в группу docker

#### `nginx` - Reverse Proxy
- Установка Nginx
- Конфигурация upstream для Gateway
- Reverse proxy на порт 82 → 8010 (как в твоём конфиге)
- Logrotate для логов
- Валидация конфигурации

#### `security` - Безопасность
- SSH hardening (изменение порта, отключение root, только ключи)
- Настройка UFW (firewall)
- Fail2ban для защиты от брутфорса
- Правила для портов: 22, 2222, 80, 443, 82

#### `app` - Подготовка приложения
- Клонирование репозитория
- Создание .env файла
- Настройка прав доступа
- Docker Compose override для production

### 4. Playbooks

**setup.yml** - главный playbook, запускает все роли по порядку
**quick-setup.yml** - только Docker и Nginx для быстрой настройки
**deploy.yml** - деплой приложения (альтернатива GitHub Actions)
**update.yml** - только обновление системных пакетов

### 5. Файлы конфигурации

- `inventory/hosts.yml` - список серверов с SSH параметрами
- `group_vars/all.yml` - переменные: домен, порты, пользователи, пакеты
- Templates для nginx, fail2ban
- Handlers для перезагрузки сервисов

## Что нужно сделать перед запуском

1. **Отредактируй `inventory/hosts.yml`:**
   - Укажи IP своего сервера
   - Проверь SSH порт (2222)
   - Укажи пользователя (keksik)

2. **Отредактируй `group_vars/all.yml`:**
   - `app_repo` - URL твоего GitHub репозитория
   - `nginx_domain` - домен или IP
   - Пароли, если нужно

3. **Установи Ansible collections:**
   ```bash
   ansible-galaxy collection install -r requirements.yml
   ```

4. **Проверь SSH доступ:**
   ```bash
   make ping
   # или
   ansible all -i inventory/hosts.yml -m ping
   ```

5. **Запусти настройку:**
   ```bash
   make setup
   # или
   ansible-playbook -i inventory/hosts.yml playbooks/setup.yml
   ```

## Команды для работы

```bash
# Проверка доступности
make ping

# Dry-run (без изменений)
make check

# Полная настройка
make setup

# Только Docker
make setup-docker

# Только Nginx
make setup-nginx

# Деплой приложения
make deploy

# Обновление пакетов
make update
```

## Особенности

- **Идемпотентность** - можно запускать многократно
- **Tags** - выборочный запуск ролей
- **Handlers** - автоматическая перезагрузка сервисов
- **Валидация** - проверка конфигов nginx перед применением
- **Безопасность** - SSH hardening, UFW, Fail2ban из коробки

## Следующие шаги

1. Протестируй на локальной VM (VirtualBox/VMware)
2. Адаптируй под свой production сервер
3. Запусти playbook
4. Проверь работу приложения
5. Сделай отчёт для ЛР5

Все готово для выполнения ЛР5! 🚀
