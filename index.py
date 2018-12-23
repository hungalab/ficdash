#!/usr/bin/env python3
# -*- coding: utf-8 -*-

#------------------------------------------------------------------------------
# FiC management dashboard with jinja2 template engine
# by nyacom (C) 2018.12
#------------------------------------------------------------------------------
BOARDS = ['fic08', 'fic07', 'fic06', 'fic05']

#------------------------------------------------------------------------------
from jinja2 import Template, Environment, FileSystemLoader

env = Environment(loader=FileSystemLoader('.'))
template = env.get_template('template/index.html')
 
print('Content-type: text/html; charset=utf-8\n')
#print('hello is it works?')

template_vars = {
    'boards' : BOARDS
}

print(template.render(template_vars))
