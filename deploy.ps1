$IMAGE_NAME = "sglee487/sn-client-web"
$COMMIT_HASH = git rev-parse --short=8 HEAD

npm run build

docker buildx create --use

$TAG_COMMIT = "${IMAGE_NAME}`:$COMMIT_HASH"
$TAG_LATEST = "${IMAGE_NAME}`:latest"

docker buildx build --platform linux/amd64,linux/arm64 `
  -t $TAG_COMMIT `
  -t $TAG_LATEST `
  --push .
