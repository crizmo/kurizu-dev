<script>
	import {Route} from 'tinro'; 

	import Sidebar from './components/sidebar/sidebar.svelte';
	import Channels from './components/channels/channels.svelte';

	import Home from './components/content/home/home.svelte';
	import About from './components/content/home/about.svelte';
</script>

<main>
	<Sidebar/>
	<Channels/>

	<Route path="/">
		<Home/>
	</Route>
	
	<Route path="/about">
		<About/>
	</Route>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>