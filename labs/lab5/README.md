# ЛР5: Автоматизация настройки серверов с помощью Ansible

## Описание

Ansible playbook для автоматической настройки Ubuntu сервера под микросервисное приложение.

## Что автоматизируется

- Базовая настройка системы (timezone, локаль, обновления)
- Установка Docker и Docker Compose
- Настройка Nginx как reverse proxy
- Настройка безопасности (UFW, SSH hardening, Fail2ban)
- Создание пользователя для приложения
- Настройка директорий проекта

## Требования

- Ansible 2.14+
- Целевой сервер: Ubuntu 22.04+
- SSH доступ с sudo правами

## Быстрый старт

### 1. Установка Ansible (на локальной машине)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ansible

# macOS
brew install ansible

# Windows (WSL)
sudo apt install ansible
```

### 2. Настройка inventory

Отредактируй `inventory/hosts.yml` - укажи IP твоего сервера и SSH параметры.

### 3. Настройка переменных

Отредактируй `group_vars/all.yml` - домен, пользователи, пароли для Grafana и т.д.

### 4. Проверка доступности хостов

```bash
ansible all -i inventory/hosts.yml -m ping
```

### 5. Запуск playbook

Полная настройка сервера с нуля:

```bash
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml
```

Запуск только определённых ролей через tags:

```bash
# Только Docker
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --tags docker

# Только Nginx
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --tags nginx

# Только безопасность
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --tags security
```

## Структура

```
lab5/
├── ansible.cfg              # Конфигурация Ansible
├── inventory/
│   └── hosts.yml           # Описание серверов
├── group_vars/
│   └── all.yml             # Общие переменные для всех хостов
├── playbooks/
│   └── setup.yml           # Главный playbook
├── roles/
│   ├── common/             # Базовая настройка системы
│   ├── docker/             # Установка Docker
│   ├── nginx/              # Установка и настройка Nginx
│   ├── security/           # Настройка UFW, SSH, Fail2ban
│   └── app/                # Подготовка окружения для приложения
└── README.md
```

## Проверка после выполнения

```bash
# SSH на сервер
ssh your-user@your-server

# Проверка Docker
docker --version
docker compose version

# Проверка Nginx
systemctl status nginx
curl http://localhost

# Проверка UFW
sudo ufw status

# Проверка приложения
cd /opt/myproject
docker compose ps
```

## Полезные команды

```bash
# Dry-run (проверка без изменений)
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --check

# Только вывод изменений
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --check --diff

# Verbose режим
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml -v
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml -vvv  # очень подробный

# Запустить для конкретного хоста
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --limit production
```

## Переменные окружения

Ansible не управляет `.env` файлом приложения - он создаётся на сервере через `scripts/init-env.sh` при первом деплое.

## Troubleshooting

### Ошибка "Permission denied"
Проверь SSH ключи и права sudo:
```bash
ssh-copy-id user@server
ansible all -i inventory/hosts.yml -m ping
```

### Ошибка "Module not found"
Обнови Ansible:
```bash
pip install --upgrade ansible
```

### Docker не устанавливается
Убедись что используется Ubuntu 22.04+ и архитектура amd64/arm64.

## Безопасность

- Ansible Vault используется для хранения секретов
- SSH доступ только по ключам
- UFW блокирует все порты кроме 22, 80, 443, 2222
- Fail2ban защищает от брутфорса SSH
