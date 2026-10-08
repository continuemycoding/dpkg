---
name: update-developer-image
description: 更新 iOS 开发者镜像的本地文件、GitCode 附件名和客户端校验值。在 dpkg 仓库更换、新增或核对 Personalized / Cryptex 开发者镜像，或用户提到 DDI、开发者镜像、GitCode 附件时使用。仓库的 Caddyfile 没有 /ddi/ 跳转时不适用。不管软件源 deb、网站页面和客户端挂载协议。
---

# 更新开发者镜像

## 适用范围

仓库根目录的 `Caddyfile` 含 `@ddi`，把 `/ddi/<构建号>/<Personalized|Cryptex>/<原文件名>` 跳到 `vars release_url` 下的附件 `<构建号>-<类型>-<原文件名>`。没有这条规则就不要套用。

客户端仍请求原始文件名。站点负责跳到 GitCode。本地 `ddi/` 只存改名后的附件，且已被 gitignore，不要提交。

## 步骤

1. 读 `Caddyfile` 里的 `vars release_url`。上传目标以这一行为准。
2. 使用用户给出的构建号，以及来源：`DeveloperDiskImage` 的某个提交，或已经放好的本地目录。构建号写进路径和附件名，不要改去跟 `main`。
3. 在仓库根目录执行：

```bash
python .agents/skills/update-developer-image/scripts/stage_ddi.py --build <构建号> --revision <提交>
python .agents/skills/update-developer-image/scripts/stage_ddi.py --build <构建号> --source <目录> --prepare <客户端 bridges/ios/src/prepare.rs>
```

`--revision` 与 `--source` 二选一。`--prepare` 写回 `DDI_BASE`、`FILES` 和 `CRYPTEX_FILES`。只核对、不落盘时加 `--check`。

4. 脚本失败时停。GitHub 下载失败就改用用户提供的本地目录，不要更换来源。
5. 把 `ddi/<构建号>/` 下的文件上传到 `release_url` 指向的发布，附件名与文件名一致。没有上传凭据时停在本地文件和客户端改动，并说明还差上传。
6. 只换构建号时不用改 `Caddyfile`。更换发布地址才改 `release_url`。
7. 旧构建号的附件留在同一个发布里。已经发出的客户端仍请求旧的 `DDI_BASE`。

Personalized 固定三个文件：`Image.dmg`、`Image.dmg.trustcache`、`BuildManifest.plist`。Cryptex 再加 `Image.dmg.cryptex_info`、`Image.dmg.root_hash`。校验值是 Git blob SHA-1，由脚本计算。

客户端改动在客户端仓库提交，本仓库只提交规则或 skill 的改动。两边都用中文提交主题，只暂存本次相关路径。用户未要求时不触发 CI。
