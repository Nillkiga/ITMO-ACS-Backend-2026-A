#!/bin/bash

# Bootstrap script - первый запуск для настройки сервера

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== Ansible Bootstrap Script ==="
echo ""

# Check if ansible is installed
if ! command -v ansible &> /dev/null; then
    echo "❌ Ansible not found. Install it first:"
    echo "   Ubuntu/Debian: sudo apt install ansible"
    echo "   macOS: brew install ansible"
    exit 1
fi

echo "✓ Ansible found: $(ansible --version | head -n1)"
echo ""

# Install required collections
echo "Installing Ansible Galaxy collections..."
ansible-galaxy collection install -r requirements.yml

echo ""
echo "=== Configuration ==="
echo "Edit these files before running:"
echo "  1. inventory/hosts.yml - set your server IP and SSH settings"
echo "  2. group_vars/all.yml - set domain, users, passwords"
echo ""

read -p "Have you edited the configuration files? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please edit the configuration files first, then run this script again."
    exit 0
fi

# Test connection
echo ""
echo "Testing SSH connection to hosts..."
if ansible all -i inventory/hosts.yml -m ping; then
    echo "✓ Connection successful!"
else
    echo "❌ Connection failed. Check your inventory and SSH keys."
    exit 1
fi

echo ""
read -p "Run full server setup now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Starting full setup..."
    ansible-playbook -i inventory/hosts.yml playbooks/setup.yml
    echo ""
    echo "=== Setup completed! ==="
else
    echo ""
    echo "Skipped. Run manually with:"
    echo "  ansible-playbook -i inventory/hosts.yml playbooks/setup.yml"
fi
