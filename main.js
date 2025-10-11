// Modal básico para contacto
document.addEventListener("DOMContentLoaded", function(){
    var modal = document.getElementById("contactModal");
    var openBtns = [document.getElementById("asesoramientoBtn"), document.getElementById("contactBtn"), document.getElementById("agendaBtn")];
    var closeBtn = document.getElementById("closeModal");

    openBtns.forEach(function(btn){
        if (btn) btn.onclick = function(e){ e.preventDefault(); modal.style.display = "block";}
    });
    if (closeBtn) closeBtn.onclick = function(){ modal.style.display = "none"; }
    window.onclick = function(event) {
        if (event.target == modal) { modal.style.display = "none"; }
    }
});