# Football Analyzer Bot - Guia de Deployment

## 🚀 Opções de Deployment

Existem várias formas de colocar o Football Analyzer Bot em prática. Escolha a que melhor se adequa ao seu caso:

---

## Opção 1: Desenvolvimento Local (Recomendado para Começar)

### Requisitos
- Node.js 18+ instalado
- npm ou pnpm
- MySQL 8.0+ ou MariaDB
- Git (opcional)

### Passo 1: Preparar o Ambiente

```bash
# Clonar ou extrair o projeto
unzip football-analyzer-bot-phase5.zip
cd football-analyzer-bot

# Instalar dependências
pnpm install
# ou
npm install
```

### Passo 2: Configurar Banco de Dados

#### Opção A: MySQL Local

```bash
# Instalar MySQL (macOS com Homebrew)
brew install mysql

# Iniciar MySQL
brew services start mysql

# Criar banco de dados
mysql -u root -p
```

```sql
CREATE DATABASE football_analyzer;
CREATE USER 'football_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON football_analyzer.* TO 'football_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Opção B: Docker (Mais Fácil)

```bash
# Criar arquivo docker-compose.yml na raiz do projeto
```

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: football_analyzer
      MYSQL_USER: football_user
      MYSQL_PASSWORD: football_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

```bash
# Iniciar o banco de dados
docker-compose up -d
```

### Passo 3: Configurar Variáveis de Ambiente

Criar arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="mysql://football_user:football_password@localhost:3306/football_analyzer"

# API Football (obter em https://www.api-football.com/)
VITE_API_FOOTBALL_KEY=sua_chave_api_aqui

# OpenAI (para insights com IA)
OPENAI_API_KEY=sua_chave_openai_aqui

# Configurações da Aplicação
NODE_ENV=development
PORT=3000
```

### Passo 4: Migrar Banco de Dados

```bash
# Gerar e executar migrações
pnpm run db:push
# ou
npm run db:push
```

### Passo 5: Iniciar o Servidor de Desenvolvimento

```bash
# Terminal 1: Backend
pnpm run dev
# ou
npm run dev

# Terminal 2: Frontend (em outra aba)
cd client
pnpm run dev
# ou
npm run dev
```

### Passo 6: Acessar a Aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

---

## Opção 2: Deploy em Produção (Vercel + Supabase)

### Requisitos
- Conta Vercel (gratuita)
- Conta Supabase (gratuita)
- Repositório GitHub

### Passo 1: Preparar Repositório GitHub

```bash
# Inicializar Git (se não existir)
git init
git add .
git commit -m "Initial commit: Football Analyzer Bot Phase 5"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/seu-usuario/football-analyzer-bot.git
git branch -M main
git push -u origin main
```

### Passo 2: Configurar Banco de Dados (Supabase)

1. Acesse https://supabase.com
2. Crie um novo projeto
3. Copie a connection string PostgreSQL
4. Atualize `.env` com a nova string:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

### Passo 3: Deploy no Vercel

1. Acesse https://vercel.com
2. Clique em "New Project"
3. Selecione seu repositório GitHub
4. Configure as variáveis de ambiente:
   - `DATABASE_URL`
   - `VITE_API_FOOTBALL_KEY`
   - `OPENAI_API_KEY`
5. Clique em "Deploy"

### Passo 4: Configurar Domínio Personalizado

1. No Vercel, vá para "Settings" > "Domains"
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme instruído

---

## Opção 3: Deploy com Docker (Recomendado para Produção)

### Passo 1: Criar Dockerfile

Criar arquivo `Dockerfile` na raiz do projeto:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependências
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copiar código
COPY . .

# Build
RUN pnpm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Instalar dependências de produção
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

# Copiar arquivos buildados
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle

# Expor porta
EXPOSE 3000

# Executar aplicação
CMD ["node", "dist/index.js"]
```

### Passo 2: Criar docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - app-network

  app:
    build: .
    environment:
      DATABASE_URL: mysql://${DB_USER}:${DB_PASSWORD}@mysql:3306/${DB_NAME}
      VITE_API_FOOTBALL_KEY: ${VITE_API_FOOTBALL_KEY}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      NODE_ENV: production
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - mysql
    networks:
      - app-network

volumes:
  mysql_data:

networks:
  app-network:
```

### Passo 3: Criar .env.production

```env
DB_ROOT_PASSWORD=root_secure_password
DB_NAME=football_analyzer
DB_USER=football_user
DB_PASSWORD=user_secure_password
VITE_API_FOOTBALL_KEY=sua_chave_api
OPENAI_API_KEY=sua_chave_openai
```

### Passo 4: Deploy

```bash
# Construir e iniciar
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Parar
docker-compose down
```

---

## Opção 4: Deploy em Plataformas Gerenciadas

### Railway (Recomendado - Fácil)

1. Acesse https://railway.app
2. Clique em "New Project"
3. Selecione "Deploy from GitHub"
4. Conecte seu repositório
5. Railway detectará automaticamente a configuração
6. Adicione variáveis de ambiente
7. Deploy automático

**Vantagens:**
- Muito fácil de usar
- Plano gratuito generoso
- Suporte a MySQL/PostgreSQL
- Domínio automático

