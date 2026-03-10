addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1,0.5);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000, {x: 100, y: 20});
        });
    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().resetMoveAndScale(block);
        });
    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().resetMoveAndScale(block);
        });
        
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });
    let heartStoper;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartStoper = animaster().heartBeating(block, 500);
        });
    document.getElementById('heartBeatingStop')
    .addEventListener('click', function () {
        heartStoper();
    });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
        });
    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeIn(block);
        }
    );
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().resetFadeOut(block);
        }
    );
    document.getElementById('resetMoveAndScaleReset')

        .addEventListener('click', function () {
            const block = document.getElementById('resetMoveAndScaleBlock');
            animaster().resetMoveAndScale(block);
        });
    document.getElementById('resetMoveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('resetMoveAndHideBlock');
            animaster().resetMoveAndHide(block);
        });

    
}

function animaster(){
    const animaster = {
        fadeIn: fadeIn,
        move: move,
        scale: scale,
        fadeOut: fadeOut,

        moveAndHide: moveAndHide,
        showAndHide: showAndHide,
        heartBeating: heartBeating,
        resetFadeIn: resetFadeIn,
        resetFadeOut: resetFadeOut,
        resetMoveAndScale: resetMoveAndScale,
        resetMoveAndHide: resetMoveAndHide,
        _steps : [],
        addMove: addMove,
        addScale: addScale,
        addFadeIn: addFadeIn,
        addFadeOut: addFadeOut,
        play: play,
        buildHandler: buildHandler,
    };
    function fadeIn(element, duration) {
        this.addFadeIn(duration).play(element);
    }

    function move(element, duration, translation) {
        this.addMove(duration, translation).play(element);
    }

    function scale(element, duration, ratio) {
        this.addScale(duration, ratio).play(element);
    }
    function fadeOut(element, duration) {
        this.addFadeOut(duration).play(element);
    }
    function moveAndHide(element, duration, translation) {
        this.addMove(duration * 0.4, translation).play(element);
        setTimeout(() => this.addFadeOut(duration * 0.6).play(element), duration * 0.4);
    }
    function showAndHide(element, duration) {
        this.addFadeIn(duration * 0.4).play(element);
        setTimeout(() => this.addFadeOut(duration * 0.6).play(element), duration * 0.4);
    }
    function heartBeating(element, duration) {
        const s = setInterval(() => this.addScale(duration, 1.4).play(element), duration);
        const ss = setInterval(() => this.addScale(duration, 1).play(element), duration * 2);

        return function () {
            clearInterval(s);
            clearInterval(ss);
        };
    }
    function resetFadeIn(element) {
        element.style.transitionDuration = '';
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = '';
        element.classList.remove('hide');
        element.classList.add('show');
    }
    function resetMoveAndScale(element) {
        element.style.transitionDuration = '';
        element.style.transform = '';
    }
    function resetMoveAndHide(element) {
        resetMoveAndScale(element);
        resetFadeOut(element);
    }
    function addMove(durationOrElement, translationOrDuration, maybeTranslation) {
        const duration = typeof durationOrElement === 'number' ? durationOrElement : translationOrDuration;
        const translation = typeof durationOrElement === 'number' ? translationOrDuration : maybeTranslation;
        this._steps.push({type: 'move', duration, translation});
        return this;
    }
    function addScale(durationOrElement, ratioOrDuration, maybeRatio){
        const duration = typeof durationOrElement === 'number' ? durationOrElement : ratioOrDuration;
        const ratio = typeof durationOrElement === 'number' ? ratioOrDuration : maybeRatio;
        this._steps.push({type: 'scale', duration, ratio});
        return this;
    }
    function addFadeIn(durationOrElement, maybeDuration){
        const duration = typeof durationOrElement === 'number' ? durationOrElement : maybeDuration;
        this._steps.push({type: 'fadeIn', duration});
        return this;
    }
    function addFadeOut(durationOrElement, maybeDuration){
        const duration = typeof durationOrElement === 'number' ? durationOrElement : maybeDuration;
        this._steps.push({type: 'fadeOut', duration});
        return this;
    }
    function addDelay(duration){
        this._steps.push({type: 'delay', duration});
        return this;
    }

    async function play(element, cycled = false) {
        const step = this._steps.shift();
        const initialState = {
            hadShowClass: element.classList.contains('show'),
            hadHideClass: element.classList.contains('hide'),
            transitionDuration: element.style.transitionDuration,
            transform: element.style.transform,
        };
        if (step) {
            if (step.type === "move"){
                element.style.transitionDuration = `${step.duration}ms`;
                element.style.transform = getTransform(step.translation, null);
            }
            if (step.type === "scale"){
                element.style.transitionDuration = `${step.duration}ms`;
                element.style.transform = getTransform(null, step.ratio);
            }
            if (step.type === "fadeIn"){
                element.style.transitionDuration = `${step.duration}ms`;
                element.classList.remove('hide');
                element.classList.add('show');
            }
            if (step.type === "fadeOut"){ 
                element.style.transitionDuration = `${step.duration}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            }
            if (step.type === "delay"){
                await new Promise(resolve => setTimeout(resolve, step.duration));
            }
        }
        const resetAnim = () => {

                resetMoveAndScale(element);

                element.classList.remove('show');
                element.classList.remove('hide');

                if (initialState.hadHideClass && !initialState.hadShowClass) {
                    resetFadeIn(element);
                } else if (initialState.hadShowClass && !initialState.hadHideClass) {
                    resetFadeOut(element);
                } else {
                    if (initialState.hadShowClass) {
                        element.classList.add('show');
                    }
                    if (initialState.hadHideClass) {
                        element.classList.add('hide');
                    }
                }

                element.style.transitionDuration = initialState.transitionDuration;
                element.style.transform = initialState.transform;
        };
        return {
            reset() {
                resetAnim();
            }
        }


    }

    function buildHandler() {
        const steps = this._steps.map(step => ({
            ...step,
            translation: step.translation ? {...step.translation} : step.translation,
        }));

        return function () {
            const element = this;
            let delay = 0;

            steps.forEach((step) => {
                if (step.type === 'delay') {
                    delay += step.duration;
                    return;
                }

                setTimeout(() => {
                    const animation = animaster();
                    if (step.type === 'move') {
                        animation.addMove(step.duration, step.translation).play(element);
                    }
                    if (step.type === 'scale') {
                        animation.addScale(step.duration, step.ratio).play(element);
                    }
                    if (step.type === 'fadeIn') {
                        animation.addFadeIn(step.duration).play(element);
                    }
                    if (step.type === 'fadeOut') {
                        animation.addFadeOut(step.duration).play(element);
                    }
                }, delay);

                delay += step.duration;
            });
        };
    }

    return animaster;

}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */


/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */


function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
