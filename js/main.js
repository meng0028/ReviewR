/*****************************************************************
File: main.js
Author: Yanming Meng
Description: MAD 9023 ReviewR Assignment
Here is the sequence of logic for the app
-The app will have two screens:
-1. The list of everything that you have reviewed.
-2. An Add new review screen.
-The reviews will be saved in localStorage. The home page will read the localStorage data for your reviews and display a list of the titles and ratings.
-Each item should have a delete button for removing the item from localStorage.
-The Add New page will let the user enter a title, a text review, a star rating (0 - 5), and have a button to take a picture
-Make the button disappear and be replaced with the image after the picture is taken.
Version: 0.0.1
Updated: April 12, 2017
*****************************************************************/
//declare global variables
var app = {
	//declare global variables
	rating: 0
	, stars: null
	, imageFile: null
	, reviewList: new Array()
	, currentReview: 0
	, init: function () {
		document.addEventListener('deviceready', app.onDeviceReady);
	}
	, onDeviceReady: function () {
			// onDeviceReady function
			console.log("Ready");
			// add event listeners to all buttons
			let saveButton = document.getElementById("saveBtn");
			saveButton.addEventListener("touchend", app.saveReview);
			let closeButton = document.getElementById("closeBtn");
			closeButton.addEventListener("touchend", app.closeModal);
			let photoButton = document.getElementById("photoBtn");
			photoButton.addEventListener("touchend", app.takePhoto);
			let deleteButton = document.getElementById("deleteBtn");
			deleteButton.addEventListener("touchend", app.deleteReview);
			app.setStar();
			app.displayReviews();
		}
		// functions to use local storage
		// save data to local storage	
		
	, saveLS: function () {
			localStorage.setItem("reviewr-meng0028", JSON.stringify(reviewList));
		}
		// get data from local storage
		
	, getLS: function () {
			JSON.parse(localStorage.getItem("reviewr-meng0028"));
		}
		// delete data from local storage
		
	, deleteLS: function () {
			localStorage.removeItem("reviewr-meng0028", JSON.stringify(reviewList));
		}
		// functions to add/remove stars
		
	, setStar: function () {
		stars = document.querySelectorAll('.star');
		app.addListeners();
		app.setRating();
	}
	// set rating function
	, setRating: function () {
  [].forEach.call(app.stars, function (star, index) {
			if (app.rating > index) {
				star.classList.add('rated');
				console.log('added rated on', index);
			}
			else {
				star.classList.remove('rated');
				console.log('removed rated on', index);
			}
		});
	}
	// add listener function
	, addListeners: function () {
  [].forEach.call(app.stars, function (star, index) {
				star.addEventListener('touchstart', (function (idx) {
					console.log('adding listener', index);
					return function () {
						app.rating = idx + 1;
						console.log('Rating is now', app.rating)
						app.setRating();
					}
				})(index));
			});
		}
		// show reviews on the main page
		
	, displayReviews: function () {
		app.getLS();
		let list = document.getElementById("review-list");
		list.innerHTML = "";
		let length = reviewList.length;
		for (let i = 0; i < length; i++) {
			let li = document.createElement("li");
			li.className = "table-view-cell media";
			li.setAttribute("dataId", reviewList[i].id);
			let a = document.createElement("a");
			a.href = "#deleteReview"
			a.classList = "navigate-right";
			let div = document.createElement("div");
			div.classList = "media-body";
			let pName = document.createElement("p");
			pName.className = "name";
			pName.textContent = reviewList[i].name;
			let img = document.createElement("img");
			img.classList = "media-object pull-left";
			img.src = reviewList[i].img;
			img.id = "displayedImage";
			div.appendChild(pName);
			let starLength = reviewList[i].rating;
			for (let n = 0; n < starLength; n++) {
				let spanRating = document.createElement("span");
				spanRating.classList = "star";
				div.appendChild(spanRating);
			}
			a.addEventListener("touchstart", app.openModal);
			a.appendChild(img);
			a.appendChild(div);
			li.appendChild(a);
			list.appendChild(li);
		}
	}
	// open modal function
	, openModal: function (ev) {
		currentReview = ev.target.parentElement.attributes.dataId.nodeValue;
		document.getElementById("closeDeleteModdal").addEventListener("touchstart", function () {
			document.getElementById("itemName").textContent = "";
			document.getElementById("reviewImage").src = "";
			value = 0;
		})
		let length = reviewList.length;
		for (let i = 0; i < length; i++) {
			if (currentReview == reviewList[i].id) {
				document.getElementById("itemName").textContent = "Item: " + reviewList[i].name;
				document.getElementById("reviewImage").src = reviewList[i].img;
				document.getElementById("starsCurrent").innerHTML = "";
				let lengthStars = reviewList[i].rating;
				for (let n = 0; n < lengthStars; n++) {
					let spanRating = document.createElement("span");
					spanRating.classList = "star";
					document.getElementById("currentStars").appendChild(spanRating);
				}
				break;
			}
		}
	}
	, takePhoto: function () {
		var options = {
			quality: 80
			, destinationType: Camera.DestinationType.DATA_URL
			, encodingType: Camera.EncodingType.PNG
			, mediaType: Camera.MediaType.PICTURE
			, pictureSourceType: Camera.PictureSourceType.CAMERA
			, allowEdit: true
			, targetWidth: 300
			, targetHeight: 300
		}
		navigator.camera.getPicture(app.loadSuccess, app.showError, options);
	}
	, closeModal: function () {
		document.getElementById("itemName").value = "";
		value = 0;
		document.getElementById("myImage").src = "";
		app.setStar();
		var endEvent = new CustomEvent('touchend', {
			bubbles: true
			, cancelable: true
		});
		var a = document.querySelector("a#xButton");
		a.dispatchEvent(endEvent);
	}
	, saveReview: function () {
		let itemNameToBeSaved = document.getElementById("itemName").value;
		let ratingToBeSaved = rating;
		imageFile = document.getElementById("myImage").src;
		let timeStamp = new Date().getTime() / 1000;
		let review = {
			id: timeStamp
			, name: itemNameToBeSaved
			, rating: ratingToBeSaved
			, img: imageFile
		, };
		reviewList.push(review);
		app.saveLS();
		app.closeModal();
		app.displayReviews();
	}
	, deleteReview: function () {
		let length = reviewList.length;
		for (let i = 0; i < length; i++) {
			console.log(currentReview);
			console.log(reviewList[i].id);
			if (currentReview == reviewList[i].id) {
				reviewList.splice(i, 1);
				console.log(reviewList);
				break;
			}
		}
		document.getElementById("itemName").textContent = "";
		document.getElementById("reviewImage").src = "";
		document.getElementById("currentStars").innerHTML = "";
		value = 0;
		app.saveLS();
		app.displayReviews();
		var endEvent = new CustomEvent('touchend', {
			bubbles: true
			, cancelable: true
		});
		var a = document.querySelector("#closeDeleteModal");
		a.dispatchEvent(endEvent);
	}
	, loadSuccess: function (imageURI) {
		var image = document.getElementById('myImage');
		image.src = "data:image/jpeg;base64," + imageURI;
	}
	, showError: function (message) {
		alert('Failed because: ' + message);
	}
};
app.init();