### Render

1. Acesse https://render.com
2. Crie um novo "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - Build command: `pnpm install && pnpm run build`
   - Start command: `node dist/index.js`
5. Adicione variáveis de ambiente
6. Deploy

### Heroku (Descontinuado, não recomendado)

Heroku descontinuou seu plano gratuito em 2022. Use Railway ou Render em vez disso.

---

## Opção 5: VPS Próprio (DigitalOcean, Linode, AWS)

### DigitalOcean Droplet

1. Crie um Droplet Ubuntu 22.04
2. SSH no servidor:

```bash
ssh root@seu_ip_droplet
```

3. Instale dependências:

```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Instalar MySQL
apt install -y mysql-server

# Instalar Nginx (para proxy reverso)
apt install -y nginx

# Instalar PM2 (gerenciador de processos)
npm install -g pm2
```

4. Clone o repositório:

```bash
cd /var/www
git clone seu_repositorio
cd football-analyzer-bot
pnpm install
```

5. Configure Nginx:

```nginx
server {
    listen 80;
    server_name seu_dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. Inicie a aplicação com PM2:

```bash
pm2 start "pnpm run start" --name "football-analyzer"
pm2 startup
pm2 save
```

---

## Comparação de Opções

| Opção | Custo | Dificuldade | Escalabilidade | Melhor Para |
|-------|-------|------------|-----------------|------------|
| **Local** | Grátis | Fácil | Baixa | Desenvolvimento |
| **Vercel + Supabase** | Grátis-$20/mês | Fácil | Alta | Produção pequena |
| **Docker** | Grátis | Média | Alta | Qualquer escala |
| **Railway** | Grátis-$5/mês | Fácil | Média | Produção pequena |
| **Render** | Grátis-$7/mês | Fácil | Média | Produção pequena |
| **VPS** | $5-20/mês | Difícil | Alta | Produção grande |

---

## 🔧 Configuração de Variáveis de Ambiente

### Desenvolvimento (.env)

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/football_analyzer"

# API Football
VITE_API_FOOTBALL_KEY=sua_chave_api

# OpenAI
OPENAI_API_KEY=sua_chave_openai

# Desenvolvimento
NODE_ENV=development
DEBUG=true
```

### Produção (.env.production)

```env
# Database (Supabase ou RDS)
DATABASE_URL="postgresql://user:password@host:port/database"

# API Football
VITE_API_FOOTBALL_KEY=sua_chave_api

# OpenAI
OPENAI_API_KEY=sua_chave_openai

# Produção
NODE_ENV=production
DEBUG=false
PORT=3000
```

---

## 📋 Checklist de Deployment

### Antes de Fazer Deploy

- [ ] Banco de dados configurado
- [ ] Variáveis de ambiente definidas
- [ ] Chaves de API obtidas (API-Football, OpenAI)
- [ ] Testes executados localmente
- [ ] Build testado: `pnpm run build`
- [ ] Código commitado no Git
- [ ] README atualizado

### Após o Deploy

- [ ] Testar acesso à aplicação
- [ ] Verificar logs de erro
- [ ] Testar filtros de histórico
- [ ] Testar comparação de times
- [ ] Verificar performance
- [ ] Configurar backups do banco de dados
- [ ] Configurar monitoramento

---

## 🐛 Troubleshooting

### Erro: "Database connection failed"

```bash
# Verificar conexão MySQL
mysql -u football_user -p -h localhost -D football_analyzer

# Ou com Docker
docker exec -it container_name mysql -u football_user -p
```

### Erro: "API key invalid"

- Verifique a chave de API no painel da API-Football
- Confirme que está no arquivo `.env`
- Reinicie a aplicação

### Erro: "Port already in use"

```bash
# Encontrar processo usando a porta
lsof -i :3000

# Matar processo
kill -9 PID
```

### Aplicação lenta

- Verifique índices do banco de dados
- Use paginação nos filtros
- Considere adicionar cache
- Monitore uso de CPU/memória

---

## 📊 Monitoramento em Produção

### Logs

```bash
# Com PM2
pm2 logs football-analyzer

# Com Docker
docker-compose logs -f app
```

### Métricas

- CPU: Deve estar < 50%
- Memória: Deve estar < 500MB
- Tempo de resposta: Deve estar < 500ms

### Backups

```bash
# Backup MySQL
mysqldump -u football_user -p football_analyzer > backup.sql

# Restaurar
mysql -u football_user -p football_analyzer < backup.sql
```

---

## 🎓 Recomendações Finais

### Para Começar (Recomendado)
1. Comece com **Desenvolvimento Local**
2. Teste todas as funcionalidades
3. Depois escolha uma opção de produção

### Para Produção Pequena
- **Railway** ou **Render** (mais fácil)
- Ou **Vercel + Supabase** (mais escalável)

### Para Produção Grande
- **Docker + VPS** (mais controle)
- Ou **Kubernetes** (para escala massiva)

---

## 📞 Suporte

Para dúvidas sobre deployment:
1. Consulte a documentação da plataforma escolhida
2. Verifique os logs de erro
3. Teste em desenvolvimento primeiro

---

**Última atualização**: Janeiro 2026  
**Versão**: 1.0.0
