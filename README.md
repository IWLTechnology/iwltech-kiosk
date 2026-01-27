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

    sudo dnf install gnome-kiosk gnome-kiosk-script-session cockpit firefox nodejs nodejs-npm
    sudo systemctl enable --now cockpit.socket
    
5 - Back up user data and enable kiosk mode for the kiosk user

    sudo cp /var/lib/AccountsService/users/[KIOSK USERNAME] /var/lib/AccountsService/users/[KIOSK USERNAME].bak
    sudo sed -i 's/Session=.*/Session=gnome-kiosk-script-wayland/' /var/lib/AccountsService/users/[KIOSK USERNAME]
    
6 - Prevent the kiosk interface from being exposed over the network

    sudo firewall-cmd --permanent --remove-port=3000/tcp
    
Also edit /etc/cockpit/disallowed-users (sudo nano /etc/cockpit/disallowed-users) and add your [KIOSK USERNAME] to it. This will stop the kiosk's files from being accessible over its network.
    
7 - Copy over the kiosk app and make it executable

    cp -r iwltech-kiosk /opt
    cp iwltech-kiosk.sh /opt/iwltech-kiosk/iwltech-kiosk.sh
    chmod +x /opt/iwltech-kiosk/iwltech-kiosk.sh
    cp gnome-kiosk-script /home/[KIOSK USERNAME]/.local/bin/gnome-kiosk-script
    chmod +x /home/[KIOSK USERNAME]/.local/bin/gnome-kiosk-script
    
8 - Change the owner of /home/[KIOSK USERNAME]/.local/bin/gnome-kiosk-script to root.
    
9 - Install NodeJS dependencies

    cd /opt/iwltech-kiosk
    npm install

10 - Edit the file /etc/gdm/custom.conf (sudo nano /etc/gdm/custom.conf).
Add the following lines below the line "[daemon]". Ensure that any other existing entries of AutomaticLoginEnable and AutomaticLogin are removed.

    AutomaticLoginEnable=True
    AutomaticLogin=[KIOSK USERNAME]

11 - Edit the file /opt/iwltech-kiosk/iwltech-kiosk.sh to replace [KIOSK USERNAME] with its proper value.

12 - Edit the configuration as listed above in the "Configuration" section to your desired settings. The files can be found under /opt/iwltech-kiosk

13 - Optionally, set the backdrop of your kiosk account to desktop_background.png

14 - Optionally, you can install the plymouth bootscreen by copying iwltech-kiosk-boot into /usr/share/plymouth/themes/ and running the following:

    sudo plymouth-set-default-theme -R iwltech-kiosk-boot

15 - Reboot the system. You should be all ready to use the new kiosk mode.

## Licensing

This entire repository's code is licensed under the GNU-GPL-3.0 license. See LICENSE for more information.
