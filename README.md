# dpkg

## Wegoin 服务器文件

和 `docker-compose.yml` 同级创建目录，**不进 git**。换包后执行 `docker compose restart`。

```
data/wegoin/
  debs/                          # 软件源（Sileo / Cydia），启动时生成 Packages
    *.deb
  files/                         # 控制端安装包，对应网站根路径 https://wegoin.xyz/<文件名>
    Wegoin-windows.exe
    Wegoin-macos.dmg
    Wegoin-android.apk
    Wegoin-iphone.ipa
```

版本号写在 `web/src/brand.ts` 的 `downloads.version`（当前 `1.0.0`）。改版本或改文件名后要重新构建镜像。

docker-compose exec -it caddy /bin/sh

curl -L https://remotepro.cn/Packages.zst | zstd -d
curl -L https://wegoin.xyz/Packages.zst | zstd -d
