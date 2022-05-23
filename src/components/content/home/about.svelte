<script>
    const serverWidth = "50px";

    function openNav() {
        document.getElementById("mySidenav").style.width = null;
    }
</script>

<main>
    <div class="mainarea">
        <div class="top-nav">
            <h3 class="channel-name"># About Me</h3>
            <div class="vl" />
            <p class="channel-info">Little about criz</p>
            <span class="open-btn" on:click="{openNav}">&#9776;</span>
        </div>
        <hr>
        <div class="chat-body">
            <div class="chat-body-messages">
                <div class="chat-body-messages-item">
                    <div class="chat-body-messages-item-avatar">
                        <img
                            src="https://media.discordapp.net/attachments/952764969638834228/969830435444097054/Criz.png"
                            alt=""
                            width={serverWidth}
                        />
                    </div>
                    <div class="chat-body-messages-item-content">
                        <div class="chat-body-messages-item-content-header">
                            <h3 class="chat-body-messages-item-content-header-name">Kurizu</h3>
                        </div>
                        <div class="chat-body-messages-item-content-body">
                            <p>
                                Yo ! I'm Kurizu , a average guy who likes to code ! <br> I often end up doing frontend even if i like backend lol <br> <br>
                                Currently learning Node.js and Svelte <br>
                                Give me project ideas ! <br> <br>

                                I like to play retro games and watch anime [ Not really ] <br> 
                                Been playing around with ascii and pixel art for a while <br> <br>

                                I enjoy listening to lofi and chill music <br>
                                Heres a playlist of some of my favourites :- <a href="https://open.spotify.com/playlist/4rO0JccYMK0Y8KqwJXpzHd?si=46f1a2af6bea4cdc">Spotify</a> 
                            </p>
                            <hr>
                            <p>
                                I am proficient with a lot of programming languages such as HTML/CSS , Javascript , Java , C , Python, etc <br>
                                Primarily, I use JS as my main language and I am familiar with technologies such as Node.js, React, Svelte and also with database technologies such as MongoDB, etc.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="chat-body-messages-item">
                    <div class="chat-body-messages-item-avatar">
                        <img
                            src="https://media.discordapp.net/attachments/952764969638834228/969830435444097054/Criz.png"
                            alt=""
                            width={serverWidth}
                        />
                    </div>
                    <div class="chat-body-messages-item-content">
                        <div class="chat-body-messages-item-content-header">
                            <h3 class="chat-body-messages-item-content-header-name">Kurizu</h3>
                        </div>
                        <div class="chat-body-messages-item-content-body">
                            <p>
                                Hi again ! <br>
                                If you want to check out some of my projects click on the channels respectively <br> <br>
                                Thanks for checking out my page ! <br> <br>
                                <img class="msg-img" src="https://images.hdqwalls.com/download/child-of-earth-on-journey-5t-2560x1440.jpg" style="border-radius: 10px;" alt="homepgimg" height="300px" width="auto">
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    .mainarea {
        position: absolute;
        width: 81.3%;
        height: 100%;
        /* text-align: left; */
        margin-left: 352px;
        background-color: #36393f;
        top: 0%;
        color: rgb(255, 255, 255);
        z-index: 2;
        /* overflow: hidden; */
        overflow: scroll;
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

    .open-btn {
        /* position: absolute;
        top: 1.5%;
        left: 95%;
        font-size: 25px;
        cursor: pointer;
        color: orangered; */
        display: none;
    }

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
    
    .chat-body-messages-item-avatar {
        margin-left: 20px;
        position: absolute;
        border-radius: 100px;
        overflow: hidden;
    }

    .chat-body-messages-item-content {
        color: rgb(255, 255, 255);
        z-index: 1;
        /* text-align: left; */
        /* margin-left: 80px;  */
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
        margin-right: 500px;
    }

    @media screen and (max-width: 1500px) {
        .mainarea {
            position: absolute;
            width: 100%;
            height: 100%;
            /* text-align: left; */
            margin-left: 55px;
            background-color: #36393f;
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
            left: 25%;
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
            left: 34%;
        }

        .open-btn {
            position: absolute;
            top: 1.7%;
            left: 80%;
            font-size: 20px;
            cursor: pointer;
            color: orangered;
            display: block;
        }

        .msg-img {
            width: 100%;
            height: auto;
            max-width: 300px;
        }

        .chat-body-messages-item-avatar img {
            width: 45px;
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
