[[ "$1" == "" ]] && echo 'missing base branch ($1)' && exit 1;
BASE_BRANCH="$1"

[[ "$2" == "" ]] && echo 'missing head branch ($2)' && exit 1;
HEAD_BRANCH="$2"

# save head to come back to it after we're done rebasing
HEAD=$(git rev-parse HEAD | tr -d '\n')

# reduce log verbosity
git config advice.detachedHead false

# cleanup workspace
git reset --hard

# update everything
git fetch

# move to head branch and update
git checkout $HEAD_BRANCH
git pull --rebase

# move to base branch
git checkout $BASE_BRANCH
git branch -u origin/$BASE_BRANCH
git pull --rebase
#git push --set-upstream origin $BASE_BRANCH
git merge --ff -m "chore: realign $BASE_BRANCH on $HEAD_BRANCH [ci skip]" $HEAD_BRANCH
git push
git checkout $HEAD
