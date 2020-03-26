  (function(){
    var 
      init = function() {
          setup_listener();

      } ;
    setup_listener = function () {
        window.addEventListener("load", () => {
            var carousels = document.querySelectorAll(".carusel-3d");
            for (var i = 0; i < carousels.length; i++) {
                carousel(carousels[i]);
            }
        });
        function carousel(root) {
            var figure = root.querySelector(".carusel"),
                nav = root.querySelector("nav"),
                images = figure.children,
                n = images.length,
                gap = root.dataset.gap || 0,
                bfc = "bfc" in root.dataset,
                theta = 2 * Math.PI / n,
                currImage = 0;
            setupCarousel(n, parseFloat(getComputedStyle(images[0]).width));
            window.addEventListener("resize", () => {
                setupCarousel(n, parseFloat(getComputedStyle(images[0]).width));
            });
            // setupNavigation();
            function setupCarousel(n, s) {
                var apothem = s / (1.8 * Math.tan(Math.PI / n));
                figure.style.transformOrigin = `50% 50% ${apothem}px`;
                for (var i = 0; i < n; i++) images[i].style.padding = `0 ${gap}px`;
                for (i = 0; i < n; i++) {
                    images[i].style.transformOrigin = `50% 50% ${apothem}px`;
                    images[i].style.transform = `rotateY(${i * -theta}rad)`;
                }
                if (bfc)
                    for (i = 0; i < n; i++) images[i].style.backfaceVisibility = "hidden";
                rotateCarousel(currImage);
            }
            function setupNavigation() {
                nav.addEventListener("click", onClick, true);
                function onClick(e) {
                    e.stopPropagation();
                    var t = e.target;
                    if (t.tagName.toUpperCase() != "BUTTON") return;
                    if (t.classList.contains("next")) {
                        currImage++;
                    } else {
                        currImage--;
                    }
                    rotateCarousel(currImage);
                }
            };
            var navBut = $(".carusel-nav__item");
                carnav = $(".carusel-nav");
                carnumbers = $(".carusel-numbers");
                rulernav = $(".linear__container");
                indexOpacity = 0;
                carnavleft = 40;
            function resizeWidth(){
                    rulerwidth = $(".linear__ruler").width();
                    mm = $('.mm');
                carnumbers.css('width',rulerwidth);
                carnav.css('left',rulerwidth/2-123);
                itemsRuler = rulerwidth/(60*3);
                mm.width(itemsRuler);
                mm.css('margin',"0"+ itemsRuler);
                rulernav.css('left',-6* itemsRuler);
                for (var i = 0; i < mm.length; i++){
                    var number = i/12;
                    if(!Number.isInteger(number) || i === 0){
                        mm.eq(i-1).height(itemsRuler);

                    };}
            };
            resizeWidth();
            $(window).resize(resizeWidth());

            function opaFunc (indexOpacity){
                navBut.css('opacity',0);
                navBut.eq(indexOpacity+1).css('opacity',0.6/1);
                navBut.eq(indexOpacity+2).css('opacity',0.6/2);
                if(indexOpacity>0){
                    navBut.eq(indexOpacity-1).css('opacity',0.6/1);
                    navBut.eq(indexOpacity-2).css('opacity',0.6/2);
                }
                navBut.eq(indexOpacity).css('opacity',1);

            };
            opaFunc(indexOpacity);
            navBut.on('click',function (e) {
                e.preventDefault();
                var butInd = $(this).index();
                console.log(butInd);
                carnavWidth = carnav.width()/6;
                carnav.css('left',(rulerwidth/2-123)-carnavWidth*butInd+"px");
                rulernav.css('left',-24*itemsRuler*butInd+"px");
                rotateCarousel(butInd);
                opaFunc(butInd);
                console.log(itemsRuler);
            });
            function rotateCarousel(imageIndex) {
                figure.style.transform = `rotateY(${imageIndex * theta}rad)`;
            }
        };
        function slideBrowse (){
            $(".carusel__slide").on('click',function () {
                var thisSrc = $(this).find('.carusel__img').attr('data-gray');
                $('.content').toggleClass('hidden');
                $('.slideBrowse').toggleClass('active');
                $('.slideBrowse__img').attr('src',thisSrc);
                // set images
                var images = [
                    thisSrc,
                ];
                new rbgShiftSlider({
                    nav : true,
                    // navElement: '.scene-nav',
                    slideImages: images,
                    stageWidth: 600,
                    stageHeight: 800,
                    displacementImage: 'http://hmongouachon.com/_demos/rgbShiftSlider/displace-circle.png',
                    fullScreen: false,
                    transitionDuration: 0.35, // must be 0.1 > transitionGhostDuration
                    transitionGhostDuration : 0.25,
                    transitionFilterIntensity: 350,
                    transitionSpriteIntensity: 2,
                    mouseDispIntensity: 3,
                    interactive : true,
                    autoPlay : false,
                });
            });

            $('.slideBrowse__fon').on('click',function () {
                $('.content').removeClass('hidden');
                $('.slideBrowse').removeClass('active');
            })
        };
        slideBrowse();


// instanciate slider




    };
      return init();
  })();


