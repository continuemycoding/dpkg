#!/usr/bin/env bash
set -euo pipefail

SRC="${1:?usage: build-repo.sh <source-dir> <out-dir>}"
OUT="${2:?usage: build-repo.sh <source-dir> <out-dir>}"

if [[ ! -f "$SRC/source.conf" ]]; then
  echo "missing $SRC/source.conf" >&2
  exit 1
fi

# shellcheck disable=SC1091
set -a
# shellcheck source=/dev/null
source "$SRC/source.conf"
set +a

: "${ORIGIN:?ORIGIN required in source.conf}"
: "${LABEL:?LABEL required in source.conf}"
: "${DESCRIPTION:?DESCRIPTION required in source.conf}"
: "${SITE_URL:?SITE_URL required in source.conf}"

rm -rf "$OUT"
mkdir -p "$OUT/debs"

SHARED="$(cd "$(dirname "$SRC")" && pwd)/shared"

copy_debs() {
  local dir="$1"
  [[ -d "$dir" ]] || return 0
  shopt -s nullglob
  local files=("$dir"/*.deb)
  if ((${#files[@]} > 0)); then
    cp "${files[@]}" "$OUT/debs/"
  fi
  shopt -u nullglob
}

# 共用包先拷，源自己的包后拷（同名时以该源为准）
copy_debs "$SHARED/debs"
copy_debs "$SRC/debs"

shopt -s nullglob
icons=("$SRC"/CydiaIcon*)
if ((${#icons[@]} > 0)); then
  cp "${icons[@]}" "$OUT/"
fi
shopt -u nullglob

cd "$OUT"

if compgen -G "debs/*.deb" > /dev/null; then
  dpkg-scanpackages -m debs > Packages
else
  : > Packages
fi

sed -i 's/Section: Packaging/Section: 应用程序/g' Packages
sed -i 's/Section: Tweak Injection/Section: 插件/g' Packages

if [[ -n "${AUTHOR_FROM:-}" && -n "${AUTHOR_TO:-}" ]]; then
  sed -i "s/Author: ${AUTHOR_FROM}/Author: ${AUTHOR_TO}/g" Packages
fi

if [[ -n "${ICON_FROM:-}" ]]; then
  sed -i "s#${ICON_FROM}#${SITE_URL}/CydiaIcon@3x.png#g" Packages
fi

zstd -c19 Packages > Packages.zst
xz -c9 Packages > Packages.xz

# Also publish a standard Debian layout for Sileo versions that assign a suite
# to a source instead of treating it as a flat repository.
mkdir -p dists/stable/main
for arch in iphoneos-arm iphoneos-arm64 iphoneos-arm64e; do
  arch_dir="dists/stable/main/binary-${arch}"
  mkdir -p "$arch_dir"
  awk -v RS='' -v ORS='\n\n' -v arch="$arch" \
    '$0 ~ ("(^|\n)Architecture: " arch "(\n|$)")' Packages \
    | sed 's#^Filename: debs/#Filename: ../../../debs/#' \
    > "$arch_dir/Packages"
  zstd -c19 "$arch_dir/Packages" > "$arch_dir/Packages.zst"
  xz -c9 "$arch_dir/Packages" > "$arch_dir/Packages.xz"
done

cat > dists/stable/apt-release.conf <<EOF
APT::FTPArchive::Release::Origin "${ORIGIN}";
APT::FTPArchive::Release::Label "${LABEL}";
APT::FTPArchive::Release::Suite "stable";
APT::FTPArchive::Release::Codename "ios";
APT::FTPArchive::Release::Architectures "iphoneos-arm iphoneos-arm64 iphoneos-arm64e";
APT::FTPArchive::Release::Components "main";
APT::FTPArchive::Release::Description "${DESCRIPTION}";
EOF
(cd dists/stable && apt-ftparchive -c apt-release.conf release . > Release)
rm -f dists/stable/apt-release.conf

cydia_filter() {
  if [[ -n "${CYDIA_PACKAGE:-}" ]]; then
    awk -v RS='' -v ORS='\n\n' -v pkg="$CYDIA_PACKAGE" '
      $0 ~ /(^|\n)Architecture: iphoneos-arm(\n|$)/ && $0 ~ ("(^|\n)Package: " pkg "(\n|$)")
    ' Packages
  else
    awk -v RS='' -v ORS='\n\n' '
      $0 ~ /(^|\n)Architecture: iphoneos-arm(\n|$)/
    ' Packages
  fi
}

cydia_filter > Packages.cydia
if [[ -s Packages.cydia ]]; then
  bzip2 -c9 Packages.cydia > Packages.bz2
else
  bzip2 -c9 Packages > Packages.bz2
fi
rm -f Packages.cydia

cat > apt-release.conf <<EOF
APT::FTPArchive::Release::Origin "${ORIGIN}";
APT::FTPArchive::Release::Label "${LABEL}";
APT::FTPArchive::Release::Suite "stable";
APT::FTPArchive::Release::Codename "ios";
APT::FTPArchive::Release::Architectures "iphoneos-arm iphoneos-arm64 iphoneos-arm64e";
APT::FTPArchive::Release::Components "main";
APT::FTPArchive::Release::Description "${DESCRIPTION}";
EOF

apt-ftparchive -c apt-release.conf release . > Release
rm -f apt-release.conf

echo "built $OUT"
