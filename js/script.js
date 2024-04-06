var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    grabCursor: true,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });


  const faqs = document.querySelectorAll('.faq');
  faqs.forEach(faq => {
    faq.addEventListener('click', () => {
      faq.classList.toggle('open');

      const icon = faq.querySelector('.faq_icon i');
      if(icon.className === 'bi bi-plus'){
        icon.className = "bi bi-dash"
      } else {
        icon.className = "bi bi-plus";
      }
    })
  })


  document.addEventListener('DOMContentLoaded', function () {
    const parentContainer = document.querySelector('.read-more-container');
    parentContainer.addEventListener('click', event => {
        const current = event.target;
        const isReadMoreBtn = current.className.includes('read-more-btn');
        if (!isReadMoreBtn) return;
        const currentText = event.target.parentNode.querySelector('.read-more-text');
        currentText.classList.toggle('read-more-text--show');
        current.textContent = current.textContent.includes('Read More') ?
            "Read Less..." : "Read More...";
    });
});



document.addEventListener('DOMContentLoaded', function () {
  const parentContainer = document.querySelector('.blog-left');
  parentContainer.addEventListener('click', event => {
      const current = event.target;
      const isReadMoreBtn = current.className.includes('read-more-btn-b');
      if (!isReadMoreBtn) return;
      const currentText = event.target.parentNode.querySelector('.read-more-text-b');
      currentText.classList.toggle('read-more-text-b--show');
      current.textContent = current.textContent.includes('Read More') ?
          "Read Less..." : "Read More...";
  });
});