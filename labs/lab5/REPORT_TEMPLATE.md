# Отчет по ЛР5: Ansible

## Задание

Разработать и настроить конфигурацию Ansible для автоматизации процесса настройки виртуальных машин. Написать Ansible-плейбуки для автоматической установки системных пакетов, настройки окружения и запуска сервисов.

## Выполнение

### 1. Структура проекта

Создана полная структура Ansible проекта:

```
lab5/
├── ansible.cfg                      # Конфигурация Ansible
├── inventory/
│   └── hosts.yml                   # Инвентарь серверов
├── group_vars/
│   └── all.yml                     # Общие переменные
├── playbooks/
│   ├── setup.yml                   # Полная настройка сервера
│   ├── quick-setup.yml             # Быстрая настройка
│   ├── deploy.yml                  # Деплой приложения
│   ├── update.yml                  # Обновление пакетов
│   └── healthcheck.yml             # Проверка состояния
├── roles/
│   ├── common/                     # Базовая настройка системы
│   │   ├── tasks/main.yml
│   │   ├── defaults/main.yml
│   │   └── handlers/main.yml
│   ├── docker/                     # Установка Docker
│   │   ├── tasks/main.yml
│   │   ├── defaults/main.yml
│   │   └── handlers/main.yml
│   ├── nginx/                      # Reverse proxy
│   │   ├── tasks/main.yml
│   │   ├── templates/
│   │   │   ├── nginx.conf.j2
│   │   │   └── app.conf.j2
│   │   ├── defaults/main.yml
│   │   └── handlers/main.yml
│   ├── security/                   # Безопасность
│   │   ├── tasks/main.yml
│   │   ├── templates/jail.local.j2
│   │   ├── defaults/main.yml
│   │   └── handlers/main.yml
│   └── app/                        # Подготовка приложения
│       ├── tasks/main.yml
│       ├── defaults/main.yml
│       └── handlers/main.yml
├── scripts/
│   └── setup-ssh-key.sh
├── Makefile
├── bootstrap.sh
├── test.sh
├── requirements.yml
├── requirements.txt
├── QUICKSTART.md
├── CHEATSHEET.md
└── README.md
```

### 2. Реализованные роли

#### 2.1 Роль `common` - Базовая настройка системы

**Задачи:**
- Настройка timezone и locale
- Обновление всех пакетов системы
- Установка базовых утилит (git, vim, htop, curl, etc.)
- Создание пользователя приложения
- Настройка sysctl для производительности
- Настройка hostname

**Переменные:**
```yaml
timezone: "Europe/Moscow"
locale: "en_US.UTF-8"
app_user: keksik
app_group: keksik
app_dir: /opt/myproject
```

#### 2.2 Роль `docker` - Docker и Docker Compose

**Задачи:**
- Удаление старых версий Docker
- Добавление официального Docker APT репозитория
- Установка Docker CE + Docker Compose v2 (plugin)
- Настройка Docker daemon (логирование, storage driver)
- Добавление пользователей в группу docker
- Автозапуск Docker service

**Переменные:**
```yaml
docker_edition: ce
docker_users:
  - keksik
```

#### 2.3 Роль `nginx` - Reverse Proxy

**Задачи:**
- Установка Nginx
- Настройка главного конфига nginx.conf
- Настройка reverse proxy для Gateway (порт 82 → 8010)
- Настройка upstream с keepalive
- Конфигурация logrotate для логов
- Валидация конфигурации перед применением

**Шаблоны:**
- `nginx.conf.j2` - основной конфиг с gzip, security headers
- `app.conf.j2` - reverse proxy для приложения

**Переменные:**
```yaml
nginx_port: 82
nginx_backend_port: 8010
nginx_domain: localhost
```

#### 2.4 Роль `security` - Безопасность

**Задачи:**
- SSH hardening (кастомный порт, отключение root login, только ключи)
- Настройка UFW firewall с правилами для портов
- Установка и настройка Fail2ban
- Защита от брутфорса SSH и Nginx

