#!/bin/bash

# Ensure the script is run as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root"
   exit 1
fi

# Prompt for the MySQL root password
read -s -p "Enter MySQL root password: " MYSQL_ROOT_PASSWORD
echo

# Stop and disable the ginrummy-engine service
systemctl stop ginrummy-engine
systemctl disable ginrummy-engine

# Remove the ginrummy-engine systemd service file
rm /etc/systemd/system/ginrummy-engine.service

# Reload systemd to apply changes
systemctl daemon-reload

# Remove Nginx configuration
rm /etc/nginx/sites-enabled/ginrummy-engine
rm /etc/nginx/sites-available/ginrummy-engine

# Restart Nginx to apply changes
systemctl restart nginx

# Remove the ginrummy-engine directory
rm -rf /root/ginrummy-engine

# Remove MySQL configuration changes and the GinRummy database
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "DROP DATABASE IF EXISTS GinRummy;"
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "DELETE FROM mysql.user WHERE User='root';"
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "FLUSH PRIVILEGES;"

# Reset swappiness setting
sed -i '/vm.swappiness=60/d' /etc/sysctl.conf
sysctl -p

# Remove known hosts entries for GitHub
sed -i '/github.com ssh-ed25519/d' ~/.ssh/known_hosts
sed -i '/github.com ecdsa-sha2-nistp256/d' ~/.ssh/known_hosts
sed -i '/github.com ssh-rsa/d' ~/.ssh/known_hosts

# Remove SSH key
rm ~/.ssh/id_rsa
rm ~/.ssh/id_rsa.pub
