#!/bin/bash

# Work-Util Nginx Deployment Script
# This script handles nginx configuration deployment and management

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration variables
NGINX_CONF_DIR="/etc/nginx/conf.d"
NGINX_SITES_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"
PROJECT_ROOT="/home/gurwls2399/work-space/work-util"
WEB_ROOT="/var/www/work-util"
BACKUP_DIR="/var/backups/nginx"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root"
        exit 1
    fi
}

# Function to check nginx installation
check_nginx() {
    if ! command -v nginx &> /dev/null; then
        print_error "Nginx is not installed. Please install nginx first."
        exit 1
    fi
    print_status "Nginx is installed"
}

# Function to backup current nginx configuration
backup_nginx_config() {
    print_status "Backing up current nginx configuration..."
    
    mkdir -p "$BACKUP_DIR"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/nginx_backup_$TIMESTAMP.tar.gz"
    
    tar -czf "$BACKUP_FILE" -C /etc/nginx . 2>/dev/null || true
    print_status "Backup created: $BACKUP_FILE"
}

# Function to test nginx configuration
test_nginx_config() {
    print_status "Testing nginx configuration..."
    
    if nginx -t; then
        print_status "Nginx configuration test passed"
        return 0
    else
        print_error "Nginx configuration test failed"
        return 1
    fi
}

# Function to deploy nginx configuration
deploy_config() {
    local config_type=$1
    local config_file=""
    local target_file=""
    
    case $config_type in
        "production")
            config_file="$PROJECT_ROOT/nginx-production.conf"
            target_file="work-util.conf"
            ;;
        "load-balanced")
            config_file="$PROJECT_ROOT/nginx-load-balanced.conf"
            target_file="work-util-lb.conf"
            ;;
        "direct")
            config_file="$PROJECT_ROOT/nginx-direct.conf"
            target_file="work-util-direct.conf"
            ;;
        *)
            print_error "Unknown configuration type: $config_type"
            exit 1
            ;;
    esac
    
    if [[ ! -f "$config_file" ]]; then
        print_error "Configuration file not found: $config_file"
        exit 1
    fi
    
    print_status "Deploying $config_type configuration..."
    
    # Copy configuration to nginx directory
    cp "$config_file" "$NGINX_CONF_DIR/$target_file"
    
    # Remove any conflicting default configurations
    rm -f "$NGINX_ENABLED_DIR/default" 2>/dev/null || true
    
    print_status "Configuration deployed to $NGINX_CONF_DIR/$target_file"
}

# Function to setup SSL certificates
setup_ssl() {
    local domain=$1
    
    print_status "Setting up SSL for domain: $domain"
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        print_warning "Certbot not found. Installing certbot..."
        apt-get update && apt-get install -y certbot python3-certbot-nginx
    fi
    
    # Check if certificate already exists
    if [[ -d "/etc/letsencrypt/live/$domain" ]]; then
        print_status "SSL certificate already exists for $domain"
        return 0
    fi
    
    # Obtain SSL certificate
    print_status "Obtaining SSL certificate..."
    certbot certonly --nginx -d "$domain" -d "www.$domain" --non-interactive --agree-tos --email admin@"$domain"
}

# Function to setup web root directory
setup_web_root() {
    print_status "Setting up web root directory..."
    
    # Create web root directory
    mkdir -p "$WEB_ROOT"
    
    # Set proper permissions
    chown -R www-data:www-data "$WEB_ROOT" 2>/dev/null || chown -R nginx:nginx "$WEB_ROOT"
    chmod -R 755 "$WEB_ROOT"
    
    print_status "Web root directory setup complete: $WEB_ROOT"
}

# Function to reload nginx
reload_nginx() {
    print_status "Reloading nginx..."
    
    if systemctl reload nginx; then
        print_status "Nginx reloaded successfully"
    else
        print_error "Failed to reload nginx"
        exit 1
    fi
}

