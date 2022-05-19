<script>
	import {Route} from 'tinro'; 

	import Sidebar from './components/sidebar/sidebar.svelte';

	import Channels from './components/channels/channels.svelte';
	import HomeCn from './components/channels/home/home-cn.svelte';
	import AboutCn from './components/channels/home/about-cn.svelte';

	import Home from './components/content/home/home.svelte';
	import About from './components/content/home/about.svelte';

	import Anyanime from './components/content/projects/anyanime.svelte'
</script>

<main>
	<Sidebar/>
	
	<!-- Home -->
	<Route path="/">
		<HomeCn/>
		<!-- <Channels/> -->
		<Home/>
	</Route>
	
	<Route path="/about">
		<AboutCn/>
		<!-- <Channels /> -->
		<About/>
	</Route>

	<!-- Projects -->
	<Route path="/anyanime">
		<!-- <AnyanimeCn /> -->
		<Anyanime />
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