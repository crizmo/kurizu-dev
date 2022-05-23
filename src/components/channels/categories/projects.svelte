<script>
</script>

<main>
    <div class="channels">
        <div class="categories">
            <details class="projects" open>
                <summary>Projects</summary>
                <hr width="50%">
                <div class="channels-list">
                    <button class="channelbtn">
                        <a class="anyanime-cn" href="/anyanime"># AnyAnime</a>
                    </button>
                    <button class="channelbtn">
                        <a class="elina-cn" href="/elina"># Elina-dev</a>
                    </button>
                    <button class="channelbtn">
                        <a class="stream-savers-cn" href="/stream-savers"># Stream-Savers</a>
                    </button>
                    <button class="channelbtn">
                        <a class="pixit-cn" href="/pixit"># Pixit</a>
                    </button>
                </div>
            </details>
        </div>
    </div>
</main>

<style>

    .channels-list {
        margin-top: 0px;
        margin-left: 10px;
    }

    .channelbtn {
        background-color: #2f3136;
        color: rgb(255, 255, 255);
        border-radius: 10px;
        width: 100%;
        text-align: left;
        border: none;
        outline: none;
        cursor: pointer;
    }

    .channels-list a {
        color: rgb(158, 158, 158);
        text-decoration: none;
    }

    .channels-list a:hover {
        color: rgb(255, 255, 255);
        text-decoration: none;
    }
    
    summary {
        display: block;
    }

    summary::after {
        margin-left: 1ch;
        display: inline-block;
        transition: 0.2s;
        content: "\203A"; /* chevron */
    }

    details[open] summary::after {
        transform: rotate(90deg);
    }

    .anyanime-cn:hover {
        background: rgb(104, 104, 104) none repeat scroll 0 0;
        border-right: 5px none white;
        box-sizing: border-box;
        display: block;
        border-radius: 3px;
        padding: 3px;
        color: rgb(255, 255, 255);
    }

    .elina-cn:hover {
        background: rgb(104, 104, 104) none repeat scroll 0 0;
        border-right: 5px none white;
        box-sizing: border-box;
        display: block;
        border-radius: 3px;
        padding: 3px;
        color: rgb(255, 255, 255);
    }

    .stream-savers-cn:hover {
        background: rgb(104, 104, 104) none repeat scroll 0 0;
        border-right: 5px none white;
        box-sizing: border-box;
        display: block;
        border-radius: 3px;
        padding: 3px;
        color: rgb(255, 255, 255);
    }

    .pixit-cn:hover {
        background: rgb(104, 104, 104) none repeat scroll 0 0;
        border-right: 5px none white;
        box-sizing: border-box;
        display: block;
        border-radius: 3px;
        padding: 3px;
        color: rgb(255, 255, 255);
    }
</style>
