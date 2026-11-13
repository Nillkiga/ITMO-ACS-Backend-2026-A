#!/bin/bash

# Создание структуры директорий для Ansible роли (если нужно добавить новую роль)

if [ -z "$1" ]; then
    echo "Usage: ./scripts/create-role.sh <role-name>"
    echo "Example: ./scripts/create-role.sh monitoring"
    exit 1
fi

ROLE_NAME=$1
ROLE_DIR="roles/$ROLE_NAME"

if [ -d "$ROLE_DIR" ]; then
    echo "Role '$ROLE_NAME' already exists!"
    exit 1
fi

echo "Creating role: $ROLE_NAME"

mkdir -p "$ROLE_DIR"/{tasks,handlers,templates,files,vars,defaults,meta}

cat > "$ROLE_DIR/tasks/main.yml" <<EOF
---
# $ROLE_NAME role tasks

- name: Example task
  debug:
    msg: "This is $ROLE_NAME role"
EOF

cat > "$ROLE_DIR/handlers/main.yml" <<EOF
---
# $ROLE_NAME handlers

- name: Example handler
  debug:
    msg: "Handler triggered"
EOF

cat > "$ROLE_DIR/defaults/main.yml" <<EOF
---
# $ROLE_NAME default variables

example_var: "default_value"
EOF

cat > "$ROLE_DIR/meta/main.yml" <<EOF
---
# $ROLE_NAME role metadata

dependencies: []
EOF

echo "✓ Role '$ROLE_NAME' created successfully!"
echo ""
echo "Structure:"
tree "$ROLE_DIR"
