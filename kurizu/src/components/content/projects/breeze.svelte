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
                                Breeze helps you display your discord activity as a epik card which you can use anywhere you want.
                                <br><br>
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/988140784807202886/992759894627340298/breeze-stats.png" alt="homepgimg" height="300px" width="auto" style="border-radius: 10px;"> <br>
                                <img class="msg-img" src="https://breeze-api.kurizu.repl.co/api/card/784141856426033233?about=Exploring&banner=https://staticg.sportskeeda.com/editor/2022/10/72d24-16655552144135-1920.jpg" alt="api"/>
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
                                API: <a href="https://breeze-api.kurizu.repl.co/" alt="breeze api" target="_blank">Breeze API</a> <br>
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

</style>
