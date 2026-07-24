export class BlackHoleState {
  constructor() {
    this.mode = "stable";
    this.quiet = false;
    this.energy = 0.38;
    this.targetEnergy = 0.38;
  }

  toggleQuiet() {
    this.quiet = !this.quiet;
    this.targetEnergy = this.quiet ? 0.12 : 0.38;
  }

  feed(weight = 0.5) {
    this.mode = "feeding";
    this.targetEnergy = Math.min(1, 0.55 + weight * 0.45);
  }

  update(deltaSeconds) {
    const easing = 1 - Math.exp(-deltaSeconds * 1.8);
    this.energy += (this.targetEnergy - this.energy) * easing;
    if (this.mode === "feeding" && Math.abs(this.energy - this.targetEnergy) < 0.02) {
      this.mode = "active";
    }
  }
}
