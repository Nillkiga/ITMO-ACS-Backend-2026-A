# Makefile для удобного запуска Ansible команд

.PHONY: help ping check setup deploy update quick-setup test

INVENTORY := inventory/hosts.yml
PLAYBOOK_DIR := playbooks

help:
	@echo "Доступные команды:"
	@echo "  make ping         - Проверка доступности хостов"
	@echo "  make check        - Проверка playbook без изменений (dry-run)"
	@echo "  make setup        - Полная настройка сервера"
	@echo "  make quick-setup  - Быстрая настройка (Docker + Nginx)"
	@echo "  make deploy       - Деплой приложения"
	@echo "  make update       - Обновление пакетов"
	@echo "  make test         - Тест синтаксиса playbooks"

ping:
	ansible all -i $(INVENTORY) -m ping

check:
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/setup.yml --check --diff

setup:
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/setup.yml

quick-setup:
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/quick-setup.yml

deploy:
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/deploy.yml

update:
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/update.yml

test:
	./test.sh

# Запуск с тегами
setup-docker:
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/setup.yml --tags docker

setup-nginx:
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/setup.yml --tags nginx

setup-security:
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/setup.yml --tags security
