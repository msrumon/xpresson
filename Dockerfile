FROM node:lts-alpine
LABEL org.opencontainers.image.authors "Rumon <contact@msrumon.com>"
ENV NODE_ENV production
ENV PORT 4321
WORKDIR /home/node
COPY package*.json ./
RUN npm install
COPY --chown=node . .
EXPOSE ${PORT}
USER node
CMD [ "npm", "start" ]
