<script>
    const serverWidth = "50px";

    function openNav() {
        document.getElementById("mySidenav").style.width = null;
    }

</script>

<main>
    <div class="mainarea">
        <div class="top-nav">
            <h3 class="channel-name"># Kurizu's Page</h3>
            <div class="vl" />
            <p class="channel-info">Kurizu Home page</p>
            <!-- <span class="open-btn" on:click="{openNav}">&#9776;</span> -->
        </div>
        <hr />
        <div class="chat-body">
            <div class="chat-body-messages">
                <div class="chat-body-messages-item">
                    <div class="chat-body-messages-item-avatar">
                        <img
                            src="https://cdn.discordapp.com/avatars/784141856426033233/2b71440eb154c1c2897e956f1f0da7b7.webp"
                            alt=""
                            width={serverWidth}
                        />
                    </div>
                    <div class="chat-body-messages-item-content">
                        <div class="chat-body-messages-item-content-header">
                            <h3
                                class="chat-body-messages-item-content-header-name"
                            >
                                Kurizu
                            </h3>
                        </div>
                        <div class="chat-body-messages-item-content-body">
                            <p>
                                Oi mate ! I'm Kurizu and this is my website showcasing my projects and links to my social media accounts ! <br>
                                As you might have already noticed this website looks similar to the discord application and thats what i was aiming for. <br> <br>
                                It is completely made using svelte ! <br>
                                The site has a lot of unfinished features but we will get there soon ! <br>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="chat-body-messages-item">
                    <div class="chat-body-messages-item-avatar">
                        <img
                        src="https://cdn.discordapp.com/avatars/784141856426033233/2b71440eb154c1c2897e956f1f0da7b7.webp"
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
                                Oh btw ! <br>
                                Click on the channels if u want to see some of my projects or check out my social media accounts ! <br> <br>
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/970974282681307187/977618419920822302/projects.png" alt="projetc-channels" height="200px" width="auto"> <br> <br>
                                I hope you like it and if you have any suggestions or feedback feel free to contact me on discord / instagram / github !   <br>
                                Thank you for checking out my website ! 
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>

    /* main a {
        color: #38b9ec;
    } */

    .mainarea {
        position: absolute;
        width: 81.3%;
        height: 100%;
        /* text-align: left; */
        margin-left: 352px;
        background-color: #282a2e;
        top: 0%;
        color: rgb(255, 255, 255);
        z-index: 2;
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

    .chat-body-messages-item-avatar {
        margin-left: 20px;
        position: absolute;
        overflow: hidden;
        width: 50px;
        height: 50px;
        border-radius: 50%;
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

    @media screen and (max-width: 1910px) {
        .mainarea {
            position: absolute;
            width: 81.3%;
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
            max-width: 150px;
        }

        .chat-body-messages-item-avatar img {
            width: 45px;
            height: 45px;
            border-radius: 50%;
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
