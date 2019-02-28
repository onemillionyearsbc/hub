if [ $# -ne 1 ]; then
  echo "Usage install version"
  exit 1
fi
echo "installing network with version $1"

composer network install -a hubtutorial@0.0.$1.bna -c PeerAdmin@hlfv1

# composer network install -a test-bna@0.0.1.bna -c PeerAdmin@hlfv1
