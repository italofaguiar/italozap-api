#/bin/bash

if [ -z "$1" ];
then
  echo "Forneca um argumento com a mensagem deste commit"
  exit 1
fi

echo
echo "------------------------- git add .  ------------------------"
echo
git add .


echo
echo "------------------------- git commit -m \"$1\"  ------------------------"
echo
git commit -a -m "$1"


echo
echo "------------------------- git push heroku master  ------------------------"
echo
git push


echo
echo "------------------------- heroku logs --tail  ------------------------"
echo
rhc tail mynotesws