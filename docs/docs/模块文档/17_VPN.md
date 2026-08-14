# 17. VPN

VPN 模块用于读取、添加、删除、选择和开关系统 VPN 配置。添加配置会保存账号、密码或共享密钥，请谨慎处理敏感信息。

## 接口列表

| 接口 | 用途 |
| --- | --- |
| [`GET /vpn/list`](#get-vpn-list) | 获取系统 VPN 配置列表 |
| [`POST /vpn/add`](#post-vpn-add) | 添加系统 VPN 配置 |
| [`POST /vpn/remove`](#post-vpn-remove) | 删除指定 VPN 配置 |
| [`POST /vpn/use`](#post-vpn-use) | 选择指定 VPN 线路 |
| [`GET /vpn/status`](#get-vpn-status) | 读取当前 VPN 开关状态 |
| [`POST /vpn/switch`](#post-vpn-switch) | 打开或关闭系统 VPN |

<a id="get-vpn-list"></a>

## `GET /vpn/list`

### 接口说明

获取系统 VPN 配置列表

### 请求参数（Query）

无请求参数

### 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `value` | array | VPN 配置数组 |
| `value[].name` | string | VPN 名称 |
| `value[].identifier` | string | VPN 唯一 ID |
| `value[].applicationName` | string | 应用名称，通常为系统 VPN 配置页显示名称 |
| `value[].applicationIdentifier` | string | 应用包名 |

### 示例

```javascript
const res = await http.get("/vpn/list");
console.log(res.value);
```

<a id="post-vpn-add"></a>

## `POST /vpn/add`

### 接口说明

添加系统 VPN 配置。HTTP 请求使用 JSON Body 传入配置对象。添加配置时只会接收本文档列出的字段，未知字段不会透传到底层服务。

### 请求参数（JSON Body）

| 参数 | 类型 | 是否必选 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `dispName` | string | 是 | VPN 名称 | `"ExampleVPN"` |
| `server` | string | 是 | VPN 服务器地址 | `"vpn.example.com"` |
| `authorization` | string | 是 | VPN 账号 | `"user01"` |
| `password` | string | 是 | VPN 密码 | `"password01"` |
| `VPNType` | number | 是 | VPN 类型：`0=L2TP`、`1=PPTP`、`2=IPSec`、`3=IKEv2` | `0` |
| 　`secret` | string | 条件必选 | 共享密钥；`VPNType` 为 `0` 或 `2` 时必填 | `"secretKey"` |
| 　`VPNLocalIdentifier` | string | 条件必选 | 本地身份标识；`VPNType` 为 `3` 时必填 | `"localID"` |
| 　`VPNRemoteIdentifier` | string | 条件必选 | 远程身份标识；`VPNType` 为 `3` 时必填 | `"remoteID"` |
| `authType` | number | 否 | 用户认证方式：`0=无`、`1=用户名` | `1` |
| `eapType` | string | 否 | EAP 认证方式 | `"EAP-TTLS"` |
| `securID` | string | 否 | RSA SecurID 动态令牌 | `"token"` |
| `encrypLevel` | number | 否 | 加密强度等级，取值范围 `0-3` | `1` |
| `VPNGrade` | number | 否 | VPN 质量或信任等级，取值范围 `0-10` | `0` |
| `VPNSendAllTraffic` | number | 否 | 是否强制所有流量走 VPN：`1=是`，`0=否` | `1` |

### 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `value` | boolean | 添加是否成功 |

### 示例

```javascript
const res = await http.post("/vpn/add", {
  "dispName": "ExampleVPN",
  "VPNType": 0,
  "server": "vpn.example.com",
  "authorization": "user01",
  "password": "password01",
  "secret": "secretKey",
  "encrypLevel": 1,
  "VPNGrade": 0,
  "VPNSendAllTraffic": 1
});
console.log(res.value);
```

IKEv2 配置示例：

```javascript
const res = await http.post("/vpn/add", {
  "dispName": "IKEv2VPN",
  "VPNType": 3,
  "server": "vpn.example.com",
  "authorization": "user01",
  "password": "password01",
  "VPNLocalIdentifier": "localID",
  "VPNRemoteIdentifier": "remoteID",
  "VPNSendAllTraffic": 1
});
console.log(res.value);
```

<a id="post-vpn-remove"></a>

## `POST /vpn/remove`

### 接口说明

删除指定 VPN 配置

### 请求参数（JSON Body）

| 参数 | 类型 | 是否必选 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `identifier` | string | 是 | VPN UUID 或名称；传 `"*"` 删除所有 VPN 配置 | `"ExampleVPN"` |

### 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `value` | boolean | 删除是否成功 |

### 示例

```javascript
const res = await http.post("/vpn/remove", {
  "identifier": "ExampleVPN"
});
console.log(res.value);
```

删除所有 VPN 配置示例：

```javascript
const res = await http.post("/vpn/remove", {
  "identifier": "*"
});
console.log(res.value);
```

<a id="post-vpn-use"></a>

## `POST /vpn/use`

### 接口说明

选择指定 VPN 线路

### 请求参数（JSON Body）

| 参数 | 类型 | 是否必选 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `identifier` | string | 是 | VPN UUID 或名称 | `"ExampleVPN"` |

### 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `value` | boolean | 选择是否成功 |

### 示例

```javascript
const res = await http.post("/vpn/use", {
  "identifier": "ExampleVPN"
});
console.log(res.value);
```

<a id="get-vpn-status"></a>

## `GET /vpn/status`

### 接口说明

读取当前 VPN 开关状态

### 请求参数（Query）

无请求参数

### 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `value` | boolean | VPN 是否已开启。`true` 表示已开启，`false` 表示未开启。 |

### 示例

```javascript
const res = await http.get("/vpn/status");
console.log(res.value);
```

<a id="post-vpn-switch"></a>

## `POST /vpn/switch`

### 接口说明

打开或关闭系统 VPN

### 请求参数（JSON Body）

| 参数 | 类型 | 是否必选 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 是 | 是否开启 VPN：`true` 开启，`false` 关闭 | `true` |

### 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `value` | boolean | 操作是否已提交 |

### 示例

```javascript
const res = await http.post("/vpn/switch", {
  "enabled": true
});
console.log(res.value);
```
