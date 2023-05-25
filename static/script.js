let slideIndex = 0;
showSlides();
// function plusSlides(n) {
//   showSlides(slideIndex += n);
// }
// function currentSlide(n) {
//   showSlides(slideIndex = n);
// }
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  if (slideIndex > slides.length) {slideIndex = 1}
  // if (slideIndex < 1) {slideIndex = slides.length}
  // if (n > slides.length) {slideIndex = 1}
  // if (n < 1) {slideIndex = slides.length}
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 2010); // Change image every 2 seconds
}


//fast & foodie
const fast=document.querySelector('#fast')
const foodie=document.querySelector('#foodie')
const tagname=document.querySelector('#tagname')

tagname.onmouseover = function(event) {
  fast.style.color = 'coral';
  foodie.style.color = 'crimson';
};

tagname.onmouseout = function(event) {
  fast.style.color = 'crimson';
  foodie.style.color='coral';
};