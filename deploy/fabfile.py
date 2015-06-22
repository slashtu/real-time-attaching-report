#!/usr/bin/env python2.7
#encoding=utf-8

from fabric.api import *
from fabric.contrib.files import exists, contains, append

#from fabric.utils import abort
#from fabric.decorators import hosts, roles

import os, sys, datetime, glob
sys.dont_write_bytecode = True


env.use_ssh_config = True
env.ssh_config_path = './ssh.config'
env.key_filename = '~/.ssh/google_compute_engine'
env.forward_agent = True

# host configure

#cw-jenkins ip
hosts_admin = ['104.155.226.230']

hosts_slash = ['104.155.226.230']

env.hosts = hosts_slash

def restartapp():
	sudo('docker restart nodejs')

def stopapp():
	sudo('docker stop nodejs')

def runapp():
	sudo('docker run -d --name nodejs -v /home/slash/workspace/real-time-attacking-report/:/usr/src/app -p 3000:3000 nodejs')


def buildimage():
	put('Dockerfile', '/tmp/Dockerfile', mode="0644")
	sudo('cd /tmp/ && docker build -t nodejs .')

def setupremote():
	"""
	1. install docker and 
	2. build docker image
	"""

	sudo("curl -sSL https://get.docker.com/ubuntu/ | sudo sh")

	buildimage()