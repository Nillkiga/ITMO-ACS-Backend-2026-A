# Часто задаваемые вопросы (FAQ) - ЛР5 Ansible

## Общие вопросы

### Q: Нужно ли иметь сервер для выполнения ЛР5?

**A:** Да, нужен Ubuntu сервер (22.04+) с SSH доступом. Варианты:
- Локальная VM в VirtualBox/VMware (рекомендуется для тестирования)
- Домашний сервер с белым IP (как у тебя сейчас)
- VPS в облаке (Yandex Cloud, DigitalOcean, etc.)

---

### Q: Можно ли использовать Windows для Ansible?

**A:** Нет, Ansible не работает нативно на Windows. Используй:
- WSL (Windows Subsystem for Linux) - рекомендуется
- Git Bash - не поддерживает Ansible
- Локальная Linux VM - можно, но неудобно

Установка в WSL:
```bash
wsl
sudo apt update && sudo apt install ansible
```

---

### Q: Сколько времени займет выполнение playbook?

**A:** 
- Первый запуск: 5-15 минут (зависит от скорости интернета)
- Повторный запуск: 1-3 минуты (только измененные задачи)

---

### Q: Можно ли запускать playbook многократно?

**A:** Да! Все playbooks идемпотентны - их можно запускать сколько угодно раз без побочных эффектов. Ansible проверяет текущее состояние и применяет изменения только если нужно.

---

## Вопросы по настройке

### Q: Какой IP указывать в inventory?

**A:** Внешний IP твоего сервера (белый IP). У тебя это IP домашнего сервера.

```yaml
# inventory/hosts.yml
ansible_host: 192.168.1.100  # замени на свой реальный IP
```

---

### Q: Какой SSH порт использовать?

**A:** 
- По умолчанию: 22
- У тебя в ЛР4: 2222 (нестандартный порт для безопасности)

Ansible будет настраивать SSH на порт 2222 автоматически (роль `security`).

---

### Q: Нужно ли создавать пользователя вручную?

**A:** Нет! Роль `common` создаст пользователя `keksik` автоматически. Но для первого запуска Ansible нужен доступ под существующим пользователем с sudo правами (например, под root или основным пользователем Ubuntu).

---

### Q: Где хранятся пароли и секреты?

**A:** 
- `.env` файл создается на сервере автоматически скриптом `init-env.sh`
- Для чувствительных данных в Ansible используй Ansible Vault (опционально)
- В Git **никогда** не комитить `.env` файлы!

---

## Вопросы по Ansible

### Q: Что такое роль в Ansible?

**A:** Роль - это набор задач (tasks), переменных, шаблонов и handlers для определенной функции. Например:
- `common` роль = базовая настройка системы
- `docker` роль = установка Docker
- `nginx` роль = настройка веб-сервера

---

### Q: Что такое идемпотентность?

**A:** Свойство операции давать одинаковый результат при многократном выполнении. Пример:

```yaml
# Идемпотентная задача
- name: Install nginx
  apt:
    name: nginx
    state: present

# Ansible проверит: если nginx уже установлен - ничего не делает
# Если нет - установит
```

---

### Q: Что такое handler?

**A:** Handler - это задача, которая выполняется только при изменении конфигурации. Пример:

```yaml
# Task
- name: Update nginx config
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: Reload Nginx   # вызовет handler

# Handler
- name: Reload Nginx
  systemd:
    name: nginx
    state: reloaded
```

---

### Q: Что делает команда `make check`?

**A:** Dry-run - показывает что будет сделано, но НЕ применяет изменения:

```bash
make check
# эквивалентно
ansible-playbook playbooks/setup.yml --check --diff
```

---

### Q: Как запустить только одну роль?

**A:** Используй tags:

```bash
# Только Docker
ansible-playbook playbooks/setup.yml --tags docker

# Только Nginx
ansible-playbook playbooks/setup.yml --tags nginx

# Несколько ролей
ansible-playbook playbooks/setup.yml --tags docker,nginx
```

---

## Вопросы по выполнению

### Q: Что делать если Ansible не может подключиться по SSH?

**A:** 
1. Проверь SSH доступ вручную:
   ```bash
   ssh keksik@YOUR_IP -p 2222
   ```

2. Скопируй SSH ключ:
   ```bash
   ssh-copy-id -p 2222 keksik@YOUR_IP
   ```

3. Проверь через Ansible ping:
   ```bash
   ansible all -i inventory/hosts.yml -m ping
   ```

---

### Q: Ошибка "sudo: a password is required"

**A:** Нужны sudo права без пароля для пользователя. Добавь в sudoers:

```bash
# На сервере
sudo visudo

# Добавить строку:
keksik ALL=(ALL) NOPASSWD:ALL
```

Или используй флаг `--ask-become-pass` при запуске:
```bash
ansible-playbook playbooks/setup.yml --ask-become-pass
```

---

### Q: Playbook падает на задаче установки Docker

**A:** Возможные причины:
1. Неправильная архитектура (должна быть amd64 или arm64)
2. Старая версия Ubuntu (нужна 22.04+)
3. Нет интернета на сервере

Отладка:
```bash
ansible-playbook playbooks/setup.yml -vvv --tags docker
```

