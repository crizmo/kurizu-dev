<script>
    const serverWidth = "50px";
    import User from '../../-comp/user.svelte'; 

    import { closeNav, openNav } from "../../channels/home/home-cn.svelte";

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
    <div class="mainarea" use:swipe={{ timeframe: 500, minSwipeDistance: 0.1 }} on:swipe={handler}>
        <div class="top-nav">
            <h3 class="channel-name"># Breeze</h3>
            <div class="vl" />
            <p class="channel-info">Breeze api + website</p>
            <!-- <span class="open-btn" on:click="{openNav}">&#9776;</span> -->
        </div>
        <hr>
        <div class="chat-body">
            <div class="chat-body-messages">
                <div class="chat-body-messages-item">
                    <User />
                    <div class="chat-body-messages-item-content">
                        <div class="chat-body-messages-item-content-header">
                            <h3 class="chat-body-messages-item-content-header-name">Kurizu</h3>
                        </div>
                        <div class="chat-body-messages-item-content-body">
                            <p>
                                Breeze helps you display your discord activity as a epik card which you can use anywhere you want.
                                <br><br>
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/988140784807202886/992759894627340298/breeze-stats.png" alt="homepgimg" height="300px" width="auto" style="border-radius: 10px;">
                                <img class="api-img" src="https://api-breeze.herokuapp.com/api/card/784141856426033233?about=oi" alt="api" />
                                <br>
                                Breeze also offers and api for you to use <br>
                                So you can use the cards in your github repo or anywhere you want.
                                <br>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="chat-body-messages-item">
                    <User />
                    <div class="chat-body-messages-item-content">
                        <div class="chat-body-messages-item-content-header">
                            <h3 class="chat-body-messages-item-content-header-name">Kurizu</h3>
                        </div>
                        <div class="chat-body-messages-item-content-body">
                            <p>
                                Breeze was made in roughly 2 weeks <span style="color:yellow">[</span> would have taken less time if i didn't have college lol <span style="color:yellow">]</span> <br>
                                Backend of breeze is made using node.js and express while the frontend is made using react <br>
                                I used socket io for the realtime updates on the website <br> <br>
                                I would appreciate any feedback on the website or the api <br>
                                Also feel free to contribute to the project if u got any better code / idea in mind ! <br> <br>

                                GitHub: <a href="https://github.com/crizmo/breeze" alt="breeze github" target="_blank">Breeze</a> <br>
                                Website: <a href="https://breeze-stats.netlify.app" alt="breeze website" target="_blank">Breeze</a> <br>
                                API: <a href="https://api-breeze.herokuapp.com/" alt="breeze api" target="_blank">Breeze API</a> <br>
                                <br>
                                Thanks for reading ! 
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>

    main a {
        color: #38b9ec;
    }

    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-thumb {
        background: #888; 
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }
    
    .mainarea {
        position: absolute;
        width: 81.25%;
        height: 100%;
        /* text-align: left; */
        margin-left: 352px;
        background-color: #282a2e;
        top: 0%;
        color: rgb(255, 255, 255);
        z-index: 2;
        /* overflow: hidden; */
        overflow: fixed;
    }

    .top-nav {
        align-items: left;
        text-align: left;
        margin-left: 20px;
        margin-top: 60px;
        background-color: aqua;
    }

    .vl {
        border-left: 2px solid gray;
        height: 25px;
        position: absolute;
        left: 11%;
        top: 1.7%;
    }

    .channel-name {
        top: 0%;
        left: 1%;
        position: absolute;
    }

    .channel-info {
        position: absolute;
        top: 0.5%;
        left: 14%;
    }

    /* .open-btn {
        display: none;
    } */

    .chat-body {
        position: absolute;
        width: 100%;
        height: 93%;
        background-color: #36393f;
        top: 6.2%;
        color: rgb(255, 255, 255);
        z-index: 1;
        overflow: scroll;
    }

    .chat-body-messages {
        position: absolute;
        color: rgb(255, 255, 255);
        z-index: 1;
        top: 2%;
    }

    .chat-body-messages-item-content {
        color: rgb(255, 255, 255);
        z-index: 1;
        /* text-align: left;
        margin-left: 80px; */
    }

    .chat-body-messages-item-content-header {
        color: rgb(255, 255, 255);
        z-index: 1;
        text-align: left;
        margin-left: 80px;
    }

    .chat-body-messages-item-content-body {
        color: rgb(255, 255, 255);
        z-index: 1;
        text-align: left;
        margin-left: 80px;
        margin-right: 50px;
    }

    @media screen and (max-width: 1910px) {
        .mainarea {
            position: absolute;
            width: 91.3%;
            height: 100%;
            /* text-align: left; */
            margin-left: 315px;
            top: 0%;
            color: rgb(255, 255, 255);
            z-index: 2;
            overflow: scroll;
        }
    }

    @media screen and (max-width: 1500px) {
        .mainarea {
            position: absolute;
            width: 100%;
            height: 100%;
            /* text-align: left; */
            margin-left: 55px;
            top: 0%;
            color: rgb(255, 255, 255);
            z-index: 0;
            overflow: scroll;

            font-size: small;
        }

        .top-nav {
            align-items: left;
            text-align: left;
            margin-left: 0px;
            margin-top: 60px;
            background-color: aqua;
        }

        .vl {
            border-left: 2px solid gray;
            height: 25px;
            position: absolute;
            left: 23%;
            top: 1.7%;
        }

        .channel-name {
            top: 0%;
            left: 2%;
            position: absolute;
        }

        .channel-info {
            position: absolute;
            top: 0.5%;
            left: 25%;
        }

        /* .open-btn {
            position: absolute;
            top: 1.7%;
            left: 80%;
            font-size: 20px;
            cursor: pointer;
            color: orangered;
            display: block;
        } */

        .msg-img {
            width: 100%;
            height: auto;
            max-width: 300px;
        }

        .api-img {
            width: 50%;
            height: auto;
            max-width: 300px;
        }

        .chat-body-messages-item-content-body {
            color: rgb(255, 255, 255);
            z-index: 1;
            text-align: left;
            margin-left: 80px;
            margin-right: 70px;
        }
    }

</style>
