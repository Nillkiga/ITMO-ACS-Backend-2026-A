#!/bin/bash

# Init .env file with random secrets
# Run once on fresh server setup

if [ -f .env ]; then
    echo ".env already exists. Remove it first if you want to regenerate."
    exit 1
fi

generate_secret() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

cat > .env <<EOF
# Auto-generated secrets - DO NOT commit to git
AUTH_DB_PASSWORD=$(generate_secret)
RESTAURANT_DB_PASSWORD=$(generate_secret)
RESERVATION_DB_PASSWORD=$(generate_secret)
REVIEW_DB_PASSWORD=$(generate_secret)
JWT_SECRET_KEY=$(generate_secret)
INTERNAL_TOKEN=$(generate_secret)
RABBITMQ_USER=booking
RABBITMQ_PASS=$(generate_secret)
EOF

chmod 600 .env
echo "✓ .env file created with random secrets"
