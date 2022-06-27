#!/bin/bash
##################################################################
###         SCRIPT INSTALL BOT WHTATSAPP PARA TRACCAR          ###
###       UTILIZAR COM INSTALAÇÃO LIMPA DO UBUNTU 18.04        ###
###  SE O SCRIPT LHE AJUDOU CONTRIBUA COM ESSE PEQUENO MORTAL  ### 
### ENVIE UMA OFERTA DE QUALQUER VALOR PARA O PIX 11999623179  ###
###                    DEUS TE ABENÇOE                         ###
##################################################################


export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

_install_packges () {

apt -y install libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango1.0-0 libasound2 wget git

}

_install_vnm () {

wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
source ~/.profile
nvm install v12.22.12

}

_clone_bot () {

cd /opt/
git clone https://github.com/Jorge-Nunes/bot-whatsapp.git

}

_install_bot () {

cd /opt/bot-whatsapp && npm install

}

_cp_files_bot () {

cp /opt/bot-whatsapp/Constants.js node_modules/whatsapp-web.js/src/util/
cp /opt/bot-whatsapp/bot-whatsapp.service /etc/systemd/system/

}

_ajuste_systemctl () {

systemctl daemon-reload
systemctl start bot-whatsapp.service
}

_log_bot () {

journalctl -fn 1000

}

_install_packges
sleep 5
_install_vnm
sleep 5
_clone_bot
sleep 5
_install_bot
sleep 5
_cp_files_bot
sleep 5
_ajuste_systemctl
sleep 5
_log_bot
