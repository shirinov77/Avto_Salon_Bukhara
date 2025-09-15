// Hover effect for buttons
document.querySelectorAll('.call-btn, .back-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-3px)';
    });

    btn.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

setTimeout(function () {
    window.location.href = "tel:+998995036343";
}, 3000);