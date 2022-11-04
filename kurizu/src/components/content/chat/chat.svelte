<script>
    const serverWidth = "50px";
    import User from "../../-comp/user.svelte";

    import { closeNav, openNav } from "../../channels/home/home-cn.svelte";

    import { swipe } from "svelte-gestures";
    let direction;

    function handler(event) {
        direction = event.detail.direction;

        if (window.innerWidth < 2000) {
            if (direction == "left" && document.querySelector(".categories").style.opacity != "0") {
                closeNav();
            }
        }
    }

    import io from "socket.io-client";

    const socket = io("https://kurchat.kurizu.repl.co");

    let messages = [];
    let message = "";
    let username = "";
    let userpfp = "";

    let isSet = false;

    function scrollToBottom() {
        const el = document.querySelector(".chat-body");
        el.scrollTop = el.scrollHeight;
    }

    socket.on("chat message", (user, userpfp, msg) => {
        let info = [user, userpfp, msg];
        messages = [...messages, info];
        // console.log(messages);
        setTimeout(() => {
            scrollToBottom();
        }, 10);
    });

    socket.on('previous messages', (msgs) => {
        messages = msgs;
        setTimeout(() => {
            scrollToBottom();
        }, 10);
    });

    import { fly } from 'svelte/transition';
	
	let emojiSets = [
		{ type: "faces", minVal:128512, maxVal: 128580 },
		{ type: "faces2", minVal:129296, maxVal: 129327},
		{ type: "body", minVal:128066, maxVal: 128080},
		{ type: "animals", minVal:129408, maxVal: 129442},
		{ type: "transport", minVal:128640, maxVal: 128676},
		{ type: "misc", minVal:129494, maxVal: 129535},
			
	];
	
	let selectedSet = 0;
	$: min = emojiSets[selectedSet].minVal;
	$: max = emojiSets[selectedSet].maxVal;
	let emojis = [];
	
	$: for (let i = min; i <= max; i++) {
		emojis = [...emojis, String.fromCodePoint(i)]
	}
	
	const clearEmojiMenu = () => emojis = []; 
	
	const chooseEmojiSet = (e) => {	
		selectedSet = Number(e.target.dataset.id);
		clearEmojiMenu()
	}

	let setIcons = [128512, 129313, 128074, 129417, 128664, 129504]
	let emojiIcon = String.fromCodePoint(128571);
	let modalOpen = false;
	let textBox; // for bind:this
	const addEmoji = (e) => {
		message += e.target.textContent
	}

    function sendMessage() {
        if (!isSet) {
            alert("Please set a username");
            message = "";
            return;
        }
        let user = document.getElementById("username").value;

        let userpfp = document.getElementById("userpfp").value;
        if (userpfp == "") {
            userpfp =
                "https://theserialbinger.com/wp-content/uploads/2022/06/Anya-1024x1024.jpg";
        }
    
        if (message == "") {
            alert("Please enter a message");
        } else if (message.match(/^[ ]/)) {
            alert("Please enter a valid message");
            message = "";
        } else {

            socket.emit("chat message", user, userpfp, message);
            // console.log(`The message: (${message}) has been sent.`);	
            textBox.value = "";
            message = "";
            modalOpen = false;
        }
    }

    function setInfo() {
        if (username != "") {
            let userdiv = document.querySelector(".userinfo-input");
            userdiv.style.opacity = 0;
            userdiv.style.display = "none";
            isSet = true;

        } else {
            alert("Please enter a username");
        }
    }

    setTimeout(() => {
        document
            .querySelector(".chat-input-text")
            .addEventListener("keydown", (e) => {
                if (e.key == "Enter") {
                    sendMessage();
                }
            });
    }, 1000);

</script>

