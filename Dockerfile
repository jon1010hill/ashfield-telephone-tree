FROM node:10

RUN apt-get update && apt-get upgrade
RUN apt-get install -y bash vim
# set user to avoid permission issues
# (see https://github.com/nodejs/node-gyp/issues/1236)
RUN curl -sSL https://sdk.cloud.google.com | bash
ENV PATH $PATH:/root/google-cloud-sdk/bin

#RUN apt-get install -y apt-transport-https ca-certificates gnupg
#RUN https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
#RUN apt-get update && apt-get install -y google-cloud-sdk

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
