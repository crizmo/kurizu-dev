<script context="module">

    import Main from '../categories/main.svelte';
    import Projects from "../categories/projects.svelte";
    import Links from "../categories/other.svelte";

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

        if (window.innerWidth) {
            if (direction == "left") {
                closeNav();
            } else if (direction == "right") {
                openNav();
            }
        }
    }
</script>

<main>
    <script
        src="https://kit.fontawesome.com/8dc570c5d4.js"
        crossorigin="anonymous"></script>
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
                <span class="close-btn" on:click={closeNav}>&times;</span>
            </div>
            <hr />
        </div>
        <div class="categories">
            <Main />
            <br />
            <Projects />
            <br />
            <Links />
        </div>
    </div>
</main>

<style>
    ::-webkit-scrollbar {
        width: 2px;
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
        z-index: 3;
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
        position: absolute;
        top: 5%;
        left: 85%;
        font-size: 40px;
        cursor: pointer;
        color: orangered;
        /* display: none; */
    }

    .categories {
        text-align: left;
        margin-left: 10px;
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
            z-index: 3;
            overflow: scroll;

            font-size: small;
            /* display: none; */
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
            z-index: 3;
            overflow: scroll;

            font-size: small;
            /* display: none; */
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
            z-index: 3;
            overflow: scroll;

            font-size: small;
            /* display: none; */
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
