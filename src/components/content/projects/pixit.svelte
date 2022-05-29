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
            <h3 class="channel-name"># Pixit</h3>
            <div class="vl" />
            <p class="channel-info">Pixel art website</p>
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
                                Pixit is a simple pixel art website made using ejs and nodejs. <br>
                                Made it as a side project cause i was bored <br>
                                Check it out if u want : <a href="https://pixit.kurizu.repl.co/">https://pixit.kurizu.repl.co/</a>
                                <br><br>
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/970974497941368873/977193997267271690/unknown.png" alt="homepgimg" height="300px" width="auto" style="border-radius: 10px;">
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
                                Pixet project links : <br>
                                <a href="https://github.com/crizmo/Pixit">Github</a> <br>
                                <a href="https://replit.com/@kurizu/pixit#index.js">Replit</a> <br>
                                <a href="https://pixit.kurizu.repl.co/">Website</a> <br>
                                <br> <br>
                                If you want to see some of my other projects, check out my github page : <a href="https://github.com/crizmo">Github</a>
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
