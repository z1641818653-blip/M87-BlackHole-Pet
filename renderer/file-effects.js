export class FileSwallowEffect {
  constructor() {
    this.particles = [];
    this.flareStartedAt = 0;
  }

  start(files, origin, center, now = performance.now()) {
    const entries = Array.from(files).slice(0, 6);
    const startDx = origin.x - center.x;
    const startDy = origin.y - center.y;
    const baseRadius = Math.max(190, Math.hypot(startDx, startDy));
    const baseAngle = Math.atan2(startDy, startDx);

    this.particles = entries.map((file, index) => ({
      name: file.name || "FILE",
      startAt: now + index * 85,
      duration: 1050 + index * 70,
      radius: baseRadius + index * 18,
      angle: baseAngle + index * 0.22,
      turns: 2.1 + index * 0.16,
      warm: index % 3 === 0
    }));
    this.flareStartedAt = now + 760;
  }

  isActive(now = performance.now()) {
    const last = this.particles.at(-1);
    return Boolean(last && now < last.startAt + last.duration + 500);
  }

  drawDocument(ctx, x, y, size, alpha, warm) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.18);
    ctx.globalAlpha = alpha;
    ctx.shadowBlur = size * 0.8;
    ctx.shadowColor = warm ? "#ff9b43" : "#d8eaff";
    ctx.fillStyle = warm ? "#ffd09a" : "#eef6ff";
    ctx.strokeStyle = warm ? "#ff8a35" : "#9fc9ff";
    ctx.lineWidth = 2;

    const width = size * 0.76;
    const height = size;
    const fold = size * 0.24;
    ctx.beginPath();
    ctx.moveTo(-width / 2, -height / 2);
    ctx.lineTo(width / 2 - fold, -height / 2);
    ctx.lineTo(width / 2, -height / 2 + fold);
    ctx.lineTo(width / 2, height / 2);
    ctx.lineTo(-width / 2, height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2 - fold, -height / 2);
    ctx.lineTo(width / 2 - fold, -height / 2 + fold);
    ctx.lineTo(width / 2, -height / 2 + fold);
    ctx.stroke();
    ctx.restore();
  }

  drawFlare(ctx, center, now) {
    const age = (now - this.flareStartedAt) / 700;
    if (age < 0 || age > 1) return;
    const radius = 245 + age * 115;
    const alpha = Math.sin(age * Math.PI) * 0.58;

    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.scale(1, 0.58);
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = `rgba(255,154,65,${alpha})`;
    ctx.lineWidth = 8 - age * 5;
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#ff7b21";
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  draw(ctx, center, now = performance.now()) {
    for (const particle of this.particles) {
      const progress = Math.min(
        1,
        Math.max(0, (now - particle.startAt) / particle.duration)
      );
      if (progress <= 0 || progress >= 1) continue;

      const collapse = Math.pow(1 - progress, 1.28);
      const radius = particle.radius * collapse;
      const angle =
        particle.angle +
        progress * Math.PI * 2 * particle.turns +
        progress * progress * 2.4;
      const x = center.x + Math.cos(angle) * radius;
      const y = center.y + Math.sin(angle) * radius * 0.62;
      const fade = progress > 0.78 ? (1 - progress) / 0.22 : 1;
      const size = 38 - progress * 22;

      this.drawDocument(
        ctx,
        x,
        y,
        size,
        Math.max(0, fade),
        particle.warm
      );
    }
    this.drawFlare(ctx, center, now);
  }
}
