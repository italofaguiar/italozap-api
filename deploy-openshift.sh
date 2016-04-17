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
echo "------------------------- git commit -a -m \"$1\"  ------------------------"
echo
git commit -a -m "$1"


echo
echo "------------------------- git push   ------------------------"
echo
git push


echo
echo "------------------------- rhc tail mynotesws  ------------------------"
echo
rhc tail mynotesws