---

### Q: Nginx не стартует после настройки

**A:** Проверь конфигурацию:

```bash
# На сервере
sudo nginx -t

# Смотри логи
sudo journalctl -u nginx -n 50

# Проверь что порт 82 свободен
sudo netstat -tulpn | grep :82
```

---

## Вопросы по мониторингу

### Q: Grafana не открывается на порту 3000

**A:** Проверь:
1. Контейнер запущен: `docker compose ps`
2. UFW разрешает порт: `sudo ufw status`
3. Порт не занят: `netstat -tulpn | grep :3000`

Если нужно открыть порт:
```bash
sudo ufw allow 3000/tcp
```

---

### Q: Prometheus не собирает метрики

**A:** Проверь targets в Prometheus:
- Открой `http://YOUR_IP:9090/targets`
- Все эндпоинты должны быть UP
- Если DOWN - проверь `monitoring/prometheus.yml`

---

### Q: Где смотреть логи всех контейнеров?

**A:** 
```bash
# Все логи
docker compose logs

# Конкретный сервис
docker compose logs gateway

# Follow (live)
docker compose logs -f

# Последние 50 строк
docker compose logs --tail=50
```

---

## Вопросы по отчету

### Q: Какие скриншоты нужны для отчета?

**A:** Минимум:
1. Вывод `ansible-playbook playbooks/setup.yml` (успешное выполнение)
2. `docker ps` - все контейнеры запущены
3. Работающее приложение в браузере
4. `sudo ufw status` - firewall настроен
5. Структура Ansible файлов (`tree labs/lab5`)

---

### Q: Как конвертировать Markdown в PDF?

**A:** 
```bash
# Через pandoc
pandoc REPORT_LAB5.md -o REPORT_LAB5.pdf

# Через VS Code + Markdown PDF extension
# Или через online converter: https://www.markdowntopdf.com/
```

---

### Q: Нужно ли включать в отчет все YAML файлы?

**A:** Не обязательно все. Достаточно:
- Главный playbook (`setup.yml`)
- Одна роль полностью (например, `docker`)
- Скриншоты результата выполнения
- Описание что делает каждая роль

---

## Вопросы по безопасности

### Q: Безопасно ли отключать пароль для sudo?

**A:** В production - нет. Для учебного проекта - допустимо. Ansible роль `security` настроит:
- SSH только по ключам (без паролей)
- Fail2ban для защиты от брутфорса
- UFW firewall

---

### Q: Нужно ли менять дефолтный пароль Grafana?

**A:** Да! Используй переменную `GRAFANA_PASSWORD` в `.env`:

```bash
# labs/lab3/.env
GRAFANA_PASSWORD=your_strong_password_here
```

---

### Q: Как защитить секреты в Ansible?

**A:** Используй Ansible Vault:

```bash
# Создать зашифрованный файл
ansible-vault create group_vars/secrets.yml

# Отредактировать
ansible-vault edit group_vars/secrets.yml

# Запустить playbook с vault
ansible-playbook playbooks/setup.yml --ask-vault-pass
```

---

## Вопросы по дальнейшим ЛР

### Q: Мониторинг стек уже добавлен - нужно ли что-то делать для ЛР6?

**A:** Сервисы уже в docker-compose, но нужно:
1. Настроить дашборды в Grafana
2. Настроить алерты
3. Создать custom метрики в приложении
4. Интегрировать Sentry (опционально)

---

### Q: Какая связь между ЛР5 и Kubernetes (ЛР7)?

**A:** 
- ЛР5 = настройка серверов через Ansible
- ЛР7 = оркестрация в Kubernetes

Ansible может использоваться для:
- Настройки узлов Kubernetes кластера
- Деплоя в Kubernetes (через `k8s` модуль)

---

### Q: Нужен ли Ansible если есть Docker Compose?

**A:** Да! Они решают разные задачи:
- **Docker Compose** - запуск контейнеров
- **Ansible** - настройка серверов (установка Docker, настройка сети, безопасность, мониторинг)

---

## Дополнительно

### Q: Где найти больше информации об Ansible?

**A:** 
- Официальная документация: https://docs.ansible.com/
- Ansible Galaxy (готовые роли): https://galaxy.ansible.com/
- Примеры playbooks: https://github.com/ansible/ansible-examples
- `labs/lab5/CHEATSHEET.md` - шпаргалка по командам

---

### Q: Можно ли использовать Ansible для деплоя вместо GitHub Actions?

**A:** Да! Playbook `deploy.yml` уже реализует деплой:

```bash
ansible-playbook playbooks/deploy.yml
```

Но для автоматического деплоя при push лучше использовать GitHub Actions + Ansible вместе.

---

### Q: Как добавить свою роль в Ansible?

**A:** Используй скрипт:

```bash
cd labs/lab5
bash scripts/create-role.sh monitoring

# Отредактируй tasks
nano roles/monitoring/tasks/main.yml

# Добавь в playbook
# playbooks/setup.yml:
#   roles:
#     - role: monitoring
#       tags: [monitoring]
```

---

Есть еще вопросы? Смотри документацию в `labs/lab5/` или спроси у преподавателя! 🚀
