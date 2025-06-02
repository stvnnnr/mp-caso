# 1) Etapa de build: usar Node para compilar el frontend
FROM node:18-alpine AS build-frontend

WORKDIR /usr/src/app

# Copiar manifiestos y dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar el resto del código y compilar
COPY . .
RUN npm run build

# 2) Etapa final: servir con Nginx
FROM nginx:stable-alpine AS production-frontend

# Copiar configuración mínima: removemos el default de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar la carpeta build generada por React a la ruta que Nginx expone
COPY --from=build-frontend /usr/src/app/build /usr/share/nginx/html

# Copiar un config de Nginx personalizado para manejar rutas de React (opcional)
# Si no tienes rutas “deep-link” que requieran rewrite, puedes omitir esto.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 (Nginx)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
