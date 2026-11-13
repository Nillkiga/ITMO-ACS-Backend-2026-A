# Итоговый отчет: ЛР4 (доработка) + ЛР5 (Ansible)

## Что сделано

### ✅ Часть 1: Доработка ЛР4 и ДЗ6

#### 1.1 Health endpoints для всех микросервисов

Добавлен единый health endpoint `/health` во все сервисы:
- **Gateway** - уже был
- **Auth-User Service** - добавлен `HealthController`
- **Restaurant Service** - добавлен `HealthController`
- **Reservation Service** - добавлен `HealthController`
- **Review Service** - добавлен `HealthController`

Каждый контроллер возвращает:
```json
{
  "status": "ok",
  "timestamp": "2026-11-11T22:30:00.000Z"
}
```

**Файлы:**
- `labs/lab3/services/*/src/controllers/health.controller.ts` (5 файлов)

#### 1.2 Healthcheck скрипт

Создан bash скрипт для проверки всех микросервисов:
- Проверяет Gateway (порт 8010)
- Проверяет все 4 микросервиса (порты 8011-8014)
- Использует retry механизм (10 попыток с задержкой 3 сек)
- Возвращает exit 0 если все healthy, exit 1 если есть проблемы

**Файл:** `labs/lab3/scripts/healthcheck.sh`

#### 1.3 Улучшенный CI/CD pipeline

Разделен на 3 независимых job:

**1. check** - валидация конфигурации
```yaml
- Копирование .env.example
- docker compose config --quiet
```

**2. deploy** - деплой приложения
```yaml
- git pull/clone
- docker compose pull (для обновления base images)
- docker compose build --pull
- docker compose up -d --remove-orphans
- Ожидание 10 секунд
```

**3. healthcheck** - проверка работоспособности
```yaml
- Запуск scripts/healthcheck.sh
- Проверка всех 5 сервисов
- Fail pipeline если хотя бы один сервис недоступен
```

**Файл:** `.github/workflows/deploy.yml`

#### 1.4 Мониторинг стек (подготовка к ЛР6)

Добавлены сервисы мониторинга в `docker-compose.yaml`:

**Prometheus** (порт 9090)
- Сбор метрик с микросервисов
- Targets: gateway, все 4 микросервиса, node-exporter, cadvisor
- Retention: 30 дней

**Grafana** (порт 3000)
- Визуализация метрик
- Datasources: Prometheus + Loki (auto-provisioned)
- Пароль: из переменной `GRAFANA_PASSWORD`

**Loki** (порт 3100)
- Агрегация и хранение логов
- Интеграция с Grafana

**Promtail**
- Сбор логов из Docker контейнеров
- Отправка в Loki
- Автоматическое добавление labels (container, service)

**cAdvisor** (порт 8080)
- Метрики Docker контейнеров
- CPU, Memory, Network, Disk I/O

**Node Exporter** (порт 9100)
- Метрики хоста (VM)
- CPU, RAM, Disk, Network

**Конфигурационные файлы:**
```
labs/lab3/monitoring/
├── prometheus.yml                              # Scrape config
├── promtail-config.yml                         # Log collection
└── grafana/provisioning/
    ├── datasources/datasources.yml            # Prometheus + Loki
    └── dashboards/dashboards.yml              # Auto-provision
```

---

### ✅ Часть 2: ЛР5 - Ansible автоматизация

#### 2.1 Структура проекта

Создана полноценная Ansible конфигурация:

```
labs/lab5/
├── ansible.cfg                      # Настройки Ansible
├── inventory/
│   └── hosts.yml                   # Список серверов
├── group_vars/
│   └── all.yml                     # Общие переменные
├── playbooks/
│   ├── setup.yml                   # Полная настройка сервера
│   ├── quick-setup.yml             # Docker + Nginx
│   ├── deploy.yml                  # Деплой приложения
│   ├── update.yml                  # Обновление пакетов
│   └── healthcheck.yml             # Проверка здоровья
├── roles/
│   ├── common/                     # Базовая настройка
│   ├── docker/                     # Docker + Compose
│   ├── nginx/                      # Reverse proxy
│   ├── security/                   # UFW + SSH + Fail2ban
│   └── app/                        # Подготовка приложения
├── scripts/
│   └── setup-ssh-key.sh
├── Makefile                        # Удобные команды
├── bootstrap.sh                    # Первый запуск
├── test.sh                         # Проверка синтаксиса
├── requirements.yml                # Ansible collections
└── README.md
```

**Всего создано:** 38 файлов

#### 2.2 Реализованные роли

