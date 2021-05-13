class Confetti {
  static maxParticleCount = 300;
  static particleSpeed = 2;
  static colors = [
    "DodgerBlue",
    "OliveDrab",
    "Gold",
    "Pink",
    "SlateBlue",
    "LightBlue",
    "Violet",
    "PaleGreen",
    "SteelBlue",
    "SandyBrown",
    "Chocolate",
    "Crimson",
  ];
  static streamingConfetti = false;
  static animationTimer = null;
  static particles = [];
  static waveAngle = 0;
  static runAnimation;

  static resetParticle({ particle = {}, width, height }) {
    particle.color = this.colors[
      Math.floor(Math.random() * this.colors.length)
    ];
    particle.x = Math.random() * width;
    particle.y = Math.random() * height - height;
    particle.diameter = Math.random() * 10 + 5;
    particle.tilt = Math.random() * 10 - 10;
    particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
    particle.tiltAngle = 0;

    return particle;
  }

  static updateParticles() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    this.waveAngle += 0.01;

    for (let [index, particle] of this.particles.entries()) {
      if (!this.streamingConfetti && particle.y < -15)
        particle.y = height + 100;
      else {
        particle.tiltAngle += particle.tiltAngleIncrement;
        particle.x += Math.sin(this.waveAngle);
        particle.y +=
          (Math.cos(this.waveAngle) + particle.diameter + this.particleSpeed) *
          0.5;
        particle.tilt = Math.sin(particle.tiltAngle) * 15;
      }
      if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
        if (
          this.streamingConfetti &&
          this.particles.length <= this.maxParticleCount
        )
          this.resetParticle({ particle, width, height });
        else {
          this.particles.splice(index, 1);
          index--;
        }
      }
    }
  }

  static drawParticles(context) {
    for (let particle of this.particles) {
      context.beginPath();
      context.lineWidth = particle.diameter;
      context.strokeStyle = particle.color;
      let x = particle.x + particle.tilt;
      context.moveTo(x + particle.diameter / 2, particle.y);
      context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
      context.stroke();
    }
  }

  static startConfetti() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    window.requestAnimFrame = (() =>
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 16);
      })();

    let canvas = document.querySelector("#confetti-canvas");

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("id", "confetti-canvas");
    }
    document.body.appendChild(canvas);
    canvas.width = width;
    canvas.height = height;

    window.addEventListener(
      "resize",
      function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      },
      true
    );

    let context = canvas.getContext("2d");
    while (this.particles.length < this.maxParticleCount)
      this.particles.push(this.resetParticle({ width, height }));

    this.streamingConfetti = true;

    if (this.animationTimer === null) {
      (this.runAnimation = () => {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (this.particles.length === 0) this.animationTimer = null;
        else {
          this.updateParticles();
          this.drawParticles(context);
          this.animationTimer = window.requestAnimFrame(this.runAnimation);
        }
      })();
    }
  }

  static stopConfetti() {
    this.streamingConfetti = false;
  }

  static removeConfetti() {
    this.stopConfetti();
    this.particles = [];
  }

  static toggleConfetti() {
    this.streamingConfetti ? this.stopConfetti() : this.startConfetti();
  }
}
