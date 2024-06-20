const slider = document.getElementById('slider');
        const sliderValue = document.getElementById('slider-value');
        // const value = slider.value;
        slider.addEventListener('input', function() {
            sliderValue.textContent = this.value;

            const value = (this.value - this.min) / (this.max - this.min) * 100;
            this.style.background = `linear-gradient(to right, #d5d5d5 ${value}%, #db4d0f ${value}%)`;
        });

        // Initialize the background
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, #d5d5d5 ${value}%, #db4d0f ${value}%)`;