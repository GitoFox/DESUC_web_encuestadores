
# Establece la imagen base
FROM nginx:latest


# Copia los archivos HTML, CSS y JS al directorio de trabajo del contenedor
COPY ./index.html /usr/share/nginx/html
COPY ./static/css /usr/share/nginx/html/css
COPY ./static/js /usr/share/nginx/html/js


# Expone el puerto 80 del contenedor
EXPOSE 80

# Comando que se ejecuta cuando se inicia el contenedor
CMD ["nginx", "-g", "daemon off;"]