**Настройки SSH:**
```yaml
ssh_port: 2222
ssh_permit_root_login: "no"
ssh_password_authentication: "no"
ssh_max_auth_tries: 3
```

**Правила UFW:**
- Порт 22 (emergency SSH)
- Порт 2222 (custom SSH)
- Порт 80/443 (HTTP/HTTPS)
- Порт 82 (Nginx custom)

**Fail2ban jails:**
- sshd
- nginx-http-auth
- nginx-badbots
- nginx-noproxy

#### 2.5 Роль `app` - Подготовка приложения

**Задачи:**
- Клонирование Git репозитория
- Создание .env файла из .env.example
- Установка прав доступа на файлы
- Создание docker-compose.override.yml для production
- Настройка executable флагов для скриптов

### 3. Playbooks

#### 3.1 `setup.yml` - Главный playbook

Последовательно запускает все роли:
1. `common` - базовая настройка
2. `security` - настройка безопасности
3. `docker` - установка Docker
4. `nginx` - настройка reverse proxy
5. `app` - подготовка приложения

#### 3.2 `quick-setup.yml` - Быстрая настройка

Только Docker и Nginx, для быстрого деплоя.

#### 3.3 `deploy.yml` - Деплой приложения

- Pull последних изменений из Git
- Создание .env если не существует
- Pull Docker образов
- Build и запуск контейнеров
- Healthcheck всех сервисов

#### 3.4 `update.yml` - Обновление системы

- Обновление apt cache
- Обновление всех пакетов (dist-upgrade)
- Проверка необходимости перезагрузки
- Опциональная перезагрузка с тегом `reboot`

#### 3.5 `healthcheck.yml` - Проверка состояния

- Проверка статуса Docker и Nginx
- Список запущенных контейнеров
- Выполнение healthcheck скрипта
- Отчет о состоянии системы

### 4. Идемпотентность

Все playbooks идемпотентны - их можно запускать многократно без побочных эффектов:

- `apt` модуль устанавливает пакеты только если их нет
- `file` создает директории только если отсутствуют
- `template` обновляет конфиги только при изменении
- `systemd` запускает сервисы только если они не запущены
- `git` клонирует репозиторий только если его нет

### 5. Handlers

Реализованы handlers для автоматической перезагрузки сервисов:

```yaml
# Nginx
- Reload Nginx   # при изменении конфига
- Restart Nginx  # при критических изменениях

# Docker
- Restart Docker # при изменении daemon.json

# SSH
- Restart SSH    # при изменении sshd_config

# Fail2ban
- Restart Fail2ban # при изменении jail.local
```

### 6. Шаблоны Jinja2

Использованы переменные для гибкой настройки:

**nginx.conf.j2:**
```nginx
worker_processes auto;
client_max_body_size 20M;
gzip on;
gzip_comp_level 6;
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
```

**app.conf.j2:**
```nginx
upstream backend {
{% for server in nginx_upstreams[0].servers %}
    server {{ server }};
{% endfor %}
}

server {
    listen {{ nginx_port }};
    server_name {{ nginx_domain }};
    location / {
        proxy_pass http://backend;
    }
}
```

**jail.local.j2:**
```ini
[DEFAULT]
bantime = {{ fail2ban_bantime }}
findtime = {{ fail2ban_findtime }}
maxretry = {{ fail2ban_maxretry }}
```

### 7. Inventory и переменные

**inventory/hosts.yml:**
```yaml
all:
  children:
    production:
      hosts:
        app-server:
          ansible_host: 192.168.1.100
          ansible_port: 2222
          ansible_user: keksik
```

**group_vars/all.yml:**
- Системные настройки (timezone, locale)
- Параметры приложения (user, dir, repo)
- Docker настройки
- Nginx конфигурация
- Security параметры (SSH, UFW, Fail2ban)
- Список устанавливаемых пакетов

### 8. Автоматизация через Makefile

Созданы короткие команды:

