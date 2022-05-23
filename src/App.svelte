<script>
	import {Route} from 'tinro'; 

	import Sidebar from './components/sidebar/sidebar.svelte';

	import AllPro from './components/content/projects/all-pro.svelte';
	import AllOth from './components/content/other/all-oth.svelte';

	import Channels from './components/channels/channels.svelte';
	import HomeCn from './components/channels/home/home-cn.svelte';
	import AboutCn from './components/channels/home/about-cn.svelte';

	import Home from './components/content/home/home.svelte';
	import About from './components/content/home/about.svelte';

</script>

<main>
	<Sidebar/>
	<!-- <Sidebar serimg = {"https://cdn.discordapp.com/avatars/784141856426033233/2b71440eb154c1c2897e956f1f0da7b7.webp"} /> -->
	
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
	<AllPro />

	<!-- Other -->
	<AllOth />
</main>

<style>
</style>