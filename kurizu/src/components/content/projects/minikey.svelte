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
            <h3 class="channel-name"># Minikey</h3>
            <div class="vl" />
            <p class="channel-info">Compact Keryboard Design</p>
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
                                Minikey is a Compact Keyboard design with live user input made using svelte.
                                Check it out if u want : <a href="https://mini-key.kurizu.repl.co/">https://mini-key.kurizu.repl.co/</a>
                                <br><br>
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/1003176063666491452/1003238076950249523/minikey.png" alt="homepgimg" height="300px" width="auto" style="border-radius: 10px;"> <br>
                                <br>
                                This is the base design of Minikey. <br>
                                I plan on adding a 3d key look to the keyboard in the near future as well as a rgb effect <br>
                                If you want to help me do it feel free to join me on the <a href="https://github.com/crizmo/Mini-Key">repo</a> <br>
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
                                Minikey project links : <br>
                                <a href="https://github.com/crizmo/Mini-Key">Github</a> <br>
                                <a href="https://replit.com/@kurizu/Mini-Key?v=1">Replit</a> <br>
                                <a href="https://mini-key.kurizu.repl.co/">Website</a> <br>
                                <br>
                                Thank you for checking out Minikey! <br>
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
