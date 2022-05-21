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
            <span class="open-btn" on:click="{openNav}">&#9776;</span>
        </div>
        <hr />
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
                            <h3
                                class="chat-body-messages-item-content-header-name"
                            >
                                Kurizu
                            </h3>
                        </div>
                        <div class="chat-body-messages-item-content-body">
                            <p>
                                Welcome to my page! This website is basically a
                                clone of how discord application looks ! <br />
                                Currently the css for mobile view is broken and so
                                is for different pc sizes ! <br />
                                I am working on it and will update you soon !
                                <br />
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
                            <h3
                                class="chat-body-messages-item-content-header-name"
                            >
                                Kurizu
                            </h3>
                        </div>
                        <div class="chat-body-messages-item-content-body">
                            <p />
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
        background-color: #2a2c2e;
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

    .open-btn {
        position: absolute;
        top: 1.5%;
        left: 95%;
        font-size: 25px;
        cursor: pointer;
        color: orangered;
        /* display: none; */
    }

    .chat-body {
        position: absolute;
        width: 100%;
        height: 93%;
        background-color: #313233;
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

    @media screen and (max-width: 1500px) {
        .mainarea {
            position: absolute;
            width: 100%;
            height: 100%;
            /* text-align: left; */
            margin-left: 55px;
            background-color: #2a2c2e;
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

        .open-btn {
            position: absolute;
            top: 1.7%;
            left: 80%;
            font-size: 20px;
            cursor: pointer;
            color: orangered;
            /* display: block; */
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
