const slider = document.getElementById('slider');
const sliderValue = document.getElementById('slider-value');
slider.style.background = `linear-gradient(to right, #d5d5d5 20px, #db4d0f 20px)`;

slider.addEventListener('input', function () {
    const value = (this.value - this.min) / (this.max - this.min) * 100;
    sliderValue.textContent = this.value;
    this.style.background = `linear-gradient(to right, #d5d5d5 35px ${value}%, #db4d0f ${value}%)`;
});
