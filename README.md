###  下载地址在下面↓
# 引力透镜效果由于现阶段可实现的功能都需要读取桌面覆盖，稳定性差没有实用性就暂时关闭了 后续会继续研发新的方向。
# M87* Black Hole Desktop Pet

一个以 M87* 为灵感的 Windows / macOS 动态黑洞桌宠。

它会以透明、无边框、始终置顶的形式悬浮在桌面上。你可以自由拖动黑洞、开关星空、双击触发“斗转星移”，也可以把文件拖入黑洞，播放吞噬动画并按需送入 Windows 回收站或 macOS 废纸篓。

![M87* 黑洞桌宠动态预览](assets/blackhole-original-loop-fast.gif)

## 下载

| 系统 | 设备 | 下载 |
| --- | --- | --- |
| Windows | Windows 10/11 x64 | [下载 v0.1.0 EXE 安装包](https://github.com/z1641818653-blip/M87-BlackHole-Pet/releases/download/v0.1.0/M87.Black.Hole.Pet.Setup.0.1.0.exe) |
| macOS | Apple 芯片（M1/M2/M3/M4） | [下载 arm64 测试包](https://github.com/z1641818653-blip/M87-BlackHole-Pet/actions/runs/30346573786) |
| macOS | Intel 芯片 | [下载 x64 测试包](https://github.com/z1641818653-blip/M87-BlackHole-Pet/actions/runs/30346573786) |

### Windows

下载 `.exe` 后双击安装即可。源码版仍可使用仓库中的 `安装并启动.cmd` 和 `启动桌宠.vbs`。

### macOS

打开上表中的 Mac 下载页面，在页面底部的 `Artifacts` 区域选择：

- `M87-Black-Hole-Pet-mac-arm64`：Apple 芯片（M1/M2/M3/M4）
- `M87-Black-Hole-Pet-mac-x64`：Intel 芯片

Mac 包目前是 PR 的测试构建产物；实机验证完成后会移动到与 Windows 相同的 Releases 下载页。解压后可以使用 `.dmg` 安装，也可以直接解压 `.zip` 中的应用。

当前测试版未使用 Apple Developer 证书签名，macOS 首次启动可能会阻止运行。此时可在 Finder 中按住 `Control` 点击应用，选择“打开”，再确认一次。

## 当前功能

- 透明、无边框、固定尺寸的桌面悬浮窗口
- Windows / macOS 始终置顶；macOS 下隐藏 Dock 图标并显示在所有桌面空间
- 鼠标左键按住黑洞即可自由拖动
- 动态吸积盘与保留事件视界结构的柔和透明遮罩
- 分层动态星空与少量高亮星点
- 双击黑洞触发一次 360°“斗转星移”和短暂星轨
- 文件拖入后的螺旋吞噬动画
- 可选的系统回收站 / 废纸篓接口
- 右键菜单中的独立功能开关

## 操作方法

| 操作 | 效果 |
| --- | --- |
| 左键按住并移动 | 拖动黑洞桌宠 |
| 双击黑洞 | 触发 360° 斗转星移 |
| 拖入文件 | 播放吞噬动画 |
| 右键黑洞 | 打开功能菜单 |
| `Esc` | 退出桌宠 |

右键菜单可以单独控制：

- 背景星空
- 文件吞噬动画
- 系统回收站 / 废纸篓
- 恢复默认设置
- 退出黑洞桌宠

## 文件安全

“系统回收站”默认关闭。

第一次开启时，程序会显示确认窗口。开启后，拖入黑洞的文件会通过 Electron 的 `shell.trashItem` 进入 Windows 回收站或 macOS 废纸篓，而不是永久删除。若回收失败，程序不会使用永久删除作为后备方案。

如果只想欣赏桌宠效果，请保持“系统回收站”关闭；文件吞噬动画仍可独立使用。

## 从源码运行

环境建议：

- Windows 10/11 或 macOS 12+
- Node.js 20 或更高版本
- npm

Windows：

```powershell
npm.cmd install --cache="$PWD\.npm-cache" --registry="https://registry.npmmirror.com"
npm.cmd start
```

macOS：

```bash
npm install
npm start
```

检查 JavaScript 语法：

```bash
npm run check
```

在 Mac 本机生成安装包：

```bash
# Apple 芯片
npm run build:mac:arm64

# Intel 芯片
npm run build:mac:x64
```

## 项目结构

```text
M87-BlackHole-Pet/
├── assets/
│   ├── blackhole-original-loop-fast.gif
│   └── blackhole-soft-mask.svg
├── renderer/
│   ├── app.js
│   ├── blackhole.js
│   ├── file-effects.js
│   ├── particles.js
│   ├── state.js
│   ├── styles.css
│   └── index.html
├── main.js
├── preload.js
├── package.json
├── .github/workflows/build-macos.yml
├── 安装并启动.cmd
└── 启动桌宠.vbs
```

## 技术实现

- Electron：透明桌面窗口、系统菜单、文件回收站接口
- Canvas 2D：星空、星轨、吞噬反馈
- HTML/CSS：黑洞动画合成与柔和轮廓遮罩
- IPC：在隔离渲染进程和主进程之间传递拖动、设置与回收请求

当前版本刻意不包含之前试验过但不稳定的引力透镜模块，以保留稳定拖动、透明窗口和斗转星移效果。

## 开发路线

- 更自然的吸积盘与边缘动态
- 可选的轻量引力透镜
- Stable / Feeding / Active / Cooling 状态机
- 文件大小驱动的亮度、速度与粒子反馈
- Windows / macOS 独立安装包与正式签名

## 图像与版权说明

程序代码与视觉素材是两个独立部分。仓库中的黑洞 GIF 来自项目开发阶段使用的外部视觉参考素材，当前主要用于个人学习和非商业原型展示；其原始权利归对应作者或权利人所有。

在重新分发、商业使用或制作正式安装包前，请自行确认图像素材的授权范围，或替换为拥有明确许可的素材。
