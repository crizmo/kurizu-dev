<script>
    const serverWidth = "50px";
    import User from '../../-comp/user.svelte';

    function openNav() {
        document.getElementById("mySidenav").style.width = null;
    }
</script>

<main>
    <div class="mainarea">
        <div class="top-nav">
            <h3 class="channel-name"># Elina</h3>
            <div class="vl" />
            <p class="channel-info">Elina :- yet another discord bot</p>
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
                                Elina is a multipurpose discord bot made using discord.js ! <br> <br>
                                Elina offers a lot of features, mainly games , genshin stats , chatbot and many more commands. <br>
                                You can find more about it on <a href="https://elina-bot.netlify.app/commands.html">Elina's website</a> <br>
                                <br>
                                Oh here she is ...  <br>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="chat-body-messages-item">
                    <User pfp="https://cdn.discordapp.com/avatars/842397001954230303/557d99168d42b845750241d8d7cd0f5b.webp" />
                    <div class="chat-body-messages-item-content">
                        <div class="chat-body-messages-item-content-header">
                            <h3 class="chat-body-messages-item-content-header-name">Elina</h3>
                        </div>
                        <div class="chat-body-messages-item-content-body">
                            <p>
                                Hi i am Elina ! <br>
                                One more to the millions of multipurpose discord bots on discord. <br>
                                There's nothing too different that i do compared to all the major discord bots out there lol <br> <br>
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/939799133177384993/978893594125561916/commands.png" alt="homepgimg" height="300px" width="auto" style="border-radius: 8px;">
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
                                Oh and elina is open source too ! <br>
                                You can find the source code form links below : <br>
                                <a href="https://github.com/crizmo/Elina-dev" target="_blank">Github</a> <br>
                                <a href="https://elina-bot.netlify.app/" target="_blank">Website</a>

                                <br> <br>
                                The website has all the commands and info you need to know about Elina. <br>
                                Enjoy ! <br> <br>
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/912537423160942593/912537520150020156/elina_info.jpg" alt="homepgimg" height="150px" width="auto" style="border-radius: 8px;">
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

        .chat-body-messages-item-content-body {
            color: rgb(255, 255, 255);
            z-index: 1;
            text-align: left;
            margin-left: 80px;
            margin-right: 70px;
        }
    }

</style>
