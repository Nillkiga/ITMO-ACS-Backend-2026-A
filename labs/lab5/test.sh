#!/bin/bash

# Test script - проверка синтаксиса всех playbooks

set -e

echo "=== Testing Ansible playbooks syntax ==="

playbooks=(
    "playbooks/setup.yml"
    "playbooks/quick-setup.yml"
    "playbooks/update.yml"
    "playbooks/deploy.yml"
)

for playbook in "${playbooks[@]}"; do
    echo -n "Testing $playbook ... "
    ansible-playbook "$playbook" --syntax-check
    echo "✓"
done

echo ""
echo "=== Testing inventory ==="
ansible-inventory -i inventory/hosts.yml --list > /dev/null && echo "✓ Inventory OK"

echo ""
echo "All tests passed!"
