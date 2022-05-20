<script>
    const serverWidth = "50px";
</script>

<main>
    <div class="mainarea">
        <div class="top-nav">
            <h3 class="channel-name"># AnyAnime</h3>
            <div class="vl" />
            <p class="channel-info">Anyanime Npm package + AnyAnime API</p>
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
                                AnyAnime is a NPM package that helps you get random anime pfp / images on use . <br>
                                It can be used in a discord bot or on a website or anywhere else.  <br>
                                <br>
                                To add more flexibility to the package i later made a API similar to the NPM package <br>
                                I would appreciate contributions to the API or the Npm package <br> <br>
                                Here's a link to the Npm package : <br>
                                <a href="https://www.npmjs.com/package/anyanime">NPM</a>
                                <a href="https://github.com/crizmo/AnyAnime">Github</a>
                                <br> <br>
                                Here's a link to the API : <br>
                                <a href="https://rapidapi.com/Kurizu/api/any-anime/">API</a>
                                <a href="https://github.com/crizmo/AnyAnime_api">Github</a>
                                <br> <br>
                                Website explaning the pkg + api :- <a href="https://anyanime-npm.netlify.app/">AnyAnime Docs</a>
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
                                Basic functions of the package : <br> <br>
                                <img src="https://cdn.discordapp.com/attachments/970974362184343582/977082767978430544/Anyanime.png" alt="homepgimg" height="300px" width="auto" style="border-radius: 10px;">
                                <br>
                                Thanks for reading! If you have any questions or suggestions feel free to contact me on discord <br>
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
        background-color: #2a2c2e;
        top: 0%;
        color: rgb(255, 255, 255);
        z-index: 1;
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
        text-align: left;
        margin-left: 80px;
    }

    .chat-body-messages-item-content-body {
        color: rgb(255, 255, 255);
        z-index: 1;
        text-align: left;
        margin-left: 80px;
        margin-right: 500px;
    }

</style>
