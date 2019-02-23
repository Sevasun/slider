import merge from './common';
import sliderInit from '../main';

function AjaxTabs(options) {
	let defaultOptions = {
		tabLinkHolder: ".tabset",
		tabContentBlock: ".tab-content",
		activeOnLoad: false,
		galleryTabs: true
	};

	this.settings = merge(options, defaultOptions);

	let self = this;

	this.tabLinkHolder = document.querySelector(this.settings.tabLinkHolder);
	this.tabContentBlock = document.querySelector(this.settings.tabContentBlock);
	this.activeOnLoad = this.settings.activeOnLoad;
	this.galleryTabs = this.settings.galleryTabs;

	this.tabsetItems = this.tabLinkHolder.querySelectorAll('li');

	this.activeItem;

	if(this.activeOnLoad) {
		this.activeItem = this.tabsetItems[0];
		this.activeItem.classList.add('active');
		
		showTab(this.activeItem.querySelector('.tab-btn'));
	}
	
	this.tabLinkHolder.addEventListener('click', function(e) {
		if(e.target.className == "tab-btn") {
			let button = e.target;
			showTab(button);
		};
	});

	// tab switching function
	function showTab(btn) {
		let address = btn.getAttribute('data-link');
		if(self.activeItem) {
			self.activeItem.classList.remove('active');
		}
		self.activeItem = btn.parentNode;
		self.activeItem.classList.add('active');
		let request = fetch(address)
			.then((response) => response.text())
			.then((value) => {
				let newTab = document.createElement('div');
				newTab.classList.add('tab');
				newTab.innerHTML = value;
				if(self.tabContentBlock.firstChild) {
					self.tabContentBlock.firstChild.remove();
				};
				self.tabContentBlock.appendChild(newTab);
				
				if(self.galleryTabs) {
					sliderInit();
				}
			});
		// let request = new XMLHttpRequest();

		// if(self.activeItem) {
		// 	self.activeItem.classList.remove('active');
		// }
		// self.activeItem = btn.parentNode;
		// self.activeItem.classList.add('active');
		// request.open('GET', address);
		// request.send();

		// request.addEventListener('readystatechange', function() {
		// 	if(request.readyState === 4 && request.status === 200) {
		// 		let newTab = document.createElement('div');
		// 		newTab.classList.add('tab');
		// 		newTab.innerHTML = request.responseText;
		// 		if(self.tabContentBlock.firstChild) {
		// 			self.tabContentBlock.firstChild.remove();
		// 		};
		// 		self.tabContentBlock.appendChild(newTab);
		// 		if(self.galleryTabs) {
		// 			sliderInit();
		// 		}
		// 	}
		// });
	};
};

export default AjaxTabs;