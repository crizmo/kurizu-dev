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

    const uncheck = "fas fa-solid fa-square";
    const check = "fas fa-solid fa-check";

    import { quintOut } from "svelte/easing";
	import { crossfade } from "svelte/transition";
	import { flip } from "svelte/animate";

	const [send, receive] = crossfade({
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === "none" ? "" : style.transform;
			
			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
					`,
				};
			},
		});
		let todos;
		
		if(document.cookie) {
			todos = JSON.parse(document.cookie.split('=')[1].split(';')[0]);
		} else {
			todos = [
				{ id: 1, done: false, description: "Responsive Design" },
				{ id: 2, done: false, description: "Anyanime -> Vercel" },
				{ id: 3, done: false, description: "SS Redo UI" },
                { id: 4, done: false, description: "AnyAnime gif [ + ]" },
                { id: 5, done: false, description: "DiscordCards Optimize" },
                { id: 6, done: false, description: "Image2URL MP4 Support" },
                { id: 7, done: true, description: "Breeze -> Discord Cards" },
			];
		}
		
		const setCookie = (cookiename, cookievalue, time) => {
			let date = new Date();
			date.setTime(date.getTime() * Number(time) * 36000 * 1000);
			document.cookie = `${cookiename}=${cookievalue};path=/;expires=${date.toUTCString()};SameSite=None;Secure`;
		};

		const saveState = () => {
			let todosString = JSON.stringify(todos);
			setCookie('info',todosString,99999);
		};

	let uid = todos.length + 1;

	function add(input) {
		const todo = {
			id: uid++,
			done: false,
			description: input.value,
		};

		if (todo.description) {
			todos = [todo, ...todos];
			input.value = "";
		} else {
			alert("Please enter a todo");
		}

		if (todo.description.length > 25) {
			todo.description = todo.description.slice(0, 25) + "...";
		} else {
			todo.description = todo.description;
		}
		saveState();
	}

	function remove(todo) {
		todos = todos.filter((t) => t !== todo);
		saveState();
	}
    
</script>

<main>
    <script src="https://kit.fontawesome.com/8dc570c5d4.js" crossorigin="anonymous"></script>
    <div class="mainarea" use:swipe={{ timeframe: 500, minSwipeDistance: 0.1 }} on:swipe={handler}>
        <div class="top-nav">
            <h3 class="channel-name"># ToDo</h3>
            <div class="vl" />
            <p class="channel-info">Stuff i plan on doing someday lol</p>
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
                            <h3>Plans / To-do List</h3>
                            <div class="board">
                                <input
                                    class="todo-input"
                                    placeholder="Any Plans ?"
                                    on:keydown={(event) => event.key === "Enter" && add(event.target)}
                                />
                        
                                <div class="left">
                                    <h2 class="todo-h2">Todo</h2>
                                    {#each todos.filter((t) => !t.done) as todo (todo.id)}
                                        <label
                                            in:receive={{ key: todo.id }}
                                            out:send={{ key: todo.id }}
                                            animate:flip
                                            class="label-todo"
                                        >
                                            <input type="checkbox" bind:checked={todo.done} />
                                            {todo.description}
                                            <button class="btn-todo" on:click={() => remove(todo)}>x</button>
                                        </label>
                                    {/each}
                                </div>
                        
                                <div class="right">
                                    <h2 class="todo-h2">Done</h2>
                                    {#each todos.filter((t) => t.done) as todo (todo.id)}
                                        <label
                                            in:receive={{ key: todo.id }}
                                            out:send={{ key: todo.id }}
                                            animate:flip
                                            class="label-todo"
                                        >
                                            <input type="checkbox" bind:checked={todo.done} />
                                            {todo.description}
                                            <button class="btn-todo" on:click={() => remove(todo)}>x</button>
                                        </label>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>

    /* main a {
        color: #38b9ec;
    } */

    .todo-input {
		font-size: 1em;
		width: 100%;
		margin: 2em 0 1em 0;
	}

	.board {
		max-width: 36em;
		margin: 0 auto;
	}

	.left,
	.right {
		float: left;
		width: 50%;
		padding: 0 1em 0 0;
		box-sizing: border-box;
	}

	.todo-h2 {
		font-size: 2em;
		font-weight: 200;
		user-select: none;
	}

	.label-todo {
		top: 0;
		left: 0;
		display: block;
		font-size: 1em;
		line-height: 1;
		padding: 0.5em;
		margin: 0 auto 0.5em auto;
		border-radius: 2px;
		background-color: rgb(255, 255, 255);
		user-select: none;
		color: black;
		text-align: left;
	}

	.todo-input {
		margin: 0;
	}

	.right .label-todo {
		background-color: rgb(180, 240, 100);
	}

	.btn-todo {
		float: right;
		height: 1em;
		box-sizing: border-box;
		padding: 0 0.5em;
		line-height: 1;
		background-color: transparent;
		border: none;
		color: rgb(170, 30, 30);
		opacity: 0;
		transition: opacity 0.2s;
	}

	.label-todo:hover .btn-todo {
		opacity: 1;
	}

</style>