// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const message = document.getElementById('message');
    const sadImg = document.getElementById('sadCat');
    const happyImg = document.getElementById('happyCats'); // may be null
    const title = document.querySelector('.title');
    const buttons = document.querySelector('.buttons');

    if (!noBtn || !yesBtn || !message || !sadImg || !buttons) {
        console.error('Missing required DOM elements:', {
            noBtn: !!noBtn, yesBtn: !!yesBtn, message: !!message, sadImg: !!sadImg, buttons: !!buttons
        });
        return;
    }

    noBtn.style.position = 'fixed';

    sadImg.style.display = 'block';
    if (happyImg) happyImg.style.display = 'none';
    if (!sadImg.style.width) {
        const initial = Math.min(460, Math.round(window.innerWidth * 0.45));
        sadImg.style.width = initial + 'px';
    }

    function rectsOverlap(a, b) {
        return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
    }

    // ...existing code...
    // No button evasion on hover — pick the opposite side from the Yes button
    noBtn.addEventListener('mouseenter', () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;
        const margin = 12;
        const minDistance = 18; // padding around Yes button

        const yesRect = yesBtn.getBoundingClientRect();

        // Decide which half to place the No button in (opposite side of Yes)
        const yesCenterX = (yesRect.left + yesRect.right) / 2;
        const viewportMidX = viewportWidth / 2;
        let minX, maxX;

        if (yesCenterX <= viewportMidX) {
            // Yes is on left half -> place No on right half
            minX = Math.max(viewportMidX, 0);
            maxX = Math.max(0, viewportWidth - btnWidth - margin);
        } else {
            // Yes is on right half -> place No on left half
            minX = 0;
            maxX = Math.max(0, Math.floor(viewportMidX) - btnWidth - margin);
        }

        // Fallback to full width if computed range is invalid
        if (minX >= maxX) {
            minX = 0;
            maxX = Math.max(0, viewportWidth - btnWidth - margin);
        }

        // Try several times to pick Y that doesn't collide with Yes button
        const maxAttempts = 40;
        let attempt = 0;
        let newX = 0, newY = 0;
        let candidateRect, overlapsYes;

        do {
            newX = minX + Math.random() * (maxX - minX);
            const maxY = Math.max(0, viewportHeight - btnHeight - margin);
            newY = Math.random() * maxY;

            candidateRect = {
                left: newX,
                top: newY,
                right: newX + btnWidth,
                bottom: newY + btnHeight
            };

            overlapsYes =
                !(candidateRect.right < (yesRect.left - minDistance) ||
                  candidateRect.left > (yesRect.right + minDistance) ||
                  candidateRect.bottom < (yesRect.top - minDistance) ||
                  candidateRect.top > (yesRect.bottom + minDistance));

            attempt++;
        } while (overlapsYes && attempt < maxAttempts);

        noBtn.style.left = `${Math.round(newX)}px`;
        noBtn.style.top = `${Math.round(newY)}px`;

        const messages = ["Are you sure??", "Really??", "Pookie please...", "Just think about it!", "I'll be very sad...", "Think carefully..."];
        noBtn.textContent = messages[Math.floor(Math.random() * messages.length)];
    });
// ...existing code...

    // Grow sad cat on No click
    noBtn.addEventListener('click', () => {
        const current = parseFloat(getComputedStyle(sadImg).width) || 200;
        const grow = Math.max(20, Math.round(current * 0.15));
        sadImg.style.width = (current + grow) + 'px';
    });

    // Yes click: hide title & buttons, show message and replace sad cat with hugging cats
    yesBtn.addEventListener('click', () => {
        if (title) title.style.display = 'none';
        if (buttons) buttons.style.display = 'none';

        message.textContent = " Knew you would say YES! ";
        message.style.fontSize = '2rem';
        message.style.fontWeight = '700';
        message.style.color = 'var(--accent-dark)';
        message.style.marginBottom = '12px';

        sadImg.src = 'tkthao219-capoo.gif'; // adjust filename/path if needed
        sadImg.alt = 'Hugging cats';
        sadImg.style.display = 'block';
        sadImg.style.margin = '0 auto';
        sadImg.style.width = Math.min(520, Math.round(window.innerWidth * 0.55)) + 'px';

        if (happyImg) happyImg.style.display = 'none';
    });
});
// ...existing code...