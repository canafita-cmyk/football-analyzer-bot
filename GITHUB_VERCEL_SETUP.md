# 🚀 Guia Completo: GitHub + Vercel

Este guia mostra **passo a passo** como colocar seu projeto no GitHub e fazer deploy na Vercel.

---

## 📦 Parte 1: Preparar os Arquivos

Você tem dois projetos que precisam estar juntos:

1. **Frontend** (React) - Pasta `football-frontend`
2. **Backend** (API) - Seu repositório atual no GitHub

### Estrutura Final Esperada

```
football-analyzer-bot/
├── client/                 ← Frontend React
│   ├── src/
│   ├── public/
│   └── index.html
├── api/                    ← Backend API
│   └── index.ts
├── package.json
├── vercel.json
└── README.md
```

---

## 🔧 Parte 2: Mesclar Frontend + Backend

### Opção A: Usando Git (Recomendado)

Se você já tem o backend no GitHub:

```bash
# 1. Clonar seu repositório atual
git clone https://github.com/SEU_USUARIO/football-analyzer-bot.git
cd football-analyzer-bot

# 2. Copiar os arquivos do frontend
# (Copie a pasta client/ e os arquivos de configuração)

# 3. Fazer commit
git add .
git commit -m "Add: Frontend React com integração de API"

# 4. Fazer push
git push origin main
```

### Opção B: Criar um Novo Repositório

Se quer começar do zero:

```bash
# 1. Criar pasta do projeto
mkdir football-analyzer-bot
cd football-analyzer-bot

# 2. Copiar todos os arquivos do frontend
cp -r /home/ubuntu/football-frontend/* .

# 3. Copiar arquivos do backend
cp -r /home/ubuntu/football-project/football-analyzer-bot-main/api ./
cp -r /home/ubuntu/football-project/football-analyzer-bot-main/server ./

# 4. Inicializar git
git init
git add .
git commit -m "Initial commit: Football Analyzer Bot"

# 5. Adicionar repositório remoto
git remote add origin https://github.com/SEU_USUARIO/football-analyzer-bot.git
git branch -M main
git push -u origin main
```

---

## 🌐 Parte 3: Deploy na Vercel

### Passo 1: Conectar GitHub com Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **Sign Up** e escolha **Continue with GitHub**
3. Autorize a Vercel a acessar seus repositórios

### Passo 2: Importar Projeto

1. No dashboard da Vercel, clique em **Add New** → **Project**
2. Procure por `football-analyzer-bot`
3. Clique em **Import**

### Passo 3: Configurar Variáveis de Ambiente

Na tela de configuração:

1. Clique em **Environment Variables**
2. Adicione as seguintes variáveis:

```
VITE_API_URL = https://seu-dominio.vercel.app/api
VITE_API_FOOTBALL_KEY = sua_chave_aqui
VITE_OPENAI_API_KEY = sua_chave_aqui
```

**Importante**: Substitua `seu-dominio` pelo domínio que a Vercel vai gerar para você.

### Passo 4: Fazer Deploy

1. Clique em **Deploy**
2. Aguarde 2-3 minutos
3. Você receberá um link: `https://football-analyzer-bot.vercel.app`

---

## ✅ Verificar se Tudo Está Funcionando

### 1. Testar o Frontend

- Acesse `https://seu-dominio.vercel.app`
- Você deve ver o Dashboard com a sidebar
- As cores devem ser azul elétrico e verde neon

### 2. Testar a API

- Acesse `https://seu-dominio.vercel.app/api/health`
- Deve retornar: `{"status":"online",...}`

### 3. Testar Integração

- Vá para o Dashboard
- Deve aparecer "Carregando partidas..." ou dados reais
- Se aparecer erro, verifique:
  - A URL da API está correta?
  - O backend está rodando?
  - As variáveis de ambiente foram definidas?

---

## 🔄 Atualizar o Projeto

Sempre que fizer mudanças:

```bash
# 1. Fazer commit
git add .
git commit -m "Descrição da mudança"

# 2. Fazer push
git push origin main
```

A Vercel fará o deploy automaticamente! ✨

---

## 📋 Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Código enviado para o GitHub
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Frontend carrega corretamente
- [ ] API responde em `/api/health`
- [ ] Dados aparecem no Dashboard

---

## 🆘 Troubleshooting

### Erro: "Cannot find module"
- Verifique se o `package.json` está na raiz do projeto
- Execute `npm install` localmente para testar

### Erro: "API não responde"
- Verifique a URL em `VITE_API_URL`
- Confirme que o backend está rodando
- Verifique os logs da Vercel

### Erro: "CORS bloqueado"
- Adicione headers CORS no backend
- Verifique se a URL do frontend está autorizada

### Erro: "Dados não carregam"
- Abra o console (F12) e procure por erros
- Verifique se a API está retornando dados
- Confirme as variáveis de ambiente

---

## 🎉 Pronto!

Seu projeto está no ar! Você pode:
- Compartilhar o link com outras pessoas
- Adicionar mais funcionalidades
- Customizar o design
- Integrar com mais APIs

Boa sorte! 🚀
