#!/bin/bash

# ==============================================================================
# Script de Instalação Automática da VPS Hostinger - Solta o Verbo
# ==============================================================================

set -e

echo "🚀 Iniciando configuração do servidor web Nginx para Solta o Verbo..."

# 1. Se o Apache2 estiver ativo consumindo a porta 80, parar e desativar
if systemctl is-active --quiet apache2 2>/dev/null; then
    echo "⚠️ Apache detectado rodando na porta 80. Desativando Apache2..."
    sudo systemctl stop apache2 || true
    sudo systemctl disable apache2 || true
fi

# 2. Atualizar repositórios e instalar pacotes necessários
echo "📦 Instalando Nginx, Certbot e rsync..."
sudo apt update -y
sudo apt install -y nginx certbot python3-certbot-nginx rsync curl git

# 3. Criar diretório da aplicação e definir permissões
echo "📁 Criando diretório /var/www/soltaoverbo..."
sudo mkdir -p /var/www/soltaoverbo
sudo chown -R $USER:www-data /var/www/soltaoverbo
sudo chmod -R 775 /var/www/soltaoverbo

# 4. Baixar e aplicar a configuração do Nginx
echo "⚙️ Configurando o Nginx..."
sudo curl -sSL https://raw.githubusercontent.com/Digital-alignment/soltaoverbo/main/nginx/soltaoverbo.conf -o /etc/nginx/sites-available/soltaoverbo

# Ativar o site no Nginx
sudo ln -sf /etc/nginx/sites-available/soltaoverbo /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default || true

# Testar sintaxe do Nginx
sudo nginx -t

# Iniciar/Reiniciar o Nginx
echo "🔄 Iniciando e ativando o Nginx..."
sudo systemctl enable nginx
sudo systemctl restart nginx

# 5. Configurar SSL HTTPS via Certbot
echo "🔒 Configurando certificado SSL HTTPS via Let's Encrypt..."
sudo certbot --nginx --non-interactive --agree-tos --register-unsafely-without-email -d soltaoverbocoletivo.com -d www.soltaoverbocoletivo.com || echo "⚠️ Certbot SSL pode exigir apontamento prévio do DNS. Execute 'sudo certbot --nginx' após apontar o DNS."

echo "✅ Configuração da VPS concluída com sucesso!"
echo "📍 Pasta de publicação: /var/www/soltaoverbo"
