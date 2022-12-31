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
                        <a class="image2url-cn" href="/image2url"># Image2url</a>
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
                    <button class="channelbtn">
                        <a class="breeze-cn" href="/breeze"># Breeze</a>
                    </button>
                    <button class="channelbtn">
                        <a class="minikey-cn" href="/minikey"># Minikey</a>
                    </button>
                    <button class="channelbtn">
                        <a class="type3d-cn" href="/type3d"># Type3D</a>
                    </button>
                    <button class="channelbtn">
                        <a class="timely-cn" href="/timely"># Timely</a>
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

    /* .channels-list a {
        color: rgb(158, 158, 158);
        text-decoration: none;
    } */

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

    .anyanime-cn,
    .image2url-cn,
    .elina-cn,
    .stream-savers-cn,
    .pixit-cn,
    .breeze-cn,
    .minikey-cn,
    .type3d-cn,
    .timely-cn {
        color: rgb(158, 158, 158);
        border-right: 5px none white;
        box-sizing: border-box;
        display: block;
        border-radius: 3px;
        padding: 3px;
    }
    
    .anyanime-cn:hover,
    .image2url-cn:hover,
    .elina-cn:hover,
    .stream-savers-cn:hover,
    .pixit-cn:hover,
    .breeze-cn:hover,
    .minikey-cn:hover,
    .type3d-cn:hover,
    .timely-cn:hover {
        background: #232529;
        color: rgb(255, 255, 255);
        border-right: 5px none white;
        box-sizing: border-box;
        display: block;
        border-radius: 3px;
        padding: 3px;
    }
    
</style>
