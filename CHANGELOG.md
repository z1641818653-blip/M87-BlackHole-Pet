# Changelog

## Unreleased

- 增加 macOS 窗口呈现适配：隐藏 Dock 图标并支持所有桌面空间
- 将文件回收相关文案适配为 Windows 回收站和 macOS 废纸篓
- 增加 Apple Silicon 与 Intel Mac 的 DMG / ZIP 打包命令
- 增加 GitHub Actions macOS 双架构自动构建流程
- 使用打包后 macOS 临时签名，并在发布前校验 DMG 和应用签名

## v0.1.0 — 2026-07-24

首个可公开下载的稳定版本。

- 完成透明无边框 Electron 桌宠窗口
- 修复拖动时窗口逐渐放大的问题
- 完成动态黑洞 GIF 与柔和流线遮罩合成
- 完成分层星空和双击 360° 斗转星移
- 增加文件吞噬动画
- 增加可选的 Windows 系统回收站接口
- 增加右键功能开关、恢复默认设置和退出入口
- 移除不稳定的引力透镜试验代码
