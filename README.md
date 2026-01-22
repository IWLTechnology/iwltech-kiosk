# IWLTech Kiosk

A customisable locked-down local kiosk app written with NodeJS and HTML designed for use with Fedora and GNOME-kiosk. 

## Features:

Features include:

- Customisable menu entries including:
    - Customisable titles
    - Customisable executable commands
    - Customisable icons
- Customisable dev / settings menu entries including:
    - Customisable titles
    - Customisable executable commands
    - Customisable icons
- Customisable backgrounds

## Configuration:

To customise menu entries, edit settings.js. A few menu entries are already included in the default install.
Menu entries are defined as 

    [
    "ENTRY NAME",
    "COMMAND", 
    "ICON FILE, if applicable, (must be in /public/programIcons)."
    ]
    
Backgrounds are stored in /public/backgrounds in any web-compatible format. Name them by number from 1 upwards, with no extension. A few backgrounds are already included in the default install.

All configuration changes require a system reboot to take effect.

## Installation steps (designed for fedora only), replace [KIOSK USERNAME] with the user you will use for the kiosk:

1 - Create a new user or use an existing user without sudo access. The following process will install Cockpit, so ensure that all administrators have passwords and you are happy with your computer being exposed to its network. If you are unsure about this, feel free to google "Cockpit fedora" and find out more.

2 - Set up all programs and settings for the user.

3 - Change directory into the folder that contains this README.

4 - Install dependencies

    sudo dnf install gnome-kiosk gnome-kiosk-script-session cockpit
    sudo systemctl enable --now cockpit.socket
    
5 - Back up user data and enable kiosk mode for the kiosk user

    sudo cp /var/lib/AccountsService/users/[KIOSK USERNAME] /var/lib/AccountsService/users/[KIOSK USERNAME].bak
    sudo sed -i 's/Session=.*/Session=gnome-kiosk-script-wayland/' /var/lib/AccountsService/users/[KIOSK USERNAME]
    
6 - Prevent the kiosk interface from being exposed over the network

    sudo firewall-cmd --permanent --remove-port=3000/tcp
    
7 - Copy over the kiosk app and make it executable

    cp -r iwltech-kiosk /home/[KIOSK USERNAME]/iwltech-kiosk
    cp iwltech-kiosk.sh /home/[KIOSK USERNAME]/.local/bin/iwltech-kiosk.sh
    chmod +x /home/[KIOSK USERNAME]/.local/bin/iwltech-kiosk.sh
    cp gnome-kiosk-script /home/[KIOSK USERNAME]/.local/bin/gnome-kiosk-script
    chmod +x /home/[KIOSK USERNAME]/.local/bin/gnome-kiosk-script
    
8 - Install NodeJS dependencies

    cd /home/[KIOSK USERNAME]/iwltech-kiosk
    npm install

9 - Edit the file /etc/gdm/custom.conf (sudo nano /etc/gdm/custom.conf).
Add the following lines below the line "[daemon]". Ensure that any other existing entries of AutomaticLoginEnable and AutomaticLogin are removed.

    AutomaticLoginEnable=True
    AutomaticLogin=[KIOSK USERNAME]

10 - Edit the files /home/[KIOSK USERNAME]/.local/bin/iwltech-kiosk.sh to replace [KIOSK USERNAME] and /home/[KIOSK USERNAME]/.local/bin/gnome-kiosk-script to replace [KIOSK USERNAME] with its proper value.

11 - Edit the configuration as listed above in the "Configuration" section to your desired settings. The files can be found under /home/[KIOSK USERNAME]/iwltech-kiosk

12 - Optionally, set the backdrop of your kiosk account to desktop_background.png

13 - Optionally, you can install the plymouth bootscreen by copying iwltech-kiosk-boot into /usr/share/plymouth/themes/ and running the following:

    sudo plymouth-set-default-theme -R iwltech-kiosk-boot

14 - Reboot the system. You should be all ready to use the new kiosk mode.

## Licensing

This entire repository's code is licensed under the GNU-GPL-3.0 license. See LICENSE for more information.
