const GalleryClassName = "gallery";
const GalleryLineClassName = "gallery-line";
const GallerySlideClassName = "gallery-slide";

class Gallery {
	constructor(element, options = {}) {
		this.containerNode = element;
		this.size = element.childElementCount;
		this.currentSlide = 0;
		this.currentSlideWasChanged = false;

		this.manageHTML = this.manageHTML.bind(this);
		this.setParameters = this.setParameters.bind(this);
		this.setEvents = this.setEvents.bind(this);
		this.resizeGallery = this.resizeGallery.bind(this);
		this.startDrag = this.startDrag.bind(this);
		this.stopDrag = this.stopDrag.bind(this);
		this.dragging = this.dragging.bind(this);
		this.setStylePosition = this.setStylePosition.bind(this);

		this.manageHTML();
		this.setParameters();
		this.setEvents();
	}

	manageHTML() {
		// Добавили элемемнту class="gallery"", до этого был только id
		this.containerNode.classList.add(GalleryClassName);
		// оборачиваем все slide в div class="gallery-line" 
		this.containerNode.innerHTML = `
			<div class="${GalleryLineClassName}">
				${this.containerNode.innerHTML}
			</div>
		`;
		//Достаем class="gallery-line" и всё его содержимое (т.е. сами слайды)
		// <div class="gallery-line">
		// <div class="slide slide-1"></div>
		// <div class="slide slide-2"></div>
		// <div class="slide slide-3"></div>
		// <div class="slide slide-4"></div>
		// 	</div>
		this.lineNode = this.containerNode.querySelector(`.${GalleryLineClassName}`)
		// проходим циклом по каждому div class="slide slide-1"(lineNode.children)
		this.slideNodes = Array.from(this.lineNode.children).map((childNode) => {
				// создаем новый div class="gallery-slide"
				const wrapperNode = document.createElement('div');
				wrapperNode.classList.add(GallerySlideClassName);
				
				/*Новый элемент div class="gallery-line вставляется перед childNode. 
				Таким образом, wrapperNode становится новым родителем для childNode.
				Метод вызывается на родительском элементе, чтотбы вставить wrapperNode
				перед chilNode, внутри общего родителя*/
				childNode.parentNode.insertBefore(wrapperNode, childNode);
				
				//Перемещение childNode внутрь wrapperNode
				wrapperNode.append(childNode);
					/* Результат: <div class="gallery-line">
												<div class="gallery-slide">
												<div class="slide slide-1">
												</div></div></div>
												<div class="gallery-slide">
												<div class="slide slide-2">
												</div></div></div>
												*/
				return wrapperNode;
			}
		);
	}

	setParameters() {
		const coordsContainer = this.containerNode.getBoundingClientRect();
		this.width = coordsContainer.width;
		this.x = -this.currentSlide * this.width;
		console.log(`x: ${this.x}`);

		this.lineNode.style.width = `${this.size * this.width}px`;
		Array.from(this.slideNodes).forEach((slideNode) => {
			slideNode.style.width = `${this.width}px`
		});
	}

	setEvents() {
		this.debouncedResizedGallery = debounce(this.resizeGallery);
		window.addEventListener('resize', this.debouncedResizedGallery);
		this.lineNode.addEventListener('pointerdown', this.startDrag);
		window.addEventListener('pointerup', this.stopDrag);
	}

	destroyEvents() {
		window.removeEventListener('resize', this.debouncedResizedGallery);
	}

	resizeGallery() {
		this.setParameters();
	}

	startDrag(evt) {
		this.currentSlideWasChanged = false;
		this.clickX = evt.pageX;
		// console.log(`event pageX: ${evt.pageX}`);
		//это нужно, чтобы перетягивание слайда было не с 0 позиции, а с прошлой
		this.strartX = this.x;
		window.addEventListener('pointermove', this.dragging);
	}

	stopDrag() {
		window.removeEventListener('pointermove', this.dragging);
		console.log(this.currentSlide);
	}

	//evt всегда автоматически присутствует в eventListener 
	dragging(evt) {
		this.dragX = evt.pageX;
		//координаты клика и насколько сместили позицию курсора
		const dragShift = this.dragX - this.clickX;
		// console.log(`dragShift: ${dragShift}`);
		this.x = dragShift + this.strartX;
		//метод самого премещения через transform translate 
		this.setStylePosition();

		//change active slide
		if (dragShift > 20 && 
			  dragShift > 0 && 
				//Проверка, что слайд не первый
				this.currentSlide > 0 &&
			  !this.currentSlideWasChanged
			) {
			this.currentSlideWasChanged = true;
			this.currentSlide = this.currentSlide - 1;
		}

		if (dragShift < -20 && 
			dragShift < 0 && 
			!this.currentSlideWasChanged &&
			//Проверка, что слайд не последний
			this.currentSlide < this.size - 1
		) {
		this.currentSlideWasChanged = true;
		this.currentSlide = this.currentSlide + 1;
	}
	}

	setStylePosition() {
		this.lineNode.style.transform = `translate3d(${this.x}px, 0, 0)`;
	}

	//change active slide

}

//helpers
function debounce(func, time = 100) {
	let timer;
	return function (event) {
		clearTimeout(timer);
		//setTimeout принимает функцию, время и аргумент для функции
		timer = setTimeout(func, time, event);
	}
}