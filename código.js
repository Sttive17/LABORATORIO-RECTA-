ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.arc(px(x2), py(y2), 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.fillText(B(${x2},${y2}), px(x2) + 8, py(y2) - 5);
    
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    if (tipo === 'VERTICAL') {
        ctx.moveTo(px(x1), 0);
        ctx.lineTo(px(x1), 500);
    } else {
        let yIzq, yDer;
        if (tipo === 'HORIZONTAL') {
            yIzq = y1; yDer = y1;
        } else {
            yIzq = m * (-10) + b;
            yDer = m * 10 + b;
        }
        ctx.moveTo(px(-10), py(yIzq));
        ctx.lineTo(px(10), py(yDer));
    }
    ctx.stroke();
}

function dibujarEjes(ctx) {
    const centro = 250;
    const escala = 25;
    
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, 500, 500);
    
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(centro + i * escala, 0);
        ctx.lineTo(centro + i * escala, 500);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, centro + i * escala);
        ctx.lineTo(500, centro + i * escala);
        ctx.stroke();
    }
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centro);
    ctx.lineTo(500, centro);
    ctx.moveTo(centro, 0);
    ctx.lineTo(centro, 500);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(500, centro);
    ctx.lineTo(490, centro - 6);
    ctx.lineTo(490, centro + 6);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(centro, 0);
    ctx.lineTo(centro - 6, 10);
    ctx.lineTo(centro + 6, 10);
    ctx.fill();
    
    ctx.font = '12px Arial';
    ctx.fillText('X', 480, centro + 20);
    ctx.fillText('Y', centro + 10, 20);
    ctx.fillText('O', centro + 5, centro + 15);
}

window.onload = function() {
    const ctx = document.getElementById('plano').getContext('2d');
    dibujarEjes(ctx);
};
