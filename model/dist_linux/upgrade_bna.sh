
if [ $# -ne 1 ]; then
  echo "Usage upgrade version"
  exit 1
fi
echo "upgrading network to version $1"
composer network upgrade -c PeerAdmin@hlfv1 -n hubtutorial -V 0.0.$1  

