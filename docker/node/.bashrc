# ~/.bashrc: executed by bash(1) for non-login shells.

# Note: PS1 and umask are already set in /etc/profile. You should not
# need this unless you want different defaults for root.
#PS1='${debian_chroot:+($debian_chroot)}\h:\w\$ '
#PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\][\D{%T}]\[\033[01;34m\]\w\[\033[00m\]\$ '
#PS1="Docker//[\[\e[45m\]\u\[\e[m\]\[\e[45m\]@\[\e[m\]\[\e[45m\]\h\[\e[m\]]\[\e[33m\]\w\[\e[m\] ⚓"
# umask 022
# root PS1
PS1="\[\e[30;47m\]Docker//\[\e[m\]\[\e[1m\e[37;42m\] \h \[\e[m\]\[\e[31m\] (\u) \[\e[1m\]\[\e[m\]\w \[\e[m\]\[\e[31m\]#\[\e[1m\]\[\e[m\] "

# User PS1
#PS1="\[\e[30;47m\]Docker//\[\e[m\]\[\e[1m\e[37;42m\] \h \[\e[m\]\[\e[33m\] (\u) \e[m\e[4m\w\e[m \e[1m\[\e[m\]\[\e[33m\]$\e[m "


# You may uncomment the following lines if you want `ls' to be colorized:
export LS_OPTIONS='--color=auto'
#eval "`dircolors`"
alias ls='ls $LS_OPTIONS'
alias ll='ls $LS_OPTIONS -l'
alias l='ls $LS_OPTIONS -lA'
#
# Some more alias to avoid making mistakes:
# alias rm='rm -i'
# alias cp='cp -i'
# alias mv='mv -i'
