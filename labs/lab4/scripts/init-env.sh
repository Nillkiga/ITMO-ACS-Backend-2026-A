#!/usr/bin/env bash
# Создаёт .env из .env.example, заменяя каждое CHANGE_ME случайным значением.
# Запуск из каталога приложения (где compose.yaml): bash init-env.sh
set -euo pipefail
[[ -f .env ]] && { echo '.env уже есть - не трогаю'; exit 0; }
[[ -f .env.example ]] || { echo 'Нет .env.example'; exit 1; }
umask 077
while IFS= read -r line; do
    while [[ "$line" == *CHANGE_ME* ]]; do line="${line/CHANGE_ME/$(openssl rand -hex 24)}"; done
    printf '%s\n' "$line"
done < .env.example > .env
echo '.env создан'
