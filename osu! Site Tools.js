// ==UserScript==
// @name         osu! Site Tools
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds useful tool links to osu! website with improved UI
// @author       Izunamori
// @match        https://osu.ppy.sh/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        tools: [
            {
                name: 'ImgBB',
                url: 'https://imgbb.com/'
            },
            {
                name: 'Osu!pps',
                url: 'https://osu-pps.com/#/osu/maps'
            },
            {
                name: 'O!rdr',
                url: 'https://ordr.issou.best/'
            },
            {
                name: 'Osuck skins',
                url: 'https://skins.osuck.net/'
            },
            {
                name: 'Mutualify',
                url: 'https://mutualify.stanr.info/'
            },
            {
                name: 'Osekai',
                url: 'https://inex.osekai.net/medals/'
            },
            {
                name: 'Alpha osu!',
                url: 'https://alphaosu.keytoix.vip/'
            },
            {
                name: 'PP Rankings',
                url: 'https://pp.huismetbenen.nl/rankings/players/live'
            }
        ],
        autoCollapseDelay: 30000 // 30 секунд
    };

    let autoCollapseTimer = null;

    // Сворачиваем панель при перезагрузке/закрытии страницы
    window.addEventListener('beforeunload', () => {
        saveState(true);
    });

    function init() {
        if (document.body) {
            insertTools();
        } else {
            requestAnimationFrame(init);
        }
    }

    init();

    const observer = new MutationObserver((mutations) => {
        if (!document.querySelector('.osu-tools-container')) {
            insertTools();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    function saveState(collapsed) {
        localStorage.setItem('osuToolsCollapsed', collapsed);
    }

    function loadState() {
        return localStorage.getItem('osuToolsCollapsed') === 'true';
    }

    function collapsePanel(container) {
        if (!container.classList.contains('collapsed')) {
            container.classList.add('collapsed');
            saveState(true);
        }
    }

    function startAutoCollapseTimer(container) {
        clearTimeout(autoCollapseTimer);
        autoCollapseTimer = setTimeout(() => {
            collapsePanel(container);
        }, CONFIG.autoCollapseDelay);
    }

    function handleClickOutside(event, container) {
        if (!container.contains(event.target)) {
            collapsePanel(container);
        }
    }

    function insertTools() {
        if (document.querySelector('.osu-tools-container')) return;

        const style = `
            .osu-tools-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                flex-direction: column;
                gap: 7px;
                z-index: 9999;
                font-family: var(--font-default);
                background: rgba(0, 0, 0, 0.5);
                padding: 10px;
                border-radius: 15px;
                transition: all 0.3s ease;
                max-height: 80vh;
                overflow-y: auto;
                min-width: 140px;
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
            }

            body[data-forum-page] .osu-tools-container {
                bottom: 70px;
            }

            .osu-tools-container.collapsed {
                min-width: unset;
                padding: 8px;
            }

            .osu-tools-container.collapsed .osu-tool-btn {
                display: none;
            }

            .osu-tools-container:not(.collapsed) .osu-tools-toggle {
                display: none;
            }

            .osu-tools-toggle {
                width: 35px;
                height: 35px;
                border: none;
                background: var(--menu-bg-color);
                cursor: pointer;
                padding: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 5px;
                transition: transform 0.3s ease;
                border-radius: 12px;
                margin: 0 auto;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .toggle-line {
                width: 18px;
                height: 2px;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 1px;
            }

            .osu-tools-toggle:hover {
                transform: scale(1.1);
                background: var(--menu-bg-hover);
            }

            .osu-tools-toggle:hover .toggle-line {
                background-color: rgba(255, 255, 255, 0.2);
            }

            .osu-tool-btn {
                padding: 8px 16px;
                background: var(--menu-bg-color);
                color: var(--menu-text-color);
                text-decoration: none;
                border-radius: 50px;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                backdrop-filter: blur(5px);
                border: 2px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                white-space: nowrap;
                text-align: center;
                width: 140px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
                transform: scale(1);
                box-sizing: border-box;
                backface-visibility: hidden;
                transform-style: preserve-3d;
                will-change: transform, opacity, box-shadow;
            }

            .osu-tool-btn + .osu-tool-btn {
                margin-top: 0;
            }

            .osu-tool-btn,
            .osu-tool-btn:link,
            .osu-tool-btn:visited,
            .osu-tool-btn:hover,
            .osu-tool-btn:active {
                text-decoration: none;
                color: var(--menu-text-color);
            }

            .osu-tool-btn:hover {
                transform: scale(1.1);
                opacity: 1;
                background: var(--menu-bg-hover);
                border-color: rgba(255, 255, 255, 0.3);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                z-index: 1;
            }

            @media (max-width: 768px) {
                .osu-tools-container {
                    bottom: 10px;
                    right: 10px;
                }

                .osu-tool-btn {
                    padding: 6px 12px;
                    font-size: 12px;
                    width: 140px;
                }
            }

            .osu-tools-container::-webkit-scrollbar {
                width: 6px;
            }

            .osu-tools-container::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 3px;
            }

            .osu-tools-container::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 3px;
            }

            .osu-tools-container::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5);
            }
        `;

        if (!document.getElementById('osu-tools-style')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'osu-tools-style';
            styleSheet.textContent = style;
            document.head.appendChild(styleSheet);
        }

        const toolsContainer = document.createElement('div');
        toolsContainer.className = 'osu-tools-container collapsed';

        // Проверяем URL и добавляем атрибут для страниц форума
        if (window.location.href.startsWith('https://osu.ppy.sh/community/forums/topics/')) {
            document.body.setAttribute('data-forum-page', '');
        }

        // Добавляем обработчик клика вне панели
        document.addEventListener('click', (e) => handleClickOutside(e, toolsContainer));

        const toggleButton = document.createElement('button');
        toggleButton.className = 'osu-tools-toggle';
        // Создаем три полоски
        for (let i = 0; i < 3; i++) {
            const line = document.createElement('span');
            line.className = 'toggle-line';
            toggleButton.appendChild(line);
        }

        // Обработчики наведения для контейнера и кнопки
        const expandPanel = () => {
            toolsContainer.classList.remove('collapsed');
            saveState(false);
        };

        toggleButton.addEventListener('mouseenter', expandPanel);
        toolsContainer.addEventListener('mouseenter', () => {
            clearTimeout(autoCollapseTimer);
            expandPanel();
        });

        toolsContainer.addEventListener('mouseleave', () => {
            collapsePanel(toolsContainer);
        });

        toolsContainer.appendChild(toggleButton);

        CONFIG.tools.forEach((tool, index) => {
            const button = document.createElement('a');
            button.className = 'osu-tool-btn';
            button.href = tool.url;
            button.target = '_blank';
            button.rel = 'noopener noreferrer';
            button.textContent = tool.name;
            button.style.animationDelay = `${index * 0.05}s`;

            // Добавляем обработчики наведения
            button.addEventListener('mouseenter', () => {
                const buttons = toolsContainer.querySelectorAll('.osu-tool-btn');
                const currentIndex = Array.from(buttons).indexOf(button);

                // Анимация для предыдущих кнопок
                if (currentIndex >= 1) buttons[currentIndex - 1].style.transform = 'scale(1.02)';
                if (currentIndex >= 2) buttons[currentIndex - 2].style.transform = 'scale(1.01)';

                // Анимация для следующих кнопок
                if (currentIndex < buttons.length - 1) buttons[currentIndex + 1].style.transform = 'scale(1.02)';
                if (currentIndex < buttons.length - 2) buttons[currentIndex + 2].style.transform = 'scale(1.01)';
            });

            button.addEventListener('mouseleave', () => {
                const buttons = toolsContainer.querySelectorAll('.osu-tool-btn');
                buttons.forEach(btn => {
                    if (btn !== button) btn.style.transform = '';
                });
            });

            // Добавляем сворачивание при клике на кнопку
            button.addEventListener('click', () => {
                setTimeout(() => collapsePanel(toolsContainer), 100);
            });

            toolsContainer.appendChild(button);
        });

        document.body.appendChild(toolsContainer);
    }
})();