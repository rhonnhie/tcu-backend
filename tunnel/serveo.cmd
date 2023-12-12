@echo off
ssh -o ConnectTimeout=0 -i C:\Users\Jomariel\.ssh\id_rsa -R tcu-backend-development:80:localhost:3001 serveo.net
