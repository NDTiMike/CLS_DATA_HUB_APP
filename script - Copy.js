document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ script.js is loaded and running!");

    const form = document.getElementById("dataForm");

    // Attach the submit listener
    form.addEventListener("submit", async function handleSubmit(event) {
        event.preventDefault();
        console.log("📩 Form submission event fired!");

        // Disable the submit button to prevent duplicate submissions
        const submitButton = form.querySelector("button[type='submit']");
        submitButton.disabled = true;

        // Build data object from the form
        const formData = new FormData(form);
        let data = {};
        formData.forEach((value, key) => {
            // Store null if field is left blank
            data[key] = value.trim() === "" ? null : value.trim();
        });
        console.log("📡 Sending Data to Server:", JSON.stringify(data, null, 2));

        try {
            const response = await fetch('http://localhost:5000/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log("✅ Server Response:", result);

            if (result.success) {
                alert("✅ Your data was submitted successfully!");
                form.reset(); // Clear the form on success
            } else {
                alert("❌ " + result.error);
            }
        } catch (error) {
            console.error("❌ Submission Error:", error);
            alert("❌ Error submitting form. Please try again.");
        }

        // Re-enable the submit button
        submitButton.disabled = false;
    });
});
