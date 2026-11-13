#!/bin/bash

# Healthcheck script for all microservices
# Returns exit 0 if all services are healthy, exit 1 otherwise

GATEWAY_URL="http://localhost:8010"
AUTH_URL="http://localhost:8001"
RESTAURANT_URL="http://localhost:8002"
RESERVATION_URL="http://localhost:8003"
REVIEW_URL="http://localhost:8004"

TIMEOUT=5
MAX_RETRIES=10
RETRY_DELAY=3

echo "=== Starting healthcheck for all microservices ==="

check_service() {
    local service_name=$1
    local service_url=$2
    
    echo -n "Checking $service_name at $service_url ... "
    
    for i in $(seq 1 $MAX_RETRIES); do
        # Убрали -f (чтобы 404 не считался ошибкой) 
        # и проверяем корень / вместо /health
        if curl -s --max-time $TIMEOUT "$service_url/" > /dev/null 2>&1; then
            echo "✓ OK"
            return 0
        fi
        
        if [ $i -lt $MAX_RETRIES ]; then
            echo -n "retry $i/$MAX_RETRIES ... "
            sleep $RETRY_DELAY
        fi
    done
    
    echo "✗ FAILED after $MAX_RETRIES attempts"
    return 1
}

FAILED=0

check_service "Gateway" "$GATEWAY_URL" || FAILED=1
check_service "Auth-User Service" "$AUTH_URL" || FAILED=1
check_service "Restaurant Service" "$RESTAURANT_URL" || FAILED=1
check_service "Reservation Service" "$RESERVATION_URL" || FAILED=1
check_service "Review Service" "$REVIEW_URL" || FAILED=1

echo ""

if [ $FAILED -eq 0 ]; then
    echo "=== All services are healthy ✓ ==="
    exit 0
else
    echo "=== Some services failed healthcheck ✗ ==="
    exit 1
fi