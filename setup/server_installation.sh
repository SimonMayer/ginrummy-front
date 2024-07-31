#!/bin/bash

# Ensure the script is run as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root"
   exit 1
fi

# Function to validate the URL
function validate_url() {
    local url=$1
    local regex="^https?://([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:[0-9]+)?(/.*)?$"
    if [[ $url =~ $regex ]]; then
        return 0
    else
        return 1
    fi
}

# Prompt for the domain name for the Vue app
read -p "Enter the domain name for the Vue app (e.g., subdomain.domain.example): " DOMAIN_NAME

# Prompt for the base URL of the engine
while true; do
    read -p "Enter the base URL of the engine: " BASE_URL
    BASE_URL=${BASE_URL%/}  # Trim trailing slash if it exists
    if validate_url "$BASE_URL"; then
        break
    else
        echo "Invalid URL. Please ensure it starts with http:// or https:// and is followed by a valid domain."
    fi
done

# Check if SSL certificate already exists
if [ ! -f "/etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem" ]; then
    is_ssl_certificate_required=true
else
    is_ssl_certificate_required=false
    echo "SSL certificate already exists for $DOMAIN_NAME. Skipping certificate request."
fi

if [ "$is_ssl_certificate_required" = true ]; then
    # Prompt for the email address for Certbot (optional)
    read -p "Enter your email address for Certbot (this is used for warnings about expiry, deprecation, etc. Leave blank to not provide an email address): " CERTBOT_EMAIL
fi

# Generate SSH Key if it doesn't exist
if [ ! -f ~/.ssh/id_rsa ]; then
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
fi

# Prompt to add SSH key to GitHub
cat ~/.ssh/id_rsa.pub
echo "Add the above SSH key to your GitHub account."
echo "Press [Enter] key after adding the SSH key to GitHub..."
read -p ""

# List of GitHub SSH key fingerprints
GITHUB_KEYS=(
    "github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl"
    "github.com ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBEmKSENjQEezOmxkZMy7opKgwFB9nkt5YRrYMjNuG5N87uRgg6CLrbo5wAdT/y6v0mKV0U2w0WZ2YB/++Tpockg="
    "github.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCj7ndNxQowgcQnjshcLrqPEiiphnt+VTTvDP6mHBL9j1aNUkY4Ue1gvwnGLVlOhGeYrnZaMgRK6+PKCUXaDbC7qtbW8gIkhL7aGCsOr/C56SJMy/BCZfxd1nWzAOxSDPgVsmerOBYfNqltV9/hWCqBywINIR+5dIg6JTJ72pcEpEjcYgXkE2YEFXV1JHnsKgbLWNlhScqb2UmyRkQyytRLtL+38TGxkxCflmO+5Z8CSSNY7GidjMIZ7Q4zMjA2n1nGrlTDkzwDCsw+wqFPGQA179cnfGWOWRVruj16z6XyvxvjJwbz0wQZ75XK5tKSb7FNyeIEs4TT4jk+S4dhPeAUC5y+bDYirYgM4GC7uEnztnZyaVWQ7B381AK4Qdrwt51ZqExKbQpTUNn+EjqoTwvqNj4kqx5QUCI0ThS/YkOxJCXmPUWZbhjpCg56i+2aB6CmK2JGhn57K5mj0MNdBXA4/WnwH6XoPWJzK5Nyu2zB3nAZp+S5hpQs+p1vN1/wsjk="
)

# Add GitHub's SSH key fingerprints to known hosts if not already present
for KEY in "${GITHUB_KEYS[@]}"; do
    if ! grep -q "$KEY" ~/.ssh/known_hosts; then
        echo "$KEY" >> ~/.ssh/known_hosts
    fi
done

# Update package lists and upgrade all packages
apt update && apt upgrade -y

# Install required packages
apt install python3 python3-pip python3-venv git nginx certbot python3-certbot-nginx expect -y

# Obtain an SSL certificate if required
if [ "$is_ssl_certificate_required" = true ]; then
    if [ -z "$CERTBOT_EMAIL" ]; then
        certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos --register-unsafely-without-email
    else
        certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos -m $CERTBOT_EMAIL
    fi
fi

# Clone the Repository or pull the latest changes
if [ -d "/root/ginrummy-front" ]; then
    cd /root/ginrummy-front && git pull
else
    git clone git@github.com:SimonMayer/ginrummy-front.git /root/ginrummy-front && cd /root/ginrummy-front
fi

# Create /root/ginrummy-front/.env.local with VUE_APP_BASE_URL set
cat <<EOL > /root/ginrummy-front/.env.local
VUE_APP_BASE_URL=$BASE_URL
EOL

# Install npm and vue-cli-service
apt install npm -y
npm install -g @vue/cli-service

# Install Dependencies
npm install

# Create vue.config.js for reverse proxy and HTTPS
cat <<EOL > vue.config.js
const fs = require('fs');

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: [
      '$DOMAIN_NAME'
    ],
    https: {
      key: fs.readFileSync('/etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem'),
    },
  }
};
EOL

# Set Up systemd Service
echo "
[Unit]
Description=Vue.js instance to serve ginrummy-front
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/root/ginrummy-front
ExecStart=/usr/bin/npm run serve -- --host 0.0.0.0 --port 8080

[Install]
WantedBy=multi-user.target
" > /etc/systemd/system/ginrummy-front.service

# Reload systemd and Start Vue.js Service
systemctl daemon-reload
systemctl start ginrummy-front
systemctl enable ginrummy-front

# Set Up Nginx as a Reverse Proxy with SSL
echo "
server {
    listen 80;
    server_name $DOMAIN_NAME;

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name $DOMAIN_NAME;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass https://127.0.0.1:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffering off;
    }
}
" > /etc/nginx/sites-available/ginrummy-front

# Enable the custom Nginx configuration
if [ ! -f /etc/nginx/sites-enabled/ginrummy-front ]; then
    ln -s /etc/nginx/sites-available/ginrummy-front /etc/nginx/sites-enabled/
fi

# Remove the default Nginx configuration if it exists
if [ -f /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
fi

# Restart Nginx
systemctl restart nginx
