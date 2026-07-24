下载地址在下面↓
# M87* Black Hole Desktop Pet

一个以 M87* 为灵感的 Windows 动态黑洞桌宠。

它会以透明、无边框、始终置顶的形式悬浮在桌面上。你可以自由拖动黑洞、开关星空、双击触发“斗转星移”，也可以把文件拖入黑洞，播放吞噬动画并按需送入 Windows 回收站。

![M87* 黑洞桌宠动态预览](assets/blackhole-original-loop-fast.gif)

## 下载

[前往 Releases 下载最新版](../../releases/latest)

下载并解压发布包后：

1. 确保电脑已安装 [Node.js](https://nodejs.org/)。
2. 双击 `安装并启动.cmd`。
3. 第一次运行需要联网下载 Electron，后续可直接双击 `启动桌宠.vbs`。

如果 Electron 下载速度较慢，安装脚本会使用国内镜像，并把缓存保存在项目自己的 `.npm-cache` 目录，不会修改全局 npm 配置。

## 当前功能

- 透明、无边框、固定尺寸的桌面悬浮窗口
- Windows 始终置顶，不在任务栏留下额外窗口
- 鼠标左键按住黑洞即可自由拖动
- 动态吸积盘与保留事件视界结构的柔和透明遮罩
- 分层动态星空与少量高亮星点
- 双击黑洞触发一次 360°“斗转星移”和短暂星轨
- 文件拖入后的螺旋吞噬动画
- 可选的 Windows 系统回收站接口
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
- Windows 系统回收站
- 恢复默认设置
- 退出黑洞桌宠

## 文件安全

“系统回收站”默认关闭。

第一次开启时，程序会显示确认窗口。开启后，拖入黑洞的文件会通过 Electron 的 `shell.trashItem` 进入 Windows 回收站，而不是永久删除。若回收失败，程序不会使用永久删除作为后备方案。

如果只想欣赏桌宠效果，请保持“系统回收站”关闭；文件吞噬动画仍可独立使用。

## 从源码运行

环境建议：

- Windows 10 或 Windows 11
- Node.js 20 或更高版本
- npm

```powershell
npm.cmd install --cache="$PWD\.npm-cache" --registry="https://registry.npmmirror.com"
npm.cmd start
```

检查 JavaScript 语法：

```powershell
npm.cmd run check
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
- 独立 Windows 安装包

## 图像与版权说明

程序代码与视觉素材是两个独立部分。仓库中的黑洞 GIF 来自项目开发阶段使用的外部视觉参考素材，当前主要用于个人学习和非商业原型展示；其原始权利归对应作者或权利人所有。

在重新分发、商业使用或制作正式安装包前，请自行确认图像素材的授权范围，或替换为拥有明确许可的素材。

