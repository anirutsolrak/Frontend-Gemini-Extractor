import { reportError } from './api';

function animateElement(element, animationClass, duration = 1000) {
    try {
        if (!element) return;
        
        element.classList.add(animationClass);
        
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    } catch (error) {
        reportError(error);
    }
}

function animateValue(start, end, duration, callback) {
    try {
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            
            callback(currentValue);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    } catch (error) {
        reportError(error);
    }
}

function fadeIn(element, duration = 500) {
    try {
        if (!element) return;
        
        element.style.opacity = 0;
        element.style.display = 'block';
        
        let start = null;
        
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            
            element.style.opacity = Math.min(progress, 1);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    } catch (error) {
        reportError(error);
    }
}

function fadeOut(element, duration = 500) {
    try {
        if (!element) return;
        
        let start = null;
        
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            
            element.style.opacity = Math.max(1 - progress, 0);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.style.display = 'none';
            }
        };
        
        window.requestAnimationFrame(step);
    } catch (error) {
        reportError(error);
    }
}

function slideIn(element, direction = 'right', duration = 500) {
    try {
        if (!element) return;
        
        const startPosition = direction === 'right' ? '100%' : 
                            direction === 'left' ? '-100%' :
                            direction === 'top' ? '-100%' : '100%';
        
        element.style.transform = `translate(${direction === 'right' || direction === 'left' ? startPosition : '0'}, 
                                           ${direction === 'top' || direction === 'bottom' ? startPosition : '0'})`;
        element.style.display = 'block';
        
        let start = null;
        
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            const currentPosition = (1 - Math.min(progress, 1)) * 100;
            
            element.style.transform = `translate(${direction === 'right' || direction === 'left' ? `${currentPosition}%` : '0'}, 
                                               ${direction === 'top' || direction === 'bottom' ? `${currentPosition}%` : '0'})`;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    } catch (error) {
        reportError(error);
    }
}

function pulseEffect(element, scale = 1.1, duration = 200) {
    try {
        if (!element) return;
        
        let start = null;
        const originalTransform = element.style.transform || '';
        
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            
            const currentScale = 1 + (Math.sin(progress * Math.PI) * (scale - 1));
            element.style.transform = `${originalTransform} scale(${currentScale})`;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.style.transform = originalTransform;
            }
        };
        
        window.requestAnimationFrame(step);
    } catch (error) {
        reportError(error);
    }
}

function shakeElement(element, intensity = 5, duration = 500) {
    try {
        if (!element) return;
        
        let start = null;
        const originalTransform = element.style.transform || '';
        
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            
            if (progress < 1) {
                const offset = Math.sin(progress * 30) * intensity * (1 - progress);
                element.style.transform = `${originalTransform} translate(${offset}px, 0)`;
                window.requestAnimationFrame(step);
            } else {
                element.style.transform = originalTransform;
            }
        };
        
        window.requestAnimationFrame(step);
    } catch (error) {
        reportError(error);
    }
}

function rotateElement(element, degrees = 360, duration = 1000) {
    try {
        if (!element) return;
        
        let start = null;
        const originalTransform = element.style.transform || '';
        
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            
            const currentRotation = progress * degrees;
            element.style.transform = `${originalTransform} rotate(${currentRotation}deg)`;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    } catch (error) {
        reportError(error);
    }
}
