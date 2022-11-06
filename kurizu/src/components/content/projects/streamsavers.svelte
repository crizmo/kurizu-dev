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
            <h3 class="channel-name"># StreamSavers</h3>
            <div class="vl" />
            <p class="channel-info">Yt loop service</p>
            <!-- <span class="open-btn" on:click="{openNav}">&#9776;</span> -->
        </div>
        <hr class="channel-division" />
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
                                Stream Savers is a free, open-source and easy-to-use service to loop stream 24/7 to YouTube <br>
                                Me and my friend <a href="https://coding398.dev/">coding398</a> made the service. <br> <br>

                                Some words from coding398 : <br>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="chat-body-messages-item">
                    <User pfp = "https://cdn.discordapp.com/attachments/977949070893125632/1038727869221843024/coding.jpg"/>
                    <div class="chat-body-messages-item-content">
                        <div class="chat-body-messages-item-content-header">
                            <h3 class="chat-body-messages-item-content-header-name">Coding398</h3>
                        </div>
                        <div class="chat-body-messages-item-content-body">
                            <p>
                                Ohbubble and other services can go to hell, charging people for things that you can do with a simple FFMPEG command. <br>
                                That's why I loved making stream savers and watching people use it.
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
                                Thanks coding <br>

                                Back to me ! <br> 
                                Working on streamsavers was and will be fun cause delivering free service makes us hapi !. <br> <br>
                                Major thanks to replit for the help with the server setup and the hosting. <br>
                                I hope you will enjoy it ! <br><br>

                                Stream Savers Links :- <br>
                                <a href="https://streamsavers.live/">Website</a> <br>
                                <a href="https://github.com/crizmo/Stream-Savers">Github</a> <br> <br>

                                Stream Savers : <br>
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/970974581944885268/980031303967703040/stream-savers.png" alt="homepgimg" height="300px" width="auto" style="border-radius: 10px;">
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

</style>
