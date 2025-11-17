## Execução local do frontend (LabTrans Reservas)

- **Pré-requisitos**
  - Node.js 20.x instalado.
  - API FastAPI em execução (por padrão em `http://localhost:8000`).

- **1. Instalar dependências**
  - No diretório raiz do projeto (`labtransFrontend`), execute:

```bash
npm install
```

- **2. Configurar a URL da API (opcional)**
  - Por padrão, o frontend aponta para `http://localhost:8000`.
  - Para alterar, crie um arquivo `.env` na raiz com:

```bash
VITE_API_BASE_URL=http://seu-host:8000
```

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


