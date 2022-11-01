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
            <h3 class="channel-name"># About Me</h3>
            <div class="vl" />
            <p class="channel-info">Little about criz</p>
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
                                Yo ! I'm Kurizu , A curious boi who likes to
                                code ! <br />
                                Im not very good at social interactions , but I'm
                                always up for a chat ! <br />
                                I like drawing, even tho i suck at it. <br />
                                <br />
                                I like to play retro games and watch anime [ Not
                                really ] <br />
                                Been playing around with ascii and pixel art for
                                a while <br /> <br />

                                I enjoy listening to lofi and chill music <br />
                                Heres a playlist of some of my favourites :-
                                <a
                                    href="https://open.spotify.com/playlist/4rO0JccYMK0Y8KqwJXpzHd?si=46f1a2af6bea4cdc"
                                    >Spotify</a
                                >
                            </p>
                            <hr />
                            <p>
                                I am proficient with a lot of programming
                                languages such as HTML/CSS , Javascript , Java ,
                                C , Python, etc <br />
                                Primarily, I use JS as my main language and I am
                                familiar with technologies such as Node.js, React,
                                Svelte and also with database technologies such as
                                MongoDB, etc.
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
                                Hi again ! <br />
                                If you want to check out some of my projects click
                                on the channels respectively <br /> <br />
                                Thanks for checking out my page ! <br /> <br />
                                <img
                                    class="msg-img"
                                    src="https://images.hdqwalls.com/download/child-of-earth-on-journey-5t-2560x1440.jpg"
                                    alt="homepgimg"
                                    height="300px"
                                    width="auto"
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
