// const autoPrefixer = require("gulp-autoprefixer");

$(function () {

    //pagescroll 2 id
    $('.footer_link a').mPageScroll2id();
    // $('.slide_to_sign').mPageScroll2id();


    // wow = new WOW({
    //     boxClass: 'wow', // default
    //     animateClass: 'animated', // default
    //     offset: 1, // default
    //     mobile: true, // default
    //     live: true // default
    // })
    // wow.init();

    gsap.to(".preloader", 2.2, {
        delay: 5,
        top: "-3000px",
        ease: Expo.easeInOut
    })

    let animItems = document.querySelectorAll('.anim-items')
    console.log(animItems.length)   
    for (let i = 0; i < animItems.length; i++) {
        ScrollTrigger.create({
            trigger: animItems[i],
            start: 'top+=100 bottom',
            end: 'bottom-=100 top',
            // markers: true,
            // toggleActions: 'restart reverse restart reverse',
            // invalidateOnRefresh: true,
            onEnter: () => {
                gsap.to(animItems[i], 0.7,
                    {opacity: 1,y: '-0.6rem' })
                    // {y: 0});
            },
            onEnterBack: () => {
                gsap.to(animItems[i], 0.7,
                    {opacity: 1,y: '-0.6rem' })
                    // {y: 0});
            },
            onLeave: () => {
                gsap.to(animItems[i], 0.7,
                    {opacity: 0,y: 0 })
                    // {y: '0.4rem' });
            },
            onLeaveBack: () => {
                gsap.to(animItems[i], 0.7,
                    {opacity: 0,y: 0 })
                    // {y: '-0.4rem' });
            }
        })
    }
});
window.onresize = function (event) {
    ScrollTrigger.refresh();
};
function slideToggle(el) {
    var elem = document.getElementById(el);
    elem.classList.toggle("open");
}

let box1 = document.getElementById('box')
let box2 = document.getElementById('box2')
let box3 = document.getElementById('box3')
let box4 = document.getElementById('box4')

let butopen = document.getElementById('butopen1')
let butopen2 = document.getElementById('butopen2')
let butopen3 = document.getElementById('butopen3')
let butopen4 = document.getElementById('butopen4')

let butclose = document.getElementById('butclose1')
let butclose2 = document.getElementById('butclose2')
let butclose3 = document.getElementById('butclose3')
let butclose4 = document.getElementById('butclose4')

butopen.onclick = function() {
    box1.classList.add('open1')
    butopen.classList.add('active')
    butclose.classList.add('active')
}

butopen2.onclick = function() {
    box2.classList.add("open2")
    butopen2.classList.add('active')
    butclose2.classList.add('active')
}

butopen3.onclick = function() {
    box3.classList.add("open3")
    butopen3.classList.add('active')
    butclose3.classList.add('active')
}

butopen4.onclick = function() {
    box4.classList.add("open4")
    butopen4.classList.add('active')
    butclose4.classList.add('active')
}

// $('.read_more_one').on('click', function() {
//     $('.text_drop-one').toggleClass('active');
// })
// $('.read_more_two').on('click', function() {
//     $('.text_drop-two').toggleClass('active');
// })
// $('.read_more_three').on('click', function() {
//     $('.text_drop-three').toggleClass('active');
// })
// $('.read_more_four').on('click', function() {
//     $('.text_drop-four').toggleClass('active');
// })
// $('.read_more_five').on('click', function() {
//     $('.text_drop-five').toggleClass('active');
// })

let allPeople = document.querySelectorAll('.team-list.people')

for (let i = 0; i < allPeople.length; i++) {
    let dropdownText = allPeople[i].querySelector('.text_drop')
    let dropdownButton = allPeople[i].querySelector('.read_more')
    let dropdownDots = allPeople[i].querySelector('.dots')
    
    if(dropdownButton) {
        dropdownButton.addEventListener('click', () => {
            if(dropdownText.classList.contains('drop')) {
                gsap.to(dropdownText, {
                    height: '.36rem',
                    duration: .2,
                });
                gsap.to(dropdownDots, {
                    opacity: 1,
                    duration: 0,
                })
            } else {
                gsap.to(dropdownText, {
                    height: 'auto',
                    duration: .2,
                });
                gsap.to(dropdownDots, {
                    opacity: 0,
                    duration: 0,
                })
            }
            dropdownText.classList.toggle('drop')
        })
    }

    
    
}

butclose.onclick = function() {
    box1.classList.remove('open1')
    butopen.classList.remove('active')
    butclose.classList.remove('active')
}

butclose2.onclick = function() {
    box2.classList.remove('open2')
    butopen2.classList.remove('active')
    butclose2.classList.remove('active')
}

butclose3.onclick = function() {
    box3.classList.remove('open3')
    butopen3.classList.remove('active')
    butclose3.classList.remove('active')
}

butclose4.onclick = function() {
    box4.classList.remove('open4')
    butopen4.classList.remove('active')
    butclose4.classList.remove('active')
}


let mobileButton = document.querySelector('.bt-menu')
let mobileMenu = document.querySelector('.mobile_menu')
let buttClose = document.querySelector('.back_menu')
let slideTo = document.querySelector('.slide_to_sign')
let buttClose2 = document.querySelector('.back_menu2')
let tnxopen = document.querySelector('.tnx')
let arrow = document.querySelector('.arrow')

    mobileButton.addEventListener('click', () => {
        mobileMenu.classList.add('active')
    })
    buttClose.addEventListener('click', () => {
        mobileMenu.classList.remove('active')
    })

    slideTo.addEventListener('click', () => {
        mobileMenu.classList.add('active')
    })

    arrow.addEventListener('click', () => {
        mobileMenu.classList.add('active')
    })

    buttClose2.addEventListener('click', () => {
        tnx.classList.remove('active')
    })