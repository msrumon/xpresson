const navBurger = document.querySelector('.navbar-burger[data-target=nav]');
const navMenu = document.querySelector('#nav');
navBurger.addEventListener('click', () => {
  navBurger.classList.toggle('is-active');
  navMenu.classList.toggle('is-active');
});
