window.addEventListener("load", function () {
  if (document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 180, // زيادة العدد ليكون أكثر كثافة
          density: { enable: true, value_area: 1000 },
        },
        color: { value: "#449ad7" }, // لون أزرق مقارب للون الأساسي ومضيء
        shape: { type: "circle" },
        opacity: {
          value: 0.6,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },
        },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 140,
          color: "#449ad7", // لون الخطوط يطابق الجزيئات
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2.5, // سرعة متوسطة تعطي إحساس بالهدوء والفخامة
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
        },
      },
      retina_detect: true,
    });
  }
});
