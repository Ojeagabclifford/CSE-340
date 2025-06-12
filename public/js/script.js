const pswdBtn = document.querySelector("#pswdBtn");
pswdBtn.addEventListener("click", function() {
  const pswdInput = document.getElementById("password");
  const type = pswdInput.getAttribute("type");
  if (type == "password") {
    pswdInput.setAttribute("type", "text");
    pswdBtn.innerHTML = "Hide Password";
  } else {
    pswdInput.setAttribute("type", "password");
    pswdBtn.innerHTML = "Show Password";
  }
});


document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", function (event) {
        let isValid = true;

        // Get form values
        const classification = document.getElementById("classficationlist").value.trim();
        const make = document.getElementById("make").value.trim();
        const model = document.getElementById("model").value.trim();
        const description = document.getElementById("description").value.trim();
        const imagesPath = document.getElementById("imagespath").value.trim();
        const thumbnail = document.getElementById("thumbnail").value.trim();
        const price = document.getElementById("price").value.trim();
        const year = document.getElementById("year").value.trim();
        const miles = document.getElementById("miles").value.trim();
        const color = document.getElementById("color").value.trim();

        // Validation Rules
        if (classification.length < 1) {
            alert("Please select a classification.");
            isValid = false;
        }

        if (make.length < 2) {
            alert("Make must be at least 2 characters.");
            isValid = false;
        }

        if (model.length < 2) {
            alert("Model must be at least 2 characters.");
            isValid = false;
        }

        if (description.length < 10) {
            alert("Description must be at least 10 characters.");
            isValid = false;
        }

        if (!imagesPath.includes(".")) {
            alert("Please enter a valid image file path.");
            isValid = false;
        }

        if (!thumbnail.includes(".")) {
            alert("Please enter a valid thumbnail file path.");
            isValid = false;
        }

        if (isNaN(price) || price.length < 1) {
            alert("Price must be a valid number.");
            isValid = false;
        }

        if (!/^\d{4}$/.test(year)) {
            alert("Year must be a valid 4-digit number.");
            isValid = false;
        }

        if (isNaN(miles) || miles.length < 1) {
            alert("Miles must be a valid number.");
            isValid = false;
        }

        if (color.length < 2) {
            alert("Color must be at least 2 characters.");
            isValid = false;
        }

        // Prevent submission if validation fails
        if (!isValid) {
            event.preventDefault();
        }
    });
});

console.log(req.session.account_password) 