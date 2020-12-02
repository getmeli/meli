[[ "$1" == "" ]] && echo 'missing deploy key ($1)' && exit 1;
DEPLOY_KEY="$1"

# install ssh and add ssh key for semantic-release
which ssh-agent || apk add openssh
eval $(ssh-agent -s)
echo "$DEPLOY_KEY" | tr -d '\r' | ssh-add -
mkdir -p ~/.ssh
chmod 700 ~/.ssh
# setup git
git config user.name "semantic-release"
git config user.email "release@meli.sh"