**Role: common** - Базовая настройка системы
- Обновление всех пакетов (apt upgrade)
- Установка базовых утилит (git, vim, htop, curl, etc.)
- Настройка timezone и locale
- Создание пользователя приложения
- Настройка sysctl для производительности
- Настройка hostname

**Role: docker** - Docker и Docker Compose
- Удаление старых версий Docker
- Добавление официального Docker APT репозитория
- Установка Docker CE + Docker Compose v2 (plugin)
- Настройка daemon.json (логирование, storage driver)
- Добавление пользователей в группу docker
- Автозапуск Docker service

**Role: nginx** - Reverse Proxy
- Установка Nginx
- Шаблон главного конфига (gzip, security headers)
- Reverse proxy для Gateway (порт 82 → 8010)
- Upstream с keepalive
- Logrotate для логов
- Валидация конфигурации перед применением

**Role: security** - Безопасность
- SSH hardening (кастомный порт 2222, отключение root, только ключи)
- UFW firewall с правилами для портов (22, 2222, 80, 443, 82)
- Fail2ban для защиты от брутфорса (SSH, Nginx)
- Настройка jails для SSH и Nginx

**Role: app** - Подготовка приложения
- Клонирование Git репозитория
- Создание .env файла из .env.example
- Установка прав доступа на файлы
- Создание docker-compose.override.yml
- Настройка executable флагов для скриптов

#### 2.3 Ключевые особенности

**Идемпотентность**
- Все playbooks можно запускать многократно без побочных эффектов
- Ansible проверяет текущее состояние и применяет изменения только если нужно

**Tags**
- Каждая роль помечена тегами для выборочного запуска
- Примеры: `docker`, `nginx`, `security`, `app`

**Handlers**
- Автоматическая перезагрузка сервисов при изменении конфигов
- `Reload Nginx`, `Restart Docker`, `Restart SSH`, `Restart Fail2ban`

**Jinja2 Templates**
- `nginx.conf.j2` - главный конфиг Nginx
- `app.conf.j2` - reverse proxy для приложения
- `jail.local.j2` - конфигурация Fail2ban

**Переменные**
- `group_vars/all.yml` - централизованное управление всеми параметрами
- Легко менять порты, домены, пользователей

#### 2.4 Playbooks

**setup.yml** - Главный playbook
```yaml
Roles:
  1. common     # Базовая настройка
  2. security   # UFW + SSH + Fail2ban
  3. docker     # Docker + Compose
  4. nginx      # Reverse proxy
  5. app        # Подготовка приложения
```

**quick-setup.yml** - Быстрая настройка
```yaml
Roles:
  1. docker     # Только Docker
  2. nginx      # Только Nginx
```

**deploy.yml** - Деплой приложения
```yaml
Tasks:
  - git pull
  - .env setup
  - docker compose build
  - docker compose up
  - healthcheck
```

**update.yml** - Обновление системы
```yaml
Tasks:
  - apt update
  - apt upgrade
  - check reboot required
```

**healthcheck.yml** - Проверка состояния
```yaml
Tasks:
  - Статус Docker/Nginx
  - Список контейнеров
  - Запуск healthcheck.sh
```

#### 2.5 Документация

Созданы файлы документации:

- **README.md** - полное описание проекта, установка, использование
- **QUICKSTART.md** - краткая инструкция для быстрого старта
- **CHEATSHEET.md** - шпаргалка по командам Ansible
- **COMPLETED.md** - отчет о выполненной работе
- **REPORT_TEMPLATE.md** - шаблон отчета для сдачи ЛР5

#### 2.6 Автоматизация

**Makefile** - короткие команды
```makefile
make ping         # Проверка доступности
make check        # Dry-run
make setup        # Полная настройка
make deploy       # Деплой
make update       # Обновление пакетов
```

**bootstrap.sh** - первый запуск
- Проверка установки Ansible
- Установка Galaxy collections
- Проверка SSH подключения
- Интерактивный запуск setup

**test.sh** - проверка синтаксиса
- Валидация всех playbooks
- Проверка inventory

---

## Команды для проверки работы

### Проверка ЛР4 (healthcheck + CI/CD)

```bash
# Локально проверить docker-compose
cd labs/lab3
cp .env.example .env
docker compose config

# Запустить healthcheck
chmod +x scripts/healthcheck.sh
./scripts/healthcheck.sh
```

### Проверка ЛР5 (Ansible)

