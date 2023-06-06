export const startStarfieldAnimation = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let animationFrameId: number;
  
    if (canvas && ctx) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  
      const stars: { x: number; y: number; rad: number }[] = [];
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const rad = Math.random() * 1.5;
        stars.push({ x, y, rad });
      }
  
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffff";
        for (const star of stars) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.rad, 0, Math.PI * 2);
          ctx.fill();
        }
  
        for (const star of stars) {
          star.y += .7;
          if (star.y > canvas.height) {
            star.y = 0;
          }
        }
        animationFrameId = requestAnimationFrame(render);
      };
  
      render();
    }
  
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  };
  