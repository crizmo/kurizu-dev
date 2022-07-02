<script>
    import Projects from '../categories/projects.svelte'
    import Links from '../categories/other.svelte'
    import Main from '../categories/main.svelte';

    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
    }
</script>

<main>
    <script src="https://kit.fontawesome.com/8dc570c5d4.js" crossorigin="anonymous"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <div class="channels" id="mySidenav">
        <div>
            <div class="server-template-icon">
                <img
                    src="https://cdn-cfmok.nitrocdn.com/juJsjTwdTqWjkJBaBrLnvLeovPsDevAD/assets/static/optimized/rev-b5a7330/wp-content/uploads/4K-Anime-Wallpapers-2020.jpg"
                    alt=""
                    width="100%"
                    height="100%"
                />
                <h3 class="server-name-on-template">Kurizu</h3>
                <span class="close-btn" on:click="{closeNav}">&times;</span>
            </div>
            <hr />
        </div>
        <div class="categories">
            <Main />
            <br />
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
                    <button class="channelbtn">
                        <a class="breeze-cn" href="/breeze"># Breeze</a>
                    </button>
                </div>
            </details>
            <br />
            <Links />
        </div>
    </div>
</main>

<style>

    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-thumb {
        background: #888; 
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }

    .channels {
        position: absolute;
        width: 14.1%;
        height: 100%;
        /* text-align: left; */
        margin-left: 82px;
        background-color: #2f3136;
        top: 0%;
        color: rgb(255, 255, 255);
        z-index: 0;
    }

    .server-template-icon {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #2f3136;
        border-radius: 10px;
        overflow: hidden;
    }

    .server-name-on-template {
        position: absolute;
        top: 3px;
        left: 20px;
    }

    .close-btn {
        /* position: absolute;
        top: 5%;
        left: 80%;
        font-size: 40px;
        cursor: pointer;
        color: orangered; */
        display: none;
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

    .anyanime-cn {
        background: rgb(104, 104, 104) none repeat scroll 0 0;
        border-right: 5px none white;
        box-sizing: border-box;
        display: block;
        border-radius: 3px;
        padding: 5px;
    }

    .elina-cn:hover ,
    .stream-savers-cn:hover ,
    .pixit-cn:hover,
    .breeze-cn:hover {
        background: rgb(104, 104, 104) none repeat scroll 0 0;
        border-right: 5px none white;
        box-sizing: border-box;
        display: block;
        border-radius: 3px;
        padding: 3px;
        color: rgb(255, 255, 255);
    }

    @media screen and (max-width: 1910px) {
        .channels {
            position: absolute;
            width: 15.7%;
            height: 100%;
            margin-left: 82px;
            background-color: #2f3136;
            top: 0%;
            color: rgb(255, 255, 255);
            z-index: 1;
            overflow: scroll;

            font-size: small;
            /* display: none; */
        }

        .channelbtn {
            width: 75%;
        }
    }

    @media screen and (max-width: 1500px) {
        .channels {
            position: absolute;
            width: 20%;
            height: 100%;
            margin-left: 57px;
            background-color: #2f3136;
            top: 0%;
            color: rgb(255, 255, 255);
            z-index: 1;
            overflow: scroll;

            font-size: small;
            /* display: none; */
        }

        .channelbtn {
            width: 100%;
        }

        .close-btn {
            position: absolute;
            top: 5%;
            left: 80%;
            font-size: 35px;
            cursor: pointer;
            color: orangered;
            display: block;
        }


    }

    @media screen and (max-width: 1000px) {
        .channels {
            position: absolute;
            width: 40%;
            height: 100%;
            margin-left: 57px;
            background-color: #2f3136;
            top: 0%;
            color: rgb(255, 255, 255);
            z-index: 1;
            overflow: scroll;

            font-size: small;
            /* display: none; */
        }

        .channelbtn {
            width: 100%;
        }

        .close-btn {
            position: absolute;
            top: 5%;
            left: 80%;
            font-size: 35px;
            cursor: pointer;
            color: orangered;
            display: block;
        }
    }
</style>
