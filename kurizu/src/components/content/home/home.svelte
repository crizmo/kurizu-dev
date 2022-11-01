<script>
    const serverWidth = "50px";
    import User from "../../-comp/user.svelte";

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
    <div
        class="mainarea"
        use:swipe={{ timeframe: 500, minSwipeDistance: 0.1 }}
        on:swipe={handler}
    >
        <div class="top-nav">
            <h3 class="channel-name"># Kurizu's Page</h3>
            <div class="vl" />
            <p class="channel-info">Kurizu Home page</p>
            <!-- <span class="open-btn" on:click="{openNav}">&#9776;</span> -->
        </div>
        <hr class="channel-division" />
        <div class="chat-body">
            <div class="chat-body-messages">
                <div class="chat-body-messages-item">
                    <User />
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
                                Oi mate ! I'm <span style="color: aqua;"
                                    >Kurizu</span
                                >
                                and this is my website showcasing my projects and
                                links to my social media accounts ! <br />
                                As you might have already noticed this website looks
                                similar to the discord application and thats what
                                i was aiming for. <br /> <br />
                                It is completely made using
                                <a href="https://svelte.dev/">Svelte</a>
                                ! <br />
                                The site has a lot of unfinished features but we
                                will get there soon ! <br />
                            </p>
                        </div>
                    </div>
                </div>
                <div class="chat-body-messages-item">
                    <User />
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
                                Oh btw ! <br />
                                Click on the respective channels if u want to see
                                some of my projects or just random blogs !
                                <br /> <br />

                                If you want the code for this website here's the
                                link :-
                                <a href="https://github.com/crizmo/kurizu-dev"
                                    >https://github.com/crizmo/kurizu-dev</a
                                > <br /> <br />
                                I hope you like it and if you have any suggestions
                                or feedback feel free to contact me on discord /
                                instagram / github <br />
                                Thank you for checking out my website ! <br />
                                <br />
                                <img
                                    class="msg-img"
                                    src="https://cdn.discordapp.com/attachments/970974282681307187/980030164719263754/green-grass.jpg"
                                    alt="hi"
                                    width="60%"
                                    height="auto"
                                />
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
