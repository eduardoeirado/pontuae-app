# 🔧 Solução: Erro "src refspec main does not match any"

## 🎯 Problema
O erro acontece porque não há commits no repositório local ainda.

## ✅ Solução Rápida

Execute estes comandos em sequência:

```bash
# 1. Verificar status atual
git status

# 2. Adicionar todos os arquivos
git add .

# 3. Verificar se arquivos foram adicionados
git status

# 4. Fazer o primeiro commit
git commit -m "🎾 Pontuaê - Initial PWA implementation

- Beach Tennis score tracking app
- PWA ready for mobile installation  
- Custom branding with Pontuaê theme
- Default settings: 0-15-30-45, 6 games, 3 sets
- Responsive design for all devices"

# 5. Verificar se commit foi criado
git log --oneline

# 6. Agora fazer push
git push -u origin main
```

## 🔍 Verificações

### **Se git status mostrar "nothing to commit":**
```bash
# Verificar se .gitignore não está bloqueando arquivos importantes
cat .gitignore

# Forçar adicionar arquivos específicos se necessário
git add src/ public/ package.json index.html -f
git commit -m "🎾 Pontuaê - Initial commit"
```

### **Se ainda der erro no push:**
```bash
# Verificar se branch existe
git branch

# Criar branch main se não existir
git checkout -b main

# Tentar push novamente
git push -u origin main
```

## 🚨 Solução Alternativa

Se continuar com problemas:

```bash
# 1. Verificar se repositório GitHub está vazio
# Ir para: https://github.com/eduardoeirado/pontuae-app

# 2. Se repositório tem README, fazer pull primeiro
git pull origin main --allow-unrelated-histories

# 3. Resolver conflitos se houver
# 4. Fazer push
git push -u origin main
```

## ✅ Comandos Completos (Copy & Paste)

```bash
cd ~/Projetos/beach-tennis-app
git status
git add .
git commit -m "🎾 Pontuaê - Initial PWA implementation"
git push -u origin main
```

## 🎯 Resultado Esperado

Após executar os comandos, você deve ver:
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Delta compression using up to X threads
Compressing objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), XXX KiB | XXX MiB/s, done.
Total XX (delta X), reused 0 (delta 0), pack-reused 0
To https://github.com/eduardoeirado/pontuae-app.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## 📱 Próximo Passo

Após resolver o Git, continuar com Vercel:
1. Acessar [vercel.com](https://vercel.com)
2. Login com GitHub
3. New Project
4. Importar `pontuae-app`
5. Deploy

**O problema será resolvido com o primeiro commit!** 🏆

