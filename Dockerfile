# Use a imagem Node.js como base, escolhendo uma versão específica
FROM node:16

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie o arquivo package.json e yarn.lock (ou package-lock.json) para o contêiner
COPY package*.json ./

# Instale as dependências usando yarn (ou npm se preferir)
RUN yarn

# Copie o restante dos arquivos do projeto para o contêiner
COPY . .

# Construa o aplicativo React para produção
RUN yarn build

# Exponha a porta em que o aplicativo Next.js está ouvindo (geralmente porta 3000)
EXPOSE 3000

# Comando para iniciar o aplicativo Next.js
CMD ["yarn", "dev"]
