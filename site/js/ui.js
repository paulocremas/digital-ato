export function setupDraggable(itemId, headerId) {
    const item = document.getElementById(itemId);
    const header = document.getElementById(headerId);
    let active = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

    header.onmousedown = (e) => {
        initialX = e.clientX - xOffset; initialY = e.clientY - yOffset;
        active = true; item.classList.add("dragging");
    };
    document.onmouseup = () => {
        initialX = currentX; initialY = currentY;
        active = false; item.classList.remove("dragging");
    };
    document.onmousemove = (e) => {
        if (active) {
            e.preventDefault();
            currentX = e.clientX - initialX; currentY = e.clientY - initialY;
            xOffset = currentX; yOffset = currentY;
            item.style.transform = `translate3d(${currentX}px, calc(-50% + ${currentY}px), 0)`;
        }
    };
}
