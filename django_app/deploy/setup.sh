#!/bin/bash
# EC2 Ubuntu 22.04 setup script — run as root or with sudo
set -e

echo "==> Updating system packages"
apt-get update && apt-get upgrade -y

echo "==> Installing Python, pip, nginx, postgresql"
apt-get install -y python3 python3-pip python3-venv nginx postgresql postgresql-contrib git

echo "==> Starting PostgreSQL"
systemctl enable postgresql
systemctl start postgresql

echo "==> Creating database and user"
# Edit DB_PASSWORD below before running
DB_NAME=hrdb
DB_USER=hruser
DB_PASSWORD=changeme123

sudo -u postgres psql <<SQL
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE $DB_NAME OWNER $DB_USER;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
SQL

echo "==> Cloning repository"
cd /opt
git clone https://github.com/Prathmesh-28/hr-hiring-pipeline.git hr
cd hr/django_app

echo "==> Creating Python virtualenv and installing deps"
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "==> Copying .env file — EDIT THIS FILE BEFORE CONTINUING"
cp .env.example .env
echo ""
echo ">>> Edit /opt/hr/django_app/.env with your real values, then re-run:"
echo ">>> source venv/bin/activate && python manage.py migrate && python manage.py collectstatic --noinput"
echo ""

echo "==> Copying systemd service"
cp /opt/hr/django_app/deploy/gunicorn.service /etc/systemd/system/gunicorn.service
systemctl daemon-reload
systemctl enable gunicorn

echo "==> Copying nginx config"
cp /opt/hr/django_app/deploy/nginx.conf /etc/nginx/sites-available/hr
ln -sf /etc/nginx/sites-available/hr /etc/nginx/sites-enabled/hr
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo "==> Done. Edit .env, run migrations, then: systemctl start gunicorn"
