export class StarField {
  constructor(count = 112) {
    this.turnStartedAt = -Infinity;
    this.turnDuration = 1.8;
    this.stars = Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 100 + Math.random() * 285,
      speed: 0.006 + Math.random() * 0.022,
      size: 0.85 + Math.random() * 1.7,
      alpha: 0.4 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      warm: Math.random() > 0.78,
      sparkle: Math.random() > 0.94
    }));
  }

  triggerStellarTurn(now = performance.now()) {
    this.turnStartedAt = now / 1000;
  }

  drawStar(ctx, x, y, star, alpha, stretch, rotation, showSparkle = true) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(stretch, 1);
    ctx.beginPath();
    ctx.arc(0, 0, star.size, 0, Math.PI * 2);
    ctx.fillStyle = star.warm
      ? `rgba(255,209,154,${alpha})`
      : `rgba(222,235,255,${alpha})`;
    ctx.shadowBlur = star.size * 2.4;
    ctx.shadowColor = star.warm ? "#f8b36e" : "#b8d5ff";
    ctx.fill();
    if (star.sparkle && showSparkle) {
      ctx.setTransform(1, 0, 0, 1, x, y);
      ctx.strokeStyle = star.warm
        ? `rgba(255,195,124,${alpha * 0.55})`
        : `rgba(205,229,255,${alpha * 0.58})`;
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(-star.size * 4.6, 0);
      ctx.lineTo(star.size * 4.6, 0);
      ctx.moveTo(0, -star.size * 4.6);
      ctx.lineTo(0, star.size * 4.6);
      ctx.stroke();
    }
    ctx.restore();
  }

  draw(ctx, center, time, energy, options = {}) {
    const starsEnabled = options.starsEnabled ?? true;
    if (!starsEnabled) return;

    const rawProgress = (time - this.turnStartedAt) / this.turnDuration;
    const progress = Math.max(0, Math.min(1, rawProgress));
    const eased = 0.5 - Math.cos(progress * Math.PI) * 0.5;
    const turnAngle = eased * Math.PI * 2;
    const turnEnergy = Math.sin(progress * Math.PI);

    for (const star of this.stars) {
      const sourceAngle =
        star.angle +
        time * star.speed * (1 + energy * 0.3) +
        turnAngle;
      const sourceRadius =
        star.radius + Math.sin(time * 0.4 + star.phase);
      const x = center.x + Math.cos(sourceAngle) * sourceRadius;
      const y = center.y + Math.sin(sourceAngle) * sourceRadius * 0.94;
      const twinkle = 0.76 + Math.sin(time * 1.4 + star.phase) * 0.18;

      if (turnEnergy > 0.02) {
        for (const trailStep of [1, 2, 3]) {
          const trailAngle = sourceAngle - turnEnergy * trailStep * 0.055;
          const ghostX = center.x + Math.cos(trailAngle) * sourceRadius;
          const ghostY =
            center.y + Math.sin(trailAngle) * sourceRadius * 0.94;
          this.drawStar(
            ctx,
            ghostX,
            ghostY,
            star,
            star.alpha * turnEnergy * (0.12 / trailStep),
            1 + turnEnergy * 1.4,
            trailAngle + Math.PI / 2,
            false
          );
        }
      }

      this.drawStar(
        ctx,
        x,
        y,
        star,
        Math.min(1, star.alpha * twinkle + turnEnergy * 0.12),
        1 + turnEnergy * 1.65,
        star.angle + Math.PI / 2 + turnAngle,
        turnEnergy < 0.18
      );
    }
  }
}
