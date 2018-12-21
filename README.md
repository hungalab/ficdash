# FiC management dashboard

FiC management dashboard for manage multiple fic boards.

# Deploy

## For apache2.4

* Enable mod_proxy and mod_rewrite
* Configure example like below

```
    #-----------------------------------------------------------------------------
    # Configuration for FiC boards
    # use mod_rewrite for http proxy
    #-----------------------------------------------------------------------------
    RewriteEngine On
    DirectorySlash On
    RewriteRule /fic01/(.*) http://172.20.2.101/$1 [P,L]
    RewriteRule /fic02/(.*) http://172.20.2.102/$1 [P,L]
    RewriteRule /fic03/(.*) http://172.20.2.103/$1 [P,L]
    RewriteRule /fic04/(.*) http://172.20.2.104/$1 [P,L]

    <Directory "/var/www/ficdash">
            Options Indexes FollowSymLinks ExecCGI
            AddHandler cgi-script .cgi .py
    </Directory>

```

# Todo
* Enhancement for packet monitor
* CLI tool
