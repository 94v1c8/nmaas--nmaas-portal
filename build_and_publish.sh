#!/bin/bash

TAG=1.4.5
PACKAGE=nmaas-portal
REPOSITORY=artifactory.geant.net/nmaas-docker-local
sudo docker build --rm -t $REPOSITORY/$PACKAGE:$TAG -f ./Dockerfile ..
sudo docker push $REPOSITORY/$PACKAGE:$TAG
