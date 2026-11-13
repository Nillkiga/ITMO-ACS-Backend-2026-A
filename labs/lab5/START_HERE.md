# 🚀 НАЧНИ ОТСЮДА: ЛР5 Ansible

## Что готово

✅ **ЛР4 доработана:**
- Health endpoints на всех микросервисах
- Healthcheck скрипт
- CI/CD pipeline (3 jobs)
- Мониторинг стек (Grafana, Prometheus, Loki, etc.)

✅ **ЛР5 создана:**
- 40 файлов Ansible конфигурации
- 5 ролей (common, docker, nginx, security, app)
- 5 playbooks (setup, quick-setup, deploy, update, healthcheck)
- Полная документация

---

## Что делать дальше (пошагово)

### Шаг 1: Перенести проект в правильное место (если нужно)

Сейчас проект в `C:\Users\ddeni\Downloads\ITMO-ACS-Backend-2026-A`

Если нужно переместить:
```bash
# Переместить в рабочую директорию
move "C:\Users\ddeni\Downloads\ITMO-ACS-Backend-2026-A" "C:\Users\ddeni\Documents\Projects\"

# Или оставить как есть
cd C:\Users\ddeni\Downloads\ITMO-ACS-Backend-2026-A
```

### Шаг 2: Добавить `.git` репозиторий (если его нет)

```bash
cd C:\Users\ddeni\Downloads\ITMO-ACS-Backend-2026-A

# Проверить есть ли git
ls -la .git

# Если нет - инициализировать
git init
git add .
git commit -m "feat: add lab5 ansible + improve lab4"

# Добавить remote (если еще нет)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Шаг 3: Настроить Ansible конфигурацию

```bash
cd labs/lab5

# 1. Отредактировать inventory - указать IP ТВОЕГО сервера
nano inventory/hosts.yml
# Изменить:
#   ansible_host: 192.168.1.100  → твой реальный IP
#   ansible_port: 2222           → твой SSH порт
#   ansible_user: keksik         → твой SSH пользователь

# 2. Отредактировать переменные
nano group_vars/all.yml
# Изменить:
#   app_repo: "https://github.com/YOUR_USERNAME/YOUR_REPO.git"
#   nginx_domain: "localhost" или твой домен
#   timezone: "Europe/Moscow" или твой timezone
```

### Шаг 4: Установить Ansible (если еще нет)

**Windows (WSL):**
```bash
wsl
sudo apt update
sudo apt install ansible
ansible --version
```

**Установить зависимости:**
```bash
cd labs/lab5
ansible-galaxy collection install -r requirements.yml
```

### Шаг 5: Проверить SSH доступ к серверу

```bash
# Проверить подключение
ssh keksik@YOUR_SERVER_IP -p 2222

# Если нет SSH ключа - создать и скопировать
cd labs/lab5
bash scripts/setup-ssh-key.sh
ssh-copy-id -p 2222 keksik@YOUR_SERVER_IP

# Проверить через Ansible
ansible all -i inventory/hosts.yml -m ping
```

### Шаг 6: Запустить Ansible (рекомендуется на тестовой VM сначала!)

```bash
cd labs/lab5

# Сначала dry-run (посмотреть что будет сделано)
make check
# или
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --check --diff

# Если все ок - запустить настройку
make setup
# или
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml

# Процесс займет 5-15 минут
```

### Шаг 7: Проверить результат на сервере

```bash
# SSH на сервер
ssh keksik@YOUR_SERVER_IP -p 2222

# Проверить что установлено
docker --version
docker compose version
systemctl status nginx
systemctl status docker
sudo ufw status
sudo fail2ban-client status

# Перейти в директорию проекта
cd /opt/myproject
ls -la

# Запустить приложение
cd labs/lab3
./scripts/init-env.sh      # создать .env с паролями
docker compose up -d        # запустить все сервисы
docker compose ps           # проверить статус
./scripts/healthcheck.sh    # проверить health
```

### Шаг 8: Открыть приложение в браузере

```
http://YOUR_SERVER_IP:82          - Приложение (Gateway)
http://YOUR_SERVER_IP:3000        - Grafana (admin/admin)
http://YOUR_SERVER_IP:9090        - Prometheus
```

### Шаг 9: Сделать скриншоты для отчета

**Нужные скриншоты:**

1. **Ansible execution:**
   - Вывод `ansible-playbook playbooks/setup.yml`
   - Показать, что все таски прошли успешно

2. **Server state:**
   - `docker ps` - все контейнеры запущены
   - `systemctl status nginx` - nginx работает
   - `sudo ufw status` - firewall настроен

3. **Application working:**
   - Браузер с открытым приложением на порту 82
   - Grafana dashboard
   - Prometheus targets

4. **Ansible structure:**
   - `tree labs/lab5` - структура файлов

5. **Healthcheck:**
   - Вывод `./scripts/healthcheck.sh` - все сервисы healthy

### Шаг 10: Заполнить отчет

```bash
cd labs/lab5

