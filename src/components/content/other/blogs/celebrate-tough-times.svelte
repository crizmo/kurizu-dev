<script>
    const serverWidth = "50px";
    import User from '../../../-comp/user.svelte';

    import { closeNav, openNav } from "../../../channels/home/home-cn.svelte";

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

    const uncheck = "fas fa-solid fa-square";
    const check = "fas fa-solid fa-check";
    
</script>

<main>
    <script src="https://kit.fontawesome.com/8dc570c5d4.js" crossorigin="anonymous"></script>
    <div class="mainarea" use:swipe={{ timeframe: 500, minSwipeDistance: 0.1 }} on:swipe={handler}>
        <div class="top-nav">
            <h3 class="channel-name"># Yeet</h3>
            <div class="vl" />
            <p class="channel-info">Celebrate though times</p>
            <!-- <span class="open-btn" on:click="{openNav}">&#9776;</span> -->
        </div>
        <hr />
        <div class="chat-body">
            <div class="chat-body-messages">
                <div class="chat-body-messages-item">
                    <User />
                    <div class="chat-body-messages-item-content">
                        <div class="chat-body-messages-item-content-header">
                            <h3
                                class="chat-body-messages-item-content-header-name"
                            >
                                Kurizu
                            </h3>
                        </div>
                        <div class="chat-body-messages-item-content-body">
                            <h4>Oi matey</h4>
                            <p>
                                Remember to enjoy those small irritating things <br>
                                It's the little things that make life worth living <br>
                                It do be fun do give it a try <br>
                                Gonna keep it short :D <br>
                                <br>
                                Just that tbh <br>
                                Enjoy ! <br> <br>
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/977949070893125632/1016670948507783208/cel.png" alt="cel">

                                <a href="/blogs" class="back-btn">Back</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
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

    /* main a {
        color: #38b9ec;
    } */

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
        left: 13%;
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

    /* .chat-body-messages-item-avatar {
        margin-left: 20px;
        position: absolute;
        overflow: hidden;
        width: 50px;
        height: 50px;
        border-radius: 50%;
    } */

    .chat-body-messages-item-content {
        color: rgb(255, 255, 255);
        z-index: 1;
        /* text-align: left;
        margin-left: 80px; */
    }

    .chat-body-messages-item-content-header {
        color: rgb(255, 255, 255);
        z-index: 1;
        /* text-align: left; */
        margin-left: 80px;
    }

    .chat-body-messages-item-content-body {
        color: rgb(255, 255, 255);
        z-index: 1;
        text-align: left;
        margin-left: 80px;
        margin-right: 50px;
    }

    .back-btn {
        position: absolute;
        top: 0%;
        right: 0%;
        margin-right: 20px;
        margin-top: 20px;
        background-color: #5884fc;
        color: white;
        padding: 10px;
        border-radius: 5px;
        text-decoration: none;
    }

    .msg-img {
        width: 100%;
        height: auto;
        max-width: 700px;
        border-radius: 10px;
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

        .back-btn {
            position: absolute;
            top: 0%;
            right: 0%;
            margin-right: 20px;
            margin-top: 20px;
            background-color: #5884fc;
            color: white;
            padding: 10px;
            border-radius: 5px;
            text-decoration: none;
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
            left: 35%;
            top: 1.7%;
        }

        .channel-name {
            top: 0%;
            left: 5%;
            position: absolute;
        }

        .channel-info {
            position: absolute;
            top: 0.5%;
            left: 44%;
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
            max-width: 250px;
        }

        .chat-body-messages-item-content-body {
            color: rgb(255, 255, 255);
            z-index: 1;
            text-align: left;
            margin-left: 80px;
            margin-right: 70px;
        }

        .back-btn {
            position: absolute;
            top: 0%;
            right: 0%;
            margin-right: 90px;
            margin-top: 20px;
            background-color: #5884fc;
            color: white;
            padding: 10px;
            border-radius: 5px;
            text-decoration: none;
        }
    }
</style>
