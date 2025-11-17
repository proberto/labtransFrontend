## Execução local do frontend (LabTrans Reservas)

- **Pré-requisitos**
  - Node.js 20.x instalado.
  - API FastAPI em execução (por padrão em `http://localhost:8000`).

- **1. Instalar dependências**
  - No diretório raiz do projeto (`labtransFrontend`), execute:

```bash
npm install
```

- **2. Configurar variáveis de ambiente (opcional)**
  - Por padrão, o frontend aponta para `http://localhost:8000` e usa token no header.
  - Para alterar, crie um arquivo `.env` na raiz com:

```bash
# URL da API (opcional)
VITE_API_BASE_URL=http://seu-host:8000

# Ativar suporte a HttpOnly Cookies (opcional)
# Quando o backend usar HttpOnly Cookies, defina como 'true'
VITE_USE_HTTPONLY_COOKIES=true
```

  **Nota sobre HttpOnly Cookies:**
  - Se o backend implementar HttpOnly Cookies, defina `VITE_USE_HTTPONLY_COOKIES=true`
  - O frontend automaticamente:
    - Envia cookies em todas as requisições (`withCredentials: true`)
    - Não armazena token no localStorage
    - Verifica autenticação via `/api/auth/me` ao carregar
    - Chama `/api/auth/logout` ao fazer logout (se o endpoint existir)

- **3. Rodar em modo desenvolvimento**

```bash
npm run dev
```

  - Abra o navegador no endereço exibido no terminal (normalmente `http://localhost:5173`).

- **4. Rodar testes automatizados**

```bash
npm test -- --run
```

- **5. Gerar build de produção**

```bash
npm run build
```

  - Para pré-visualizar o build:

```bash
npm run preview
```


