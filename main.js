// WhatsApp pulse button stays visible
// Simple modal logic for contacto
document.addEventListener("DOMContentLoaded", function(){
    var modal = document.getElementById("contactModal");
    var openBtns = [document.getElementById("asesoramientoBtn"), document.getElementById("contactBtn")];
    var closeBtn = document.getElementById("closeModal");

    openBtns.forEach(function(btn){
        if (btn) btn.onclick = function(e){ e.preventDefault(); modal.style.display = "block";}
    });
    if (closeBtn) closeBtn.onclick = function(){ modal.style.display = "none"; }
    window.onclick = function(event) {
        if (event.target == modal) { modal.style.display = "none"; }
    }
});