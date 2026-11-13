# ЛР5: Ansible - Краткая инструкция по запуску

## Что было сделано

### 1. Доработана ЛР4
- ✅ Health endpoints для всех микросервисов
- ✅ Скрипт healthcheck.sh
- ✅ CI/CD разделен на 3 job (check → deploy → healthcheck)
- ✅ Добавлен мониторинг стек (Grafana, Prometheus, Loki, Promtail, cAdvisor, Node Exporter)

### 2. Создана структура Ansible
```
lab5/
├── ansible.cfg                 # Конфигурация Ansible
├── inventory/hosts.yml         # Список серверов
├── group_vars/all.yml          # Переменные
├── playbooks/                  # Playbooks
│   ├── setup.yml              # Полная настройка
│   ├── quick-setup.yml        # Быстрая настройка
│   ├── deploy.yml             # Деплой приложения
│   └── update.yml             # Обновление пакетов
├── roles/                      # Роли
│   ├── common/                # Базовая настройка
│   ├── docker/                # Docker + Compose
│   ├── nginx/                 # Reverse proxy
│   ├── security/              # UFW + SSH + Fail2ban
│   └── app/                   # Подготовка приложения
├── Makefile                    # Удобные команды
├── bootstrap.sh                # Первый запуск
├── test.sh                     # Тест синтаксиса
└── README.md
```

## Быстрый старт

### Шаг 1: Установи Ansible (на своей машине, не на сервере)

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install ansible

# macOS
brew install ansible

# Windows (WSL)
sudo apt install ansible
```

### Шаг 2: Отредактируй конфигурацию

**inventory/hosts.yml** - укажи IP и параметры своего сервера:
```yaml
ansible_host: 192.168.1.100  # ЗАМЕНИ на IP твоего сервера
ansible_port: 2222           # SSH порт
ansible_user: keksik         # SSH пользователь
```

**group_vars/all.yml** - укажи свой GitHub репозиторий:
```yaml
app_repo: "https://github.com/YOUR_USERNAME/YOUR_REPO.git"  # ЗАМЕНИ
nginx_domain: "localhost"  # или твой домен
```

### Шаг 3: Установи зависимости

```bash
cd labs/lab5
ansible-galaxy collection install -r requirements.yml
```

### Шаг 4: Проверь доступ к серверу

```bash
ansible all -i inventory/hosts.yml -m ping
```

Если ошибка доступа:
```bash
# Скопируй SSH ключ на сервер
ssh-copy-id -p 2222 keksik@YOUR_SERVER_IP
```

### Шаг 5: Запусти настройку

```bash
# Сначала проверь что будет сделано (dry-run)
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --check

# Если все ок - запускай настройку
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml
```

## Makefile команды (короткие варианты)

```bash
make ping          # Проверка доступности
make check         # Dry-run без изменений
make setup         # Полная настройка сервера
make quick-setup   # Только Docker + Nginx
make deploy        # Деплой приложения
make update        # Обновление пакетов
```

## Что делает playbook setup.yml

1. **common** - обновляет систему, ставит базовые пакеты (git, vim, htop), создает пользователя
2. **security** - настраивает UFW firewall, SSH hardening, Fail2ban
3. **docker** - ставит Docker CE + Docker Compose v2
4. **nginx** - ставит и настраивает Nginx reverse proxy (порт 82 → 8010)
5. **app** - клонирует репозиторий в /opt/myproject, создает .env

## После выполнения playbook

SSH на сервер и проверь:

```bash
ssh keksik@YOUR_SERVER_IP -p 2222

# Проверка Docker
docker --version
docker compose version

# Проверка Nginx
systemctl status nginx
curl http://localhost:82

# Запуск приложения
cd /opt/myproject/labs/lab3
./scripts/init-env.sh  # создать .env с паролями
docker compose up -d

# Проверка
docker compose ps
./scripts/healthcheck.sh
```

## Доступ к приложению

- Приложение: `http://YOUR_SERVER_IP:82`
- Grafana: `http://YOUR_SERVER_IP:3000` (admin/admin)
- Prometheus: `http://YOUR_SERVER_IP:9090`

## Troubleshooting

**"Permission denied"**
```bash
ssh-copy-id -p 2222 keksik@YOUR_SERVER_IP
```

**"Module not found"**
```bash
ansible-galaxy collection install -r requirements.yml
```

**Хочу запустить только одну роль**
```bash
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --tags docker
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --tags nginx
```

## Для отчета ЛР5

1. Скриншоты выполнения playbook
2. Скриншот `docker ps` после настройки
3. Скриншот работающего приложения через nginx
4. Скриншот `ufw status`
5. Структура файлов Ansible (tree)

Готово! 🚀
