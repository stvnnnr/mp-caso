# 1) Imagen base: Node.js LTS (Alpine para ligereza)
FROM node:18-alpine AS build-backend

# 2) Directorio de trabajo
WORKDIR /usr/src/app

# 3) Copiar package.json y package-lock.json para instalar dependencias
COPY package.json package-lock.json ./

# 4) Instalar dependencias
RUN npm install

# 5) Copiar todo el código fuente del backend
COPY . .

# 6) Exponer el puerto donde corre la API (según .env es 4000)
EXPOSE 4000

# 7) Comando por defecto para iniciar el servidor
CMD ["npm", "start"]
