# 14. Plist数据

Plist数据模块用于读取、写入和转换 iOS 常见的 plist 数据。它适合处理偏好设置文件、配置文件，或者在脚本里把 JSON 对象转换成 plist XML/binary 数据。

## 接口列表

| 接口 | 用途 |
| --- | --- |
| [`POST /plist/read`](#post-plist-read) | 读取 plist 文件 |
| [`POST /plist/write`](#post-plist-write) | 写入 plist 文件 |
| [`POST /plist/load`](#post-plist-load) | 从字符串或 base64 数据解析 plist |
| [`POST /plist/dump`](#post-plist-dump) | 将 JSON 对象导出成 plist XML 或 binary 数据 |
| [`POST /plist/createData`](#post-plist-createdata) | 创建 plist Data 标记对象 |
| [`POST /plist/createDate`](#post-plist-createdate) | 创建 plist Date 标记对象 |

## 通用数据规则

| 类型 | 写法 | 说明 |
| --- | --- | --- |
| 字符串 | `"hello"` | plist string |
| 数字 | `123` / `1.5` | plist number |
| 布尔 | `true` / `false` | plist bool |
| 数组 | `["a","b"]` | plist array |
| 对象 | `{"name":"demo"}` | plist dictionary，键必须是字符串 |
| Data | `{"__plist_type":"data","value":"aGVsbG8=","encoding":"base64"}` | 二进制数据，`value` 默认按 base64 处理 |
| Date | `{"__plist_type":"date","value":"2026-05-18T00:00:00Z"}` | UTC 时间 |

注意：plist 不支持 `null`。如果对象里包含 `null`，接口会返回参数错误。

<a id="post-plist-read"></a>

## `POST /plist/read`

### 接口说明

读取指定路径的 plist 文件，并转换成脚本可直接使用的 JSON 对象。

### 请求参数

| 参数 | 类型 | 是否必选 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `path` | string | 是 | plist 文件路径 | `"/var/mobile/Library/Preferences/demo.plist"` |

### 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `value` | object \| array | plist 文件转换后的 JSON 对象 |

### 调用示例

```javascript
const res = await http.post("/plist/read", {
  path: "/var/mobile/Library/Preferences/demo.plist"
});

if (res.value) {
  console.log(res.value);
}
```

<a id="post-plist-write"></a>

## `POST /plist/write`

### 接口说明

将 JSON 对象写入指定路径的 plist 文件。

### 请求参数

| 参数 | 类型 | 是否必选 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `path` | string | 是 | 目标 plist 路径 | `"/var/mobile/Library/Preferences/demo.plist"` |
| `value` | object \| array | 是 | 要写入的 plist JSON 对象 | `{"name":"demo","enabled":true}` |
| `format` | string | 否 | 写入格式，支持 `xml`、`binary`。不传时会尽量沿用原文件格式；新文件默认 `xml`。 | `"xml"` |

### 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `value` | boolean | 写入成功时为 `true` |

### 调用示例

```javascript
const res = await http.post("/plist/write", {
  path: "/var/mobile/Library/Preferences/demo.plist",
  format: "xml",
  value: {
    name: "demo",
    enabled: true,
    count: 3
  }
});

console.log(res.value);
```

<a id="post-plist-load"></a>

## `POST /plist/load`

### 接口说明

把 XML 文本或 base64 binary plist 数据解析成 JSON 对象。

### 请求参数

| 参数 | 类型 | 是否必选 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `data` | string | 是 | plist 原始数据。XML 可直接传字符串；binary plist 请传 base64 字符串。 | `"<?xml version=\"1.0\" ..."` |
| `encoding` | string | 否 | `data` 的编码方式，支持 `utf8`、`base64`。默认 `utf8`。 | `"utf8"` |

### 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `value` | object \| array | 解析后的 JSON 对象 |

### 调用示例

```javascript
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
  <dict>
    <key>name</key>
    <string>demo</string>
  </dict>
</plist>`;

const res = await http.post("/plist/load", {
  data: xml,
  encoding: "utf8"
});

console.log(res.value);
```

<a id="post-plist-dump"></a>

## `POST /plist/dump`

### 接口说明

把 JSON 对象序列化为 plist XML 文本或 binary plist base64 数据。

### 请求参数

| 参数 | 类型 | 是否必选 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `value` | object \| array | 是 | 要序列化的 plist JSON 对象 | `{"name":"demo"}` |
| `format` | string | 否 | 输出格式，支持 `xml`、`binary`。默认 `xml`。 | `"binary"` |

### 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `value.data` | string | 序列化后的数据。`xml` 时是 UTF-8 文本；`binary` 时是 base64 字符串。 |
| `value.encoding` | string | `utf8` 或 `base64` |
| `value.format` | string | `xml` 或 `binary` |
| `value.size` | number | 序列化后的字节数 |

### 调用示例

```javascript
const res = await http.post("/plist/dump", {
  format: "binary",
  value: {
    name: "demo",
    enabled: true
  }
});

console.log(res.value.format);   // "binary"
console.log(res.value.encoding); // "base64"
console.log(res.value.data);
```

<a id="post-plist-createdata"></a>

## `POST /plist/createData`

### 接口说明

创建一个 plist Data 标记对象，常用于写入包含二进制字段的 plist。

### 请求参数

| 参数 | 类型 | 是否必选 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `value` | string | 是 | Data 内容。默认按 base64 解码；`encoding=utf8` 时按普通文本转二进制。 | `"aGVsbG8="` |
| `encoding` | string | 否 | `base64` 或 `utf8`。默认 `base64`。 | `"base64"` |

### 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `value.__plist_type` | string | 固定为 `data` |
| `value.value` | string | base64 数据 |
| `value.encoding` | string | 固定为 `base64` |

### 调用示例

```javascript
const dataObj = await http.post("/plist/createData", {
  value: "hello",
  encoding: "utf8"
});

await http.post("/plist/write", {
  path: "/var/mobile/Library/Preferences/demo.plist",
  value: {
    payload: dataObj.value
  }
});
```

<a id="post-plist-createdate"></a>

## `POST /plist/createDate`

### 接口说明

创建一个 plist Date 标记对象，常用于写入包含时间字段的 plist。

### 请求参数

| 参数 | 类型 | 是否必选 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `value` | string \| number | 是 | ISO8601 UTC 字符串，或 Unix 秒级时间戳。 | `"2026-05-18T00:00:00Z"` |

### 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `value.__plist_type` | string | 固定为 `date` |
| `value.value` | string | ISO8601 UTC 时间字符串 |

### 调用示例

```javascript
const dateObj = await http.post("/plist/createDate", {
  value: "2026-05-18T00:00:00Z"
});

await http.post("/plist/write", {
  path: "/var/mobile/Library/Preferences/demo.plist",
  value: {
    updatedAt: dateObj.value
  }
});
```

## 常见错误

| 情况 | 说明 |
| --- | --- |
| `path` 为空 | 读取或写入文件时必须提供路径 |
| `value` 缺失 | 写入或导出 plist 时必须提供 JSON 对象 |
| `format` 不合法 | 只支持 `xml`、`binary` |
| `encoding` 不合法 | 只支持 `utf8`、`base64` |
| 数据包含 `null` | plist 不支持 `null`，请改成字符串、数字、布尔、数组或对象 |
