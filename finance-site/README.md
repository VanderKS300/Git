# FinanceHub - Site de Consulta Financeira

Um site completo de consulta financeira com dados de ações, notícias de especialistas, glossário de termos financeiros e sugestões de investimento.

## 🚀 Funcionalidades

### Dashboard
- Visão geral do mercado em tempo real
- Maiores altas e baixas do dia
- Notícias recentes de especialistas

### Consulta de Ações
- Busca por código ou nome da empresa
- Filtros por setor, ordenação e direção
- Tabela responsiva com dados detalhados
- Modal com informações detalhadas das ações

### Notícias de Especialistas
- Artigos e análises de mercado
- Filtros por categoria e especialista
- Links para fontes originais

### Glossário Financeiro
- Termos financeiros com definições simples
- Busca por termo ou categoria
- Filtro alfabético
- Modal com definições completas

### Sugestões de Ações
- Recomendações de investimento
- Filtros por tipo de investimento e perfil de risco
- Disclaimer de responsabilidade claramente visível

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3.11** - Linguagem principal
- **Flask** - Framework web
- **SQLAlchemy** - ORM para banco de dados
- **Flask-CORS** - Suporte a CORS
- **SQLite** - Banco de dados

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização com design responsivo
- **JavaScript (ES6+)** - Funcionalidades interativas
- **Font Awesome** - Ícones
- **Google Fonts (Inter)** - Tipografia

### APIs Externas
- **brapi.dev** - Dados de ações brasileiras
- **NewsAPI** - Notícias financeiras (configurável)

## 📦 Estrutura do Projeto

```
finance-site/
├── src/
│   ├── main.py                 # Aplicação principal Flask
│   ├── models/                 # Modelos de dados
│   │   ├── stock.py           # Modelo de ações
│   │   ├── news.py            # Modelo de notícias
│   │   ├── glossary.py        # Modelo de glossário
│   │   └── suggestions.py     # Modelo de sugestões
│   ├── routes/                # Rotas da API
│   │   ├── stocks.py          # Endpoints de ações
│   │   ├── news.py            # Endpoints de notícias
│   │   ├── glossary.py        # Endpoints de glossário
│   │   └── suggestions.py     # Endpoints de sugestões
│   ├── static/                # Arquivos estáticos
│   │   ├── index.html         # Página principal
│   │   ├── styles.css         # Estilos CSS
│   │   └── script.js          # JavaScript
│   └── database/              # Banco de dados SQLite
├── venv/                      # Ambiente virtual Python
└── README.md                  # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos
- Python 3.11 ou superior
- pip (gerenciador de pacotes Python)

### Instalação

1. **Clone ou baixe o projeto**
   ```bash
   cd finance-site
   ```

2. **Ative o ambiente virtual**
   ```bash
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate     # Windows
   ```

3. **Instale as dependências** (já instaladas no ambiente virtual)
   ```bash
   pip install flask flask-sqlalchemy flask-cors requests
   ```

4. **Execute a aplicação**
   ```bash
   python src/main.py
   ```

5. **Acesse o site**
   - Abra seu navegador e vá para: `http://localhost:5000`

### Executar em Porta Diferente

Se a porta 5000 estiver ocupada, você pode executar em outra porta:

```bash
python -c "
import sys, os
sys.path.insert(0, os.getcwd())
from src.main import app
app.run(host='0.0.0.0', port=5002, debug=False)
"
```

## 🔧 Configuração

### Banco de Dados
O projeto usa SQLite por padrão. O banco é criado automaticamente na primeira execução em `src/database/app.db`.

### APIs Externas
- **brapi.dev**: API gratuita para dados de ações brasileiras
- Para adicionar dados reais, você pode implementar scripts de coleta usando as APIs disponíveis

### Personalização
- **Cores**: Edite as variáveis CSS em `src/static/styles.css`
- **Logo**: Substitua o ícone no header
- **Dados**: Adicione dados de exemplo ou integre com APIs reais

## 📱 Design Responsivo

O site é totalmente responsivo e funciona em:
- 📱 Dispositivos móveis (smartphones)
- 📱 Tablets
- 💻 Desktops
- 🖥️ Monitores grandes

## 🔒 Segurança

- CORS configurado para permitir requisições do frontend
- Validação de dados nas APIs
- Sanitização de inputs do usuário
- Disclaimers apropriados para sugestões de investimento

## 📊 APIs Disponíveis

### Ações
- `GET /api/stocks` - Lista todas as ações
- `GET /api/stocks/{symbol}` - Detalhes de uma ação
- `GET /api/stocks/top-gainers` - Maiores altas
- `GET /api/stocks/top-losers` - Maiores baixas
- `GET /api/stocks/search?q={termo}` - Busca ações

### Notícias
- `GET /api/news` - Lista notícias
- `GET /api/news/{id}` - Detalhes de uma notícia
- `GET /api/news/categories` - Categorias disponíveis
- `GET /api/news/experts` - Especialistas disponíveis

### Glossário
- `GET /api/glossary` - Lista termos
- `GET /api/glossary/{id}` - Detalhes de um termo
- `GET /api/glossary/categories` - Categorias de termos
- `GET /api/glossary/letters` - Letras disponíveis

### Sugestões
- `GET /api/suggestions` - Lista sugestões
- `GET /api/suggestions/types` - Tipos de investimento
- `GET /api/suggestions/risk-profiles` - Perfis de risco

## 🚀 Deploy

### Opção 1: Servidor Local
Execute o comando de instalação e acesse via localhost.

### Opção 2: Servidor Web
1. Configure um servidor web (Apache, Nginx)
2. Configure WSGI (Gunicorn, uWSGI)
3. Ajuste as configurações de produção

### Opção 3: Plataformas Cloud
- Heroku
- Vercel
- Railway
- PythonAnywhere

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente suas mudanças
4. Teste thoroughly
5. Envie um pull request

## ⚠️ Disclaimer Legal

**IMPORTANTE**: Este site é apenas para fins educacionais e informativos. As informações apresentadas não constituem aconselhamento financeiro, recomendação de investimento ou oferta de compra/venda de quaisquer títulos. 

O investimento em mercados financeiros envolve riscos, incluindo a possível perda do capital investido. Você é inteiramente responsável por suas próprias decisões de investimento e deve buscar aconselhamento de um profissional financeiro qualificado antes de tomar qualquer decisão de investimento.

## 📄 Licença

Este projeto é fornecido "como está" para fins educacionais. Use por sua própria conta e risco.

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se todas as dependências estão instaladas
2. Confirme que a porta não está em uso
3. Verifique os logs de erro no terminal
4. Consulte a documentação das APIs utilizadas

---

**Desenvolvido com ❤️ para educação financeira**

