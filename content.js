
window.ATTEMPTS = {};

document.addEventListener("click", function(event) {
    const targetElement = event.target;

    const ALLOWED_PREFIXED = [
        'https://mail.google.com/',
    ];

    if (targetElement.tagName === 'A') {
        const href = targetElement.getAttribute('href');

        const allowed = ALLOWED_PREFIXED.some(prefix => href.startsWith(prefix));
        const attempted = window.ATTEMPTS[href];

        // if its on allow list, allow
        if (allowed) {
            return;
        }

        // if its already attempted, ask for confirmation
        if (attempted) {
            const confirmed = confirm('Are you sure you want to click?\n\nURL: ' + href);
            if (confirmed) {
                return;
            } else {
                event.preventDefault();
                return;
            }
        }

        // else, prevent and alert
        event.preventDefault();
        alert("Oi! Where do you think you're going? \n\n" + href + "\n\nIf you're sure you want to go there, click again.");

        window.ATTEMPTS[href] = true;
    }
});