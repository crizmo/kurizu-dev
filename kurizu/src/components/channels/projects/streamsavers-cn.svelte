<script>
    import Projects from '../categories/projects.svelte'
    import Links from '../categories/other.svelte'
    import Main from '../categories/main.svelte';

    export function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("mySidenav").style.transition = "width 0.5s";

        document.querySelector(".categories").style.opacity = "0";
    }
    
    export function openNav() {
        document.getElementById("mySidenav").style.width = null;
        document.getElementById("mySidenav").style.transition = "width 0.5s";

        document.querySelector(".categories").style.opacity = "1";
    }
    import { swipe } from "svelte-gestures";
    let direction;

    function handler(event) {
        direction = event.detail.direction;

        if (window.innerWidth < 1500) {
            if (direction == "left") {
                closeNav();
            } else if (direction == "right") {
                openNav();
            }
        }
    }
</script>

<main>
    <script src="https://kit.fontawesome.com/8dc570c5d4.js" crossorigin="anonymous"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <div class="channels" id="mySidenav" use:swipe={{ timeframe: 300, minSwipeDistance: 0.1 }} on:swipe={handler}>
        <div>
            <div class="server-template-icon">
                <img
                    src="https://cdn.discordapp.com/attachments/977949070893125632/1010593053410599064/banner.png"
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
        overflow: scroll;
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

    .stream-savers-cn {
        background: #232529;
        color: rgb(255, 255, 255);
    }

    .image2url-cn,
    .anyanime-cn,
    .elina-cn,
    .pixit-cn,
    .breeze-cn,
    .minikey-cn,
    .type3d-cn,
    .timely-cn {
        color: rgb(158, 158, 158);
    }

    .image2url-cn,
    .anyanime-cn,
    .elina-cn,
    .stream-savers-cn,
    .pixit-cn,
    .breeze-cn,
    .minikey-cn,
    .type3d-cn,
    .timely-cn {
        border-right: 5px none white;
        box-sizing: border-box;
        display: block;
        border-radius: 3px;
        padding: 3px;
    }

    .image2url-cn:hover,
    .anyanime-cn:hover ,    
    .elina-cn:hover ,
    .pixit-cn:hover,
    .breeze-cn:hover,
    .minikey-cn:hover,
    .type3d-cn:hover,
    .timely-cn:hover {
        background: #232529;
        color: rgb(255, 255, 255);
    }

    @media screen and (max-width: 1900px) {
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

    @media screen and (max-width: 1700px) {
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
