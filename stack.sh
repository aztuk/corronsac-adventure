#!/bin/bash

## CONFIGURATION ###################################

STACK_NAME="corronsac_adventures"
DOCKER_UID=$(id -u)
DOCKER_GID=$(id -g)

####################################################


## RUN #############################################

case $1 in

    start)
        docker-compose -f docker-compose.yml -p $STACK_NAME up -d
    ;;

    stop)
        docker-compose -p $STACK_NAME stop
    ;;

    build)
        docker-compose -f docker-compose.yml -p $STACK_NAME build --build-arg UID="${DOCKER_UID}" --build-arg GID="${DOCKER_GID}"
    ;;

    rebuild)
        docker-compose -p $STACK_NAME stop
        docker-compose -f docker-compose.yml -p $STACK_NAME build --no-cache --build-arg UID="${DOCKER_UID}" --build-arg GID="${DOCKER_GID}"
        docker-compose -f docker-compose.yml -p $STACK_NAME up -d
    ;;

    cli)
        if [ -z "$3" ]
        then
            docker exec -ti --env COLUMNS=`tput cols` --env LINES=`tput lines` $STACK_NAME\_$2_1 bash
        else
            docker exec -ti --env COLUMNS=`tput cols` --env LINES=`tput lines` $STACK_NAME\_$2_1 bash -c "$3"
        fi
    ;;

    *)
        echo -e "Error: unknown argument"
        echo -e "Usage: ./stack.sh start|stop|build|rebuild|cli"

esac


## DEFAULT ACTION ##################################

exit 127 # "Command not found" exit code

####################################################
