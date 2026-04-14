# Usar imagen oficial de Node.js (variante slim, sin root) 
FROM node:18-alpine 
  
# OpenShift requiere que el usuario no sea root 
# La imagen alpine de Node usa uid 1000 por defecto 
WORKDIR /app 
  
# Copiar e instalar dependencias primero (aprovecha cache de capas) 
COPY package*.json ./ 
RUN npm ci --only=production 
  
# Copiar código fuente incluyendo index.html
COPY server.js . 
COPY index.html . 
  
# Cambiar propietario para usuario no-root 
RUN chown -R node:node /app 
USER node 
  
# Exponer puerto (informativo, OpenShift lo lee) 
EXPOSE 8080 
  
# Variables de entorno por defecto 
ENV PORT=8080 \ 
    NODE_ENV=production 
  
# Health check para OpenShift/Kubernetes 
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \ 
  CMD wget -qO- http://localhost:8080/health || exit 1 
  
# Comando de inicio 
CMD ["node", "server.js"]
