#! /bin/bash

cd /home/[KIOSK USERNAME]/iwltech-kiosk
npm run start &
rm -rf firefox_kiosk_tmp
mkdir -p firefox_kiosk_tmp
while true; do
  firefox --kiosk --no-remote --private-window --profile /home/[KIOSK USERNAME]/iwltech-kiosk/firefox_kiosk_tmp --display=:0 http://localhost:3000
  sleep 1
done

exit 0
