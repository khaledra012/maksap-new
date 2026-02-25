window.addEventListener("load", function () {
  if (document.getElementById("particles-js")) {
    const isMobile = window.innerWidth < 768;
    particlesJS("particles-js", {
      particles: {
        number: {
          value: isMobile ? 60 : 180, // تقليل العدد على الموبايل لتوفير المعالج
          density: { enable: true, value_area: 1000 },
        },
        color: { value: "#449ad7" },
        shape: { type: "circle" },
        opacity: {
          value: 0.6,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },
        },
        size: { value: 3, random: true },
        line_linked: {
          enable: !isMobile, // تعطيل الخطوط على الموبايل لتقليل وقت المعالجة (Render time)
          distance: 140,
          color: "#449ad7",
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: isMobile ? 1.5 : 2.5, // سرعة أهدأ قليلاً على الموبايل
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        events: {
          onhover: { enable: !isMobile, mode: "grab" }, // تفاعل بسيط فقط على الديسكتوب
          onclick: { enable: true, mode: "push" },
        },
      },
      retina_detect: true,
    });
  }
});
