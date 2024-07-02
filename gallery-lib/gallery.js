const GalleryClassName = "gallery";
const GalleryLineClassName = "gallery-line";
const GallerySlideClassName = "gallery-slide";

class Gallery {
	constructor(element, options = {}) {
		this.containerNode = element;
		this.size = element.childElementCount;
		this.currentSlide = 0;

		this.manageHTML = this.manageHTML.bind(this);
		this.setParameters = this.setParameters.bind(this);
		this.setEvents = this.setEvents.bind(this);
		this.resizeGallery = this.resizeGallery.bind(this);

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

		this.lineNode.style.width = `${this.size * this.width}px`;
		Array.from(this.slideNodes).forEach((slideNode) => {
			slideNode.style.width = `${this.width}px`
		});
	}

	setEvents() {
		window.addEventListener('resize', debounce(this.resizeGallery));
	}

	resizeGallery() {
		this.setParameters();
	}
}