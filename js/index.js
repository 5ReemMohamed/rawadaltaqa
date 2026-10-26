
(() => {
    "use strict";

    const initSmartWebsite = () => {
        const header = document.getElementById("smartHeader");
        const navbar = document.getElementById("smartNavbar");
        const navLinks = document.querySelectorAll(".smart-nav-links .nav-link");
        const sections = document.querySelectorAll("section[id]");
        const videoModal = document.getElementById("smartVideoModal");
        const companyVideo = document.getElementById("smartCompanyVideo");

        const updateHeader = () => {
            if (!header) return;

            header.classList.toggle("is-scrolled", window.scrollY > 60);
        };

        const updateActiveLink = () => {
            let currentSection = "home";
            const scrollPosition = window.scrollY + 160;

            sections.forEach((section) => {
                if (section.offsetTop <= scrollPosition) {
                    currentSection = section.id;
                }
            });

            navLinks.forEach((link) => {
                const target = link.getAttribute("href");
                link.classList.toggle("active", target === `#${currentSection}`);
            });
        };

        let scrollTicking = false;

        const handleScroll = () => {
            if (scrollTicking) return;

            scrollTicking = true;

            requestAnimationFrame(() => {
                updateHeader();
                updateActiveLink();
                scrollTicking = false;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        updateHeader();
        updateActiveLink();

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                if (!navbar) return;

                const instance = bootstrap.Collapse.getInstance(navbar);

                if (instance && navbar.classList.contains("show")) {
                    instance.hide();
                }
            });
        });

        if (videoModal && companyVideo) {
            videoModal.addEventListener("shown.bs.modal", () => {
                companyVideo.play().catch(() => {});
            });

            videoModal.addEventListener("hide.bs.modal", () => {
                if (videoModal.contains(document.activeElement)) {
                    document.activeElement.blur();
                }
            });

            videoModal.addEventListener("hidden.bs.modal", () => {
                companyVideo.pause();
                companyVideo.currentTime = 0;
            });
        }

        if (typeof AOS !== "undefined") {
            AOS.init({
                duration: 900,
                easing: "ease-out-cubic",
                once: true,
                offset: 80,
                disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            });
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSmartWebsite);
    } else {
        initSmartWebsite();
    }
})();

(() => {
    "use strict";

    const initSmartContact = () => {
        const form = document.getElementById("smartContactForm");

        if (!form) return;

        const whatsappNumber = "966569130578";

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!form.reportValidity()) return;

            const name = document.getElementById("smartContactName").value.trim();
            const phone = document.getElementById("smartContactPhone").value.trim();
            const email = document.getElementById("smartContactEmail").value.trim();
            const city = document.getElementById("smartContactCity").value;
            const service = document.getElementById("smartContactService").value;
            const message = document.getElementById("smartContactMessage").value.trim();

            if (!name || !phone || !city || !service || !message) {
                alert("يرجى استكمال جميع البيانات المطلوبة.");
                return;
            }

            const whatsappMessage = [
                "طلب خدمة جديد - شركة رواد الطاقة الذكية",
                "",
                `الاسم: ${name}`,
                `رقم الجوال: ${phone}`,
                `البريد الإلكتروني: ${email || "غير محدد"}`,
                `المدينة: ${city}`,
                `نوع الخدمة: ${service}`,
                "",
                "تفاصيل المشروع:",
                message,
                "",
                "تم إرسال الطلب من الموقع الإلكتروني."
            ].join("\n");

            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

            const newWindow = window.open(whatsappUrl, "_blank");

            if (newWindow) {
                newWindow.opener = null;
                form.reset();
            } else {
                alert("يرجى السماح بفتح النوافذ المنبثقة لإرسال الطلب عبر واتساب.");
            }
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSmartContact);
    } else {
        initSmartContact();
    }
})();