# Скопировать шаблон
cp REPORT_TEMPLATE.md REPORT_LAB5.md

# Отредактировать - вставить свои скриншоты
nano REPORT_LAB5.md

# Конвертировать в PDF (опционально)
pandoc REPORT_LAB5.md -o REPORT_LAB5.pdf
```

---

## Быстрые команды (Makefile)

```bash
cd labs/lab5

make ping          # Проверить доступность сервера
make check         # Dry-run без изменений
make setup         # Полная настройка сервера
make deploy        # Деплой приложения
make update        # Обновление пакетов
make test          # Проверка синтаксиса
```

---

## Важные файлы для изучения

**Документация:**
- `START_HERE.md` - ты здесь 👈
- `QUICKSTART.md` - краткая инструкция
- `README.md` - полное описание
- `CHEATSHEET.md` - шпаргалка по Ansible
- `SUMMARY.md` - что было сделано

**Конфигурация:**
- `inventory/hosts.yml` - список серверов (РЕДАКТИРУЙ)
- `group_vars/all.yml` - переменные (РЕДАКТИРУЙ)
- `playbooks/setup.yml` - главный playbook

**Роли:**
- `roles/common/tasks/main.yml` - базовая настройка
- `roles/docker/tasks/main.yml` - установка Docker
- `roles/nginx/tasks/main.yml` - настройка Nginx
- `roles/security/tasks/main.yml` - UFW + SSH + Fail2ban
- `roles/app/tasks/main.yml` - подготовка приложения

---

## Troubleshooting

**Ошибка: "Permission denied (publickey)"**
```bash
ssh-copy-id -p 2222 keksik@YOUR_SERVER_IP
```

**Ошибка: "Module not found"**
```bash
ansible-galaxy collection install -r requirements.yml
```

**Ansible playbook падает с ошибкой**
```bash
# Запустить с verbose режимом
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml -vvv
```

**Хочу запустить только одну роль**
```bash
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --tags docker
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --tags nginx
```

**Docker контейнеры не запускаются**
```bash
# На сервере
cd /opt/myproject/labs/lab3
docker compose logs
docker compose ps -a
```

---

## Рекомендации

1. **СНАЧАЛА ТЕСТИРУЙ НА ЛОКАЛЬНОЙ VM!**
   - Создай VM в VirtualBox/VMware с Ubuntu 22.04
   - Запусти на ней Ansible playbook
   - Только после успеха - на production

2. **Делай git commits часто**
   ```bash
   git add labs/lab5
   git commit -m "feat: add ansible configuration"
   git push
   ```

3. **Сохраняй логи Ansible**
   ```bash
   ansible-playbook playbooks/setup.yml | tee ansible-run.log
   ```

4. **Проверяй синтаксис перед запуском**
   ```bash
   ./test.sh
   ```

---

## Следующие ЛР (после ЛР5)

После успешного выполнения ЛР5:

- **ЛР6 (Мониторинг)** - стек уже добавлен в docker-compose.yaml
  - Настроить дашборды в Grafana
  - Настроить алерты
  - Интегрировать Sentry

- **ДЗ7 (Технический дизайн)** - спроектировать облачную инфраструктуру

- **ЛР7 (Kubernetes)** - оркестрация в облаке

---

## Полезные ссылки

- Ansible Docs: https://docs.ansible.com/
- Ansible Best Practices: https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html
- Docker Compose: https://docs.docker.com/compose/
- Nginx Configuration: https://nginx.org/en/docs/

---

## Контакты преподавателя

Если есть проблемы с:
- Арендой сервера
- Настройкой Ansible
- Деплоем приложения

Обратись к преподавателю **ДО дедлайна**, а не в последний момент!

---

**Удачи с ЛР5! 🚀**

P.S. Не забудь поставить ⭐ на GitHub если проект помог!
