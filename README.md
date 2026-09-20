<meta http-equiv="refresh" content="0; url=https://twikoo.js.org/pushoo">

# pushoo.js

> **pushoo 已并入 [Twikoo](https://github.com/twikoojs/twikoo) 仓库（`packages/pushoo`），本仓库不再维护。**
> 文档请见 **<https://twikoo.js.org/pushoo>**。

## 变更说明

- **代码仓库**：原 `imaegoo/pushoo` → `twikoojs/twikoo` 的 `packages/pushoo`
- **文档**：原 pushoo.js.org → <https://twikoo.js.org/pushoo>
- **版本号**：由 `0.1.12` 直接跳到 **`2.0.0`**，此后跟随 Twikoo 统一版本发布
- **API 不变**：`notice()` 与 `NoticeOptions` 的签名与行为保持兼容

如果您在 `package.json` 里写的是 `"pushoo": "^0.1.x"`，**不会**自动升到 2.0.0，需要手动改成
`"pushoo": "^2.0.0"` 后再安装；原有 `notice()` 调用无需改动。

## pushoo has moved

pushoo is now part of the [Twikoo](https://github.com/twikoojs/twikoo) repository
(`packages/pushoo`) and is released from there. Documentation: **<https://twikoo.js.org/pushoo>**.

```bash
npm install pushoo
```

## 许可

[MIT](./LICENSE)
