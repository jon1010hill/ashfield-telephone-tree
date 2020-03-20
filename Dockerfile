FROM node:10

RUN apt-get update && apt-get upgrade
RUN apt-get install -y bash vim
# set user to avoid permission issues
# (see https://github.com/nodejs/node-gyp/issues/1236)
USER node
RUN mkdir /home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

# install Firebase CLI
RUN npm install -g firebase-tools yarn

# reset user back to root
USER root
RUN mkdir /opt/app
WORKDIR /opt/app
ENTRYPOINT ["tail", "-f", "/dev/null"]
