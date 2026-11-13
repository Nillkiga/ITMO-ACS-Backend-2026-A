#!/bin/bash

# Создание SSH ключа для Ansible (если еще нет)

KEY_PATH="$HOME/.ssh/ansible_id_rsa"

if [ -f "$KEY_PATH" ]; then
    echo "SSH ключ уже существует: $KEY_PATH"
    exit 0
fi

echo "Создание SSH ключа для Ansible..."
ssh-keygen -t rsa -b 4096 -f "$KEY_PATH" -N "" -C "ansible-automation"

echo ""
echo "✓ SSH ключ создан: $KEY_PATH"
echo ""
echo "Скопируй публичный ключ на сервер:"
echo "  ssh-copy-id -i $KEY_PATH.pub -p 22 allah@82.179.250.71"
echo ""
echo "Или добавь в ~/.ssh/authorized_keys на сервере:"
cat "$KEY_PATH.pub"
