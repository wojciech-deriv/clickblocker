const GMAIL_URL_PREFIX = "https://www.google.com/url?q=";

const CLEARED_DOMAINS = {
    "deriv.com": true,
    "mail.google.com": true,
    "github.com": true,
    "forms.gle": true,
    "storydoc.com": true,
    "view.storydoc.com": true,
    "trk.signrequest.com": true,
    "derivgroup.assessteam.com": true,
    "go2.wilmingtonplc.com": true,
    "academy.notabene.id": true,
    "clickup.com": true,
    "app.clickup.com": true,
    "app.organimi.com": true,
    "calendar.google.com": true,
    "deriv.okta.com": true,
    "docs.google.com": true,
    "drive.google.com": true,
    "falcon.crowdstrike.com": true,
    "google.com": true,
    "app.datadoghq.com": true,
    "console.cloud.google.com": true,
    "cyber-risk.upguard.com": true,
    "deriv--fhcm2.vf.force.com": true,
    "deriv-group.slack.com": true,
    "deriv.zoom.us": true,
    "e-services.empower.ae": true,
    "etisalat.ae": true,
    "hackerone.com": true,
    "jbc.iskaan.com": true,
    "lastpass.com": true,
    "login.assess.team": true,
    "lookerstudio.google.com": true,
    "qualysguard.qg1.apps.qualys.in": true,
    "training.knowbe4.com": true,
    "wikijs.deriv.cloud": true,
    "www.amazon.ae": true,
    "cloud.scorebuddy.co.uk": true,
    "www.dewa.gov.ae": true,
    "www.du.ae": true,
    "links.nordlayer.com": true,
    "click.et.oreilly.com": true,
    "www.linkedin.com": true,
    "web.callhippo.com": true,
    "app.falcon.io": true,
    "links.tr.jumpcloud.com": true,
    "meet.google.com": true,
    "deriv.talentlms.com": true,
};


document.addEventListener("click", function(event) {
    const targetElement  = event.target;

    if (targetElement.tagName === 'A') {
        // both can be direct or through google redirect service
        let hrefUrl      = targetElement.getAttribute('href');
        let attributeUrl = targetElement.getAttribute('data-saferedirecturl');

        const isHrefUrlCleared = hrefUrl && isCleared(hrefUrl);
        const isAttributeUrlCleared = attributeUrl && (attributeUrl);

        /*
         * The philosphy is to detect urls which are NOT cleared to go
         * and then prompt for them
         *
         * logic:
         * - both exists:
         *    - both cleared: go
         *    - one or both not cleared: show prompt
         * - one exists:
         *   - cleared: go
         *   - not cleared: show prompt
         * - none exists: go
         */
        const hrefExistsAndNoteCleared = hrefUrl && !isHrefUrlCleared;
        const attributeExistsAndNoteCleared = attributeUrl && !isAttributeUrlCleared;

        if (hrefExistsAndNoteCleared || attributeExistsAndNoteCleared) {
            const hrefDomain = hrefUrl && getDomain(hrefUrl);
            const attributeDomain = attributeUrl && getDomain(attributeUrl);
            const domain = hrefDomain || attributeDomain;

            const prompt = `Are you sure you want to go there? \n \n  ${sanitizeInput(domain)}`;
            if (!confirm(prompt)) {
                event.preventDefault();
            }
        }
    }
});



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

function extractUrlFromGoogleLink(url) {  
    let circuitBreaker = 5; // to avoid infinite loop and to avoid breaking the browser in case of something going horribly wrong by the email provider

    while(url.startsWith(GMAIL_URL_PREFIX) && circuitBreaker > 0) {
        url = url.slice(GMAIL_URL_PREFIX.length);
        url = decodeURIComponent(url);

        --circuitBreaker;
    }

    return url;
}

function isCleared(url) {
    const domain = getDomain(url) || '';
    return !!CLEARED_DOMAINS[domain.toLowerCase()];
}

function getDomain(url) {
    url = extractUrlFromGoogleLink(url);
    try {
        const urlObj = new URL(url);
        return urlObj.host;
    } catch (e) {
        return null;
    }
}