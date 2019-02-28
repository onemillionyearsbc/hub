
if [ $# -ne 1 ]; then
  echo "Usage start version"
  exit 1
fi
echo "starting network with version $1"
composer network start -c PeerAdmin@hlfv1 -n hubtutorial -V 0.0.$1  -A admin -S adminpw

# composer network start -c PeerAdmin@hlfv1 -n test-bna -V 0.0.1  -A admin -S adminpw

