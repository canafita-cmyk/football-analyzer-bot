# Guia de Deployment - Football Analyzer Bot

Este guia explica como fazer o deploy do seu projeto na Vercel.

---

## 📋 Pré-requisitos

1. **Conta no GitHub**: [github.com](https://github.com)
2. **Conta na Vercel**: [vercel.com](https://vercel.com)
3. **Git instalado** no seu computador

---

## 🚀 Passo 1: Preparar o Repositório no GitHub

### 1.1 Criar um novo repositório

1. Acesse [github.com/new](https://github.com/new)
2. Dê um nome ao repositório: `football-analyzer-bot`
3. Clique em **Create repository**

### 1.2 Fazer upload do código

Abra o terminal/CMD na pasta do projeto e execute:

```bash
# Inicializar git
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit: Football Analyzer Bot Frontend"

# Adicionar o repositório remoto (substitua USERNAME pelo seu usuário GitHub)
git remote add origin https://github.com/USERNAME/football-analyzer-bot.git

# Fazer push para o GitHub
git branch -M main
git push -u origin main
```

---

## 🌐 Passo 2: Conectar com Vercel

### 2.1 Importar projeto na Vercel

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em **Add New** → **Project**
3. Selecione **Import Git Repository**
4. Procure por `football-analyzer-bot` e clique em **Import**

### 2.2 Configurar variáveis de ambiente

Na tela de configuração do projeto:

1. Clique em **Environment Variables**
2. Adicione as seguintes variáveis:

| Nome | Valor | Descrição |
|------|-------|-----------|
| `VITE_API_URL` | `https://seu-dominio.vercel.app/api` | URL da sua API (substitua pelo seu domínio) |
| `VITE_API_FOOTBALL_KEY` | Sua chave de API | Chave da API-Football |
| `VITE_OPENAI_API_KEY` | Sua chave de API | Chave da OpenAI (opcional) |

**Importante**: Substitua `seu-dominio` pelo domínio real do seu projeto Vercel.

### 2.3 Fazer deploy

1. Clique em **Deploy**
2. Aguarde o processo terminar (geralmente leva 2-3 minutos)
3. Você receberá um link como: `https://football-analyzer-bot.vercel.app`

---

## 🔗 Passo 3: Conectar Frontend com Backend

Agora você tem dois projetos na Vercel:

- **Backend (API)**: `https://football-analyzer-bot-api.vercel.app`
- **Frontend**: `https://football-analyzer-bot.vercel.app`

### 3.1 Atualizar a URL da API no Frontend

1. No dashboard da Vercel do **Frontend**
2. Vá em **Settings** → **Environment Variables**
3. Atualize `VITE_API_URL` com:
   ```
   https://football-analyzer-bot-api.vercel.app/api
   ```
4. Clique em **Save**
5. Vá em **Deployments** e clique em **Redeploy** no último deploy

---

## ✅ Verificar se Tudo Está Funcionando

1. Acesse `https://seu-frontend.vercel.app`
2. Você deve ver o Dashboard com dados em tempo real
3. Se aparecer um erro, verifique:
   - A URL da API está correta?
   - As variáveis de ambiente foram definidas?
   - O backend está rodando na Vercel?

---

## 🔄 Atualizar o Projeto

Sempre que você fizer mudanças no código:

```bash
# Fazer commit
git add .
git commit -m "Descrição da mudança"

# Fazer push
git push origin main
```

A Vercel fará o deploy automaticamente quando detectar mudanças no GitHub.

---

## 🐛 Troubleshooting

### Erro: "API não está respondendo"
- Verifique se o backend está rodando
- Confirme a URL da API em Environment Variables
- Verifique os logs da Vercel

### Erro: "Partidas não carregam"
- Abra o console do navegador (F12)
- Procure por mensagens de erro
- Verifique se a API está retornando dados

### Erro: "CORS bloqueado"
- Adicione headers CORS no backend
- Verifique se a URL do frontend está autorizada

---

## 📞 Suporte

Se tiver dúvidas:
1. Verifique os logs da Vercel (Deployments → Logs)
2. Consulte a documentação da API-Football
3. Procure por erros no console do navegador (F12)

---

## 🎉 Parabéns!

Seu projeto está no ar! Agora você pode:
- Compartilhar o link com outras pessoas
- Adicionar mais funcionalidades
- Integrar com mais APIs
- Customizar o design

Boa sorte! 🚀
