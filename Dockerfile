# Etapa de construcción
FROM node:14 AS builder

WORKDIR /app

# Copiar los archivos de la aplicación
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos generados en la etapa de construcción
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar el archivo index.html
COPY index.html /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
