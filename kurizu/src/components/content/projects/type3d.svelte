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
            <h3 class="channel-name"># Type3D</h3>
            <div class="vl" />
            <p class="channel-info">3D Live input Keyboard</p>
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
                                Type3D is project where i used the 60% keyboard design made by schwiiiii - link to his code -> <a href="https://codepen.io/schwiiiii/pen/BarVMxq">https://codepen.io/schwiiiii/pen/BarVMxq</a> <br>
                                I then added live keyboard input and movements to the keys and the overall keyboard<br>
                                <br>
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/1014118117493985350/1014118195679993937/type-3d.png" alt="homepgimg" height="300px" width="auto" style="border-radius: 10px;"> <br>
                                <br>
                                You can find the code here -> <a href="https://github.com/crizmo/Type-3d">https://github.com/crizmo/Type-3d</a> <br>
                                Feel free to use the code for your own projects <br>
                                <br>
                                If you want to contribute to the project, feel free to make a pull request <br>
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
                                Type3D project links : <br>
                                <a href="https://github.com/crizmo/Type-3d">Github</a> <br>
                                <a href="https://crizmo.github.io/Type-3d/key.html">Website</a> <br>
                                <a href="https://type-3d.kurizu.repl.co/">Replit</a> <br>
                                <br>
                                Thank you for checking out ! <br>
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
