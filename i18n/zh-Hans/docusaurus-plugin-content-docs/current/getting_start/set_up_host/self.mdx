---
title: 🛜 自托管
id: self
---

import DiffViewer from '@site/src/components/DiffViewer';
import Highlight from '@site/src/components/Highlight';

<Highlight color="#1877F2">**基础方案**</Highlight>

优点？它完全免费 —— 只需要你现有的服务器即可使用。非常适合用于测试和开发环境。但请注意，除非你拥有极高的上行带宽，否则不要在生产环境中使用这种方式。资源包的下载会占用服务器的上行带宽，可能会导致其他玩家卡顿或掉线。

<DiffViewer>
{`
resource-pack:
    delivery:
      hosting:
        - type: "self"
-       ip: "localhost"
+       ip: "你服务器的IP" # 例如 111.222.333.444
          port: 8163
          protocol: "http"
          deny-non-minecraft-request: true
          one-time-token: true
          rate-limit:
            max-requests: 5
            reset-interval: 20 # 单位为秒
`}
</DiffViewer>

:::info

`deny-non-minecraft-request` 设置会阻止所有非标准 Minecraft 客户端发起的请求。 \
至于 `one-time-token`，它会为每位玩家生成一个一次性且限时的下载链接。

你可以通过设置完整的 URL 来避免在资源包链接中使用 IPv4 地址。
```yaml
- type: "self"
  ip: "111.222.333.444"
  port: 8163
  url: "https://mydomain.com:8163/"
  ...更多选项
```

:::

:::caution

如果你没有 SSL 证书，请不要使用 `https`。

:::