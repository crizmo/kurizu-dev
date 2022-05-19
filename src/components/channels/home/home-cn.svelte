<script>
    import Projects from '../categories/projects.svelte'
    import Links from '../categories/links.svelte'
</script>

<main>
    <div class="channels">
        <div>
            <div class="server-template-icon">
                <img
                    src="https://cdn-cfmok.nitrocdn.com/juJsjTwdTqWjkJBaBrLnvLeovPsDevAD/assets/static/optimized/rev-b5a7330/wp-content/uploads/4K-Anime-Wallpapers-2020.jpg"
                    alt=""
                    width="100%"
                    height="100%"
                />
                <h3 class="server-name-on-template">Kurizu</h3>
            </div>
            <hr />
        </div>
        <div class="categories">
            <details class="home" open>
                <summary>Home</summary>
                <hr width="50%" />
                <div class="channels-list">
                    <button class="channelbtn">
                        <a class="home-cn" href="/"># Home page </a>
                    </button>
                    <button class="channelbtn">
                        <a class="about-cn" href="/about"># About me</a>
                    </button>
                </div>
            </details>
            <br />
            <Projects />
            <br />
            <Links />
        </div>
    </div>
</main>

<style>
    .channels {
        position: absolute;
        width: 15%;
        height: 100%;
        /* text-align: left; */
        margin-left: 65px;
        background-color: #2c2d30;
        top: 0%;
        color: rgb(255, 255, 255);
        z-index: 0;
        /* overflow-x: hidden; */
    }

    .server-template-icon {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #2c2d30;
        border-radius: 10px;
        overflow: hidden;
    }

    .server-name-on-template {
        position: absolute;
        top: 3px;
        left: 20px;
    }

    .categories {
        text-align: left;
        margin-left: 10px;
    }

    .channels-list {
        margin-top: 0px;
        margin-left: 10px;
    }

    .channelbtn {
        background-color: #2c2d30;
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

    .home-cn {
        background: rgb(104, 104, 104) none repeat scroll 0 0;
        border-right: 5px none white;
        box-sizing: border-box;
        display: block;
        border-radius: 3px;
        padding: 5px;
    }

    .about-cn:hover {
        background: rgb(104, 104, 104) none repeat scroll 0 0;
        border-right: 5px none white;
        box-sizing: border-box;
        display: block;
        border-radius: 3px;
        padding: 3px;
        color: rgb(255, 255, 255);
    }
</style>