<main>
    <script
        src="https://kit.fontawesome.com/8dc570c5d4.js"
        crossorigin="anonymous"
    ></script>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <div
        class="mainarea"
        use:swipe={{ timeframe: 500, minSwipeDistance: 0.5 }}
        on:swipe={handler}
    >
        <div class="top-nav">
            <h3 class="channel-name "># Chatting</h3>
            <div class="vl" />
            <p class="channel-info">Poggies</p>
        </div>
        <hr />
        <div class="chat-body">
            <div class="chat-body-messages">
                {#each messages as msgObject}
                    <div class="chat-body-messages-item">
                        <User pfp={msgObject[1]} alt="userpfp" />
                        <div class="chat-body-messages-item-content">
                            <div class="chat-body-messages-item-content-header">
                                <h3
                                    class="chat-body-messages-item-content-header-name"
                                >
                                    <p>{msgObject[0]}</p>
                                </h3>
                            </div>
                            <div class="chat-body-messages-item-content-body">
                                <p>{msgObject[2]}</p>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
            <div class="userinfo-input">
                <input
                    class="userinfo-input-username"
                    id="username"
                    type="text"
                    placeholder="Username"
                    bind:value={username}
                    maxlength="15"
                />
                <input
                    class="userinfo-input-pfp"
                    id="userpfp"
                    type="text"
                    placeholder="User PFP"
                    bind:value={userpfp}
                />
                <button
                    on:click={setInfo}
                    class="userinfo-input-button fa fa-check"
                />
            </div>
            <div class="chat-input" id="btn-emoji-icon-cont">
                <input
                    type="text"
                    class="chat-input-text"
                    placeholder="Type a message"
                    bind:this={textBox}
                    bind:value={message}
                    maxlength="50"
                />
                <!-- add a button to send emotes with emoji as screen -->
                <div class="chat-input-emotes" id="emoji-opener-icon" on:click={() => modalOpen = true}>{emojiIcon}</div>
                <button
                    class="chat-input-send fas fa-paper-plane"
                    on:click={sendMessage}
                />
            </div>
            {#if isSet}
                {#if modalOpen}
                    <div id="emoji-cont" transition:fly={{ y: -30 }}>
                        <header>
                            {#each setIcons as icon, i}
                                <div data-id={i} on:click={chooseEmojiSet}>{String.fromCodePoint(icon)}</div>		
                            {/each}
                                <div id="closer-icon" on:click={() => modalOpen = false}>X</div>
                        </header>

                        {#each emojis as emoji}
                            <span on:click={addEmoji}>{emoji}</span>
                        {/each}
                    </div>
                {/if}
            {/if}   
        </div>
    </div>
</main>

<style>
    ::-webkit-scrollbar {
        width: 0px;
    }

    ::-webkit-scrollbar-thumb {
        background: #888;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    .mainarea {
        position: absolute;
        width: 95.5%;
        height: 100%;
        margin-left: 4%;
        background-color: #282a2e;
        top: 0%;
        color: rgb(255, 255, 255);
        z-index: 2;
        overflow: scroll;
    }

    .vl {
        border-left: 2px solid gray;
        height: 25px;
        position: fixed;
        left: 15%;
        top: 2%;
    }

    .channel-name {
        top: 0%;
        left: 7%;
        position: fixed;
    }

    .channel-info {
        position: fixed;
        top: 0.5%;
        left: 18%;
    }

    .chat-body {
        position: absolute;
        width: 100%;
        height: 87%;
        background-color: #36393f;
        top: 6.2%;
        color: rgb(255, 255, 255);
        z-index: 1;
        overflow: scroll;
    }

    .userinfo-input {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 85%;
        height: 50px;
        border-radius: 5px;
        top: 85%;
        position: fixed;
        margin-left: 3%;
        z-index: 3;
    }
    
    .userinfo-input-username {
        width: 40%;
        height: 100%;
        border: none;
        border-radius: 5px;
        background-color: #212225;
        color: #fff;
        font-size: 1rem;
        outline: none;
        border: #7289da 1px solid;
    }

    .userinfo-input-pfp {
        width: 55%;
        height: 100%;
        border: none;
        border-radius: 5px;
        background-color: #212225;
        color: #fff;
        font-size: 1rem;
        outline: none;
        border: #7289da 1px solid;
    }

    .userinfo-input-button {
        width: 5%;
        height: 100%;
        border: none;
        border-radius: 5px;
        background-color: #7289da;
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
        outline: none;
    }

    .chat-input {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 94.5%;
        height: 50px;
        background-color: #2f3136;
        border-radius: 5px;
        top: 94%;
        position: fixed;
        margin-left: 0.5%;
        /* overflow: scroll; */
    }

    .chat-input-text {
        width: 95%;
        height: 100%;
        border: none;
        border-radius: 5px;
        background-color: #36393f;
        color: #fff;
        font-size: 1rem;
        outline: none;
    }

    .chat-input-send {
        width: 5%;
        height: 100%;
        border: none;
        border-radius: 5px;
        background-color: #7289da;
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
        outline: none;
    }

    .chat-input-send:hover,
    .userinfo-input-button:hover {
        color: rgb(251, 255, 0);
        background-color: #5f73bc;
        transition: all 0.2s ease-in-out;
    }

    #btn-emoji-icon-cont {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

    #emoji-opener-icon {
		font-size: 1.5rem;
		cursor: pointer;
		transition: all .1s;
        position: fixed;
        z-index: 1;
        left: 92%;
        top: 94.5%;
	}
	
	#emoji-opener-icon:active {
        font-size: 2.3rem;
		transform: rotate(10deg);
		cursor: pointer;
	}
	
	#emoji-cont {
        left: 80%;
        top: 65%;
		max-width: 300px;
		max-height: 248px;
		overflow: scroll;
		display: flex;
        position: fixed;
		flex-wrap: wrap;
		justify-content: flex-start;
		border: 1px solid #282a2e;
		background: transparent;
	}

    #closer-icon {
		font-size: 1.5rem;
		font-weight: bold;
		text-align: right;
	}

    #emoji-cont header {
		width: 98%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		border: 1px solid gray;
	}
	
	#emoji-cont header div {
		cursor: pointer;
	}

    span {
		font-size: 1.5rem;
		padding: .3rem;
		border: 1px solid gray;
		background: transparent;
		cursor: pointer;
	}
	
	span:active {
		background: transparent;
	}

    @media screen and (max-height: 900px){
        #emoji-cont {
            top: 55%;
        }
    }

    @media screen and (max-height: 700px){
        #emoji-cont {
            top: 40%;
        }
    }

    @media screen and (max-width: 800px) {
        .mainarea {
            position: absolute;
            width: 85%;
            height: 100%;
            /* text-align: left; */
            margin-left: 12%;
            background-color: #282a2e;
            top: 0%;
            color: rgb(255, 255, 255);
            z-index: 0;
            overflow: fixed;
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

        .userinfo-input {
            width: 88%;
            height: 40px;
            top: 88%;
            margin-left: 2%;
        }

        .userinfo-input-username {
            width: 30%;
            font-size: 0.8rem;
            border: #7289da 1px solid;
        }

        .userinfo-input-pfp {
            width: 40%;
            font-size: 0.8rem;
            border: #7289da 1px solid;
        }

        .userinfo-input-button {
            width: 30%;
            font-size: 0.8rem;
            margin-right: 20px;
        }

        .chat-input {
            width: 88%;
            height: 45px;
            top: 94%;
            margin-left: 2%;
        }

        .chat-input-text {
            width: 90%;
            font-size: 0.8rem;
        }

        .chat-input-send {
            width: 20%;
            font-size: 0.8rem;
            margin-right: 20px;
        }

        #emoji-opener-icon {
            font-size: 1.5rem;
            left: 75%;
            top: 94.5%;
        }
        
        #emoji-cont {
            left: 50%;
            top: 60%;
            max-width: 300px;
            max-height: 248px;
        }
    
    }

    @media screen and (max-width: 800px) and (max-height: 800px) {
        #emoji-cont {
            top: 50%;
        }
    }
</style>
