// ==UserScript==
// @name         osu! Site Tools
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds useful tool links to osu! website
// @author       Izunamori
// @match        https://osu.ppy.sh/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Create and insert tools as soon as possible
    function init() {
        if (document.body) {
            insertTools();
        } else {
            requestAnimationFrame(init);
        }
    }

    init();

    // Create a MutationObserver to handle dynamic page changes
    const observer = new MutationObserver((mutations) => {
        if (!document.querySelector('.osu-tools-container')) {
            insertTools();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    function insertTools() {
        if (document.querySelector('.osu-tools-container')) return;

        const tools = [
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
        ];

        const style = `
            .osu-tools-container {
                position: fixed;
                bottom: 20px;
                left: 20px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                z-index: 9999;
                font-family: var(--font-default);
            }

            .osu-tool-btn {
                padding: 8px 16px;
                background: var(--menu-bg-color);
                color: var(--menu-text-color);
                text-decoration: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s ease;
                backdrop-filter: blur(5px);
                border: 2px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                white-space: nowrap;
                text-align: center;
                width: 120px;
                display: block;
            }

            .osu-tool-btn,
            .osu-tool-btn:link,
            .osu-tool-btn:visited,
            .osu-tool-btn:hover,
            .osu-tool-btn:active {
                text-decoration: none;
                color: var(--menu-text-color);
            }

            .osu-tool-btn:hover,
            .osu-tool-btn:active {
                transform: translateY(-1px);
                background: var(--menu-bg-hover);
                border-color: rgba(255, 255, 255, 0.2);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }

            @media (max-width: 768px) {
                .osu-tools-container {
                    bottom: 10px;
                    left: 10px;
                }

                .osu-tool-btn {
                    padding: 6px 12px;
                    font-size: 12px;
                }
            }
        `;

        // Add styles
        if (!document.getElementById('osu-tools-style')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'osu-tools-style';
            styleSheet.textContent = style;
            document.head.appendChild(styleSheet);
        }

        // Create tools container
        const toolsContainer = document.createElement('div');
        toolsContainer.className = 'osu-tools-container';

        // Create buttons
        tools.forEach(tool => {
            const button = document.createElement('a');
            button.className = 'osu-tool-btn';
            button.href = tool.url;
            button.target = '_blank';
            button.rel = 'noopener noreferrer';
            button.textContent = tool.name;
            toolsContainer.appendChild(button);
        });

        // Insert the tools container into the body
        document.body.appendChild(toolsContainer);
    }
})();