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
            <h3 class="channel-name"># Pixit</h3>
            <div class="vl" />
            <p class="channel-info">Pixel art website</p>
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


</style>
