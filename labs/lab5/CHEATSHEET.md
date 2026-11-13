# Шпаргалка по Ansible для ЛР5

## Основные команды

```bash
# Проверка доступности хостов
ansible all -i inventory/hosts.yml -m ping

# Dry-run (без изменений)
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --check

# Dry-run с diff
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --check --diff

# Запуск playbook
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml

# Verbose режим (для отладки)
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml -v
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml -vvv  # очень подробный

# Запуск с тегами (только определенные роли)
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --tags docker
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --tags nginx,security

# Пропустить теги
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --skip-tags security

# Запуск для конкретного хоста
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml --limit production

# Запуск с переопределением переменных
ansible-playbook -i inventory/hosts.yml playbooks/setup.yml -e "nginx_port=8080"
```

## Ad-hoc команды (для быстрых задач)

```bash
# Выполнить команду на всех хостах
ansible all -i inventory/hosts.yml -a "uptime"
ansible all -i inventory/hosts.yml -a "df -h"

# Перезагрузить сервис
ansible all -i inventory/hosts.yml -m systemd -a "name=nginx state=restarted" --become

# Обновить пакеты
ansible all -i inventory/hosts.yml -m apt -a "upgrade=dist update_cache=yes" --become

# Скопировать файл
ansible all -i inventory/hosts.yml -m copy -a "src=./file.txt dest=/tmp/file.txt"

# Проверить переменные хоста
ansible-inventory -i inventory/hosts.yml --host app-server
ansible-inventory -i inventory/hosts.yml --list
```

## Структура проекта

```
lab5/
├── ansible.cfg              # Главный конфиг Ansible
├── inventory/
│   └── hosts.yml           # Список серверов (IP, SSH порты, пользователи)
├── group_vars/
│   └── all.yml             # Переменные для всех хостов
├── playbooks/
│   └── setup.yml           # Главный playbook
└── roles/
    ├── common/
    │   ├── tasks/main.yml       # Задачи роли
    │   ├── defaults/main.yml    # Переменные по умолчанию
    │   └── handlers/main.yml    # Обработчики событий
    ├── docker/
    ├── nginx/
    │   └── templates/           # Jinja2 шаблоны конфигов
    │       └── nginx.conf.j2
    ├── security/
    └── app/
```

## Синтаксис playbook

```yaml
---
- name: Название playbook
  hosts: production          # на каких хостах запускать
  become: true              # использовать sudo
  gather_facts: true        # собирать информацию о системе
  
  vars:                     # переменные playbook
    my_var: value
  
  pre_tasks:                # задачи до ролей
    - name: Update cache
      apt:
        update_cache: yes
  
  roles:                    # список ролей
    - role: common
      tags: [common]
  
  tasks:                    # задачи после ролей
    - name: Create file
      file:
        path: /tmp/test
        state: touch
  
  post_tasks:               # задачи в самом конце
    - name: Display message
      debug:
        msg: "Done!"
```

## Синтаксис tasks

```yaml
# Установка пакета
- name: Install nginx
  apt:
    name: nginx
    state: present
  tags: nginx

# Запуск сервиса
- name: Start nginx
  systemd:
    name: nginx
    state: started
    enabled: yes

# Копирование файла
- name: Copy config
  copy:
    src: files/nginx.conf
    dest: /etc/nginx/nginx.conf
    owner: root
    group: root
    mode: '0644'
  notify: Restart nginx    # вызовет handler

# Шаблон (с переменными)
- name: Deploy template
  template:
    src: templates/app.conf.j2
    dest: /etc/nginx/conf.d/app.conf
  notify: Reload nginx

# Выполнение команды
- name: Run script
  shell: |
    cd /opt/app
    ./script.sh
  args:
    creates: /opt/app/done.flag  # не выполнять если файл существует

# Условие
- name: Install on Ubuntu only
  apt:
    name: package
    state: present
  when: ansible_distribution == "Ubuntu"

# Цикл
- name: Create users
  user:
    name: "{{ item }}"
    state: present
  loop:
    - user1
    - user2
    - user3
```

## Handlers

```yaml
# roles/nginx/handlers/main.yml
---
- name: Restart nginx
  systemd:
    name: nginx
    state: restarted

- name: Reload nginx
  systemd:
    name: nginx
    state: reloaded
```

## Jinja2 шаблоны

```nginx
# roles/nginx/templates/app.conf.j2
server {
    listen {{ nginx_port }};
    server_name {{ nginx_domain }};
    
    location / {
        proxy_pass http://127.0.0.1:{{ nginx_backend_port }};
    }
}
```

## Переменные

```yaml
# group_vars/all.yml
nginx_port: 80
nginx_domain: example.com

# В playbook
- debug:
    msg: "Port is {{ nginx_port }}"

# Ansible facts (автоматически собираются)
- debug:
    msg: "OS is {{ ansible_distribution }}"
    
# Системные переменные
{{ ansible_hostname }}
{{ ansible_host }}
{{ ansible_distribution }}
{{ ansible_distribution_version }}
```

## Отладка

```bash
# Проверить синтаксис
ansible-playbook playbooks/setup.yml --syntax-check

# Посмотреть что будет выполняться
ansible-playbook playbooks/setup.yml --list-tasks

# Посмотреть список хостов
ansible-playbook playbooks/setup.yml --list-hosts

# Начать с определенной задачи
ansible-playbook playbooks/setup.yml --start-at-task="Install nginx"

# Debug модуль в playbook
- name: Show variable
  debug:
    var: nginx_port
    
- name: Show message
  debug:
    msg: "Value is {{ my_var }}"
```

## Полезные модули

- `apt` - управление пакетами Ubuntu/Debian
- `yum` - управление пакетами CentOS/RHEL
- `systemd` - управление сервисами
- `copy` - копирование файлов
- `template` - развертывание шаблонов
- `file` - создание файлов/директорий
- `user` - управление пользователями
- `group` - управление группами
- `git` - работа с git
- `docker_container` - управление Docker контейнерами
- `shell` - выполнение shell команд
- `command` - выполнение команд (без shell)
- `debug` - вывод отладочной информации

## Best practices

1. Всегда используй `--check` перед реальным запуском
2. Используй tags для гибкого запуска
3. Храни секреты в Ansible Vault
4. Делай роли идемпотентными (можно запускать многократно)
5. Используй handlers для перезагрузки сервисов
6. Пиши понятные имена задач (name:)
7. Добавляй комментарии в сложных местах
