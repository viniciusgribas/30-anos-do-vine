# 🎂 30 Anos do Vine - Sistema de Convites

Sistema completo de convites digitais para festa de aniversário de 30 anos com tema **Windows 95 nostálgico**.

![Windows 95 Theme](https://img.shields.io/badge/Theme-Windows%2095-blue?style=flat-square)
![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JavaScript-orange?style=flat-square)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20(Neon)-green?style=flat-square)
![Deploy](https://img.shields.io/badge/Deploy-Netlify-success?style=flat-square)

## 🚀 **Demo ao Vivo**

- 🌐 **Site Principal:** [vine30anos.netlify.app](https://vine30anos.netlify.app)
- 👥 **Convite Amigos:** [vine30anos.netlify.app](https://vine30anos.netlify.app) 
- 👨‍👩‍👧‍👦 **Convite Família:** [vine30anos.netlify.app/familia.html](https://vine30anos.netlify.app/familia.html)
- 🔐 **Painel Admin:** [vine30anos.netlify.app/admin.html](https://vine30anos.netlify.app/admin.html)

## ✨ **Features**

### 🎨 **Interface Nostálgica**
- **Tema Windows 95** completo com bordas 3D, cores autênticas
- **Fonte VT323** para efeito pixelado retrô
- **Design responsivo** mobile-first
- **Elementos visuais** característicos dos anos 90

### ⏰ **Funcionalidades Principais**
- **Countdown timer** dinâmico até a festa (16 de Agosto de 2025)
- **Dois convites distintos:** amigos (19h) e família (19h30)
- **Formulário RSVP** com validação rigorosa
- **Integração Google Maps** para localização
- **Geração de eventos** para Google Calendar

### 📊 **Sistema de Gestão**
- **Dashboard admin** protegido por senha
- **Estatísticas em tempo real** (total, amigos, família, acompanhantes)
- **Export de dados** (JSON e CSV)
- **Sincronização multi-dispositivo** via banco PostgreSQL

### 🔒 **Validação & Segurança**
- **Validação de entrada:** CPF (11 dígitos), telefone brasileiro
- **Proteção contra spam:** limites de caracteres rigorosos  
- **Autenticação admin:** sessionStorage para controle de acesso
- **Sanitização de dados** antes do armazenamento

### 📱 **Compartilhamento Social**
- **Meta tags Open Graph** para prévia bonita no WhatsApp
- **Companion sharing:** convidados podem compartilhar com acompanhantes
- **Links otimizados** para não parecerem spam
- **Arte personalizada** para redes sociais

## 🏗️ **Arquitetura Técnica**

### **Frontend**
```
┌─ index.html          (Convite amigos - 19h)
├─ familia.html        (Convite família - 19h30) 
├─ admin.html          (Dashboard gestão)
├─ links-compartilhamento.html
└─ convite-share.png   (Arte para redes sociais)
```

### **Backend**
```
└─ netlify/functions/
   └─ guests.js        (API PostgreSQL + CRUD)
```

### **Dados & Storage**
- **PostgreSQL (Neon):** Dados primários com sync multi-dispositivo
- **localStorage:** Fallback + migração automática
- **sessionStorage:** Autenticação temporária admin

## 🛠️ **Stack Tecnológica**

| Categoria | Tecnologia | Propósito |
|-----------|------------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JS | Interface e interações |
| **Styling** | CSS Grid, Flexbox | Layout responsivo |
| **Database** | PostgreSQL (Neon) | Persistência de dados |
| **Functions** | Netlify Functions | API serverless |
| **Deploy** | Netlify + GitHub Actions | CI/CD automático |
| **Fonts** | VT323 (Google Fonts) | Estética retrô |

## 📝 **Estrutura de Dados**

```javascript
// Schema da tabela 'guests'
{
  id: SERIAL PRIMARY KEY,
  name: VARCHAR(100),        // Nome completo
  phone: VARCHAR(15),        // Telefone brasileiro  
  cpf: VARCHAR(14),          // CPF com pontuação
  companion: VARCHAR(10),    // 'sim' | 'não'
  event: VARCHAR(20),        // 'amigos' | 'familia'
  timestamp: TIMESTAMP,      // Data/hora confirmação
  created_at: TIMESTAMP      // Controle de auditoria
}
```

## 🚀 **Como Executar Localmente**

### **Pré-requisitos**
- Node.js 18+
- Conta Netlify (para functions)
- Banco PostgreSQL (recomendado: Neon)

### **Configuração**
```bash
# 1. Clone o repositório
git clone https://github.com/viniciusgribas/30-anos-do-vine.git
cd 30-anos-do-vine

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
# Netlify: NETLIFY_DATABASE_URL=postgresql://...

# 4. Execute localmente
netlify dev
```

### **Deploy em Produção**
```bash
# Deploy automático via GitHub
git push origin main

# Ou deploy manual
netlify deploy --prod
```

## 🔧 **Configuração do Banco**

### **Neon Database (Recomendado)**
1. Crie projeto no [console.neon.tech](https://console.neon.tech)
2. Configure `NETLIFY_DATABASE_URL` no Netlify
3. A tabela será criada automaticamente na primeira execução

### **Estrutura Auto-criada**
```sql
CREATE TABLE IF NOT EXISTS guests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  companion VARCHAR(10) DEFAULT 'não',
  event VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📊 **Funcionalidades Admin**

### **Acesso**
- **URL:** `/admin.html`
- **Senha:** `vine30anos`
- **Sessão:** Mantida por 24h

### **Recursos Disponíveis**
- 📈 **Dashboard:** Estatísticas em tempo real
- 👥 **Lista:** Todos os convidados confirmados  
- 🔍 **Filtros:** Por tipo de evento (amigos/família)
- 📤 **Export:** JSON e CSV para controle externo
- 🗑️ **Gestão:** Remoção individual de registros

## 🎨 **Customização Visual**

### **Cores do Tema Windows 95**
```css
:root {
  --win95-blue: #000080;      /* Barra de título */
  --win95-gray: #c0c0c0;      /* Background principal */
  --win95-dark-gray: #808080;  /* Bordas shadow */
  --win95-light-gray: #dfdfdf; /* Bordas highlight */
  --win95-red: #ff0000;        /* Texto de erro */
}
```

### **Breakpoints Responsivos**
```css
/* Mobile first */
@media (min-width: 600px) { /* Tablet */ }
@media (min-width: 768px) { /* Desktop */ }
```

## 🔍 **SEO & Compartilhamento**

### **Meta Tags Implementadas**
- **Open Graph:** Prévia bonita no WhatsApp/Facebook
- **Twitter Cards:** Compartilhamento otimizado
- **Favicon dinâmico:** Emoji 🎂 como ícone
- **URLs amigáveis:** Estrutura semântica

### **Otimizações de Performance**
- **CSS/JS inline:** Reduz requests HTTP
- **Imagens otimizadas:** Compressão adequada
- **Caching inteligente:** localStorage + sessionStorage
- **CDN:** Netlify Edge para distribuição global

## 📱 **Compatibilidade**

| Navegador | Desktop | Mobile | Notas |
|-----------|---------|--------|-------|
| Chrome 90+ | ✅ | ✅ | Totalmente suportado |
| Firefox 88+ | ✅ | ✅ | Totalmente suportado |
| Safari 14+ | ✅ | ✅ | Webkit ajustes aplicados |
| Edge 90+ | ✅ | ✅ | Totalmente suportado |

## 🤝 **Contribuição**

### **Como Contribuir**
1. Fork o projeto
2. Crie branch para feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit mudanças (`git commit -m 'Adicionar nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abra Pull Request

### **Padrões de Código**
- **HTML5 semântico** com acessibilidade
- **CSS modular** com nomenclatura BEM quando aplicável
- **JavaScript ES6+** com async/await
- **Comentários descritivos** em português

## 📄 **Licença**

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👤 **Autor**

**Vinícius Ribas** - *Desenvolvedor Full Stack*
- 🌐 **Site:** [vine30anos.netlify.app](https://vine30anos.netlify.app)
- 📧 **Contato:** Através do sistema de convites

## 🎉 **Sobre a Festa**

**Data:** 16 de Agosto de 2025  
**Local:** ASBAC - Churrasqueira 16, Brasília/DF  
**Tema:** "30 anos aperfeiçoando a arte do churrasco e da calvície!"

*Sistema desenvolvido com 💻 e muita nostalgia Windows 95*

---

⭐ **Curtiu o projeto?** Deixe uma star no repositório!