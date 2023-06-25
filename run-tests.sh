#!/usr/bin/env bash


CHANGED_FILES=$(git diff --name-only --diff-filter=ACMRTUXB main | grep  -E .ts)
REGEX="/(?<=\/)(.*?)(?=\/)/"
FILE_PATHS=()




for file in $CHANGED_FILES; do
       if [[ $file == *"content-home-v2"* ]]; then
           F="$(echo $file | cut -d'/' -f2 -f3) "
       else
           F="$(echo $file | cut -d'/' -f2) "
       fi


       if [[ ! " ${FILE_PATHS[*]} " =~ " ${F} " ]]; then
           FILE_PATHS+=$F
       fi
done


for dirname in $FILE_PATHS; do
   case ${dirname} in
       "author-home")
           echo "Running tests for $dirname..."
           cd ./packages/author-home && yarn run ui:test && cd $(git rev-parse --show-toplevel)
       ;;


       "content-home-api" | "content-authoring-home-api")
           echo "Running tests for $dirname..."
           cd ./packages/${dirname} && yarn run test:all:dev && cd $(git rev-parse --show-toplevel)
       ;;


       "content-home-v2/ui" | "common")
           echo "Running tests for $dirname..."
           cd ./packages/${dirname} && yarn run test:all && cd $(git rev-parse --show-toplevel)
       ;;
   esac
done


echo "Running tests is completed!"
