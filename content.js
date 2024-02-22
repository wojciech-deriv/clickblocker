const GMAIL_URL_PREFIX = "https://www.google.com/url?q=";

const ALLOWED_PREFIXES = [
    'https://deriv.com/',
    'https://mail.google.com/',
    'https://clickup.com/',
    'https://github.com/binary-com/',
];

function sanitizeInput(input) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return input.replace(reg, (match) => (map[match]));
}

// Example usage:
const userInput = "<script>alert('XSS');</script>";
const sanitizedInput = sanitizeInput(userInput);
console.log(sanitizedInput); // Output will be safe to display


function showConfirm(prompt, confirmCallback, rejectCallback) {
    // Create the overlay
    const overlay = document.createElement('div');
    overlay.id = 'customOverlay';
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';
  
    // Create the popup
    const popup = document.createElement('div');
    popup.id = 'customConfirm';
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.padding = '20px';
    popup.style.zIndex = '1000';
  
    // Add content to the popup
    popup.innerHTML = `
      <p>${prompt}</p>
      ${confirmCallback && '<button id="confirmYes">Yes</button>'}
      ${rejectCallback && '<button id="confirmNo">No</button>'}
    `;
  
    // Append overlay and popup to body
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
  
    // Function to remove popup
    function removePopup() {
      document.body.removeChild(popup);
      document.body.removeChild(overlay);
    }
  
    // Handle "Yes" button click
    document.getElementById('confirmYes').addEventListener('click', function() {
        confirmCallback && confirmCallback();
        removePopup();
    });
  
    // Handle "No" button click
    document.getElementById('confirmNo').addEventListener('click', function() {
        rejectCallback && rejectCallback();
        removePopup();
    });
  }
  

document.addEventListener("click", function(event) {
    const targetElement  = event.target;

    if (targetElement.tagName === 'A') {

        // Get the url from the A element and strip off the PREFIX_LENGTH and acquire the domain name
        let href   = targetElement.getAttribute('href');

        // if URL starts from gmail redirect, then extract the actual url
        if (href.startsWith(GMAIL_URL_PREFIX)) {
            href = href.slice(GMAIL_URL_PREFIX.length);
        }

        let url;
        let domain;

        // try to convert it to URL, if it fails, then its invalid and just block it just in case
        try {
            url    = new URL(href.toString());
            domain = url.host;
        } catch (e) {
            e.preventDefault();
            showConfirm('Invalid URL, blocked');
            return;
        }
        
        const allowed   = ALLOWED_PREFIXES.some(prefix => href.startsWith(prefix));

        // if its on allow list, allow
        if (allowed) {
            return;
        }

        // prompt with sanitized domain - just in case, everything coming from user should be sanitized
        const propmt = "Are you sure you want to go there?\n\n" + sanitizeInput(domain);
    
        // Prevent and alert
        showConfirm(propmt, () => {
            window.open(href, '_blank');
        });

        event.preventDefault();
    }
});