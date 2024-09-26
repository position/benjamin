(function () {
	function validEmail(email) {
		const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		return re.test(email);
	}

	function validateHuman(honeypot) {
		if (honeypot) {  //if hidden form filled up
			console.log("Robot Detected!");
			return true;
		} else {
			console.log("Welcome Human!");
		}
	}

	// get all data in form and return object
	function getFormData(form) {
		const elements = form.elements;

		const fields = Object.keys(elements).filter(function (k) {
			return (elements[k].name !== "honeypot");
		}).map(function (k) {
			if (elements[k].name !== undefined) {
				return elements[k].name;
				// special case for Edge's html collection
			} else if (elements[k].length > 0) {
				return elements[k].item(0).name;
			}
		}).filter(function (item, pos, self) {
			return self.indexOf(item) == pos && item;
		});

		const formData = {};
		fields.forEach(function (name) {
			const element = elements[name];

			// singular form elements just have one value
			formData[name] = element.value;

			// when our element has multiple items, get their values
			if (element.length) {
				const data = [];
				for (const i = 0; i < element.length; i++) {
					const item = element.item(i);
					if (item.checked || item.selected) {
						data.push(item.value);
					}
				}
				formData[name] = data.join(', ');
			}
		});

		// add form-specific values into the data
		formData.formDataNameOrder = JSON.stringify(fields);
		formData.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
		formData.formGoogleSendEmail = form.dataset.email || ""; // no email by default

		console.log(formData);
		return formData;
	}

	function handleFormSubmit(event) {  // handles form submit without any jquery
		event.preventDefault();           // we are submitting via xhr below
		const form = event.target;
		const data = getFormData(form);         // get the values submitted in the form

		/* OPTION: Remove this comment to enable SPAM prevention, see README.md
		if (validateHuman(data.honeypot)) {  //if form is filled, form will not be submitted
		  return false;
		}
		*/

		if (data.email && !validEmail(data.email)) {   // if email is not valid show error
			const invalidEmail = form.querySelector(".email-invalid");
			if (invalidEmail) {
				invalidEmail.style.display = "block";
				return false;
			}
		} else {
			disableAllButtons(form);
			const url = form.action;
			const xhr = new XMLHttpRequest();
			xhr.open('POST', url);
			// xhr.withCredentials = true;
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.onreadystatechange = function () {
				console.log(xhr.status, xhr.statusText);
				console.log(xhr.responseText);
				form.reset();
				const formElements = form.querySelector(".form-elements")
				if (formElements) {
					formElements.style.display = "none"; // hide form
				}
				const thankYouMessage = form.querySelector(".thankyou_message");
				if (thankYouMessage) {
					thankYouMessage.style.display = "block";
				}
				location.href = "https://position.github.io/benjamin/#/contact";
				return;
			};
			// url encode form data for sending as post data
			const encoded = Object.keys(data).map(function (k) {
				return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
			}).join('&');
			xhr.send(encoded);

		}
	}

	function loaded() {
		console.log("Contact form submission handler loaded successfully.");
		// bind to the submit event of our form
		const forms = document.querySelectorAll("#gform");
		for (let i = 0; i < forms.length; i++) {
			forms[i].addEventListener("submit", handleFormSubmit, false);
		}
	}
	document.addEventListener("DOMContentLoaded", loaded, false);

	function disableAllButtons(form) {
		const buttons = form.querySelectorAll("button");
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].disabled = true;
		}
	}
})();
