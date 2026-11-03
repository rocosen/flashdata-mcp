FROM apify/actor-node:22
COPY --chown=myuser:myuser package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --chown=myuser:myuser src ./src
COPY --chown=myuser:myuser .actor ./.actor
COPY --chown=myuser:myuser README.md LICENSE actor-config.json ./
CMD ["npm", "start"]