```bash
cd labs/lab5

# 1. Установить Ansible collections
ansible-galaxy collection install -r requirements.yml

# 2. Отредактировать inventory
nano inventory/hosts.yml  # указать IP сервера

# 3. Отредактировать переменные
nano group_vars/all.yml   # указать GitHub repo

# 4. Проверить доступность
ansible all -i inventory/hosts.yml -m ping

# 5. Dry-run (без изменений)
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --check

# 6. Запустить настройку
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml

# Или через Makefile
make ping
make check
make setup
```

### Проверка на сервере после Ansible

```bash
# SSH на сервер
ssh keksik@YOUR_SERVER_IP -p 2222

# Проверка Docker
docker --version
docker compose version

# Проверка Nginx
systemctl status nginx
curl http://localhost:82

# Проверка UFW
sudo ufw status

# Проверка Fail2ban
sudo fail2ban-client status

# Запуск приложения
cd /opt/myproject/labs/lab3
./scripts/init-env.sh
docker compose up -d
docker compose ps
./scripts/healthcheck.sh
```

---

## Результаты

### ЛР4 (доработка)
- ✅ 5 health endpoints добавлены
- ✅ Healthcheck скрипт создан
- ✅ CI/CD разделен на 3 job
- ✅ Мониторинг стек добавлен (6 сервисов)
- ✅ Конфиги Prometheus, Loki, Promtail, Grafana

### ЛР5 (Ansible)
- ✅ 38 файлов создано
- ✅ 5 ролей реализованы (common, docker, nginx, security, app)
- ✅ 5 playbooks написаны
- ✅ Идемпотентность обеспечена
- ✅ Handlers для автоматической перезагрузки
- ✅ Jinja2 шаблоны для конфигов
- ✅ Документация (4 файла)
- ✅ Автоматизация (Makefile, bootstrap.sh, test.sh)

---

## Файловая структура финальная

```
ITMO-ACS-Backend-2026-A/
├── .github/workflows/
│   └── deploy.yml                           # ✅ Обновлен (3 job)
├── labs/
│   ├── lab3/                                # ЛР4
│   │   ├── docker-compose.yaml              # ✅ Добавлен мониторинг
│   │   ├── .env.example                     # ✅ Добавлен GRAFANA_PASSWORD
│   │   ├── monitoring/
│   │   │   ├── prometheus.yml               # ✅ Создан
│   │   │   ├── promtail-config.yml          # ✅ Создан
│   │   │   └── grafana/provisioning/        # ✅ Создан
│   │   │       ├── datasources/datasources.yml
│   │   │       └── dashboards/dashboards.yml
│   │   ├── scripts/
│   │   │   ├── healthcheck.sh               # ✅ Создан
│   │   │   └── init-env.sh                  # ✅ Создан
│   │   └── services/
│   │       ├── auth-user-service/src/controllers/health.controller.ts     # ✅
│   │       ├── restaurant-service/src/controllers/health.controller.ts    # ✅
│   │       ├── reservation-service/src/controllers/health.controller.ts   # ✅
│   │       └── review-service/src/controllers/health.controller.ts        # ✅
│   └── lab5/                                # ✅ ЛР5 - полностью создан
│       ├── ansible.cfg
│       ├── inventory/hosts.yml
│       ├── group_vars/all.yml
│       ├── playbooks/ (5 playbooks)
│       ├── roles/ (5 ролей, каждая с tasks/defaults/handlers/templates)
│       ├── scripts/setup-ssh-key.sh
│       ├── Makefile
│       ├── bootstrap.sh
│       ├── test.sh
│       ├── requirements.yml
│       ├── requirements.txt
│       ├── README.md
│       ├── QUICKSTART.md
│       ├── CHEATSHEET.md
│       ├── COMPLETED.md
│       └── REPORT_TEMPLATE.md
└── homeworks/hw6/README.md                  # ✅ Был раньше
```

---

## Следующие шаги

1. **Скопировать проект** в правильную директорию (если нужно)
2. **Commit и push** изменений в Git
3. **Протестировать на локальной VM** (VirtualBox/VMware)
4. **Запустить Ansible** на production сервере
5. **Проверить работу** всех компонентов
6. **Сделать скриншоты** для отчета
7. **Заполнить отчет** по шаблону `REPORT_TEMPLATE.md`

---

## Полезные ссылки

- Ansible Documentation: https://docs.ansible.com/
- Docker Compose: https://docs.docker.com/compose/
- Grafana Provisioning: https://grafana.com/docs/grafana/latest/administration/provisioning/
- Prometheus Configuration: https://prometheus.io/docs/prometheus/latest/configuration/configuration/
- Fail2ban: https://www.fail2ban.org/

---

Готово! Все файлы для ЛР4 (доработка) и ЛР5 (Ansible) созданы и готовы к использованию. 🚀