```makefile
make ping          # Проверка доступности
make check         # Dry-run
make setup         # Полная настройка
make quick-setup   # Только Docker + Nginx
make deploy        # Деплой приложения
make update        # Обновление пакетов
make test          # Тест синтаксиса
```

### 9. Дополнительные доработки

#### 9.1 Доработана ЛР4

**Добавлены health endpoints:**
- Gateway: `/health`
- Auth-User Service: `/health`
- Restaurant Service: `/health`
- Reservation Service: `/health`
- Review Service: `/health`

**Создан healthcheck скрипт:**
```bash
#!/bin/bash
# Проверка всех микросервисов с ретраями
# Возвращает exit 0 если все healthy, иначе exit 1
```

**Обновлен CI/CD pipeline:**
```yaml
jobs:
  check:        # Валидация docker-compose.yaml
  deploy:       # Деплой с обновлением только измененных контейнеров
  healthcheck:  # Проверка работоспособности после деплоя
```

#### 9.2 Добавлен мониторинг стек

В `docker-compose.yaml` добавлены сервисы:
- **Prometheus** - сбор метрик (порт 9090)
- **Grafana** - визуализация (порт 3000)
- **Loki** - агрегация логов (порт 3100)
- **Promtail** - сбор логов из Docker контейнеров
- **cAdvisor** - метрики контейнеров (порт 8080)
- **Node Exporter** - метрики хоста (порт 9100)

Созданы конфиги:
- `monitoring/prometheus.yml` - targets для scraping
- `monitoring/promtail-config.yml` - сбор логов Docker
- `monitoring/grafana/provisioning/datasources/datasources.yml`
- `monitoring/grafana/provisioning/dashboards/dashboards.yml`

### 10. Документация

Созданы файлы документации:

- **README.md** - полное описание, установка, использование
- **QUICKSTART.md** - краткая инструкция для быстрого старта
- **CHEATSHEET.md** - шпаргалка по командам Ansible
- **COMPLETED.md** - отчет о выполненной работе

### 11. Скрипты

- **bootstrap.sh** - первый запуск, установка collections, проверка SSH
- **test.sh** - проверка синтаксиса всех playbooks
- **scripts/setup-ssh-key.sh** - генерация SSH ключа для Ansible

## Команды для проверки

### Проверка синтаксиса

```bash
cd labs/lab5
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --syntax-check
./test.sh
```

### Dry-run (без изменений)

```bash
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --check --diff
```

### Запуск настройки

```bash
# Полная настройка
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml

# Только Docker
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --tags docker

# Только Nginx
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --tags nginx
```

### Проверка после выполнения

```bash
# На сервере
docker --version
docker compose version
systemctl status nginx
systemctl status docker
sudo ufw status
sudo fail2ban-client status
cd /opt/myproject && ls -la
```

## Результаты

1. ✅ Создана полная структура Ansible проекта
2. ✅ Реализованы 5 ролей (common, docker, nginx, security, app)
3. ✅ Написаны 5 playbooks для разных сценариев
4. ✅ Все playbooks идемпотентны
5. ✅ Использованы handlers для автоматической перезагрузки сервисов
6. ✅ Созданы Jinja2 шаблоны для конфигов
7. ✅ Настроена безопасность (UFW, SSH hardening, Fail2ban)
8. ✅ Добавлена документация и шпаргалки
9. ✅ Доработана ЛР4 (healthcheck, CI/CD, мониторинг)
10. ✅ Автоматизация через Makefile

## Выводы

Ansible позволяет полностью автоматизировать настройку серверов, делая процесс воспроизводимым и документированным. Использование ролей обеспечивает модульность и переиспользование кода. Идемпотентность playbooks гарантирует безопасное многократное выполнение. Применение Infrastructure as Code упрощает управление инфраструктурой и снижает вероятность человеческих ошибок.

Созданная конфигурация Ansible готова для развертывания production окружения микросервисного приложения на Ubuntu сервере.
