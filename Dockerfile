FROM node:14 
WORKDIR /app 
COPY package*.json ./ 
RUN npm install 
COPY . . 
EXPOSE 3000 
CMD ["node", "dogrusal_regresyon_server.js"] 