(() => {
    "use strict";

    const initSmartGallery = () => {
        const section = document.querySelector(".smart-gallery-section");
        const sliderElement = document.querySelector(".smart-gallery-slider");
        const lightbox = document.getElementById("smartGalleryLightbox");

        if (!section || !sliderElement || !lightbox) return;

        const cards = [...sliderElement.querySelectorAll(".smart-gallery-card")];
        const currentElement = section.querySelector(".smart-gallery-current");
        const totalElement = section.querySelector(".smart-gallery-total");
 
        const lightboxImage = document.getElementById("smartGalleryLightboxImage");
        const lightboxTitle = document.getElementById("smartGalleryLightboxTitle");
        const lightboxCategory = document.getElementById("smartGalleryLightboxCategory");
        const lightboxCount = document.getElementById("smartGalleryLightboxCount");

        const closeButton = lightbox.querySelector(".smart-gallery-lightbox-close");
        const prevButton = lightbox.querySelector(".smart-gallery-lightbox-prev");
        const nextButton = lightbox.querySelector(".smart-gallery-lightbox-next");

        let activeIndex = 0;
        let lastFocusedElement = null;

 

        if (typeof Swiper !== "undefined") {
            new Swiper(sliderElement, {
                slidesPerView: 1.1,
                spaceBetween: 16,
                speed: 750,
                loop: cards.length > 3,
                autoplay: {
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                navigation: {
                    nextEl: section.querySelector(".smart-gallery-next"),
                    prevEl: section.querySelector(".smart-gallery-prev")
                },
                breakpoints: {
                    576: {
                        slidesPerView: 1.5,
                        spaceBetween: 20
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 22
                    },
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 25
                    }
                },
              
            });
        }

        const updateLightbox = () => {
            const card = cards[activeIndex];

            lightboxImage.src = card.dataset.image;
            lightboxImage.alt = card.dataset.title;
            lightboxTitle.textContent = card.dataset.title;
            lightboxCategory.textContent = card.dataset.category;
         };

        const openLightbox = (index) => {
            activeIndex = index;
            lastFocusedElement = document.activeElement;
            updateLightbox();

            lightbox.classList.add("active");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.classList.add("smart-gallery-modal-open");
            closeButton.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove("active");
            lightbox.setAttribute("aria-hidden", "true");
            document.body.classList.remove("smart-gallery-modal-open");
            lightboxImage.removeAttribute("src");

            if (lastFocusedElement && lastFocusedElement.isConnected) {
                lastFocusedElement.focus();
            }
        };

        const changeLightbox = (direction) => {
            activeIndex = (activeIndex + direction + cards.length) % cards.length;
            updateLightbox();
        };

        cards.forEach((card, index) => {
            const button = card.querySelector(".smart-gallery-open");

            if (button) {
                button.addEventListener("click", () => openLightbox(index));
            }
        });

        closeButton.addEventListener("click", closeLightbox);
        prevButton.addEventListener("click", () => changeLightbox(-1));
        nextButton.addEventListener("click", () => changeLightbox(1));

        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) closeLightbox();
        });

        document.addEventListener("keydown", (event) => {
            if (!lightbox.classList.contains("active")) return;

            if (event.key === "Escape") closeLightbox();
            if (event.key === "ArrowRight") changeLightbox(-1);
            if (event.key === "ArrowLeft") changeLightbox(1);

            if (event.key === "Tab") {
                const focusable = [closeButton, prevButton, nextButton];
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSmartGallery);
    } else {
        initSmartGallery();
    }
})();

(() => {
    "use strict";

    const initSmartFooter = () => {
        const yearElement = document.getElementById("smartFooterYear");
        const backToTop = document.getElementById("smartBackToTop");

        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }

        if (!backToTop) return;

        const toggleBackToTop = () => {
            const isVisible = window.scrollY > 400;

            backToTop.classList.toggle("active", isVisible);
        };

        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "instant"
                    : "smooth"
            });
        });

        window.addEventListener("scroll", toggleBackToTop, {
            passive: true
        });

        toggleBackToTop();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSmartFooter);
    } else {
        initSmartFooter();
    }
})();
