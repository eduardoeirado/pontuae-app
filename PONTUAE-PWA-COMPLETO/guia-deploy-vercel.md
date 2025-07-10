# 🚀 Pontuaê - Guia de Deploy no Vercel

## 🎯 Objetivo
Hospedar o Pontuaê no Vercel para distribuição gratuita em iOS e Android.

## 📋 Pré-requisitos
- ✅ Conta GitHub (gratuita)
- ✅ Conta Vercel (gratuita)
- ✅ Projeto Pontuaê implementado

## 🔧 Passo a Passo

### 1️⃣ **Preparar Repositório GitHub**

```bash
# No diretório do projeto
cd ~/Projetos/beach-tennis-app

# Inicializar Git (se não feito)
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "🎾 Pontuaê - PWA Beach Tennis Score App"

# Criar repositório no GitHub
# Ir para github.com → New repository → "pontuae-app"

# Conectar repositório local
git remote add origin https://github.com/SEU_USUARIO/pontuae-app.git
git branch -M main
git push -u origin main
```

### 2️⃣ **Deploy no Vercel**

#### **Opção A: Via GitHub (Recomendado)**
1. Acessar [vercel.com](https://vercel.com)
2. Fazer login com GitHub
3. Clicar "New Project"
4. Selecionar repositório "pontuae-app"
5. Configurar:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Clicar "Deploy"

#### **Opção B: Via CLI**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Seguir instruções:
# - Set up and deploy? Y
# - Which scope? (sua conta)
# - Link to existing project? N
# - Project name: pontuae-app
# - Directory: ./
# - Override settings? N
```

### 3️⃣ **Configurar Domínio Personalizado**

```bash
# Via CLI
vercel domains add pontuae.com.br

# Ou via dashboard Vercel:
# Project → Settings → Domains → Add Domain
```

### 4️⃣ **Configurar Build para PWA**

Criar `vercel.json` no projeto:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        }
      ]
    }
  ]
}
```

### 5️⃣ **Gerar Ícones PWA**

Usar o logo do Pontuaê para gerar todos os tamanhos:

```bash
# Instalar ferramenta de ícones
npm install -g pwa-asset-generator

# Gerar ícones (usar logo do Pontuaê)
pwa-asset-generator logo-pontuae.png public/icons
```

Ou usar sites online:
- [realfavicongenerator.net](https://realfavicongenerator.net)
- [favicon.io](https://favicon.io)

### 6️⃣ **Testar PWA**

#### **Lighthouse Audit:**
1. Abrir site no Chrome
2. F12 → Lighthouse
3. Verificar PWA score
4. Corrigir problemas se houver

#### **Teste de Instalação:**
1. **Android**: Chrome → Menu → "Adicionar à tela inicial"
2. **iOS**: Safari → Compartilhar → "Adicionar à Tela de Início"

## 🌐 URLs Resultantes

### **Produção:**
- `https://pontuae-app.vercel.app`
- `https://pontuae.com.br` (se domínio configurado)

### **Preview:**
- `https://pontuae-app-git-main-usuario.vercel.app`

### **Desenvolvimento:**
- `https://pontuae-app-branch-usuario.vercel.app`

## 📱 Distribuição

### **QR Code para Instalação:**
```bash
# Gerar QR code do link
# Usar: qr-code-generator.com
# Link: https://pontuae-app.vercel.app
```

### **Landing Page:**
Criar página simples para distribuição:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Pontuaê - Instalar App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div style="text-align: center; padding: 50px;">
        <h1>🎾 Pontuaê</h1>
        <p>Pontuou? Já foi, Pontuaê!</p>
        <a href="/app" style="background: #2196F3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px;">
            Abrir App
        </a>
        <br><br>
        <img src="qr-code.png" alt="QR Code" style="max-width: 200px;">
        <p>Escaneie para instalar no celular</p>
    </div>
</body>
</html>
```

## 🔄 Atualizações Automáticas

### **Git Workflow:**
```bash
# Fazer alterações no código
git add .
git commit -m "🎾 Atualização: nova funcionalidade"
git push

# Vercel faz deploy automático!
```

### **Versionamento:**
```bash
# Criar tags para versões
git tag v1.0.0
git push --tags

# Vercel pode usar tags para deploys específicos
```

## 📊 Analytics e Monitoramento

### **Vercel Analytics:**
```bash
# Instalar
npm install @vercel/analytics

# Adicionar no App.jsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### **Google Analytics:**
```html
<!-- Adicionar no index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🛡️ Segurança e Performance

### **Headers de Segurança:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### **Cache Strategy:**
```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 🎯 Checklist Final

### **Antes do Deploy:**
- ✅ PWA manifest configurado
- ✅ Service Worker funcionando
- ✅ Ícones em todos os tamanhos
- ✅ Meta tags iOS configuradas
- ✅ Build de produção testado

### **Após Deploy:**
- ✅ Site carregando corretamente
- ✅ PWA instalável no mobile
- ✅ Lighthouse score 90+
- ✅ Funciona offline
- ✅ Domínio personalizado (opcional)

### **Distribuição:**
- ✅ QR code gerado
- ✅ Landing page criada
- ✅ Instruções de instalação
- ✅ Teste em iOS e Android
- ✅ Analytics configurado

## 🚀 Resultado Final

### **URLs de Acesso:**
- **App**: `https://pontuae-app.vercel.app`
- **Instalação**: `https://pontuae-app.vercel.app/install-instructions.html`

### **Funcionalidades:**
- 📱 **Instalável** em iOS e Android
- 🔄 **Atualizações** automáticas
- 📊 **Analytics** integrado
- 🌐 **Acesso** via link
- 📲 **QR Code** para distribuição

**O Pontuaê estará disponível 24/7 para todos os jogadores de Beach Tennis!** 🏆