# Function to restart nginx
restart_nginx() {
    print_status "Restarting nginx..."
    
    if systemctl restart nginx; then
        print_status "Nginx restarted successfully"
    else
        print_error "Failed to restart nginx"
        exit 1
    fi
}

# Function to show nginx status
show_status() {
    print_status "Nginx service status:"
    systemctl status nginx --no-pager
    
    echo ""
    print_status "Active nginx configurations:"
    ls -la "$NGINX_CONF_DIR"/*.conf 2>/dev/null || echo "No configurations found"
}

# Function to enable monitoring
setup_monitoring() {
    print_status "Setting up nginx monitoring..."
    
    # Create monitoring script
    cat > /usr/local/bin/check_nginx.sh << 'EOF'
#!/bin/bash
# Nginx health check script

NGINX_STATUS=$(systemctl is-active nginx)
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/health)

if [[ "$NGINX_STATUS" != "active" ]]; then
    echo "CRITICAL: Nginx is not running"
    systemctl start nginx
    exit 2
fi

if [[ "$BACKEND_HEALTH" != "200" ]]; then
    echo "WARNING: Backend health check failed (HTTP $BACKEND_HEALTH)"
    exit 1
fi

echo "OK: Nginx and backend are healthy"
exit 0
EOF
    
    chmod +x /usr/local/bin/check_nginx.sh
    
    # Add cron job for monitoring
    if ! crontab -l | grep -q "check_nginx.sh"; then
        (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/check_nginx.sh >> /var/log/nginx-monitor.log 2>&1") | crontab -
        print_status "Monitoring cron job added (runs every 5 minutes)"
    fi
}

# Function to optimize nginx
optimize_nginx() {
    print_status "Optimizing nginx configuration..."
    
    # Get number of CPU cores
    CPU_CORES=$(nproc)
    
    # Create optimized nginx.conf
    cat > /etc/nginx/nginx.conf << EOF
user www-data;
worker_processes $CPU_CORES;
worker_rlimit_nofile 65535;
pid /run/nginx.pid;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    client_max_body_size 100M;
    
    # MIME Types
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging Settings
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    # Gzip Settings
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss application/rss+xml application/atom+xml image/svg+xml;
    
    # Virtual Host Configs
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
EOF
    
    print_status "Nginx optimization complete"
}

# Main menu
show_menu() {
    echo ""
    echo "Work-Util Nginx Deployment Menu"
    echo "==============================="
    echo "1. Deploy production configuration"
    echo "2. Deploy load-balanced configuration"
    echo "3. Deploy direct configuration"
    echo "4. Setup SSL certificate"
    echo "5. Test nginx configuration"
    echo "6. Reload nginx"
    echo "7. Restart nginx"
    echo "8. Show nginx status"
    echo "9. Setup monitoring"
    echo "10. Optimize nginx"
    echo "11. Backup nginx configuration"
    echo "0. Exit"
    echo ""
}

# Main execution
main() {
    check_root
    check_nginx
    
    while true; do
        show_menu
        read -p "Enter your choice: " choice
        
        case $choice in
            1)
                backup_nginx_config
                deploy_config "production"
                test_nginx_config && reload_nginx
                ;;
            2)
                backup_nginx_config
                deploy_config "load-balanced"
                test_nginx_config && reload_nginx
                ;;
            3)
                backup_nginx_config
                deploy_config "direct"
                test_nginx_config && reload_nginx
                ;;
            4)
                read -p "Enter domain name: " domain
                setup_ssl "$domain"
                ;;
            5)
                test_nginx_config
                ;;
            6)
                reload_nginx
                ;;
            7)
                restart_nginx
                ;;
            8)
                show_status
                ;;
            9)
                setup_monitoring
                ;;
            10)
                backup_nginx_config
                optimize_nginx
                test_nginx_config && reload_nginx
                ;;
            11)
                backup_nginx_config
                ;;
            0)
                print_status "Exiting..."
                exit 0
                ;;
            *)
                print_error "Invalid choice. Please try again."
                ;;
        esac
    done
}

# Run main function
main