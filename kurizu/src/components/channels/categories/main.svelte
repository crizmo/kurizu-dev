<script>
</script>

<main>
    <div class="channels">
        <div class="categories">
            <details class="home" open>
                <summary>Home</summary>
                <hr width="50%">
                <div class="channels-list">
                    <button class="channelbtn">
                        <a class="home-cn" href="/"># Home</a>
                    </button>
                    <button class="channelbtn">
                        <a class="about-cn" href="/about"># About me</a>
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

    .home-cn,
    .about-cn {
        color: rgb(158, 158, 158);
        border-right: 5px none white;
        box-sizing: border-box;
        display: block;
        border-radius: 3px;
        padding: 3px;
    }

    .home-cn:hover,
    .about-cn:hover {
        background: #232529;
        color: rgb(255, 255, 255);
        border-right: 5px none white;
        box-sizing: border-box;
        display: block;
        border-radius: 3px;
        padding: 3px;
    }
</style>
