FROM node:16

ARG UID=1000
ARG GID=1000

# Global install yarn package manager
RUN apt-get update && apt-get install -y curl apt-transport-https && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y yarn

RUN apt-get install -y libx11-xcb1 libxtst6 libnss3 libxss1 libasound2 libatk1.0-0 libatk-bridge2.0-0
RUN apt-get update
RUN apt-get install -y libgtk-3-0

RUN usermod -u $UID node
RUN groupmod -g $GID node

ADD .bashrc /home/node/

USER node
