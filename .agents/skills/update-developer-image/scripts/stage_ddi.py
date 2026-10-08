#!/usr/bin/env python3
"""整理开发者镜像：改成 GitCode 附件名，计算 Git blob SHA-1，并可写回客户端校验。

用法：
  python stage_ddi.py --build 27A5228h --revision <提交> [--prepare prepare.rs]
  python stage_ddi.py --build 27A5228h --source <目录> [--prepare prepare.rs] [--check]

stdout 为 JSON。--check 只核对，不写镜像，也不改 prepare.rs。
"""

import argparse
import hashlib
import json
import re
import sys
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

UPSTREAM = "https://raw.githubusercontent.com/doronz88/DeveloperDiskImage/{revision}/PersonalizedImages/Xcode_iOS_DDI_{variant}/{name}"

VARIANTS = {
    "Personalized": [
        "Image.dmg",
        "Image.dmg.trustcache",
        "BuildManifest.plist",
    ],
    "Cryptex": [
        "Image.dmg",
        "Image.dmg.trustcache",
        "Image.dmg.cryptex_info",
        "Image.dmg.root_hash",
        "BuildManifest.plist",
    ],
}

DDI_BASE = re.compile(r'const DDI_BASE: &str = "https://remotepro\.cn/ddi/[^"]+";')
FIXED_COMMENT = re.compile(r"// 固定 \S+ 镜像及 Git blob 校验值。站点再跳到 GitCode，不跟随上游仓库更新。")
FILES_ARRAY = re.compile(r"const FILES: \[\(&str, usize, &str\); \d+\] = \[.*?\];", re.S)
CRYPTEX_ARRAY = re.compile(r"const CRYPTEX_FILES: \[\(&str, usize, &str\); \d+\] = \[.*?\];", re.S)


def blob_sha1(data: bytes) -> str:
    header = f"blob {len(data)}\0".encode()
    return hashlib.sha1(header + data).hexdigest()


def asset_name(build: str, variant: str, name: str) -> str:
    return f"{build}-{variant}-{name}"


def repo_root() -> Path:
    return Path(__file__).resolve().parents[4]


def candidate_paths(source: Path, build: str, variant: str, name: str) -> list[Path]:
    renamed = asset_name(build, variant, name)
    folders = [variant, f"Xcode_iOS_DDI_{variant}"]
    found = []
    for folder in folders:
        found.append(source / folder / name)
        found.append(source / folder / renamed)
    found.append(source / name)
    found.append(source / renamed)
    return found


def locate(source: Path, build: str, variant: str, name: str) -> Path:
    for path in candidate_paths(source, build, variant, name):
        if path.is_file():
            return path
    raise FileNotFoundError(f"缺少 {variant}/{name}")


def download(revision: str, variant: str, name: str) -> bytes:
    url = UPSTREAM.format(revision=revision, variant=variant, name=name)
    request = urllib.request.Request(url, headers={"User-Agent": "RemotePro"})
    with urllib.request.urlopen(request, timeout=180) as response:
        if response.status != 200:
            raise RuntimeError(f"下载失败 {response.status}: {url}")
        return response.read()


def render_array(const: str, rows: list[dict]) -> str:
    lines = [f"const {const}: [(&str, usize, &str); {len(rows)}] = ["]
    for row in rows:
        lines.extend(
            [
                "    (",
                f'        "{row["name"]}",',
                f'        {row["size"]},',
                f'        "{row["blob"]}",',
                "    ),",
            ]
        )
    lines.append("];")
    return "\n".join(lines)


def write_prepare(path: Path, build: str, personalized: list[dict], cryptex: list[dict]) -> None:
    raw = path.read_bytes()
    newline = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    replacements = [
        (DDI_BASE, f'const DDI_BASE: &str = "https://remotepro.cn/ddi/{build}";', "DDI_BASE"),
        (
            FIXED_COMMENT,
            f"// 固定 {build} 镜像及 Git blob 校验值。站点再跳到 GitCode，不跟随上游仓库更新。",
            "校验注释",
        ),
        (FILES_ARRAY, render_array("FILES", personalized), "FILES"),
        (CRYPTEX_ARRAY, render_array("CRYPTEX_FILES", cryptex), "CRYPTEX_FILES"),
    ]
    for pattern, value, label in replacements:
        text, count = pattern.subn(value, text, count=1)
        if count != 1:
            raise RuntimeError(f"prepare.rs 里找不到唯一的 {label}")
    path.write_text(text, encoding="utf-8", newline=newline)


def collect(build: str, source: Path | None, revision: str | None, check: bool) -> list[dict]:
    root = repo_root() / "ddi" / build
    rows = []
    for variant, names in VARIANTS.items():
        for name in names:
            if source is not None:
                data = locate(source, build, variant, name).read_bytes()
            else:
                data = download(revision, variant, name)
            row = {
                "variant": variant,
                "name": name,
                "size": len(data),
                "blob": blob_sha1(data),
                "asset": asset_name(build, variant, name),
                "path": (root / variant / asset_name(build, variant, name)).relative_to(repo_root()).as_posix(),
            }
            if not check:
                dest = repo_root() / row["path"]
                dest.parent.mkdir(parents=True, exist_ok=True)
                if not dest.is_file() or dest.read_bytes() != data:
                    dest.write_bytes(data)
            rows.append(row)
    return rows


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--build", required=True)
    parser.add_argument("--source", type=Path)
    parser.add_argument("--revision")
    parser.add_argument("--prepare", type=Path)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    if bool(args.source) == bool(args.revision):
        print(json.dumps({"ok": False, "error": "--source 与 --revision 必须且只能提供一个"}, ensure_ascii=False))
        return 1
    if not re.fullmatch(r"[0-9A-Za-z._-]+", args.build):
        print(json.dumps({"ok": False, "error": "构建号含有不能用于路径的字符"}, ensure_ascii=False))
        return 1

    try:
        rows = collect(args.build, args.source, args.revision, args.check)
        if args.prepare and not args.check:
            personalized = [row for row in rows if row["variant"] == "Personalized"]
            cryptex = [row for row in rows if row["variant"] == "Cryptex"]
            write_prepare(args.prepare, args.build, personalized, cryptex)
    except Exception as error:
        print(json.dumps({"ok": False, "error": str(error)}, ensure_ascii=False))
        return 1

    print(json.dumps({"ok": True, "build": args.build, "check": args.check, "files": rows}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
