# dpkg

Wegoin 的 deb 放在服务器 `data/wegoin/debs/`，不进 git。重启容器后会按该目录重新生成源。

docker-compose exec -it caddy /bin/sh

curl -L https://remotepro.cn/Packages.zst | zstd -d
curl -L https://wegoin.xyz/Packages.zst | zstd -d
