# Bem-vindo ao projeto Dashboard — Ordens de Serviço VEOLIA


## Informações do projeto

**URL**: https://dashboard-veolia-os.netlify.app

## Como posso editar este código?

USE A IDE DA SUA PREFERENCIA 


**Use sua IDE preferida**

Se você quiser trabalhar localmente usando sua própria IDE, pode clonar este repositório e enviar as alterações. As alterações enviadas também serão refletidas no Lovable.

O único requisito é ter o Node.js e o npm instalados - [instale com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Siga estes passos:

```sh

#Passo 1: Clone o repositório usando a URL Git do projeto.

git clone <SUA_URL_GIT>

# Passo 2: Navegue até o diretório do projeto.

cd <NOME_DO_SEU_PROJETO>

#Passo 3: Instale as dependências necessárias.

npm i

# Passo 4: Inicie o servidor de desenvolvimento com recarregamento automático e pré-visualização instantânea.

npm run dev

```


## Quais tecnologias são usadas neste projeto?

Este projeto foi desenvolvido com:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## 🛠️ Modo Demo (Demonstração)

Este projeto possui um **Modo Demo** integrado que permite visualizar todas as funcionalidades do dashboard com dados fictícios, sem necessidade de configurar um banco de dados Supabase real.

### Como rodar a Demo localmente:
```sh
npm run dev:demo
```
Isso iniciará o servidor Vite com a variável de ambiente `VITE_DEMO_MODE=true`.

### Características do Modo Demo:
- **Dados Mockados**: Carrega automaticamente medições e especificações realistas.
- **Segurança de Escrita**: Um Proxy intercepta todas as chamadas ao cliente Supabase, impedindo qualquer alteração no banco real.
- **Upload Temporário**: Você pode testar o upload de novos arquivos Excel. Os dados serão processados e exibidos nos gráficos, mas não serão salvos.
- **Bypass de Admin**: A área administrativa aceita qualquer e-mail/senha para facilitar a navegação.
- **Identificação Visual**: Um badge pulsante e banners de aviso indicam que você está no ambiente de demonstração.

### Como buildar para produção com Demo:
```sh
npm run build:demo
```



